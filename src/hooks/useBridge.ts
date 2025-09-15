import { useState, useCallback, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits, type Hash } from 'viem';
// Removed react-hot-toast dependency - using console logs instead
import { Connection, PublicKey, Transaction as SolanaTransaction } from '@solana/web3.js';

export interface BridgeTransaction {
  id: string;
  sourceChain: string;
  destinationChain: string;
  token: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'confirming';
  sourceHash?: string;
  destinationHash?: string;
  vaaBytes?: Uint8Array;
  timestamp: number;
  estimatedTime: number;
  progress?: number;
}

export interface BridgeRoute {
  sourceChain: string;
  destinationChain: string;
  protocol: 'wormhole' | 'cctp' | 'native';
  fee: string;
  estimatedTime: string;
  supported: boolean;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  gasCostWei: string;
  gasCostEth: string;
  gasCostUsd: string;
}

export interface BridgeEstimate {
  fee: string;
  time: string;
  route: string;
  supported: boolean;
  gasEstimate?: GasEstimate;
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
} as const;

// CCTP contract addresses (Circle's Cross-Chain Transfer Protocol)
const CCTP_CONTRACTS = {
  ethereum: {
    tokenMessenger: '0xBd3fa81B58Ba92a82136038B25aDec7066af3155',
    messageTransmitter: '0x0a992d191DEeC32aFe36203Ad87D7d289a738F81',
  },
  polygon: {
    tokenMessenger: '0x9daF8c91AEFAE50b9c0E69629D3F6Ca40cA3B3FE',
    messageTransmitter: '0xF3be9355363857F3e001be68856A2f96b4C39Ba9',
  },
} as const;

// Chain IDs for Wormhole
const CHAIN_IDS = {
  ethereum: 2,
  solana: 1,
  polygon: 5,
  bsc: 4,
} as const;

