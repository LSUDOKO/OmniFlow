"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { 
  Shield, 
  Users, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  UserCheck, 
  Ban, 
  TrendingUp, 
  FileText, 
  Settings, 
  Eye, 
  Download,
  Clock,
  Activity,
  X,
  MapPin,
  Flag,
  BarChart3,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

const complianceStats = [
  { label: 'Total Users', value: '12,847', change: '+234 today', icon: Users, color: 'text-blue-400' },
  { label: 'KYC Completed', value: '94.2%', change: '+2.1%', icon: UserCheck, color: 'text-green-400' },
  { label: 'Pending Reviews', value: '127', change: '-15 today', icon: Clock, color: 'text-yellow-400' },
  { label: 'Compliance Rate', value: '98.7%', change: '+0.3%', icon: Shield, color: 'text-green-400' }
];

const regionalDistribution = [
  { region: 'United States', users: 4521, compliance: 99.2, level: 'Enhanced', flag: '🇺🇸' },
  { region: 'European Union', users: 3847, compliance: 97.8, level: 'Basic', flag: '🇪🇺' },
  { region: 'Asia Pacific', users: 2156, compliance: 96.4, level: 'Basic', flag: '🌏' },
  { region: 'Canada', users: 1234, compliance: 98.9, level: 'Enhanced', flag: '🇨🇦' },
  { region: 'United Kingdom', users: 1089, compliance: 99.1, level: 'Enhanced', flag: '🇬🇧' }
];

const recentActivity = [
  {
    id: 1,
    type: 'kyc_completed',
    user: '0x742d...3f8a',
    action: 'KYC Verification Completed',
    region: 'United States',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'aml_flag',
    user: '0x8b3c...9d2e',
    action: 'AML Risk Assessment Flagged',
    region: 'European Union',
    timestamp: '5 minutes ago',
    status: 'warning'
  },
  {
    id: 3,
    type: 'compliance_update',
    user: '0x1a5f...7c4b',
    action: 'Compliance Level Updated to Enhanced',
    region: 'Canada',
    timestamp: '12 minutes ago',
    status: 'success'
  },
  {
    id: 4,
    type: 'geo_restriction',
    user: '0x9e2d...5a8f',
    action: 'Geographic Restriction Applied',
    region: 'Restricted',
    timestamp: '18 minutes ago',
    status: 'error'
  },
  {
    id: 5,
    type: 'document_verified',
    user: '0x4f7a...1b9c',
    action: 'Identity Document Verified',
    region: 'United Kingdom',
    timestamp: '25 minutes ago',
    status: 'success'
  }
];

const complianceLevels = [
  {
    level: 'NONE',
    name: 'No Compliance',
    description: 'Basic access only',
    color: 'from-gray-500 to-gray-600',
    users: 156,
    limits: 'View only'
  },
  {
    level: 'BASIC',
    name: 'Basic KYC',
    description: 'Standard verification',
    color: 'from-blue-500 to-blue-600',
    users: 8234,
    limits: '$5,000 monthly'
  },
  {
    level: 'ENHANCED',
    name: 'Enhanced KYC',
    description: 'Advanced verification',
    color: 'from-green-500 to-green-600',
    users: 3847,
    limits: '$50,000 monthly'
  },
  {
    level: 'INSTITUTIONAL',
    name: 'Institutional',
    description: 'Corporate verification',
    color: 'from-purple-500 to-purple-600',
    users: 456,
    limits: 'Unlimited'
  },
  {
    level: 'RESTRICTED',
    name: 'Restricted',
    description: 'Limited access',
    color: 'from-red-500 to-red-600',
    users: 154,
    limits: 'Blocked'
  }
];

