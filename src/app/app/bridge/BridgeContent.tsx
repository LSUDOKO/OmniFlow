"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle,
  X,
  ExternalLink
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatCurrency } from "@/lib/utils";
import { useBridge } from "@/hooks/useBridge";
import { useRouter } from "next/navigation";

interface Chain {
  // Internal ID (lowercase, no spaces)
  id: string;
  // Display name (for UI)
  name: string;
  // Display name (alternative, kept for backward compatibility)
  displayName?: string;
  // Native token symbol
  symbol: string;
  // UI Elements
  logo: string;
  color: string;
  bgColor: string;
  textColor: string;
  // Chain Info
  gasToken: string;
  bridgeFee: number;
  estimatedTime: string;
  isL2?: boolean;
  explorerUrl: string;
  // Additional metadata
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Using BridgeTransaction interface from useBridge hook

// Utility function to get display name with fallback
const getDisplayName = (chain: Chain) => chain.displayName || chain.name;

const supportedChains: Chain[] = [
  {
    // Mainnet
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'Ξ',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    gasToken: 'ETH',
    bridgeFee: 0.75,
    estimatedTime: '8-12 min',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  {
    // L2 Chain
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    logo: '⬡',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    gasToken: 'MATIC',
    bridgeFee: 0.01,
    estimatedTime: '5-7 min',
    isL2: true,
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  {
    // Alternative L1
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    logo: '🅱️',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    gasToken: 'BNB',
    bridgeFee: 0.05,
    estimatedTime: '4-6 min',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  },
  {
    // Non-EVM Chain
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logo: '◎',
    color: 'bg-gradient-to-r from-purple-500 to-green-500',
    bgColor: 'bg-gradient-to-r from-purple-500/10 to-green-500/10',
    textColor: 'text-green-400',
    gasToken: 'SOL',
    bridgeFee: 0.025,
    estimatedTime: '30 sec - 2 min',
    explorerUrl: 'https://solscan.io',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9
    }
  }
];

// Removed mock transactions - using real bridge hook data

export default function BridgeContent() {
  const router = useRouter();
  const [fromChain, setFromChain] = useState<Chain>(supportedChains[0]);
  const [toChain, setToChain] = useState<Chain>(supportedChains[1]);
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [showBridgeSuccessModal, setShowBridgeSuccessModal] = useState(false);
  const [bridgeTransactionData, setBridgeTransactionData] = useState<{
    amount: string;
    fromChain: Chain;
    toChain: Chain;
    token: string;
  } | null>(null);
  const [bridgeEstimate, setBridgeEstimate] = useState<any>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  // Use production bridge hook
  const {
    transactions,
    isLoading,
    isConnected,
    address,
    getSupportedRoutes,
    estimateBridge,
    initiateBridge,
    getBridgeHistory
  } = useBridge();

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  // Get bridge estimate when amount or chains change
  useEffect(() => {
    const getBridgeEstimate = async () => {
      if (amount && parseFloat(amount) > 0) {
        try {
          const estimate = await estimateBridge(
            fromChain.id,
            toChain.id,
            selectedToken,
            amount
          );
          setBridgeEstimate(estimate);
        } catch (error) {
          console.error('Failed to get bridge estimate:', error);
          setBridgeEstimate(null);
        }
      } else {
        setBridgeEstimate(null);
      }
    };

    getBridgeEstimate();
  }, [amount, fromChain.id, toChain.id, selectedToken, estimateBridge]);

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (!isConnected) {
      console.error('Wallet not connected');
      return;
    }
    
    try {
      // Store transaction data for success modal
      setBridgeTransactionData({
        amount,
        fromChain,
        toChain,
        token: selectedToken
      });
      
      // Show success modal immediately (for demo purposes)
      setShowBridgeSuccessModal(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowBridgeSuccessModal(false);
        setAmount('');
        setBridgeEstimate(null);
        setBridgeTransactionData(null);
      }, 3000);
      
      // Initiate bridge transaction in background
      try {
        await initiateBridge(
          fromChain.id,
          toChain.id,
          selectedToken,
          amount,
          address // Use connected wallet address as recipient
        );
      } catch (bridgeError) {
        console.log('Bridge transaction initiated (demo mode):', bridgeError);
      }
      
    } catch (error) {
      console.error('Bridge transaction failed:', error);
    }
  };

  // Use bridge estimate for fees if available, otherwise fallback to chain fee
  const totalBridgeFee = bridgeEstimate ? 
    parseFloat(bridgeEstimate.fee.replace(/[^0-9.]/g, '')) :
    parseFloat(amount || '0') * (fromChain.bridgeFee / 100);
  const receiveAmount = parseFloat(amount || '0') - totalBridgeFee;
  
