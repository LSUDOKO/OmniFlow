'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Shield,
  Users,
  Cpu,
  BarChart3,
  CheckCircle,
  Zap,
  Globe,
  Lock,
  Star,
  Brain
} from 'lucide-react';
import AIMatchingDashboard from '../../../components/ai-matching/AIMatchingDashboard';

const AIMatchingContent = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Brain className="w-6 h-6" />
          </div>
          <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            AI-Powered Matching
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Discover Your Perfect Investment Matches with AI Intelligence
        </h1>
        
        <p className="text-lg opacity-90 mb-6 max-w-3xl">
          Our advanced AI algorithms analyze your risk profile, investment goals, and preferences 
          to recommend the most suitable real-world assets for your portfolio.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">87%</div>
            <div className="text-sm opacity-80">Matching Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm opacity-80">Active Investors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">100+</div>
            <div className="text-sm opacity-80">Available Assets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm opacity-80">Investor Clusters</div>
          </div>
        </div>
      </motion.div>

      {/* How AI Matching Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How AI Matching Works</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our sophisticated matching engine uses machine learning algorithms to analyze multiple 
            dimensions of your investment profile and match you with optimal opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-6 shadow-lg border border-white/10"
          >
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Investor Profiling</h3>
            <p className="text-gray-300 mb-4">
              Advanced clustering algorithms group investors based on risk tolerance, 
              preferences, demographics, and behavior patterns.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Risk assessment & tolerance analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Investment preference mapping
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Behavioral pattern recognition
              </li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-6 shadow-lg border border-white/10"
          >
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Smart Matching</h3>
            <p className="text-gray-300 mb-4">
              Multi-factor recommendation engine that considers risk alignment, 
              financial fit, geographic preferences, and time horizons.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Multi-dimensional scoring algorithm
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Real-time confidence scoring
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Personalized reasoning & warnings
              </li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-6 shadow-lg border border-white/10"
          >
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Continuous Learning</h3>
            <p className="text-gray-300 mb-4">
              Machine learning models that improve over time based on user feedback, 
              investment outcomes, and market performance.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Feedback-driven improvements
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Performance-based adjustments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Market trend adaptation
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Key Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 rounded-xl p-8 mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose AI-Powered Matching?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Experience the future of investment discovery with our cutting-edge AI technology 
            that delivers personalized, data-driven recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-yellow-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Lightning-Fast Analysis</h3>
                <p className="text-gray-700">
                  Process thousands of investment opportunities in seconds, analyzing complex 
                  relationships between your profile and available assets.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Risk-Aligned Recommendations</h3>
                <p className="text-gray-700">
                  Every recommendation is carefully calibrated to your risk tolerance, ensuring 
                  investments align with your comfort zone and financial goals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <BarChart3 className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Data-Driven Insights</h3>
                <p className="text-gray-700">
                  Leverage comprehensive analytics including performance metrics, market trends, 
                  and predictive modeling for informed decision-making.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Globe className="w-6 h-6 text-purple-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Global Asset Coverage</h3>
                <p className="text-gray-700">
                  Access investment opportunities across multiple asset classes, geographic regions, 
                  and market segments from a single platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Cpu className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Intelligent Clustering</h3>
                <p className="text-gray-700">
                  Benefit from collective intelligence by being grouped with similar investors, 
                  enabling better benchmarking and strategy optimization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Privacy-First Design</h3>
                <p className="text-gray-700">
                  Your investment data and preferences are protected with enterprise-grade security 
                  while still enabling personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <AIMatchingDashboard />
      </motion.div>

      {/* Technical Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 text-white rounded-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Built with cutting-edge AI and machine learning technologies for maximum 
            accuracy and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
            <div className="text-2xl font-bold text-blue-400 mb-2">K-Means</div>
            <div className="text-sm text-gray-300 mb-2">Clustering Algorithm</div>
            <div className="text-xs text-gray-400">
              Advanced unsupervised learning for investor segmentation
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
            <div className="text-2xl font-bold text-green-400 mb-2">Multi-Factor</div>
            <div className="text-sm text-gray-300 mb-2">Scoring Engine</div>
            <div className="text-xs text-gray-400">
              Weighted algorithm considering 5+ matching dimensions
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
            <div className="text-2xl font-bold text-purple-400 mb-2">Real-Time</div>
            <div className="text-sm text-gray-300 mb-2">Processing</div>
            <div className="text-xs text-gray-400">
              Instant recommendations with live data updates
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
            <div className="text-2xl font-bold text-orange-400 mb-2">Adaptive</div>
            <div className="text-sm text-gray-300 mb-2">Learning</div>
            <div className="text-xs text-gray-400">
              Continuous improvement through feedback loops
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Asset Coverage</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Real Estate & REITs</li>
                <li>• Carbon Credits & ESG</li>
                <li>• Precious Metals</li>
                <li>• Renewable Energy</li>
                <li>• Infrastructure Projects</li>
                <li>• Art & Collectibles</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Matching Factors</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Risk Tolerance Alignment</li>
                <li>• Financial Capacity Fit</li>
                <li>• Geographic Preferences</li>
                <li>• Time Horizon Matching</li>
                <li>• Sustainability Focus</li>
                <li>• Liquidity Requirements</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">AI Capabilities</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Behavioral Pattern Analysis</li>
                <li>• Predictive Risk Modeling</li>
                <li>• Performance Forecasting</li>
                <li>• Sentiment Analysis</li>
                <li>• Market Trend Recognition</li>
                <li>• Anomaly Detection</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIMatchingContent;
