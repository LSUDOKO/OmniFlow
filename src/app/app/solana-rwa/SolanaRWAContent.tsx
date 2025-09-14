"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Award,
  Users,
  BarChart3,
  Coins,
  Wallet,
  ArrowRight,
  Star,
  Globe,
  Leaf,
  Building,
  Gem,
  Factory,
  Plus,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import SolanaWalletButton from '../../../components/solana/SolanaWalletButton';

const solanaRWAAssets = [
  {
    id: 'sol-real-estate-1',
    name: 'Miami Beach Condos',
    type: 'Real Estate',
    category: 'residential',
    value: 2500000,
    tokenSupply: 10000,
    pricePerToken: 250,
    apy: 8.5,
    location: 'Miami, FL',
    status: 'active',
    solanaProgram: 'RWA1...abc123',
    mintAddress: 'MINT1...def456',
    liquidity: 850000,
    holders: 247,
    description: 'Luxury beachfront condominiums tokenized on Solana for fractional ownership',
    features: ['Instant settlement', 'Low fees', 'High liquidity', 'Compressed NFTs'],
    lastUpdated: '2 hours ago'
  },
  {
    id: 'sol-carbon-2',
    name: 'Amazon Carbon Credits',
    type: 'Carbon Credits',
    category: 'environmental',
    value: 500000,
    tokenSupply: 50000,
    pricePerToken: 10,
    apy: 12.3,
    location: 'Brazil',
    status: 'active',
    solanaProgram: 'CARBON...xyz789',
    mintAddress: 'MINT2...ghi012',
    liquidity: 125000,
    holders: 89,
    description: 'Verified carbon offset credits from rainforest conservation on Solana',
    features: ['ESG compliant', 'Real-time tracking', 'Automated rewards', 'Global access'],
    lastUpdated: '1 day ago'
  },
  {
    id: 'sol-energy-3',
    name: 'Texas Solar Farm',
    type: 'Renewable Energy',
    category: 'energy',
    value: 1800000,
    tokenSupply: 18000,
    pricePerToken: 100,
    apy: 9.8,
    location: 'Texas, USA',
    status: 'active',
    solanaProgram: 'SOLAR...mno345',
    mintAddress: 'MINT3...pqr678',
    liquidity: 450000,
    holders: 156,
    description: 'Utility-scale solar energy generation facility with revenue sharing',
    features: ['Energy production data', 'Weather oracles', 'Revenue automation', 'Grid integration'],
    lastUpdated: '4 hours ago'
  }
];

const solanaFeatures = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: '400ms block times for instant RWA settlements',
    color: 'text-yellow-400'
  },
  {
    icon: DollarSign,
    title: 'Ultra Low Fees',
    description: '$0.00025 average transaction cost',
    color: 'text-green-400'
  },
  {
    icon: BarChart3,
    title: 'High Throughput',
    description: '65,000 TPS for massive RWA trading',
    color: 'text-blue-400'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Proof of Stake consensus with validator network',
    color: 'text-purple-400'
  }
];

export default function SolanaRWAContent() {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    }
  }, [connected, publicKey]);

  const fetchBalance = async () => {
    if (!publicKey || !connection) return;
    
    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const AssetCard = ({ asset }: { asset: typeof solanaRWAAssets[0] }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-purple-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedAsset(asset.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-green-400 rounded-xl flex items-center justify-center">
              {asset.category === 'residential' && <Building className="w-6 h-6 text-white" />}
              {asset.category === 'environmental' && <Leaf className="w-6 h-6 text-white" />}
              {asset.category === 'energy' && <Zap className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{asset.name}</h3>
              <p className="text-purple-300 text-sm">{asset.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-400">${(asset.value / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-400">{asset.tokenSupply.toLocaleString()} tokens</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Price per Token</p>
            <p className="text-lg font-bold text-purple-400">${asset.pricePerToken}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">APY</p>
            <p className="text-lg font-bold text-green-400">{asset.apy}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Liquidity</p>
            <p className="text-lg font-bold text-blue-400">${(asset.liquidity / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Holders</p>
            <p className="text-lg font-bold text-gold-400">{asset.holders}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center">
            <Globe className="w-3 h-3 mr-1" />
            {asset.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {asset.lastUpdated}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {asset.features.slice(0, 2).map((feature, index) => (
            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400 font-mono">
            {asset.mintAddress.slice(0, 8)}...
          </div>
          <button className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <span className="text-sm font-medium mr-1">View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const AssetDetail = ({ assetId }: { assetId: string }) => {
    const asset = solanaRWAAssets.find(a => a.id === assetId);
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
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-purple-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-green-400 rounded-2xl flex items-center justify-center">
                {asset.category === 'residential' && <Building className="w-8 h-8 text-white" />}
                {asset.category === 'environmental' && <Leaf className="w-8 h-8 text-white" />}
                {asset.category === 'energy' && <Zap className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{asset.name}</h2>
                <p className="text-purple-300 text-lg">{asset.type} • {asset.location}</p>
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
              <div className="text-2xl font-bold text-green-400 mb-1">${(asset.value / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-400">Total Value</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{asset.tokenSupply.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Token Supply</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">${(asset.liquidity / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-400">Liquidity Pool</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-gold-400 mb-1">{asset.apy}%</div>
              <div className="text-xs text-gray-400">Annual Yield</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Solana Integration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Program ID</span>
                  <span className="font-mono text-purple-400">{asset.solanaProgram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mint Address</span>
                  <span className="font-mono text-purple-400">{asset.mintAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Network</span>
                  <span className="text-green-400">Solana Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Token Standard</span>
                  <span className="text-blue-400">SPL Token</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Solana Features</h3>
              <div className="space-y-3">
                {asset.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <Star className="w-4 h-4 text-gold-400 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-gray-300 leading-relaxed">{asset.description}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <Users className="w-4 h-4 text-purple-400 mr-2" />
              {asset.holders} token holders
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                View on Solscan
              </button>
              <button className="px-6 py-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors flex items-center">
                <Coins className="w-4 h-4 mr-2" />
                Buy Tokens
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
            Solana RWA Hub
          </h1>
          <p className="text-lg text-gray-300">
            Lightning-fast RWA tokenization powered by Solana's high-performance blockchain
          </p>
        </div>
        <SolanaWalletButton />
      </motion.div>

      {/* Wallet Status */}
      {connected && publicKey && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-green-500/20 border-2 border-purple-400/40 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-green-400 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Connected to Solana</h3>
                <p className="text-purple-300 font-mono text-sm">
                  {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{balance.toFixed(4)} SOL</p>
              <p className="text-xs text-gray-400">Wallet Balance</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Solana Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {solanaFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-purple-400/40 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${feature.color}`} />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </motion.div>

      {/* RWA Assets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Solana RWA Assets</h2>
          <button className="px-4 py-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Tokenize Asset
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {solanaRWAAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AssetCard asset={asset} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedAsset && <AssetDetail assetId={selectedAsset} />}
      </AnimatePresence>
    </div>
  );
}
