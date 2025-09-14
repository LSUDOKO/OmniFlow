"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Globe,
  FileText,
  Eye,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  MapPin,
  Flag,
  UserCheck,
  Ban,
  Activity,
  Settings,
  Download,
  RefreshCw,
  Info,
  XCircle
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
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
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
                    Review Queue
                  </button>
                </div>
                <div className="bg-white/5 rounded-2xl p-6">
                  <Ban className="w-12 h-12 text-red-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Manage Restrictions</h4>
                  <p className="text-gray-400 text-sm mb-4">Add or remove user restrictions and blacklists</p>
                  <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
                    Manage Access
                  </button>
                </div>
                <div className="bg-white/5 rounded-2xl p-6">
                  <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Upgrade Levels</h4>
                  <p className="text-gray-400 text-sm mb-4">Process compliance level upgrades</p>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 px-4 rounded-xl transition-all duration-300">
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
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
          <Settings className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Compliance Settings</h3>
          <p className="text-gray-400 text-sm mb-4">Configure regional policies and thresholds</p>
          <button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </button>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
          <Ban className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Risk Management</h3>
          <p className="text-gray-400 text-sm mb-4">Monitor and manage high-risk users</p>
          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Monitor
          </button>
        </div>
      </motion.div>
    </div>
  );
}
