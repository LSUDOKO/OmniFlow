import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export interface MarketData {
  totalValueLocked: number;
  totalVolume24h: number;
  activeTraders: number;
  assetClasses: AssetClass[];
  topTraders: Trader[];
  chainDistribution: ChainData[];
  marketMetrics: MarketMetrics;
  lastUpdate: Date;
}

export interface AssetClass {
  name: string;
  value: number;
  percentage: number;
  change24h: number;
  color: string;
  icon: string;
  contractAddress?: string;
}

export interface Trader {
  address: string;
  volume24h: number;
  trades: number;
  pnl: number;
  avatar: string;
  verified: boolean;
}

export interface ChainData {
  name: string;
  chainId: number;
  tvl: number;
  percentage: number;
  transactions: number;
  color: string;
  logo: string;
  rpcUrl?: string;
}

export interface MarketMetrics {
  totalAssets: number;
  avgYield: number;
  marketCap: number;
  liquidityRatio: number;
}

// Contract ABIs for real data fetching
const YIELD_VAULT_ABI = [
  "function getTotalAssets() external view returns (uint256)",
  "function getTotalShares() external view returns (uint256)",
  "function pricePerShare() external view returns (uint256)",
  "function getVaultStats() external view returns (uint256, uint256, uint256, uint256, uint256)"
];

