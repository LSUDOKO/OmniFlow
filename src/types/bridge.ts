export interface NetworkStatus {
  chainId: number;
  name: string;
  status: "online" | "congested" | "offline";
  gasPrice: string;
  congestion: number;
  lastBlock: number;
  validators: number;
  bridgeBalance: string;
}

export interface BridgeMetrics {
  totalVolume24h: string;
  totalTransactions24h: number;
  averageTime: string;
  successRate: number;
  totalValueLocked: string;
}

export interface BridgeTransfer {
  id: string;
  sourceChain: "ethereum" | "solana" | "polygon" | "bsc";
  targetChain: "ethereum" | "solana" | "polygon" | "bsc";
  tokenAddress: string;
  amount: string;
  recipient: string;
  sender: string;
  status: "pending" | "confirmed" | "redeemed" | "failed";
  txHash?: string;
  vaaBytes?: Uint8Array;
  sequence?: string;
  timestamp: number;
}

export interface RWABridgeMetadata {
  name: string;
  symbol: string;
  decimals: number;
  rwaType: string;
  assetValue: number;
  verificationHash: string;
  complianceLevel: string;
}

export interface GasTracker {
  chainId: number;
  chainName: string;
  gasPrice: {
    slow: number;
    standard: number;
    fast: number;
  };
  congestion: number;
  estimatedTime: {
    slow: string;
    standard: string;
    fast: string;
  };
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

export interface BridgeAlert {
  id: string;
  type: 'congestion' | 'high_gas' | 'network_issue' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  affectedChains: string[];
  timestamp: Date;
  isActive: boolean;
}

export interface TransferEstimate {
  estimatedTime: string;
  estimatedFee: string;
  confidence: number;
  route: string[];
  warnings?: string[];
}
