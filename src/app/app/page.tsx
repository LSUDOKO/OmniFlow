"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  LayoutDashboard,
  ShoppingCart,
  PieChart,
  BarChart3,
  ArrowLeftRight,
  Zap,
  Shield,
  Users,
  Settings,
  HelpCircle,
  Gem,
  TrendingUp,
  Globe,
  Award,
  Building,
  Leaf,
  Factory,
  ArrowRight,
  Lock,
  Eye,
  Brain,
  Award as Certificate,
  FileCheck,
  Zap as SolanaIcon,
  Vote,
  Leaf as SustainabilityIcon,
  User as IdentityIcon,
  Scale as LegalIcon,
  Brain as AIIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";

// Dynamic imports for different sections
const DashboardContent = dynamic(() => import('./dashboard/DashboardContent'), { ssr: false });
const LegalContent = dynamic(() => import('./legal/LegalContent'), { ssr: false });
const AIMatchingContent = dynamic(() => import('./ai-matching/AIMatchingContent'), { ssr: false });
const MarketplaceContent = dynamic(() => import('./marketplace/MarketplaceContent'), { ssr: false });
const PortfolioContent = dynamic(() => import('./portfolio/PortfolioContent'), { ssr: false });
const AnalyticsContent = dynamic(() => import('./analytics/AnalyticsContent'), { ssr: false });
const BridgeContent = dynamic(() => import('./bridge/BridgeContent'), { ssr: false });
const YieldVaultsContent = dynamic(() => import('./yield-vaults/YieldVaultsContent'), { ssr: false });
const RWATycoonContent = dynamic(() => import('./rwa-tycoon/rwa-tycoonContent'), { ssr: false });
const ComplianceContent = dynamic(() => import('./compliance/ComplianceContent'), { ssr: false });
const SettingsContent = dynamic(() => import('./settings/SettingsContent'), { ssr: false });
const HelpSupportContent = dynamic(() => import('./help/HelpSupportContent'), { ssr: false });
const DueDiligenceContent = dynamic(() => import('./due-diligence/DueDiligenceContent'), { ssr: false });
const CertificatesContent = dynamic(() => import('./certificates/CertificatesContent'), { ssr: false });
const AuthenticityContent = dynamic(() => import('./authenticity/AuthenticityContent'), { ssr: false });
const SolanaRWAContent = dynamic(() => import('./solana-rwa/SolanaRWAContent'), { ssr: false });
const GovernanceContent = dynamic(() => import('./governance/GovernanceContent'), { ssr: false });
const SustainabilityContent = dynamic(() => import('./sustainability/SustainabilityContent'), { ssr: false });
const IdentityPassportContent = dynamic(() => import('./identity-passport/IdentityPassportContent'), { ssr: false });
// Priority Navigation Items (MetaMask Hackathon Demo Flow)
const priorityNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: null },
  { id: 'identity-passport', label: 'Identity Passport', icon: IdentityIcon, href: null },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart, href: null },
  { id: 'solana-rwa', label: 'Solana RWA', icon: SolanaIcon, href: null },
  { id: 'bridge', label: 'Bridge', icon: ArrowLeftRight, href: null },
  { id: 'yield', label: 'Yield Vaults', icon: TrendingUp, href: null },
  { id: 'portfolio', label: 'Portfolio', icon: PieChart, href: null },
];

// Additional Navigation Items (Collapsible)
const additionalNavItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: null },
  { id: 'tycoon', label: 'RWA Tycoon', icon: Award, href: null },
  { id: 'compliance', label: 'Compliance', icon: Shield, href: null },
  { id: 'due-diligence', label: 'Due Diligence', icon: Brain, href: null },
  { id: 'certificates', label: 'Certificates', icon: Certificate, href: null },
  { id: 'authenticity', label: 'Authenticity', icon: FileCheck, href: null },
  { id: 'governance', label: 'Governance', icon: Vote, href: null },
  { id: 'sustainability', label: 'Sustainability', icon: SustainabilityIcon, href: null },
  { id: 'legal', label: 'Legal', icon: LegalIcon, href: null },
  { id: 'ai-matching', label: 'AI Matching', icon: AIIcon, href: null },
];

const bottomNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings, href: null },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, href: null },
];

