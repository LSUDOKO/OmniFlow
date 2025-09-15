import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'react-hot-toast';
import { Connection, PublicKey } from '@solana/web3.js';

export interface BridgeTransaction {
  id: string;
  sourceChain: string;
  destinationChain: string;
  token: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  sourceHash?: string;
  destinationHash?: string;
  vaaBytes?: Uint8Array;
  timestamp: number;
  estimatedTime: number;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  gasCostWei: string;
  gasCostEth: string;
  gasCostUsd: string;
}

// Wormhole contract addresses (Mainnet)
const WORMHOLE_CONTRACTS = {
  ethereum: {
    core: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
    tokenBridge: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
  },
  polygon: {
    core: '0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7',
    tokenBridge: '0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE',
  },
  bsc: {
    core: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
    tokenBridge: '0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7',
  },
  solana: {
    core: 'worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth',
    tokenBridge: 'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb',
  },
};

export const useProductionBridge = () => {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Wallet integration
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Real gas estimation
  const estimateGasFee = useCallback(async (
    sourceChain: string,
    tokenAddress: string,
    amount: string
  ): Promise<GasEstimate> => {
    if (!publicClient || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      const erc20Abi = [
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function balanceOf(address account) external view returns (uint256)',
        'function allowance(address owner, address spender) external view returns (uint256)'
      ];

      const bridgeContract = WORMHOLE_CONTRACTS[sourceChain as keyof typeof WORMHOLE_CONTRACTS]?.tokenBridge;
      if (!bridgeContract) {
        throw new Error(`Bridge contract not found for ${sourceChain}`);
      }

      // Estimate approve transaction gas
      const approveGas = await publicClient.estimateContractGas({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [bridgeContract, parseUnits(amount, 18)],
        account: address
      });

      // Estimate bridge transaction gas
      const wormholeAbi = [
        'function transferTokens(address token, uint256 amount, uint16 recipientChain, bytes32 recipient, uint256 arbiterFee, uint32 nonce) external payable returns (uint64 sequence)'
      ];

      const bridgeGas = await publicClient.estimateContractGas({
        address: bridgeContract as `0x${string}`,
        abi: wormholeAbi,
        functionName: 'transferTokens',
        args: [
          tokenAddress,
          parseUnits(amount, 18),
          1, // Solana chain ID
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          0,
          1
        ],
        account: address,
        value: parseUnits('0.01', 18)
      });

      const gasPrice = await publicClient.getGasPrice();
      const totalGas = approveGas + bridgeGas;
      const gasCost = totalGas * gasPrice;

      return {
        gasLimit: totalGas.toString(),
        gasPrice: gasPrice.toString(),
        gasCostWei: gasCost.toString(),
        gasCostEth: formatUnits(gasCost, 18),
        gasCostUsd: (parseFloat(formatUnits(gasCost, 18)) * 2000).toFixed(2)
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      throw new Error('Failed to estimate gas fees');
    }
  }, [publicClient, address]);

  // Handle ERC20 token approval
  const handleTokenApproval = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<string | null> => {
    if (!walletClient || !address || !publicClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const erc20Abi = [
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function allowance(address owner, address spender) external view returns (uint256)'
      ];

      // Check current allowance
      const allowance = await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, spenderAddress]
      } as any) as bigint;

      const requiredAmount = parseUnits(amount, 18);
      
      if ((allowance as bigint) < requiredAmount) {
        toast.loading('Approving token spend...', { id: 'approval' });
        
        // Request approval
        const hash = await walletClient.writeContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spenderAddress, requiredAmount],
          account: walletClient.account,
          chain: undefined
        });

        // Wait for approval transaction
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success('Token approval confirmed!', { id: 'approval' });
        
        return hash;
      }
      
      return null; // Already approved
    } catch (error: any) {
      toast.error('Token approval failed', { id: 'approval' });
      throw error;
    }
  }, [walletClient, publicClient, address]);

  // Execute Wormhole bridge transaction
  const executeBridgeTransaction = useCallback(async (
    sourceChain: string,
    destinationChain: string,
    tokenAddress: string,
    amount: string,
    recipientAddress: string
  ): Promise<BridgeTransaction> => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    
    try {
      toast.loading('Initiating bridge transaction...', { id: 'bridge' });
      
      // Step 1: Estimate gas fees
      const gasEstimate = await estimateGasFee(sourceChain, tokenAddress, amount);
      console.log('Gas estimate:', gasEstimate);
      
      // Step 2: Handle token approval
      const bridgeContract = WORMHOLE_CONTRACTS[sourceChain as keyof typeof WORMHOLE_CONTRACTS]?.tokenBridge;
      if (!bridgeContract) {
        throw new Error(`Bridge contract not found for ${sourceChain}`);
      }
      
      await handleTokenApproval(tokenAddress, bridgeContract, amount);
      
      // Step 3: Execute bridge transaction
      const wormholeAbi = [
        'function transferTokens(address token, uint256 amount, uint16 recipientChain, bytes32 recipient, uint256 arbiterFee, uint32 nonce) external payable returns (uint64 sequence)'
      ];
      
      // Convert recipient address to bytes32 format
      const recipientBytes32 = destinationChain === 'solana' 
        ? `0x${Buffer.from(new PublicKey(recipientAddress).toBytes()).toString('hex').padStart(64, '0')}`
        : `0x${recipientAddress.slice(2).padStart(64, '0')}`;
      
      // Chain IDs for Wormhole
      const chainIds: Record<string, number> = {
        ethereum: 2,
        solana: 1,
        polygon: 5,
        bsc: 4
      };
      
      const recipientChain = chainIds[destinationChain];
      if (!recipientChain) {
        throw new Error(`Unsupported destination chain: ${destinationChain}`);
      }
      
      // Execute bridge transaction
      const hash = await walletClient.writeContract({
        address: bridgeContract as `0x${string}`,
        abi: wormholeAbi,
        functionName: 'transferTokens',
        args: [
          tokenAddress,
          parseUnits(amount, 18),
          recipientChain,
          recipientBytes32,
          0, // arbiter fee
          Math.floor(Math.random() * 1000000) // nonce
        ],
        value: parseUnits('0.01', 18), // Wormhole fee
        account: walletClient.account,
        chain: undefined
      });
      
      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      toast.success('Bridge transaction submitted!', { id: 'bridge' });
      
      // Create transaction record
      const transactionId = `wh-${Date.now()}-${hash.slice(2, 10)}`;
      const transaction: BridgeTransaction = {
        id: transactionId,
        sourceChain,
        destinationChain,
        token: tokenAddress,
        amount,
        status: 'pending',
        sourceHash: hash,
        timestamp: Date.now(),
        estimatedTime: 300000, // 5 minutes
      };
      
      // Add to transactions list
      setTransactions(prev => [transaction, ...prev]);
      
      // Start monitoring for VAA
      monitorBridgeCompletion(transaction, receipt);
      
      return transaction;
      
    } catch (error: any) {
      toast.error(`Bridge failed: ${error.message}`, { id: 'bridge' });
      console.error('Bridge transaction failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, walletClient, publicClient, estimateGasFee, handleTokenApproval]);

  // Monitor bridge completion with real VAA polling
  const monitorBridgeCompletion = useCallback(async (
    transaction: BridgeTransaction,
    receipt: any
  ) => {
    try {
      // Parse sequence from transaction logs
      const logTopic = '0x6eb224fb001ed210e379b335e35efe88672a8ce935d981a6896b27ffdf52a3b2';
      const sequenceLog = receipt.logs.find((log: any) => log.topics[0] === logTopic);
      
      if (!sequenceLog) {
        console.error('Sequence not found in transaction logs');
        return;
      }

      const sequence = parseInt(sequenceLog.data.slice(2), 16);
      
      // Poll Wormhole Guardian API for VAA
      const pollForVAA = async (retryCount = 0): Promise<void> => {
        if (retryCount > 20) { // Max 20 retries (10 minutes)
          setTransactions(prev => 
            prev.map(tx => 
              tx.id === transaction.id 
                ? { ...tx, status: 'failed' as const }
                : tx
            )
          );
          toast.error('Bridge transaction timed out');
          return;
        }

        try {
          const chainId = transaction.sourceChain === 'ethereum' ? 2 : 
                          transaction.sourceChain === 'polygon' ? 5 : 
                          transaction.sourceChain === 'bsc' ? 4 : 2;
          
          const emitterAddress = WORMHOLE_CONTRACTS[transaction.sourceChain as keyof typeof WORMHOLE_CONTRACTS]?.tokenBridge;
          const guardianUrl = `https://wormhole-v2-mainnet-api.certus.one/v1/signed_vaa/${chainId}/${emitterAddress}/${sequence}`;
          
          const response = await fetch(guardianUrl);
          
          if (response.ok) {
            const vaaData = await response.json();
            
            // Update transaction with VAA
            setTransactions(prev => 
              prev.map(tx => 
                tx.id === transaction.id 
                  ? { 
                      ...tx, 
                      status: 'completed' as const,
                      vaaBytes: new Uint8Array(Buffer.from(vaaData.vaaBytes, 'base64'))
                    }
                  : tx
              )
            );
            
            toast.success('Bridge completed successfully!');
            return;
          }
        } catch (error) {
          console.log(`VAA polling attempt ${retryCount + 1} failed, retrying...`);
        }
        
        // Retry after 30 seconds
        setTimeout(() => pollForVAA(retryCount + 1), 30000);
      };
      
      // Start polling after 2 minutes (typical finality time)
      setTimeout(() => pollForVAA(), 120000);
      
    } catch (error) {
      console.error('Error monitoring bridge completion:', error);
    }
  }, []);

  // Check token balance
  const checkTokenBalance = useCallback(async (
    tokenAddress: string,
    userAddress?: string
  ): Promise<string> => {
    if (!publicClient) {
      throw new Error('Public client not available');
    }

    const targetAddress = userAddress || address;
    if (!targetAddress) {
      throw new Error('No address provided');
    }

    try {
      const erc20Abi = [
        'function balanceOf(address account) external view returns (uint256)',
        'function decimals() external view returns (uint8)'
      ];

      const [balance, decimals] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [targetAddress]
        } as any),
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'decimals',
          args: []
        } as any)
      ]);

      return formatUnits(balance as bigint, decimals as number);
    } catch (error) {
      console.error('Failed to check token balance:', error);
      throw error;
    }
  }, [publicClient, address]);

  // Get supported bridge routes
  const getSupportedRoutes = useCallback(() => {
    return [
      {
        sourceChain: 'ethereum',
        destinationChain: 'solana',
        protocol: 'wormhole',
        fee: '~$15.00',
        estimatedTime: '~5 minutes',
        supported: true,
      },
      {
        sourceChain: 'solana',
        destinationChain: 'ethereum',
        protocol: 'wormhole',
        fee: '~$0.02',
        estimatedTime: '~7 minutes',
        supported: true,
      },
      {
        sourceChain: 'polygon',
        destinationChain: 'solana',
        protocol: 'wormhole',
        fee: '~$0.05',
        estimatedTime: '~3 minutes',
        supported: true,
      },
      {
        sourceChain: 'solana',
        destinationChain: 'polygon',
        protocol: 'wormhole',
        fee: '~$0.01',
        estimatedTime: '~5 minutes',
        supported: true,
      },
      {
        sourceChain: 'bsc',
        destinationChain: 'solana',
        protocol: 'wormhole',
        fee: '~$0.10',
        estimatedTime: '~4 minutes',
        supported: true,
      },
      {
        sourceChain: 'solana',
        destinationChain: 'bsc',
        protocol: 'wormhole',
        fee: '~$0.01',
        estimatedTime: '~6 minutes',
        supported: true,
      },
    ];
  }, []);

  return {
    // State
    transactions,
    isLoading,
    isConnected,
    address,
    
    // Functions
    estimateGasFee,
    handleTokenApproval,
    executeBridgeTransaction,
    checkTokenBalance,
    getSupportedRoutes,
    monitorBridgeCompletion,
  };
};
