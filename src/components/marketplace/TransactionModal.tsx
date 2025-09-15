"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  price: number;
  pricePerToken: number;
  image: string;
  yield: number;
  available: number;
  totalSupply: number;
  description: string;
  verified: boolean;
  chain: string;
  marketCap: string;
  liquidity: string;
  riskScore: string;
  aiScore: number;
  compliance: string;
}

interface TransactionModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<boolean>;
}

export default function TransactionModal({
  asset,
  isOpen,
  onClose,
  onConfirm,
}: TransactionModalProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [purchaseAmount, setPurchaseAmount] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      // Reset status when modal is closed
      setTimeout(() => setStatus('idle'), 300);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setStatus('pending');
    const success = await onConfirm(purchaseAmount);
    setStatus(success ? 'success' : 'failed');
  };

  const renderContent = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Processing Transaction</h3>
            <p className="text-gray-400">Please confirm in your wallet...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Transaction Successful!</h3>
            <p className="text-gray-400">You have purchased tokens for {asset.name}.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              View in Portfolio
            </button>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Transaction Failed</h3>
            <p className="text-gray-400">Something went wrong. Please try again.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        );
      default: // 'idle'
        return (
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Purchase</h3>
            <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Asset:</span>
                <span className="text-white font-medium">{asset.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Price per Token:</span>
                <span className="text-white font-bold">${asset.pricePerToken.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setPurchaseAmount(Math.max(1, purchaseAmount - 1))}
                    className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-white font-medium w-12 text-center">{purchaseAmount}</span>
                  <button 
                    onClick={() => setPurchaseAmount(Math.min(asset.available, purchaseAmount + 1))}
                    className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Cost:</span>
                  <span className="text-gold-400 font-bold text-xl">${(asset.pricePerToken * purchaseAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              You are about to purchase {purchaseAmount} token{purchaseAmount > 1 ? 's' : ''} of this asset. This will be added to your portfolio automatically upon successful purchase.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
              >
                Purchase ${(asset.pricePerToken * purchaseAmount).toLocaleString()} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-800 rounded-xl p-8 border border-gray-700 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