export default function ComplianceContent() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const { address, isConnected } = useAccount();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showManageAccessModal, setShowManageAccessModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showMonitorModal, setShowMonitorModal] = useState(false);
  const [showApprovalSuccessModal, setShowApprovalSuccessModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvedUserName, setApprovedUserName] = useState('');
  const [rejectedUserName, setRejectedUserName] = useState('');
  const [showUnblockSuccessModal, setShowUnblockSuccessModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [unblockedUserName, setUnblockedUserName] = useState('');
  const [reviewUserName, setReviewUserName] = useState('');
  const [showUpgradeSuccessModal, setShowUpgradeSuccessModal] = useState(false);
  const [upgradedUserName, setUpgradedUserName] = useState('');
  const [upgradeDetails, setUpgradeDetails] = useState({ from: '', to: '' });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleApproveUser = (userName: string) => {
    setApprovedUserName(userName);
    setShowApprovalSuccessModal(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowApprovalSuccessModal(false);
      setApprovedUserName('');
    }, 2000);
  };

  const handleRejectUser = (userName: string) => {
    setRejectedUserName(userName);
    setShowRejectionModal(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowRejectionModal(false);
      setRejectedUserName('');
    }, 2000);
  };

  const handleUnblockUser = (userName: string) => {
    setUnblockedUserName(userName);
    setShowUnblockSuccessModal(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowUnblockSuccessModal(false);
      setUnblockedUserName('');
    }, 2000);
  };

  const handleReviewUser = (userName: string) => {
    setReviewUserName(userName);
    setShowReviewModal(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewUserName('');
    }, 2000);
  };

  const handleUpgradeUser = (userName: string, fromLevel: string, toLevel: string) => {
    setUpgradedUserName(userName);
    setUpgradeDetails({ from: fromLevel, to: toLevel });
    setShowUpgradeSuccessModal(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowUpgradeSuccessModal(false);
      setUpgradedUserName('');
      setUpgradeDetails({ from: '', to: '' });
    }, 2000);
  };

  const filteredActivity = recentActivity.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || activity.region.toLowerCase().includes(filterRegion.toLowerCase());
    return matchesSearch && matchesRegion;
  });

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
            Compliance Center
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Comprehensive regulatory compliance management for RWA tokenization with KYC, AML, and geographic restrictions
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {complianceStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2"
      >
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'regions', label: 'Regional Compliance', icon: Globe },
          { id: 'activity', label: 'Activity Log', icon: Activity }
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
            className="space-y-8"
          >
            {/* Compliance Levels */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-gold-400" />
                Compliance Levels Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {complianceLevels.map((level) => (
                  <div key={level.level} className="bg-white/5 rounded-2xl p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${level.color} flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4`}>
                      {level.users}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{level.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{level.description}</p>
                    <div className="text-xs text-gray-500">{level.limits}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Distribution */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-400" />
                Regional Distribution
              </h3>
              <div className="space-y-4">
                {regionalDistribution.map((region) => (
                  <div key={region.region} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{region.flag}</span>
                      <div>
                        <div className="font-medium text-white">{region.region}</div>
                        <div className="text-sm text-gray-400">{region.users.toLocaleString()} users</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        region.level === 'Enhanced' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {region.level}
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{region.compliance}%</div>
                        <div className="text-sm text-gray-400">Compliance</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                User Management Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-2xl p-6">
                  <UserCheck className="w-12 h-12 text-green-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Verify Users</h4>
                  <p className="text-gray-400 text-sm mb-4">Review and approve pending KYC applications</p>
                  <button 
                    onClick={() => setShowVerifyModal(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-xl transition-all duration-300"
                  >
                    Review Queue
                  </button>
                </div>
                <div className="bg-white/5 rounded-2xl p-6">
                  <Ban className="w-12 h-12 text-red-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Manage Restrictions</h4>
                  <p className="text-gray-400 text-sm mb-4">Add or remove user restrictions and blacklists</p>
                  <button 
                    onClick={() => setShowManageAccessModal(true)}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-xl transition-all duration-300"
                  >
                    Manage Access
                  </button>
                </div>
                <div className="bg-white/5 rounded-2xl p-6">
                  <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Upgrade Levels</h4>
                  <p className="text-gray-400 text-sm mb-4">Process compliance level upgrades</p>
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 px-4 rounded-xl transition-all duration-300"
                  >
                    Process Upgrades
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'regions' && (
          <motion.div
            key="regions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-400" />
                Regional Compliance Policies
              </h3>
              <div className="space-y-6">
                {regionalDistribution.map((region) => (
                  <div key={region.region} className="bg-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{region.flag}</span>
                        <div>
                          <h4 className="text-xl font-bold text-white">{region.region}</h4>
                          <p className="text-gray-400">Compliance Level: {region.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{region.compliance}%</div>
                        <div className="text-sm text-gray-400">Compliance Rate</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-lg font-bold text-white">{region.users.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Total Users</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-lg font-bold text-green-400">
                          {region.level === 'Enhanced' ? '$50,000' : '$5,000'}
                        </div>
                        <div className="text-sm text-gray-400">Monthly Limit</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-lg font-bold text-blue-400">
                          {region.level === 'Enhanced' ? 'Enhanced KYC' : 'Basic KYC'}
                        </div>
                        <div className="text-sm text-gray-400">Required Level</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users or activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
                />
              </div>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
              >
                <option value="all">All Regions</option>
                <option value="united states">United States</option>
                <option value="european union">European Union</option>
                <option value="canada">Canada</option>
                <option value="united kingdom">United Kingdom</option>
              </select>
            </div>

            {/* Activity Feed */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Activity className="w-8 h-8 text-green-400" />
                  Recent Activity
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              <div className="space-y-4">
                {filteredActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(activity.status)}
                      <div>
                        <div className="font-medium text-white">{activity.action}</div>
                        <div className="text-sm text-gray-400">
                          User: {activity.user} • {activity.region}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{activity.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
          <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Generate Report</h3>
          <p className="text-gray-400 text-sm mb-4">Export compliance analytics and audit trails</p>
          <button 
            onClick={() => setShowReportModal(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
          <Settings className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Compliance Settings</h3>
          <p className="text-gray-400 text-sm mb-4">Configure regional policies and thresholds</p>
          <button 
            onClick={() => setShowConfigureModal(true)}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configure
          </button>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
          <Ban className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Risk Management</h3>
          <p className="text-gray-400 text-sm mb-4">Monitor and manage high-risk users</p>
          <button 
            onClick={() => setShowMonitorModal(true)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Monitor
          </button>
        </div>
      </motion.div>

      {/* Verify Users Modal */}
      {showVerifyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowVerifyModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-green-400" />
                KYC Verification Queue
              </h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Alice Johnson', email: 'alice@example.com', country: 'United States', level: 'Enhanced', status: 'pending', documents: 3, risk: 'Low' },
                { name: 'Bob Chen', email: 'bob@example.com', country: 'Singapore', level: 'Basic', status: 'review', documents: 2, risk: 'Medium' },
                { name: 'Carol Davis', email: 'carol@example.com', country: 'Germany', level: 'Institutional', status: 'pending', documents: 5, risk: 'Low' }
              ].map((user, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{user.name}</h4>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">{user.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        user.status === 'review' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Requested Level</div>
                      <div className="text-white font-bold">{user.level}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Documents</div>
                      <div className="text-white font-bold">{user.documents}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Risk Score</div>
                      <div className={`font-bold ${user.risk === 'Low' ? 'text-green-400' : user.risk === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {user.risk}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Actions</div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveUser(user.name)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectUser(user.name)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Manage Access Modal */}
      {showManageAccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowManageAccessModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Ban className="w-8 h-8 text-red-400" />
                Restricted Users Management
              </h3>
              <button
                onClick={() => setShowManageAccessModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'John Blacklist', email: 'john@blocked.com', country: 'Unknown', reason: 'Suspicious Activity', date: '2024-01-15', severity: 'High' },
                { name: 'Sarah Restricted', email: 'sarah@limited.com', country: 'Iran', reason: 'Geographic Restriction', date: '2024-01-10', severity: 'Medium' },
                { name: 'Mike Flagged', email: 'mike@flagged.com', country: 'Russia', reason: 'Sanctions List', date: '2024-01-08', severity: 'Critical' }
              ].map((user, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{user.name}</h4>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">{user.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        user.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        user.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.severity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Restriction Reason</div>
                      <div className="text-white font-bold">{user.reason}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Date Blocked</div>
                      <div className="text-white font-bold">{user.date}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Actions</div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUnblockUser(user.name)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                        >
                          Unblock
                        </button>
                        <button 
                          onClick={() => handleReviewUser(user.name)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upgrade Levels Modal */}
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowUpgradeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                Compliance Level Upgrades
              </h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Alex Thompson', current: 'Basic', requested: 'Enhanced', reason: 'Higher Trading Limits', documents: 'Complete', status: 'ready' },
                { name: 'Maria Garcia', current: 'Enhanced', requested: 'Institutional', reason: 'Corporate Account', documents: 'Pending', status: 'waiting' },
                { name: 'James Wilson', current: 'Basic', requested: 'Enhanced', reason: 'Investment Increase', documents: 'Complete', status: 'ready' }
              ].map((user, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{user.name}</h4>
                        <p className="text-gray-400 text-sm">{user.current} → {user.requested}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                        user.status === 'review' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Upgrade Reason</div>
                      <div className="text-white font-bold text-sm">{user.reason}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Documents</div>
                      <div className="text-white font-bold">{user.documents}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-gray-400">Actions</div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpgradeUser(user.name, user.current, user.requested)}
                          className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors"
                        >
                          Upgrade
                        </button>
                        <button className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Export Report Modal */}
      {showReportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowReportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-400" />
                Export Compliance Report
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <FileText className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-white mb-2">Full Report</h4>
                  <p className="text-gray-400 text-sm mb-4">Complete compliance analytics</p>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
                    Download PDF
                  </button>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <Download className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-white mb-2">Data Export</h4>
                  <p className="text-gray-400 text-sm mb-4">Raw compliance data in CSV</p>
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
                    Download CSV
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Report Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Total Users</div>
                    <div className="text-white font-bold">12,847</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Compliance Rate</div>
                    <div className="text-green-400 font-bold">94.2%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Pending Reviews</div>
                    <div className="text-yellow-400 font-bold">156</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Blocked Users</div>
                    <div className="text-red-400 font-bold">23</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Configure Settings Modal */}
      {showConfigureModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowConfigureModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-gold-400" />
                Compliance Configuration
              </h3>
              <button
                onClick={() => setShowConfigureModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Regional Policies</h4>
                <div className="space-y-4">
                  {['United States', 'European Union', 'Asia Pacific'].map((region) => (
                    <div key={region} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <div className="text-white font-bold">{region}</div>
                        <div className="text-gray-400 text-sm">
                          {region === 'United States' ? 'Enhanced KYC Required' :
                           region === 'European Union' ? 'GDPR Compliant' :
                           'Basic KYC Required'}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-gold-500 hover:bg-gold-600 text-white text-xs rounded-lg transition-colors">
                        Configure
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-3 px-6 rounded-xl transition-all duration-300">
                  Save Changes
                </button>
                <button 
                  onClick={() => setShowConfigureModal(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Risk Monitor Modal */}
      {showMonitorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowMonitorModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Eye className="w-8 h-8 text-red-400" />
                Risk Monitoring Dashboard
              </h3>
              <button
                onClick={() => setShowMonitorModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-400">23</div>
                  <div className="text-sm text-gray-400">High Risk Users</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">156</div>
                  <div className="text-sm text-gray-400">Pending Reviews</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                  <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">1,247</div>
                  <div className="text-sm text-gray-400">Active Monitors</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Recent Risk Alerts</h4>
                <div className="space-y-3">
                  {[
                    { user: 'John Doe', alert: 'Unusual transaction pattern detected', time: '2 minutes ago', severity: 'High' },
                    { user: 'Jane Smith', alert: 'Multiple failed login attempts', time: '15 minutes ago', severity: 'Medium' },
                    { user: 'Bob Johnson', alert: 'Geographic location mismatch', time: '1 hour ago', severity: 'Low' }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border-l-4 border-red-500">
                      <div>
                        <div className="text-white font-bold">{alert.user}</div>
                        <div className="text-gray-400 text-sm">{alert.alert}</div>
                        <div className="text-gray-500 text-xs">{alert.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          alert.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {alert.severity}
                        </div>
                        <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors">
                          Investigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Approval Success Modal */}
      {showApprovalSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-green-900/90 via-green-800/90 to-green-900/90 border border-green-500/30 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">APPROVED!</h3>
              <p className="text-green-200 text-lg">
                {approvedUserName} has been successfully approved for KYC verification.
              </p>
            </motion.div>

            {/* Success particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    scale: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-900/90 border border-red-500/30 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">REJECTED</h3>
              <p className="text-red-200 text-lg">
                {rejectedUserName}'s KYC application has been rejected and requires additional documentation.
              </p>
            </motion.div>

            {/* Rejection particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-red-400 rounded-full"
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    scale: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 150}%`,
                    y: `${50 + (Math.random() - 0.5) * 150}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.2,
                    delay: 0.5 + i * 0.15,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Unblock Success Modal */}
      {showUnblockSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-green-900/90 via-green-800/90 to-green-900/90 border border-green-500/30 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">UNBLOCKED!</h3>
              <p className="text-green-200 text-lg">
                {unblockedUserName} has been successfully unblocked and can now access the platform.
              </p>
            </motion.div>

            {/* Success particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    scale: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-900/90 border border-blue-500/30 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Eye className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">UNDER REVIEW</h3>
              <p className="text-blue-200 text-lg">
                {reviewUserName}'s case has been flagged for manual review by the compliance team.
              </p>
            </motion.div>

            {/* Review particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    scale: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 150}%`,
                    y: `${50 + (Math.random() - 0.5) * 150}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.2,
                    delay: 0.5 + i * 0.15,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upgrade Success Modal */}
      {showUpgradeSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-purple-900/90 border border-purple-500/30 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <TrendingUp className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">UPGRADED!</h3>
              <p className="text-purple-200 text-lg">
                {upgradedUserName} has been successfully upgraded from {upgradeDetails.from} to {upgradeDetails.to} compliance level.
              </p>
            </motion.div>

            {/* Upgrade particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    scale: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Upgrade arrow animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute top-4 right-4 text-purple-300"
            >
              <TrendingUp className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
