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
  const [showQRModal, setShowQRModal] = useState(false);
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
        className="bg-gradient-to-br from-slate-900/80 to-slate-800/70 border border-gold-400/30 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:border-gold-400/50 transition-all cursor-pointer backdrop-blur-sm"
        onClick={() => setSelectedCredential(credential.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{credential.type}</h3>
              <p className="text-gold-300 text-sm font-medium">{credential.level} Level</p>
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
            <span key={index} className="px-2 py-1 bg-gold-500/20 text-gold-300 text-xs rounded-lg border border-gold-400/30">
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
          <button className="flex items-center text-gold-400 hover:text-gold-300 transition-colors font-medium">
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
          <button className="flex-1 px-3 py-2 bg-gold-500/20 border border-gold-400/50 text-gold-300 rounded-lg hover:bg-gold-500/30 transition-colors text-sm font-medium">
            <Copy className="w-4 h-4 inline mr-1" />
            Copy
          </button>
          <button className="flex-1 px-3 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium">
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
            Identity Passport
          </h1>
          <p className="text-lg text-gray-300">
            Decentralized identity verification for secure RWA investments
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowQRModal(true)}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Share
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-gold-500/25">
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
        className="bg-gradient-to-br from-slate-900/80 to-slate-800/70 border border-gold-400/30 rounded-xl p-8 shadow-2xl backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passport ID & Score */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Digital Identity Passport</h2>
                <p className="text-gold-300 font-mono text-sm">{passportData.id}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                    {passportData.status}
                  </span>
                  <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-lg text-sm font-medium border border-gold-400/30">
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
                <div className="text-3xl font-bold text-gold-400">
                  {passportData.credentials.filter(c => c.status === 'verified').length}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  of {passportData.credentials.length} total
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/50 border border-gold-400/20 rounded-xl p-4 backdrop-blur-sm">
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
                <User className="w-4 h-4 text-gold-400" />
                <span className="text-gray-300">
                  {showPrivateInfo ? passportData.personalInfo.name : '••••••••'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold-400" />
                <span className="text-gray-300">
                  {showPrivateInfo ? passportData.personalInfo.email : '••••••••@••••.com'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span className="text-gray-300">
                  {showPrivateInfo ? `${passportData.personalInfo.region}, ${passportData.personalInfo.country}` : '••••••••, ••'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gold-400" />
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
        className="flex space-x-1 bg-gradient-to-r from-slate-900/80 to-slate-800/70 border border-gold-400/20 rounded-xl p-1 backdrop-blur-sm"
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
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-400/50 shadow-lg'
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
              <button className="px-4 py-2 bg-gold-500/20 border border-gold-400/50 text-gold-300 rounded-xl hover:bg-gold-500/30 transition-colors flex items-center gap-2 font-medium">
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
                  className={`border rounded-xl p-6 backdrop-blur-sm ${
                    passportData.level === level.level
                      ? 'border-gold-400/50 bg-gradient-to-br from-gold-500/10 to-gold-600/5 shadow-lg'
                      : 'border-gray-600/30 bg-gradient-to-br from-slate-800/40 to-slate-700/30'
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

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Share Identity Passport</h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* QR Code Container */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-white rounded-2xl p-6 mb-6 mx-auto w-fit"
              >
                {/* Realistic QR Code with Dense Pattern */}
                <div className="w-48 h-48 bg-white relative overflow-hidden rounded-lg border border-gray-300 shadow-inner">
                  <svg width="192" height="192" viewBox="0 0 192 192" className="w-full h-full">
                    {/* Background */}
                    <rect width="192" height="192" fill="white"/>
                    
                    {/* Generate dense QR pattern - 25x25 grid */}
                    {(() => {
                      const modules = [];
                      const size = 25;
                      const moduleSize = 192 / size;
                      
                      // Create realistic QR data pattern
                      const qrPattern = [
                        "1111111000101001111111000",
                        "1000001010001011000001000",
                        "1011101001110101011101000",
                        "1011101110010101011101000",
                        "1011101000111101011101000",
                        "1000001011001001000001000",
                        "1111111010101011111111000",
                        "0000000110010000000000000",
                        "0011101001110100111010000",
                        "1010010110001011010010000",
                        "0101101001110100101101000",
                        "1110010110001011100010000",
                        "0001101001110100011010000",
                        "1010010110001011010010000",
                        "0101101001110100101101000",
                        "1110010110001011100010000",
                        "0001101001110100011010000",
                        "0000000110010000000000000",
                        "1111111001101011111111000",
                        "1000001010010001000001000",
                        "1011101001110101011101000",
                        "1011101110010101011101000",
                        "1011101000111101011101000",
                        "1000001011001001000001000",
                        "1111111010101011111111000"
                      ];
                      
                      for (let row = 0; row < size; row++) {
                        for (let col = 0; col < size; col++) {
                          const isBlack = qrPattern[row] && qrPattern[row][col] === '1';
                          
                          // Skip center area for logo
                          if (row >= 10 && row <= 14 && col >= 10 && col <= 14) {
                            continue;
                          }
                          
                          if (isBlack) {
                            modules.push(
                              <motion.rect
                                key={`${row}-${col}`}
                                x={col * moduleSize + 1}
                                y={row * moduleSize + 1}
                                width={moduleSize - 2}
                                height={moduleSize - 2}
                                fill="black"
                                rx="0.5"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                  delay: (row + col) * 0.005,
                                  duration: 0.1
                                }}
                              />
                            );
                          }
                        }
                      }
                      
                      return <g>{modules}</g>;
                    })()}
                    
                    {/* Finder patterns (corners) - more detailed */}
                    <g fill="black">
                      {/* Top-left */}
                      <rect x="8" y="8" width="48" height="48" fill="black"/>
                      <rect x="16" y="16" width="32" height="32" fill="white"/>
                      <rect x="24" y="24" width="16" height="16" fill="black"/>
                      
                      {/* Top-right */}
                      <rect x="136" y="8" width="48" height="48" fill="black"/>
                      <rect x="144" y="16" width="32" height="32" fill="white"/>
                      <rect x="152" y="24" width="16" height="16" fill="black"/>
                      
                      {/* Bottom-left */}
                      <rect x="8" y="136" width="48" height="48" fill="black"/>
                      <rect x="16" y="144" width="32" height="32" fill="white"/>
                      <rect x="24" y="152" width="16" height="16" fill="black"/>
                    </g>
                    
                    {/* Timing patterns */}
                    <g fill="black">
                      {Array.from({length: 17}, (_, i) => (
                        <rect key={`h-${i}`} x={64 + i * 7.6} y="48" width="3.8" height="3.8" opacity={i % 2 === 0 ? 1 : 0}/>
                      ))}
                      {Array.from({length: 17}, (_, i) => (
                        <rect key={`v-${i}`} x="48" y={64 + i * 7.6} width="3.8" height="3.8" opacity={i % 2 === 0 ? 1 : 0}/>
                      ))}
                    </g>
                    
                    {/* Alignment pattern (bottom-right) */}
                    <g fill="black">
                      <rect x="144" y="144" width="24" height="24" fill="black"/>
                      <rect x="148" y="148" width="16" height="16" fill="white"/>
                      <rect x="152" y="152" width="8" height="8" fill="black"/>
                    </g>
                  </svg>
                  
                  {/* Center logo with clean background */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-lg p-3 shadow-lg border-2 border-gold-400">
                      <Shield className="w-8 h-8 text-gold-500" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Passport Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 rounded-xl p-4 mb-6"
              >
                <div className="text-gold-400 font-bold text-lg mb-2">
                  Enhanced Level Passport
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  Trust Score: {passportData.score}/100
                </div>
                <div className="text-xs text-gray-500 font-mono break-all">
                  {passportData.id}
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-sm mb-6"
              >
                Scan this QR code to verify identity credentials and trust score
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex space-x-3"
              >
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(passportData.id);
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy ID
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(passportData.id));
                    element.setAttribute('download', 'identity-passport-qr.txt');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Save
                </button>
              </motion.div>

              {/* Animated particles around QR code */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                    className="absolute w-2 h-2 bg-gold-400 rounded-full opacity-30"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
