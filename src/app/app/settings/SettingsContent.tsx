"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Zap,
  Database,
  Key,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

const settingsCategories = [
  {
    id: 'profile',
    name: 'Profile & Account',
    icon: User,
    color: 'text-blue-400'
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    icon: Shield,
    color: 'text-green-400'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    color: 'text-yellow-400'
  },
  {
    id: 'appearance',
    name: 'Appearance',
    icon: Palette,
    color: 'text-purple-400'
  },
  {
    id: 'preferences',
    name: 'Preferences',
    icon: Settings,
    color: 'text-gold-400'
  }
];

export default function SettingsContent() {
  const [activeCategory, setActiveCategory] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const { address, isConnected } = useAccount();

  const ProfileSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <User className="w-6 h-6 text-blue-400" />
          Profile Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-blue-100 mb-2">Display Name</label>
            <input
              type="text"
              placeholder="Enter your display name"
              className="w-full p-3 bg-white/20 border-2 border-blue-400/50 rounded-xl text-blue-50 placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-300/80 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-100 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full p-3 bg-white/20 border-2 border-blue-400/50 rounded-xl text-blue-50 placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-300/80 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-100 mb-2">Wallet Address</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={address || "Not connected"}
                disabled
                className="flex-1 p-3 bg-gray-700/50 border-2 border-gray-500/50 rounded-xl text-gray-300 cursor-not-allowed"
              />
              <button className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-400/50 rounded-xl transition-all">
                <Download className="w-5 h-5 text-blue-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SecuritySettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-400" />
          Security Settings
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-bold text-green-100">Two-Factor Authentication</div>
                <div className="text-sm text-green-200">Add an extra layer of security</div>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-yellow-400" />
                <div className="font-bold text-yellow-100">Private Key</div>
              </div>
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-lg transition-all"
              >
                {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm font-medium text-yellow-200">
                  {showPrivateKey ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>
            <div className="font-mono text-sm p-3 bg-black/30 rounded-lg border border-yellow-400/30">
              {showPrivateKey ? '0x1234567890abcdef...' : '••••••••••••••••••••••••••••••••'}
            </div>
            <div className="flex items-center space-x-2 mt-3 text-xs text-yellow-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Never share your private key with anyone</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-400/50 rounded-xl transition-all">
              <Download className="w-5 h-5 text-green-300" />
              <span className="font-medium text-green-200">Export Wallet</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-400/50 rounded-xl transition-all">
              <Trash2 className="w-5 h-5 text-red-300" />
              <span className="font-medium text-red-200">Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const NotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Bell className="w-6 h-6 text-yellow-400" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { id: 'transactions', label: 'Transaction Updates', desc: 'Get notified about transaction status', icon: Zap },
            { id: 'security', label: 'Security Alerts', desc: 'Important security notifications', icon: Shield },
            { id: 'marketing', label: 'Marketing Updates', desc: 'Product updates and announcements', icon: Mail },
            { id: 'mobile', label: 'Mobile Push', desc: 'Push notifications on mobile devices', icon: Smartphone }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="font-bold text-yellow-100">{item.label}</div>
                    <div className="text-sm text-yellow-200">{item.desc}</div>
                  </div>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  const AppearanceSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Palette className="w-6 h-6 text-purple-400" />
          Appearance & Theme
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              <div>
                <div className="font-bold text-purple-100">Dark Mode</div>
                <div className="text-sm text-purple-200">Toggle between light and dark themes</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
            <div className="flex items-center space-x-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              <div>
                <div className="font-bold text-purple-100">Sound Effects</div>
                <div className="text-sm text-purple-200">Enable UI sound feedback</div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-purple-100 mb-3">Theme Color</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'Gold', color: 'bg-gradient-to-br from-yellow-400 to-yellow-600' },
                { name: 'Blue', color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
                { name: 'Purple', color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
                { name: 'Green', color: 'bg-gradient-to-br from-green-400 to-green-600' }
              ].map((theme) => (
                <button
                  key={theme.name}
                  className={`h-12 rounded-xl ${theme.color} hover:scale-105 transition-transform border-2 border-white/20 hover:border-white/40`}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const PreferencesSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Settings className="w-6 h-6 text-gold-400" />
          General Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2">Default Currency</label>
            <select className="w-full p-3 bg-white/20 border-2 border-gold-400/50 rounded-xl text-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:border-gold-300/80 transition-all">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2">Language</label>
            <select className="w-full p-3 bg-white/20 border-2 border-gold-400/50 rounded-xl text-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:border-gold-300/80 transition-all">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2">Time Zone</label>
            <select className="w-full p-3 bg-white/20 border-2 border-gold-400/50 rounded-xl text-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:border-gold-300/80 transition-all">
              <option value="UTC">UTC - Coordinated Universal Time</option>
              <option value="EST">EST - Eastern Standard Time</option>
              <option value="PST">PST - Pacific Standard Time</option>
              <option value="GMT">GMT - Greenwich Mean Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Database className="w-6 h-6 text-gold-400" />
          Data & Storage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-gold-500/20 hover:bg-gold-500/30 border-2 border-gold-400/50 rounded-xl transition-all">
            <Upload className="w-5 h-5 text-gold-300" />
            <span className="font-medium text-gold-200">Import Data</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-gold-500/20 hover:bg-gold-500/30 border-2 border-gold-400/50 rounded-xl transition-all">
            <Download className="w-5 h-5 text-gold-300" />
            <span className="font-medium text-gold-200">Export Data</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-400/50 rounded-xl transition-all">
            <RefreshCw className="w-5 h-5 text-blue-300" />
            <span className="font-medium text-blue-200">Reset Settings</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-400/50 rounded-xl transition-all">
            <Trash2 className="w-5 h-5 text-red-300" />
            <span className="font-medium text-red-200">Clear Cache</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'profile': return <ProfileSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'appearance': return <AppearanceSettings />;
      case 'preferences': return <PreferencesSettings />;
      default: return <ProfileSettings />;
    }
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
            Settings
          </h1>
          <p className="text-lg text-gray-300">
            Customize your OmniFlow experience and manage your account preferences
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
            <div className="space-y-2">
              {settingsCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      activeCategory === category.id
                        ? 'bg-gold-500/20 border-2 border-gold-400/50 text-gold-200'
                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeCategory === category.id ? 'text-gold-400' : category.color}`} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
