"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Award,
  Award as Certificate,
  Shield,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Globe,
  Zap
} from 'lucide-react';

const certificateTypes = [
  { id: 'rwa', name: 'RWA Certificates', icon: Award, color: 'text-gold-400' },
  { id: 'carbon', name: 'Carbon Credits', icon: Globe, color: 'text-green-400' },
  { id: 'energy', name: 'Renewable Energy', icon: Zap, color: 'text-blue-400' },
  { id: 'compliance', name: 'Compliance Certs', icon: Shield, color: 'text-purple-400' }
];

const sampleCertificates = [
  {
    id: 'cert-001',
    name: 'Manhattan Office Complex Certificate',
    type: 'RWA Certificate',
    category: 'rwa',
    value: '$2,500,000',
    ownership: '25%',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    location: 'New York, USA',
    status: 'active',
    verificationScore: 98,
    issuer: 'OmniFlow Certification Authority',
    description: 'Digital certificate representing fractional ownership in premium Manhattan office space',
    benefits: ['Quarterly dividend payments', 'Voting rights', 'Liquidity options'],
    riskLevel: 'Low',
    lastUpdated: '2 days ago'
  },
  {
    id: 'cert-002',
    name: 'Amazon Rainforest Carbon Credits',
    type: 'Carbon Credit Certificate',
    category: 'carbon',
    value: '$150,000',
    ownership: '100%',
    issueDate: '2024-02-01',
    expiryDate: '2026-02-01',
    location: 'Brazil',
    status: 'active',
    verificationScore: 95,
    issuer: 'Global Carbon Registry',
    description: 'Verified carbon offset credits from Amazon rainforest conservation project',
    benefits: ['Environmental impact', 'Tax benefits', 'ESG compliance'],
    riskLevel: 'Medium',
    lastUpdated: '1 week ago'
  },
  {
    id: 'cert-003',
    name: 'Solar Farm Energy Certificate',
    type: 'Renewable Energy Certificate',
    category: 'energy',
    value: '$800,000',
    ownership: '40%',
    issueDate: '2024-03-10',
    expiryDate: '2029-03-10',
    location: 'California, USA',
    status: 'active',
    verificationScore: 97,
    issuer: 'Renewable Energy Certification Board',
    description: 'Certificate representing ownership in utility-scale solar energy generation facility',
    benefits: ['Energy production revenue', 'Green energy credits', 'Long-term contracts'],
    riskLevel: 'Low',
    lastUpdated: '3 days ago'
  },
  {
    id: 'cert-004',
    name: 'KYC Compliance Certificate',
    type: 'Compliance Certificate',
    category: 'compliance',
    value: 'N/A',
    ownership: '100%',
    issueDate: '2024-01-01',
    expiryDate: '2025-01-01',
    location: 'Global',
    status: 'active',
    verificationScore: 100,
    issuer: 'OmniFlow Compliance Department',
    description: 'Enhanced KYC compliance certification for institutional-level access',
    benefits: ['Higher transaction limits', 'Priority support', 'Advanced features'],
    riskLevel: 'None',
    lastUpdated: '1 day ago'
  }
];

const statusColors = {
  active: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/50' },
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-400/50' },
  expired: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/50' },
  suspended: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-400/50' }
};

