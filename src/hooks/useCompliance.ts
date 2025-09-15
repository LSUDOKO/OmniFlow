import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { formatUnits, parseUnits, type Address, type Hash } from 'viem';
// Removed react-hot-toast dependency - using console logs instead

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

export interface ComplianceReport {
  status: ComplianceStatus | null;
  amlData: AMLData | null;
  blacklisted: boolean;
  whitelisted: boolean;
  kycValid: boolean;
  regionAllowed: boolean;
  lastUpdate: Date;
}

export interface VelocityCheck {
  dailyVolume: string;
  monthlyVolume: string;
  transactionCount24h: number;
  isWithinLimits: boolean;
  nextResetTime: number;
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
  {
    name: 'isCompliant',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'isCompliant',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'requiredLevel', type: 'uint8' },
      { name: 'assetType', type: 'string' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'requireKYC',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    name: 'enforceRegionPolicy',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'userRegion', type: 'uint8' }
    ],
    outputs: []
  },
  {
    name: 'isBlacklisted',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'isWhitelisted',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'getComplianceStatus',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{
      name: '',
      type: 'tuple',
      components: [
        { name: 'isCompliant', type: 'bool' },
        { name: 'requiredLevel', type: 'uint8' },
        { name: 'allowedRegions', type: 'uint8' },
        { name: 'lastUpdated', type: 'uint256' },
        { name: 'expiryTimestamp', type: 'uint256' },
        { name: 'riskLevel', type: 'uint8' },
        { name: 'tags', type: 'string[]' }
      ]
    }]
  },
  {
    name: 'getAMLData',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{
      name: '',
      type: 'tuple',
      components: [
        { name: 'totalVolume24h', type: 'uint256' },
        { name: 'totalVolume30d', type: 'uint256' },
        { name: 'transactionCount24h', type: 'uint256' },
        { name: 'suspiciousActivityScore', type: 'uint256' },
        { name: 'lastRiskAssessment', type: 'uint256' },
        { name: 'flaggedForReview', type: 'bool' }
      ]
    }]
  },
  {
    name: 'getRegionalPolicy',
    type: 'function',
    inputs: [{ name: 'region', type: 'uint8' }],
    outputs: [{
      name: '',
      type: 'tuple',
      components: [
        { name: 'isRestricted', type: 'bool' },
        { name: 'minComplianceLevel', type: 'uint8' },
        { name: 'maxTransactionAmount', type: 'uint256' },
        { name: 'dailyLimit', type: 'uint256' },
        { name: 'requiresAdditionalVerification', type: 'bool' },
        { name: 'restrictedAssetTypes', type: 'string[]' }
      ]
    }]
  },
  {
    name: 'updateComplianceStatus',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'isCompliant', type: 'bool' },
      { name: 'level', type: 'uint8' },
      { name: 'region', type: 'uint8' },
      { name: 'expiryTimestamp', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'addToBlacklist',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'reason', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'removeFromBlacklist',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    name: 'addToWhitelist',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'reason', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'removeFromWhitelist',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    name: 'getVelocityLimits',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{
      name: '',
      type: 'tuple',
      components: [
        { name: 'dailyVolume', type: 'uint256' },
        { name: 'monthlyVolume', type: 'uint256' },
        { name: 'transactionCount24h', type: 'uint256' },
        { name: 'isWithinLimits', type: 'bool' },
        { name: 'nextResetTime', type: 'uint256' }
      ]
    }]
  }
] as const;

// Events ABI
const COMPLIANCE_EVENTS_ABI = [
  {
    name: 'ComplianceStatusUpdated',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'isCompliant', type: 'bool', indexed: false },
      { name: 'level', type: 'uint8', indexed: false }
    ]
  },
  {
    name: 'AddressBlacklisted',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'reason', type: 'string', indexed: false }
    ]
  },
  {
    name: 'AddressWhitelisted',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'reason', type: 'string', indexed: false }
    ]
  },
  {
    name: 'SuspiciousActivityDetected',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'score', type: 'uint256', indexed: false },
      { name: 'reason', type: 'string', indexed: false }
    ]
  }
] as const;

