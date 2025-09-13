import { ethers } from 'ethers';

export interface PlayerProfile {
  address: string;
  username: string;
  level: number;
  experience: number;
  governancePoints: number;
  title: PlayerTitle;
  achievements: Achievement[];
  stats: PlayerStats;
  createdAt: Date;
  lastActive: Date;
}

export interface PlayerStats {
  totalInvested: number;
  totalReturns: number;
  portfolioValue: number;
  assetsOwned: number;
  diversificationScore: number;
  riskScore: number;
  winRate: number;
  streakDays: number;
  transactionCount: number;
  referrals: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlockedAt: Date;
  governancePoints: number;
  category: 'INVESTMENT' | 'PORTFOLIO' | 'SOCIAL' | 'MILESTONE' | 'SPECIAL';
}

export interface PlayerTitle {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  requirements: string[];
  governancePoints: number;
  color: string;
}

export interface VirtualPortfolio {
  id: string;
  playerId: string;
  name: string;
  description: string;
  assets: VirtualAsset[];
  totalValue: number;
  dailyReturn: number;
  riskLevel: number;
  diversificationBonus: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VirtualAsset {
  id: string;
  realAssetId: string; // Links to actual RWA token
  name: string;
  type: 'real_estate' | 'precious_metals' | 'carbon_credits' | 'art_collectibles' | 'commodities';
  virtualShares: number;
  realShares: number; // Actual owned shares
  purchasePrice: number;
  currentValue: number;
  dailyYield: number;
  riskMultiplier: number;
  synergies: string[]; // Asset combinations that provide bonuses
  upgrades: AssetUpgrade[];
}

export interface AssetUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: UpgradeEffect;
  unlocked: boolean;
}

export interface UpgradeEffect {
  type: 'YIELD_BOOST' | 'RISK_REDUCTION' | 'SYNERGY_UNLOCK' | 'SPECIAL_ABILITY';
  value: number;
  duration?: number; // in days, undefined for permanent
}

export interface GameEvent {
  id: string;
  type: 'MARKET_CRASH' | 'BULL_RUN' | 'REGULATORY_CHANGE' | 'NATURAL_DISASTER' | 'INNOVATION' | 'SEASONAL';
  name: string;
  description: string;
  effects: EventEffect[];
  duration: number; // in hours
  probability: number;
  isActive: boolean;
  startTime?: Date;
}

export interface EventEffect {
  assetType: string;
  yieldModifier: number;
  riskModifier: number;
  valueModifier: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL' | 'SPECIAL';
  objectives: ChallengeObjective[];
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  participants: number;
  completed: boolean;
}

export interface ChallengeObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface ChallengeReward {
  type: 'GOVERNANCE_POINTS' | 'EXPERIENCE' | 'TITLE' | 'ACHIEVEMENT' | 'VIRTUAL_CURRENCY';
  amount: number;
  item?: string;
}

export interface Leaderboard {
  category: 'PORTFOLIO_VALUE' | 'RETURNS' | 'GOVERNANCE_POINTS' | 'DIVERSIFICATION' | 'RISK_ADJUSTED';
  timeframe: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  title: PlayerTitle;
  value: number;
  change: number; // position change from last period
  avatar?: string;
}

export class RWATycoonService {
  private players: Map<string, PlayerProfile> = new Map();
  private portfolios: Map<string, VirtualPortfolio> = new Map();
  private achievements: Achievement[] = [];
  private titles: PlayerTitle[] = [];
  private activeEvents: GameEvent[] = [];
  private challenges: Challenge[] = [];

  constructor() {
    this.initializeGameData();
    this.startGameLoop();
  }

