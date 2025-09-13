import { GraphQLClient } from 'graphql-request';

// TheGraph subgraph endpoints for RWA data
const SUBGRAPH_URLS = {
  ethereum: process.env.NEXT_PUBLIC_ETHEREUM_SUBGRAPH_URL || '',
  polygon: process.env.NEXT_PUBLIC_POLYGON_SUBGRAPH_URL || '',
  bsc: process.env.NEXT_PUBLIC_BSC_SUBGRAPH_URL || '',
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_SUBGRAPH_URL || '',
};

// GraphQL queries for RWA market data
export const MARKET_QUERIES = {
  // Get total value locked across all vaults
  GET_TVL: `
    query GetTotalValueLocked {
      vaults {
        id
        totalAssets
        totalShares
        pricePerShare
        lastUpdateTimestamp
      }
    }
  `,

  // Get trading volume and activity
  GET_VOLUME_24H: `
    query GetVolume24h($timestamp: BigInt!) {
      deposits(where: { timestamp_gte: $timestamp }) {
        amount
        timestamp
        user {
          id
        }
      }
      withdrawals(where: { timestamp_gte: $timestamp }) {
        amount
        timestamp
        user {
          id
        }
      }
    }
  `,

  // Get top traders by volume
  GET_TOP_TRADERS: `
    query GetTopTraders($limit: Int!) {
      users(
        first: $limit
        orderBy: totalVolume
        orderDirection: desc
        where: { totalVolume_gt: "0" }
      ) {
        id
        totalVolume
        totalDeposits
        totalWithdrawals
        transactionCount
        lastActivityTimestamp
      }
    }
  `,

  // Get asset class distribution
  GET_ASSET_CLASSES: `
    query GetAssetClasses {
      rwaTokens {
        id
        name
        symbol
        assetType
        totalSupply
        marketCap
        priceUSD
        volume24h
        holders
      }
    }
  `,

  // Get yield vault statistics
  GET_VAULT_STATS: `
    query GetVaultStats {
      vaults {
        id
        name
        totalAssets
        totalShares
        pricePerShare
        apy
        performanceFee
        managementFee
        totalYieldGenerated
        totalUsers
        lastUpdateTimestamp
      }
    }
  `,

  // Get recent transactions
  GET_RECENT_TRANSACTIONS: `
    query GetRecentTransactions($limit: Int!) {
      transactions(
        first: $limit
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        type
        amount
        user {
          id
        }
        vault {
          id
          name
        }
        timestamp
        gasUsed
        gasPrice
      }
    }
  `,
};

class TheGraphClient {
  private clients: Map<string, GraphQLClient> = new Map();

  constructor() {
    // Initialize GraphQL clients for each network
    Object.entries(SUBGRAPH_URLS).forEach(([network, url]) => {
      if (url) {
        this.clients.set(network, new GraphQLClient(url));
      }
    });
  }

  // Fetch data from a specific network
  async queryNetwork<T = any>(
    network: string,
    query: string,
    variables?: Record<string, any>
  ): Promise<T | null> {
    const client = this.clients.get(network);
    if (!client) {
      console.warn(`No subgraph client configured for network: ${network}`);
      return null;
    }

    try {
      const data = await client.request<T>(query, variables);
      return data;
    } catch (error) {
      console.error(`Error querying ${network} subgraph:`, error);
      return null;
    }
  }

