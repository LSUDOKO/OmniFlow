"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Trophy,
  Star,
  TrendingUp,
  Zap,
  Crown,
  Target,
  Gift,
  Users,
  BarChart3,
  Coins,
  Award,
  Flame,
  Calendar,
  ArrowUp,
  Plus,
  Gamepad2,
  Medal,
  Sparkles,
  Lock,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const playerStats = {
  level: 12,
  experience: 8450,
  nextLevelXP: 10000,
  governancePoints: 2847,
  totalInvested: '$45,230',
  portfolioValue: '$52,180',
  totalReturns: '$6,950',
  winRate: 78.5,
  streak: 7,
  title: 'RWA Baron',
  titleRarity: 'Epic'
};

const virtualAssets = [
  {
    id: 'manhattan-office',
    name: 'Manhattan Office Complex',
    type: 'Real Estate',
    level: 3,
    baseYield: 8.5,
    currentYield: 12.2,
    upgrades: ['Security System', 'Energy Efficiency', 'Premium Location'],
    nextUpgrade: 'Smart Building Tech',
    upgradeCost: 150,
    synergy: 'Real Estate Portfolio',
    synergyBonus: '+15% yield',
    realOwnership: true,
    icon: '🏢'
  },
  {
    id: 'gold-vault',
    name: 'LBMA Gold Vault',
    type: 'Precious Metals',
    level: 2,
    baseYield: 6.2,
    currentYield: 8.8,
    upgrades: ['Secure Storage', 'Insurance Premium'],
    nextUpgrade: 'Diversification Bonus',
    upgradeCost: 100,
    synergy: 'Precious Metals Collection',
    synergyBonus: '+10% stability',
    realOwnership: true,
    icon: '🥇'
  },
  {
    id: 'carbon-forest',
    name: 'Amazon Forest Credits',
    type: 'Carbon Credits',
    level: 1,
    baseYield: 15.8,
    currentYield: 15.8,
    upgrades: [],
    nextUpgrade: 'Verification Boost',
    upgradeCost: 75,
    synergy: 'ESG Portfolio',
    synergyBonus: '+20% ESG score',
    realOwnership: false,
    icon: '🌳'
  }
];

const achievements = [
  {
    id: 'first-investment',
    name: 'First Steps',
    description: 'Make your first RWA investment',
    rarity: 'Common',
    points: 50,
    unlocked: true,
    icon: '🎯'
  },
  {
    id: 'diversification-master',
    name: 'Diversification Master',
    description: 'Own assets in 4+ different categories',
    rarity: 'Rare',
    points: 200,
    unlocked: true,
    icon: '📊'
  },
  {
    id: 'yield-hunter',
    name: 'Yield Hunter',
    description: 'Achieve 15%+ APY on any asset',
    rarity: 'Epic',
    points: 500,
    unlocked: true,
    icon: '🏹'
  },
  {
    id: 'whale-status',
    name: 'RWA Whale',
    description: 'Invest over $100,000 in RWA tokens',
    rarity: 'Legendary',
    points: 1000,
    unlocked: false,
    icon: '🐋'
  },
  {
    id: 'perfect-month',
    name: 'Perfect Month',
    description: 'Positive returns for 30 consecutive days',
    rarity: 'Mythic',
    points: 2000,
    unlocked: false,
    icon: '👑'
  }
];

const leaderboard = [
  { rank: 1, player: '0x742d...3f8a', title: 'RWA Emperor', value: '$2.4M', returns: '+24.8%', badge: '👑' },
  { rank: 2, player: '0x8b3c...9d2e', title: 'Asset Overlord', value: '$1.8M', returns: '+19.2%', badge: '🏆' },
  { rank: 3, player: '0x1a5f...7c4b', title: 'Yield Master', value: '$1.2M', returns: '+22.1%', badge: '🥉' },
  { rank: 4, player: 'You', title: 'RWA Baron', value: '$52.2K', returns: '+15.4%', badge: '⭐' },
  { rank: 5, player: '0x9e2d...5a8f', title: 'Token Trader', value: '$48.7K', returns: '+12.8%', badge: '💎' }
];

const dailyRewards = [
  { day: 1, reward: '10 GP', claimed: true },
  { day: 2, reward: '15 GP', claimed: true },
  { day: 3, reward: '20 GP', claimed: true },
  { day: 4, reward: '25 GP', claimed: true },
  { day: 5, reward: '30 GP', claimed: true },
  { day: 6, reward: '40 GP', claimed: true },
  { day: 7, reward: '50 GP + Bonus', claimed: false, isToday: true }
];

