"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeftRight,
  ArrowDown,
  Zap,
  Shield,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  ChevronDown,
  RefreshCw,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatCurrency } from "@/lib/utils";

interface Chain {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  color: string;
  gasToken: string;
  bridgeFee: number;
  estimatedTime: string;
}

interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  amount: number;
  token: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  txHash: string;
  estimatedTime: string;
}

const supportedChains: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: '🔷',
    color: 'bg-blue-500',
    gasToken: 'ETH',
    bridgeFee: 0.005,
    estimatedTime: '10-15 min'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    logo: '🟣',
    color: 'bg-purple-500',
    gasToken: 'MATIC',
    bridgeFee: 0.001,
    estimatedTime: '5-8 min'
  },
  {
    id: 'bsc',
    name: 'BSC',
    symbol: 'BNB',
    logo: '🟡',
    color: 'bg-yellow-500',
    gasToken: 'BNB',
    bridgeFee: 0.002,
    estimatedTime: '3-5 min'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logo: '🌟',
    color: 'bg-gradient-to-r from-purple-400 to-green-400',
    gasToken: 'SOL',
    bridgeFee: 0.0001,
    estimatedTime: '30 sec - 2 min'
  }
];

const mockTransactions: BridgeTransaction[] = [
  {
    id: '1',
    fromChain: 'Ethereum',
    toChain: 'Polygon',
    amount: 1000,
    token: 'USDC',
    status: 'completed',
    timestamp: '2024-01-15T10:30:00Z',
    txHash: '0x1234567890abcdef...',
    estimatedTime: '10 min'
  },
  {
    id: '2',
    fromChain: 'BSC',
    toChain: 'OneChain',
    amount: 500,
    token: 'USDT',
    status: 'pending',
    timestamp: '2024-01-15T09:15:00Z',
    txHash: '0xabcdef1234567890...',
    estimatedTime: '3 min'
  }
];