// Contract addresses by chain
const COMPLIANCE_MANAGER_ADDRESSES: Record<number, Address> = {
  1: (process.env.NEXT_PUBLIC_ETHEREUM_COMPLIANCE_MANAGER || '0x0000000000000000000000000000000000000000') as Address, // Ethereum
  137: (process.env.NEXT_PUBLIC_POLYGON_COMPLIANCE_MANAGER || '0x0000000000000000000000000000000000000000') as Address, // Polygon
  56: (process.env.NEXT_PUBLIC_BSC_COMPLIANCE_MANAGER || '0x0000000000000000000000000000000000000000') as Address, // BSC
  42161: (process.env.NEXT_PUBLIC_ARBITRUM_COMPLIANCE_MANAGER || '0x0000000000000000000000000000000000000000') as Address, // Arbitrum
};

// Risk level mappings
const RISK_LEVEL_LABELS = {
  [RiskLevel.LOW]: 'Low Risk',
  [RiskLevel.MEDIUM]: 'Medium Risk',
  [RiskLevel.HIGH]: 'High Risk',
  [RiskLevel.CRITICAL]: 'Critical Risk'
};

const COMPLIANCE_LEVEL_LABELS = {
  [ComplianceLevel.NONE]: 'No Verification',
  [ComplianceLevel.BASIC]: 'Basic Verification',
  [ComplianceLevel.ENHANCED]: 'Enhanced Verification',
  [ComplianceLevel.INSTITUTIONAL]: 'Institutional Verification',
  [ComplianceLevel.RESTRICTED]: 'Restricted Access'
};

