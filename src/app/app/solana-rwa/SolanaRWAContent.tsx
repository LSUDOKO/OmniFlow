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
import { portfolioService, RWAAssetPurchase } from '../../../services/portfolioService';
import { useRouter } from 'next/navigation';
import PurchaseProgressTracker from '../../../components/portfolio/PurchaseProgressTracker';

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
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState<{ show: boolean; asset: any; tokens: number }>({
    show: false,
    asset: null,
    tokens: 1
  });
  const [successModal, setSuccessModal] = useState<{ show: boolean; asset: any; tokens: number }>({
    show: false,
    asset: null,
    tokens: 0
  });
  const [tokenizeModal, setTokenizeModal] = useState(false);
  const [tokenizeSuccessModal, setTokenizeSuccessModal] = useState(false);
  const [viewSolscanModal, setViewSolscanModal] = useState<{ show: boolean; asset: any }>({ show: false, asset: null });
  const [buyTokensModal, setBuyTokensModal] = useState<{ show: boolean; asset: any }>({ show: false, asset: null });
  const [buyTokensAmount, setBuyTokensAmount] = useState(1);
  const [purchaseSuccessModal, setPurchaseSuccessModal] = useState<{ show: boolean; asset: any; amount: number }>({ show: false, asset: null, amount: 0 });
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [progressTrackerData, setProgressTrackerData] = useState<{ assetName: string; tokenAmount: number; transactionHash?: string }>({ assetName: '', tokenAmount: 0 });

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
      
      // Set wallet address in portfolio service
      portfolioService.setWalletAddress(publicKey.toString());
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleBuyTokens = (asset: any) => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    setBuyTokensModal({ show: true, asset });
    setBuyTokensAmount(1);
  };

  const handleViewSolscan = (asset: any) => {
    setViewSolscanModal({ show: true, asset });
  };

  const executeBuyTokens = async () => {
    if (!buyTokensModal.asset || !connected || !publicKey) return;

    setIsLoading(true);
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Close buy modal and show progress tracker
      setBuyTokensModal({ show: false, asset: null });
      setProgressTrackerData({
        assetName: buyTokensModal.asset.name,
        tokenAmount: buyTokensAmount,
        transactionHash
      });
      setShowProgressTracker(true);
      
      // Create RWA asset purchase record
      const rwaAssetPurchase: RWAAssetPurchase = {
        id: buyTokensModal.asset.id,
        name: buyTokensModal.asset.name,
        type: buyTokensModal.asset.type,
        category: buyTokensModal.asset.category,
        tokensPurchased: buyTokensAmount,
        pricePerToken: buyTokensModal.asset.pricePerToken,
        apy: buyTokensModal.asset.apy,
        location: buyTokensModal.asset.location,
        solanaProgram: buyTokensModal.asset.solanaProgram,
        mintAddress: buyTokensModal.asset.mintAddress,
        transactionHash
      };

      // Set wallet address in portfolio service BEFORE adding asset
      portfolioService.setWalletAddress(publicKey.toString());
      
      // Add to portfolio (this will trigger real-time updates)
      portfolioService.addPurchasedRWAAsset(rwaAssetPurchase);
      
      // Trigger events for real-time portfolio updates
      if (typeof window !== 'undefined') {
        const storageKey = `omniflow_rwa_assets_${publicKey.toString()}`;
        
        // Dispatch storage event (for cross-tab updates)
        window.dispatchEvent(new StorageEvent('storage', {
          key: storageKey,
          newValue: JSON.stringify({ action: 'asset_added', timestamp: Date.now() })
        }));
        
        // Dispatch custom event (for same-tab updates)
        window.dispatchEvent(new CustomEvent('portfolio-update', {
          detail: {
            key: storageKey,
            action: 'asset_added',
            timestamp: Date.now()
          }
        }));
        
        console.log('Dispatched portfolio update events for key:', storageKey);
      }
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const executePurchase = async () => {
    if (!purchaseModal.asset || !connected || !publicKey) return;

    setIsLoading(true);
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create RWA asset purchase record
      const rwaAssetPurchase: RWAAssetPurchase = {
        id: purchaseModal.asset.id,
        name: purchaseModal.asset.name,
        type: purchaseModal.asset.type,
        category: purchaseModal.asset.category,
        tokensPurchased: purchaseModal.tokens,
        pricePerToken: purchaseModal.asset.pricePerToken,
        apy: purchaseModal.asset.apy,
        location: purchaseModal.asset.location,
        solanaProgram: purchaseModal.asset.solanaProgram,
        mintAddress: purchaseModal.asset.mintAddress,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };

      // Add to portfolio
      portfolioService.addPurchasedRWAAsset(rwaAssetPurchase);

      // Show success modal
      setSuccessModal({
        show: true,
        asset: purchaseModal.asset,
        tokens: purchaseModal.tokens
      });

      // Close purchase modal
      setPurchaseModal({ show: false, asset: null, tokens: 1 });
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const viewInPortfolio = () => {
    setSuccessModal({ show: false, asset: null, tokens: 0 });
    // Add a small delay to ensure the portfolio service has processed the purchase
    setTimeout(() => {
      router.push('/app/portfolio');
    }, 100);
  };

  const viewInPortfolioFromSuccess = () => {
    setPurchaseSuccessModal({ show: false, asset: null, amount: 0 });
    // Add a small delay to ensure the portfolio service has processed the purchase
    setTimeout(() => {
      router.push('/app/portfolio');
    }, 100);
  };

  const handleProgressComplete = () => {
    setShowProgressTracker(false);
    // Navigate to portfolio to show the newly purchased asset
    setTimeout(() => {
      router.push('/app/portfolio');
    }, 100);
  };

  const AssetCard = ({ asset }: { asset: typeof solanaRWAAssets[0] }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900/80 to-slate-800/70 border border-gold-400/30 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:border-gold-400/50 transition-all cursor-pointer backdrop-blur-sm"
        onClick={() => setSelectedAsset(asset.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              {asset.category === 'residential' && <Building className="w-6 h-6 text-white" />}
              {asset.category === 'environmental' && <Leaf className="w-6 h-6 text-white" />}
              {asset.category === 'energy' && <Zap className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{asset.name}</h3>
              <p className="text-purple-300 text-sm font-medium">{asset.type}</p>
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
            <p className="text-lg font-bold text-purple-400">{asset.holders}</p>
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
            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-400/30">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400 font-mono">
            {asset.mintAddress.slice(0, 8)}...
          </div>
          <button className="flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium">
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
          className="bg-gradient-to-br from-slate-900/95 to-slate-800/90 border border-purple-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                {asset.category === 'residential' && <Building className="w-8 h-8 text-white" />}
                {asset.category === 'environmental' && <Leaf className="w-8 h-8 text-white" />}
                {asset.category === 'energy' && <Zap className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{asset.name}</h2>
                <p className="text-purple-300 text-lg font-medium">{asset.type} • {asset.location}</p>
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
              <div className="text-2xl font-bold text-purple-400 mb-1">{asset.apy}%</div>
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
                    <Star className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border border-gold-400/20 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-gray-300 leading-relaxed">{asset.description}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <Users className="w-4 h-4 text-purple-400 mr-2" />
              {asset.holders} token holders
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewSolscan(asset);
                }}
                className="px-6 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View on Solscan
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyTokens(asset);
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:from-purple-500/30 hover:to-indigo-500/30 transition-colors flex items-center font-medium"
              >
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
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
          className="bg-gradient-to-r from-purple-500/20 to-indigo-600/10 border border-purple-400/40 rounded-xl p-6 backdrop-blur-sm shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
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
      >
        {solanaFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title}            className="bg-gradient-to-br from-slate-900/80 to-slate-800/70 border border-purple-400/30 rounded-xl p-6 shadow-xl backdrop-blur-sm hover:border-purple-400/50 transition-all">
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
          <button 
            onClick={() => setTokenizeModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:from-purple-500/30 hover:to-indigo-500/30 transition-colors flex items-center font-medium"
          >
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

      {/* Purchase Modal */}
      <AnimatePresence>
        {purchaseModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setPurchaseModal({ show: false, asset: null, tokens: 1 })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Processing Transaction</h3>
                <p className="text-gray-400">Please confirm in your wallet...</p>
              </div>

              {purchaseModal.asset && (
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Asset:</span>
                    <span className="text-white font-medium">{purchaseModal.asset.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Tokens:</span>
                    <span className="text-white font-medium">{purchaseModal.tokens}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Price per token:</span>
                    <span className="text-white font-medium">${purchaseModal.asset.pricePerToken}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-purple-400 font-bold text-lg">
                        ${(purchaseModal.tokens * purchaseModal.asset.pricePerToken).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setPurchaseModal({ show: false, asset: null, tokens: 1 })}
                  className="flex-1 px-4 py-3 bg-gray-600/20 border border-gray-500/50 text-gray-300 rounded-xl hover:bg-gray-600/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executePurchase}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:from-purple-500/30 hover:to-indigo-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {successModal.show && (
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Purchase Successful!</h3>
              <p className="text-gray-400 mb-6">
                You've successfully purchased {successModal.tokens} tokens of {successModal.asset?.name}
              </p>
              
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <div className="text-gold-400 font-bold text-xl">
                  {successModal.tokens} Tokens
                </div>
                <div className="text-sm text-gray-400">
                  {successModal.asset?.name}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSuccessModal({ show: false, asset: null, tokens: 0 })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-xl font-medium transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSuccessModal({ show: false, asset: null, tokens: 0 });
                    router.push('/app/portfolio');
                  }}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-4 rounded-xl font-medium transition-all"
                >
                  View in Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tokenize Asset Modal */}
      <AnimatePresence>
        {tokenizeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setTokenizeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-400/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Tokenize Asset</h3>
                <button
                  onClick={() => setTokenizeModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Asset Details Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Asset Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Downtown Office Building"
                    className="w-full bg-slate-800/50 border border-gray-600 rounded-xl p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Asset Type</label>
                    <select className="w-full bg-slate-800/50 border border-gray-600 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50">
                      <option>Real Estate</option>
                      <option>Carbon Credits</option>
                      <option>Renewable Energy</option>
                      <option>Commodities</option>
                      <option>Art & Collectibles</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Total Value</label>
                    <input
                      type="number"
                      placeholder="1000000"
                      className="w-full bg-slate-800/50 border border-gray-600 rounded-xl p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Token Supply</label>
                    <input
                      type="number"
                      placeholder="10000"
                      className="w-full bg-slate-800/50 border border-gray-600 rounded-xl p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Price per Token</label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full bg-slate-800/50 border border-gray-600 rounded-xl p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe your asset and its investment potential..."
                    className="w-full bg-slate-800/50 border border-gray-600 rounded-xl p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 resize-none"
                  />
                </div>

                {/* Fee Information */}
                <div className="bg-slate-800/30 rounded-xl p-3">
                  <h4 className="text-white font-medium mb-2 text-sm">Tokenization Fees</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Fee</span>
                      <span className="text-white">2.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Solana Network Fee</span>
                      <span className="text-white">~0.001 SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Legal & Compliance</span>
                      <span className="text-white">$500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setTokenizeModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 px-4 rounded-xl font-medium transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTokenizeModal(false);
                    setTokenizeSuccessModal(true);
                    setTimeout(() => {
                      setTokenizeSuccessModal(false);
                    }, 2000);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Coins className="w-4 h-4" />
                  Tokenize Asset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View on Solscan Modal */}
      <AnimatePresence>
        {viewSolscanModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setViewSolscanModal({ show: false, asset: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-400/30 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">View on Solscan</h3>
                    <p className="text-blue-300 text-sm">{viewSolscanModal.asset?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewSolscanModal({ show: false, asset: null })}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3">Blockchain Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Program ID:</span>
                      <span className="font-mono text-blue-400">{viewSolscanModal.asset?.solanaProgram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mint Address:</span>
                      <span className="font-mono text-blue-400">{viewSolscanModal.asset?.mintAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-green-400">Solana Mainnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token Standard:</span>
                      <span className="text-blue-400">SPL Token</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3">Asset Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 block">Total Supply</span>
                      <span className="text-white font-bold">{viewSolscanModal.asset?.tokenSupply.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Holders</span>
                      <span className="text-white font-bold">{viewSolscanModal.asset?.holders}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Liquidity</span>
                      <span className="text-white font-bold">${(viewSolscanModal.asset?.liquidity / 1000).toFixed(0)}K</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Price</span>
                      <span className="text-white font-bold">${viewSolscanModal.asset?.pricePerToken}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setViewSolscanModal({ show: false, asset: null })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const solscanUrl = `https://solscan.io/token/${viewSolscanModal.asset?.mintAddress}`;
                    window.open(solscanUrl, '_blank');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Open Solscan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buy Tokens Modal */}
      <AnimatePresence>
        {buyTokensModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setBuyTokensModal({ show: false, asset: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Buy Tokens</h3>
                    <p className="text-purple-300 text-sm">{buyTokensModal.asset?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setBuyTokensModal({ show: false, asset: null })}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Asset:</span>
                    <span className="text-white font-medium">{buyTokensModal.asset?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Price per token:</span>
                    <span className="text-white font-medium">${buyTokensModal.asset?.pricePerToken}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">APY:</span>
                    <span className="text-green-400 font-medium">{buyTokensModal.asset?.apy}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Tokens</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setBuyTokensAmount(Math.max(1, buyTokensAmount - 1))}
                      className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={buyTokensAmount}
                      onChange={(e) => setBuyTokensAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 bg-slate-800/50 border border-gray-600 rounded-xl p-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                    <button
                      onClick={() => setBuyTokensAmount(buyTokensAmount + 1)}
                      className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-xl p-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Total Cost:</span>
                    <span className="text-purple-400 font-bold text-xl">
                      ${(buyTokensAmount * (buyTokensModal.asset?.pricePerToken || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setBuyTokensModal({ show: false, asset: null })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeBuyTokens}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      Buy Tokens
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Success Modal (2-second auto-close) */}
      <AnimatePresence>
        {purchaseSuccessModal.show && (
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
              className="bg-gradient-to-br from-green-800 to-green-700 border-2 border-green-500/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Animated Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  initial={{ 
                    x: Math.random() * 300 - 150, 
                    y: Math.random() * 300 - 150, 
                    opacity: 0, 
                    scale: 0 
                  }}
                  animate={{ 
                    x: Math.random() * 400 - 200, 
                    y: Math.random() * 400 - 200, 
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
                <Coins className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Purchase Successful! 🎉
              </motion.h2>

              <motion.p
                className="text-green-200 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                You've successfully purchased {purchaseSuccessModal.amount} tokens of {purchaseSuccessModal.asset?.name}
              </motion.p>

              <motion.div
                className="bg-green-900/50 rounded-xl p-4 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-green-300 font-bold text-lg">
                  {purchaseSuccessModal.amount} Tokens
                </div>
                <div className="text-sm text-green-400">
                  Total: ${(purchaseSuccessModal.amount * (purchaseSuccessModal.asset?.pricePerToken || 0)).toLocaleString()}
                </div>
              </motion.div>

              <motion.div
                className="text-sm text-green-300 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Tokens added to your portfolio! 🚀
              </motion.div>

              <motion.button
                onClick={viewInPortfolioFromSuccess}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Eye className="w-4 h-4" />
                View in Portfolio
              </motion.button>

              <motion.div
                className="absolute top-4 right-4 w-6 h-6 text-green-300"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Star className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tokenize Success Modal */}
      <AnimatePresence>
        {tokenizeSuccessModal && (
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
              {/* Success Animation */}
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
                  <Coins className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-2"
              >
                🎉 Asset Tokenized Successfully!
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 mb-4"
              >
                Your real-world asset has been successfully tokenized on Solana blockchain
              </motion.p>

              {/* Asset Info */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-800/50 rounded-xl p-4 mb-4"
              >
                <div className="text-purple-400 font-bold text-lg mb-1">
                  Asset Tokenized on Solana
                </div>
                <div className="text-sm text-gray-400">
                  Ready for high-speed trading on Solana
                </div>
              </motion.div>

              {/* Floating Particles */}
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
                    className="absolute w-3 h-3 bg-purple-400 rounded-full"
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

      {/* Purchase Progress Tracker */}
      <PurchaseProgressTracker
        isVisible={showProgressTracker}
        onComplete={handleProgressComplete}
        assetName={progressTrackerData.assetName}
        tokenAmount={progressTrackerData.tokenAmount}
        transactionHash={progressTrackerData.transactionHash}
      />
    </div>
  );
}
