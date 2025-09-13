import { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  RWATycoonService, 
  PlayerProfile, 
  VirtualPortfolio, 
  Achievement, 
  Leaderboard,
  Challenge 
} from '../services/rwaTycoonService';

interface UseRWATycoonReturn {
  // Player State
  player: PlayerProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Portfolio State
  portfolios: VirtualPortfolio[];
  activePortfolio: VirtualPortfolio | null;
  
  // Game State
  leaderboards: Map<string, Leaderboard>;
  achievements: Achievement[];
  activeChallenges: Challenge[];
  
  // Actions
  initializePlayer: (username?: string) => Promise<PlayerProfile | null>;
  createPortfolio: (name: string, description: string) => Promise<VirtualPortfolio | null>;
  purchaseVirtualShares: (portfolioId: string, assetId: string, shares: number) => Promise<boolean>;
  applyUpgrade: (portfolioId: string, assetId: string, upgradeId: string) => Promise<boolean>;
  syncWithBlockchain: (portfolioId: string) => Promise<VirtualPortfolio | null>;
  claimDailyRewards: () => Promise<number>;
  
  // Utility
  refreshData: () => Promise<void>;
  getPlayerRank: (category: string) => number;
  getNextLevelProgress: () => { current: number; required: number; percentage: number };
}

// Singleton service instance
let tycoonService: RWATycoonService | null = null;

