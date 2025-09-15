"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Scale,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Search,
  Download,
  Eye,
  MessageSquare,
  Bot,
  Gavel,
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  Plus,
  Filter,
  Star,
  ArrowRight,
  ExternalLink,
  AlertTriangle as Warning,
  Info,
  HelpCircle,
  Building,
  MapPin,
  Calendar,
  X,
  Send,
  Upload,
  Target
} from 'lucide-react';

const legalDocuments = [
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    type: 'Agreement',
    category: 'platform',
    status: 'active',
    version: '2.1',
    lastUpdated: '2024-01-15',
    jurisdiction: 'Delaware, USA',
    description: 'Platform usage terms and conditions for RWA investments',
    keyPoints: [
      'User responsibilities and obligations',
      'Investment risks and disclaimers',
      'Platform liability limitations',
      'Dispute resolution procedures'
    ],
    compliance: ['SEC', 'FINRA', 'CFTC'],
    riskLevel: 'Medium'
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    type: 'Policy',
    category: 'data',
    status: 'active',
    version: '1.8',
    lastUpdated: '2024-01-10',
    jurisdiction: 'Global',
    description: 'Data collection, processing, and protection policies',
    keyPoints: [
      'Personal data collection practices',
      'Cookie usage and tracking',
      'Third-party data sharing',
      'User rights and data deletion'
    ],
    compliance: ['GDPR', 'CCPA', 'PIPEDA'],
    riskLevel: 'Low'
  },
  {
    id: 'investment-agreement',
    title: 'Investment Agreement Template',
    type: 'Contract',
    category: 'investment',
    status: 'active',
    version: '3.2',
    lastUpdated: '2024-01-18',
    jurisdiction: 'Multi-jurisdictional',
    description: 'Standard investment terms for RWA tokenization',
    keyPoints: [
      'Investment structure and terms',
      'Token holder rights and obligations',
      'Dividend distribution mechanisms',
      'Exit strategies and liquidity'
    ],
    compliance: ['Securities Law', 'Tax Regulations', 'AML/KYC'],
    riskLevel: 'High'
  },
  {
    id: 'kyc-aml-policy',
    title: 'KYC/AML Compliance Policy',
    type: 'Policy',
    category: 'compliance',
    status: 'active',
    version: '2.5',
    lastUpdated: '2024-01-12',
    jurisdiction: 'Global',
    description: 'Know Your Customer and Anti-Money Laundering procedures',
    keyPoints: [
      'Customer identification requirements',
      'Enhanced due diligence procedures',
      'Suspicious activity monitoring',
      'Regulatory reporting obligations'
    ],
    compliance: ['BSA', 'FATF', 'FinCEN'],
    riskLevel: 'High'
  }
];

const legalStats = [
  { label: 'Active Documents', value: '47', icon: FileText, color: 'text-blue-400' },
  { label: 'Compliance Score', value: '94%', icon: Shield, color: 'text-green-400' },
  { label: 'Risk Assessments', value: '12', icon: AlertTriangle, color: 'text-yellow-400' },
  { label: 'Legal Queries', value: '156', icon: MessageSquare, color: 'text-purple-400' }
];

const complianceRegions = [
  { region: 'United States', status: 'Compliant', score: 96, regulations: ['SEC', 'FINRA', 'CFTC', 'FinCEN'] },
  { region: 'European Union', status: 'Compliant', score: 94, regulations: ['MiCA', 'GDPR', 'AML5', 'PSD2'] },
  { region: 'United Kingdom', status: 'Compliant', score: 92, regulations: ['FCA', 'GDPR-UK', 'MLR 2017'] },
  { region: 'Singapore', status: 'Review', score: 88, regulations: ['MAS', 'PDPA', 'SFA'] },
  { region: 'Canada', status: 'Compliant', score: 90, regulations: ['CSA', 'PIPEDA', 'FINTRAC'] }
];

const riskAssessments = [
  {
    id: 'regulatory-risk',
    title: 'Regulatory Compliance Risk',
    level: 'Medium',
    score: 75,
    description: 'Assessment of regulatory compliance across jurisdictions',
    lastReview: '2024-01-15',
    nextReview: '2024-04-15',
    mitigations: [
      'Regular compliance audits',
      'Legal counsel consultation',
      'Regulatory monitoring system'
    ]
  },
  {
    id: 'operational-risk',
    title: 'Operational Legal Risk',
    level: 'Low',
    score: 85,
    description: 'Legal risks in day-to-day operations',
    lastReview: '2024-01-10',
    nextReview: '2024-07-10',
    mitigations: [
      'Standard operating procedures',
      'Staff training programs',
      'Insurance coverage'
    ]
  },
  {
    id: 'investment-risk',
    title: 'Investment Structure Risk',
    level: 'High',
    score: 65,
    description: 'Legal risks in RWA tokenization structures',
    lastReview: '2024-01-18',
    nextReview: '2024-02-18',
    mitigations: [
      'Legal structure review',
      'Investor protection measures',
      'Clear documentation'
    ]
  }
];