  /**
   * Initialize player profile and link to wallet
   */
  async createPlayer(address: string, username: string): Promise<PlayerProfile> {
    const player: PlayerProfile = {
      address: address.toLowerCase(),
      username,
      level: 1,
      experience: 0,
      governancePoints: 100, // Starting points
      title: this.titles.find(t => t.id === 'newcomer') || this.getDefaultTitle(),
      achievements: [],
      stats: {
        totalInvested: 0,
        totalReturns: 0,
        portfolioValue: 0,
        assetsOwned: 0,
        diversificationScore: 0,
        riskScore: 50,
        winRate: 0,
        streakDays: 0,
        transactionCount: 0,
        referrals: 0
      },
      createdAt: new Date(),
      lastActive: new Date()
    };

    this.players.set(address.toLowerCase(), player);
    
    // Create initial virtual portfolio
    await this.createVirtualPortfolio(address, 'My First Portfolio', 'Starting investment portfolio');
    
    // Award welcome achievement
    await this.unlockAchievement(address, 'welcome_aboard');
    
    return player;
  }

  /**
   * Get or create player profile
   */
  async getPlayer(address: string): Promise<PlayerProfile> {
    const playerAddress = address.toLowerCase();
    let player = this.players.get(playerAddress);
    
    if (!player) {
      player = await this.createPlayer(address, `Player_${address.slice(-6)}`);
    }
    
    player.lastActive = new Date();
    return player;
  }

  /**
   * Create virtual portfolio from real RWA ownership
   */
  async createVirtualPortfolio(playerAddress: string, name: string, description: string): Promise<VirtualPortfolio> {
    const player = await this.getPlayer(playerAddress);
    
    // Get real RWA holdings from blockchain
    const realHoldings = await this.getRealRWAHoldings(playerAddress);
    
    const portfolio: VirtualPortfolio = {
      id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId: playerAddress,
      name,
      description,
      assets: [],
      totalValue: 0,
      dailyReturn: 0,
      riskLevel: 50,
      diversificationBonus: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Convert real holdings to virtual assets with game mechanics
    for (const holding of realHoldings) {
      const virtualAsset = await this.createVirtualAsset(holding);
      portfolio.assets.push(virtualAsset);
    }

    // Calculate portfolio metrics
    this.updatePortfolioMetrics(portfolio);
    
    this.portfolios.set(portfolio.id, portfolio);
    
    // Award achievement for portfolio creation
    if (portfolio.assets.length > 0) {
      await this.unlockAchievement(playerAddress, 'portfolio_creator');
    }

    return portfolio;
  }

  /**
   * Sync virtual portfolio with real RWA ownership
   */
  async syncPortfolioWithBlockchain(portfolioId: string): Promise<VirtualPortfolio> {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) throw new Error('Portfolio not found');

    const realHoldings = await this.getRealRWAHoldings(portfolio.playerId);
    
    // Update virtual assets based on real holdings
    for (const asset of portfolio.assets) {
      const realHolding = realHoldings.find(h => h.assetId === asset.realAssetId);
      if (realHolding) {
        asset.realShares = realHolding.shares;
        // Apply reality bonus for actually owning the asset
        asset.dailyYield *= (1 + (realHolding.shares / 1000)); // Bonus based on real ownership
      } else {
        asset.realShares = 0;
      }
    }

    this.updatePortfolioMetrics(portfolio);
    portfolio.updatedAt = new Date();

    return portfolio;
  }

  /**
   * Purchase virtual shares (requires governance points)
   */
  async purchaseVirtualShares(
    playerAddress: string, 
    portfolioId: string, 
    assetId: string, 
    shares: number
  ): Promise<{ success: boolean; cost: number; newBalance: number }> {
    const player = await this.getPlayer(playerAddress);
    const portfolio = this.portfolios.get(portfolioId);
    
    if (!portfolio || portfolio.playerId !== playerAddress) {
      throw new Error('Portfolio not found or not owned by player');
    }

    const asset = portfolio.assets.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found in portfolio');

    const cost = shares * asset.currentValue * 0.1; // 10% of asset value in governance points
    
    if (player.governancePoints < cost) {
      return { success: false, cost, newBalance: player.governancePoints };
    }

    // Execute purchase
    player.governancePoints -= cost;
    asset.virtualShares += shares;
    
    // Update stats
    player.stats.totalInvested += cost;
    player.stats.transactionCount += 1;
    
    // Award experience
    const expGained = Math.floor(cost / 10);
    await this.awardExperience(playerAddress, expGained);
    
    this.updatePortfolioMetrics(portfolio);
    
    // Check for achievements
    await this.checkPurchaseAchievements(playerAddress, asset, shares);
    
    return { success: true, cost, newBalance: player.governancePoints };
  }