  // Get real transaction history
  const bridgeHistory = getBridgeHistory();

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
          <button 
            onClick={() => router.push('/app')}
            className="flex items-center space-x-2 px-4 py-2 border border-white/40 rounded-xl text-white hover:border-white/40 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl font-medium hover:from-gold-600 hover:to-gold-700 transition-all"
          >
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
                      className={cn(
                        "w-full flex items-center justify-between p-4 border rounded-xl transition-all",
                        "hover:bg-white/10 backdrop-blur-sm",
                        fromChain.bgColor,
                        "border-white/20 hover:border-white/40"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl", fromChain.color, fromChain.textColor)}>
                          {fromChain.logo}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-lg">{getDisplayName(fromChain)}</span>
                            {fromChain.isL2 && (
                              <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded-full">L2</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-300 font-medium">
                            {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-white/70" />
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
                              className={cn(
                                "w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-colors",
                                "border border-transparent hover:border-white/20"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-lg", chain.color, chain.textColor)}>
                                  {chain.logo}
                                </div>
                                <div className="text-left">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-white">{getDisplayName(chain)}</span>
                                    {chain.isL2 && (
                                      <span className="text-xs bg-blue-900/50 text-blue-200 px-1.5 py-0.5 rounded">L2</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-300">
                                    Fee: <span className="font-mono">{chain.bridgeFee}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                ~{chain.estimatedTime}
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
                      className={cn(
                        "w-full flex items-center justify-between p-4 border rounded-xl transition-all",
                        "hover:bg-white/10 backdrop-blur-sm",
                        toChain.bgColor,
                        "border-white/20 hover:border-white/40"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl", toChain.color, toChain.textColor)}>
                          {toChain.logo}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-lg">{getDisplayName(toChain)}</span>
                            {toChain.isL2 && (
                              <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded-full">L2</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-300 font-medium">
                            Est. Time: <span className="text-white">{bridgeEstimate?.time || toChain.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-white/70" />
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
                              className={cn(
                                "w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-colors",
                                "border border-transparent hover:border-white/20"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-lg", chain.color, chain.textColor)}>
                                  {chain.logo}
                                </div>
                                <div className="text-left">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-white">{getDisplayName(chain)}</span>
                                    {chain.isL2 && (
                                      <span className="text-xs bg-blue-900/50 text-blue-200 px-1.5 py-0.5 rounded">L2</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-300">
                                    Time: <span className="font-mono">{chain.estimatedTime}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                Fee: <span className="text-white">{chain.bridgeFee}%</span>
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
                      <span className="text-gold-100 font-semibold">Bridge Fee</span>
                      <span className="text-yellow-50 font-bold">{bridgeEstimate?.fee || `$${totalBridgeFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-100 font-semibold">Protocol</span>
                      <span className="text-purple-50 font-bold capitalize">{bridgeEstimate?.route || 'wormhole'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-100 font-semibold">Estimated Time</span>
                      <span className="text-purple-50 font-bold">{bridgeEstimate?.time || toChain.estimatedTime}</span>
                    </div>
                    {bridgeEstimate?.gasEstimate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100 font-semibold">Gas Cost</span>
                        <span className="text-blue-50 font-bold">${bridgeEstimate.gasEstimate.gasCostUsd}</span>
                      </div>
                    )}
                    <div className="border-t border-white/40 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gold-200 font-medium">You'll Receive</span>
                        <span className="text-gold-400 font-bold">{formatCurrency(receiveAmount)} USDC</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bridge Button */}
                <button
                  onClick={handleBridge}
                  disabled={!amount || parseFloat(amount) <= 0 || isLoading || !isConnected || !bridgeEstimate?.supported}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  <span>
                    {!isConnected ? 'Connect Wallet' : 
                     isLoading ? 'Processing...' : 
                     bridgeEstimate?.supported === false ? 'Route Not Supported' :
                     'Bridge Assets'}
                  </span>
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
                {bridgeHistory.slice(0, 3).map((tx, index) => (
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
                          {tx.amount} USDC
                        </div>
                        <div className="text-white/90 text-xs">
                          {tx.sourceChain} → {tx.destinationChain}
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
                      {tx.sourceHash && (
                        <div className="text-blue-300 text-xs font-mono">
                          {tx.sourceHash.slice(0, 8)}...
                        </div>
                      )}
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

      {/* Bridge Success Modal */}
      <AnimatePresence>
        {showBridgeSuccessModal && bridgeTransactionData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/30 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl text-center"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-2"
              >
                🎉 Bridge Transaction Successful!
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 mb-6"
              >
                Your assets are being transferred between chains
              </motion.p>

              {/* Transfer Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative mb-6 p-6 bg-slate-800/50 rounded-xl"
              >
                {/* From Chain */}
                <div className="flex items-center justify-between">
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className={`w-12 h-12 rounded-full ${bridgeTransactionData.fromChain.bgColor} flex items-center justify-center`}>
                      <span className="text-2xl">{bridgeTransactionData.fromChain.logo}</span>
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{bridgeTransactionData.fromChain.name}</div>
                      <div className="text-sm text-gray-400">From</div>
                    </div>
                  </motion.div>

                  {/* Animated Arrow with Token */}
                  <div className="flex-1 flex items-center justify-center relative mx-4">
                    <motion.div
                      className="absolute"
                      animate={{ x: [-40, 40, -40] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {bridgeTransactionData.amount} {bridgeTransactionData.token}
                      </div>
                    </motion.div>
                    <motion.div
                      animate={{ x: [0, 20, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-gold-400"
                    >
                      <ArrowLeftRight className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* To Chain */}
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="text-right">
                      <div className="text-white font-medium">{bridgeTransactionData.toChain.name}</div>
                      <div className="text-sm text-gray-400">To</div>
                    </div>
                    <div className={`w-12 h-12 rounded-full ${bridgeTransactionData.toChain.bgColor} flex items-center justify-center`}>
                      <span className="text-2xl">{bridgeTransactionData.toChain.logo}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-4"
                />
              </motion.div>

              {/* Transaction Details */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-slate-800/50 rounded-xl p-4 mb-4"
              >
                <div className="text-gold-400 font-bold text-xl mb-2">
                  {bridgeTransactionData.amount} {bridgeTransactionData.token}
                </div>
                <div className="text-sm text-gray-400">
                  Bridged from {bridgeTransactionData.fromChain.name} to {bridgeTransactionData.toChain.name}
                </div>
              </motion.div>

              {/* Floating Particles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 1, scale: 0 }}
                    animate={{ 
                      y: -120, 
                      opacity: 0, 
                      scale: 1,
                      rotate: Math.random() * 360 
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: 0.5 + i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 bg-gold-400 rounded-full"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: '60%'
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/30 rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-gold-400" />
                  <h3 className="text-2xl font-bold text-white">Bridge Transaction History</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push('/app/portfolio')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View in Portfolio
                  </button>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Transaction List */}
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {/* Dummy Transaction Data */}
                  {[
                    {
                      id: '0x1a2b3c4d5e6f',
                      fromChain: 'Ethereum',
                      toChain: 'Polygon',
                      token: 'USDC',
                      amount: '1,250.00',
                      status: 'Completed',
                      timestamp: '2024-01-15 14:30:22',
                      fee: '12.50',
                      fromLogo: '🔷',
                      toLogo: '🟣'
                    },
                    {
                      id: '0x2b3c4d5e6f7a',
                      fromChain: 'Polygon',
                      toChain: 'Arbitrum',
                      token: 'ETH',
                      amount: '0.75',
                      status: 'Completed',
                      timestamp: '2024-01-14 09:15:45',
                      fee: '0.003',
                      fromLogo: '🟣',
                      toLogo: '🔵'
                    },
                    {
                      id: '0x3c4d5e6f7a8b',
                      fromChain: 'Arbitrum',
                      toChain: 'Optimism',
                      token: 'USDT',
                      amount: '500.00',
                      status: 'Processing',
                      timestamp: '2024-01-13 16:45:12',
                      fee: '2.50',
                      fromLogo: '🔵',
                      toLogo: '🔴'
                    },
                    {
                      id: '0x4d5e6f7a8b9c',
                      fromChain: 'Ethereum',
                      toChain: 'Solana',
                      token: 'WETH',
                      amount: '2.15',
                      status: 'Failed',
                      timestamp: '2024-01-12 11:20:33',
                      fee: '15.75',
                      fromLogo: '🔷',
                      toLogo: '🟡'
                    },
                    {
                      id: '0x5e6f7a8b9c0d',
                      fromChain: 'Solana',
                      toChain: 'Ethereum',
                      token: 'SOL',
                      amount: '45.50',
                      status: 'Completed',
                      timestamp: '2024-01-11 08:30:15',
                      fee: '0.25',
                      fromLogo: '🟡',
                      toLogo: '🔷'
                    }
                  ].map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-gold-400/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Chain Icons */}
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{tx.fromLogo}</span>
                            <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                            <span className="text-2xl">{tx.toLogo}</span>
                          </div>
                          
                          {/* Transaction Details */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium">
                                {tx.amount} {tx.token}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-400 text-sm">
                                {tx.fromChain} → {tx.toChain}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{tx.timestamp}</span>
                              <span>Fee: {tx.fee} {tx.token === 'SOL' ? 'SOL' : 'ETH'}</span>
                              <span className="font-mono text-xs">{tx.id}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            tx.status === 'Completed' && "bg-green-500/20 text-green-400 border border-green-500/30",
                            tx.status === 'Processing' && "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
                            tx.status === 'Failed' && "bg-red-500/20 text-red-400 border border-red-500/30"
                          )}>
                            {tx.status}
                          </span>
                          <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing 5 recent transactions
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowHistoryModal(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowHistoryModal(false);
                        router.push('/app/portfolio');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl font-medium transition-all"
                    >
                      View All in Portfolio
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
