"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { 
  Filter, 
  Search, 
  LayoutGrid, 
  List, 
  TrendingUp, 
  Shield, 
  Zap,
  Star,
  ArrowUpRight,
  Globe,
  Award,
  BarChart3
} from 'lucide-react';
import AssetCard from '@/components/marketplace/AssetCard';
import AssetListItem from '@/components/marketplace/AssetListItem';
import TransactionModal from '@/components/marketplace/TransactionModal';
import { portfolioService } from '@/services/portfolioService';
import { useToast } from '@chakra-ui/react';

// Enhanced mock data with more realistic RWA assets
const mockAssets = [
  {
    id: 'RWA001',
    name: 'Manhattan Office Complex',
    type: 'Real Estate',
    price: 312500,
    pricePerToken: 250,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    yield: 8.5,
    available: 1250,
    totalSupply: 5000,
    description: 'Prime commercial real estate in downtown Manhattan with AAA tenants.',
    verified: true,
    chain: 'Ethereum',
    marketCap: '$1.25M',
    liquidity: 'High',
    riskScore: 'Low',
    aiScore: 92,
    compliance: 'Institutional'
  },
  {
    id: 'RWA002',
    name: 'Amazon Carbon Credits',
    type: 'Carbon Credits',
    price: 112500,
    pricePerToken: 4.5,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    yield: 12.3,
    available: 25000,
    totalSupply: 100000,
    description: 'Verified carbon credits from Amazon rainforest preservation.',
    verified: true,
    chain: 'Polygon',
    marketCap: '$450K',
    liquidity: 'Medium',
    riskScore: 'Medium',
    aiScore: 88,
    compliance: 'Enhanced'
  },
  {
    id: 'RWA003',
    name: 'Swiss Gold Reserves',
    type: 'Precious Metals',
    price: 3100000,
    pricePerToken: 6200,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
    yield: 5.2,
    available: 500,
    totalSupply: 1000,
    description: 'Physical gold stored in secure Swiss vaults with full insurance.',
    verified: true,
    chain: 'BSC',
    marketCap: '$6.2M',
    liquidity: 'High',
    riskScore: 'Very Low',
    aiScore: 95,
    compliance: 'Institutional'
  },
  {
    id: 'RWA004',
    name: 'Renewable Energy Portfolio',
    type: 'Infrastructure',
    price: 2500000,
    pricePerToken: 500,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
    yield: 9.8,
    available: 5000,
    totalSupply: 10000,
    description: 'Diversified solar and wind energy projects across Europe.',
    verified: true,
    chain: 'Ethereum',
    marketCap: '$5M',
    liquidity: 'Medium',
    riskScore: 'Low',
    aiScore: 90,
    compliance: 'Enhanced'
  },
  {
    id: 'RWA005',
    name: 'Luxury Art Collection',
    type: 'Art & Collectibles',
    price: 850000,
    pricePerToken: 8500,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    yield: 18.2,
    available: 100,
    totalSupply: 200,
    description: 'Curated collection of blue-chip contemporary artworks.',
    verified: true,
    chain: 'Polygon',
    marketCap: '$1.7M',
    liquidity: 'Low',
    riskScore: 'High',
    aiScore: 78,
    compliance: 'Basic'
  },
  {
    id: 'RWA006',
    name: 'Agricultural Commodities',
    type: 'Commodities',
    price: 450000,
    pricePerToken: 45,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    yield: 7.5,
    available: 10000,
    totalSupply: 20000,
    description: 'Diversified agricultural commodity futures and storage.',
    verified: true,
    chain: 'BSC',
    marketCap: '$900K',
    liquidity: 'High',
    riskScore: 'Medium',
    aiScore: 85,
    compliance: 'Enhanced'
  },
];

const assetTypes = [
  { name: 'All Assets', count: 6, active: true },
  { name: 'Real Estate', count: 1, active: false },
  { name: 'Carbon Credits', count: 1, active: false },
  { name: 'Precious Metals', count: 1, active: false },
  { name: 'Infrastructure', count: 1, active: false },
  { name: 'Art & Collectibles', count: 1, active: false },
  { name: 'Commodities', count: 1, active: false },
];