  /**
   * Apply asset upgrade
   */
  async applyAssetUpgrade(
    playerAddress: string,
    portfolioId: string,
    assetId: string,
    upgradeId: string
  ): Promise<boolean> {
    const player = await this.getPlayer(playerAddress);
    const portfolio = this.portfolios.get(portfolioId);
    
    if (!portfolio || portfolio.playerId !== playerAddress) {
      throw new Error('Portfolio access denied');
    }

    const asset = portfolio.assets.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found');

    const upgrade = asset.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.unlocked) throw new Error('Upgrade not available');

    if (player.governancePoints < upgrade.cost) {
      return false;
    }

    // Apply upgrade
    player.governancePoints -= upgrade.cost;
    upgrade.unlocked = true;

    // Apply upgrade effects
    switch (upgrade.effect.type) {
      case 'YIELD_BOOST':
        asset.dailyYield *= (1 + upgrade.effect.value / 100);
        break;
      case 'RISK_REDUCTION':
        asset.riskMultiplier *= (1 - upgrade.effect.value / 100);
        break;
      case 'SYNERGY_UNLOCK':
        // Unlock new synergy combinations
        break;
    }

    this.updatePortfolioMetrics(portfolio);
    await this.unlockAchievement(playerAddress, 'upgrade_master');