export default function LegalContent() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('documents');
  const [showLegalAIModal, setShowLegalAIModal] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showDocSuccessModal, setShowDocSuccessModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [selectedDocumentForDetails, setSelectedDocumentForDetails] = useState<typeof legalDocuments[0] | null>(null);
  const { address, isConnected } = useAccount();

  const filteredDocuments = legalDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'review': return 'text-yellow-400';
      case 'expired': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const DocumentCard = ({ document }: { document: typeof legalDocuments[0] }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-blue-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedDocument(document.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{document.title}</h3>
              <p className="text-blue-300 text-sm">{document.type} • v{document.version}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className={`w-5 h-5 ${getStatusColor(document.status)}`} />
            <span className={`text-sm font-medium capitalize ${getStatusColor(document.status)}`}>
              {document.status}
            </span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{document.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Jurisdiction</p>
            <p className="text-sm font-semibold text-white">{document.jurisdiction}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Risk Level</p>
            <p className={`text-sm font-semibold ${getRiskColor(document.riskLevel)}`}>
              {document.riskLevel}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {document.compliance.slice(0, 3).map((comp, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg">
              {comp}
            </span>
          ))}
          {document.compliance.length > 3 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-lg">
              +{document.compliance.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Updated {document.lastUpdated}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDocumentForDetails(document);
              setShowViewDetailsModal(true);
            }}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="text-sm font-medium mr-1">View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const ComplianceCard = ({ region }: { region: typeof complianceRegions[0] }) => {
    return (
      <div className="bg-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-500 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold">{region.region}</h4>
              <p className={`text-sm ${getStatusColor(region.status.toLowerCase())}`}>
                {region.status}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">{region.score}%</div>
            <div className="text-xs text-gray-400">Compliance Score</div>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            style={{ width: `${region.score}%` }}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">Key Regulations:</p>
          <div className="flex flex-wrap gap-1">
            {region.regulations.map((reg, index) => (
              <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg">
                {reg}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RiskCard = ({ risk }: { risk: typeof riskAssessments[0] }) => {
    return (
      <div className="bg-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              risk.level === 'High' ? 'bg-red-500/20' :
              risk.level === 'Medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${getRiskColor(risk.level)}`} />
            </div>
            <div>
              <h4 className="text-white font-semibold">{risk.title}</h4>
              <p className={`text-sm ${getRiskColor(risk.level)}`}>
                {risk.level} Risk
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getRiskColor(risk.level)}`}>{risk.score}</div>
            <div className="text-xs text-gray-400">Risk Score</div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4">{risk.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Last Review</span>
            <span className="text-white">{risk.lastReview}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Next Review</span>
            <span className="text-white">{risk.nextReview}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">Mitigations:</p>
          {risk.mitigations.slice(0, 2).map((mitigation, index) => (
            <div key={index} className="flex items-center text-xs text-gray-300">
              <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
              {mitigation}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleAISubmit = () => {
    setShowLegalAIModal(false);
    setAiQuery('');
  };

  const handleNewDocSubmit = () => {
    setShowNewDocModal(false);
    setShowDocSuccessModal(true);
    
    setTimeout(() => {
      setShowDocSuccessModal(false);
      setNewDocTitle('');
    }, 2000);
  };

  const LegalAIModal = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowLegalAIModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-blue-400/40 rounded-2xl p-8 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              Legal AI Assistant
            </h2>
            <button
              onClick={() => setShowLegalAIModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Ask Legal Questions</span>
            </div>
            <p className="text-sm text-gray-300">
              Get instant answers about legal compliance, regulations, and document requirements
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Legal Question *
              </label>
              <textarea
                rows={4}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g., What are the SEC requirements for RWA tokenization?"
                className="w-full px-4 py-3 bg-white/10 border-2 border-blue-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button 
                onClick={() => setAiQuery('What are the key SEC regulations for tokenizing real estate assets?')}
                className="p-3 bg-white/10 border border-blue-400/30 rounded-lg text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-left"
              >
                SEC Tokenization Rules
              </button>
              <button 
                onClick={() => setAiQuery('What KYC/AML requirements apply to RWA platforms?')}
                className="p-3 bg-white/10 border border-blue-400/30 rounded-lg text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-left"
              >
                KYC/AML Compliance
              </button>
              <button 
                onClick={() => setAiQuery('How do I ensure GDPR compliance for EU investors?')}
                className="p-3 bg-white/10 border border-blue-400/30 rounded-lg text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-left"
              >
                GDPR Requirements
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowLegalAIModal(false)}
              className="px-6 py-3 bg-gray-500/20 border border-gray-400/50 text-gray-300 rounded-xl hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAISubmit}
              disabled={!aiQuery.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Ask AI
            </button>
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
            Legal & Compliance
          </h1>
          <p className="text-lg text-gray-300">
            Comprehensive legal framework and regulatory compliance management
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowLegalAIModal(true)}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            Legal AI
          </button>
          <button 
            onClick={() => setShowNewDocModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Document
          </button>
        </div>
      </motion.div>

      {/* Legal Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {legalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-blue-400/40 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-300 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 bg-slate-800/60 rounded-xl p-1"
      >
        {[
          { id: 'documents', label: 'Legal Documents', icon: FileText },
          { id: 'compliance', label: 'Compliance', icon: Shield },
          { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-400/50'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'documents' && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-blue-400/40 rounded-xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search legal documents..."
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
                    All Documents
                  </button>
                  {['platform', 'data', 'investment', 'compliance'].map((category) => (
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
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <DocumentCard document={document} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white">Regional Compliance Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceRegions.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ComplianceCard region={region} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'risks' && (
          <motion.div
            key="risks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white">Risk Assessments</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {riskAssessments.map((risk, index) => (
                <motion.div
                  key={risk.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <RiskCard risk={risk} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal AI Modal */}
      <AnimatePresence>
        {showLegalAIModal && <LegalAIModal />}
      </AnimatePresence>

      {/* New Document Modal */}
      <AnimatePresence>
        {showNewDocModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewDocModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-blue-400/40 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  Add New Legal Document
                </h2>
                <button
                  onClick={() => setShowNewDocModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g., Investment Disclosure Agreement"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-blue-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Document Type
                    </label>
                    <select className="w-full px-4 py-3 bg-white/10 border-2 border-blue-400/30 rounded-xl text-white focus:outline-none focus:border-blue-400/60 transition-colors">
                      <option value="">Select Type</option>
                      <option value="agreement">Agreement</option>
                      <option value="policy">Policy</option>
                      <option value="contract">Contract</option>
                      <option value="disclosure">Disclosure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select className="w-full px-4 py-3 bg-white/10 border-2 border-blue-400/30 rounded-xl text-white focus:outline-none focus:border-blue-400/60 transition-colors">
                      <option value="">Select Category</option>
                      <option value="platform">Platform</option>
                      <option value="data">Data & Privacy</option>
                      <option value="investment">Investment</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Target className="w-4 h-4 inline mr-1" />
                    Document Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the purpose and key provisions of this legal document..."
                    className="w-full px-4 py-3 bg-white/10 border-2 border-blue-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 transition-colors resize-none"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 font-medium">Document Upload</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Upload the legal document file (PDF, DOCX, or TXT)
                  </p>
                  <button className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                    Choose File
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowNewDocModal(false)}
                  className="px-6 py-3 bg-gray-500/20 border border-gray-400/50 text-gray-300 rounded-xl hover:bg-gray-500/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewDocSubmit}
                  disabled={!newDocTitle.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add Document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Success Modal */}
      <AnimatePresence>
        {showDocSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gradient-to-br from-blue-800 to-purple-700 border-2 border-blue-400/50 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  initial={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 200 - 100,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 300 - 150,
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
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Document Added Successfully!
              </motion.h2>

              <motion.p
                className="text-blue-200 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {newDocTitle ? `"${newDocTitle}"` : 'Your new document'} has been added to the legal framework.
              </motion.p>

              <motion.div
                className="text-sm text-blue-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Ready for compliance review! ⚖️
              </motion.div>

              <motion.div
                className="absolute top-4 right-4 w-6 h-6 text-blue-300"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Scale className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showViewDetailsModal && selectedDocumentForDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewDetailsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-blue-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedDocumentForDetails.title}</h2>
                    <p className="text-blue-300 text-lg">{selectedDocumentForDetails.type} • v{selectedDocumentForDetails.version}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-6 text-center">
                  <div className={`text-2xl font-bold ${getStatusColor(selectedDocumentForDetails.status)} mb-1`}>
                    {selectedDocumentForDetails.status.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">Status</div>
                </div>
                <div className="bg-white/10 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">v{selectedDocumentForDetails.version}</div>
                  <div className="text-xs text-gray-400">Version</div>
                </div>
                <div className="bg-white/10 rounded-xl p-6 text-center">
                  <div className={`text-2xl font-bold ${getRiskColor(selectedDocumentForDetails.riskLevel)} mb-1`}>
                    {selectedDocumentForDetails.riskLevel}
                  </div>
                  <div className="text-xs text-gray-400">Risk Level</div>
                </div>
                <div className="bg-white/10 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{selectedDocumentForDetails.compliance.length}</div>
                  <div className="text-xs text-gray-400">Compliance</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-blue-400 mr-2" />
                    Document Overview
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{selectedDocumentForDetails.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white capitalize">{selectedDocumentForDetails.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white">{selectedDocumentForDetails.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Shield className="w-5 h-5 text-green-400 mr-2" />
                    Compliance Framework
                  </h3>
                  <div className="space-y-2">
                    {selectedDocumentForDetails.compliance.map((comp, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {comp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 text-yellow-400 mr-2" />
                  Key Provisions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDocumentForDetails.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start text-gray-300">
                      <Star className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-400">
                  <Globe className="w-4 h-4 text-blue-400 mr-2" />
                  Legal document verified and compliant
                </div>
                <div className="flex space-x-3">
                  <button className="px-6 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button className="px-6 py-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