const marketStats = [
  { label: 'Total Value Locked', value: '$12.85M', change: '+15.2%', icon: BarChart3 },
  { label: 'Active Assets', value: '247', change: '+8.1%', icon: Globe },
  { label: 'Total Investors', value: '12,847', change: '+22.5%', icon: Award },
  { label: 'Avg. Yield', value: '9.7%', change: '+1.2%', icon: TrendingUp },
];

export default function MarketplaceContent() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const { address, isConnected } = useAccount();
  const toast = useToast();

  const filteredAssets = mockAssets.filter(asset => {
    const matchesFilter = selectedFilter === 'All Assets' || asset.type === selectedFilter;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBuyClick = (asset: any) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const handleConfirmTransaction = async (amount: number) => {
    if (!selectedAsset || !address) {
      return false;
    }

    try {
      console.log(`Processing purchase for ${selectedAsset.name} - ${amount} tokens`);
      
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        // Set wallet address in portfolio service
        portfolioService.setWalletAddress(address);
        
        // Add purchased asset to portfolio
        const purchaseData = {
          id: selectedAsset.id,
          name: selectedAsset.name,
          type: selectedAsset.type,
          category: selectedAsset.type.toLowerCase().replace(/\s+/g, '-'),
          tokensPurchased: amount,
          pricePerToken: selectedAsset.pricePerToken,
          apy: selectedAsset.yield,
          location: getLocationFromAssetType(selectedAsset.type),
          solanaProgram: generateMockSolanaProgram(),
          mintAddress: generateMockMintAddress(),
          transactionHash: generateMockTxHash()
        };
        
        portfolioService.addPurchasedRWAAsset(purchaseData);
        
        // Show success toast
        toast({
          title: 'Purchase Successful!',
          description: `${amount} tokens of ${selectedAsset.name} added to your portfolio`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        console.log('Asset added to portfolio:', purchaseData);
        return true;
      } else {
        // Show error toast
        toast({
          title: 'Transaction Failed',
          description: 'Unable to complete the purchase. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast({
        title: 'Transaction Error',
        description: 'An unexpected error occurred during the transaction.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  // Helper functions for mock data generation
  const getLocationFromAssetType = (type: string): string => {
    const locationMap: { [key: string]: string } = {
      'Real Estate': 'United States',
      'Carbon Credits': 'Brazil',
      'Precious Metals': 'Switzerland',
      'Infrastructure': 'Germany',
      'Art & Collectibles': 'United Kingdom',
      'Commodities': 'Australia'
    };
    return locationMap[type] || 'United States';
  };

  const generateMockSolanaProgram = (): string => {
    return `omniflow_rwa_${Math.random().toString(36).substr(2, 8)}`;
  };

  const generateMockMintAddress = (): string => {
    return Array.from({ length: 44 }, () => 
      'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 58)]
    ).join('');
  };

  const generateMockTxHash = (): string => {
    return Array.from({ length: 64 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
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
            RWA Marketplace
          </h1>
          <p className="text-xl text-gray-300">Discover, trade, and invest in tokenized real-world assets</p>
        </div>
      </motion.div>

      {/* Market Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {marketStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-8 h-8 text-gold-400" />
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Asset Type Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {assetTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => setSelectedFilter(type.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedFilter === type.name
                  ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/25'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {type.name} ({type.count})
            </button>
          ))}
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets, types, or chains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            
            <div className="flex items-center bg-white/10 rounded-xl p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-gold-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-gold-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assets Display */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAssets.map((asset, index) => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  onBuy={() => handleBuyClick(asset)}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredAssets.map((asset, index) => (
                <AssetListItem 
                  key={asset.id} 
                  asset={asset} 
                  onBuy={() => handleBuyClick(asset)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">No assets found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Transaction Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <TransactionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            asset={selectedAsset}
            onConfirm={handleConfirmTransaction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
