"use client";

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Wallet, Zap } from 'lucide-react';

interface SolanaWalletButtonProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export default function SolanaWalletButton({ 
  className = '', 
  variant = 'default' 
}: SolanaWalletButtonProps) {
  const { connected, publicKey, wallet } = useWallet();

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`inline-block ${className}`}
      >
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-green-500 hover:!from-purple-600 hover:!to-green-600 !text-white !font-medium !rounded-xl !px-4 !py-2 !text-sm !transition-all !duration-200" />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-block ${className}`}
    >
      <div className="relative">
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-green-500 hover:!from-purple-600 hover:!to-green-600 !text-white !font-medium !rounded-xl !px-6 !py-3 !text-base !transition-all !duration-200 !shadow-lg hover:!shadow-xl" />
        
        {connected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
          >
            <Zap className="w-2 h-2 text-white" />
          </motion.div>
        )}
      </div>
      
      {connected && publicKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-gray-400 text-center"
        >
          <div className="flex items-center justify-center gap-1">
            <Wallet className="w-3 h-3" />
            <span>{wallet?.adapter.name}</span>
          </div>
          <div className="font-mono">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