// Preview Cards for Non-Connected Users
const previewCards = [
  {
    title: "Tokenize Real Estate",
    description: "Transform physical properties into tradeable digital assets",
    icon: Building,
    gradient: "from-blue-500 to-cyan-500",
    value: "$2.4B",
    label: "Total Value Locked"
  },
  {
    title: "Cross-Chain Bridge", 
    description: "Move assets seamlessly across 8+ blockchain networks",
    icon: Globe,
    gradient: "from-purple-500 to-pink-500",
    value: "50K+",
    label: "Transactions"
  },
  {
    title: "AI Due Diligence",
    description: "Get instant risk assessment powered by advanced AI",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
    value: "95%",
    label: "Accuracy Rate"
  },
  {
    title: "Yield Optimization",
    description: "Maximize returns with automated strategies",
    icon: TrendingUp,
    gradient: "from-green-500 to-emerald-500",
    value: "12.5%",
    label: "Avg APY"
  },
  {
    title: "Carbon Credits",
    description: "Trade verified environmental impact certificates",
    icon: Leaf,
    gradient: "from-emerald-500 to-green-500",
    value: "1.2M",
    label: "Tons CO2"
  },
  {
    title: "Precious Metals",
    description: "Gold, silver, and platinum backed digital tokens",
    icon: Gem,
    gradient: "from-yellow-600 to-yellow-500",
    value: "$156M",
    label: "Assets Under Management"
  }
];

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-set dashboard as active when wallet is connected (only once)
  useEffect(() => {
    if (mounted && isConnected) {
      setActiveTab('dashboard');
    }
  }, [mounted, isConnected]);

  if (!mounted) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/landing" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Gem className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">OmniFlow</h1>
              <p className="text-xs text-gray-400">Universal RWA Platform</p>
            </div>
          </Link>
        </div>

        {/* Priority Navigation Items */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {priorityNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (item.href) {
              // External links
              return (
                <Link key={item.id} href={item.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {!isConnected && (
                      <Lock className="w-4 h-4 ml-auto text-gray-500" />
                    )}
                  </motion.button>
                </Link>
              );
            }
            
            // Internal sections
            return (
              <motion.button
                key={item.id}
                onClick={() => isConnected && setActiveTab(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isConnected}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {!isConnected && (
                  <Lock className="w-4 h-4 ml-auto text-gray-500" />
                )}
              </motion.button>
            );
          })}
          
          {/* More+ Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMoreItems(!showMoreItems)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-300 hover:text-white hover:bg-white/5 mt-4"
          >
            <div className="flex items-center space-x-3">
              <ChevronDown className={`w-5 h-5 transition-transform ${showMoreItems ? 'rotate-180' : ''}`} />
              <span className="font-medium">More</span>
            </div>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{additionalNavItems.length}</span>
          </motion.button>
          
          {/* Additional Navigation Items (Collapsible) */}
          <AnimatePresence>
            {showMoreItems && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {additionalNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.id)}
                      disabled={!isConnected}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {!isConnected && (
                        <Lock className="w-4 h-4 ml-auto text-gray-500" />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (item.href) {
              // External links
              return (
                <Link key={item.id} href={item.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {!isConnected && (
                      <Lock className="w-4 h-4 ml-auto text-gray-500" />
                    )}
                  </motion.button>
                </Link>
              );
            }
            
            // Internal sections
            return (
              <motion.button
                key={item.id}
                onClick={() => isConnected && setActiveTab(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isConnected}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {!isConnected && (
                  <Lock className="w-4 h-4 ml-auto text-gray-500" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <div className="h-20 bg-black/10 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">
              {[...priorityNavItems, ...additionalNavItems].find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-400">
              {isConnected ? 'Connected and ready to trade' : 'Preview mode - Connect wallet to access full features'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isConnected && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                <Eye className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">Preview Mode</span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {!isConnected ? (
              // Preview Mode Content
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Preview Banner */}
                <div className="bg-gradient-to-r from-purple-900/50 to-gold-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Welcome to <span className="bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent">OmniFlow</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                    Explore our platform features below. Connect your wallet to start tokenizing and trading real-world assets.
                  </p>
                  <ConnectButton />
                </div>

                {/* Feature Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previewCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                      >
                        <div className="h-full p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer">
                          <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                            {card.title}
                          </h3>
                          
                          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                            {card.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-white">{card.value}</div>
                              <div className="text-xs text-gray-400">{card.label}</div>
                            </div>
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="w-4 h-4 text-gold-400" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Lock Overlay */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-center">
                            <Lock className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-white">Connect Wallet to Access</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Call to Action */}
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
                  <p className="text-gray-300 mb-6">Connect your wallet to access the full OmniFlow experience</p>
                  <ConnectButton />
                </div>
              </motion.div>
            ) : (
              // Connected Mode - Show selected section content
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                {activeTab === 'dashboard' && <DashboardContent />}
                {activeTab === 'marketplace' && <MarketplaceContent />}
                {activeTab === 'portfolio' && <PortfolioContent />}
                {activeTab === 'analytics' && <AnalyticsContent />}
                {activeTab === 'bridge' && <BridgeContent />}
                {activeTab === 'yield' && <YieldVaultsContent />}
                {activeTab === 'tycoon' && <RWATycoonContent />}
                {activeTab === 'compliance' && <ComplianceContent />}
                {activeTab === 'due-diligence' && <DueDiligenceContent />}
                {activeTab === 'certificates' && <CertificatesContent />}
                {activeTab === 'authenticity' && <AuthenticityContent />}
                {activeTab === 'solana-rwa' && <SolanaRWAContent />}
                {activeTab === 'governance' && <GovernanceContent />}
                {activeTab === 'sustainability' && <SustainabilityContent />}
                {activeTab === 'identity-passport' && <IdentityPassportContent />}
                {activeTab === 'legal' && <LegalContent />}
                {activeTab === 'ai-matching' && <AIMatchingContent />}
                {activeTab === 'settings' && <SettingsContent />}
                {activeTab === 'help' && <HelpSupportContent />}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