export function useRWATycoon(): UseRWATycoonReturn {
  const { address, isConnected } = useAccount();
  
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [portfolios, setPortfolios] = useState<VirtualPortfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<VirtualPortfolio | null>(null);
  const [leaderboards, setLeaderboards] = useState<Map<string, Leaderboard>>(new Map());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize service
  useEffect(() => {
    if (!tycoonService) {
      tycoonService = new RWATycoonService();
    }
  }, []);

  // Load player data when wallet connects
  useEffect(() => {
    if (isConnected && address && tycoonService) {
      loadPlayerData();
    } else {
      // Clear data when wallet disconnects
      setPlayer(null);
      setPortfolios([]);
      setActivePortfolio(null);
    }
  }, [isConnected, address]);

  const loadPlayerData = useCallback(async () => {
    if (!address || !tycoonService) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get or create player
      const playerData = await tycoonService.getPlayer(address);
      setPlayer(playerData);
      
      // Load player's portfolios
      const playerPortfolios = await loadPlayerPortfolios(address);
      setPortfolios(playerPortfolios);
      
      if (playerPortfolios.length > 0) {
        setActivePortfolio(playerPortfolios[0]);
      }
      
      // Load achievements
      setAchievements(playerData.achievements);
      
      // Load leaderboards
      await loadLeaderboards();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load player data';
      setError(errorMessage);
      console.error('Error loading player data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const loadPlayerPortfolios = async (playerAddress: string): Promise<VirtualPortfolio[]> => {
    // In production, this would query the service for player's portfolios
    // For now, we'll simulate with empty array and let user create portfolios
    return [];
  };

  const loadLeaderboards = async () => {
    if (!tycoonService) return;
    
    const categories = ['PORTFOLIO_VALUE', 'RETURNS', 'GOVERNANCE_POINTS', 'DIVERSIFICATION'] as const;
    const newLeaderboards = new Map<string, Leaderboard>();
    
    for (const category of categories) {
      const leaderboard = tycoonService.getLeaderboard(category, 'ALL_TIME');
      newLeaderboards.set(category, leaderboard);
    }
    
    setLeaderboards(newLeaderboards);
  };

  const initializePlayer = useCallback(async (username?: string): Promise<PlayerProfile | null> => {
    if (!address || !tycoonService) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const playerName = username || `Player_${address.slice(-6)}`;
      const newPlayer = await tycoonService.createPlayer(address, playerName);
      setPlayer(newPlayer);
      
      // Create initial portfolio if player has RWA holdings
      const initialPortfolio = await tycoonService.createVirtualPortfolio(
        address,
        'My RWA Empire',
        'Building wealth through tokenized real-world assets'
      );
      
      setPortfolios([initialPortfolio]);
      setActivePortfolio(initialPortfolio);
      
      return newPlayer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize player';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const createPortfolio = useCallback(async (name: string, description: string): Promise<VirtualPortfolio | null> => {
    if (!address || !tycoonService) return null;
    
    try {
      const newPortfolio = await tycoonService.createVirtualPortfolio(address, name, description);
      setPortfolios(prev => [...prev, newPortfolio]);
      
      if (!activePortfolio) {
        setActivePortfolio(newPortfolio);
      }
      
      // Refresh player data to update achievements
      await loadPlayerData();
      
      return newPortfolio;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create portfolio';
      setError(errorMessage);
      return null;
    }
  }, [address, activePortfolio, loadPlayerData]);

  const purchaseVirtualShares = useCallback(async (
    portfolioId: string, 
    assetId: string, 
    shares: number
  ): Promise<boolean> => {
    if (!address || !tycoonService) return false;
    
    try {
      const result = await tycoonService.purchaseVirtualShares(address, portfolioId, assetId, shares);
      
      if (result.success) {
        // Update player governance points
        if (player) {
          setPlayer(prev => prev ? { ...prev, governancePoints: result.newBalance } : null);
        }
        
        // Refresh portfolios
        await refreshPortfolios();
        
        return true;
      } else {
        setError('Insufficient governance points');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      return false;
    }
  }, [address, player]);

  const applyUpgrade = useCallback(async (
    portfolioId: string, 
    assetId: string, 
    upgradeId: string
  ): Promise<boolean> => {
    if (!address || !tycoonService) return false;
    
    try {
      const success = await tycoonService.applyAssetUpgrade(address, portfolioId, assetId, upgradeId);
      
      if (success) {
        // Refresh player and portfolio data
        await loadPlayerData();
        return true;
      } else {
        setError('Insufficient governance points for upgrade');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upgrade failed';
      setError(errorMessage);
      return false;
    }
  }, [address, loadPlayerData]);

  const syncWithBlockchain = useCallback(async (portfolioId: string): Promise<VirtualPortfolio | null> => {
    if (!tycoonService) return null;
    
    try {
      const updatedPortfolio = await tycoonService.syncPortfolioWithBlockchain(portfolioId);
      
      // Update portfolios state
      setPortfolios(prev => prev.map(p => p.id === portfolioId ? updatedPortfolio : p));
      
      if (activePortfolio?.id === portfolioId) {
        setActivePortfolio(updatedPortfolio);
      }
      
      return updatedPortfolio;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMessage);
      return null;
    }
  }, [activePortfolio]);

  const claimDailyRewards = useCallback(async (): Promise<number> => {
    if (!address || !tycoonService) return 0;
    
    try {
      const rewards = await tycoonService.processDailyReturns(address);
      
      // Refresh player data to show updated stats
      await loadPlayerData();
      
      return rewards;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim rewards';
      setError(errorMessage);
      return 0;
    }
  }, [address, loadPlayerData]);

  const refreshPortfolios = async () => {
    if (!address) return;
    
    const updatedPortfolios = await loadPlayerPortfolios(address);
    setPortfolios(updatedPortfolios);
    
    if (activePortfolio) {
      const updated = updatedPortfolios.find(p => p.id === activePortfolio.id);
      if (updated) {
        setActivePortfolio(updated);
      }
    }
  };

  const refreshData = useCallback(async () => {
    await loadPlayerData();
  }, [loadPlayerData]);

  const getPlayerRank = useCallback((category: string): number => {
    const leaderboard = leaderboards.get(category);
    if (!leaderboard || !player) return 0;
    
    const entry = leaderboard.entries.find(e => e.playerId === player.address);
    return entry?.rank || 0;
  }, [leaderboards, player]);

  const getNextLevelProgress = useCallback(() => {
    if (!player) return { current: 0, required: 100, percentage: 0 };
    
    const currentLevelExp = Math.pow(player.level - 1, 2) * 100;
    const nextLevelExp = Math.pow(player.level, 2) * 100;
    const required = nextLevelExp - currentLevelExp;
    const current = player.experience - currentLevelExp;
    const percentage = Math.min((current / required) * 100, 100);
    
    return { current, required, percentage };
  }, [player]);

  return {
    // Player State
    player,
    isLoading,
    error,
    
    // Portfolio State
    portfolios,
    activePortfolio,
    
    // Game State
    leaderboards,
    achievements,
    activeChallenges,
    
    // Actions
    initializePlayer,
    createPortfolio,
    purchaseVirtualShares,
    applyUpgrade,
    syncWithBlockchain,
    claimDailyRewards,
    
    // Utility
    refreshData,
    getPlayerRank,
    getNextLevelProgress
  };
}

// Utility hook for leaderboard data
export function useLeaderboard(category: string, timeframe: string = 'ALL_TIME') {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!tycoonService) return;
    
    setIsLoading(true);
    
    try {
      const data = tycoonService.getLeaderboard(
        category as any, 
        timeframe as any
      );
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category, timeframe]);

  return { leaderboard, isLoading };
}

// Achievement tracking hook
export function useAchievements() {
  const { player } = useRWATycoon();
  
  const getAchievementsByCategory = useCallback((category: string) => {
    return player?.achievements.filter(a => a.category === category) || [];
  }, [player]);

  const getRecentAchievements = useCallback((days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return player?.achievements.filter(a => a.unlockedAt >= cutoff) || [];
  }, [player]);

  const getAchievementProgress = useCallback(() => {
    if (!player) return { unlocked: 0, total: 0, percentage: 0 };
    
    // In production, this would compare against all available achievements
    const unlocked = player.achievements.length;
    const total = 50; // Mock total achievements
    const percentage = (unlocked / total) * 100;
    
    return { unlocked, total, percentage };
  }, [player]);

  return {
    achievements: player?.achievements || [],
    getAchievementsByCategory,
    getRecentAchievements,
    getAchievementProgress
  };
}
