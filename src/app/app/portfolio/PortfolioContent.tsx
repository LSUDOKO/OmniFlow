"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Activity,
  Wallet,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Send,
  Download,
  Filter,
  Calendar,
  Building,
  Leaf,
  Gem,
  Factory,
  Globe,
  Shield,
  Zap,
  RefreshCw
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import Link from "next/link";
import { portfolioService, PortfolioAsset as ServicePortfolioAsset } from "@/services/portfolioService";
import { useWallet } from '@solana/wallet-adapter-react';

interface PortfolioAsset {
  id: string;
  name: string;
  type: 'real-estate' | 'carbon-credits' | 'precious-metals' | 'commodities';
  amount: number;
  value: number;
  purchasePrice: number;
  currentPrice: number;
  change24h: number;
  changeTotal: number;
  fractions: number;
  totalFractions: number;
  yield: number;
  chain: string;
  lastUpdated: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'yield' | 'transfer';
  asset: string;
  amount: number;
  price: number;
  total: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
}

const mockPortfolioAssets: PortfolioAsset[] = [
  {
    id: '1',
    name: 'Manhattan Office Complex',
    type: 'real-estate',
    amount: 125,
    value: 312500,
    purchasePrice: 2400,
    currentPrice: 2500,
    change24h: 2.5,
    changeTotal: 4.17,
    fractions: 125,
    totalFractions: 2000,
    yield: 8.5,
    chain: 'Ethereum',
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Amazon Carbon Credits',
    type: 'carbon-credits',
    amount: 2500,
    value: 112500,
    purchasePrice: 42,
    currentPrice: 45,
    change24h: -1.2,
    changeTotal: 7.14,
    fractions: 2500,
    totalFractions: 50000,
    yield: 12.3,
    chain: 'Polygon',
    lastUpdated: '2024-01-15T10:25:00Z',
  },
  {
    id: '3',
    name: 'Swiss Gold Reserves',
    type: 'precious-metals',
    amount: 25,
    value: 3125000,
    purchasePrice: 120000,
    currentPrice: 125000,
    change24h: 4.8,
    changeTotal: 4.17,
    fractions: 25,
    totalFractions: 200,
    yield: 5.2,
    chain: 'OneChain',
    lastUpdated: '2024-01-15T10:20:00Z',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    asset: 'Manhattan Office Complex',
    amount: 50,
    price: 2500,
    total: 125000,
    timestamp: '2024-01-15T09:30:00Z',
    status: 'completed',
    txHash: '0x1234567890abcdef...',
  },
  {
    id: '2',
    type: 'yield',
    asset: 'Swiss Gold Reserves',
    amount: 25,
    price: 0,
    total: 1625,
    timestamp: '2024-01-15T08:00:00Z',
    status: 'completed',
    txHash: '0xabcdef1234567890...',
  },
  {
    id: '3',
    type: 'sell',
    asset: 'Amazon Carbon Credits',
    amount: 500,
    price: 45,
    total: 22500,
    timestamp: '2024-01-14T16:45:00Z',
    status: 'completed',
    txHash: '0x9876543210fedcba...',
  },
];

const assetTypeIcons = {
  'real-estate': Building,
  'carbon-credits': Leaf,
  'precious-metals': Gem,
  'commodities': Factory,
};

const assetTypeColors = {
  'real-estate': 'from-blue-500 to-cyan-500',
  'carbon-credits': 'from-green-500 to-emerald-500',
  'precious-metals': 'from-yellow-500 to-orange-500',
  'commodities': 'from-purple-500 to-pink-500',
};

const chainColors = {
  'Ethereum': 'bg-blue-500',
  'Polygon': 'bg-purple-500',
  'OneChain': 'bg-gold-500',
  'BSC': 'bg-yellow-500',
};

