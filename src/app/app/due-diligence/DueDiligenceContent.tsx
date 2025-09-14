"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Brain,
  FileText,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  Globe,
  Leaf,
  Users,
  Building,
  Zap,
  Download,
  Eye,
  Search,
  Filter,
  Star,
  ArrowRight,
  Info,
  Loader
} from 'lucide-react';

const sampleAssets = [
  {
    id: 'manhattan-office-complex',
    name: 'Manhattan Office Complex',
    type: 'Real Estate',
    value: '$12.5M',
    location: 'New York, USA',
    riskScore: 25,
    aiScore: 92,
    esgScore: 78,
    yieldProjection: 8.5,
    confidence: 94,
    lastAnalyzed: '2 hours ago',
    status: 'completed'
  },
  {
    id: 'gold-bars-vault',
    name: 'Swiss Gold Vault Collection',
    type: 'Precious Metals',
    value: '$8.2M',
    location: 'Zurich, Switzerland',
    riskScore: 15,
    aiScore: 88,
    esgScore: 65,
    yieldProjection: 6.2,
    confidence: 91,
    lastAnalyzed: '4 hours ago',
    status: 'completed'
  },
  {
    id: 'carbon-credits-forest',
    name: 'Amazon Rainforest Carbon Credits',
    type: 'Carbon Credits',
    value: '$3.8M',
    location: 'Brazil',
    riskScore: 45,
    aiScore: 85,
    esgScore: 95,
    yieldProjection: 12.3,
    confidence: 87,
    lastAnalyzed: '1 day ago',
    status: 'completed'
  },
  {
    id: 'renewable-energy-farm',
    name: 'Solar Energy Farm Portfolio',
    type: 'Renewable Energy',
    value: '$15.7M',
    location: 'California, USA',
    riskScore: 30,
    aiScore: 90,
    esgScore: 92,
    yieldProjection: 9.8,
    confidence: 89,
    lastAnalyzed: '6 hours ago',
    status: 'completed'
  }
];

const riskLevels = {
  'very-low': { label: 'Very Low', color: 'text-green-400', bg: 'bg-green-500/20' },
  'low': { label: 'Low', color: 'text-green-300', bg: 'bg-green-500/15' },
  'medium': { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  'high': { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  'very-high': { label: 'Very High', color: 'text-red-400', bg: 'bg-red-500/20' }
};

const getRiskLevel = (score: number) => {
  if (score <= 20) return riskLevels['very-low'];
  if (score <= 35) return riskLevels['low'];
  if (score <= 50) return riskLevels['medium'];
  if (score <= 70) return riskLevels['high'];
  return riskLevels['very-high'];
};

export default function DueDiligenceContent() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { address, isConnected } = useAccount();

  const filteredAssets = sampleAssets.filter(asset => {
    const matchesType = filterType === 'all' || asset.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const runAIAnalysis = async (assetId: string) => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const AssetCard = ({ asset }: { asset: typeof sampleAssets[0] }) => {
    const riskLevel = getRiskLevel(asset.riskScore);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedAsset(asset.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{asset.name}</h3>
            <p className="text-blue-300 text-sm">{asset.type} • {asset.location}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gold-400">{asset.value}</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${riskLevel.bg} ${riskLevel.color}`}>
              {riskLevel.label} Risk
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Brain className="w-4 h-4 text-purple-400 mr-1" />
              <span className="text-xs text-gray-400">AI Score</span>
            </div>
            <p className="text-lg font-bold text-purple-300">{asset.aiScore}%</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Leaf className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-xs text-gray-400">ESG</span>
            </div>
            <p className="text-lg font-bold text-green-300">{asset.esgScore}%</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-gold-400 mr-1" />
              <span className="text-xs text-gray-400">Yield</span>
            </div>
            <p className="text-lg font-bold text-gold-300">{asset.yieldProjection}%</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-xs text-gray-400">Confidence</span>
            </div>
            <p className="text-lg font-bold text-blue-300">{asset.confidence}%</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            Analyzed {asset.lastAnalyzed}
          </div>
          <button className="flex items-center text-gold-400 hover:text-gold-300 transition-colors">
            <span className="text-sm font-medium mr-1">View Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const DetailedReport = ({ assetId }: { assetId: string }) => {
    const asset = sampleAssets.find(a => a.id === assetId);
    if (!asset) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedAsset(null)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{asset.name}</h2>
              <p className="text-blue-300">{asset.type} • {asset.location}</p>
            </div>
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-red-400 mr-2" />
                <h3 className="text-lg font-bold text-white">Risk Assessment</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Overall Risk</span>
                  <span className={`font-bold ${getRiskLevel(asset.riskScore).color}`}>
                    {getRiskLevel(asset.riskScore).label}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                    style={{ width: `${asset.riskScore}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Market volatility, liquidity, and regulatory factors considered
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-6 h-6 text-gold-400 mr-2" />
                <h3 className="text-lg font-bold text-white">Yield Projection</h3>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-gold-400">{asset.yieldProjection}%</div>
                <div className="text-sm text-gray-300">Annual Projected Return</div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Conservative</span>
                  <span className="text-green-400">{(asset.yieldProjection - 2).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Optimistic</span>
                  <span className="text-green-400">{(asset.yieldProjection + 3).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <Leaf className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-lg font-bold text-white">ESG Score</h3>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-green-400">{asset.esgScore}/100</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Environmental</span>
                    <span className="text-green-400">85</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Social</span>
                    <span className="text-green-400">78</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Governance</span>
                    <span className="text-green-400">92</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 text-purple-400 mr-2" />
                AI Analysis Summary
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>• Strong fundamentals with consistent cash flow generation</p>
                <p>• Location premium in high-demand metropolitan area</p>
                <p>• Well-diversified tenant base reducing vacancy risk</p>
                <p>• Recent renovations enhance long-term value proposition</p>
                <p>• Regulatory environment favorable for continued operations</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                Key Risk Factors
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>• Interest rate sensitivity may impact valuation</p>
                <p>• Market concentration in single geographic region</p>
                <p>• Potential for increased competition in local market</p>
                <p>• Regulatory changes could affect operating costs</p>
                <p>• Economic downturn may impact tenant demand</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Analysis completed {asset.lastAnalyzed}
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
              <button 
                onClick={() => runAIAnalysis(asset.id)}
                disabled={isAnalyzing}
                className="px-6 py-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors flex items-center disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Due Diligence
          </h1>
          <p className="text-lg text-gray-300">
            Advanced AI-powered analysis for informed investment decisions
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Assets Analyzed', value: '1,247', icon: FileText, color: 'text-blue-400' },
          { label: 'AI Accuracy', value: '94.2%', icon: Brain, color: 'text-purple-400' },
          { label: 'Avg Analysis Time', value: '2.3s', icon: Zap, color: 'text-gold-400' },
          { label: 'Risk Alerts', value: '23', icon: AlertTriangle, color: 'text-red-400' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-300 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-blue-400/50 rounded-xl text-blue-50 placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-300/80 transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/20 border-2 border-purple-400/50 rounded-xl text-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-300/80 transition-all appearance-none"
              >
                <option value="all">All Types</option>
                <option value="real estate">Real Estate</option>
                <option value="precious metals">Precious Metals</option>
                <option value="carbon credits">Carbon Credits</option>
                <option value="renewable energy">Renewable Energy</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assets Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredAssets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <AssetCard asset={asset} />
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Report Modal */}
      <AnimatePresence>
        {selectedAsset && <DetailedReport assetId={selectedAsset} />}
      </AnimatePresence>
    </div>
  );
}
