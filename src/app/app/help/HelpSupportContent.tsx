"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  HelpCircle,
  MessageCircle,
  Book,
  Video,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Clock,
  Star,
  Send,
  FileText,
  Zap,
  Shield,
  DollarSign,
  ArrowLeftRight,
  TrendingUp,
  Award,
  Users,
  Globe,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Headphones,
  MessageSquare,
  Download
} from 'lucide-react';

const helpCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Lightbulb,
    color: 'text-blue-400',
    articles: 8
  },
  {
    id: 'trading',
    name: 'Trading & Bridge',
    icon: ArrowLeftRight,
    color: 'text-green-400',
    articles: 12
  },
  {
    id: 'security',
    name: 'Security & Wallet',
    icon: Shield,
    color: 'text-red-400',
    articles: 6
  },
  {
    id: 'rwa',
    name: 'RWA Tokenization',
    icon: Award,
    color: 'text-purple-400',
    articles: 10
  },
  {
    id: 'compliance',
    name: 'Compliance & KYC',
    icon: FileText,
    color: 'text-yellow-400',
    articles: 5
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    icon: AlertTriangle,
    color: 'text-orange-400',
    articles: 15
  }
];

const faqData = [
  {
    id: 1,
    question: "How do I connect my wallet to OmniFlow?",
    answer: "Click the 'Connect Wallet' button in the top right corner and select your preferred wallet provider. We support MetaMask, WalletConnect, and other popular wallets.",
    category: "getting-started"
  },
  {
    id: 2,
    question: "What is cross-chain bridging and how does it work?",
    answer: "Cross-chain bridging allows you to transfer assets between different blockchain networks. Our bridge supports Ethereum, Polygon, BSC, and other major chains with low fees and fast transfers.",
    category: "trading"
  },
  {
    id: 3,
    question: "How secure is my wallet and private keys?",
    answer: "Your private keys never leave your device. We use industry-standard encryption and security practices. Always keep your seed phrase safe and never share it with anyone.",
    category: "security"
  },
  {
    id: 4,
    question: "What are Real World Assets (RWAs) and how can I tokenize them?",
    answer: "RWAs are physical assets like real estate, commodities, or art that are represented as digital tokens on the blockchain. Our platform provides tools for tokenization, compliance, and trading.",
    category: "rwa"
  },
  {
    id: 5,
    question: "What KYC requirements do I need to complete?",
    answer: "KYC requirements vary by region and transaction amount. Basic KYC requires identity verification, while enhanced KYC may require additional documentation for higher limits.",
    category: "compliance"
  },
  {
    id: 6,
    question: "Why is my transaction taking so long to confirm?",
    answer: "Transaction times depend on network congestion and gas fees. You can speed up transactions by increasing gas fees or try during off-peak hours for lower costs.",
    category: "troubleshooting"
  }
];

const supportChannels = [
  {
    id: 'live-chat',
    name: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageCircle,
    color: 'text-green-400',
    availability: '24/7',
    responseTime: 'Instant'
  },
  {
    id: 'email',
    name: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    color: 'text-blue-400',
    availability: 'Business Hours',
    responseTime: '< 24 hours'
  },
  {
    id: 'community',
    name: 'Community Forum',
    description: 'Connect with other users',
    icon: Users,
    color: 'text-purple-400',
    availability: '24/7',
    responseTime: 'Community driven'
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Comprehensive guides and tutorials',
    icon: Book,
    color: 'text-gold-400',
    availability: '24/7',
    responseTime: 'Self-service'
  }
];