    return true;
  }

  /**
   * Calculate daily returns and update player stats
   */
  async processDailyReturns(playerAddress: string): Promise<number> {
    const player = await this.getPlayer(playerAddress);
    const playerPortfolios = Array.from(this.portfolios.values())
      .filter(p => p.playerId === playerAddress);

    let totalDailyReturn = 0;

    for (const portfolio of playerPortfolios) {
      for (const asset of portfolio.assets) {
        // Base daily return
        let dailyReturn = asset.virtualShares * asset.dailyYield;
        
        // Apply reality bonus if player owns real shares
        if (asset.realShares > 0) {
          dailyReturn *= 1.5; // 50% bonus for real ownership
        }

        // Apply active event effects
        for (const event of this.activeEvents) {
          const effect = event.effects.find(e => e.assetType === asset.type);
          if (effect) {
            dailyReturn *= (1 + effect.yieldModifier / 100);
          }
        }

        // Apply synergy bonuses
        dailyReturn *= this.calculateSynergyBonus(portfolio, asset);

        totalDailyReturn += dailyReturn;
        asset.currentValue += dailyReturn / asset.virtualShares; // Update asset value
      }
      
      portfolio.dailyReturn = portfolio.assets.reduce((sum, a) => 
        sum + (a.virtualShares * a.dailyYield), 0);
      this.updatePortfolioMetrics(portfolio);
    }

    // Award governance points based on returns
    const governancePointsEarned = Math.floor(totalDailyReturn);
    player.governancePoints += governancePointsEarned;
    player.stats.totalReturns += totalDailyReturn;
    player.stats.portfolioValue = playerPortfolios.reduce((sum, p) => sum + p.totalValue, 0);

    // Update streak
    const lastActive = new Date(player.lastActive);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      player.stats.streakDays += 1;
    } else if (daysDiff > 1) {
      player.stats.streakDays = 1;
    }

    // Award experience for daily activity
    await this.awardExperience(playerAddress, 10 + player.stats.streakDays);

    // Check for daily achievements
    await this.checkDailyAchievements(playerAddress);

    return totalDailyReturn;
  }

  /**
   * Award experience and handle level ups
   */
  async awardExperience(playerAddress: string, amount: number): Promise<boolean> {
    const player = await this.getPlayer(playerAddress);
    const oldLevel = player.level;
    
    player.experience += amount;
    
    // Calculate new level (exponential curve)
    const newLevel = Math.floor(Math.sqrt(player.experience / 100)) + 1;
    
    if (newLevel > oldLevel) {
      player.level = newLevel;
      
      // Level up rewards
      const governanceBonus = newLevel * 50;
      player.governancePoints += governanceBonus;
      
      // Check for title upgrades
      await this.checkTitleUpgrades(playerAddress);
      
      // Award level achievement
      await this.unlockAchievement(playerAddress, `level_${newLevel}`);
      
      return true; // Level up occurred
    }
    
    return false;
  }

  /**
   * Unlock achievement and award rewards
   */
  async unlockAchievement(playerAddress: string, achievementId: string): Promise<boolean> {
    const player = await this.getPlayer(playerAddress);
    const achievement = this.achievements.find(a => a.id === achievementId);
    
    if (!achievement || player.achievements.some(a => a.id === achievementId)) {
      return false; // Achievement not found or already unlocked
    }

    const unlockedAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date()
    };

    player.achievements.push(unlockedAchievement);
    player.governancePoints += achievement.governancePoints;
    
    // Award experience for achievement
    await this.awardExperience(playerAddress, achievement.governancePoints);

    return true;
  }

  /**
   * Get leaderboards
   */
  getLeaderboard(category: Leaderboard['category'], timeframe: Leaderboard['timeframe']): Leaderboard {
    const entries: LeaderboardEntry[] = Array.from(this.players.values())
      .map(player => {
        let value = 0;
        switch (category) {
          case 'PORTFOLIO_VALUE':
            value = player.stats.portfolioValue;
            break;
          case 'RETURNS':
            value = player.stats.totalReturns;
            break;
          case 'GOVERNANCE_POINTS':
            value = player.governancePoints;
            break;
          case 'DIVERSIFICATION':
            value = player.stats.diversificationScore;
            break;
          case 'RISK_ADJUSTED':
            value = player.stats.totalReturns / Math.max(player.stats.riskScore, 1);
            break;
        }

        return {
          rank: 0, // Will be set after sorting
          playerId: player.address,
          username: player.username,
          title: player.title,
          value,
          change: 0, // TODO: Calculate from historical data
          avatar: undefined
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 100) // Top 100
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return {
      category,
      timeframe,
      entries,
      lastUpdated: new Date()
    };
  }

  // Private helper methods
  private async getRealRWAHoldings(address: string): Promise<Array<{assetId: string, shares: number, value: number}>> {
    // Mock implementation - in production, query blockchain for actual RWA token holdings
    return [
      { assetId: 'manhattan-office-tower', shares: 100, value: 12500 },
      { assetId: 'gold-bullion-vault', shares: 50, value: 3125 },
      { assetId: 'carbon-forest-project', shares: 200, value: 6000 }
    ];
  }

  private async createVirtualAsset(holding: {assetId: string, shares: number, value: number}): Promise<VirtualAsset> {
    // Mock asset data - in production, fetch from RWA metadata
    const assetTypes = ['real_estate', 'precious_metals', 'carbon_credits'] as const;
    const randomType = assetTypes[Math.floor(Math.random() * assetTypes.length)];

    return {
      id: `virtual_${holding.assetId}_${Date.now()}`,
      realAssetId: holding.assetId,
      name: `Virtual ${holding.assetId}`,
      type: randomType,
      virtualShares: holding.shares,
      realShares: holding.shares,
      purchasePrice: holding.value / holding.shares,
      currentValue: holding.value / holding.shares,
      dailyYield: 0.001 + Math.random() * 0.002, // 0.1-0.3% daily yield
      riskMultiplier: 0.8 + Math.random() * 0.4, // 0.8-1.2x risk
      synergies: [],
      upgrades: this.generateAssetUpgrades()
    };
  }

  private generateAssetUpgrades(): AssetUpgrade[] {
    return [
      {
        id: 'yield_boost_1',
        name: 'Efficiency Optimization',
        description: 'Increase daily yield by 25%',
        cost: 500,
        effect: { type: 'YIELD_BOOST', value: 25 },
        unlocked: false
      },
      {
        id: 'risk_reduction_1',
        name: 'Insurance Coverage',
        description: 'Reduce risk by 20%',
        cost: 750,
        effect: { type: 'RISK_REDUCTION', value: 20 },
        unlocked: false
      }
    ];
  }

  private updatePortfolioMetrics(portfolio: VirtualPortfolio): void {
    portfolio.totalValue = portfolio.assets.reduce((sum, asset) => 
      sum + (asset.virtualShares * asset.currentValue), 0);
    
    portfolio.dailyReturn = portfolio.assets.reduce((sum, asset) => 
      sum + (asset.virtualShares * asset.dailyYield), 0);
    
    // Calculate diversification bonus
    const assetTypes = new Set(portfolio.assets.map(a => a.type));
    portfolio.diversificationBonus = Math.min(assetTypes.size * 0.05, 0.25); // Max 25% bonus
    
    // Calculate risk level
    const weightedRisk = portfolio.assets.reduce((sum, asset) => {
      const weight = (asset.virtualShares * asset.currentValue) / portfolio.totalValue;
      return sum + (weight * asset.riskMultiplier * 50);
    }, 0);
    portfolio.riskLevel = Math.min(Math.max(weightedRisk, 0), 100);
  }

  private calculateSynergyBonus(portfolio: VirtualPortfolio, asset: VirtualAsset): number {
    // Simple synergy calculation - real estate + precious metals = stability bonus
    const hasRealEstate = portfolio.assets.some(a => a.type === 'real_estate' && a.id !== asset.id);
    const hasPreciousMetals = portfolio.assets.some(a => a.type === 'precious_metals' && a.id !== asset.id);
    
    if (hasRealEstate && hasPreciousMetals) {
      return 1.1; // 10% synergy bonus
    }
    
    return 1.0; // No bonus
  }

  private async checkPurchaseAchievements(playerAddress: string, asset: VirtualAsset, shares: number): Promise<void> {
    const player = await this.getPlayer(playerAddress);
    
    // First purchase achievement
    if (player.stats.transactionCount === 1) {
      await this.unlockAchievement(playerAddress, 'first_purchase');
    }
    
    // Big spender achievement
    if (shares >= 1000) {
      await this.unlockAchievement(playerAddress, 'big_spender');
    }
  }

  private async checkDailyAchievements(playerAddress: string): Promise<void> {
    const player = await this.getPlayer(playerAddress);
    
    // Streak achievements
    if (player.stats.streakDays === 7) {
      await this.unlockAchievement(playerAddress, 'week_warrior');
    } else if (player.stats.streakDays === 30) {
      await this.unlockAchievement(playerAddress, 'monthly_master');
    }
  }

  private async checkTitleUpgrades(playerAddress: string): Promise<void> {
    const player = await this.getPlayer(playerAddress);
    
    // Check if player qualifies for higher titles
    const eligibleTitles = this.titles.filter(title => {
      return this.checkTitleRequirements(player, title);
    }).sort((a, b) => b.governancePoints - a.governancePoints);
    
    if (eligibleTitles.length > 0 && eligibleTitles[0].id !== player.title.id) {
      player.title = eligibleTitles[0];
      await this.unlockAchievement(playerAddress, `title_${player.title.id}`);
    }
  }

  private checkTitleRequirements(player: PlayerProfile, title: PlayerTitle): boolean {
    // Simple requirement checking - in production, implement complex logic
    switch (title.id) {
      case 'investor':
        return player.stats.totalInvested >= 1000;
      case 'diversifier':
        return player.stats.diversificationScore >= 80;
      case 'whale':
        return player.stats.portfolioValue >= 100000;
      default:
        return false;
    }
  }

  private initializeGameData(): void {
    // Initialize achievements
    this.achievements = [
      {
        id: 'welcome_aboard',
        name: 'Welcome Aboard!',
        description: 'Join the RWA Tycoon community',
        icon: '🎉',
        rarity: 'COMMON',
        unlockedAt: new Date(),
        governancePoints: 50,
        category: 'MILESTONE'
      },
      {
        id: 'first_purchase',
        name: 'First Steps',
        description: 'Make your first virtual asset purchase',
        icon: '🏠',
        rarity: 'COMMON',
        unlockedAt: new Date(),
        governancePoints: 100,
        category: 'INVESTMENT'
      },
      {
        id: 'portfolio_creator',
        name: 'Portfolio Architect',
        description: 'Create your first virtual portfolio',
        icon: '📊',
        rarity: 'COMMON',
        unlockedAt: new Date(),
        governancePoints: 75,
        category: 'PORTFOLIO'
      }
      // Add more achievements...
    ];

    // Initialize titles
    this.titles = [
      {
        id: 'newcomer',
        name: 'Newcomer',
        description: 'Just getting started',
        icon: '🌱',
        rarity: 'COMMON',
        requirements: [],
        governancePoints: 0,
        color: '#10B981'
      },
      {
        id: 'investor',
        name: 'Smart Investor',
        description: 'Proven investment skills',
        icon: '💎',
        rarity: 'RARE',
        requirements: ['Invest 1000+ governance points'],
        governancePoints: 1000,
        color: '#3B82F6'
      }
      // Add more titles...
    ];
  }

  private getDefaultTitle(): PlayerTitle {
    return {
      id: 'newcomer',
      name: 'Newcomer',
      description: 'Just getting started in RWA investing',
      icon: '🌱',
      rarity: 'COMMON',
      requirements: [],
      governancePoints: 0,
      color: '#10B981'
    };
  }

  private startGameLoop(): void {
    // Process daily returns every 24 hours
    setInterval(async () => {
      for (const [address] of this.players) {
        try {
          await this.processDailyReturns(address);
        } catch (error) {
          console.error(`Error processing daily returns for ${address}:`, error);
        }
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Update active events every hour
    setInterval(() => {
      this.updateActiveEvents();
    }, 60 * 60 * 1000); // 1 hour
  }

  private updateActiveEvents(): void {
    // Remove expired events
    this.activeEvents = this.activeEvents.filter(event => {
      if (!event.startTime) return true;
      const elapsed = Date.now() - event.startTime.getTime();
      return elapsed < event.duration * 60 * 60 * 1000;
    });

    // Randomly trigger new events
    if (Math.random() < 0.1) { // 10% chance per hour
      this.triggerRandomEvent();
    }
  }

  private triggerRandomEvent(): void {
    const events: GameEvent[] = [
      {
        id: 'market_surge',
        type: 'BULL_RUN',
        name: 'Market Surge',
        description: 'All assets experience increased yields!',
        effects: [
          { assetType: 'real_estate', yieldModifier: 20, riskModifier: 0, valueModifier: 5 },
          { assetType: 'precious_metals', yieldModifier: 15, riskModifier: 0, valueModifier: 3 },
          { assetType: 'carbon_credits', yieldModifier: 25, riskModifier: 0, valueModifier: 8 }
        ],
        duration: 6, // 6 hours
        probability: 0.3,
        isActive: true,
        startTime: new Date()
      }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    this.activeEvents.push(randomEvent);
  }
}
