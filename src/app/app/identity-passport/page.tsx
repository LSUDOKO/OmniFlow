"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Shield,
  User,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Link,
  Plus,
  Download,
  Upload,
  Eye,
  EyeOff,
  Star,
  Award,
  Zap,
  Settings,
  Copy,
  ExternalLink,
  Wallet,
  Smartphone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Building
} from 'lucide-react';

const passportData = {
  id: 'did:omni:0x742d35f8a9b2c4e1d6f3a8b5c2e9f4a7b8c5d2e6',
  level: 'Enhanced',
  score: 94,
  verificationDate: '2024-01-15',
  expiryDate: '2025-01-15',
  issuer: 'OmniFlow Identity Authority',
  status: 'Active',
  addresses: [
    { chain: 'Ethereum', address: '0x742d35f8a9b2c4e1d6f3a8b5c2e9f4a7b8c5d2e6', verified: true },
    { chain: 'Polygon', address: '0x8b3c9d2e5f6a1b4c7e8f9a2b5c8d1e4f7a0b3c6d', verified: true },
    { chain: 'Solana', address: 'H7KqX9mR4pL2nS8vT1wY5zB3cF6gJ9kM2nP5qR8sU4vX', verified: false }
  ],
  credentials: [
    {
      type: 'KYC Verification',
      issuer: 'Civic',
      status: 'verified',
      issuedDate: '2024-01-10',
      expiryDate: '2025-01-10',
      level: 'Enhanced'
    },
    {
      type: 'AML Screening',
      issuer: 'Chainalysis',
      status: 'verified',
      issuedDate: '2024-01-12',
      expiryDate: '2025-01-12',
      level: 'Standard'
    },
    {
      type: 'Accredited Investor',
      issuer: 'VerifyInvestor',
      status: 'verified',
      issuedDate: '2024-01-08',
      expiryDate: '2025-01-08',
      level: 'Premium'
    },
    {
      type: 'Geographic Verification',
      issuer: 'GeoComply',
      status: 'pending',
      issuedDate: null,
      expiryDate: null,
      level: 'Basic'
    }
  ],
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    country: 'United States',
    region: 'North America',
    investorType: 'Accredited Individual',
    riskProfile: 'Medium'
  }
};

const availableCredentials = [
  {
    type: 'Professional License',
    issuer: 'Professional Bodies',
    description: 'Verify professional qualifications and licenses',
    benefits: ['Higher transaction limits', 'Access to professional-only assets'],
    estimatedTime: '2-3 business days',
    cost: 'Free'
  },
  {
    type: 'Bank Account Verification',
    issuer: 'Plaid',
    description: 'Link and verify your bank account for enhanced security',
    benefits: ['Faster withdrawals', 'Higher daily limits'],
    estimatedTime: '5-10 minutes',
    cost: 'Free'
  },
  {
    type: 'Social Media Verification',
    issuer: 'Social Platforms',
    description: 'Verify your social media presence for reputation scoring',
    benefits: ['Social reputation score', 'Community features'],
    estimatedTime: '1-2 minutes',
    cost: 'Free'
  }
];

const complianceMetrics = [
  { label: 'Identity Score', value: '94/100', status: 'excellent', icon: Shield },
  { label: 'Verification Level', value: 'Enhanced', status: 'good', icon: Award },
  { label: 'Linked Addresses', value: '3 chains', status: 'good', icon: Link },
  { label: 'Credentials', value: '3 active', status: 'good', icon: FileText }
];

