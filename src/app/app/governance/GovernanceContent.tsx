"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Vote,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Award,
  BarChart3,
  PieChart,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Plus,
  Search,
  Filter,
  Star,
  ArrowRight,
  Coins,
  Building,
  Leaf,
  Zap,
  Globe
} from 'lucide-react';

const governanceProposals = [
  {
    id: 'prop-001',
    title: 'Increase Real Estate Portfolio Allocation',
    description: 'Proposal to increase real estate allocation from 40% to 55% of total portfolio',
    category: 'portfolio',
    status: 'active',
    votingEnds: '2024-01-20T18:00:00Z',
    votesFor: 1247,
    votesAgainst: 356,
    totalVotes: 1603,
    quorum: 2000,
    proposer: '0x1234...5678',
    createdAt: '2024-01-10',
    impact: 'high',
    requiredMajority: 60,
    details: {
      currentAllocation: 40,
      proposedAllocation: 55,
      expectedReturn: 8.5,
      riskLevel: 'medium'
    }
  },
  {
    id: 'prop-002',
    title: 'Add Carbon Credit Investment Strategy',
    description: 'Introduce carbon credits as a new asset class with 10% allocation',
    category: 'strategy',
    status: 'passed',
    votingEnds: '2024-01-15T18:00:00Z',
    votesFor: 1856,
    votesAgainst: 234,
    totalVotes: 2090,
    quorum: 2000,
    proposer: '0xabcd...efgh',
    createdAt: '2024-01-05',
    impact: 'medium',
    requiredMajority: 55,
    details: {
      allocationPercentage: 10,
      expectedReturn: 12.3,
      esgScore: 95,
      riskLevel: 'medium-high'
    }
  },
  {
    id: 'prop-003',
    title: 'Quarterly Dividend Distribution',
    description: 'Approve Q4 2024 dividend distribution of $2.50 per token',
    category: 'dividend',
    status: 'pending',
    votingEnds: '2024-01-25T18:00:00Z',
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    quorum: 1500,
    proposer: '0x9876...5432',
    createdAt: '2024-01-18',
    impact: 'low',
    requiredMajority: 50,
    details: {
      dividendAmount: 2.50,
      totalDistribution: 125000,
      paymentDate: '2024-02-01',
      eligibilityDate: '2024-01-31'
    }
  }
];

const governanceStats = [
  { label: 'Total Proposals', value: '47', icon: Vote, color: 'text-blue-400' },
  { label: 'Active Voters', value: '2,847', icon: Users, color: 'text-green-400' },
  { label: 'Voting Power', value: '15.2K', icon: Zap, color: 'text-purple-400' },
  { label: 'Treasury Value', value: '$8.5M', icon: DollarSign, color: 'text-gold-400' }
];

const statusColors = {
  active: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/50' },
  passed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/50' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/50' },
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-400/50' }
};

const categoryIcons = {
  portfolio: Building,
  strategy: TrendingUp,
  dividend: Coins,
  governance: Vote,
  compliance: Shield
};

export default function GovernanceContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { address, isConnected } = useAccount();

  const filteredProposals = governanceProposals.filter(proposal => {
    const matchesCategory = selectedCategory === 'all' || proposal.category === selectedCategory;
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Voting ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const getVotingProgress = (proposal: typeof governanceProposals[0]) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const quorumProgress = (totalVotes / proposal.quorum) * 100;
    
    return { forPercentage, quorumProgress };
  };

  const ProposalCard = ({ proposal }: { proposal: typeof governanceProposals[0] }) => {
    const statusStyle = statusColors[proposal.status as keyof typeof statusColors];
    const CategoryIcon = categoryIcons[proposal.category as keyof typeof categoryIcons] || Vote;
    const { forPercentage, quorumProgress } = getVotingProgress(proposal);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedProposal(proposal.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <CategoryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{proposal.title}</h3>
              <p className="text-blue-300 text-sm capitalize">{proposal.category} Proposal</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} text-xs font-medium`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{proposal.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Votes For</p>
            <p className="text-lg font-bold text-green-400">{proposal.votesFor.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Votes Against</p>
            <p className="text-lg font-bold text-red-400">{proposal.votesAgainst.toLocaleString()}</p>
          </div>
        </div>

        {/* Voting Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Support: {forPercentage.toFixed(1)}%</span>
            <span>Required: {proposal.requiredMajority}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Quorum: {quorumProgress.toFixed(1)}%</span>
            <span>Required: 100%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-purple-500 h-1 rounded-full"
              style={{ width: `${Math.min(quorumProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {getTimeRemaining(proposal.votingEnds)}
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {proposal.totalVotes.toLocaleString()} votes
          </div>
        </div>
      </motion.div>
    );
  };

  const ProposalDetail = ({ proposalId }: { proposalId: string }) => {
    const proposal = governanceProposals.find(p => p.id === proposalId);
    if (!proposal) return null;

    const { forPercentage, quorumProgress } = getVotingProgress(proposal);
    const statusStyle = statusColors[proposal.status as keyof typeof statusColors];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedProposal(null)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{proposal.title}</h2>
              <p className="text-blue-300 text-lg capitalize">{proposal.category} Proposal</p>
            </div>
            <button
              onClick={() => setSelectedProposal(null)}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{proposal.votesFor.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Votes For</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{proposal.votesAgainst.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Votes Against</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{forPercentage.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">Support</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{quorumProgress.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">Quorum</div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-gray-300 leading-relaxed">{proposal.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Proposal Details</h3>
              <div className="space-y-3 text-sm">
                {Object.entries(proposal.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-bold text-white">
                      {typeof value === 'number' && key.includes('Percentage') ? `${value}%` :
                       typeof value === 'number' && key.includes('Return') ? `${value}%` :
                       typeof value === 'number' && key.includes('Amount') ? `$${value}` :
                       value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Voting Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Status</span>
                  <span className={`font-bold ${statusStyle.text} capitalize`}>{proposal.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Voting Ends</span>
                  <span className="font-bold text-white">{new Date(proposal.votingEnds).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Required Majority</span>
                  <span className="font-bold text-white">{proposal.requiredMajority}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Quorum Required</span>
                  <span className="font-bold text-white">{proposal.quorum.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 text-blue-400 mr-2" />
              {getTimeRemaining(proposal.votingEnds)}
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-red-500/20 border border-red-400/50 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Vote Against
              </button>
              <button className="px-6 py-2 bg-green-500/20 border border-green-400/50 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Vote For
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
            Governance & Voting
          </h1>
          <p className="text-lg text-gray-300">
            Participate in decentralized governance and shape the future of RWA investments
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Proposal
        </button>
      </motion.div>

      {/* Governance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {governanceStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-300 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-blue-400/50 rounded-xl text-blue-50 placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-300/80 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-400/50'
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
              }`}
            >
              All Proposals
            </button>
            {['portfolio', 'strategy', 'dividend', 'governance'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-400/50'
                    : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Proposals Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredProposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <ProposalCard proposal={proposal} />
          </motion.div>
        ))}
      </motion.div>

      {/* Proposal Detail Modal */}
      <AnimatePresence>
        {selectedProposal && <ProposalDetail proposalId={selectedProposal} />}
      </AnimatePresence>
    </div>
  );
}
