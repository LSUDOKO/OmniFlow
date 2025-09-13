import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export interface ComplianceStatus {
  isCompliant: boolean;
  requiredLevel: ComplianceLevel;
  allowedRegions: Region;
  lastUpdated: number;
  expiryTimestamp: number;
  riskLevel: RiskLevel;
  tags: string[];
}

export interface AMLData {
  totalVolume24h: string;
  totalVolume30d: string;
  transactionCount24h: number;
  suspiciousActivityScore: number;
  lastRiskAssessment: number;
  flaggedForReview: boolean;
}

export interface RegionalPolicy {
  isRestricted: boolean;
  minComplianceLevel: ComplianceLevel;
  maxTransactionAmount: string;
  dailyLimit: string;
  requiresAdditionalVerification: boolean;
  restrictedAssetTypes: string[];
}

export enum ComplianceLevel {
  NONE = 0,
  BASIC = 1,
  ENHANCED = 2,
  INSTITUTIONAL = 3,
  RESTRICTED = 4
}

export enum Region {
  UNRESTRICTED = 0,
  US = 1,
  EU = 2,
  ASIA_PACIFIC = 3,
  RESTRICTED = 4,
  SANCTIONED = 5
}

export enum RiskLevel {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  CRITICAL = 3
}

// Contract ABI for ComplianceManager
const COMPLIANCE_MANAGER_ABI = [
  "function isCompliant(address user) external view returns (bool)",
  "function isCompliant(address user, uint8 requiredLevel, string memory assetType) external view returns (bool)",
  "function requireKYC(address user) external view",
  "function enforceRegionPolicy(address user, uint8 userRegion) external view",
  "function isBlacklisted(address user) external view returns (bool)",
  "function isWhitelisted(address user) external view returns (bool)",
  "function getComplianceStatus(address user) external view returns (tuple(bool isCompliant, uint8 requiredLevel, uint8 allowedRegions, uint256 lastUpdated, uint256 expiryTimestamp, uint8 riskLevel, string[] tags))",
  "function getAMLData(address user) external view returns (tuple(uint256 totalVolume24h, uint256 totalVolume30d, uint256 transactionCount24h, uint256 suspiciousActivityScore, uint256 lastRiskAssessment, bool flaggedForReview))",
  "function getRegionalPolicy(uint8 region) external view returns (tuple(bool isRestricted, uint8 minComplianceLevel, uint256 maxTransactionAmount, uint256 dailyLimit, bool requiresAdditionalVerification, string[] restrictedAssetTypes))",
  "function updateComplianceStatus(address user, bool isCompliant, uint8 level, uint8 region, uint256 expiryTimestamp) external",
  "function addToBlacklist(address user, string calldata reason) external",
  "function removeFromBlacklist(address user) external",
  "function addToWhitelist(address user, string calldata reason) external",
  "function removeFromWhitelist(address user) external",
  "event ComplianceStatusUpdated(address indexed user, bool isCompliant, uint8 level)",
  "event AddressBlacklisted(address indexed user, string reason)",
  "event AddressWhitelisted(address indexed user, string reason)",
  "event SuspiciousActivityDetected(address indexed user, uint256 score, string reason)"
];

// Contract addresses by chain
const COMPLIANCE_MANAGER_ADDRESSES = {
  ethereum: process.env.NEXT_PUBLIC_ETHEREUM_COMPLIANCE_MANAGER,
  polygon: process.env.NEXT_PUBLIC_POLYGON_COMPLIANCE_MANAGER,
  bsc: process.env.NEXT_PUBLIC_BSC_COMPLIANCE_MANAGER,
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_COMPLIANCE_MANAGER,
};

