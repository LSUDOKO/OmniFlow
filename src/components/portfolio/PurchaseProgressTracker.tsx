"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Wallet, 
  Database, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Zap,
  Eye
} from 'lucide-react';

interface PurchaseStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp?: Date;
}

interface PurchaseProgressTrackerProps {
  isVisible: boolean;
  onComplete: () => void;
  assetName: string;
  tokenAmount: number;
  transactionHash?: string;
}

export default function PurchaseProgressTracker({
  isVisible,
  onComplete,
  assetName,
  tokenAmount,
  transactionHash
}: PurchaseProgressTrackerProps) {
  const [steps, setSteps] = useState<PurchaseStep[]>([
    {
      id: 'purchase',
      title: 'Purchase Initiated',
      description: 'Processing your RWA token purchase',
      icon: ShoppingCart,
      status: 'pending'
    },
    {
      id: 'wallet',
      title: 'Wallet Confirmation',
      description: 'Confirming transaction in your wallet',
      icon: Wallet,
      status: 'pending'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Processing',
      description: 'Recording transaction on Solana blockchain',
      icon: Zap,
      status: 'pending'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Update',
      description: 'Adding tokens to your portfolio',
      icon: Database,
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Purchase Complete',
      description: 'Your RWA tokens are now in your portfolio',
      icon: CheckCircle,
      status: 'pending'
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const progressSteps = async () => {
      // Step 1: Purchase initiated
      setSteps(prev => prev.map((step, index) => 
        index === 0 ? { ...step, status: 'processing', timestamp: new Date() } : step
      ));
      setCurrentStepIndex(0);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 2: Wallet confirmation
      setSteps(prev => prev.map((step, index) => {
        if (index === 0) return { ...step, status: 'completed' };
        if (index === 1) return { ...step, status: 'processing', timestamp: new Date() };
        return step;
      }));
      setCurrentStepIndex(1);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Step 3: Blockchain processing
      setSteps(prev => prev.map((step, index) => {
        if (index <= 1) return { ...step, status: 'completed' };
        if (index === 2) return { ...step, status: 'processing', timestamp: new Date() };
        return step;
      }));
      setCurrentStepIndex(2);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 4: Portfolio update
      setSteps(prev => prev.map((step, index) => {
        if (index <= 2) return { ...step, status: 'completed' };
        if (index === 3) return { ...step, status: 'processing', timestamp: new Date() };
        return step;
      }));
      setCurrentStepIndex(3);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Complete
      setSteps(prev => prev.map((step, index) => {
        if (index <= 3) return { ...step, status: 'completed' };
        if (index === 4) return { ...step, status: 'completed', timestamp: new Date() };
        return step;
      }));
      setCurrentStepIndex(4);
      
      // Auto-complete after showing final step
      setTimeout(() => {
        onComplete();
      }, 2000);
    };

    progressSteps();
  }, [isVisible, onComplete]);

  const getStepColor = (status: PurchaseStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-400/50';
      case 'processing':
        return 'text-blue-400 bg-blue-500/20 border-blue-400/50';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-400/50';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getConnectorColor = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'bg-green-400';
    if (stepIndex === currentStepIndex) return 'bg-blue-400';
    return 'bg-gray-600';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-slate-900/95 to-slate-800/90 border border-gold-400/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl backdrop-blur-sm"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ShoppingCart className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Processing Purchase</h2>
              <p className="text-gray-300">
                Purchasing {tokenAmount} tokens of {assetName}
              </p>
              {transactionHash && (
                <p className="text-xs text-gray-400 font-mono mt-2">
                  TX: {transactionHash.slice(0, 16)}...
                </p>
              )}
            </div>

            {/* Progress Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = step.status === 'completed';
                const isProcessing = step.status === 'processing';

                return (
                  <div key={step.id} className="relative">
                    <motion.div
                      className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${getStepColor(step.status)}`}
                      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
                    >
                      <div className="relative">
                        <motion.div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          animate={isProcessing ? { rotate: 360 } : {}}
                          transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        
                        {isCompleted && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CheckCircle className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-sm opacity-80">{step.description}</p>
                        {step.timestamp && (
                          <p className="text-xs opacity-60 mt-1">
                            {step.timestamp.toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      {isProcessing && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock className="w-5 h-5" />
                        </motion.div>
                      )}

                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <motion.div
                        className={`w-1 h-6 mx-10 transition-colors duration-500 ${getConnectorColor(index)}`}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: index * 0.2 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Completion Message */}
            {currentStepIndex === steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4 mb-4">
                  <h3 className="text-green-400 font-bold mb-2">🎉 Purchase Successful!</h3>
                  <p className="text-green-300 text-sm">
                    Your {tokenAmount} tokens of {assetName} have been added to your portfolio.
                  </p>
                </div>
                
                <motion.button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                  View in Portfolio
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
