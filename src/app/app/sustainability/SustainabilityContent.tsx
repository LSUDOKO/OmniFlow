"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Leaf,
  Globe,
  TrendingUp,
  DollarSign,
  Award,
  Users,
  BarChart3,
  PieChart,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Zap,
  Recycle,
  Wind,
  Sun,
  Droplets,
  TreePine,
  Factory,
  Building,
  X,
  Upload,
  MapPin,
  Calendar,
  Target
} from 'lucide-react';

const esgAssets = [
  {
    id: 'esg-001',
    name: 'Amazon Rainforest Conservation',
    type: 'Carbon Credits',
    category: 'environmental',
    value: 2500000,
    carbonOffset: 50000,
    location: 'Brazil',
    esgScore: {
      overall: 95,
      environmental: 98,
      social: 92,
      governance: 95
    },
    impact: {
      co2Reduced: '50,000 tons',
      treesProtected: '125,000',
      biodiversityScore: 98,
      communityJobs: 450
    },
    certifications: ['VCS', 'Gold Standard', 'CCBS'],
    apy: 12.3,
    riskLevel: 'Medium',
    status: 'active',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'esg-002',
    name: 'Solar Energy Farm Portfolio',
    type: 'Renewable Energy',
    category: 'energy',
    value: 5200000,
    energyCapacity: '25 MW',
    location: 'California, USA',
    esgScore: {
      overall: 88,
      environmental: 95,
      social: 85,
      governance: 84
    },
    impact: {
      cleanEnergyGenerated: '45,000 MWh/year',
      co2Avoided: '22,500 tons/year',
      householdsPowered: '8,500',
      greenJobs: 85
    },
    certifications: ['LEED Gold', 'Energy Star', 'Green-e'],
    apy: 9.8,
    riskLevel: 'Low',
    status: 'active',
    lastUpdated: '1 day ago'
  },
  {
    id: 'esg-003',
    name: 'Sustainable Housing Project',
    type: 'Green Real Estate',
    category: 'social',
    value: 8500000,
    units: 150,
    location: 'Amsterdam, Netherlands',
    esgScore: {
      overall: 91,
      environmental: 89,
      social: 96,
      governance: 88
    },
    impact: {
      energyEfficiency: '40% reduction',
      affordableUnits: '60 units',
      communitySpaces: '5 facilities',
      localJobs: 120
    },
    certifications: ['BREEAM Excellent', 'WELL Gold', 'GRESB 5-Star'],
    apy: 7.5,
    riskLevel: 'Low',
    status: 'active',
    lastUpdated: '3 hours ago'
  },
  {
    id: 'esg-004',
    name: 'Ocean Cleanup Initiative',
    type: 'Environmental Impact',
    category: 'environmental',
    value: 1200000,
    plasticRemoved: '500 tons',
    location: 'Pacific Ocean',
    esgScore: {
      overall: 93,
      environmental: 97,
      social: 90,
      governance: 92
    },
    impact: {
      plasticRemoved: '500 tons',
      marineLifeProtected: '10,000+ species',
      researchProjects: '15 studies',
      volunteers: 2500
    },
    certifications: ['UN SDG Aligned', 'B-Corp Certified'],
    apy: 5.2,
    riskLevel: 'High',
    status: 'active',
    lastUpdated: '5 hours ago'
  }
];

const sustainabilityMetrics = [
  { label: 'CO₂ Offset', value: '127.5K tons', icon: Leaf, color: 'text-green-400' },
  { label: 'Clean Energy', value: '45 GWh', icon: Zap, color: 'text-yellow-400' },
  { label: 'ESG Score', value: '91.8/100', icon: Award, color: 'text-blue-400' },
  { label: 'Impact Projects', value: '24', icon: Globe, color: 'text-purple-400' }
];

const impactCategories = [
  { id: 'environmental', name: 'Environmental', icon: Leaf, color: 'text-green-400' },
  { id: 'social', name: 'Social Impact', icon: Users, color: 'text-blue-400' },
  { id: 'governance', name: 'Governance', icon: Shield, color: 'text-purple-400' },
  { id: 'energy', name: 'Clean Energy', icon: Sun, color: 'text-yellow-400' }
];