  // Fetch data from all networks and aggregate
  async queryAllNetworks<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<Record<string, T | null>> {
    const promises = Array.from(this.clients.keys()).map(async (network) => {
      const data = await this.queryNetwork<T>(network, query, variables);
      return { network, data };
    });

    const results = await Promise.allSettled(promises);
    const aggregated: Record<string, T | null> = {};

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        aggregated[result.value.network] = result.value.data;
      }
    });

    return aggregated;
  }

  // Get total value locked across all networks
  async getTotalValueLocked(): Promise<{
    total: number;
    byNetwork: Record<string, number>;
  }> {
    const results = await this.queryAllNetworks(MARKET_QUERIES.GET_TVL);
    
    let total = 0;
    const byNetwork: Record<string, number> = {};

    Object.entries(results).forEach(([network, data]) => {
      if (data?.vaults) {
        const networkTVL = data.vaults.reduce((sum: number, vault: any) => {
          return sum + parseFloat(vault.totalAssets || '0');
        }, 0);
        
        byNetwork[network] = networkTVL;
        total += networkTVL;
      } else {
        byNetwork[network] = 0;
      }
    });

    return { total, byNetwork };
  }

  // Get 24h trading volume
  async getVolume24h(): Promise<{
    total: number;
    deposits: number;
    withdrawals: number;
    byNetwork: Record<string, { deposits: number; withdrawals: number }>;
  }> {
    const timestamp24hAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
    const results = await this.queryAllNetworks(MARKET_QUERIES.GET_VOLUME_24H, {
      timestamp: timestamp24hAgo.toString(),
    });

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    const byNetwork: Record<string, { deposits: number; withdrawals: number }> = {};

    Object.entries(results).forEach(([network, data]) => {
      if (data) {
        const deposits = data.deposits?.reduce((sum: number, deposit: any) => {
          return sum + parseFloat(deposit.amount || '0');
        }, 0) || 0;

        const withdrawals = data.withdrawals?.reduce((sum: number, withdrawal: any) => {
          return sum + parseFloat(withdrawal.amount || '0');
        }, 0) || 0;

        byNetwork[network] = { deposits, withdrawals };
        totalDeposits += deposits;
        totalWithdrawals += withdrawals;
      } else {
        byNetwork[network] = { deposits: 0, withdrawals: 0 };
      }
    });

    return {
      total: totalDeposits + totalWithdrawals,
      deposits: totalDeposits,
      withdrawals: totalWithdrawals,
      byNetwork,
    };
  }

  // Get top traders across all networks
  async getTopTraders(limit: number = 10): Promise<Array<{
    address: string;
    totalVolume: number;
    transactionCount: number;
    network: string;
    lastActivity: number;
  }>> {
    const results = await this.queryAllNetworks(MARKET_QUERIES.GET_TOP_TRADERS, {
      limit,
    });

    const allTraders: Array<{
      address: string;
      totalVolume: number;
      transactionCount: number;
      network: string;
      lastActivity: number;
    }> = [];

    Object.entries(results).forEach(([network, data]) => {
      if (data?.users) {
        data.users.forEach((user: any) => {
          allTraders.push({
            address: user.id,
            totalVolume: parseFloat(user.totalVolume || '0'),
            transactionCount: parseInt(user.transactionCount || '0'),
            network,
            lastActivity: parseInt(user.lastActivityTimestamp || '0'),
          });
        });
      }
    });

    // Sort by total volume and return top traders
    return allTraders
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, limit);
  }

  // Get asset class distribution
  async getAssetClasses(): Promise<Array<{
    name: string;
    type: string;
    marketCap: number;
    volume24h: number;
    holders: number;
    network: string;
  }>> {
    const results = await this.queryAllNetworks(MARKET_QUERIES.GET_ASSET_CLASSES);

    const allAssets: Array<{
      name: string;
      type: string;
      marketCap: number;
      volume24h: number;
      holders: number;
      network: string;
    }> = [];

    Object.entries(results).forEach(([network, data]) => {
      if (data?.rwaTokens) {
        data.rwaTokens.forEach((token: any) => {
          allAssets.push({
            name: token.name || token.symbol,
            type: token.assetType || 'Unknown',
            marketCap: parseFloat(token.marketCap || '0'),
            volume24h: parseFloat(token.volume24h || '0'),
            holders: parseInt(token.holders || '0'),
            network,
          });
        });
      }
    });

    return allAssets;
  }

  // Get vault statistics
  async getVaultStats(): Promise<{
    totalVaults: number;
    totalUsers: number;
    avgAPY: number;
    totalYieldGenerated: number;
    byNetwork: Record<string, any>;
  }> {
    const results = await this.queryAllNetworks(MARKET_QUERIES.GET_VAULT_STATS);

    let totalVaults = 0;
    let totalUsers = 0;
    let totalYieldGenerated = 0;
    let totalAPY = 0;
    let vaultCount = 0;
    const byNetwork: Record<string, any> = {};

    Object.entries(results).forEach(([network, data]) => {
      if (data?.vaults) {
        const vaults = data.vaults;
        totalVaults += vaults.length;

        const networkStats = vaults.reduce((acc: any, vault: any) => {
          acc.users += parseInt(vault.totalUsers || '0');
          acc.yieldGenerated += parseFloat(vault.totalYieldGenerated || '0');
          acc.apy += parseFloat(vault.apy || '0');
          return acc;
        }, { users: 0, yieldGenerated: 0, apy: 0 });

        byNetwork[network] = {
          vaults: vaults.length,
          users: networkStats.users,
          avgAPY: vaults.length > 0 ? networkStats.apy / vaults.length : 0,
          totalYieldGenerated: networkStats.yieldGenerated,
        };

        totalUsers += networkStats.users;
        totalYieldGenerated += networkStats.yieldGenerated;
        totalAPY += networkStats.apy;
        vaultCount += vaults.length;
      } else {
        byNetwork[network] = {
          vaults: 0,
          users: 0,
          avgAPY: 0,
          totalYieldGenerated: 0,
        };
      }
    });

    return {
      totalVaults,
      totalUsers,
      avgAPY: vaultCount > 0 ? totalAPY / vaultCount : 0,
      totalYieldGenerated,
      byNetwork,
    };
  }

  // Get recent transactions
  async getRecentTransactions(limit: number = 50): Promise<Array<{
    id: string;
    type: string;
    amount: number;
    user: string;
    vault: string;
    timestamp: number;
    network: string;
    gasUsed?: number;
    gasPrice?: number;
  }>> {
    const results = await this.queryAllNetworks(MARKET_QUERIES.GET_RECENT_TRANSACTIONS, {
      limit,
    });

    const allTransactions: Array<{
      id: string;
      type: string;
      amount: number;
      user: string;
      vault: string;
      timestamp: number;
      network: string;
      gasUsed?: number;
      gasPrice?: number;
    }> = [];

    Object.entries(results).forEach(([network, data]) => {
      if (data?.transactions) {
        data.transactions.forEach((tx: any) => {
          allTransactions.push({
            id: tx.id,
            type: tx.type,
            amount: parseFloat(tx.amount || '0'),
            user: tx.user?.id || '',
            vault: tx.vault?.name || tx.vault?.id || '',
            timestamp: parseInt(tx.timestamp || '0'),
            network,
            gasUsed: parseInt(tx.gasUsed || '0'),
            gasPrice: parseFloat(tx.gasPrice || '0'),
          });
        });
      }
    });

    // Sort by timestamp (most recent first)
    return allTransactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}

// Export singleton instance
export const theGraphClient = new TheGraphClient();

// Export utility functions
export const formatSubgraphData = {
  // Convert Wei to Ether
  fromWei: (value: string | number): number => {
    return parseFloat(value.toString()) / 1e18;
  },

  // Format timestamp to date
  timestampToDate: (timestamp: string | number): Date => {
    return new Date(parseInt(timestamp.toString()) * 1000);
  },

  // Calculate percentage change
  calculateChange: (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  },

  // Aggregate data by asset type
  aggregateByAssetType: (assets: any[]): Record<string, any> => {
    return assets.reduce((acc, asset) => {
      const type = asset.type || 'Unknown';
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalValue: 0,
          totalVolume: 0,
          holders: 0,
        };
      }
      acc[type].count += 1;
      acc[type].totalValue += asset.marketCap || 0;
      acc[type].totalVolume += asset.volume24h || 0;
      acc[type].holders += asset.holders || 0;
      return acc;
    }, {});
  },
};

export default theGraphClient;
