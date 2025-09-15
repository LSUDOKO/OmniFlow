"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Shield,
  FileText,
  Upload,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Hash,
  Lock,
  Globe,
  Users,
  BarChart3,
  Zap,
  Camera,
  Scan,
  Fingerprint,
  Award,
  Star,
  TrendingUp,
  AlertCircle,
  Info,
  Plus,
  Filter
} from 'lucide-react';

const verificationMethods = [
  { id: 'blockchain', name: 'Blockchain Verification', icon: Hash, color: 'text-blue-400' },
  { id: 'biometric', name: 'Biometric Analysis', icon: Fingerprint, color: 'text-purple-400' },
  { id: 'digital-signature', name: 'Digital Signatures', icon: Lock, color: 'text-green-400' },
  { id: 'ai-detection', name: 'AI Fraud Detection', icon: Zap, color: 'text-gold-400' }
];

const sampleDocuments = [
  {
    id: 'doc-001',
    name: 'Manhattan Office Deed',
    type: 'Property Document',
    category: 'real-estate',
    uploadDate: '2024-01-15',
    verificationStatus: 'verified',
    confidenceScore: 98.5,
    fileSize: '2.4 MB',
    format: 'PDF',
    verificationMethods: ['blockchain', 'digital-signature'],
    issuer: 'New York Property Registry',
    lastVerified: '2 hours ago',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    authenticity: {
      documentIntegrity: 99,
      signatureValidity: 98,
      timestampVerification: 100,
      issuerAuthentication: 97
    }
  },
  {
    id: 'doc-002',
    name: 'Gold Assay Certificate',
    type: 'Authenticity Certificate',
    category: 'precious-metals',
    uploadDate: '2024-02-01',
    verificationStatus: 'verified',
    confidenceScore: 96.2,
    fileSize: '1.8 MB',
    format: 'PDF',
    verificationMethods: ['blockchain', 'biometric', 'ai-detection'],
    issuer: 'Swiss Precious Metals Authority',
    lastVerified: '1 day ago',
    blockchainHash: '0x9876543210fedcba0987654321fedcba09876543',
    authenticity: {
      documentIntegrity: 98,
      signatureValidity: 95,
      timestampVerification: 99,
      issuerAuthentication: 92
    }
  },
  {
    id: 'doc-003',
    name: 'Carbon Credit Verification',
    type: 'Environmental Certificate',
    category: 'carbon-credits',
    uploadDate: '2024-03-10',
    verificationStatus: 'pending',
    confidenceScore: 0,
    fileSize: '3.1 MB',
    format: 'PDF',
    verificationMethods: ['blockchain', 'digital-signature'],
    issuer: 'Global Carbon Registry',
    lastVerified: 'Processing...',
    blockchainHash: 'Pending verification',
    authenticity: {
      documentIntegrity: 0,
      signatureValidity: 0,
      timestampVerification: 0,
      issuerAuthentication: 0
    }
  },
  {
    id: 'doc-004',
    name: 'Art Provenance Record',
    type: 'Provenance Document',
    category: 'art-collectibles',
    uploadDate: '2024-01-20',
    verificationStatus: 'flagged',
    confidenceScore: 45.8,
    fileSize: '5.2 MB',
    format: 'PDF',
    verificationMethods: ['ai-detection', 'biometric'],
    issuer: 'International Art Authentication Board',
    lastVerified: '3 days ago',
    blockchainHash: '0xflagged123456789abcdef0123456789abcdef01',
    authenticity: {
      documentIntegrity: 65,
      signatureValidity: 42,
      timestampVerification: 78,
      issuerAuthentication: 28
    }
  }
];

const statusColors = {
  verified: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/50', icon: CheckCircle },
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-400/50', icon: Clock },
  flagged: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/50', icon: AlertTriangle },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/50', icon: AlertCircle }
};

