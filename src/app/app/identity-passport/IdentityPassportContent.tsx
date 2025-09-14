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
  Building,
  QrCode,
  Key,
  Lock,
  Unlock,
  Fingerprint,
  Camera
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
      id: 'kyc-basic',
      type: 'KYC Verification',
      status: 'verified',
      issuer: 'Jumio Identity Services',
      issuedDate: '2024-01-10',
      expiryDate: '2025-01-10',
      level: 'Basic',
      documents: ['Government ID', 'Proof of Address']
    },
    {
      id: 'accredited-investor',
      type: 'Accredited Investor',
      status: 'verified',
      issuer: 'SEC Verification Authority',
      issuedDate: '2024-01-12',
      expiryDate: '2024-12-31',
      level: 'Professional',
      documents: ['Financial Statements', 'Income Verification']
    },
    {
      id: 'aml-check',
      type: 'AML Screening',
      status: 'verified',
      issuer: 'Chainalysis Compliance',
      issuedDate: '2024-01-15',
      expiryDate: '2024-07-15',
      level: 'Enhanced',
      documents: ['Transaction History', 'Source of Funds']
    },
    {
      id: 'credit-score',
      type: 'Credit Assessment',
      status: 'pending',
      issuer: 'Experian Credit Bureau',
      issuedDate: null,
      expiryDate: null,
      level: 'Premium',
      documents: ['Credit Report', 'Banking History']
    }
  ],
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    country: 'United States',
    region: 'California',
    investorType: 'Accredited',
    riskProfile: 'Moderate',
    kycLevel: 'Enhanced'
  }
};

const verificationLevels = [
  { level: 'Basic', score: '0-40', color: 'text-red-400', bg: 'bg-red-500/20', requirements: ['Email', 'Phone'] },
  { level: 'Standard', score: '41-70', color: 'text-yellow-400', bg: 'bg-yellow-500/20', requirements: ['Government ID', 'Address'] },
  { level: 'Enhanced', score: '71-90', color: 'text-blue-400', bg: 'bg-blue-500/20', requirements: ['KYC', 'AML Check', 'Biometrics'] },
  { level: 'Premium', score: '91-100', color: 'text-green-400', bg: 'bg-green-500/20', requirements: ['All Enhanced', 'Credit Check', 'Accreditation'] }
];

const chainIcons = {
  Ethereum: '🔷',
  Polygon: '🟣',
  Solana: '🌟',
  BSC: '🟡',
  Arbitrum: '🔵'
};

export default function IdentityPassportContent() {
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { address, isConnected } = useAccount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'expired': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'expired': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const CredentialCard = ({ credential }: { credential: typeof passportData.credentials[0] }) => {
    const StatusIcon = getStatusIcon(credential.status);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-blue-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedCredential(credential.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{credential.type}</h3>
              <p className="text-blue-300 text-sm">{credential.level} Level</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${getStatusColor(credential.status)}`} />
            <span className={`text-sm font-medium capitalize ${getStatusColor(credential.status)}`}>
              {credential.status}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Issuer</span>
            <span className="text-white font-medium">{credential.issuer}</span>
          </div>
          {credential.issuedDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Issued</span>
              <span className="text-white font-medium">{credential.issuedDate}</span>
            </div>
          )}
          {credential.expiryDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Expires</span>
              <span className="text-white font-medium">{credential.expiryDate}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {credential.documents.slice(0, 2).map((doc, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg">
              {doc}
            </span>
          ))}
          {credential.documents.length > 2 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-lg">
              +{credential.documents.length - 2} more
            </span>
          )}
        </div>

        <div className="flex justify-end">
          <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <span className="text-sm font-medium mr-1">View Details</span>
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const AddressCard = ({ address }: { address: typeof passportData.addresses[0] }) => {
    return (
      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{chainIcons[address.chain as keyof typeof chainIcons]}</span>
            <div>
              <h4 className="text-white font-medium">{address.chain}</h4>
              <p className="text-gray-400 text-sm font-mono">
                {address.address.slice(0, 8)}...{address.address.slice(-8)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {address.verified ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-400" />
            )}
            <span className={`text-sm font-medium ${address.verified ? 'text-green-400' : 'text-yellow-400'}`}>
              {address.verified ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
            <Copy className="w-4 h-4 inline mr-1" />
            Copy
          </button>
          <button className="flex-1 px-3 py-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm">
            <ExternalLink className="w-4 h-4 inline mr-1" />
            Explorer
          </button>
        </div>
      </div>
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
            Identity Passport
          </h1>
          <p className="text-lg text-gray-300">
            Decentralized identity verification for secure RWA investments
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Share
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Credential
          </button>
        </div>
      </motion.div>

      {/* Passport Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-blue-400/40 rounded-xl p-8 shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passport ID & Score */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Digital Identity Passport</h2>
                <p className="text-blue-300 font-mono text-sm">{passportData.id}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                    {passportData.status}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                    {passportData.level} Level
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Trust Score</div>
                <div className="text-3xl font-bold text-green-400">{passportData.score}/100</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${passportData.score}%` }}
                  />
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Verified Credentials</div>
                <div className="text-3xl font-bold text-blue-400">
                  {passportData.credentials.filter(c => c.status === 'verified').length}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  of {passportData.credentials.length} total
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Personal Information</h3>
              <button
                onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showPrivateInfo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  {showPrivateInfo ? passportData.personalInfo.name : '••••••••'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  {showPrivateInfo ? passportData.personalInfo.email : '••••••••@••••.com'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  {showPrivateInfo ? `${passportData.personalInfo.region}, ${passportData.personalInfo.country}` : '••••••••, ••'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{passportData.personalInfo.investorType} Investor</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 bg-slate-800/60 rounded-xl p-1"
      >
        {[
          { id: 'credentials', label: 'Credentials', icon: FileText },
          { id: 'addresses', label: 'Addresses', icon: Wallet },
          { id: 'verification', label: 'Verification Levels', icon: Award }
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
        {activeTab === 'credentials' && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {passportData.credentials.map((credential, index) => (
              <motion.div
                key={credential.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CredentialCard credential={credential} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'addresses' && (
          <motion.div
            key="addresses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Linked Addresses</h3>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Link Address
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {passportData.addresses.map((address, index) => (
                <motion.div
                  key={address.chain}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AddressCard address={address} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white">Verification Levels</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {verificationLevels.map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`border-2 rounded-xl p-6 ${
                    passportData.level === level.level
                      ? 'border-blue-400/50 bg-blue-500/10'
                      : 'border-gray-600/50 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${level.bg} rounded-xl flex items-center justify-center`}>
                        <Award className={`w-6 h-6 ${level.color}`} />
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold ${level.color}`}>{level.level}</h4>
                        <p className="text-gray-400 text-sm">Score: {level.score}</p>
                      </div>
                    </div>
                    {passportData.level === level.level && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 font-medium">Requirements:</p>
                    {level.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-center text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {req}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