export default function BridgeContent() {
  const [fromChain, setFromChain] = useState<Chain>(supportedChains[0]);
  const [toChain, setToChain] = useState<Chain>(supportedChains[1]);
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<BridgeTransaction[]>(mockTransactions);

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    // Simulate bridge transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTransaction: BridgeTransaction = {
      id: Date.now().toString(),
      fromChain: fromChain.name,
      toChain: toChain.name,
      amount: parseFloat(amount),
      token: selectedToken,
      status: 'pending',
      timestamp: new Date().toISOString(),
      txHash: '0x' + Math.random().toString(16).substr(2, 16) + '...',
      estimatedTime: fromChain.estimatedTime
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setAmount('');
    setIsLoading(false);
  };

  const totalBridgeFee = parseFloat(amount || '0') * (fromChain.bridgeFee / 100);
  const receiveAmount = parseFloat(amount || '0') - totalBridgeFee;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
            Cross-Chain Bridge
          </h1>
          <p className="text-xl text-gray-300">Transfer assets seamlessly across different blockchains</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 border border-white/40 rounded-xl text-white hover:border-white/40 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl font-medium hover:from-gold-600 hover:to-gold-700 transition-all">
            <Activity className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bridge Interface */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Bridge Assets</h2>
              
              {/* From Chain */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-blue-100 mb-3 uppercase tracking-wider">From</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowFromDropdown(!showFromDropdown)}
                      className="w-full flex items-center justify-between p-4 bg-white/30 border border-white/40 rounded-xl hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", fromChain.color)}>
                          <span className="text-sm">{fromChain.logo}</span>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-blue-50 text-lg">{fromChain.name}</div>
                          <div className="text-sm text-blue-100 font-medium">Balance: 5,000 {selectedToken}</div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-white/90" />
                    </button>
                    
                    <AnimatePresence>
                      {showFromDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white/40 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden z-10"
                        >
                          {supportedChains.filter(chain => chain.id !== toChain.id).map((chain) => (
                            <button
                              key={chain.id}
                              onClick={() => {
                                setFromChain(chain);
                                setShowFromDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 p-4 hover:bg-white/50 transition-colors"
                            >
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", chain.color)}>
                                <span className="text-sm">{chain.logo}</span>
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-blue-300">{chain.name}</div>
                                <div className="text-sm text-blue-100">Fee: {chain.bridgeFee}%</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapChains}
                    className="p-3 bg-gradient-to-br from-gray-700/60 to-gray-600/50 hover:from-gray-600/70 hover:to-gray-500/60 border-2 border-gray-400/60 rounded-xl transition-all hover:rotate-180 duration-300 shadow-lg hover:shadow-gray-500/30"
                  >
                    <ArrowLeftRight className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* To Chain */}
                <div>
                  <label className="block text-sm font-bold text-purple-100 mb-3 uppercase tracking-wider">To</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowToDropdown(!showToDropdown)}
                      className="w-full flex items-center justify-between p-4 bg-white/30 border border-white/40 rounded-xl hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", toChain.color)}>
                          <span className="text-sm">{toChain.logo}</span>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-purple-50 text-lg">{toChain.name}</div>
                          <div className="text-sm text-purple-100 font-medium">Est. Time: {toChain.estimatedTime}</div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-white/90" />
                    </button>
                    
                    <AnimatePresence>
                      {showToDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white/40 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden z-10"
                        >
                          {supportedChains.filter(chain => chain.id !== fromChain.id).map((chain) => (
                            <button
                              key={chain.id}
                              onClick={() => {
                                setToChain(chain);
                                setShowToDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 p-4 hover:bg-white/50 transition-colors"
                            >
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", chain.color)}>
                                <span className="text-sm">{chain.logo}</span>
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-purple-300">{chain.name}</div>
                                <div className="text-sm text-purple-100">Time: {chain.estimatedTime}</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-bold text-gold-100 mb-3 uppercase tracking-wider">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full p-4 bg-gradient-to-r from-yellow-900/40 to-amber-900/30 border-2 border-gold-400/60 rounded-xl text-yellow-50 placeholder-yellow-100/90 focus:outline-none focus:ring-4 focus:ring-gold-400/60 focus:border-gold-300/80 focus:shadow-lg focus:shadow-gold-500/20 transition-all duration-300 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button className="text-gold-200 hover:text-gold-100 text-sm font-bold bg-gold-500/20 px-3 py-1 rounded-lg hover:bg-gold-500/30 transition-all">
                        MAX
                      </button>
                      <div className="text-yellow-50 font-bold text-lg">{selectedToken}</div>
                    </div>
                  </div>
                </div>

                {/* Transaction Summary */}
                {amount && parseFloat(amount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-700/50 border-2 border-slate-400/40 rounded-xl p-6 space-y-4 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-100 font-semibold">Bridge Fee ({fromChain.bridgeFee}%)</span>
                      <span className="text-yellow-50 font-bold">{formatCurrency(totalBridgeFee)} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-100 font-semibold">Estimated Time</span>
                      <span className="text-purple-50 font-bold">{toChain.estimatedTime}</span>
                    </div>
                    <div className="border-t border-white/40 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gold-200 font-medium">You'll Receive</span>
                        <span className="text-gold-400 font-bold">{formatCurrency(receiveAmount)} {selectedToken}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bridge Button */}
                <button
                  onClick={handleBridge}
                  disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  <span>{isLoading ? 'Processing...' : 'Bridge Assets'}</span>
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Transaction History & Info */}
        <div className="space-y-6">
          {/* Bridge Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Bridge Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gold-400" />
                    <span className="text-gold-200 text-sm">Total Bridged</span>
                  </div>
                  <span className="text-gold-100 font-medium">$2.4M</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm">Transactions</span>
                  </div>
                  <span className="text-blue-100 font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-green-200 text-sm">Avg Time</span>
                  </div>
                  <span className="text-green-100 font-medium">8 min</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(0, 3).map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        tx.status === 'completed' ? 'bg-green-500/20' :
                        tx.status === 'pending' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                      )}>
                        {tx.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {tx.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                        {tx.status === 'failed' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {tx.amount} {tx.token}
                        </div>
                        <div className="text-white/90 text-xs">
                          {tx.fromChain} → {tx.toChain}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-xs font-medium capitalize",
                        tx.status === 'completed' ? 'text-green-400' :
                        tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      )}>
                        {tx.status}
                      </div>
                      <div className="text-white/90 text-xs">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white text-sm font-medium">Multi-Sig Security</div>
                    <div className="text-white/90 text-xs">Protected by multiple signatures</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white text-sm font-medium">Fast Finality</div>
                    <div className="text-white/90 text-xs">Optimized for speed and security</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-gold-400" />
                  <div>
                    <div className="text-white text-sm font-medium">Low Fees</div>
                    <div className="text-white/90 text-xs">Competitive bridge rates</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