export default function AuthenticityContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [originalDocument, setOriginalDocument] = useState<typeof sampleDocuments[0] | null>(null);
  const { address, isConnected } = useAccount();

  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const downloadDocument = (doc: typeof sampleDocuments[0]) => {
    // Create comprehensive document data
    const documentData = {
      documentId: doc.id,
      documentName: doc.name,
      documentType: doc.type,
      category: doc.category,
      downloadDate: new Date().toISOString(),
      fileInfo: {
        format: doc.format,
        size: doc.fileSize,
        uploadDate: doc.uploadDate
      },
      verification: {
        status: doc.verificationStatus,
        confidenceScore: doc.confidenceScore,
        lastVerified: doc.lastVerified,
        methods: doc.verificationMethods
      },
      authenticity: doc.authenticity,
      blockchain: {
        hash: doc.blockchainHash,
        network: 'Ethereum Mainnet',
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
        timestamp: new Date().toISOString()
      },
      issuer: {
        name: doc.issuer,
        verified: true,
        trustScore: 95
      }
    };

    // Convert to JSON and create downloadable file
    const jsonString = JSON.stringify(documentData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name.replace(/\s+/g, '_')}_Authenticity_Report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  const showOriginalDocument = (document: typeof sampleDocuments[0]) => {
    setOriginalDocument(document);
    setShowOriginalModal(true);
  };

  const verificationStats = {
    totalDocuments: sampleDocuments.length,
    verifiedDocuments: sampleDocuments.filter(doc => doc.verificationStatus === 'verified').length,
    pendingVerification: sampleDocuments.filter(doc => doc.verificationStatus === 'pending').length,
    averageConfidence: Math.round(sampleDocuments.reduce((sum, doc) => sum + doc.confidenceScore, 0) / sampleDocuments.length)
  };

  const DocumentCard = ({ document }: { document: typeof sampleDocuments[0] }) => {
    const statusStyle = statusColors[document.verificationStatus as keyof typeof statusColors];
    const StatusIcon = statusStyle.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={() => setSelectedDocument(document.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{document.name}</h3>
              <p className="text-blue-300 text-sm">{document.type}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-lg border flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} text-xs font-medium`}>
            <StatusIcon className="w-3 h-3" />
            {document.verificationStatus.charAt(0).toUpperCase() + document.verificationStatus.slice(1)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Confidence Score</p>
            <p className="text-lg font-bold text-purple-400">{document.confidenceScore}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">File Size</p>
            <p className="text-lg font-bold text-green-400">{document.fileSize}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Format</p>
            <p className="text-lg font-bold text-gold-400">{document.format}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Issuer</p>
            <p className="text-sm font-bold text-blue-400 truncate">{document.issuer}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Uploaded {document.uploadDate}
          </div>
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            {document.verificationMethods.length} methods
          </div>
        </div>
      </motion.div>
    );
  };

  const DocumentDetail = ({ documentId }: { documentId: string }) => {
    const document = sampleDocuments.find(d => d.id === documentId);
    if (!document) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedDocument(null)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{document.name}</h2>
                <p className="text-blue-300 text-lg">{document.type}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDocument(null)}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Object.entries(document.authenticity).map(([key, value]) => (
              <div key={key} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{value}%</div>
                <div className="text-xs text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      value >= 90 ? 'bg-green-500' :
                      value >= 70 ? 'bg-yellow-500' :
                      value >= 50 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Hash className="w-5 h-5 text-blue-400 mr-2" />
                Blockchain Verification
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
                  <p className="text-sm font-mono text-blue-400 break-all">{document.blockchainHash}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Verified</p>
                  <p className="text-sm text-white">{document.lastVerified}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Network</p>
                  <p className="text-sm text-white">Ethereum Mainnet</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 text-green-400 mr-2" />
                Verification Methods
              </h3>
              <div className="space-y-3">
                {document.verificationMethods.map((methodId) => {
                  const method = verificationMethods.find(m => m.id === methodId);
                  if (!method) return null;
                  const Icon = method.icon;
                  return (
                    <div key={methodId} className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${method.color}`} />
                      <span className="text-white">{method.name}</span>
                      <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Info className="w-5 h-5 text-gold-400 mr-2" />
              Document Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Upload Date</p>
                <p className="text-white">{document.uploadDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">File Format</p>
                <p className="text-white">{document.format}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">File Size</p>
                <p className="text-white">{document.fileSize}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Issuing Authority</p>
                <p className="text-white">{document.issuer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Category</p>
                <p className="text-white capitalize">{document.category.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Confidence Score</p>
                <p className="text-white">{document.confidenceScore}%</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <Shield className="w-4 h-4 text-green-400 mr-2" />
              Document authenticity verified
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => downloadDocument(document)}
                className="px-6 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button 
                onClick={() => showOriginalDocument(document)}
                className="px-6 py-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Original
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const OriginalDocumentModal = () => {
    if (!originalDocument) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowOriginalModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-400/40 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Original Document Preview</h2>
              <p className="text-purple-300">{originalDocument.name}</p>
            </div>
            <button
              onClick={() => setShowOriginalModal(false)}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Document Preview Area */}
            <div className="bg-white/10 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{originalDocument.name}</h3>
                <p className="text-gray-300 mb-4">Document Type: {originalDocument.type}</p>
                <div className="bg-white/20 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-300 mb-2">This is a preview of the original document.</p>
                  <p className="text-xs text-gray-400">Format: {originalDocument.format} • Size: {originalDocument.fileSize}</p>
                </div>
              </div>
            </div>

            {/* Document Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 text-blue-400 mr-2" />
                  Document Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">File Name</span>
                    <span className="font-bold text-blue-400">{originalDocument.name}.{originalDocument.format.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Upload Date</span>
                    <span className="font-bold text-blue-400">{originalDocument.uploadDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">File Size</span>
                    <span className="font-bold text-blue-400">{originalDocument.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Issuer</span>
                    <span className="font-bold text-blue-400 text-sm">{originalDocument.issuer}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  Security Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Digital Watermark</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tamper Detection</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Blockchain Hash</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Digital Signature</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 text-gold-400 mr-2" />
                Verification Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(originalDocument.authenticity).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${
                      value >= 90 ? 'text-green-400' :
                      value >= 70 ? 'text-yellow-400' :
                      value >= 50 ? 'text-orange-400' : 'text-red-400'
                    }`}>{value}%</div>
                    <div className="text-xs text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={() => downloadDocument(originalDocument)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Original
            </button>
            <button 
              onClick={() => window.open(`https://etherscan.io/tx/${originalDocument.blockchainHash}`, '_blank')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Globe className="w-5 h-5" />
              View on Blockchain
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
            Document Authenticity
          </h1>
          <p className="text-lg text-gray-300">
            Verify and authenticate documents using blockchain and AI technology
          </p>
        </div>
        <button 
          onClick={() => setShowUploader(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </motion.div>

      {/* Verification Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Documents', value: verificationStats.totalDocuments.toString(), icon: FileText, color: 'text-blue-400' },
          { label: 'Verified', value: verificationStats.verifiedDocuments.toString(), icon: CheckCircle, color: 'text-green-400' },
          { label: 'Pending', value: verificationStats.pendingVerification.toString(), icon: Clock, color: 'text-yellow-400' },
          { label: 'Avg. Confidence', value: `${verificationStats.averageConfidence}%`, icon: Shield, color: 'text-purple-400' }
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
              placeholder="Search documents..."
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
              All Categories
            </button>
            {['real-estate', 'precious-metals', 'carbon-credits', 'art-collectibles'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-400/50'
                    : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
                }`}
              >
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Documents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
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
      </motion.div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && <DocumentDetail documentId={selectedDocument} />}
      </AnimatePresence>

      {/* Original Document Modal */}
      <AnimatePresence>
        {showOriginalModal && <OriginalDocumentModal />}
      </AnimatePresence>
    </div>
  );
}