const RWA_TOKEN_ABI = [
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Contract addresses (from environment variables)
const CONTRACT_ADDRESSES = {
  ethereum: {
    yieldVault: process.env.NEXT_PUBLIC_ETHEREUM_YIELD_VAULT,
    rwaToken: process.env.NEXT_PUBLIC_ETHEREUM_RWA_TOKEN,
  },
  polygon: {
    yieldVault: process.env.NEXT_PUBLIC_POLYGON_YIELD_VAULT,
    rwaToken: process.env.NEXT_PUBLIC_POLYGON_RWA_TOKEN,
  },
  bsc: {
    yieldVault: process.env.NEXT_PUBLIC_BSC_YIELD_VAULT,
    rwaToken: process.env.NEXT_PUBLIC_BSC_RWA_TOKEN,
  }
};

// RPC URLs for different chains
const RPC_URLS = {
  ethereum: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
  polygon: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
  bsc: process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
};

// Mock data for demo purposes
const generateMockData = (): MarketData => {
  const baseTime = Date.now();
  const randomVariation = () => (Math.random() - 0.5) * 0.1; // ±5% variation

  return {
    totalValueLocked: 2847500000 * (1 + randomVariation()),
    totalVolume24h: 125600000 * (1 + randomVariation()),
    activeTraders: Math.floor(12847 * (1 + randomVariation())),
    assetClasses: [
      {
        name: "Real Estate",
        value: 1420000000 * (1 + randomVariation()),
        percentage: 49.8,
        change24h: 3.2 + randomVariation() * 10,
        color: "blue.500",
        icon: "🏢"
      },
      {
        name: "Commodities", 
        value: 682500000 * (1 + randomVariation()),
        percentage: 24.0,
        change24h: -1.8 + randomVariation() * 10,
        color: "orange.500",
        icon: "🌾"
      },
      {
        name: "Precious Metals",
        value: 455200000 * (1 + randomVariation()),
        percentage: 16.0,
        change24h: 2.1 + randomVariation() * 10,
        color: "yellow.500",
        icon: "🥇"
      },
      {
        name: "Carbon Credits",
        value: 199500000 * (1 + randomVariation()),
        percentage: 7.0,
        change24h: 8.5 + randomVariation() * 10,
        color: "green.500",
        icon: "🌱"
      },
      {
        name: "Art & Collectibles",
        value: 90300000 * (1 + randomVariation()),
        percentage: 3.2,
        change24h: -0.5 + randomVariation() * 10,
        color: "purple.500",
        icon: "🎨"
      }
    ],
    topTraders: [
      {
        address: "0x742d35Cc6634C0532925a3b8D87f1C0D5d4317A9",
        volume24h: 2450000 * (1 + randomVariation()),
        trades: Math.floor(23 * (1 + randomVariation())),
        pnl: 145000 * (1 + randomVariation()),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
        verified: true
      },
      {
        address: "0x8ba1f109551bD432803012645Hac136c22C85B",
        volume24h: 1890000 * (1 + randomVariation()),
        trades: Math.floor(18 * (1 + randomVariation())),
        pnl: 89000 * (1 + randomVariation()),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        verified: true
      },
      {
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        volume24h: 1650000 * (1 + randomVariation()),
        trades: Math.floor(31 * (1 + randomVariation())),
        pnl: -23000 * (1 + randomVariation()),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
        verified: false
      },
      {
        address: "0xA0b86a33E6441e8e421f4D7c6c1d8b8c5F8b2C3D",
        volume24h: 1420000 * (1 + randomVariation()),
        trades: Math.floor(15 * (1 + randomVariation())),
        pnl: 67000 * (1 + randomVariation()),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
        verified: true
      },
      {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        volume24h: 1280000 * (1 + randomVariation()),
        trades: Math.floor(27 * (1 + randomVariation())),
        pnl: 34000 * (1 + randomVariation()),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
        verified: false
      }
    ],
    chainDistribution: [
      {
        name: "Ethereum",
        chainId: 1,
        tvl: 1423750000 * (1 + randomVariation()),
        percentage: 50.0,
        transactions: Math.floor(1247 * (1 + randomVariation())),
        color: "blue.500",
        logo: "⟠"
      },
      {
        name: "Polygon",
        chainId: 137,
        tvl: 597375000 * (1 + randomVariation()),
        percentage: 21.0,
        transactions: Math.floor(3891 * (1 + randomVariation())),
        color: "purple.500",
        logo: "⬟"
      },
      {
        name: "BSC",
        chainId: 56,
        tvl: 455200000 * (1 + randomVariation()),
        percentage: 16.0,
        transactions: Math.floor(2156 * (1 + randomVariation())),
        color: "yellow.500",
        logo: "◆"
      },
      {
        name: "Solana",
        chainId: 0, // Solana doesn't use EVM chain IDs
        tvl: 284750000 * (1 + randomVariation()),
        percentage: 10.0,
        transactions: Math.floor(5432 * (1 + randomVariation())),
        color: "green.500",
        logo: "◉"
      },
      {
        name: "Arbitrum",
        chainId: 42161,
        tvl: 85425000 * (1 + randomVariation()),
        percentage: 3.0,
        transactions: Math.floor(892 * (1 + randomVariation())),
        color: "cyan.500",
        logo: "▲"
      }
    ],
    marketMetrics: {
      totalAssets: Math.floor(1847 * (1 + randomVariation())),
      avgYield: 8.7 + randomVariation() * 2,
      marketCap: 3200000000 * (1 + randomVariation()),
      liquidityRatio: 0.78 + randomVariation() * 0.1
    },
    lastUpdate: new Date()
  };
};

export const useRWAMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(false);

  // Fetch real on-chain data
  const fetchRealMarketData = useCallback(async (): Promise<MarketData | null> => {
    try {
      const providers = {
        ethereum: new ethers.providers.JsonRpcProvider(RPC_URLS.ethereum),
        polygon: new ethers.providers.JsonRpcProvider(RPC_URLS.polygon),
        bsc: new ethers.providers.JsonRpcProvider(RPC_URLS.bsc),
      };

      const chainData: ChainData[] = [];
      let totalTVL = 0;

      // Fetch data from each chain
      for (const [chainName, provider] of Object.entries(providers)) {
        try {
          const addresses = CONTRACT_ADDRESSES[chainName as keyof typeof CONTRACT_ADDRESSES];
          
          if (addresses?.yieldVault && addresses?.rwaToken) {
            const vaultContract = new ethers.Contract(addresses.yieldVault, YIELD_VAULT_ABI, provider);
            const tokenContract = new ethers.Contract(addresses.rwaToken, RWA_TOKEN_ABI, provider);

            // Get vault stats
            const [totalAssets, totalShares, currentAPY, totalYield, sharePrice] = await vaultContract.getVaultStats();
            const tvl = parseFloat(ethers.utils.formatEther(totalAssets));
            
            // Get recent transaction count (approximate)
            const latestBlock = await provider.getBlockNumber();
            const fromBlock = latestBlock - 7200; // ~24 hours of blocks
            const transferEvents = await tokenContract.queryFilter(
              tokenContract.filters.Transfer(),
              fromBlock,
              latestBlock
            );

            chainData.push({
              name: chainName.charAt(0).toUpperCase() + chainName.slice(1),
              chainId: chainName === 'ethereum' ? 1 : chainName === 'polygon' ? 137 : 56,
              tvl: tvl,
              percentage: 0, // Will calculate after getting all data
              transactions: transferEvents.length,
              color: chainName === 'ethereum' ? 'blue.500' : chainName === 'polygon' ? 'purple.500' : 'yellow.500',
              logo: chainName === 'ethereum' ? '⟠' : chainName === 'polygon' ? '⬟' : '◆'
            });

            totalTVL += tvl;
          }
        } catch (chainError) {
          console.warn(`Failed to fetch data from ${chainName}:`, chainError);
        }
      }

      // Calculate percentages
      chainData.forEach(chain => {
        chain.percentage = totalTVL > 0 ? (chain.tvl / totalTVL) * 100 : 0;
      });

      // For now, return mock data with some real elements
      const mockData = generateMockData();
      return {
        ...mockData,
        totalValueLocked: totalTVL > 0 ? totalTVL : mockData.totalValueLocked,
        chainDistribution: chainData.length > 0 ? chainData : mockData.chainDistribution,
      };

    } catch (error) {
      console.error('Error fetching real market data:', error);
      return null;
    }
  }, []);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: MarketData | null = null;

      if (useRealData) {
        data = await fetchRealMarketData();
      }

      // Fallback to mock data
      if (!data) {
        data = generateMockData();
      }

      setMarketData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      // Fallback to mock data on error
      setMarketData(generateMockData());
    } finally {
      setIsLoading(false);
    }
  }, [useRealData, fetchRealMarketData]);

  // Auto-refresh data
  useEffect(() => {
    fetchMarketData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Manual refresh
  const refreshData = useCallback(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Toggle between real and mock data
  const toggleDataSource = useCallback(() => {
    setUseRealData(prev => !prev);
  }, []);

  return {
    marketData,
    isLoading,
    error,
    refreshData,
    useRealData,
    toggleDataSource,
    lastUpdate: marketData?.lastUpdate
  };
};
