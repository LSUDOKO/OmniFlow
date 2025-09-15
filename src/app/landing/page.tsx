"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  TrendingUp, 
  Users, 
  DollarSign,
  ChevronRight,
  Play,
  Pause,
  Gem,
  ArrowUpRight,
  Sparkles,
  Layers,
  Target,
  Rocket,
  Brain,
  Lock,
  Coins,
  Network,
  Eye,
  Code,
  Database,
  Cpu,
  Smartphone,
  Monitor,
  Headphones,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Twitter,
  Github,
  Linkedin,
  MessageCircle,
  Star,
  Check,
  Cloud,
  BarChart3,
  Building,
  Award,
  Briefcase
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Tokenize Real-World Assets",
    description: "Transform physical assets into digital tokens with full legal compliance and verification",
    longDescription: "Our advanced tokenization engine converts real-world assets into blockchain-based tokens, ensuring full regulatory compliance, legal backing, and seamless integration with DeFi protocols.",
    icon: Building,
    gradient: "from-blue-500 to-cyan-500",
    stats: { processed: "$2.8B+", assets: "1,200+", compliance: "100%" }
  },
  {
    title: "Universal Cross-Chain Bridge",
    description: "Seamlessly move assets across Ethereum, Solana, Polygon, and other major blockchains",
    longDescription: "Experience lightning-fast, secure cross-chain transfers with our Wormhole-powered bridge supporting 8+ major blockchains with minimal fees and maximum security.",
    icon: Globe,
    gradient: "from-purple-500 to-pink-500",
    stats: { chains: "8+", volume: "$125M+", speed: "<30s" }
  },
  {
    title: "AI-Powered Due Diligence",
    description: "Get instant risk assessment and yield projections powered by advanced AI algorithms",
    longDescription: "Our GPT-4 powered AI engine analyzes thousands of data points to provide comprehensive risk assessments, yield projections, and investment recommendations in real-time.",
    icon: Brain,
    gradient: "from-yellow-500 to-orange-500",
    stats: { accuracy: "94%", reports: "10K+", time: "<5min" }
  },
  {
    title: "Automated Yield Optimization",
    description: "Maximize returns with automated yield farming and staking strategies",
    longDescription: "Smart contract-powered yield optimization automatically compounds your returns, rebalances portfolios, and finds the best opportunities across multiple protocols.",
    icon: TrendingUp,
    gradient: "from-green-500 to-emerald-500",
    stats: { apy: "8.7%", tvl: "$450M+", strategies: "25+" }
  },
  {
    title: "Institutional Security",
    description: "Bank-grade security with multi-signature wallets and insurance coverage",
    longDescription: "Military-grade encryption, multi-signature wallets, smart contract audits, and comprehensive insurance coverage protect your assets with institutional-level security.",
    icon: Shield,
    gradient: "from-red-500 to-rose-500",
    stats: { audits: "5+", insurance: "$100M+", uptime: "99.9%" }
  },
  {
    title: "RWA Tycoon Gamification",
    description: "Earn rewards, unlock achievements, and compete in the RWA Tycoon leaderboards",
    longDescription: "Gamified investing experience with achievements, leaderboards, NFT rewards, and social features that make DeFi engaging and educational for everyone.",
    icon: Award,
    gradient: "from-indigo-500 to-purple-500",
    stats: { players: "50K+", rewards: "$2M+", achievements: "100+" }
  },
];

const stats = [
  { label: "Total Value Locked", value: "$2.85B", change: "+12.5%", icon: BarChart3, color: "text-green-400" },
  { label: "Active Users", value: "52,847", change: "+8.2%", icon: Users, color: "text-blue-400" },
  { label: "Assets Tokenized", value: "1,284", change: "+15.3%", icon: Building, color: "text-purple-400" },
  { label: "Supported Chains", value: "8", change: "+2", icon: Globe, color: "text-gold-400" },
  { label: "Daily Volume", value: "$125.6M", change: "+22.1%", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Security Score", value: "99.9%", change: "Perfect", icon: Shield, color: "text-red-400" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Portfolio Manager at BlackRock",
    avatar: "SC",
    content: "SolanaFlow has revolutionized how we approach RWA tokenization. The AI-powered due diligence saves us weeks of analysis.",
    rating: 5,
    company: "BlackRock"
  },
  {
    name: "Marcus Rodriguez",
    role: "DeFi Strategy Lead",
    avatar: "MR", 
    content: "The cross-chain capabilities are unmatched. We've moved $50M+ across chains with zero issues and minimal fees.",
    rating: 5,
    company: "Aave"
  },
  {
    name: "Dr. Emily Watson",
    role: "Real Estate Tokenization Expert",
    avatar: "EW",
    content: "Finally, a platform that understands both traditional finance and DeFi. The compliance features are best-in-class.",
    rating: 5,
    company: "RealT"
  }
];

