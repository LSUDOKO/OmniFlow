"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  DollarSign,
  Clock,
  Users,
  Target,
  ChevronDown,
  Plus,
  Minus,
  ArrowUpRight,
  Info,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatCurrency } from "@/lib/utils";

const yieldVaults = [
  {
    id: 'real-estate-vault',
    name: 'Real Estate Yield Vault',
    symbol: 'aREAL',
    apy: 12.5,
    tvl: '$45.2M',
    risk: 'Medium',
    minDeposit: '100 USDC',
    lockPeriod: '30 days',
    description: 'Diversified real estate portfolio with commercial and residential properties',
    assets: ['Commercial Real Estate', 'Residential Properties', 'REITs'],
    color: 'from-blue-500 to-blue-600',
    riskColor: 'text-yellow-400',
    userDeposit: '2,500 USDC',
    userShares: '2,450 aREAL',
    earned: '125.50 USDC'
  },
  {
    id: 'precious-metals-vault',
    name: 'Precious Metals Vault',
    symbol: 'aMETAL',
    apy: 8.2,
    tvl: '$28.7M',
    risk: 'Low',
    minDeposit: '50 USDC',
    lockPeriod: '14 days',
    description: 'Gold, silver, and platinum backed yield generation',
    assets: ['Gold Bars', 'Silver Coins', 'Platinum Ingots'],
    color: 'from-yellow-500 to-yellow-600',
    riskColor: 'text-green-400',
    userDeposit: '1,000 USDC',
    userShares: '980 aMETAL',
    earned: '42.30 USDC'
  },
  {
    id: 'carbon-credits-vault',
    name: 'Carbon Credits Vault',
    symbol: 'aCARBON',
    apy: 15.8,
    tvl: '$12.3M',
    risk: 'High',
    minDeposit: '200 USDC',
    lockPeriod: '90 days',
    description: 'High-yield carbon credit trading and environmental impact',
    assets: ['Verified Carbon Units', 'Renewable Energy Credits', 'Forest Conservation'],
    color: 'from-green-500 to-green-600',
    riskColor: 'text-red-400',
    userDeposit: '500 USDC',
    userShares: '485 aCARBON',
    earned: '38.75 USDC'
  },
  {
    id: 'art-collectibles-vault',
    name: 'Art & Collectibles Vault',
    symbol: 'aART',
    apy: 18.3,
    tvl: '$8.9M',
    risk: 'High',
    minDeposit: '500 USDC',
    lockPeriod: '180 days',
    description: 'Curated fine art and luxury collectibles portfolio',
    assets: ['Fine Art Pieces', 'Luxury Watches', 'Rare Collectibles'],
    color: 'from-purple-500 to-purple-600',
    riskColor: 'text-red-400',
    userDeposit: '0 USDC',
    userShares: '0 aART',
    earned: '0 USDC'
  }
];

const portfolioStats = [
  { label: 'Total Deposited', value: '$4,000', change: '+$125.50', icon: DollarSign },
  { label: 'Total Earned', value: '$206.55', change: '+12.3%', icon: TrendingUp },
  { label: 'Active Vaults', value: '3', change: '+1 this month', icon: Target },
  { label: 'Avg APY', value: '12.17%', change: '+0.8%', icon: BarChart3 }
];

