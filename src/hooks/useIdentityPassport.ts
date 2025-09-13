import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { didIdentityService } from '../lib/did-identity';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';

// Types
export interface IdentityPassportNFT {
  tokenId: string;
  did: string;
  kycLevel: 'None' | 'Basic' | 'Enhanced' | 'Institutional';
  investorTier: 'None' | 'Retail' | 'Accredited' | 'Institutional' | 'Qualified';
  reputationScore: number;
  issuanceDate: Date;
  expirationDate: Date;
  isActive: boolean;
  metadataURI: string;
  issuer: string;
  crossChainAddresses: CrossChainAddress[];
  credentials: string[];
  chain: string;
  contractAddress: string;
}

export interface CrossChainAddress {
  chain: string;
  address: string;
  verified: boolean;
  timestamp: Date;
}

export interface PassportMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

// Contract ABIs (simplified)
const IDENTITY_PASSPORT_ABI = [
  "function getPassportByAddress(address holder) view returns (tuple(string did, uint8 kycLevel, uint8 investorTier, uint256 reputationScore, uint256 issuanceDate, uint256 expirationDate, bool isActive, string metadataURI, address issuer))",
  "function hasValidPassport(address holder) view returns (bool)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function addressToTokenId(address holder) view returns (uint256)",
  "function getCrossChainAddresses(uint256 tokenId) view returns (tuple(string chain, string address, bool verified, uint256 timestamp)[])",
  "function getCredentials(uint256 tokenId) view returns (string[])"
];

// Contract addresses by chain
const PASSPORT_CONTRACTS: Record<string, string> = {
  ethereum: process.env.NEXT_PUBLIC_ETHEREUM_PASSPORT_CONTRACT || '',
  polygon: process.env.NEXT_PUBLIC_POLYGON_PASSPORT_CONTRACT || '',
  bsc: process.env.NEXT_PUBLIC_BSC_PASSPORT_CONTRACT || '',
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_PASSPORT_CONTRACT || '',
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_PASSPORT_CONTRACT || '',
};

