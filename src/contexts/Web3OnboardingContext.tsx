"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { useToast } from '@chakra-ui/react';

interface OnboardingData {
  region?: string;
  locale?: string;
  walletAddress?: string;
  walletType?: string;
  socialProvider?: string;
  email?: string;
  phone?: string;
  kycLevel?: number;
  paymentMethod?: string;
  identityNFT?: any;
  hasIdentityNFT?: boolean;
  userInfo?: any;
  seedless?: boolean;
  completedSteps: string[];
}

interface Web3OnboardingContextType {
  // Onboarding state
  isOnboarding: boolean;
  onboardingData: OnboardingData;
  currentStep: string;
  
  // Web3Auth integration
  isWalletConnected: boolean;
  walletAddress: string | null;
  user: any;
  
  // Actions
  startOnboarding: () => void;
  completeOnboarding: (data: OnboardingData) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  
  // Wallet actions
  connectWallet: (provider?: string) => Promise<void>;
  connectWithEmail: (email: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  
  // Identity NFT
  mintIdentityNFT: () => Promise<any>;
  hasValidIdentity: () => boolean;
}

const Web3OnboardingContext = createContext<Web3OnboardingContextType | undefined>(undefined);

interface Web3OnboardingProviderProps {
  children: ReactNode;
}

export const Web3OnboardingProvider: React.FC<Web3OnboardingProviderProps> = ({ children }) => {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    completedSteps: []
  });
  const [currentStep, setCurrentStep] = useState('welcome');

  const toast = useToast();
  const {
    isConnected,
    user,
    wallet,
    login,
    loginWithEmail,
    logout,
    error: web3AuthError
  } = useWeb3Auth();

  // Sync Web3Auth state with onboarding
  useEffect(() => {
    if (isConnected && wallet && user) {
      setOnboardingData(prev => ({
        ...prev,
        walletAddress: wallet.address,
        walletType: 'web3auth',
        userInfo: user,
        walletConnected: true,
        seedless: true
      }));
    }
  }, [isConnected, wallet, user]);

  // Handle Web3Auth errors
  useEffect(() => {
    if (web3AuthError) {
      toast({
        title: 'Wallet Connection Error',
        description: web3AuthError,
        status: 'error',
        duration: 5000,
      });
    }
  }, [web3AuthError, toast]);

  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep('welcome');
    setOnboardingData({ completedSteps: [] });
  };

  const completeOnboarding = (data: OnboardingData) => {
    setOnboardingData(data);
    setIsOnboarding(false);
    
    // Store onboarding completion in localStorage
    localStorage.setItem('omniflow_onboarding_completed', JSON.stringify({
      completed: true,
      timestamp: Date.now(),
      data: data
    }));

    toast({
      title: 'Welcome to SolanaFlow! 🎉',
      description: 'Your Web3 onboarding is complete. You can now access all features.',
      status: 'success',
      duration: 8000,
    });
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      ...data,
      completedSteps: Array.from(new Set([
        ...(prev.completedSteps || []),
        ...(data.completedSteps || [])
      ]))
    }));
  };

  const resetOnboarding = () => {
    setIsOnboarding(false);
    setOnboardingData({ completedSteps: [] });
    setCurrentStep('welcome');
    localStorage.removeItem('omniflow_onboarding_completed');
  };

  const connectWallet = async (provider?: string) => {
    try {
      await login(provider);
      
      if (wallet) {
        updateOnboardingData({
          walletAddress: wallet.address,
          walletType: 'web3auth',
          socialProvider: provider,
          userInfo: user,
          walletConnected: true,
          seedless: true
        });

        toast({
          title: 'Wallet Connected Successfully!',
          description: `Your seedless wallet has been created${provider ? ` with ${provider}` : ''}`,
          status: 'success',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  const connectWithEmail = async (email: string) => {
    try {
      await loginWithEmail(email);
      
      if (wallet) {
        updateOnboardingData({
          walletAddress: wallet.address,
          walletType: 'web3auth',
          socialProvider: 'email',
          email: email,
          userInfo: user,
          walletConnected: true,
          seedless: true
        });

        toast({
          title: 'Wallet Created Successfully!',
          description: `Your seedless wallet has been created with email: ${email}`,
          status: 'success',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Email wallet creation error:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      await logout();
      updateOnboardingData({
        walletAddress: undefined,
        walletType: undefined,
        socialProvider: undefined,
        userInfo: undefined,
        walletConnected: false,
        seedless: false
      });

      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected successfully',
        status: 'info',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Wallet disconnection error:', error);
      throw error;
    }
  };

  const mintIdentityNFT = async () => {
    if (!wallet || !user) {
      throw new Error('Wallet and user required for Identity NFT minting');
    }

    try {
      // Mock NFT minting process
      const mockTokenId = `${Date.now()}`;
      const mockNftData = {
        tokenId: mockTokenId,
        contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d1b7',
        metadataUri: `https://ipfs.io/ipfs/QmX${mockTokenId}`,
        attributes: {
          name: user?.name || 'SolanaFlow User',
          email: user?.email || onboardingData.email,
          walletAddress: wallet.address,
          verificationLevel: 'Basic',
          issueDate: new Date().toISOString(),
          chainId: wallet.chainId,
        }
      };

      updateOnboardingData({
        identityNFT: mockNftData,
        hasIdentityNFT: true,
        verificationLevel: 'Basic'
      });

      toast({
        title: 'Identity NFT Created!',
        description: `Your Identity Passport NFT #${mockTokenId} has been minted successfully`,
        status: 'success',
        duration: 5000,
      });

      return mockNftData;
    } catch (error: any) {
      console.error('Identity NFT minting error:', error);
      throw error;
    }
  };

  const hasValidIdentity = () => {
    return !!(onboardingData.hasIdentityNFT && onboardingData.identityNFT);
  };

  // Check if user has completed onboarding on mount
  useEffect(() => {
    const stored = localStorage.getItem('omniflow_onboarding_completed');
    if (stored) {
      try {
        const { completed, data } = JSON.parse(stored);
        if (completed && data) {
          setOnboardingData(data);
        }
      } catch (error) {
        console.error('Error parsing stored onboarding data:', error);
      }
    }
  }, []);

  const contextValue: Web3OnboardingContextType = {
    // Onboarding state
    isOnboarding,
    onboardingData,
    currentStep,
    
    // Web3Auth integration
    isWalletConnected: isConnected,
    walletAddress: wallet?.address || null,
    user,
    
    // Actions
    startOnboarding,
    completeOnboarding,
    updateOnboardingData,
    resetOnboarding,
    
    // Wallet actions
    connectWallet,
    connectWithEmail,
    disconnectWallet,
    
    // Identity NFT
    mintIdentityNFT,
    hasValidIdentity,
  };

  return (
    <Web3OnboardingContext.Provider value={contextValue}>
      {children}
    </Web3OnboardingContext.Provider>
  );
};

export const useWeb3Onboarding = (): Web3OnboardingContextType => {
  const context = useContext(Web3OnboardingContext);
  if (context === undefined) {
    throw new Error('useWeb3Onboarding must be used within a Web3OnboardingProvider');
  }
  return context;
};

export default Web3OnboardingContext;