const roadmapItems = [
  {
    quarter: "Q1 2024",
    title: "Advanced AI Integration",
    description: "GPT-4 powered risk assessment and yield optimization",
    status: "completed",
    features: ["AI Due Diligence", "Smart Rebalancing", "Predictive Analytics"]
  },
  {
    quarter: "Q2 2024", 
    title: "Cross-Chain Expansion",
    description: "Support for 8+ major blockchains with Wormhole integration",
    status: "completed",
    features: ["Solana Bridge", "Polygon Support", "Arbitrum Integration"]
  },
  {
    quarter: "Q3 2024",
    title: "Institutional Features",
    description: "Enterprise-grade security and compliance tools",
    status: "in-progress",
    features: ["Multi-sig Wallets", "Compliance Dashboard", "Audit Reports"]
  },
  {
    quarter: "Q4 2024",
    title: "Global Expansion",
    description: "Regulatory compliance for EU, APAC, and emerging markets",
    status: "planned",
    features: ["EU MiCA Compliance", "APAC Licensing", "Emerging Markets"]
  }
];

const techStack = [
  { name: "Solana", icon: Code, category: "Blockchain" },
  { name: "Ethereum", icon: Database, category: "Blockchain" },
  { name: "Wormhole", icon: Network, category: "Bridge" },
  { name: "OpenAI GPT-4", icon: Brain, category: "AI" },
  { name: "Next.js", icon: Monitor, category: "Frontend" },
  { name: "TypeScript", icon: Code, category: "Language" },
  { name: "Rust", icon: Cpu, category: "Smart Contracts" },
  { name: "IPFS", icon: Database, category: "Storage" }
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const featuresY = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-x-hidden">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-gold-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
        
        {/* Particle Grid */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Advanced Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 backdrop-blur-xl bg-slate-900/20 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6 lg:p-8">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="relative w-14 h-14 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Gem className="w-8 h-8 text-white drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-gold-300/50 to-transparent rounded-2xl" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent">
                SolanaFlow
              </h1>
              <p className="text-sm text-gray-400 font-medium">Universal RWA Platform</p>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center space-x-10">
            {[
              { name: "Features", href: "#features" },
              { name: "Technology", href: "#tech" },
              { name: "Roadmap", href: "#roadmap" },
              { name: "Community", href: "#community" }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
              >
                {item.name}
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 group-hover:w-full transition-all duration-300"
                />
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/app">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 rounded-2xl font-bold text-white shadow-2xl shadow-gold-500/30 overflow-hidden group"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-gold-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <span className="relative flex items-center space-x-2">
                  <span>Launch App</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Revolutionary Hero Section */}
      <motion.div 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-screen flex items-center justify-center"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gold-500/20 to-purple-500/20 backdrop-blur-xl border border-gold-400/30 rounded-full mb-8"
            >
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="text-gold-300 font-semibold">Powered by AI & Cross-Chain Technology</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-gold-400" />
              </motion.div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-7xl lg:text-9xl font-black mb-8 leading-[0.9]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.span 
                className="block bg-gradient-to-r from-purple-400 via-gold-400 via-pink-400 to-purple-600 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                THE FUTURE
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-gold-400 via-purple-400 via-cyan-400 to-gold-600 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                style={{ backgroundSize: "200% 200%" }}
              >
                OF FINANCE
              </motion.span>
            </motion.h1>
            
            {/* Subtitle with Typewriter Effect */}
            <motion.p 
              className="text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Tokenize, trade, and optimize real-world assets across 8+ blockchains with 
              <span className="text-gold-400 font-semibold"> AI-powered intelligence</span> and 
              <span className="text-purple-400 font-semibold"> institutional-grade security</span>
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20"
          >
            <Link href="/app">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px rgba(245, 158, 11, 0.5)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-gold-500/30 overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-gold-300/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                <span className="relative flex items-center space-x-3">
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Launch Platform</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="group flex items-center space-x-3 px-8 py-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl font-semibold text-white hover:bg-white/20 transition-all"
            >
              <motion.div
                animate={{ scale: isVideoPlaying ? 0.8 : 1 }}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </motion.div>
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-20"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={stat.label} 
                  className="group text-center p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </motion.div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                  <div className={`text-xs font-semibold ${stat.color}`}>{stat.change}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

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

        {/* Interactive Features Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
                  isActive ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl" />
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative p-8 lg:p-12">
                  <motion.div 
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl mb-8 shadow-2xl`}
                    animate={{ 
                      rotate: isActive ? [0, 5, -5, 0] : 0,
                      scale: isActive ? 1.1 : 1
                    }}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-gold-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {feature.longDescription}
                  </p>

                  {/* Feature Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {Object.entries(feature.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className="flex items-center text-gold-400 font-semibold group-hover:translate-x-2 transition-transform"
                    whileHover={{ x: 10 }}
                  >
                    <span>Explore Feature</span>
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="community" className="relative z-10 py-32 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent">
                TRUSTED BY
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-gold-400 bg-clip-text text-transparent">
                INDUSTRY LEADERS
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the institutional investors, DeFi protocols, and RWA pioneers who trust SolanaFlow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-gold-400/30 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    <div className="text-gold-400 text-xs font-semibold">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div id="tech" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                POWERED BY
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CUTTING-EDGE TECH
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl text-center hover:border-blue-400/30 transition-all duration-300"
                >
                  <Icon className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-white mb-2">{tech.name}</div>
                  <div className="text-xs text-gray-400">{tech.category}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div id="roadmap" className="relative z-10 py-32 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ROADMAP
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                TO THE FUTURE
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                  item.status === 'completed' ? 'bg-green-500/10 border-green-400/30' :
                  item.status === 'in-progress' ? 'bg-gold-500/10 border-gold-400/30' :
                  'bg-slate-800/40 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-bold text-gray-400">{item.quarter}</div>
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-400' :
                    item.status === 'in-progress' ? 'bg-gold-400 animate-pulse' :
                    'bg-gray-600'
                  }`} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-6">{item.description}</p>
                
                <div className="space-y-2">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <Check className={`w-4 h-4 mr-2 ${
                        item.status === 'completed' ? 'text-green-400' : 'text-gray-400'
                      }`} />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 bg-gradient-to-br from-gold-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-white/20 rounded-3xl relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-purple-500/10 to-blue-500/10"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgba(245,158,11,0.1), rgba(168,85,247,0.1), rgba(59,130,246,0.1))",
                  "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(245,158,11,0.1), rgba(168,85,247,0.1))",
                  "linear-gradient(225deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1), rgba(245,158,11,0.1))",
                  "linear-gradient(315deg, rgba(245,158,11,0.1), rgba(168,85,247,0.1), rgba(59,130,246,0.1))"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <h2 className="text-5xl lg:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  START YOUR
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-gold-400 to-purple-400 bg-clip-text text-transparent">
                  RWA JOURNEY
                </span>
              </h2>
              
              <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join the revolution in tokenized finance. Experience the future of real-world asset management today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/app">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 30px 60px rgba(245, 158, 11, 0.6)",
                      y: -8
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-16 py-6 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 rounded-2xl font-bold text-2xl text-white shadow-2xl shadow-gold-500/30 overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-gold-300/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    />
                    <span className="relative flex items-center space-x-4">
                      <Target className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                      <span>Launch SolanaFlow</span>
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                    </span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center">
                  <Gem className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                    SolanaFlow
                  </h3>
                  <p className="text-gray-400">Universal RWA Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                The future of finance is here. Tokenize, trade, and optimize real-world assets with institutional-grade security and AI-powered intelligence.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: MessageCircle, href: "#" }
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gold-400 hover:bg-gold-400/20 transition-all"
                    >
                      <Icon className="w-6 h-6" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <div className="space-y-4">
                {["Features", "Technology", "Security", "API Docs"].map((item) => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-gold-400 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <div className="space-y-4">
                {["About", "Careers", "Blog", "Contact"].map((item) => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-gold-400 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 SolanaFlow. All rights reserved. Built with ❤️ for the future of finance.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a key={item} href="#" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