export default function HelpSupportContent() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const { address, isConnected } = useAccount();

  const filteredFaqs = faqData.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) &&
    (searchQuery === '' || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const FAQSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-400" />
          Frequently Asked Questions
        </h3>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-blue-400/50 rounded-xl text-blue-50 placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-300/80 transition-all"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white pr-4">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronDown className="w-5 h-5 text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {expandedFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const SupportChannels = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Headphones className="w-6 h-6 text-green-400" />
          Get Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.id} className="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className={`w-6 h-6 ${channel.color}`} />
                  <h4 className="font-bold text-white">{channel.name}</h4>
                </div>
                <p className="text-gray-300 text-sm mb-4">{channel.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Availability:</span>
                    <span className="text-white">{channel.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time:</span>
                    <span className="text-white">{channel.responseTime}</span>
                  </div>
                </div>
                <button className={`w-full mt-4 py-2 px-4 bg-gradient-to-r ${
                  channel.id === 'live-chat' ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                  channel.id === 'email' ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                  channel.id === 'community' ? 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' :
                  'from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
                } text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2`}>
                  {channel.id === 'documentation' && <ExternalLink className="w-4 h-4" />}
                  {channel.id === 'live-chat' ? 'Start Chat' :
                   channel.id === 'email' ? 'Send Email' :
                   channel.id === 'community' ? 'Join Forum' : 'View Docs'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  const ContactForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          Submit Support Ticket
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-purple-100 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              value={supportTicket.subject}
              onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
              className="w-full p-3 bg-white/20 border-2 border-purple-400/50 rounded-xl text-purple-50 placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-300/80 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-purple-100 mb-2">Priority</label>
            <select
              value={supportTicket.priority}
              onChange={(e) => setSupportTicket({...supportTicket, priority: e.target.value})}
              className="w-full p-3 bg-white/20 border-2 border-purple-400/50 rounded-xl text-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-300/80 transition-all"
            >
              <option value="low">Low - General inquiry</option>
              <option value="medium">Medium - Account issue</option>
              <option value="high">High - Transaction problem</option>
              <option value="urgent">Urgent - Security concern</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-purple-100 mb-2">Message</label>
            <textarea
              rows={6}
              placeholder="Please provide detailed information about your issue..."
              value={supportTicket.message}
              onChange={(e) => setSupportTicket({...supportTicket, message: e.target.value})}
              className="w-full p-3 bg-white/20 border-2 border-purple-400/50 rounded-xl text-purple-50 placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-300/80 transition-all resize-none"
            />
          </div>

          <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            Submit Ticket
          </button>
        </div>
      </div>
    </motion.div>
  );

  const QuickLinks = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Zap className="w-6 h-6 text-gold-400" />
          Quick Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'User Guide', icon: Book, color: 'text-blue-400', desc: 'Complete platform walkthrough' },
            { name: 'Video Tutorials', icon: Video, color: 'text-red-400', desc: 'Step-by-step video guides' },
            { name: 'API Documentation', icon: FileText, color: 'text-green-400', desc: 'Developer resources' },
            { name: 'System Status', icon: CheckCircle, color: 'text-green-400', desc: 'Platform health monitoring' },
            { name: 'Security Guide', icon: Shield, color: 'text-yellow-400', desc: 'Best security practices' },
            { name: 'Fee Schedule', icon: DollarSign, color: 'text-gold-400', desc: 'Current fees and rates' }
          ].map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/15 rounded-xl transition-colors text-left"
              >
                <Icon className={`w-5 h-5 ${link.color}`} />
                <div>
                  <div className="font-medium text-white">{link.name}</div>
                  <div className="text-sm text-gray-400">{link.desc}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
            Help & Support
          </h1>
          <p className="text-lg text-gray-300">
            Get help, find answers, and connect with our support team
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeCategory === 'all'
                    ? 'bg-gold-500/20 border-2 border-gold-400/50 text-gold-200'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <span className="font-medium">All Topics</span>
                <span className="text-sm text-gray-400">41</span>
              </button>
              {helpCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      activeCategory === category.id
                        ? 'bg-gold-500/20 border-2 border-gold-400/50 text-gold-200'
                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${activeCategory === category.id ? 'text-gold-400' : category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{category.articles}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Help Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-8"
        >
          <FAQSection />
          <SupportChannels />
          <ContactForm />
          <QuickLinks />
        </motion.div>
      </div>
    </div>
  );
}