export default function SustainabilityContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showInvestSuccessModal, setShowInvestSuccessModal] = useState(false);
  const [selectedInvestAsset, setSelectedInvestAsset] = useState<string>('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const { address, isConnected } = useAccount();

  const filteredAssets = esgAssets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getESGColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const AssetCard = ({ asset }: { asset: typeof esgAssets[0] }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-green-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedAsset(asset.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              {asset.category === 'environmental' && <Leaf className="w-6 h-6 text-white" />}
              {asset.category === 'energy' && <Sun className="w-6 h-6 text-white" />}
              {asset.category === 'social' && <Users className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{asset.name}</h3>
              <p className="text-green-300 text-sm">{asset.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-400">${(asset.value / 1000000).toFixed(1)}M</p>
            <div className={`text-sm font-semibold ${getESGColor(asset.esgScore.overall)}`}>
              ESG: {asset.esgScore.overall}/100
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className={`text-lg font-bold ${getESGColor(asset.esgScore.environmental)}`}>
              {asset.esgScore.environmental}
            </div>
            <div className="text-xs text-gray-400">Environmental</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className={`text-lg font-bold ${getESGColor(asset.esgScore.social)}`}>
              {asset.esgScore.social}
            </div>
            <div className="text-xs text-gray-400">Social</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className={`text-lg font-bold ${getESGColor(asset.esgScore.governance)}`}>
              {asset.esgScore.governance}
            </div>
            <div className="text-xs text-gray-400">Governance</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">APY</span>
            <span className="text-green-400 font-semibold">{asset.apy}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Risk Level</span>
            <span className="text-blue-400 font-semibold">{asset.riskLevel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Location</span>
            <span className="text-white font-semibold">{asset.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {asset.certifications.slice(0, 2).map((cert, index) => (
            <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg">
              {cert}
            </span>
          ))}
          {asset.certifications.length > 2 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-lg">
              +{asset.certifications.length - 2} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Updated {asset.lastUpdated}
          </div>
          <button className="flex items-center text-green-400 hover:text-green-300 transition-colors">
            <span className="text-sm font-medium mr-1">View Impact</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const handleAddAsset = () => {
    // Simulate adding the asset
    setShowAddAssetModal(false);
    setShowSuccessModal(true);
    
    // Auto-close success modal after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setNewAssetName('');
    }, 2000);
  };

  const downloadESGReport = (asset: typeof esgAssets[0]) => {
    const reportData = {
      assetId: asset.id,
      assetName: asset.name,
      reportType: 'ESG Impact Report',
      generatedDate: new Date().toISOString(),
      assetDetails: {
        type: asset.type,
        category: asset.category,
        location: asset.location,
        value: asset.value,
        apy: asset.apy,
        riskLevel: asset.riskLevel,
        status: asset.status,
        lastUpdated: asset.lastUpdated
      },
      esgScores: {
        overall: asset.esgScore.overall,
        environmental: asset.esgScore.environmental,
        social: asset.esgScore.social,
        governance: asset.esgScore.governance
      },
      impactMetrics: asset.impact,
      certifications: asset.certifications,
      sustainabilityAnalysis: {
        carbonFootprint: 'Net negative - removes more CO2 than produced',
        socialImpact: 'High positive impact on local communities',
        governanceRating: 'Excellent transparency and accountability',
        complianceStatus: 'Fully compliant with ESG standards',
        riskAssessment: 'Low environmental and social risks'
      },
      financialProjections: {
        expectedReturn: `${asset.apy}% annually`,
        paymentSchedule: 'Quarterly distributions',
        liquidityOptions: 'Available after 12-month lock period',
        taxImplications: 'Eligible for green investment tax credits'
      },
      verificationDetails: {
        auditedBy: 'Third-party ESG verification agency',
        lastAuditDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextAuditDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        blockchainVerification: 'Verified on Ethereum mainnet',
        transactionHash: '0x' + Math.random().toString(16).substr(2, 40)
      }
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${asset.name.replace(/\s+/g, '_')}_ESG_Report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleInvestClick = (assetName: string) => {
    setSelectedInvestAsset(assetName);
    setShowInvestModal(true);
  };

  const handleInvestConfirm = () => {
    setShowInvestModal(false);
    setShowInvestSuccessModal(true);
    
    // Auto-close success modal after 2 seconds
    setTimeout(() => {
      setShowInvestSuccessModal(false);
      setSelectedInvestAsset('');
      setInvestmentAmount('');
    }, 2000);
  };

  const AddAssetModal = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowAddAssetModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-green-400/40 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Add New ESG Asset
            </h2>
            <button
              onClick={() => setShowAddAssetModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                placeholder="e.g., Wind Farm Project Alpha"
                className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400/60 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Asset Type
                </label>
                <select className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-400/60 transition-colors">
                  <option value="">Select Type</option>
                  <option value="renewable-energy">Renewable Energy</option>
                  <option value="carbon-credits">Carbon Credits</option>
                  <option value="green-real-estate">Green Real Estate</option>
                  <option value="environmental-impact">Environmental Impact</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-400/60 transition-colors">
                  <option value="">Select Category</option>
                  <option value="environmental">Environmental</option>
                  <option value="social">Social Impact</option>
                  <option value="governance">Governance</option>
                  <option value="energy">Clean Energy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., California, USA"
                  className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Asset Value (USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5000000"
                  className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Impact Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the environmental and social impact of this asset..."
                className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400/60 transition-colors resize-none"
              />
            </div>

            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">Document Upload</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Upload ESG certificates, impact reports, and verification documents
              </p>
              <button className="px-4 py-2 bg-green-500/20 border border-green-400/50 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                Choose Files
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowAddAssetModal(false)}
              className="px-6 py-3 bg-gray-500/20 border border-gray-400/50 text-gray-300 rounded-xl hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAsset}
              disabled={!newAssetName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const InvestModal = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowInvestModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-green-400/40 rounded-2xl p-8 max-w-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              Invest in ESG Asset
            </h2>
            <button
              onClick={() => setShowInvestModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-bold text-white mb-2">{selectedInvestAsset}</h3>
            <p className="text-green-300 text-sm">Sustainable investment with measurable impact</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Investment Amount (USD) *
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="e.g., 10000"
                className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400/60 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Type
                </label>
                <select className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-400/60 transition-colors">
                  <option value="direct">Direct Investment</option>
                  <option value="fractional">Fractional Shares</option>
                  <option value="recurring">Recurring Investment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lock Period
                </label>
                <select className="w-full px-4 py-3 bg-white/10 border-2 border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-400/60 transition-colors">
                  <option value="6m">6 Months</option>
                  <option value="12m">12 Months</option>
                  <option value="24m">24 Months</option>
                  <option value="36m">36 Months</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Investment Summary</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Expected Annual Return:</span>
                  <span className="text-green-400 font-semibold">12.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Level:</span>
                  <span className="text-yellow-400 font-semibold">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">ESG Impact Score:</span>
                  <span className="text-green-400 font-semibold">95/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowInvestModal(false)}
              className="px-6 py-3 bg-gray-500/20 border border-gray-400/50 text-gray-300 rounded-xl hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInvestConfirm}
              disabled={!investmentAmount.trim()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-4 h-4" />
              Confirm Investment
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const InvestSuccessModal = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-gradient-to-br from-green-800 to-green-700 border-2 border-green-400/50 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Animated particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              initial={{
                x: Math.random() * 300 - 150,
                y: Math.random() * 200 - 100,
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 300 - 150,
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}

          <motion.div
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Investment Successful!
          </motion.h2>

          <motion.p
            className="text-green-200 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your investment in "{selectedInvestAsset}" has been confirmed and processed.
          </motion.p>

          <motion.div
            className="text-sm text-green-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Welcome to sustainable investing! 💚
          </motion.div>

          <motion.div
            className="absolute top-4 right-4 w-6 h-6 text-green-300"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <DollarSign className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  const SuccessModal = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-gradient-to-br from-green-800 to-green-700 border-2 border-green-400/50 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Animated particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              initial={{
                x: Math.random() * 300 - 150,
                y: Math.random() * 200 - 100,
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 300 - 150,
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}

          <motion.div
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ESG Asset Added Successfully!
          </motion.h2>

          <motion.p
            className="text-green-200 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {newAssetName ? `"${newAssetName}"` : 'Your new asset'} has been added to your sustainable portfolio.
          </motion.p>

          <motion.div
            className="text-sm text-green-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Ready for impact investing! 🌱
          </motion.div>

          <motion.div
            className="absolute top-4 right-4 w-6 h-6 text-green-300"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Leaf className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  const AssetDetail = ({ assetId }: { assetId: string }) => {
    const asset = esgAssets.find(a => a.id === assetId);
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
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-green-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                {asset.category === 'environmental' && <Leaf className="w-8 h-8 text-white" />}
                {asset.category === 'energy' && <Sun className="w-8 h-8 text-white" />}
                {asset.category === 'social' && <Users className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{asset.name}</h2>
                <p className="text-green-300 text-lg">{asset.type} • {asset.location}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className={`text-2xl font-bold ${getESGColor(asset.esgScore.overall)} mb-1`}>
                {asset.esgScore.overall}/100
              </div>
              <div className="text-xs text-gray-400">Overall ESG Score</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">${(asset.value / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-400">Asset Value</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{asset.apy}%</div>
              <div className="text-xs text-gray-400">Annual Yield</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{asset.certifications.length}</div>
              <div className="text-xs text-gray-400">Certifications</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Leaf className="w-5 h-5 text-green-400 mr-2" />
                Environmental Impact
              </h3>
              <div className="space-y-3 text-sm">
                {Object.entries(asset.impact).slice(0, 2).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-bold text-green-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 text-blue-400 mr-2" />
                Social Impact
              </h3>
              <div className="space-y-3 text-sm">
                {Object.entries(asset.impact).slice(2).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-bold text-blue-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 text-gold-400 mr-2" />
                Certifications
              </h3>
              <div className="space-y-2">
                {asset.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <Globe className="w-4 h-4 text-green-400 mr-2" />
              Sustainable investment verified
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => downloadESGReport(asset)}
                className="px-6 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                ESG Report
              </button>
              <button 
                onClick={() => handleInvestClick(asset.name)}
                className="px-6 py-2 bg-green-500/20 border border-green-400/50 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Invest
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Sustainability & ESG
          </h1>
          <p className="text-lg text-gray-300">
            Invest in sustainable assets with measurable environmental and social impact
          </p>
        </div>
        <button 
          onClick={() => setShowAddAssetModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add ESG Asset
        </button>
      </motion.div>

      {/* Sustainability Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {sustainabilityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-green-400/40 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${metric.color}`} />
                <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
              </div>
              <p className="text-gray-300 font-medium">{metric.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-green-400/40 rounded-xl p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sustainable assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-green-400/50 rounded-xl text-green-50 placeholder-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-300/80 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-green-500/20 text-green-400 border-2 border-green-400/50'
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
              }`}
            >
              All Categories
            </button>
            {impactCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-400/50'
                      : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-green-400' : category.color}`} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ESG Assets Grid */}
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

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedAsset && <AssetDetail assetId={selectedAsset} />}
      </AnimatePresence>

      {/* Add Asset Modal */}
      <AnimatePresence>
        {showAddAssetModal && <AddAssetModal />}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && <SuccessModal />}
      </AnimatePresence>

      {/* Invest Modal */}
      <AnimatePresence>
        {showInvestModal && <InvestModal />}
      </AnimatePresence>

      {/* Invest Success Modal */}
      <AnimatePresence>
        {showInvestSuccessModal && <InvestSuccessModal />}
      </AnimatePresence>
    </div>
  );
}
