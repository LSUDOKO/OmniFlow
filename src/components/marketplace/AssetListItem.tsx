"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Eye, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowUpRight,
  BarChart3
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: string;
  price: number;
  pricePerToken: number;
  image: string;
  yield: number;
  available: number;
  totalSupply: number;
  description: string;
  verified: boolean;
  chain: string;
  marketCap: string;
  liquidity: string;
  riskScore: string;
  aiScore: number;
  compliance: string;
}

interface AssetListItemProps {
  asset: Asset;
  onBuy: () => void;
  index?: number;
}

export default function AssetListItem({ asset, onBuy, index = 0 }: AssetListItemProps) {
  const getChainColor = (chain: string) => {
    switch (chain) {
      case "Ethereum": return "bg-blue-500";
      case "Polygon": return "bg-purple-500";
      case "BSC": return "bg-yellow-500";
      case "Solana": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "very low": return "text-green-400";
      case "low": return "text-green-300";
      case "medium": return "text-yellow-400";
      case "high": return "text-orange-400";
      default: return "text-gray-400";
    }
  };

  const getLiquidityColor = (liquidity: string) => {
    switch (liquidity.toLowerCase()) {
      case "high": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        {/* Asset Info */}
        <div className="flex items-center gap-6 flex-1">
          {/* Asset Image & Basic Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={asset.image} 
                alt={asset.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs text-white ${getChainColor(asset.chain)}`}>
                {asset.chain}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                {asset.verified && (
                  <Shield className="w-4 h-4 text-green-400" />
                )}
              </div>
              <p className="text-gray-400 text-sm mb-1">{asset.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-400">{asset.type}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Market Cap: {asset.marketCap}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 flex-1 max-w-2xl">
            {/* Price */}
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Price</div>
              <div className="text-lg font-bold text-white">${asset.pricePerToken}</div>
            </div>

            {/* Yield */}
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Yield</div>
              <div className="text-lg font-bold text-green-400 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {asset.yield}%
              </div>
            </div>

            {/* Liquidity */}
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Liquidity</div>
              <div className={`text-lg font-bold ${getLiquidityColor(asset.liquidity)}`}>
                {asset.liquidity}
              </div>
            </div>

            {/* Risk Score */}
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Risk</div>
              <div className={`text-lg font-bold ${getRiskColor(asset.riskScore)}`}>
                {asset.riskScore}
              </div>
            </div>
          </div>
        </div>

        {/* AI Score & Actions */}
        <div className="flex items-center gap-6">
          {/* AI Score */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">AI Score</div>
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray={`${asset.aiScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{asset.aiScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
              <Eye className="w-5 h-5" />
            </button>
            
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
              <BarChart3 className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onBuy}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-gold-500/25"
            >
              <ShoppingCart className="w-5 h-5" />
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Available: {asset.available.toLocaleString()} / {asset.totalSupply.toLocaleString()}</span>
          <span className="text-sm text-gray-400">{Math.round((asset.available / asset.totalSupply) * 100)}% available</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(asset.available / asset.totalSupply) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