export default function RWATycoonPage() {
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400 border-gray-500/30';
      case 'rare': return 'text-blue-400 border-blue-500/30';
      case 'epic': return 'text-purple-400 border-purple-500/30';
      case 'legendary': return 'text-yellow-400 border-yellow-500/30';
      case 'mythic': return 'text-red-400 border-red-500/30';
      default: return 'text-gray-400 border-gray-500/30';
    }
  };

  const handleUpgrade = (assetId: string) => {
    setSelectedAsset(assetId);
    setShowUpgradeModal(true);
  };

  const claimDailyReward = () => {
    // Simulate claiming reward
    console.log('Daily reward claimed!');
  };

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
              RWA Tycoon
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Transform RWA investing into an engaging game with achievements, leaderboards, and virtual asset management
            </p>
          </div>
          <ConnectButton />
        </motion.div>

        {/* Player Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 backdrop-blur-xl border border-gold-500/30 rounded-3xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Info */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {playerStats.level}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Level {playerStats.level}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRarityColor(playerStats.titleRarity)}`}>
                    {playerStats.title}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-white">{playerStats.experience.toLocaleString()} / {playerStats.nextLevelXP.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(playerStats.experience / playerStats.nextLevelXP) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Coins className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{playerStats.governancePoints.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Governance Points</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{playerStats.portfolioValue}</div>
                <div className="text-xs text-gray-400">Portfolio Value</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{playerStats.winRate}%</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{playerStats.streak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 mb-8"
        >
          {[
            { id: 'portfolio', label: 'Virtual Portfolio', icon: BarChart3 },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
            { id: 'rewards', label: 'Daily Rewards', icon: Gift }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {virtualAssets.map((asset) => (
                <div key={asset.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  {/* Asset Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{asset.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                        <p className="text-sm text-gray-400">{asset.type}</p>
                      </div>
                    </div>
                    {asset.realOwnership && (
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                        Real Asset
                      </div>
                    )}
                  </div>

                  {/* Level and Yield */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-gold-400 mb-1">Lv.{asset.level}</div>
                      <div className="text-xs text-gray-400">Asset Level</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{asset.currentYield}%</div>
                      <div className="text-xs text-gray-400">Current APY</div>
                    </div>
                  </div>

                  {/* Upgrades */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Active Upgrades</h4>
                    <div className="space-y-2">
                      {asset.upgrades.map((upgrade, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{upgrade}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Synergy Bonus */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-400">{asset.synergy}</span>
                    </div>
                    <div className="text-xs text-gray-300">{asset.synergyBonus}</div>
                  </div>

                  {/* Next Upgrade */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{asset.nextUpgrade}</div>
                      <div className="text-xs text-gray-400">{asset.upgradeCost} GP</div>
                    </div>
                    <button
                      onClick={() => handleUpgrade(asset.id)}
                      disabled={playerStats.governancePoints < asset.upgradeCost}
                      className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowUp className="w-4 h-4" />
                      Upgrade
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {selectedTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 ${!achievement.unlocked ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    {achievement.unlocked ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{achievement.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </div>
                    <div className="flex items-center gap-1 text-gold-400">
                      <Coins className="w-4 h-4" />
                      <span className="text-sm font-medium">{achievement.points} GP</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {selectedTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Crown className="w-8 h-8 text-gold-400" />
                Global Leaderboard
              </h3>
              <div className="space-y-4">
                {leaderboard.map((player) => (
                  <div key={player.rank} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    player.player === 'You' ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-white/5 hover:bg-white/10'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center text-lg font-bold">
                        {player.rank <= 3 ? player.badge : player.rank}
                      </div>
                      <div>
                        <div className="font-medium text-white">{player.player}</div>
                        <div className={`text-sm border px-2 py-1 rounded-full ${getRarityColor('epic')}`}>
                          {player.title}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{player.value}</div>
                      <div className="text-sm text-green-400">{player.returns}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Gift className="w-8 h-8 text-gold-400" />
                Daily Login Rewards
              </h3>
              <div className="grid grid-cols-7 gap-4 mb-8">
                {dailyRewards.map((reward) => (
                  <div key={reward.day} className={`bg-white/5 rounded-2xl p-4 text-center transition-all duration-300 ${
                    reward.isToday ? 'ring-2 ring-gold-500 bg-gold-500/20' : reward.claimed ? 'opacity-60' : ''
                  }`}>
                    <div className="text-lg font-bold text-white mb-2">Day {reward.day}</div>
                    <div className="text-sm text-gray-400 mb-3">{reward.reward}</div>
                    {reward.claimed ? (
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    ) : reward.isToday ? (
                      <button
                        onClick={claimDailyReward}
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-3 rounded-xl text-xs font-medium transition-all duration-300"
                      >
                        Claim
                      </button>
                    ) : (
                      <Clock className="w-6 h-6 text-gray-500 mx-auto" />
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">Streak Bonus Active!</h4>
                <p className="text-gray-300 mb-4">You're on a {playerStats.streak}-day streak. Keep it up for bigger rewards!</p>
                <div className="text-sm text-purple-400">Next milestone: 10 days (+50% bonus)</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showUpgradeModal && selectedAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUpgradeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full"
              >
                {(() => {
                  const asset = virtualAssets.find(a => a.id === selectedAsset);
                  if (!asset) return null;
                  
                  return (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-4">{asset.icon}</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Upgrade Asset</h3>
                        <p className="text-gray-400">{asset.name}</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Next Upgrade</span>
                            <span className="text-white font-medium">{asset.nextUpgrade}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Cost</span>
                            <span className="text-gold-400 font-medium">{asset.upgradeCost} GP</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Yield Boost</span>
                            <span className="text-green-400 font-medium">+1.5% APY</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowUpgradeModal(false)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowUpgradeModal(false);
                            // Handle upgrade logic
                          }}
                          disabled={playerStats.governancePoints < asset.upgradeCost}
                          className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ArrowUp className="w-4 h-4" />
                          Upgrade
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
