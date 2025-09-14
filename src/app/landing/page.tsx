"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Globe,
  TrendingUp,
  Zap,
  Star,
  Building,
  Leaf,
  Gem,
  Factory,
  Users,
  BarChart3,
  Award,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Tokenize Real-World Assets",
    description: "Transform physical assets into digital tokens with full legal compliance and verification",
    icon: Building,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Cross-Chain Bridge",
    description: "Seamlessly move assets across Ethereum, Solana, Polygon, and other major blockchains",
    icon: Globe,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "AI-Powered Due Diligence",
    description: "Get instant risk assessment and yield projections powered by advanced AI algorithms",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Yield Optimization",
    description: "Maximize returns with automated yield farming and staking strategies",
    icon: TrendingUp,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Institutional Security",
    description: "Bank-grade security with multi-signature wallets and insurance coverage",
    icon: Shield,
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Gamified Experience",
    description: "Earn rewards, unlock achievements, and compete in the RWA Tycoon leaderboards",
    icon: Award,
    gradient: "from-indigo-500 to-purple-500",
  },
];

const stats = [
  { label: "Total Value Locked", value: "$2.8B+", icon: BarChart3 },
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Assets Tokenized", value: "1,200+", icon: Building },
  { label: "Supported Chains", value: "8+", icon: Globe },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between p-6 lg:p-8"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center">
            <Gem className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              SolanaFlow
            </h1>
            <p className="text-xs text-gray-400">Universal RWA Platform</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {["Features", "Developer", "Assets", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {item}
            </a>
          ))}
        </nav>

        <Link href="/app">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl font-bold text-white shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-gold-400 to-purple-600 bg-clip-text text-transparent">
                YOUR HOME
              </span>
              <br />
              <span className="bg-gradient-to-r from-gold-400 via-purple-400 to-gold-600 bg-clip-text text-transparent">
                IN WEB3
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              The universal platform for tokenizing, trading, and managing real-world assets 
              across multiple blockchains with institutional-grade security.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Link href="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-gold-500/25 hover:shadow-gold-500/40 transition-all inline-flex items-center space-x-3"
              >
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-gold-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent">
              THE EVERYTHING
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-gold-400 bg-clip-text text-transparent">
              PLATFORM
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to participate in the tokenized economy, 
            all in one powerful platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="group relative"
              >
                <div className="h-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="p-12 bg-gradient-to-br from-purple-900/50 to-gold-900/50 backdrop-blur-xl border border-white/20 rounded-3xl"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent">
              Ready to get started?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already tokenizing and trading 
            real-world assets on SolanaFlow.
          </p>
          
          <Link href="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-gold-500/25 hover:shadow-gold-500/40 transition-all inline-flex items-center space-x-3"
            >
              <span>Enter SolanaFlow</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