export default function IdentityPassportPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddCredential, setShowAddCredential] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const { address, isConnected } = useAccount();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified': case 'active': case 'excellent': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': case 'good': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'expired': case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'basic': return 'from-blue-500 to-blue-600';
      case 'standard': return 'from-green-500 to-green-600';
      case 'enhanced': return 'from-purple-500 to-purple-600';
      case 'premium': return 'from-gold-500 to-gold-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
              Identity Passport
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Manage your cross-chain identity with DID integration, verifiable credentials, and multi-wallet linking
            </p>
          </div>
          <ConnectButton />
        </motion.div>

        {/* Passport Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Passport Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Digital Identity Passport</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(passportData.status)}`}>
                      {passportData.status}
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getLevelColor(passportData.level)} text-white`}>
                      {passportData.level} Level
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>DID: {passportData.id}</div>
                    <div>Issued: {passportData.verificationDate} • Expires: {passportData.expiryDate}</div>
                    <div>Issuer: {passportData.issuer}</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(passportData.id)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Compliance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {complianceMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="bg-white/5 rounded-xl p-4 text-center">
                      <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white mb-1">{metric.value}</div>
                      <div className="text-xs text-gray-400">{metric.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QR Code & Actions */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 mb-6 mx-auto w-fit">
                <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500 text-xs">QR Code</span>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Passport
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Share Profile
                </button>
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
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'credentials', label: 'Credentials', icon: FileText },
            { id: 'addresses', label: 'Linked Addresses', icon: Link },
            { id: 'privacy', label: 'Privacy Settings', icon: Shield }
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
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Personal Information */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <User className="w-8 h-8 text-blue-400" />
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                  >
                    {showPrivateInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Full Name</div>
                      <div className="text-white font-medium">
                        {showPrivateInfo ? passportData.personalInfo.name : '••••••••'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="text-white font-medium">
                        {showPrivateInfo ? passportData.personalInfo.email : '••••••••@••••••.com'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Location</div>
                      <div className="text-white font-medium">{passportData.personalInfo.country}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Investor Type</div>
                      <div className="text-white font-medium">{passportData.personalInfo.investorType}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-400" />
                  Verification Status
                </h3>
                <div className="space-y-4">
                  {passportData.credentials.map((credential, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        {credential.status === 'verified' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : credential.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <div className="font-medium text-white">{credential.type}</div>
                          <div className="text-sm text-gray-400">{credential.issuer}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(credential.status)}`}>
                        {credential.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'credentials' && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Current Credentials */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    Verifiable Credentials
                  </h3>
                  <button
                    onClick={() => setShowAddCredential(true)}
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Credential
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {passportData.credentials.map((credential, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getLevelColor(credential.level)} flex items-center justify-center`}>
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(credential.status)}`}>
                          {credential.status}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{credential.type}</h4>
                      <p className="text-sm text-gray-400 mb-4">Issued by {credential.issuer}</p>
                      <div className="space-y-2 text-xs text-gray-500">
                        {credential.issuedDate && (
                          <div>Issued: {credential.issuedDate}</div>
                        )}
                        {credential.expiryDate && (
                          <div>Expires: {credential.expiryDate}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Credentials */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Plus className="w-8 h-8 text-green-400" />
                  Available Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCredentials.map((credential, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-white mb-2">{credential.type}</h4>
                      <p className="text-sm text-gray-400 mb-4">{credential.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="text-xs text-gray-500">
                          <strong>Benefits:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {credential.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-xs text-gray-500">
                          <strong>Time:</strong> {credential.estimatedTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          <strong>Cost:</strong> {credential.cost}
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300">
                        Start Verification
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'addresses' && (
            <motion.div
              key="addresses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Link className="w-8 h-8 text-purple-400" />
                  Linked Addresses
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Link Address
                </button>
              </div>
              <div className="space-y-4">
                {passportData.addresses.map((addr, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Wallet className="w-6 h-6 text-gray-400" />
                      <div>
                        <div className="font-medium text-white">{addr.chain}</div>
                        <div className="text-sm text-gray-400 font-mono">{addr.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {addr.verified ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </div>
                      ) : (
                        <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300">
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => copyToClipboard(addr.address)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Zap className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Quick Verification</h3>
            <p className="text-gray-400 text-sm mb-4">Complete basic KYC in under 5 minutes</p>
            <button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
              Start Now
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Cross-Chain Sync</h3>
            <p className="text-gray-400 text-sm mb-4">Synchronize identity across all networks</p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
              Sync Now
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Privacy Controls</h3>
            <p className="text-gray-400 text-sm mb-4">Manage data sharing and permissions</p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
              Configure
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