export default function YieldVaultsContent() {
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfoVault, setSelectedInfoVault] = useState<string | null>(null);

  const handleVaultAction = (vaultId: string, action: 'deposit' | 'withdraw') => {
    setSelectedVault(vaultId);
    setActionType(action);
    setShowModal(true);
  };

  const handleInfoClick = (vaultId: string) => {
    setSelectedInfoVault(vaultId);
    setShowInfoModal(true);
  };

  const executeTransaction = async () => {
    // Simulate transaction
    setShowModal(false);
    setShowSuccessModal(true);
    
    // Auto-close success modal after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setDepositAmount('');
      setWithdrawAmount('');
    }, 2000);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

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
            Yield Vaults
          </h1>
          <p className="text-xl text-gray-300">
            Earn passive income from tokenized real-world assets with our secure, automated yield vaults
          </p>
        </div>
      </motion.div>

      {/* Portfolio Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {portfolioStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-gold-400" />
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </GlassCard>
          );
        })}
      </motion.div>

      {/* Vault Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {yieldVaults.map((vault, index) => (
          <motion.div
            key={vault.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <GlassCard className="p-8 hover:shadow-glow transition-all duration-300">
              {/* Vault Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${vault.color} flex items-center justify-center text-2xl font-bold text-white`}>
                    {vault.symbol.charAt(1)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{vault.name}</h3>
                    <p className="text-gray-400">{vault.symbol}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRiskBadgeColor(vault.risk)}`}>
                  {vault.risk} Risk
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-400 mb-1">{vault.apy}%</div>
                  <div className="text-sm text-gray-400">Current APY</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-1">{vault.tvl}</div>
                  <div className="text-sm text-gray-400">Total Value Locked</div>
                </div>
              </div>

              {/* Vault Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Min Deposit:</span>
                  <span className="text-white">{vault.minDeposit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lock Period:</span>
                  <span className="text-white">{vault.lockPeriod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Your Deposit:</span>
                  <span className="text-white font-medium">{vault.userDeposit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Your Shares:</span>
                  <span className="text-white">{vault.userShares}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Earned:</span>
                  <span className="text-green-400 font-medium">+{vault.earned}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-6">{vault.description}</p>

              {/* Asset Composition */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Asset Composition</h4>
                <div className="flex flex-wrap gap-2">
                  {vault.assets.map((asset, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVaultAction(vault.id, 'deposit')}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Deposit
                </button>
                {vault.userDeposit !== '0 USDC' && (
                  <button
                    onClick={() => handleVaultAction(vault.id, 'withdraw')}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Minus className="w-4 h-4" />
                    Withdraw
                  </button>
                )}
                <button 
                  onClick={() => handleInfoClick(vault.id)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
                >
                  <Info className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Transaction Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full"
            >
              {selectedVault && (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {actionType === 'deposit' ? 'Deposit to' : 'Withdraw from'} Vault
                    </h3>
                    <p className="text-gray-400">
                      {yieldVaults.find(v => v.id === selectedVault)?.name}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount ({actionType === 'deposit' ? 'USDC' : yieldVaults.find(v => v.id === selectedVault)?.symbol})
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={actionType === 'deposit' ? depositAmount : withdrawAmount}
                          onChange={(e) => actionType === 'deposit' ? setDepositAmount(e.target.value) : setWithdrawAmount(e.target.value)}
                          placeholder="0.0"
                          className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
                        />
                        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gold-400 hover:text-gold-300 text-sm font-medium">
                          MAX
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        Available: {actionType === 'deposit' ? '5,000 USDC' : yieldVaults.find(v => v.id === selectedVault)?.userShares}
                      </div>
                    </div>

                    {actionType === 'deposit' && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">You'll Receive</span>
                          <span className="text-white">~{depositAmount || '0'} {yieldVaults.find(v => v.id === selectedVault)?.symbol}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Current APY</span>
                          <span className="text-green-400">{yieldVaults.find(v => v.id === selectedVault)?.apy}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Lock Period</span>
                          <span className="text-white">{yieldVaults.find(v => v.id === selectedVault)?.lockPeriod}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeTransaction}
                      disabled={!(actionType === 'deposit' ? depositAmount : withdrawAmount)}
                      className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      {actionType === 'deposit' ? 'Deposit' : 'Withdraw'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security & Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <GlassCard className="p-6 text-center">
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Secure Vaults</h3>
          <p className="text-gray-400 text-sm">Multi-signature security and audited smart contracts</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <TrendingUp className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Auto-Compound</h3>
          <p className="text-gray-400 text-sm">Automatic reinvestment for maximum yield optimization</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Real-Time Tracking</h3>
          <p className="text-gray-400 text-sm">Live performance monitoring and yield analytics</p>
        </GlassCard>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
            >
              {/* Happy Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-2"
              >
                🎉 {actionType === 'deposit' ? 'Deposited' : 'Withdrawn'} Successfully!
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 mb-4"
              >
                Your {actionType === 'deposit' ? 'deposit has been processed and you\'re earning yield!' : 'withdrawal has been processed successfully!'}
              </motion.p>

              {/* Amount Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-800/50 rounded-xl p-4 mb-4"
              >
                <div className="text-gold-400 font-bold text-xl">
                  {actionType === 'deposit' ? depositAmount : withdrawAmount} USDC
                </div>
                <div className="text-sm text-gray-400">
                  {yieldVaults.find(v => v.id === selectedVault)?.name}
                </div>
              </motion.div>

              {/* Confetti Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 1, scale: 0 }}
                    animate={{ 
                      y: -100, 
                      opacity: 0, 
                      scale: 1,
                      rotate: Math.random() * 360 
                    }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 0.5 + i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute w-3 h-3 bg-gold-400 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: '50%'
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && selectedInfoVault && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/30 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              {(() => {
                const vault = yieldVaults.find(v => v.id === selectedInfoVault);
                if (!vault) return null;

                return (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${vault.color} flex items-center justify-center`}>
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{vault.name}</h3>
                          <p className="text-gray-400">{vault.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowInfoModal(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{vault.apy}%</div>
                        <div className="text-sm text-gray-400">APY</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">{vault.tvl}</div>
                        <div className="text-sm text-gray-400">TVL</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className={`text-2xl font-bold ${vault.riskColor}`}>{vault.risk}</div>
                        <div className="text-sm text-gray-400">Risk</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gold-400">{vault.lockPeriod}</div>
                        <div className="text-sm text-gray-400">Lock Period</div>
                      </div>
                    </div>

                    {/* Asset Composition */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Asset Composition</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {vault.assets.map((asset, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-white font-medium">{asset}</div>
                            <div className="text-sm text-gray-400">
                              {index === 0 ? '40%' : index === 1 ? '35%' : '25%'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Your Position */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Your Position</h4>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-400">Deposited</div>
                            <div className="text-xl font-bold text-white">{vault.userDeposit}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Shares</div>
                            <div className="text-xl font-bold text-blue-400">{vault.userShares}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Earned</div>
                            <div className="text-xl font-bold text-green-400">+{vault.earned}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Information */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Risk Information</h4>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className={`w-5 h-5 mt-0.5 ${vault.riskColor}`} />
                          <div>
                            <div className="text-white font-medium mb-2">
                              {vault.risk} Risk Strategy
                            </div>
                            <div className="text-sm text-gray-400 leading-relaxed">
                              {vault.risk === 'Low' && 'Conservative approach with stable, government-backed assets. Lower volatility with steady returns.'}
                              {vault.risk === 'Medium' && 'Balanced portfolio with diversified exposure. Moderate volatility with competitive yields.'}
                              {vault.risk === 'High' && 'Aggressive strategy targeting maximum returns. Higher volatility and potential for significant gains or losses.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Terms & Conditions</h4>
                      <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Minimum Deposit:</span>
                          <span className="text-white">{vault.minDeposit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Lock Period:</span>
                          <span className="text-white">{vault.lockPeriod}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Management Fee:</span>
                          <span className="text-white">2% annually</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Performance Fee:</span>
                          <span className="text-white">20% of profits</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Early Withdrawal:</span>
                          <span className="text-white">5% penalty fee</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setShowInfoModal(false);
                          handleVaultAction(vault.id, 'deposit');
                        }}
                        className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Deposit
                      </button>
                      {vault.userDeposit !== '0 USDC' && (
                        <button
                          onClick={() => {
                            setShowInfoModal(false);
                            handleVaultAction(vault.id, 'withdraw');
                          }}
                          className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Minus className="w-4 h-4" />
                          Withdraw
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