export const useCompliance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complianceData, setComplianceData] = useState<{
    status: ComplianceStatus | null;
    amlData: AMLData | null;
    velocityCheck: VelocityCheck | null;
    lastUpdate: Date | null;
  }>({
    status: null,
    amlData: null,
    velocityCheck: null,
    lastUpdate: null,
  });

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Get compliance manager contract address
  const getContractAddress = useCallback((targetChainId?: number): Address | null => {
    const id = targetChainId || chainId;
    return COMPLIANCE_MANAGER_ADDRESSES[id] || null;
  }, [chainId]);

  // Check if user is compliant
  const isCompliant = useCallback(async (
    userAddress: string,
    targetChainId?: number,
    requiredLevel?: ComplianceLevel,
    assetType?: string
  ): Promise<boolean> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return true; // No compliance contract, assume compliant

      if (requiredLevel !== undefined && assetType) {
        const result = await publicClient.readContract({
          address: contractAddress,
          abi: COMPLIANCE_MANAGER_ABI,
          functionName: 'isCompliant',
          args: [userAddress as Address, requiredLevel, assetType]
        } as any) as boolean;
        return result as boolean;
      } else {
        const result = await publicClient.readContract({
          address: contractAddress,
          abi: COMPLIANCE_MANAGER_ABI,
          functionName: 'isCompliant',
          args: [userAddress as Address]
        } as any) as boolean;
        return result as boolean;
      }
    } catch (error) {
      console.error('Error checking compliance:', error);
      return false;
    }
  }, [getContractAddress, publicClient]);

  // Check if user has valid KYC
  const hasValidKYC = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<boolean> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return true;

      await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'requireKYC',
        args: [userAddress as Address]
      } as any) as any;
      return true;
    } catch (error) {
      return false;
    }
  }, [getContractAddress, publicClient]);

  // Check regional compliance
  const isRegionAllowed = useCallback(async (
    userAddress: string,
    region: Region,
    targetChainId?: number
  ): Promise<boolean> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return true;

      await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'enforceRegionPolicy',
        args: [userAddress as Address, region]
      } as any) as any;
      return true;
    } catch (error) {
      return false;
    }
  }, [getContractAddress, publicClient]);

  // Check if address is blacklisted
  const isBlacklisted = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<boolean> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return false;

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'isBlacklisted',
        args: [userAddress as Address]
      } as any) as boolean;
      return result as boolean;
    } catch (error) {
      console.error('Error checking blacklist:', error);
      return false;
    }
  }, [getContractAddress, publicClient]);

  // Check if address is whitelisted
  const isWhitelisted = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<boolean> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return false;

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'isWhitelisted',
        args: [userAddress as Address]
      } as any) as boolean;
      return result as boolean;
    } catch (error) {
      console.error('Error checking whitelist:', error);
      return false;
    }
  }, [getContractAddress, publicClient]);

  // Get compliance status
  const getComplianceStatus = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<ComplianceStatus | null> => {
    try {
      setIsLoading(true);
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return null;

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'getComplianceStatus',
        args: [userAddress as Address]
      } as any) as any;

      const status = result as any;
      
      const complianceStatus: ComplianceStatus = {
        isCompliant: status.isCompliant,
        requiredLevel: status.requiredLevel,
        allowedRegions: status.allowedRegions,
        lastUpdated: Number(status.lastUpdated),
        expiryTimestamp: Number(status.expiryTimestamp),
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
  }, [getContractAddress, publicClient]);

  // Get AML data
  const getAMLData = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<AMLData | null> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return null;

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'getAMLData',
        args: [userAddress as Address]
      } as any) as any;

      const amlData = result as any;
      
      const amlResult: AMLData = {
        totalVolume24h: formatUnits(amlData.totalVolume24h, 18),
        totalVolume30d: formatUnits(amlData.totalVolume30d, 18),
        transactionCount24h: Number(amlData.transactionCount24h),
        suspiciousActivityScore: Number(amlData.suspiciousActivityScore),
        lastRiskAssessment: Number(amlData.lastRiskAssessment),
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
  }, [getContractAddress, publicClient]);

  // Get velocity check data
  const getVelocityCheck = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<VelocityCheck | null> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return null;

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'getVelocityLimits',
        args: [userAddress as Address]
      } as any) as any;

      const velocityData = result as any;

      const velocityCheck: VelocityCheck = {
        dailyVolume: formatUnits(velocityData.dailyVolume, 18),
        monthlyVolume: formatUnits(velocityData.monthlyVolume, 18),
        transactionCount24h: Number(velocityData.transactionCount24h),
        isWithinLimits: velocityData.isWithinLimits,
        nextResetTime: Number(velocityData.nextResetTime),
      };

      setComplianceData(prev => ({
        ...prev,
        velocityCheck,
        lastUpdate: new Date(),
      }));

      return velocityCheck;
    } catch (error) {
      console.error('Error getting velocity check:', error);
      return null;
    }
  }, [getContractAddress, publicClient]);

  // Get regional policy
  const getRegionalPolicy = useCallback(async (
    userRegion: Region,
    targetChainId?: number
  ): Promise<RegionalPolicy | null> => {
    try {
      const contractAddress = getContractAddress(targetChainId);
      if (!contractAddress || !publicClient) return null;

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'getRegionalPolicy',
        args: [userRegion]
      } as any) as any;

      const policy = result as any;
      
      return {
        isRestricted: policy.isRestricted,
        minComplianceLevel: policy.minComplianceLevel,
        maxTransactionAmount: formatUnits(policy.maxTransactionAmount, 18),
        dailyLimit: formatUnits(policy.dailyLimit, 18),
        requiresAdditionalVerification: policy.requiresAdditionalVerification,
        restrictedAssetTypes: policy.restrictedAssetTypes,
      };
    } catch (error) {
      console.error('Error getting regional policy:', error);
      return null;
    }
  }, [getContractAddress, publicClient]);

  // Update compliance status (admin function)
  const updateComplianceStatus = useCallback(async (
    userAddress: string,
    isCompliant: boolean,
    level: ComplianceLevel,
    region: Region,
    expiryTimestamp: number,
    targetChainId?: number
  ): Promise<Hash | null> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      const contractAddress = getContractAddress(targetChainId);
      
      if (!contractAddress) throw new Error('Compliance contract not available');

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'updateComplianceStatus',
        args: [userAddress as Address, isCompliant, level, region, BigInt(expiryTimestamp)],
        account: walletClient.account,
        chain: undefined
      });
      
      console.log('Compliance status updated successfully');
      return hash;
    } catch (error) {
      console.error('Error updating compliance status:', error);
      const message = error instanceof Error ? error.message : 'Failed to update compliance status';
      setError(message);
      console.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, getContractAddress]);

  // Add to blacklist (admin function)
  const addToBlacklist = useCallback(async (
    userAddress: string,
    reason: string,
    targetChainId?: number
  ): Promise<Hash | null> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      const contractAddress = getContractAddress(targetChainId);
      
      if (!contractAddress) throw new Error('Compliance contract not available');

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'addToBlacklist',
        args: [userAddress as Address, reason],
        account: walletClient.account,
        chain: undefined
      });
      
      console.log('Address added to blacklist');
      return hash;
    } catch (error) {
      console.error('Error adding to blacklist:', error);
      const message = error instanceof Error ? error.message : 'Failed to add to blacklist';
      setError(message);
      console.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, getContractAddress]);

  // Remove from blacklist (admin function)
  const removeFromBlacklist = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<Hash | null> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      const contractAddress = getContractAddress(targetChainId);
      
      if (!contractAddress) throw new Error('Compliance contract not available');

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'removeFromBlacklist',
        args: [userAddress as Address],
        account: walletClient.account,
        chain: undefined
      });
      
      console.log('Address removed from blacklist');
      return hash;
    } catch (error) {
      console.error('Error removing from blacklist:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove from blacklist';
      setError(message);
      console.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, getContractAddress]);

  // Add to whitelist (admin function)
  const addToWhitelist = useCallback(async (
    userAddress: string,
    reason: string,
    targetChainId?: number
  ): Promise<Hash | null> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      const contractAddress = getContractAddress(targetChainId);
      
      if (!contractAddress) throw new Error('Compliance contract not available');

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'addToWhitelist',
        args: [userAddress as Address, reason],
        account: walletClient.account,
        chain: undefined
      });
      
      console.log('Address added to whitelist');
      return hash;
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      const message = error instanceof Error ? error.message : 'Failed to add to whitelist';
      setError(message);
      console.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, getContractAddress]);

  // Remove from whitelist (admin function)
  const removeFromWhitelist = useCallback(async (
    userAddress: string,
    targetChainId?: number
  ): Promise<Hash | null> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      const contractAddress = getContractAddress(targetChainId);
      
      if (!contractAddress) throw new Error('Compliance contract not available');

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'removeFromWhitelist',
        args: [userAddress as Address],
        account: walletClient.account,
        chain: undefined
      });
      
      console.log('Address removed from whitelist');
      return hash;
    } catch (error) {
      console.error('Error removing from whitelist:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove from whitelist';
      setError(message);
      console.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, getContractAddress]);

  // Get comprehensive compliance report
  const getComplianceReport = useCallback(async (
    userAddress: string,
    region: Region = Region.UNRESTRICTED,
    targetChainId?: number
  ): Promise<ComplianceReport | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const [status, amlData, velocityCheck, blacklisted, whitelisted, kycValid, regionAllowed] = await Promise.all([
        getComplianceStatus(userAddress, targetChainId),
        getAMLData(userAddress, targetChainId),
        getVelocityCheck(userAddress, targetChainId),
        isBlacklisted(userAddress, targetChainId),
        isWhitelisted(userAddress, targetChainId),
        hasValidKYC(userAddress, targetChainId),
        isRegionAllowed(userAddress, region, targetChainId),
      ]);

      const report: ComplianceReport = {
        status,
        amlData,
        blacklisted,
        whitelisted,
        kycValid,
        regionAllowed,
        lastUpdate: new Date(),
      };

      // Update local state
      setComplianceData(prev => ({
        ...prev,
        status,
        amlData,
        velocityCheck,
        lastUpdate: new Date(),
      }));

      return report;
    } catch (error) {
      console.error('Error getting compliance report:', error);
      setError(error instanceof Error ? error.message : 'Failed to get compliance report');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getComplianceStatus, getAMLData, getVelocityCheck, isBlacklisted, isWhitelisted, hasValidKYC, isRegionAllowed]);

  // Pre-flight compliance check for transactions
  const preflightCheck = useCallback(async (
    userAddress: string,
    amount: string,
    assetType: string,
    region: Region = Region.UNRESTRICTED,
    targetChainId?: number
  ): Promise<{
    canProceed: boolean;
    warnings: string[];
    errors: string[];
    requiredActions: string[];
  }> => {
    const warnings: string[] = [];
    const errors: string[] = [];
    const requiredActions: string[] = [];

    try {
      const report = await getComplianceReport(userAddress, region, targetChainId);
      if (!report) {
        errors.push('Unable to fetch compliance data');
        return { canProceed: false, warnings, errors, requiredActions };
      }

      // Check if blacklisted
      if (report.blacklisted) {
        errors.push('Address is blacklisted');
      }

      // Check KYC
      if (!report.kycValid) {
        errors.push('KYC verification required');
        requiredActions.push('Complete KYC verification');
      }

      // Check region
      if (!report.regionAllowed) {
        errors.push('Transaction not allowed in your region');
      }

      // Check compliance status
      if (report.status && !report.status.isCompliant) {
        errors.push('Address is not compliant');
        requiredActions.push('Complete compliance verification');
      }

      // Check AML
      if (report.amlData) {
        if (report.amlData.flaggedForReview) {
          errors.push('Account flagged for AML review');
          requiredActions.push('Contact support for AML review');
        }

        if (report.amlData.suspiciousActivityScore > 80) {
          warnings.push('High suspicious activity score detected');
        }
      }

      // Check transaction amount against regional limits
      if (report.status) {
        const policy = await getRegionalPolicy(region, targetChainId);
        if (policy && policy.isRestricted) {
          const txAmount = parseFloat(amount);
          const maxAmount = parseFloat(policy.maxTransactionAmount);
          
          if (txAmount > maxAmount) {
            errors.push(`Transaction amount exceeds regional limit of ${policy.maxTransactionAmount} ETH`);
          }

          if (policy.requiresAdditionalVerification) {
            warnings.push('Additional verification may be required');
          }
        }
      }

      // Check velocity limits
      const velocityCheck = await getVelocityCheck(userAddress, targetChainId);
      if (velocityCheck && !velocityCheck.isWithinLimits) {
        errors.push('Transaction would exceed velocity limits');
        requiredActions.push('Wait for limits to reset or contact support');
      }

      // Risk level warnings
      if (report.status?.riskLevel === RiskLevel.HIGH) {
        warnings.push('High risk profile - enhanced monitoring active');
      } else if (report.status?.riskLevel === RiskLevel.CRITICAL) {
        errors.push('Critical risk profile - transactions restricted');
      }

      const canProceed = errors.length === 0;
      return { canProceed, warnings, errors, requiredActions };

    } catch (error) {
      console.error('Preflight check failed:', error);
      return {
        canProceed: false,
        warnings: [],
        errors: ['Failed to perform compliance check'],
        requiredActions: ['Retry transaction or contact support']
      };
    }
  }, [getComplianceReport, getRegionalPolicy, getVelocityCheck]);

  // Watch compliance events
  const watchComplianceEvents = useCallback((userAddress: string, targetChainId?: number) => {
    if (!publicClient) return null;

    const contractAddress = getContractAddress(targetChainId);
    if (!contractAddress) return null;

    // Watch for compliance status updates
    const unwatch = publicClient.watchContractEvent({
      address: contractAddress,
      abi: COMPLIANCE_EVENTS_ABI,
      eventName: 'ComplianceStatusUpdated',
      args: { user: userAddress as Address },
      onLogs: (logs) => {
        logs.forEach((log) => {
          console.log('Compliance status updated:', log.args);
          console.log(`Compliance status updated for ${log.args.user}`);
          
          // Refresh compliance data
          if (log.args.user?.toLowerCase() === userAddress.toLowerCase()) {
            getComplianceStatus(userAddress, targetChainId);
          }
        });
      },
    });

    return unwatch;
  }, [publicClient, getContractAddress, getComplianceStatus]);

  // Format compliance level for display
  const formatComplianceLevel = useCallback((level: ComplianceLevel): string => {
    return COMPLIANCE_LEVEL_LABELS[level] || 'Unknown';
  }, []);

  // Format risk level for display
  const formatRiskLevel = useCallback((level: RiskLevel): string => {
    return RISK_LEVEL_LABELS[level] || 'Unknown';
  }, []);

  // Get compliance status color for UI
  const getComplianceStatusColor = useCallback((status: ComplianceStatus | null): string => {
    if (!status) return 'gray';
    
    if (!status.isCompliant) return 'red';
    
    switch (status.riskLevel) {
      case RiskLevel.LOW:
        return 'green';
      case RiskLevel.MEDIUM:
        return 'yellow';
      case RiskLevel.HIGH:
        return 'orange';
      case RiskLevel.CRITICAL:
        return 'red';
      default:
        return 'gray';
    }
  }, []);

  // Check if compliance data is expired
  const isComplianceExpired = useCallback((status: ComplianceStatus | null): boolean => {
    if (!status || !status.expiryTimestamp) return false;
    return Date.now() > status.expiryTimestamp * 1000;
  }, []);

  // Get compliance expiry warning
  const getExpiryWarning = useCallback((status: ComplianceStatus | null): string | null => {
    if (!status || !status.expiryTimestamp) return null;
    
    const expiryTime = status.expiryTimestamp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    
    if (timeUntilExpiry < 0) {
      return 'Compliance status has expired';
    } else if (timeUntilExpiry < 7 * 24 * 60 * 60 * 1000) { // 7 days
      const days = Math.ceil(timeUntilExpiry / (24 * 60 * 60 * 1000));
      return `Compliance status expires in ${days} day${days !== 1 ? 's' : ''}`;
    }
    
    return null;
  }, []);

  // Auto-refresh compliance data
  useEffect(() => {
    if (!address || !isConnected) return;

    const refreshInterval = setInterval(() => {
      getComplianceReport(address);
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [address, isConnected, getComplianceReport]);

  // Listen for compliance events on the current user
  useEffect(() => {
    if (!address || !isConnected) return;

    const unwatch = watchComplianceEvents(address);
    return () => {
      if (unwatch) unwatch();
    };
  }, [address, isConnected, watchComplianceEvents]);

  return {
    // State
    isLoading,
    error,
    complianceData,
    chainId,
    isConnected,

    // Read functions
    isCompliant,
    hasValidKYC,
    isRegionAllowed,
    isBlacklisted,
    isWhitelisted,
    getComplianceStatus,
    getAMLData,
    getVelocityCheck,
    getRegionalPolicy,
    getComplianceReport,
    preflightCheck,

    // Admin functions
    updateComplianceStatus,
    addToBlacklist,
    removeFromBlacklist,
    addToWhitelist,
    removeFromWhitelist,

    // Event watching
    watchComplianceEvents,

    // Utility functions
    formatComplianceLevel,
    formatRiskLevel,
    getComplianceStatusColor,
    isComplianceExpired,
    getExpiryWarning,
    clearError: () => setError(null),

    // Constants for UI
    ComplianceLevel,
    Region,
    RiskLevel,
    COMPLIANCE_LEVEL_LABELS,
    RISK_LEVEL_LABELS,
  };
};