export default function PortfolioContent() {
  const { connected, publicKey } = useWallet();
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('24h');
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'transactions' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load portfolio data on component mount and wallet connection
  useEffect(() => {
    loadPortfolioData();
  }, [connected, publicKey]);

  // Auto-refresh portfolio data every 30 seconds when connected
  useEffect(() => {
    if (!connected || !publicKey) return;
    
    const interval = setInterval(() => {
      loadPortfolioData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [connected, publicKey]);

  // Listen for storage changes to update portfolio in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage event received:', e.key, e.newValue);
      if (e.key && e.key.includes('omniflow_rwa_assets_')) {
        console.log('Portfolio storage event detected, refreshing...');
        // Portfolio data changed, refresh
        setTimeout(() => {
          loadPortfolioData();
        }, 500); // Small delay to ensure storage is updated
      }
    };
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageEvent = (e: CustomEvent) => {
      console.log('Custom storage event received:', e.detail);
      if (e.detail?.key?.includes('omniflow_rwa_assets_')) {
        console.log('Portfolio custom event detected, refreshing...');
        setTimeout(() => {
          loadPortfolioData();
        }, 500);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolio-update' as any, handleCustomStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolio-update' as any, handleCustomStorageEvent);
    };
  }, []);

  const loadPortfolioData = async () => {
    setLoading(true);
    try {
      if (connected && publicKey) {
        // Set wallet address in portfolio service
        portfolioService.setWalletAddress(publicKey.toString());
        
        // Get portfolio analytics which includes purchased RWA assets
        const analytics = await portfolioService.getPortfolioAnalytics();
        
        // Convert service portfolio assets to component format
        const convertedAssets: PortfolioAsset[] = analytics.assets.map(asset => ({
          id: asset.id,
          name: asset.name,
          type: mapAssetTypeToLocal(asset.assetType),
          amount: asset.shares,
          value: asset.totalValue,
          purchasePrice: asset.purchasePrice,
          currentPrice: asset.currentPrice,
          change24h: Math.random() * 10 - 5, // Mock 24h change for demo
          changeTotal: asset.unrealizedGainLossPercentage,
          fractions: asset.shares,
          totalFractions: asset.totalShares,
          yield: asset.dividendYield,
          chain: 'Solana', // Default to Solana for RWA assets
          lastUpdated: asset.lastUpdated
        }));

        setPortfolioAssets(convertedAssets);
        setLastRefresh(new Date());
      } else {
        // If not connected, show empty portfolio
        setPortfolioAssets([]);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setPortfolioAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Map service asset types to local component types
  const mapAssetTypeToLocal = (assetType: string): 'real-estate' | 'carbon-credits' | 'precious-metals' | 'commodities' => {
    const typeMap: { [key: string]: 'real-estate' | 'carbon-credits' | 'precious-metals' | 'commodities' } = {
      'Real Estate': 'real-estate',
      'Carbon Credits': 'carbon-credits',
      'Renewable Energy': 'commodities',
      'Agriculture': 'commodities',
      'Infrastructure': 'real-estate',
      'Precious Metals': 'precious-metals'
    };
    return typeMap[assetType] || 'commodities';
  };

  // Calculate portfolio stats
  const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange24h = portfolioAssets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
  const totalChangePercent = (totalChange24h / totalValue) * 100;
  const totalYield = portfolioAssets.reduce((sum, asset) => sum + (asset.value * asset.yield / 100), 0);
  const avgYield = (totalYield / totalValue) * 100;

  const PortfolioStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className={cn(
              "flex items-center space-x-1 text-sm font-medium",
              totalChangePercent >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {totalChangePercent >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{formatPercentage(totalChangePercent)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-sm text-white/60">Total Portfolio Value</div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm text-green-400 font-medium">
              +{avgYield.toFixed(1)}% APY
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCurrency(totalYield)}
          </div>
          <div className="text-sm text-white/60">Annual Yield</div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm text-blue-400 font-medium">
              {portfolioAssets.length} Assets
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCurrency(totalChange24h)}
          </div>
          <div className="text-sm text-white/60">24h Change</div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm text-purple-400 font-medium">
              {transactions.length} Transactions
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {transactions.filter(tx => tx.status === 'completed').length}
          </div>
          <div className="text-sm text-white/60">Completed</div>
        </GlassCard>
      </motion.div>
    </div>
  );

  const AssetAllocation = () => (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Asset Allocation</h3>
      <div className="space-y-4">
        {portfolioAssets.map((asset, index) => {
          const IconComponent = assetTypeIcons[asset.type];
          const percentage = (asset.value / totalValue) * 100;
          
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                  assetTypeColors[asset.type]
                )}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white">{asset.name}</div>
                  <div className="text-sm text-white/60">
                    {asset.fractions.toLocaleString()} fractions
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-white">{formatCurrency(asset.value)}</div>
                <div className="text-sm text-white/60">{percentage.toFixed(1)}%</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );

  const RecentTransactions = () => (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
        <Link href="/transactions">
          <button className="text-gold-400 hover:text-gold-300 text-sm font-medium flex items-center space-x-1">
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                tx.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                tx.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                tx.type === 'yield' ? 'bg-gold-500/20 text-gold-400' :
                'bg-blue-500/20 text-blue-400'
              )}>
                {tx.type === 'buy' && <ArrowDownRight className="w-5 h-5" />}
                {tx.type === 'sell' && <ArrowUpRight className="w-5 h-5" />}
                {tx.type === 'yield' && <Star className="w-5 h-5" />}
                {tx.type === 'transfer' && <Send className="w-5 h-5" />}
              </div>
              
              <div>
                <div className="font-medium text-white capitalize">
                  {tx.type} {tx.asset}
                </div>
                <div className="text-sm text-white/60">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={cn(
                "font-bold",
                tx.type === 'buy' || tx.type === 'transfer' ? 'text-red-400' : 'text-green-400'
              )}>
                {tx.type === 'buy' || tx.type === 'transfer' ? '-' : '+'}
                {formatCurrency(tx.total)}
              </div>
              <div className="text-sm text-white/60">
                {tx.amount.toLocaleString()} units
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
            Portfolio Dashboard
          </h1>
          <p className="text-xl text-gray-300">Track your RWA investments and performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl font-medium hover:from-gold-600 hover:to-gold-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadPortfolioData}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Portfolio'}</span>
          </motion.button>
          
          <Link href="/app/solana-rwa">
            <motion.button 
              className="px-4 py-2 border border-white/20 rounded-xl text-white hover:border-white/40 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Assets
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'assets', label: 'Assets', icon: Building },
          { id: 'transactions', label: 'Transactions', icon: Activity },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all",
              activeTab === tab.id
                ? "bg-gold-500/20 text-gold-400"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PortfolioStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AssetAllocation />
              <RecentTransactions />
            </div>
          </motion.div>
        )}

        {activeTab === 'assets' && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
              </div>
            ) : portfolioAssets.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Wallet className="w-12 h-12 text-gray-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">No Assets Yet</h3>
                <p className="text-gray-400 mb-6">
                  {connected 
                    ? "Start building your RWA portfolio by purchasing assets from the marketplace."
                    : "Connect your wallet to view your portfolio assets."
                  }
                </p>
                <div className="flex justify-center space-x-4">
                  {connected && (
                    <Link href="/app/solana-rwa">
                      <motion.button 
                        className="px-6 py-3 bg-gold-500/20 border border-gold-400/50 text-gold-300 rounded-xl hover:bg-gold-500/30 transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Browse RWA Assets
                      </motion.button>
                    </Link>
                  )}
                  <motion.button 
                    onClick={loadPortfolioData}
                    className="px-6 py-3 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors font-medium flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {portfolioAssets.map((asset, index) => {
                const IconComponent = assetTypeIcons[asset.type];
                
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <GlassCard className="p-6 group cursor-pointer hover:shadow-glow relative overflow-hidden">
                      {/* New Asset Indicator */}
                      {Date.now() - new Date(asset.lastUpdated).getTime() < 60000 && (
                        <motion.div
                          className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          NEW!
                        </motion.div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <motion.div 
                          className={cn(
                            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                            assetTypeColors[asset.type]
                          )}
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        <div className={cn("px-2 py-1 rounded-full text-xs font-medium text-white", chainColors[asset.chain])}>
                          {asset.chain}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2">{asset.name}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/60">Holdings</span>
                          <span className="text-white font-medium">
                            {asset.fractions.toLocaleString()} fractions
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-white/60">Current Value</span>
                          <span className="text-gold-400 font-bold">
                            {formatCurrency(asset.value)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-white/60">24h Change</span>
                          <span className={cn(
                            "font-medium flex items-center space-x-1",
                            asset.change24h >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {asset.change24h >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span>{formatPercentage(asset.change24h)}</span>
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-white/60">Yield</span>
                          <span className="text-green-400 font-medium">
                            {asset.yield}% APY
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-6">
                        <motion.button 
                          className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-4 rounded-xl font-medium hover:from-gold-600 hover:to-gold-700 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Trade
                        </motion.button>
                        <motion.button 
                          className="px-4 py-2 border border-white/20 rounded-xl text-white hover:border-white/40 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
            )}
          </motion.div>
        )}

        {(activeTab === 'transactions' || activeTab === 'analytics') && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {activeTab === 'transactions' ? <Activity className="w-8 h-8 text-white" /> : <BarChart3 className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {activeTab === 'transactions' ? 'Transaction History' : 'Portfolio Analytics'}
            </h2>
            <p className="text-xl text-gray-300 mb-8">This section is under development.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