const riskColors = {
  'None': { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  'Low': { bg: 'bg-green-500/20', text: 'text-green-400' },
  'Medium': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  'High': { bg: 'bg-red-500/20', text: 'text-red-400' }
};

export default function CertificatesContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { address, isConnected } = useAccount();

  const filteredCertificates = sampleCertificates.filter(cert => {
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const portfolioStats = {
    totalCertificates: sampleCertificates.length,
    totalValue: sampleCertificates.reduce((sum, cert) => {
      const value = cert.value.replace(/[$,]/g, '');
      return sum + (value !== 'N/A' ? parseInt(value) : 0);
    }, 0),
    activeAssets: sampleCertificates.filter(cert => cert.status === 'active').length,
    averageScore: Math.round(sampleCertificates.reduce((sum, cert) => sum + cert.verificationScore, 0) / sampleCertificates.length)
  };

  const CertificateCard = ({ certificate }: { certificate: typeof sampleCertificates[0] }) => {
    const statusStyle = statusColors[certificate.status as keyof typeof statusColors];
    const riskStyle = riskColors[certificate.riskLevel as keyof typeof riskColors];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedCertificate(certificate.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
              <Certificate className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{certificate.name}</h3>
              <p className="text-blue-300 text-sm">{certificate.type}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} text-xs font-medium`}>
            {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Value</p>
            <p className="text-lg font-bold text-gold-400">{certificate.value}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Ownership</p>
            <p className="text-lg font-bold text-green-400">{certificate.ownership}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Verification Score</p>
            <p className="text-lg font-bold text-purple-400">{certificate.verificationScore}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Risk Level</p>
            <span className={`px-2 py-1 rounded text-xs font-medium ${riskStyle.bg} ${riskStyle.text}`}>
              {certificate.riskLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {certificate.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Updated {certificate.lastUpdated}
          </div>
        </div>
      </motion.div>
    );
  };

  const CertificateDetail = ({ certificateId }: { certificateId: string }) => {
    const certificate = sampleCertificates.find(c => c.id === certificateId);
    if (!certificate) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedCertificate(null)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center">
                <Certificate className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{certificate.name}</h2>
                <p className="text-blue-300 text-lg">{certificate.type}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCertificate(null)}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-gold-400 mr-2" />
                Financial Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Certificate Value</span>
                  <span className="font-bold text-gold-400">{certificate.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Your Ownership</span>
                  <span className="font-bold text-green-400">{certificate.ownership}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Level</span>
                  <span className={`font-bold ${riskColors[certificate.riskLevel as keyof typeof riskColors].text}`}>
                    {certificate.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                Certificate Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Issue Date</span>
                  <span className="font-bold text-blue-400">{certificate.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Expiry Date</span>
                  <span className="font-bold text-blue-400">{certificate.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Updated</span>
                  <span className="font-bold text-blue-400">{certificate.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 text-purple-400 mr-2" />
                Verification
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Score</span>
                  <span className="font-bold text-purple-400">{certificate.verificationScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Issuer</span>
                  <span className="font-bold text-purple-400 text-sm">{certificate.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Location</span>
                  <span className="font-bold text-purple-400">{certificate.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Description</h3>
              <p className="text-gray-300 leading-relaxed">{certificate.description}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Key Benefits</h3>
              <ul className="space-y-2">
                {certificate.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Certificate verified and active
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button className="px-6 py-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                View on Blockchain
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
            Digital Certificates
          </h1>
          <p className="text-lg text-gray-300">
            Manage your verified digital asset certificates and compliance documents
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl font-medium transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Request Certificate
        </button>
      </motion.div>

      {/* Portfolio Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Certificates', value: portfolioStats.totalCertificates.toString(), icon: Certificate, color: 'text-gold-400' },
          { label: 'Portfolio Value', value: `$${(portfolioStats.totalValue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-400' },
          { label: 'Active Assets', value: portfolioStats.activeAssets.toString(), icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Avg. Verification', value: `${portfolioStats.averageScore}%`, icon: Shield, color: 'text-purple-400' }
        ].map((stat, index) => {
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

      {/* Category Filter */}
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
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-gold-400/50 rounded-xl text-gold-50 placeholder-gold-200/60 focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:border-gold-300/80 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gold-500/20 text-gold-400 border-2 border-gold-400/50'
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
              }`}
            >
              All Types
            </button>
            {certificateTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedCategory(type.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === type.id
                      ? 'bg-gold-500/20 text-gold-400 border-2 border-gold-400/50'
                      : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${selectedCategory === type.id ? 'text-gold-400' : type.color}`} />
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Certificates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredCertificates.map((certificate, index) => (
          <motion.div
            key={certificate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <CertificateCard certificate={certificate} />
          </motion.div>
        ))}
      </motion.div>

      {/* Certificate Detail Modal */}
      <AnimatePresence>
        {selectedCertificate && <CertificateDetail certificateId={selectedCertificate} />}
      </AnimatePresence>
    </div>
  );
}