export const useCompliance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complianceData, setComplianceData] = useState<{
    status: ComplianceStatus | null;
    amlData: AMLData | null;
    lastUpdate: Date | null;
  }>({
    status: null,
    amlData: null,
    lastUpdate: null,
  });

  // Get compliance manager contract
  const getComplianceContract = useCallback((chainId: number) => {
    if (!window.ethereum) return null;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let contractAddress: string | undefined;

    switch (chainId) {
      case 1:
        contractAddress = COMPLIANCE_MANAGER_ADDRESSES.ethereum;
        break;
      case 137:
        contractAddress = COMPLIANCE_MANAGER_ADDRESSES.polygon;
        break;
      case 56:
        contractAddress = COMPLIANCE_MANAGER_ADDRESSES.bsc;
        break;
      case 42161:
        contractAddress = COMPLIANCE_MANAGER_ADDRESSES.arbitrum;
        break;
      default:
        return null;
    }

    if (!contractAddress) return null;

    return new ethers.Contract(contractAddress, COMPLIANCE_MANAGER_ABI, provider);
  }, []);

  // Check if user is compliant
  const isCompliant = useCallback(async (
    userAddress: string,
    chainId: number,
    requiredLevel?: ComplianceLevel,
    assetType?: string
  ): Promise<boolean> => {
    try {
      const contract = getComplianceContract(chainId);
      if (!contract) return true; // No compliance contract, assume compliant

      if (requiredLevel !== undefined && assetType) {
        return await contract.isCompliant(userAddress, requiredLevel, assetType);
      } else {
        return await contract.isCompliant(userAddress);
      }
    } catch (error) {
      console.error('Error checking compliance:', error);
      return false;
    }
  }, [getComplianceContract]);

  // Check if user has valid KYC
  const hasValidKYC = useCallback(async (
    userAddress: string,
    chainId: number
  ): Promise<boolean> => {
    try {
      const contract = getComplianceContract(chainId);
      if (!contract) return true; // No compliance contract, assume valid

      await contract.requireKYC(userAddress);
      return true;
    } catch (error) {
      return false;
    }
  }, [getComplianceContract]);

  // Check regional compliance
  const isRegionAllowed = useCallback(async (
    userAddress: string,
    region: Region,
    chainId: number
  ): Promise<boolean> => {
    try {
      const contract = getComplianceContract(chainId);
      if (!contract) return true; // No compliance contract, assume allowed

      await contract.enforceRegionPolicy(userAddress, region);
      return true;
    } catch (error) {
      return false;
    }
  }, [getComplianceContract]);

  // Check if address is blacklisted
  const isBlacklisted = useCallback(async (
    userAddress: string,
    chainId: number
  ): Promise<boolean> => {
    try {
      const contract = getComplianceContract(chainId);
      if (!contract) return false;

      return await contract.isBlacklisted(userAddress);
    } catch (error) {
      console.error('Error checking blacklist:', error);
      return false;
    }
  }, [getComplianceContract]);

  // Check if address is whitelisted
  const isWhitelisted = useCallback(async (
    userAddress: string,
    chainId: number
  ): Promise<boolean> => {
    try {
      const contract = getComplianceContract(chainId);
      if (!contract) return false;

      return await contract.isWhitelisted(userAddress);
    } catch (error) {
      console.error('Error checking whitelist:', error);
      return false;
    }
  }, [getComplianceContract]);

  // Get compliance status
  const getComplianceStatus = useCallback(async (
    userAddress: string,
    chainId: number
  ): Promise<ComplianceStatus | null> => {
    try {
      setIsLoading(true);
      const contract = getComplianceContract(chainId);
      if (!contract) return null;

      const status = await contract.getComplianceStatus(userAddress);
      
      const complianceStatus: ComplianceStatus = {
        isCompliant: status.isCompliant,
        requiredLevel: status.requiredLevel,
        allowedRegions: status.allowedRegions,
        lastUpdated: status.lastUpdated.toNumber(),
        expiryTimestamp: status.expiryTimestamp.toNumber(),
        riskLevel: status.riskLevel,
        tags: status.tags,
      };

      setComplianceData(prev => ({
        ...prev,
        status: complianceStatus,
        lastUpdate: new Date(),
      }));

      return complianceStatus;
    } catch (error) {
      console.error('Error getting compliance status:', error);
      setError(error instanceof Error ? error.message : 'Failed to get compliance status');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getComplianceContract]);

  // Get AML data
  const getAMLData = useCallback(async (
    userAddress: string,
    chainId: number
  ): Promise<AMLData | null> => {
    try {
      const contract = getComplianceContract(chainId);
      if (!contract) return null;

      const amlData = await contract.getAMLData(userAddress);
      
      const amlResult: AMLData = {
        totalVolume24h: ethers.utils.formatEther(amlData.totalVolume24h),
        totalVolume30d: ethers.utils.formatEther(amlData.totalVolume30d),
        transactionCount24h: amlData.transactionCount24h.toNumber(),
        suspiciousActivityScore: amlData.suspiciousActivityScore.toNumber(),
        lastRiskAssessment: amlData.lastRiskAssessment.toNumber(),
        flaggedForReview: amlData.flaggedForReview,
      };

      setComplianceData(prev => ({
        ...prev,
        amlData: amlResult,
        lastUpdate: new Date(),
      }));

      return amlResult;
    } catch (error) {
      console.error('Error getting AML data:', error);
      return null;
    }
  }, [getComplianceContract]);

  // Get regional policy
  const getRegionalPolicy = useCallback(async (
    region: Region,
    chainId: number
  ): Promise<RegionalPolicy | null> => {
    try {
      const contract = getComplianceContract(chainId);
      if (!contract) return null;

      const policy = await contract.getRegionalPolicy(region);
      
      return {
        isRestricted: policy.isRestricted,
        minComplianceLevel: policy.minComplianceLevel,
        maxTransactionAmount: ethers.utils.formatEther(policy.maxTransactionAmount),
        dailyLimit: ethers.utils.formatEther(policy.dailyLimit),
        requiresAdditionalVerification: policy.requiresAdditionalVerification,
        restrictedAssetTypes: policy.restrictedAssetTypes,
      };
    } catch (error) {
      console.error('Error getting regional policy:', error);
      return null;
    }
  }, [getComplianceContract]);

  // Update compliance status (admin function)
  const updateComplianceStatus = useCallback(async (
    userAddress: string,
    isCompliant: boolean,
    level: ComplianceLevel,
    region: Region,
    expiryTimestamp: number,
    chainId: number
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getComplianceContract(chainId)?.connect(signer);
      
      if (!contract) throw new Error('Compliance contract not available');

      const tx = await contract.updateComplianceStatus(
        userAddress,
        isCompliant,
        level,
        region,
        expiryTimestamp
      );
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error updating compliance status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update compliance status');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getComplianceContract]);

  // Add to blacklist (admin function)
  const addToBlacklist = useCallback(async (
    userAddress: string,
    reason: string,
    chainId: number
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getComplianceContract(chainId)?.connect(signer);
      
      if (!contract) throw new Error('Compliance contract not available');

      const tx = await contract.addToBlacklist(userAddress, reason);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error adding to blacklist:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to blacklist');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getComplianceContract]);

  // Add to whitelist (admin function)
  const addToWhitelist = useCallback(async (
    userAddress: string,
    reason: string,
    chainId: number
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getComplianceContract(chainId)?.connect(signer);
      
      if (!contract) throw new Error('Compliance contract not available');

      const tx = await contract.addToWhitelist(userAddress, reason);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to whitelist');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getComplianceContract]);

  // Get comprehensive compliance report
  const getComplianceReport = useCallback(async (
    userAddress: string,
    chainId: number
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const [status, amlData, blacklisted, whitelisted] = await Promise.all([
        getComplianceStatus(userAddress, chainId),
        getAMLData(userAddress, chainId),
        isBlacklisted(userAddress, chainId),
        isWhitelisted(userAddress, chainId),
      ]);

      return {
        status,
        amlData,
        blacklisted,
        whitelisted,
        lastUpdate: new Date(),
      };
    } catch (error) {
      console.error('Error getting compliance report:', error);
      setError(error instanceof Error ? error.message : 'Failed to get compliance report');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getComplianceStatus, getAMLData, isBlacklisted, isWhitelisted]);

  // Listen for compliance events
  useEffect(() => {
    if (!window.ethereum) return;

    const setupEventListeners = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        const contract = getComplianceContract(network.chainId);
        
        if (!contract) return;

        // Listen for compliance status updates
        contract.on('ComplianceStatusUpdated', (user, isCompliant, level) => {
          console.log('Compliance status updated:', { user, isCompliant, level });
          // Refresh compliance data if it's for the current user
          // This would need to be connected to current user context
        });

        // Listen for blacklist events
        contract.on('AddressBlacklisted', (user, reason) => {
          console.log('Address blacklisted:', { user, reason });
        });

        // Listen for suspicious activity
        contract.on('SuspiciousActivityDetected', (user, score, reason) => {
          console.log('Suspicious activity detected:', { user, score, reason });
        });

        return () => {
          contract.removeAllListeners();
        };
      } catch (error) {
        console.error('Error setting up compliance event listeners:', error);
      }
    };

    setupEventListeners();
  }, [getComplianceContract]);

  return {
    // State
    isLoading,
    error,
    complianceData,

    // Read functions
    isCompliant,
    hasValidKYC,
    isRegionAllowed,
    isBlacklisted,
    isWhitelisted,
    getComplianceStatus,
    getAMLData,
    getRegionalPolicy,
    getComplianceReport,

    // Admin functions
    updateComplianceStatus,
    addToBlacklist,
    addToWhitelist,

    // Utility functions
    clearError: () => setError(null),
  };
};