export const useIdentityPassport = () => {
  const { address, provider, chainId, solanaWallet } = useWallet();
  const [passport, setPassport] = useState<IdentityPassportNFT | null>(null);
  const [metadata, setMetadata] = useState<PassportMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get chain name from chainId
  const getChainName = useCallback((chainId: number): string => {
    const chainMap: Record<number, string> = {
      1: 'ethereum',
      137: 'polygon',
      56: 'bsc',
      42161: 'arbitrum',
      10: 'optimism',
    };
    return chainMap[chainId] || 'ethereum';
  }, []);

  // Fetch passport from Ethereum-compatible chains
  const fetchEVMPassport = useCallback(async (
    userAddress: string,
    chain: string,
    provider: ethers.providers.Provider
  ): Promise<IdentityPassportNFT | null> => {
    try {
      const contractAddress = PASSPORT_CONTRACTS[chain];
      if (!contractAddress) {
        console.warn(`No passport contract configured for chain: ${chain}`);
        return null;
      }

      const contract = new ethers.Contract(contractAddress, IDENTITY_PASSPORT_ABI, provider);
      
      // Check if user has a passport
      const hasPassport = await contract.hasValidPassport(userAddress);
      if (!hasPassport) {
        return null;
      }

      // Get passport data
      const passportData = await contract.getPassportByAddress(userAddress);
      const tokenId = await contract.addressToTokenId(userAddress);
      const crossChainAddresses = await contract.getCrossChainAddresses(tokenId);
      const credentials = await contract.getCredentials(tokenId);

      // Convert data
      const passport: IdentityPassportNFT = {
        tokenId: tokenId.toString(),
        did: passportData.did,
        kycLevel: ['None', 'Basic', 'Enhanced', 'Institutional'][passportData.kycLevel],
        investorTier: ['None', 'Retail', 'Accredited', 'Institutional', 'Qualified'][passportData.investorTier],
        reputationScore: passportData.reputationScore.toNumber(),
        issuanceDate: new Date(passportData.issuanceDate.toNumber() * 1000),
        expirationDate: new Date(passportData.expirationDate.toNumber() * 1000),
        isActive: passportData.isActive,
        metadataURI: passportData.metadataURI,
        issuer: passportData.issuer,
        crossChainAddresses: crossChainAddresses.map((addr: any) => ({
          chain: addr.chain,
          address: addr.address,
          verified: addr.verified,
          timestamp: new Date(addr.timestamp.toNumber() * 1000),
        })),
        credentials,
        chain,
        contractAddress,
      };

      return passport;
    } catch (error) {
      console.error(`Error fetching EVM passport on ${chain}:`, error);
      return null;
    }
  }, []);

  // Fetch passport from Solana
  const fetchSolanaPassport = useCallback(async (
    userAddress: string
  ): Promise<IdentityPassportNFT | null> => {
    try {
      if (!solanaWallet?.publicKey) {
        return null;
      }

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
      );

      // Get DID from identity service
      const profile = didIdentityService.getProfile();
      if (!profile?.did) {
        return null;
      }

      // Find passport PDA
      const programId = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || '');
      const [passportPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('identity_passport'), Buffer.from(profile.did)],
        programId
      );

      // Fetch passport account
      const passportAccount = await connection.getAccountInfo(passportPDA);
      if (!passportAccount) {
        return null;
      }

      // Deserialize passport data (simplified - would use Anchor in production)
      // For now, return mock data based on DID profile
      const passport: IdentityPassportNFT = {
        tokenId: passportPDA.toString(),
        did: profile.did,
        kycLevel: 'Enhanced', // Would be parsed from account data
        investorTier: 'Accredited',
        reputationScore: profile.reputation.score,
        issuanceDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        metadataURI: '',
        issuer: programId.toString(),
        crossChainAddresses: Object.entries(profile.walletAddresses).map(([chain, address]) => ({
          chain,
          address: address || '',
          verified: true,
          timestamp: new Date(),
        })),
        credentials: profile.credentials.map(cred => cred.id),
        chain: 'solana',
        contractAddress: programId.toString(),
      };

      return passport;
    } catch (error) {
      console.error('Error fetching Solana passport:', error);
      return null;
    }
  }, [solanaWallet]);

  // Fetch passport metadata from IPFS/HTTP
  const fetchPassportMetadata = useCallback(async (metadataURI: string): Promise<PassportMetadata | null> => {
    try {
      if (!metadataURI) return null;

      const response = await fetch(metadataURI);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }

      const metadata = await response.json();
      return metadata as PassportMetadata;
    } catch (error) {
      console.error('Error fetching passport metadata:', error);
      return null;
    }
  }, []);

  // Main function to fetch passport
  const fetchPassport = useCallback(async () => {
    if (!address) {
      setPassport(null);
      setMetadata(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let foundPassport: IdentityPassportNFT | null = null;

      // Try to fetch from current EVM chain first
      if (provider && chainId) {
        const chainName = getChainName(chainId);
        foundPassport = await fetchEVMPassport(address, chainName, provider);
      }

      // If not found on current chain, try other EVM chains
      if (!foundPassport && provider) {
        for (const [chain, contractAddress] of Object.entries(PASSPORT_CONTRACTS)) {
          if (contractAddress && chain !== getChainName(chainId || 1)) {
            try {
              // Create provider for other chains (simplified)
              foundPassport = await fetchEVMPassport(address, chain, provider);
              if (foundPassport) break;
            } catch (error) {
              console.warn(`Failed to check passport on ${chain}:`, error);
            }
          }
        }
      }

      // Try Solana if still not found
      if (!foundPassport) {
        foundPassport = await fetchSolanaPassport(address);
      }

      setPassport(foundPassport);

      // Fetch metadata if passport found
      if (foundPassport?.metadataURI) {
        const metadata = await fetchPassportMetadata(foundPassport.metadataURI);
        setMetadata(metadata);
      }
    } catch (error) {
      console.error('Error fetching passport:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch passport');
    } finally {
      setLoading(false);
    }
  }, [address, provider, chainId, getChainName, fetchEVMPassport, fetchSolanaPassport, fetchPassportMetadata]);

  // Check if passport is valid (not expired)
  const isPassportValid = useCallback((passport: IdentityPassportNFT | null): boolean => {
    if (!passport) return false;
    return passport.isActive && passport.expirationDate > new Date();
  }, []);

  // Get passport status text
  const getPassportStatus = useCallback((passport: IdentityPassportNFT | null): string => {
    if (!passport) return 'No Passport';
    if (!passport.isActive) return 'Inactive';
    if (passport.expirationDate <= new Date()) return 'Expired';
    return 'Valid';
  }, []);

  // Get KYC level color for UI
  const getKYCLevelColor = useCallback((kycLevel: string): string => {
    const colors = {
      None: 'gray',
      Basic: 'blue',
      Enhanced: 'green',
      Institutional: 'purple',
    };
    return colors[kycLevel as keyof typeof colors] || 'gray';
  }, []);

  // Get investor tier badge
  const getInvestorTierBadge = useCallback((investorTier: string): string => {
    const badges = {
      None: '👤',
      Retail: '🏪',
      Accredited: '⭐',
      Institutional: '🏛️',
      Qualified: '💎',
    };
    return badges[investorTier as keyof typeof badges] || '👤';
  }, []);

  // Auto-fetch passport when wallet connects
  useEffect(() => {
    fetchPassport();
  }, [fetchPassport]);

  return {
    passport,
    metadata,
    loading,
    error,
    fetchPassport,
    isPassportValid: isPassportValid(passport),
    passportStatus: getPassportStatus(passport),
    getKYCLevelColor,
    getInvestorTierBadge,
    hasPassport: !!passport,
    // Utility functions
    utils: {
      isPassportValid,
      getPassportStatus,
      getKYCLevelColor,
      getInvestorTierBadge,
    },
  };
};