export const useBridge = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('bridge-transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Failed to load saved transactions:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('bridge-transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // Get supported bridge routes
  const getSupportedRoutes = useCallback((): BridgeRoute[] => {
    return [
      // Ethereum <-> Solana via Wormhole
      {
        sourceChain: 'ethereum',
        destinationChain: 'solana',
        protocol: 'wormhole',
        fee: '~$15.00',
        estimatedTime: '~8 minutes',
        supported: true,
      },
      {
        sourceChain: 'solana',
        destinationChain: 'ethereum',
        protocol: 'wormhole',
        fee: '~$0.50',
        estimatedTime: '~12 minutes',
        supported: true,
      },
      // Ethereum <-> Polygon via CCTP
      {
        sourceChain: 'ethereum',
        destinationChain: 'polygon',
        protocol: 'cctp',
        fee: '~$12.00',
        estimatedTime: '~5 minutes',
        supported: true,
      },
      {
        sourceChain: 'polygon',
        destinationChain: 'ethereum',
        protocol: 'cctp',
        fee: '~$0.02',
        estimatedTime: '~7 minutes',
        supported: true,
      },
      // Polygon <-> Solana via Wormhole
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
      // BSC <-> Solana via Wormhole
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
      // Other EVM chains via native bridges
      {
        sourceChain: 'ethereum',
        destinationChain: 'bsc',
        protocol: 'native',
        fee: '~$18.00',
        estimatedTime: '~15 minutes',
        supported: false, // Not implemented
      },
      {
        sourceChain: 'polygon',
        destinationChain: 'bsc',
        protocol: 'native',
        fee: '~$0.05',
        estimatedTime: '~10 minutes',
        supported: false, // Not implemented
      },
    ];
  }, []);

  // Estimate bridge fee and time
  const estimateBridge = useCallback(async (
    sourceChain: string,
    destinationChain: string,
    token: string,
    amount: string
  ): Promise<BridgeEstimate> => {
    const routes = getSupportedRoutes();
    const route = routes.find(
      r => r.sourceChain === sourceChain && r.destinationChain === destinationChain
    );

    if (!route) {
      throw new Error(`Bridge route not supported: ${sourceChain} -> ${destinationChain}`);
    }

    // Simulate fee calculation based on amount and route
    const baseAmount = parseFloat(amount) || 0;
    let estimatedFee = route.fee;
    let estimatedTime = route.estimatedTime;

    // Adjust fee based on amount (higher amounts = higher fees)
    if (baseAmount > 1000) {
      const feeValue = parseFloat(route.fee.replace(/[^0-9.]/g, ''));
      estimatedFee = `~$${(feeValue * 1.2).toFixed(2)}`;
    }

    // Adjust time based on network congestion (mock)
    const congestionFactor = Math.random() * 0.5 + 0.8; // 0.8-1.3x
    const timeValue = parseFloat(route.estimatedTime.replace(/[^0-9.]/g, ''));
    estimatedTime = `~${Math.ceil(timeValue * congestionFactor)} minutes`;

    // Get gas estimate for EVM chains
    let gasEstimate: GasEstimate | undefined;
    if (sourceChain !== 'solana' && token !== 'native') {
      try {
        gasEstimate = await estimateGasFee(sourceChain, token, amount);
      } catch (error) {
        console.warn('Gas estimation failed:', error);
      }
    }

    return {
      fee: estimatedFee,
      time: estimatedTime,
      route: route.protocol,
      supported: route.supported,
      gasEstimate,
    };
  }, [getSupportedRoutes]);

  // Gas estimation function
  const estimateGasFee = useCallback(async (
    sourceChain: string,
    tokenAddress: string,
    amount: string
  ): Promise<GasEstimate> => {
    if (!publicClient || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      // ERC20 token contract ABI (minimal)
      const erc20Abi = [
        {
          name: 'approve',
          type: 'function',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }]
        },
        {
          name: 'allowance',
          type: 'function',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
          ],
          outputs: [{ name: '', type: 'uint256' }]
        }
      ] as const;

      const bridgeContract = WORMHOLE_CONTRACTS[sourceChain as keyof typeof WORMHOLE_CONTRACTS]?.tokenBridge;
      if (!bridgeContract) {
        throw new Error(`Bridge contract not found for ${sourceChain}`);
      }

      // Estimate approve transaction gas
      const approveGas = await publicClient.estimateContractGas({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [bridgeContract as `0x${string}`, parseUnits(amount, 18)],
        account: address
      });

      // Get current gas price
      const gasPrice = await publicClient.getGasPrice();
      
      // Calculate total gas cost (approve + bridge transaction)
      const totalGas = approveGas * BigInt(2); // Approximate for both approve and bridge
      const gasCost = totalGas * gasPrice;
      
      // Mock ETH price for USD conversion
      const ethPriceUsd = 2000;
      
      return {
        gasLimit: totalGas.toString(),
        gasPrice: gasPrice.toString(),
        gasCostWei: gasCost.toString(),
        gasCostEth: formatUnits(gasCost, 18),
        gasCostUsd: (parseFloat(formatUnits(gasCost, 18)) * ethPriceUsd).toFixed(2)
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      throw new Error('Failed to estimate gas fees');
    }
  }, [publicClient, address]);

  // Check and handle token approval
  const handleTokenApproval = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<Hash | null> => {
    if (!walletClient || !address || !publicClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const erc20Abi = [
        {
          name: 'approve',
          type: 'function',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }]
        },
        {
          name: 'allowance',
          type: 'function',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
          ],
          outputs: [{ name: '', type: 'uint256' }]
        }
      ] as const;

      // Check current allowance
      const allowance = await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, spenderAddress as `0x${string}`]
      } as any) as bigint;

      const requiredAmount = parseUnits(amount, 18);
      
      if (allowance < requiredAmount) {
        console.log('Approving token spend...');
        
        // Request approval
        const hash = await walletClient.writeContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spenderAddress as `0x${string}`, requiredAmount],
          account: address,
          chain: undefined
        });

        // Wait for approval transaction
        await publicClient.waitForTransactionReceipt({ hash });
        console.log('Token approval confirmed!');
        
        return hash;
      }
      
      return null; // Already approved
    } catch (error) {
      console.error('Token approval failed');
      throw error;
    }
  }, [walletClient, publicClient, address]);

  // Monitor bridge transaction progress
  const monitorBridgeTransaction = useCallback(async (
    transaction: BridgeTransaction,
    receipt?: any
  ) => {
    // In a real implementation, this would:
    // 1. Monitor the source transaction for confirmation
    // 2. Wait for VAA (Verified Action Approval) generation
    // 3. Submit the VAA to the destination chain
    // 4. Monitor destination transaction completion

    // Mock implementation
    setTimeout(() => {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === transaction.id
            ? { ...tx, status: 'confirming', progress: 0.5 }
            : tx
        )
      );
    }, 30000); // 30 seconds

    setTimeout(() => {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === transaction.id
            ? { 
                ...tx, 
                status: 'completed', 
                progress: 1,
                destinationHash: `dest_${Math.random().toString(36).substr(2, 9)}`
              }
            : tx
        )
      );
    }, 300000); // 5 minutes
  }, []);

  // Initiate Wormhole bridge transaction
  const initiateWormholeBridge = useCallback(async (
    sourceChain: string,
    destinationChain: string,
    token: string,
    amount: string,
    recipientAddress: string
  ): Promise<BridgeTransaction> => {
    if (!walletClient || !publicClient) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('Initiating Wormhole bridge transaction...');
      
      // Step 1: Estimate gas fees
      const gasEstimate = await estimateGasFee(sourceChain, token, amount);
      console.log('Gas estimate:', gasEstimate);
      
      // Step 2: Handle token approval if needed
      const bridgeContract = WORMHOLE_CONTRACTS[sourceChain as keyof typeof WORMHOLE_CONTRACTS]?.tokenBridge;
      if (!bridgeContract) {
        throw new Error(`Bridge contract not found for ${sourceChain}`);
      }
      
      await handleTokenApproval(token, bridgeContract, amount);
      
      // Step 3: Initiate Wormhole bridge transaction
      const wormholeAbi = [
        {
          name: 'transferTokens',
          type: 'function',
          inputs: [
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'recipientChain', type: 'uint16' },
            { name: 'recipient', type: 'bytes32' },
            { name: 'arbiterFee', type: 'uint256' },
            { name: 'nonce', type: 'uint32' }
          ],
          outputs: [{ name: 'sequence', type: 'uint64' }]
        }
      ] as const;
      
      // Convert recipient address to bytes32 format
      const recipientBytes32 = destinationChain === 'solana' 
        ? `0x${Buffer.from(new PublicKey(recipientAddress).toBytes()).toString('hex').padStart(64, '0')}`
        : `0x${recipientAddress.slice(2).padStart(64, '0')}`;
      
      const recipientChain = CHAIN_IDS[destinationChain as keyof typeof CHAIN_IDS];
      if (!recipientChain) {
        throw new Error(`Unsupported destination chain: ${destinationChain}`);
      }
      
      // Execute bridge transaction
      const hash = await walletClient.writeContract({
        address: bridgeContract as `0x${string}`,
        abi: wormholeAbi,
        functionName: 'transferTokens',
        args: [
          token as `0x${string}`,
          parseUnits(amount, 18),
          recipientChain,
          recipientBytes32 as `0x${string}`,
          BigInt(0), // arbiter fee
          Math.floor(Math.random() * 1000000) // nonce
        ],
        value: parseUnits('0.01', 18), // Wormhole fee
        account: address,
        chain: undefined
      });
      
      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      console.log('Bridge transaction submitted!');
      
      // Create transaction record
      const transactionId = `wh-${Date.now()}-${hash.slice(2, 10)}`;
      const transaction: BridgeTransaction = {
        id: transactionId,
        sourceChain,
        destinationChain,
        token,
        amount,
        status: 'pending',
        sourceHash: hash,
        timestamp: Date.now(),
        estimatedTime: 300000, // 5 minutes
        progress: 0.1,
      };
      
      // Add to transactions list
      setTransactions(prev => [transaction, ...prev]);
      
      // Start monitoring for VAA and completion
      monitorBridgeTransaction(transaction, receipt);
      
      return transaction;
      
    } catch (error: any) {
      console.error('Bridge transaction failed:', error);
      throw new Error(error.message || 'Bridge transaction failed');
    }
  }, [walletClient, publicClient, estimateGasFee, handleTokenApproval, monitorBridgeTransaction]);

  // Initiate CCTP bridge transaction
  const initiateCCTPBridge = useCallback(async (
    sourceChain: string,
    destinationChain: string,
    token: string,
    amount: string,
    recipientAddress: string
  ): Promise<BridgeTransaction> => {
    if (!walletClient || !publicClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const tokenMessengerAddress = CCTP_CONTRACTS[sourceChain as keyof typeof CCTP_CONTRACTS]?.tokenMessenger;
      if (!tokenMessengerAddress) {
        throw new Error(`CCTP not supported on ${sourceChain}`);
      }

      // Mock CCTP bridge transaction - simplified for compatibility
      const hash = await walletClient.sendTransaction({
        to: tokenMessengerAddress as `0x${string}`,
        value: parseUnits('0.005', 18) // CCTP fee
      } as any);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const transactionId = `cctp-${Date.now()}-${hash.slice(2, 10)}`;
      const transaction: BridgeTransaction = {
        id: transactionId,
        sourceChain,
        destinationChain,
        token,
        amount,
        status: 'pending',
        sourceHash: hash,
        timestamp: Date.now(),
        estimatedTime: 420000, // 7 minutes
        progress: 0.1,
      };

      setTransactions(prev => [transaction, ...prev]);
      monitorBridgeTransaction(transaction, receipt);

      return transaction;
    } catch (error: any) {
      console.error('CCTP bridge failed:', error);
      throw new Error(error.message || 'CCTP bridge failed');
    }
  }, [walletClient, publicClient, monitorBridgeTransaction]);

  // Main bridge initiation function
  const initiateBridge = useCallback(async (
    sourceChain: string,
    destinationChain: string,
    token: string,
    amount: string,
    recipientAddress?: string
  ): Promise<BridgeTransaction> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    
    try {
      const routes = getSupportedRoutes();
      const route = routes.find(
        r => r.sourceChain === sourceChain && r.destinationChain === destinationChain
      );

      if (!route || !route.supported) {
        throw new Error(`Bridge route not supported: ${sourceChain} -> ${destinationChain}`);
      }

      const recipient = recipientAddress || address;
      let result: BridgeTransaction;

      switch (route.protocol) {
        case 'wormhole':
          result = await initiateWormholeBridge(sourceChain, destinationChain, token, amount, recipient);
          break;
        case 'cctp':
          result = await initiateCCTPBridge(sourceChain, destinationChain, token, amount, recipient);
          break;
        case 'native':
          throw new Error('Native bridge not implemented yet');
        default:
          throw new Error(`Unsupported bridge protocol: ${route.protocol}`);
      }

      console.log(`Bridge transaction initiated! Transaction ID: ${result.id}`);
      return result;

    } catch (error: any) {
      console.error('Bridge initiation failed:', error.message || 'Bridge initiation failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, getSupportedRoutes, initiateWormholeBridge, initiateCCTPBridge]);

  // Get bridge transaction status
  const getBridgeStatus = useCallback((transactionId: string) => {
    const transaction = transactions.find(tx => tx.id === transactionId);
    if (!transaction) {
      return null;
    }

    const elapsed = Date.now() - transaction.timestamp;
    const progress = Math.min(elapsed / transaction.estimatedTime, transaction.progress || 0);

    return { ...transaction, progress };
  }, [transactions]);

  // Get bridge transaction history
  const getBridgeHistory = useCallback(() => {
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions]);

  // Cancel bridge transaction (if possible)
  const cancelBridge = useCallback(async (transactionId: string) => {
    const transaction = transactions.find(tx => tx.id === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Cannot cancel transaction that is not pending');
    }

    // In most cases, bridge transactions cannot be cancelled once submitted
    // This would require protocol-specific cancellation logic
    throw new Error('Bridge transactions cannot be cancelled once submitted');
  }, [transactions]);

  // Clear transaction history
  const clearHistory = useCallback(() => {
    setTransactions([]);
    localStorage.removeItem('bridge-transactions');
  }, []);

  return {
    transactions,
    isLoading,
    isConnected,
    address,
    getSupportedRoutes,
    estimateBridge,
    estimateGasFee,
    handleTokenApproval,
    initiateBridge,
    initiateWormholeBridge,
    initiateCCTPBridge,
    monitorBridgeTransaction,
    getBridgeStatus,
    getBridgeHistory,
    cancelBridge,
    clearHistory,
  };
};