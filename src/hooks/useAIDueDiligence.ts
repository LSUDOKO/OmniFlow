import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AIDueDiligenceService, AIDueDiligenceReport, RWAAssetMetadata, RiskAssessment, ESGScore, YieldProjection } from '../services/aiDueDiligenceService';

interface UseAIDueDiligenceOptions {
  autoCache?: boolean;
  cacheTimeout?: number; // milliseconds
  retryAttempts?: number;
  retryDelay?: number;
  enableMetrics?: boolean;
  onReportGenerated?: (report: AIDueDiligenceReport) => void;
  onError?: (error: Error) => void;
}

interface UseAIDueDiligenceReturn {
  // State
  isGenerating: boolean;
  report: AIDueDiligenceReport | null;
  error: string | null;
  progress: number; // 0-100
  currentStep: string | null;
  
  // Actions
  generateReport: (assetId: string, metadata: RWAAssetMetadata, options?: any) => Promise<AIDueDiligenceReport | null>;
  quickRiskAssessment: (metadata: RWAAssetMetadata) => Promise<RiskAssessment | null>;
  generateESGScore: (metadata: RWAAssetMetadata) => Promise<ESGScore | null>;
  projectYield: (metadata: RWAAssetMetadata) => Promise<YieldProjection | null>;
  clearReport: () => void;
  cancelGeneration: () => void;
  
  // Cache management
  getCachedReport: (assetId: string) => AIDueDiligenceReport | null;
  clearCache: () => void;
  getCacheStats: () => { size: number; hitRate: number };
  
  // Batch operations
  generateMultipleReports: (assets: Array<{ assetId: string; metadata: RWAAssetMetadata }>) => Promise<Map<string, AIDueDiligenceReport | Error>>;
}

interface CacheEntry {
  report: AIDueDiligenceReport;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface ProgressStep {
  step: string;
  progress: number;
}

// Enhanced cache with LRU eviction and metrics
class SmartCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private hitCount = 0;
  private missCount = 0;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  get(key: string, timeout: number): AIDueDiligenceReport | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.missCount++;
      return null;
    }

    if (Date.now() - entry.timestamp > timeout) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hitCount++;

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.report;
  }

  set(key: string, report: AIDueDiligenceReport): void {
    // Remove oldest entry if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      report,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  getStats() {
    const total = this.hitCount + this.missCount;
    return {
      size: this.cache.size,
      hitRate: total > 0 ? this.hitCount / total : 0,
      hitCount: this.hitCount,
      missCount: this.missCount
    };
  }
}

