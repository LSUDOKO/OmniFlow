"use client";

import { useState, useEffect, useCallback } from 'react';
import { enhancedWeb3AuthService, UserInfo, WalletInfo } from '../lib/web3auth-enhanced';
import { IProvider } from '@web3auth/base';

interface UseWeb3AuthReturn {
  // State
  isInitialized: boolean;
  isConnected: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  wallet: WalletInfo | null;
  provider: IProvider | null;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (loginProvider?: string) => Promise<void>;
  loginWithEmail: (email?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchChain: (chainKey: string) => Promise<void>;
  refreshWalletInfo: () => Promise<void>;

  // Utilities
  getSupportedChains: () => any;
  getCurrentChain: () => string;
}

export const useWeb3Auth = (): UseWeb3AuthReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize Web3Auth
  const initialize = useCallback(async () => {
    if (isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Initializing Web3Auth...');
      await enhancedWeb3AuthService.init();
      
      setIsInitialized(true);
      setIsConnected(enhancedWeb3AuthService.isConnected());
      setProvider(enhancedWeb3AuthService.getProvider());
      
      // If already connected, get user info and wallet info
      if (enhancedWeb3AuthService.isConnected()) {
        await refreshUserInfo();
        await refreshWalletInfo();
      }
      
      console.log('✅ Web3Auth initialized successfully');
    } catch (err: any) {
      console.error('❌ Web3Auth initialization failed:', err);
      setError(err.message || 'Failed to initialize Web3Auth');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Login with social provider or email
  const login = useCallback(async (loginProvider?: string) => {
    if (!isInitialized) {
      throw new Error('Web3Auth not initialized. Call initialize() first.');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔐 Logging in with provider:', loginProvider || 'default');
      const web3authProvider = await enhancedWeb3AuthService.login(loginProvider);
      
      setProvider(web3authProvider);
      setIsConnected(true);
      
      // Get user and wallet information
      await refreshUserInfo();
      await refreshWalletInfo();
      
      console.log('✅ Login successful');
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Seamless email login (passwordless)
  const loginWithEmail = useCallback(async (email?: string) => {
    if (!isInitialized) {
      throw new Error('Web3Auth not initialized. Call initialize() first.');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📧 Logging in with email:', email || 'passwordless');
      
      // Use email_passwordless login type
      const web3authProvider = await enhancedWeb3AuthService.login('email_passwordless');
      
      setProvider(web3authProvider);
      setIsConnected(true);
      
      // Get user and wallet information
      await refreshUserInfo();
      await refreshWalletInfo();
      
      console.log('✅ Email login successful');
    } catch (err: any) {
      console.error('❌ Email login failed:', err);
      setError(err.message || 'Email login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await enhancedWeb3AuthService.logout();
      
      // Reset state
      setIsConnected(false);
      setUser(null);
      setWallet(null);
      setProvider(null);
      
      console.log('✅ Logout successful');
    } catch (err: any) {
      console.error('❌ Logout failed:', err);
      setError(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch blockchain network
  const switchChain = useCallback(async (chainKey: string) => {
    if (!provider) {
      throw new Error('No provider available');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await enhancedWeb3AuthService.switchChain(chainKey as any);
      
      // Refresh wallet info after chain switch
      await refreshWalletInfo();
      
      console.log('✅ Chain switched to:', chainKey);
    } catch (err: any) {
      console.error('❌ Chain switch failed:', err);
      setError(err.message || 'Chain switch failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  // Refresh user information
  const refreshUserInfo = useCallback(async () => {
    if (!isConnected) return;

    try {
      const userInfo = await enhancedWeb3AuthService.getUserInfo();
      setUser(userInfo);
    } catch (err: any) {
      console.error('❌ Failed to get user info:', err);
      setError(err.message || 'Failed to get user info');
    }
  }, [isConnected]);

  // Refresh wallet information
  const refreshWalletInfo = useCallback(async () => {
    if (!provider) return;

    try {
      const walletInfo = await enhancedWeb3AuthService.getWalletInfo();
      setWallet(walletInfo);
    } catch (err: any) {
      console.error('❌ Failed to get wallet info:', err);
      setError(err.message || 'Failed to get wallet info');
    }
  }, [provider]);

  // Utility function to refresh wallet info
  const refreshWalletInfoPublic = useCallback(async () => {
    await refreshWalletInfo();
  }, [refreshWalletInfo]);

  // Get supported chains
  const getSupportedChains = useCallback(() => {
    return enhancedWeb3AuthService.getSupportedChains();
  }, []);

  // Get current chain
  const getCurrentChain = useCallback(() => {
    return enhancedWeb3AuthService.getCurrentChain();
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    // State
    isInitialized,
    isConnected,
    isLoading,
    user,
    wallet,
    provider,
    error,

    // Actions
    initialize,
    login,
    loginWithEmail,
    logout,
    switchChain,
    refreshWalletInfo: refreshWalletInfoPublic,

    // Utilities
    getSupportedChains,
    getCurrentChain,
  };
};

export default useWeb3Auth;
