/**
 * Core types for SolanaFlow SDK
 */

export type ChainId = 'onechain' | 'ethereum' | 'polygon' | 'bsc' | 'solana';
export type Environment = 'mainnet' | 'testnet' | 'devnet';

export interface SDKConfig {
  chains: ChainId[];
  preferredChain: ChainId;
  environment: Environment;
  apiEndpoints: {
    rest: string;
    websocket: string;
  };
  rpcEndpoints: {
    [key in ChainId]?: string;
  };
  apiKeys?: {
    infura?: string;
    alchemy?: string;
    moralis?: string;
  };
  privateKey?: string;
}

export interface Asset {
  id: string;
  chainId: ChainId;
  contractAddress: string;
  tokenId: number;
  type: string;
  name: string;
  description: string;
  value: string;
  currency: string;
  owner: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface MarketplaceListing {
  id: string;
  assetId: string;
  chainId: ChainId;
  seller: string;
  price: string;
  currency: string;
  listingType: 'fixed' | 'auction';
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  createdAt: string;
  expiresAt?: string;
  bids?: Array<{
    bidder: string;
    amount: string;
    timestamp: string;
  }>;
}

export interface BridgeTransfer {
  id: string;
  assetId: string;
  sourceChainId: ChainId;
  targetChainId: ChainId;
  sender: string;
  recipient: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  lockTransactionHash?: string;
  mintTransactionHash?: string;
  createdAt: string;
  estimatedTime: number;
}

export interface DeFiPosition {
  id: string;
  assetId: string;
  chainId: ChainId;
  protocol: string;
  type: 'staking' | 'lending' | 'yield-farming';
  amount: string;
  apy: string;
  startDate: string;
  status: 'active' | 'completed' | 'cancelled';
  rewards: {
    earned: string;
    pending: string;
    claimed: string;
  };
}

export interface Transaction {
  hash: string;
  chainId: ChainId;
  from: string;
  to: string;
  value: string;
  gasPrice?: string;
  gasLimit?: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  timestamp?: string;
}

export interface SDKError {
  code: string;
  message: string;
  details?: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  chainId?: ChainId;
  owner?: string;
  status?: string;
  type?: string;
  minValue?: string;
  maxValue?: string;
}
