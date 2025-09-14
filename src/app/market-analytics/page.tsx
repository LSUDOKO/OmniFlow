"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Search,
  Globe,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Coins,
  Leaf,
  Palette
} from 'lucide-react';

interface MarketData {
  totalValueLocked: string;
  volume24h: string;
  activeTraders: number;
  averageYield: string;
  marketSentiment: number;
  volumeGrowth: number;
  newListings: number;
}

interface AssetPerformance {
  name: string;
  type: string;
  icon: string;
  priceChange: string;
  volume: string;
  marketCap: string;
  isPositive: boolean;
}

interface NetworkActivity {
  name: string;
  color: string;
  transactions: number;
  avgFee: string;
}

interface YieldOpportunity {
  protocol: string;
  assetType: string;
  apy: string;
  tvl: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskColor: string;
}

export default function MarketAnalyticsPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedChain, setSelectedChain] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [marketData, setMarketData] = useState<MarketData>({
    totalValueLocked: '$2.85B',
    volume24h: '$125.6M',
    activeTraders: 12847,
    averageYield: '8.7%',
    marketSentiment: 68,
    volumeGrowth: 24,
    newListings: 12
  });

  const assetPerformance: AssetPerformance[] = [
    {
      name: 'NYC Office Complex',
      type: 'Real Estate',
      icon: '🏢',
      priceChange: '+12.5%',
      volume: '$2.1M',
      marketCap: '$45.2M',
      isPositive: true
    },
    {
      name: 'Carbon Credits Pool',
      type: 'Carbon Credits',
      icon: '🌱',
      priceChange: '+8.3%',
      volume: '$1.8M',
      marketCap: '$32.1M',
      isPositive: true
    },
    {
      name: 'Gold Reserves',
      type: 'Precious Metals',
      icon: '🥇',
      priceChange: '+6.7%',
      volume: '$3.2M',
      marketCap: '$78.5M',
      isPositive: true
    }
  ];

  const networkActivity: NetworkActivity[] = [
    { name: 'Ethereum', color: 'bg-blue-500', transactions: 1247, avgFee: '$12.45' },
    { name: 'Polygon', color: 'bg-purple-500', transactions: 3891, avgFee: '$0.02' },
    { name: 'BSC', color: 'bg-yellow-500', transactions: 2156, avgFee: '$0.15' },
    { name: 'Solana', color: 'bg-green-500', transactions: 5432, avgFee: '$0.0001' }
  ];

  const yieldOpportunities: YieldOpportunity[] = [
    {
      protocol: 'OmniFlow Vault',
      assetType: 'Mixed RWA',
      apy: '8.5%',
      tvl: '$12.3M',
      riskLevel: 'Low',
      riskColor: 'bg-green-100 text-green-800'
    },
    {
      protocol: 'RWA Staking',
      assetType: 'Real Estate',
      apy: '12.1%',
      tvl: '$8.7M',
      riskLevel: 'Medium',
      riskColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      protocol: 'Carbon Pool',
      assetType: 'Carbon Credits',
      apy: '15.3%',
      tvl: '$5.2M',
      riskLevel: 'High',
      riskColor: 'bg-red-100 text-red-800'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // Simulate export functionality
    const data = JSON.stringify(marketData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market-analytics.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                RWA Market Analytics
              </h1>
              <p className="text-gray-600 text-lg">
                Real-time insights into the tokenized real-world asset ecosystem
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Chains</option>
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
                <option value="solana">Solana</option>
              </select>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <div className="hidden lg:block">
                <ConnectButton />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200"></div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{marketData.totalValueLocked}</h3>
            <p className="text-gray-600 text-sm">Total Value Locked</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+{marketData.volumeGrowth}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{marketData.volume24h}</h3>
            <p className="text-gray-600 text-sm">24h Volume</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-blue-600 font-medium">+8.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{marketData.activeTraders.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Active Traders</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+2.1%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{marketData.averageYield}</h3>
            <p className="text-gray-600 text-sm">Average Yield</p>
          </div>
        </motion.div>

        {/* Tabbed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['trends', 'performance', 'activity', 'yield'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'trends' ? 'Market Trends' : 
                     tab === 'performance' ? 'Asset Performance' :
                     tab === 'activity' ? 'Network Activity' : 'Yield Analytics'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'trends' && (
                  <motion.div
                    key="trends"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Market Sentiment */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        Market Sentiment
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Bullish Sentiment</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{marketData.marketSentiment}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: `${marketData.marketSentiment}%`}}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Trading Volume Growth</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">+{marketData.volumeGrowth}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${marketData.volumeGrowth + 50}%`}}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">New Asset Listings</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">+{marketData.newListings}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: `${marketData.newListings + 50}%`}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk Metrics */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
                        Risk Metrics
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Portfolio Volatility</span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Medium</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Liquidity Risk</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Low</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Correlation Risk</span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Medium</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Smart Contract Risk</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Low</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'performance' && (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                      Top Performing Assets (7D)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Change</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {assetPerformance.map((asset, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-3">{asset.icon}</span>
                                  <span className="font-semibold text-gray-900">{asset.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{asset.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`font-medium ${
                                  asset.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {asset.priceChange}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{asset.volume}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{asset.marketCap}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'activity' && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Network Activity */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 text-purple-600 mr-2" />
                        Network Activity
                      </h3>
                      <div className="space-y-4">
                        {networkActivity.map((network, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${network.color}`}></div>
                              <span className="text-gray-700">{network.name}</span>
                            </div>
                            <span className="font-bold text-gray-900">{network.transactions.toLocaleString()} TXs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Gas & Fees */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                        Gas & Fees
                      </h3>
                      <div className="space-y-4">
                        {networkActivity.map((network, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-700">Avg Fee ({network.name})</span>
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                              network.name === 'Ethereum' ? 'bg-blue-100 text-blue-800' :
                              network.name === 'Polygon' ? 'bg-purple-100 text-purple-800' :
                              network.name === 'BSC' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {network.avgFee}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'yield' && (
                  <motion.div
                    key="yield"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 text-green-600 mr-2" />
                      Yield Opportunities
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {yieldOpportunities.map((opportunity, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{opportunity.protocol}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{opportunity.assetType}</td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">{opportunity.apy}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{opportunity.tvl}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-sm font-medium ${opportunity.riskColor}`}>
                                  {opportunity.riskLevel}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
