import { useState, useCallback, useEffect } from 'react';
import { AIDueDiligenceService, AIDueDiligenceReport, RWAAssetMetadata, RiskAssessment, ESGScore, YieldProjection } from '../services/aiDueDiligenceService';

interface UseAIDueDiligenceOptions {
  autoCache?: boolean;
  cacheTimeout?: number; // milliseconds
  preferredProvider?: 'openai' | 'claude';
}

interface UseAIDueDiligenceReturn {
  // State
  isGenerating: boolean;
  report: AIDueDiligenceReport | null;
  error: string | null;
  
  // Actions
  generateReport: (assetId: string, metadata: RWAAssetMetadata, options?: any) => Promise<AIDueDiligenceReport | null>;
  quickRiskAssessment: (metadata: RWAAssetMetadata) => Promise<RiskAssessment | null>;
  generateESGScore: (metadata: RWAAssetMetadata) => Promise<ESGScore | null>;
  projectYield: (metadata: RWAAssetMetadata) => Promise<YieldProjection | null>;
  clearReport: () => void;
  
  // Cache management
  getCachedReport: (assetId: string) => AIDueDiligenceReport | null;
  clearCache: () => void;
}

// Cache management
const reportCache = new Map<string, { report: AIDueDiligenceReport; timestamp: number }>();
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export function useAIDueDiligence(options: UseAIDueDiligenceOptions = {}): UseAIDueDiligenceReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AIDueDiligenceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const dueDiligenceService = new AIDueDiligenceService();
  const cacheTimeout = options.cacheTimeout || CACHE_TIMEOUT;

  // Clear expired cache entries
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      for (const [key, value] of reportCache.entries()) {
        if (now - value.timestamp > cacheTimeout) {
          reportCache.delete(key);
        }
      }
    };

    const interval = setInterval(cleanup, 60000); // Clean every minute
    return () => clearInterval(interval);
  }, [cacheTimeout]);

  const getCachedReport = useCallback((assetId: string): AIDueDiligenceReport | null => {
    const cached = reportCache.get(assetId);
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      return cached.report;
    }
    return null;
  }, [cacheTimeout]);

  const setCachedReport = useCallback((assetId: string, report: AIDueDiligenceReport) => {
    if (options.autoCache !== false) {
      reportCache.set(assetId, { report, timestamp: Date.now() });
    }
  }, [options.autoCache]);

  const generateReport = useCallback(async (
    assetId: string, 
    metadata: RWAAssetMetadata,
    generateOptions: any = {}
  ): Promise<AIDueDiligenceReport | null> => {
    try {
      setIsGenerating(true);
      setError(null);

      // Check cache first
      const cached = getCachedReport(assetId);
      if (cached && !generateOptions.forceRefresh) {
        console.log(`📋 Using cached due diligence report for asset ${assetId}`);
        setReport(cached);
        return cached;
      }

      console.log(`🤖 Generating new AI due diligence report for asset ${assetId}`);
      
      const reportOptions = {
        provider: options.preferredProvider,
        includeMarketAnalysis: true,
        includeESGAnalysis: true,
        detailLevel: 'comprehensive',
        ...generateOptions
      };

      const newReport = await dueDiligenceService.generateDueDiligenceReport(
        assetId, 
        metadata, 
        reportOptions
      );

      setReport(newReport);
      setCachedReport(assetId, newReport);
      
      console.log(`✅ Due diligence report generated successfully`);
      return newReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate due diligence report';
      console.error('Due diligence generation error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [dueDiligenceService, getCachedReport, setCachedReport, options.preferredProvider]);

  const quickRiskAssessment = useCallback(async (metadata: RWAAssetMetadata): Promise<RiskAssessment | null> => {
    try {
      setError(null);
      console.log(`⚡ Performing quick risk assessment for ${metadata.name}`);
      
      const assessment = await dueDiligenceService.quickRiskAssessment(metadata);
      console.log(`✅ Risk assessment completed: ${assessment.level} (${assessment.score})`);
      
      return assessment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assess risk';
      console.error('Risk assessment error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [dueDiligenceService]);

  const generateESGScore = useCallback(async (metadata: RWAAssetMetadata): Promise<ESGScore | null> => {
    try {
      setError(null);
      console.log(`🌱 Generating ESG score for ${metadata.name}`);
      
      const esgScore = await dueDiligenceService.generateESGScore(metadata);
      console.log(`✅ ESG score generated: ${esgScore.overall}/100`);
      
      return esgScore;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate ESG score';
      console.error('ESG scoring error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [dueDiligenceService]);

  const projectYield = useCallback(async (metadata: RWAAssetMetadata): Promise<YieldProjection | null> => {
    try {
      setError(null);
      console.log(`📈 Projecting yield for ${metadata.name}`);
      
      const projection = await dueDiligenceService.projectYield(metadata);
      console.log(`✅ Yield projection: ${projection.suggestedAPY}% APY (confidence: ${Math.round(projection.confidence * 100)}%)`);
      
      return projection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to project yield';
      console.error('Yield projection error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [dueDiligenceService]);

  const clearReport = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);

  const clearCache = useCallback(() => {
    reportCache.clear();
    console.log('🗑️ Due diligence report cache cleared');
  }, []);

  return {
    // State
    isGenerating,
    report,
    error,
    
    // Actions
    generateReport,
    quickRiskAssessment,
    generateESGScore,
    projectYield,
    clearReport,
    
    // Cache management
    getCachedReport,
    clearCache
  };
}

// Utility hook for batch operations
export function useAIDueDiligenceBatch() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Map<string, AIDueDiligenceReport>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const dueDiligenceService = new AIDueDiligenceService();

  const processBatch = useCallback(async (
    assets: Array<{ assetId: string; metadata: RWAAssetMetadata }>,
    options: any = {}
  ) => {
    setIsProcessing(true);
    setResults(new Map());
    setErrors(new Map());

    const batchResults = new Map<string, AIDueDiligenceReport>();
    const batchErrors = new Map<string, string>();

    // Process in parallel with concurrency limit
    const concurrencyLimit = options.concurrency || 3;
    const chunks = [];
    
    for (let i = 0; i < assets.length; i += concurrencyLimit) {
      chunks.push(assets.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
      const promises = chunk.map(async ({ assetId, metadata }) => {
        try {
          const report = await dueDiligenceService.generateDueDiligenceReport(
            assetId,
            metadata,
            { detailLevel: 'basic', ...options }
          );
          batchResults.set(assetId, report);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          batchErrors.set(assetId, errorMessage);
        }
      });

      await Promise.all(promises);
      
      // Update state after each chunk
      setResults(new Map(batchResults));
      setErrors(new Map(batchErrors));
    }

    setIsProcessing(false);
    return { results: batchResults, errors: batchErrors };
  }, [dueDiligenceService]);

  return {
    isProcessing,
    results,
    errors,
    processBatch
  };
}

// Performance monitoring hook
export function useAIDueDiligenceMetrics() {
  const [metrics, setMetrics] = useState({
    totalReports: 0,
    averageGenerationTime: 0,
    successRate: 0,
    cacheHitRate: 0,
    providerUsage: { openai: 0, claude: 0 }
  });

  const updateMetrics = useCallback((
    generationTime: number,
    success: boolean,
    cacheHit: boolean,
    provider: 'openai' | 'claude'
  ) => {
    setMetrics(prev => {
      const totalReports = prev.totalReports + 1;
      const successCount = success ? 1 : 0;
      const cacheHitCount = cacheHit ? 1 : 0;
      
      return {
        totalReports,
        averageGenerationTime: (prev.averageGenerationTime * prev.totalReports + generationTime) / totalReports,
        successRate: ((prev.successRate * prev.totalReports) + successCount) / totalReports,
        cacheHitRate: ((prev.cacheHitRate * prev.totalReports) + cacheHitCount) / totalReports,
        providerUsage: {
          ...prev.providerUsage,
          [provider]: prev.providerUsage[provider] + 1
        }
      };
    });
  }, []);

  return { metrics, updateMetrics };
}
