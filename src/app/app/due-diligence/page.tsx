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
    name: 'LBMA Gold Bars Collection',
    type: 'Precious Metals',
    value: '$8.2M',
    location: 'London, UK',
    riskScore: 15,
    aiScore: 88,
    esgScore: 65,
    yieldProjection: 6.2,
    confidence: 89,
    lastAnalyzed: '1 day ago',
    status: 'completed'
  },
  {
    id: 'carbon-credits-forest',
    name: 'Amazon Forest Conservation Credits',
    type: 'Carbon Credits',
    value: '$3.8M',
    location: 'Brazil',
    riskScore: 45,
    aiScore: 85,
    esgScore: 95,
    yieldProjection: 12.8,
    confidence: 76,
    lastAnalyzed: '3 hours ago',
    status: 'completed'
  },
  {
    id: 'picasso-collection',
    name: 'Picasso Blue Period Collection',
    type: 'Art & Collectibles',
    value: '$25.7M',
    location: 'Paris, France',
    riskScore: 65,
    aiScore: 79,
    esgScore: 45,
    yieldProjection: 15.2,
    confidence: 68,
    lastAnalyzed: 'Analyzing...',
    status: 'analyzing'
  }
];

const analysisMetrics = [
  { label: 'Reports Generated', value: '1,247', change: '+23 today', icon: FileText },
  { label: 'Avg AI Score', value: '86.5', change: '+2.3 pts', icon: Brain },
  { label: 'Risk Mitigation', value: '94%', change: '+1.2%', icon: Shield },
  { label: 'Success Rate', value: '97.8%', change: '+0.5%', icon: Target }
];

export default function DueDiligencePage() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { address, isConnected } = useAccount();

  const filteredAssets = sampleAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || asset.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBadge = (score: number) => {
    if (score <= 30) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score <= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const startAnalysis = async (assetId: string) => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setSelectedAsset(assetId);
      setShowReport(true);
    }, 3000);
  };

  const selectedAssetData = sampleAssets.find(asset => asset.id === selectedAsset);

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-4">
              AI Due Diligence
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Comprehensive AI-powered analysis for RWA investments with risk assessment, yield projections, and ESG scoring
            </p>
          </div>
          <ConnectButton />
        </motion.div>

        {/* Analytics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {analysisMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-gold-400" />
                  <span className="text-sm text-green-400">{metric.change}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
          >
            <option value="all">All Types</option>
            <option value="real estate">Real Estate</option>
            <option value="precious metals">Precious Metals</option>
            <option value="carbon credits">Carbon Credits</option>
            <option value="art">Art & Collectibles</option>
          </select>
        </motion.div>

        {/* Asset Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
        >
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              {/* Asset Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{asset.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{asset.type}</span>
                    <span>•</span>
                    <span>{asset.location}</span>
                    <span>•</span>
                    <span>{asset.value}</span>
                  </div>
                </div>
                {asset.status === 'analyzing' ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm">
                    <Loader className="w-4 h-4 animate-spin" />
                    Analyzing
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Complete
                  </div>
                )}
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-400">AI Score</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{asset.aiScore}/100</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Risk Score</span>
                  </div>
                  <div className={`text-2xl font-bold ${getRiskColor(asset.riskScore)}`}>
                    {asset.riskScore}/100
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-400">ESG Score</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{asset.esgScore}/100</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-gold-400" />
                    <span className="text-sm text-gray-400">Yield Proj.</span>
                  </div>
                  <div className="text-2xl font-bold text-gold-400">{asset.yieldProjection}%</div>
                </div>
              </div>

              {/* Confidence & Last Analyzed */}
              <div className="flex justify-between items-center mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Confidence: </span>
                  <span className="text-white font-medium">{asset.confidence}%</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  {asset.lastAnalyzed}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {asset.status === 'completed' ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAsset(asset.id);
                        setShowReport(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Report
                    </button>
                    <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startAnalysis(asset.id)}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Start Analysis
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Report Modal */}
        <AnimatePresence>
          {showReport && selectedAssetData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowReport(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Report Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Due Diligence Report</h2>
                    <h3 className="text-xl text-gray-300 mb-4">{selectedAssetData.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{selectedAssetData.type}</span>
                      <span>•</span>
                      <span>{selectedAssetData.location}</span>
                      <span>•</span>
                      <span>Generated {selectedAssetData.lastAnalyzed}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReport(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Executive Summary */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-gold-400" />
                    Executive Summary
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    This {selectedAssetData.type.toLowerCase()} asset demonstrates strong investment potential with an AI confidence score of {selectedAssetData.confidence}%. 
                    The analysis indicates a projected annual yield of {selectedAssetData.yieldProjection}% with {selectedAssetData.riskScore <= 30 ? 'low' : selectedAssetData.riskScore <= 60 ? 'moderate' : 'high'} risk profile. 
                    ESG factors score favorably at {selectedAssetData.esgScore}/100, indicating sustainable investment practices.
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">{selectedAssetData.aiScore}</div>
                    <div className="text-sm text-gray-400">AI Score</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Shield className={`w-8 h-8 mx-auto mb-2 ${getRiskColor(selectedAssetData.riskScore)}`} />
                    <div className={`text-2xl font-bold mb-1 ${getRiskColor(selectedAssetData.riskScore)}`}>
                      {selectedAssetData.riskScore}
                    </div>
                    <div className="text-sm text-gray-400">Risk Score</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Leaf className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400 mb-1">{selectedAssetData.esgScore}</div>
                    <div className="text-sm text-gray-400">ESG Score</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gold-400 mb-1">{selectedAssetData.yieldProjection}%</div>
                    <div className="text-sm text-gray-400">Yield Projection</div>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className={`w-6 h-6 ${getRiskColor(selectedAssetData.riskScore)}`} />
                    Risk Analysis
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Market Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${selectedAssetData.riskScore <= 30 ? 'from-green-500 to-green-400' : selectedAssetData.riskScore <= 60 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400'}`} style={{ width: `${selectedAssetData.riskScore}%` }} />
                        </div>
                        <span className={`text-sm font-medium ${getRiskColor(selectedAssetData.riskScore)}`}>
                          {selectedAssetData.riskScore <= 30 ? 'Low' : selectedAssetData.riskScore <= 60 ? 'Medium' : 'High'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Key risk factors include market volatility, regulatory changes, and liquidity constraints. 
                      Mitigation strategies have been identified and implemented.
                    </div>
                  </div>
                </div>

                {/* ESG Assessment */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-green-400" />
                    ESG Assessment
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{Math.floor(selectedAssetData.esgScore * 0.9)}</div>
                      <div className="text-sm text-gray-400">Environmental</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{Math.floor(selectedAssetData.esgScore * 1.1)}</div>
                      <div className="text-sm text-gray-400">Social</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{selectedAssetData.esgScore}</div>
                      <div className="text-sm text-gray-400">Governance</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Proceed to Investment
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-400 text-sm">Advanced machine learning models analyze market data and risk factors</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <BarChart3 className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Predictive Modeling</h3>
            <p className="text-gray-400 text-sm">Yield projections based on historical data and market trends</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Risk Assessment</h3>
            <p className="text-gray-400 text-sm">Comprehensive risk analysis with mitigation strategies</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
