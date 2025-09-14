"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  ArrowLeftRight,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Globe,
  ChevronDown,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

const supportedChains = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: 'from-blue-500 to-blue-600',
    icon: '⟠',
    fee: '0.005 ETH'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    color: 'from-purple-500 to-purple-600',
    icon: '⬟',
    fee: '0.1 MATIC'
  },
  {
    id: 'bsc',
    name: 'BSC',
    symbol: 'BNB',
    color: 'from-yellow-500 to-yellow-600',
    icon: '◆',
    fee: '0.002 BNB'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: 'from-green-500 to-green-600',
    icon: '◎',
    fee: '0.01 SOL'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ETH',
    color: 'from-blue-400 to-blue-500',
    icon: '▲',
    fee: '0.003 ETH'
  }
];

const bridgeStats = [
  { label: '24h Volume', value: '$2.4M', icon: TrendingUp },
  { label: 'Success Rate', value: '99.8%', icon: CheckCircle },
  { label: 'Avg Time', value: '2.3 min', icon: Clock },
  { label: 'Total Bridges', value: '47,291', icon: Globe }
];

export default function QuickBridgePage() {
  const [fromChain, setFromChain] = useState(supportedChains[0]);
  const [toChain, setToChain] = useState(supportedChains[3]);
  const [amount, setAmount] = useState('');
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const { address, isConnected } = useAccount();

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setBridgeStatus('pending');
    // Simulate bridge process
    setTimeout(() => {
      setBridgeStatus(Math.random() > 0.1 ? 'success' : 'error');
    }, 3000);
  };

  const resetBridge = () => {
    setBridgeStatus('idle');
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-4">
            Cross-Chain Bridge
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transfer RWA tokens and NFTs seamlessly across blockchains with our secure, fast bridge powered by Wormhole and Circle CCTP
          </p>
        </motion.div>

        {/* Bridge Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {bridgeStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <Icon className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Main Bridge Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            {/* Wallet Connection */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Bridge Assets</h2>
              <ConnectButton />
            </div>

            {bridgeStatus === 'idle' && (
              <>
                {/* From Chain */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between text-white hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${fromChain.color} flex items-center justify-center text-xl`}>
                          {fromChain.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{fromChain.name}</div>
                          <div className="text-sm text-gray-400">Fee: {fromChain.fee}</div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {isFromDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden z-20"
                        >
                          {supportedChains.filter(chain => chain.id !== toChain.id).map((chain) => (
                            <button
                              key={chain.id}
                              onClick={() => {
                                setFromChain(chain);
                                setIsFromDropdownOpen(false);
                              }}
                              className="w-full p-4 flex items-center gap-3 hover:bg-white/10 transition-all duration-300 text-left"
                            >
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${chain.color} flex items-center justify-center text-lg`}>
                                {chain.icon}
                              </div>
                              <div>
                                <div className="font-medium text-white">{chain.name}</div>
                                <div className="text-sm text-gray-400">Fee: {chain.fee}</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={swapChains}
                    className="p-3 bg-gold-500 hover:bg-gold-600 rounded-full text-white transition-all duration-300 hover:scale-110"
                  >
                    <ArrowLeftRight className="w-6 h-6" />
                  </button>
                </div>

                {/* To Chain */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between text-white hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${toChain.color} flex items-center justify-center text-xl`}>
                          {toChain.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{toChain.name}</div>
                          <div className="text-sm text-gray-400">Fee: {toChain.fee}</div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {isToDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden z-20"
                        >
                          {supportedChains.filter(chain => chain.id !== fromChain.id).map((chain) => (
                            <button
                              key={chain.id}
                              onClick={() => {
                                setToChain(chain);
                                setIsToDropdownOpen(false);
                              }}
                              className="w-full p-4 flex items-center gap-3 hover:bg-white/10 transition-all duration-300 text-left"
                            >
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${chain.color} flex items-center justify-center text-lg`}>
                                {chain.icon}
                              </div>
                              <div>
                                <div className="font-medium text-white">{chain.name}</div>
                                <div className="text-sm text-gray-400">Fee: {chain.fee}</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
                    />
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gold-400 hover:text-gold-300 text-sm font-medium">
                      MAX
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Balance: 12.45 {fromChain.symbol}
                  </div>
                </div>

                {/* Bridge Summary */}
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Bridge Fee</span>
                    <span className="text-white">{fromChain.fee}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="text-white">2-5 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">You'll Receive</span>
                    <span className="text-white font-medium">{amount || '0.0'} {toChain.symbol}</span>
                  </div>
                </div>

                {/* Bridge Button */}
                <button
                  onClick={handleBridge}
                  disabled={!amount || !isConnected}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/25"
                >
                  <Zap className="w-5 h-5" />
                  {!isConnected ? 'Connect Wallet' : 'Start Bridge'}
                </button>
              </>
            )}

            {/* Bridge Status */}
            {bridgeStatus === 'pending' && (
              <div className="text-center py-8">
                <Loader className="w-16 h-16 text-gold-400 animate-spin mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Processing Bridge</h3>
                <p className="text-gray-400 mb-4">Transferring {amount} {fromChain.symbol} to {toChain.name}</p>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Step 1: Approve Token</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Step 2: Lock on Source</span>
                    <Loader className="w-5 h-5 text-gold-400 animate-spin" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Step 3: Validate Transfer</span>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Step 4: Mint on Destination</span>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  </div>
                </div>
              </div>
            )}

            {bridgeStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Bridge Successful!</h3>
                <p className="text-gray-400 mb-6">
                  Successfully transferred {amount} {fromChain.symbol} to {toChain.name}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={resetBridge}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Bridge Again
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-3 px-6 rounded-xl transition-all duration-300">
                    View Transaction
                  </button>
                </div>
              </div>
            )}

            {bridgeStatus === 'error' && (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Bridge Failed</h3>
                <p className="text-gray-400 mb-6">
                  Transaction failed. Please try again or contact support.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={resetBridge}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Try Again
                  </button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl transition-all duration-300">
                    Get Support
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
            <p className="text-gray-400 text-sm">Multi-signature validation and battle-tested protocols</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Fast</h3>
            <p className="text-gray-400 text-sm">Average bridge time of 2-5 minutes across all chains</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Universal</h3>
            <p className="text-gray-400 text-sm">Support for all major blockchains and token standards</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
