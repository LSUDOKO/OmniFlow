"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { enhancedWeb3AuthService, IProvider, UserInfo, WalletInfo } from '@/lib/web3auth-enhanced';

interface WalletContextType {
  provider: IProvider | null;
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  isLoading: boolean;
  userInfo: UserInfo | null;
  walletInfo: WalletInfo | null;
  currentChain: string;
  supportedChains: any;
  login: (provider?: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<UserInfo>;
  getWalletInfo: () => Promise<WalletInfo>;
  switchChain: (chainKey: string) => Promise<void>;
  autoConnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [currentChain, setCurrentChain] = useState<string>("ethereum");
  const [supportedChains] = useState(enhancedWeb3AuthService.getSupportedChains());

  useEffect(() => {
    const init = async () => {
      try {
        await enhancedWeb3AuthService.init();
        if (enhancedWeb3AuthService.isConnected()) {
          const web3authProvider = enhancedWeb3AuthService.getProvider();
          setProvider(web3authProvider);
          await fetchWalletData(web3authProvider);
          await fetchUserInfo();
          setCurrentChain(enhancedWeb3AuthService.getCurrentChain());
        }
      } catch (error) {
        console.error("Failed to initialize wallet:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const fetchWalletData = async (p: IProvider | null) => {
    if (!p) return;
    try {
      const walletData = await enhancedWeb3AuthService.getWalletInfo();
      setWalletInfo(walletData);
      setAddress(walletData.address);
      setBalance(walletData.balance);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const user = await enhancedWeb3AuthService.getUserInfo();
      setUserInfo(user);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const login = async (loginProvider?: string) => {
    setIsLoading(true);
    try {
      const web3authProvider = await enhancedWeb3AuthService.login(loginProvider);
      setProvider(web3authProvider);
      await fetchWalletData(web3authProvider);
      await fetchUserInfo();
      setCurrentChain(enhancedWeb3AuthService.getCurrentChain());
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await enhancedWeb3AuthService.logout();
      setProvider(null);
      setAddress(null);
      setBalance(null);
      setUserInfo(null);
      setWalletInfo(null);
      setIsConnected(false);
      setCurrentChain("ethereum");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (): Promise<UserInfo> => {
    return await enhancedWeb3AuthService.getUserInfo();
  };

  const getWalletInfo = async (): Promise<WalletInfo> => {
    return await enhancedWeb3AuthService.getWalletInfo();
  };

  const switchChain = async (chainKey: string) => {
    setIsLoading(true);
    try {
      await enhancedWeb3AuthService.switchChain(chainKey as any);
      setCurrentChain(chainKey);
      // Refresh wallet data after chain switch
      if (provider) {
        await fetchWalletData(provider);
      }
    } catch (error) {
      console.error("Failed to switch chain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const autoConnect = async () => {
    if (enhancedWeb3AuthService.isConnected()) {
      const web3authProvider = enhancedWeb3AuthService.getProvider();
      setProvider(web3authProvider);
      await fetchWalletData(web3authProvider);
      await fetchUserInfo();
      setCurrentChain(enhancedWeb3AuthService.getCurrentChain());
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        provider, 
        address, 
        balance, 
        isConnected, 
        isLoading, 
        userInfo,
        walletInfo,
        currentChain,
        supportedChains,
        login, 
        logout, 
        getUserInfo,
        getWalletInfo,
        switchChain,
        autoConnect
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