// Global cache instance
const globalCache = new SmartCache();
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export function useAIDueDiligence(options: UseAIDueDiligenceOptions = {}): UseAIDueDiligenceReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AIDueDiligenceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  
  const dueDiligenceService = useMemo(() => new AIDueDiligenceService(), []);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheTimeout = options.cacheTimeout || CACHE_TIMEOUT;
  const retryAttempts = options.retryAttempts || 3;
  const retryDelay = options.retryDelay || 1000;

  // Progress tracking steps
  const progressSteps: ProgressStep[] = [
    { step: 'Initializing analysis...', progress: 10 },
    { step: 'Analyzing risk factors...', progress: 25 },
    { step: 'Generating ESG scores...', progress: 40 },
    { step: 'Calculating yield projections...', progress: 55 },
    { step: 'Evaluating jurisdiction compliance...', progress: 70 },
    { step: 'Performing market analysis...', progress: 85 },
    { step: 'Finalizing report...', progress: 100 }
  ];

  // Simulate progress for better UX
  const simulateProgress = useCallback(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < progressSteps.length && isGenerating) {
        const { step, progress: stepProgress } = progressSteps[stepIndex];
        setCurrentStep(step);
        setProgress(stepProgress);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isGenerating, progressSteps]);

  const getCachedReport = useCallback((assetId: string): AIDueDiligenceReport | null => {
    return globalCache.get(assetId, cacheTimeout);
  }, [cacheTimeout]);

  const setCachedReport = useCallback((assetId: string, report: AIDueDiligenceReport) => {
    if (options.autoCache !== false) {
      globalCache.set(assetId, report);
    }
  }, [options.autoCache]);

  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    attempts: number = retryAttempts,
    delay: number = retryDelay
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (attempts > 1) {
        console.log(`🔄 Retrying operation, ${attempts - 1} attempts remaining...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryOperation(operation, attempts - 1, delay * 1.5); // Exponential backoff
      }
      throw error;
    }
  }, [retryAttempts, retryDelay]);

  const generateReport = useCallback(async (
    assetId: string, 
    metadata: RWAAssetMetadata,
    generateOptions: any = {}
  ): Promise<AIDueDiligenceReport | null> => {
    // Check if already generating
    if (isGenerating) {
      console.warn('⚠️ Report generation already in progress');
      return null;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);
      setCurrentStep('Checking cache...');

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Check cache first
      const cached = getCachedReport(assetId);
      if (cached && !generateOptions.forceRefresh) {
        console.log(`📋 Using cached due diligence report for asset ${assetId}`);
        setReport(cached);
        setProgress(100);
        setCurrentStep('Report loaded from cache');
        options.onReportGenerated?.(cached);
        return cached;
      }

      console.log(`🤖 Generating new AI due diligence report for asset ${assetId}`);
      
      // Start progress simulation
      const clearProgress = simulateProgress();

      const reportOptions = {
        includeMarketAnalysis: true,
        includeESGAnalysis: true,
        detailLevel: 'comprehensive',
        ...generateOptions
      };

      // Generate report with retry logic
      const newReport = await retryOperation(async () => {
        // Check if operation was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        return dueDiligenceService.generateDueDiligenceReport(
          assetId, 
          metadata, 
          reportOptions
        );
      });

      clearProgress();
      setReport(newReport);
      setCachedReport(assetId, newReport);
      setProgress(100);
      setCurrentStep('Report generated successfully');
      
      console.log(`✅ Due diligence report generated successfully`);
      options.onReportGenerated?.(newReport);
      
      return newReport;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate due diligence report');
      const errorMessage = error.message;
      
      console.error('Due diligence generation error:', errorMessage);
      setError(errorMessage);
      setCurrentStep('Generation failed');
      options.onError?.(error);
      
      return null;
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [
    isGenerating,
    dueDiligenceService,
    getCachedReport,
    setCachedReport,
    simulateProgress,
    retryOperation,
    options
  ]);

  const quickRiskAssessment = useCallback(async (metadata: RWAAssetMetadata): Promise<RiskAssessment | null> => {
    try {
      setError(null);
      console.log(`⚡ Performing quick risk assessment for ${metadata.name}`);
      
      const assessment = await retryOperation(() => 
        dueDiligenceService.quickRiskAssessment(metadata)
      );
      
      console.log(`✅ Risk assessment completed: ${assessment.level} (${assessment.score})`);
      return assessment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assess risk';
      console.error('Risk assessment error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [dueDiligenceService, retryOperation]);

  const generateESGScore = useCallback(async (metadata: RWAAssetMetadata): Promise<ESGScore | null> => {
    try {
      setError(null);
      console.log(`🌱 Generating ESG score for ${metadata.name}`);
      
      const esgScore = await retryOperation(() =>
        dueDiligenceService.generateESGScore(metadata)
      );
      
      console.log(`✅ ESG score generated: ${esgScore.overall}/100`);
      return esgScore;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate ESG score';
      console.error('ESG scoring error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [dueDiligenceService, retryOperation]);

  const projectYield = useCallback(async (metadata: RWAAssetMetadata): Promise<YieldProjection | null> => {
    try {
      setError(null);
      console.log(`📈 Projecting yield for ${metadata.name}`);
      
      const projection = await retryOperation(() =>
        dueDiligenceService.projectYield(metadata)
      );
      
      console.log(`✅ Yield projection: ${projection.suggestedAPY}% APY (confidence: ${Math.round(projection.confidence * 100)}%)`);
      return projection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to project yield';
      console.error('Yield projection error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [dueDiligenceService, retryOperation]);

  const generateMultipleReports = useCallback(async (
    assets: Array<{ assetId: string; metadata: RWAAssetMetadata }>
  ): Promise<Map<string, AIDueDiligenceReport | Error>> => {
    const results = new Map<string, AIDueDiligenceReport | Error>();
    const concurrencyLimit = 3; // Prevent API rate limiting
    
    console.log(`🔄 Processing ${assets.length} assets with concurrency limit of ${concurrencyLimit}`);

    // Process in batches
    for (let i = 0; i < assets.length; i += concurrencyLimit) {
      const batch = assets.slice(i, i + concurrencyLimit);
      
      const batchPromises = batch.map(async ({ assetId, metadata }) => {
        try {
          const report = await generateReport(assetId, metadata, { detailLevel: 'basic' });
          if (report) {
            results.set(assetId, report);
          } else {
            results.set(assetId, new Error('Report generation returned null'));
          }
        } catch (error) {
          results.set(assetId, error instanceof Error ? error : new Error('Unknown error'));
        }
      });

      await Promise.all(batchPromises);
    }

    return results;
  }, [generateReport]);

  const clearReport = useCallback(() => {
    setReport(null);
    setError(null);
    setProgress(0);
    setCurrentStep(null);
  }, []);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('🛑 Report generation cancelled');
    }
  }, []);

  const clearCache = useCallback(() => {
    globalCache.clear();
    console.log('🗑️ Due diligence report cache cleared');
  }, []);

  const getCacheStats = useCallback(() => {
    return globalCache.getStats();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    isGenerating,
    report,
    error,
    progress,
    currentStep,
    
    // Actions
    generateReport,
    quickRiskAssessment,
    generateESGScore,
    projectYield,
    clearReport,
    cancelGeneration,
    
    // Cache management
    getCachedReport,
    clearCache,
    getCacheStats,
    
    // Batch operations
    generateMultipleReports
  };
}

// Enhanced batch operations hook
export function useAIDueDiligenceBatch() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Map<string, AIDueDiligenceReport>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [progress, setProgress] = useState(0);
  const [currentAsset, setCurrentAsset] = useState<string | null>(null);

  const dueDiligenceService = useMemo(() => new AIDueDiligenceService(), []);

  const processBatch = useCallback(async (
    assets: Array<{ assetId: string; metadata: RWAAssetMetadata }>,
    options: {
      concurrency?: number;
      detailLevel?: 'basic' | 'comprehensive';
      onProgress?: (completed: number, total: number, currentAsset: string) => void;
      onAssetComplete?: (assetId: string, result: AIDueDiligenceReport | Error) => void;
    } = {}
  ) => {
    setIsProcessing(true);
    setResults(new Map());
    setErrors(new Map());
    setProgress(0);

    const batchResults = new Map<string, AIDueDiligenceReport>();
    const batchErrors = new Map<string, string>();
    const concurrencyLimit = options.concurrency || 2; // Conservative for Gemini API
    let completed = 0;

    console.log(`🔄 Processing batch of ${assets.length} assets with concurrency ${concurrencyLimit}`);

    // Process in chunks to manage concurrency
    const chunks = [];
    for (let i = 0; i < assets.length; i += concurrencyLimit) {
      chunks.push(assets.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
      const promises = chunk.map(async ({ assetId, metadata }) => {
        try {
          setCurrentAsset(assetId);
          
          const report = await dueDiligenceService.generateDueDiligenceReport(
            assetId,
            metadata,
            { 
              detailLevel: options.detailLevel || 'basic',
              includeMarketAnalysis: false, // Faster processing
              includeESGAnalysis: true
            }
          );
          
          batchResults.set(assetId, report);
          options.onAssetComplete?.(assetId, report);
          
          completed++;
          const progressPercent = Math.round((completed / assets.length) * 100);
          setProgress(progressPercent);
          options.onProgress?.(completed, assets.length, assetId);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          batchErrors.set(assetId, errorMessage);
          options.onAssetComplete?.(assetId, error instanceof Error ? error : new Error(errorMessage));
          
          completed++;
          const progressPercent = Math.round((completed / assets.length) * 100);
          setProgress(progressPercent);
          options.onProgress?.(completed, assets.length, assetId);
        }
      });

      await Promise.all(promises);
      
      // Update state after each chunk
      setResults(new Map(batchResults));
      setErrors(new Map(batchErrors));

      // Small delay between chunks to avoid rate limiting
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsProcessing(false);
    setCurrentAsset(null);
    console.log(`✅ Batch processing completed. Success: ${batchResults.size}, Errors: ${batchErrors.size}`);

    return { results: batchResults, errors: batchErrors };
  }, [dueDiligenceService]);

  return {
    isProcessing,
    results,
    errors,
    progress,
    currentAsset,
    processBatch
  };
}

// Performance monitoring and analytics hook
export function useAIDueDiligenceMetrics() {
  const [metrics, setMetrics] = useState({
    totalReports: 0,
    averageGenerationTime: 0,
    successRate: 0,
    cacheHitRate: 0,
    geminiUsage: 0,
    errorDistribution: {} as Record<string, number>,
    generationTimes: [] as number[],
    dailyStats: {} as Record<string, number>
  });

  const updateMetrics = useCallback((data: {
    generationTime: number;
    success: boolean;
    cacheHit: boolean;
    error?: string;
  }) => {
    setMetrics(prev => {
      const totalReports = prev.totalReports + 1;
      const successCount = data.success ? 1 : 0;
      const cacheHitCount = data.cacheHit ? 1 : 0;
      const today = new Date().toDateString();

      // Update generation times (keep last 100 for rolling average)
      const newGenerationTimes = [...prev.generationTimes, data.generationTime].slice(-100);
      const avgTime = newGenerationTimes.reduce((a, b) => a + b, 0) / newGenerationTimes.length;

      // Update error distribution
      const errorDistribution = { ...prev.errorDistribution };
      if (!data.success && data.error) {
        errorDistribution[data.error] = (errorDistribution[data.error] || 0) + 1;
      }

      // Update daily stats
      const dailyStats = { ...prev.dailyStats };
      dailyStats[today] = (dailyStats[today] || 0) + 1;

      return {
        totalReports,
        averageGenerationTime: avgTime,
        successRate: ((prev.successRate * prev.totalReports) + successCount) / totalReports,
        cacheHitRate: ((prev.cacheHitRate * prev.totalReports) + cacheHitCount) / totalReports,
        geminiUsage: prev.geminiUsage + 1,
        errorDistribution,
        generationTimes: newGenerationTimes,
        dailyStats
      };
    });
  }, []);

  const getDetailedStats = useCallback(() => {
    const recentTimes = metrics.generationTimes.slice(-20);
    const recentAvg = recentTimes.length > 0 ? 
      recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length : 0;

    return {
      ...metrics,
      recentAverageTime: recentAvg,
      totalErrors: Object.values(metrics.errorDistribution).reduce((a, b) => a + b, 0),
      topErrors: Object.entries(metrics.errorDistribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      performanceTrend: metrics.generationTimes.length > 10 ? 
        (recentAvg < metrics.averageGenerationTime ? 'improving' : 'declining') : 'stable'
    };
  }, [metrics]);

  const resetMetrics = useCallback(() => {
    setMetrics({
      totalReports: 0,
      averageGenerationTime: 0,
      successRate: 0,
      cacheHitRate: 0,
      geminiUsage: 0,
      errorDistribution: {},
      generationTimes: [],
      dailyStats: {}
    });
  }, []);

  return { 
    metrics, 
    updateMetrics, 
    getDetailedStats, 
    resetMetrics 
  };
}

// Utility hook for real-time asset monitoring
export function useAssetMonitoring(assetIds: string[]) {
  const [monitoringData, setMonitoringData] = useState<Map<string, {
    lastUpdated: Date;
    riskLevel: string;
    alerts: string[];
  }>>(new Map());

  const { quickRiskAssessment } = useAIDueDiligence();

  const startMonitoring = useCallback(async (metadata: Record<string, RWAAssetMetadata>) => {
    console.log(`📊 Starting monitoring for ${assetIds.length} assets`);
    
    for (const assetId of assetIds) {
      if (metadata[assetId]) {
        try {
          const riskAssessment = await quickRiskAssessment(metadata[assetId]);
          if (riskAssessment) {
            setMonitoringData(prev => new Map(prev.set(assetId, {
              lastUpdated: new Date(),
              riskLevel: riskAssessment.level,
              alerts: riskAssessment.level === 'HIGH' || riskAssessment.level === 'VERY_HIGH' 
                ? ['High risk detected'] : []
            })));
          }
        } catch (error) {
          console.error(`Failed to assess risk for asset ${assetId}:`, error);
        }
      }
    }
  }, [assetIds, quickRiskAssessment]);

  return {
    monitoringData,
    startMonitoring
  };
}