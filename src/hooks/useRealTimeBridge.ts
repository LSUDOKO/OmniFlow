import { useState, useEffect, useCallback, useRef } from 'react';
import { RealTimeBridgeService, createRealTimeBridgeService } from '../services/realTimeBridgeService';
import { NetworkStatus, BridgeMetrics, BridgeTransfer } from '../types/bridge';

interface UseRealTimeBridgeOptions {
  network?: 'mainnet' | 'testnet';
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableWebSocket?: boolean;
}

interface UseRealTimeBridgeReturn {
  // State
  networkStatus: NetworkStatus[];
  bridgeMetrics: BridgeMetrics | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
  monitorTransfer: (transferId: string) => void;
  stopMonitoring: (transferId: string) => void;
  
  // Real-time data
  gasPrices: any[];
  tokenPrices: any[];
  
  // Connection management
  connect: () => void;
  disconnect: () => void;
}

export function useRealTimeBridge(options: UseRealTimeBridgeOptions = {}): UseRealTimeBridgeReturn {
  const {
    network = 'testnet',
    autoRefresh = true,
    refreshInterval = 30000,
    enableWebSocket = true
  } = options;

  // State
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus[]>([]);
  const [bridgeMetrics, setBridgeMetrics] = useState<BridgeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gasPrices, setGasPrices] = useState<any[]>([]);
  const [tokenPrices, setTokenPrices] = useState<any[]>([]);

  // Refs
  const serviceRef = useRef<RealTimeBridgeService | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const monitoredTransfers = useRef<Set<string>>(new Set());

  // Initialize service
  useEffect(() => {
    serviceRef.current = createRealTimeBridgeService(network);
    
    if (enableWebSocket) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [network, enableWebSocket]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        refreshData();
      }, refreshInterval);

      // Initial load
      refreshData();

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval]);

  const connect = useCallback(() => {
    if (!serviceRef.current) return;

    try {
      // Set up event listeners
      serviceRef.current.on('transferUpdate', (transfer: BridgeTransfer) => {
        console.log('🔄 Transfer update received:', transfer);
        // Emit custom event for components to listen to
        window.dispatchEvent(new CustomEvent('bridgeTransferUpdate', { detail: transfer }));
      });

      serviceRef.current.on('networkStatusUpdate', (status: NetworkStatus[]) => {
        setNetworkStatus(status);
      });

      serviceRef.current.on('metricsUpdate', (metrics: BridgeMetrics) => {
        setBridgeMetrics(metrics);
      });

      serviceRef.current.on('gasPriceUpdate', (prices: any[]) => {
        setGasPrices(prices);
      });

      serviceRef.current.on('priceUpdate', (prices: any[]) => {
        setTokenPrices(prices);
      });

      setIsConnected(true);
      setError(null);
      console.log('🔗 Real-time bridge service connected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      setIsConnected(false);
      console.error('❌ Failed to connect real-time bridge service:', err);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.dispose();
      serviceRef.current = null;
    }
    
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    setIsConnected(false);
    console.log('🔌 Real-time bridge service disconnected');
  }, []);

  const refreshData = useCallback(async () => {
    if (!serviceRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const [status, metrics, gas, prices] = await Promise.allSettled([
        serviceRef.current.getNetworkStatus(),
        serviceRef.current.getBridgeMetrics(),
        serviceRef.current.getGasPrices(),
        serviceRef.current.getTokenPrices(['ethereum', 'solana', 'matic', 'binancecoin'])
      ]);

      if (status.status === 'fulfilled') {
        setNetworkStatus(status.value);
      }

      if (metrics.status === 'fulfilled') {
        setBridgeMetrics(metrics.value);
      }

      if (gas.status === 'fulfilled') {
        setGasPrices(gas.value);
      }

      if (prices.status === 'fulfilled') {
        setTokenPrices(prices.value);
      }

      console.log('✅ Real-time data refreshed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
      console.error('❌ Failed to refresh real-time data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const monitorTransfer = useCallback((transferId: string) => {
    if (!serviceRef.current || monitoredTransfers.current.has(transferId)) return;

    monitoredTransfers.current.add(transferId);
    serviceRef.current.monitorTransfer(transferId);
    console.log(`👀 Started monitoring transfer: ${transferId}`);
  }, []);

  const stopMonitoring = useCallback((transferId: string) => {
    monitoredTransfers.current.delete(transferId);
    console.log(`🛑 Stopped monitoring transfer: ${transferId}`);
  }, []);

  return {
    // State
    networkStatus,
    bridgeMetrics,
    isLoading,
    error,
    isConnected,
    
    // Actions
    refreshData,
    monitorTransfer,
    stopMonitoring,
    
    // Real-time data
    gasPrices,
    tokenPrices,
    
    // Connection management
    connect,
    disconnect
  };
}

// Enhanced hook for bridge monitoring with notifications
export function useRealTimeBridgeMonitor() {
  const [activeTransfers, setActiveTransfers] = useState<Map<string, BridgeTransfer>>(new Map());
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    const handleTransferUpdate = (event: CustomEvent) => {
      const transfer = event.detail as BridgeTransfer;
      
      setActiveTransfers(prev => {
        const updated = new Map(prev);
        updated.set(transfer.id, transfer);
        return updated;
      });

      // Create notification based on transfer status
      const notification = {
        id: `${transfer.id}-${Date.now()}`,
        type: getNotificationType(transfer.status),
        title: getNotificationTitle(transfer.status),
        message: `Transfer ${transfer.id} is now ${transfer.status}`,
        timestamp: new Date()
      };

      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications

      // Browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }
    };

    window.addEventListener('bridgeTransferUpdate', handleTransferUpdate as EventListener);
    
    return () => {
      window.removeEventListener('bridgeTransferUpdate', handleTransferUpdate as EventListener);
    };
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    activeTransfers,
    notifications,
    requestNotificationPermission,
    clearNotifications,
    removeNotification
  };
}

// Helper functions
function getNotificationType(status: string): 'success' | 'error' | 'warning' | 'info' {
  switch (status) {
    case 'redeemed':
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'info';
  }
}

function getNotificationTitle(status: string): string {
  switch (status) {
    case 'redeemed':
    case 'completed':
      return '✅ Transfer Completed';
    case 'failed':
      return '❌ Transfer Failed';
    case 'pending':
      return '⏳ Transfer Pending';
    case 'confirmed':
      return '🔄 Transfer Confirmed';
    default:
      return '📡 Transfer Update';
  }
}
