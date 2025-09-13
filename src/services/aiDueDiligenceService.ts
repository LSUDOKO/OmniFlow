import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export interface RWAAssetMetadata {
  name: string;
  description: string;
  assetType: 'real_estate' | 'precious_metals' | 'carbon_credits' | 'art_collectibles' | 'commodities' | 'bonds' | 'other';
  location?: string;
  jurisdiction: string;
  value: number;
  currency: string;
  documents?: string[];
  certifications?: string[];
  images?: string[];
  legalStructure?: string;
  underlyingAssets?: string;
}

export interface ESGScore {
  environmental: number; // 0-100
  social: number; // 0-100
  governance: number; // 0-100
  overall: number; // 0-100
  factors: string[];
  improvements: string[];
}

export interface RiskAssessment {
  level: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  score: number; // 0-1000
  factors: string[];
  mitigations: string[];
}

export interface YieldProjection {
  suggestedAPY: number;
  confidence: number; // 0-1
  factors: string[];
  comparables: string[];
  riskAdjustment: number;
}

export interface JurisdictionAnalysis {
  country: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  regulations: string[];
  compliance: string[];
  restrictions: string[];
  taxImplications: string[];
}

export interface KYCRiskProfile {
  level: 'BASIC' | 'ENHANCED' | 'INSTITUTIONAL';
  requirements: string[];
  redFlags: string[];
  verificationSteps: string[];
  estimatedTime: string;
}

export interface AIDueDiligenceReport {
  id: string;
  assetId: string;
  generatedAt: Date;
  aiProvider: 'openai' | 'claude';
  
  // Core Analysis
  riskAssessment: RiskAssessment;
  yieldProjection: YieldProjection;
  esgScore: ESGScore;
  kycRisk: KYCRiskProfile;
  jurisdiction: JurisdictionAnalysis;
  
  // Summary
  executiveSummary: string;
  keyFindings: string[];
  recommendations: string[];
  
  // Confidence & Quality
  overallConfidence: number; // 0-1
  dataQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  limitations: string[];
  
  // Compliance
  regulatoryFlags: string[];
  complianceScore: number; // 0-100
  
  // Market Analysis
  marketComparables: string[];
  liquidityAssessment: string;
  valuationRange: { min: number; max: number; currency: string };
}

export class AIDueDiligenceService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private preferredProvider: 'openai' | 'claude' = 'openai';

  constructor() {
    // Initialize AI providers
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    // Set preferred provider based on availability
    if (this.anthropic && !this.openai) {
      this.preferredProvider = 'claude';
    }
  }

  /**
   * Generate comprehensive AI due diligence report for RWA asset
   */
  async generateDueDiligenceReport(
    assetId: string, 
    metadata: RWAAssetMetadata,
    options: {
      provider?: 'openai' | 'claude';
      includeMarketAnalysis?: boolean;
      includeESGAnalysis?: boolean;
      detailLevel?: 'basic' | 'comprehensive';
    } = {}
  ): Promise<AIDueDiligenceReport> {
    const provider = options.provider || this.preferredProvider;
    const startTime = Date.now();

    try {
      console.log(`🤖 Generating AI due diligence report for asset ${assetId} using ${provider.toUpperCase()}`);

      // Prepare analysis prompt
      const analysisPrompt = this.buildAnalysisPrompt(metadata, options);
      
      // Generate AI analysis
      const aiAnalysis = provider === 'openai' 
        ? await this.generateWithOpenAI(analysisPrompt)
        : await this.generateWithClaude(analysisPrompt);

      // Parse and structure the response
      const report = await this.parseAIResponse(aiAnalysis, assetId, provider, metadata);
      
      // Add performance metrics
      const processingTime = Date.now() - startTime;
      console.log(`✅ Due diligence report generated in ${processingTime}ms`);

      return report;
    } catch (error) {
      console.error('Error generating due diligence report:', error);
      
      // Fallback to rule-based analysis
      return this.generateFallbackReport(assetId, metadata);
    }
  }

  /**
   * Quick risk assessment for real-time use
   */
  async quickRiskAssessment(metadata: RWAAssetMetadata): Promise<RiskAssessment> {
    try {
      const prompt = `Analyze this RWA asset for investment risk:
Asset: ${metadata.name}
Type: ${metadata.assetType}
Location: ${metadata.location || 'Unknown'}
Jurisdiction: ${metadata.jurisdiction}
Value: ${metadata.value} ${metadata.currency}

Provide a JSON response with:
{
  "level": "VERY_LOW|LOW|MEDIUM|HIGH|VERY_HIGH",
  "score": 0-1000,
  "factors": ["risk factor 1", "risk factor 2"],
  "mitigations": ["mitigation 1", "mitigation 2"]
}`;

      const response = this.preferredProvider === 'openai'
        ? await this.generateWithOpenAI(prompt, { maxTokens: 500 })
        : await this.generateWithClaude(prompt, { maxTokens: 500 });

      return this.parseRiskAssessment(response);
    } catch (error) {
      console.error('Quick risk assessment failed:', error);
      return this.generateFallbackRiskAssessment(metadata);
    }
  }

  /**
   * ESG scoring for sustainability analysis
   */
  async generateESGScore(metadata: RWAAssetMetadata): Promise<ESGScore> {
    const prompt = `Analyze ESG factors for this RWA asset:
Asset: ${metadata.name}
Type: ${metadata.assetType}
Description: ${metadata.description}
Location: ${metadata.location || 'Unknown'}

Provide ESG scores (0-100) and analysis:
{
  "environmental": 0-100,
  "social": 0-100, 
  "governance": 0-100,
  "overall": 0-100,
  "factors": ["key ESG factors"],
  "improvements": ["suggested improvements"]
}`;

    try {
      const response = this.preferredProvider === 'openai'
        ? await this.generateWithOpenAI(prompt, { maxTokens: 600 })
        : await this.generateWithClaude(prompt, { maxTokens: 600 });

      return this.parseESGScore(response);
    } catch (error) {
      console.error('ESG scoring failed:', error);
      return this.generateFallbackESGScore(metadata);
    }
  }

  /**
   * Yield projection based on asset characteristics
   */
  async projectYield(metadata: RWAAssetMetadata): Promise<YieldProjection> {
    const prompt = `Project yield for this RWA asset:
Asset: ${metadata.name}
Type: ${metadata.assetType}
Value: ${metadata.value} ${metadata.currency}
Location: ${metadata.location || 'Unknown'}

Consider market conditions, asset type, location, and risk factors.
Provide:
{
  "suggestedAPY": 0-50,
  "confidence": 0-1,
  "factors": ["yield factors"],
  "comparables": ["comparable assets"],
  "riskAdjustment": -10 to +10
}`;

    try {
      const response = this.preferredProvider === 'openai'
        ? await this.generateWithOpenAI(prompt, { maxTokens: 500 })
        : await this.generateWithClaude(prompt, { maxTokens: 500 });

      return this.parseYieldProjection(response);
    } catch (error) {
      console.error('Yield projection failed:', error);
      return this.generateFallbackYieldProjection(metadata);
    }
  }

  // Private methods for AI provider integration
  private buildAnalysisPrompt(metadata: RWAAssetMetadata, options: any): string {
    const detailLevel = options.detailLevel || 'comprehensive';
    
    return `You are a world-class RWA (Real World Asset) due diligence expert. Analyze this asset comprehensively:

ASSET DETAILS:
- Name: ${metadata.name}
- Type: ${metadata.assetType}
- Description: ${metadata.description}
- Location: ${metadata.location || 'Not specified'}
- Jurisdiction: ${metadata.jurisdiction}
- Value: ${metadata.value} ${metadata.currency}
- Legal Structure: ${metadata.legalStructure || 'Not specified'}
- Underlying Assets: ${metadata.underlyingAssets || 'Not specified'}

ANALYSIS REQUIREMENTS:
${detailLevel === 'comprehensive' ? `
1. RISK ASSESSMENT (level, score 0-1000, factors, mitigations)
2. YIELD PROJECTION (suggested APY, confidence, factors, comparables)
3. ESG SCORING (environmental, social, governance scores 0-100)
4. KYC RISK PROFILE (level, requirements, red flags, verification steps)
5. JURISDICTION ANALYSIS (country risk, regulations, compliance, restrictions)
6. EXECUTIVE SUMMARY (key findings, recommendations)
7. REGULATORY FLAGS (compliance issues, restrictions)
8. MARKET ANALYSIS (comparables, liquidity, valuation range)
` : `
1. RISK ASSESSMENT (level, score, key factors)
2. YIELD PROJECTION (suggested APY, confidence)
3. EXECUTIVE SUMMARY (key findings)
`}

Provide a detailed JSON response with all requested sections. Be specific, actionable, and consider current market conditions, regulatory environment, and asset-specific risks.

Focus on:
- Regulatory compliance in the specified jurisdiction
- Market liquidity and tradability
- Asset-specific risks (real estate: market cycles, precious metals: volatility, etc.)
- ESG factors relevant to the asset type
- KYC/AML requirements based on asset value and type
- Yield potential based on comparable assets and market conditions

Response format: Valid JSON only, no additional text.`;
  }

  private async generateWithOpenAI(prompt: string, options: { maxTokens?: number } = {}): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert RWA due diligence analyst. Provide detailed, accurate analysis in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || 2000,
      temperature: 0.3, // Lower temperature for more consistent analysis
      response_format: { type: 'json_object' }
    });

    return response.choices[0]?.message?.content || '{}';
  }

  private async generateWithClaude(prompt: string, options: { maxTokens?: number } = {}): Promise<string> {
    if (!this.anthropic) {
      throw new Error('Claude not configured');
    }

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: options.maxTokens || 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nIMPORTANT: Respond with valid JSON only, no additional text or formatting.`
        }
      ]
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '{}';
  }

  private async parseAIResponse(
    aiResponse: string, 
    assetId: string, 
    provider: 'openai' | 'claude',
    metadata: RWAAssetMetadata
  ): Promise<AIDueDiligenceReport> {
    try {
      const parsed = JSON.parse(aiResponse);
      
      return {
        id: `dd_${assetId}_${Date.now()}`,
        assetId,
        generatedAt: new Date(),
        aiProvider: provider,
        
        riskAssessment: parsed.riskAssessment || this.generateFallbackRiskAssessment(metadata),
        yieldProjection: parsed.yieldProjection || this.generateFallbackYieldProjection(metadata),
        esgScore: parsed.esgScore || this.generateFallbackESGScore(metadata),
        kycRisk: parsed.kycRisk || this.generateFallbackKYCRisk(metadata),
        jurisdiction: parsed.jurisdiction || this.generateFallbackJurisdiction(metadata),
        
        executiveSummary: parsed.executiveSummary || 'AI-generated analysis of RWA asset risk and opportunity profile.',
        keyFindings: parsed.keyFindings || ['Asset analysis completed', 'Risk factors identified', 'Yield projection calculated'],
        recommendations: parsed.recommendations || ['Proceed with enhanced due diligence', 'Monitor regulatory changes'],
        
        overallConfidence: parsed.overallConfidence || 0.75,
        dataQuality: parsed.dataQuality || 'GOOD',
        limitations: parsed.limitations || ['Limited historical data', 'Market volatility'],
        
        regulatoryFlags: parsed.regulatoryFlags || [],
        complianceScore: parsed.complianceScore || 75,
        
        marketComparables: parsed.marketComparables || [],
        liquidityAssessment: parsed.liquidityAssessment || 'Medium liquidity expected',
        valuationRange: parsed.valuationRange || { 
          min: metadata.value * 0.8, 
          max: metadata.value * 1.2, 
          currency: metadata.currency 
        }
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.generateFallbackReport(assetId, metadata);
    }
  }

  // Parsing helper methods
  private parseRiskAssessment(response: string): RiskAssessment {
    try {
      const parsed = JSON.parse(response);
      return {
        level: parsed.level || 'MEDIUM',
        score: parsed.score || 500,
        factors: parsed.factors || ['Limited data available'],
        mitigations: parsed.mitigations || ['Enhanced monitoring recommended']
      };
    } catch {
      return {
        level: 'MEDIUM',
        score: 500,
        factors: ['Analysis unavailable'],
        mitigations: ['Manual review required']
      };
    }
  }

  private parseESGScore(response: string): ESGScore {
    try {
      const parsed = JSON.parse(response);
      return {
        environmental: parsed.environmental || 50,
        social: parsed.social || 50,
        governance: parsed.governance || 50,
        overall: parsed.overall || 50,
        factors: parsed.factors || ['ESG analysis pending'],
        improvements: parsed.improvements || ['Enhance ESG reporting']
      };
    } catch {
      return {
        environmental: 50,
        social: 50,
        governance: 50,
        overall: 50,
        factors: ['Analysis unavailable'],
        improvements: ['ESG assessment needed']
      };
    }
  }

  private parseYieldProjection(response: string): YieldProjection {
    try {
      const parsed = JSON.parse(response);
      return {
        suggestedAPY: parsed.suggestedAPY || 5.0,
        confidence: parsed.confidence || 0.6,
        factors: parsed.factors || ['Market conditions', 'Asset type'],
        comparables: parsed.comparables || ['Similar assets in market'],
        riskAdjustment: parsed.riskAdjustment || 0
      };
    } catch {
      return {
        suggestedAPY: 5.0,
        confidence: 0.5,
        factors: ['Analysis unavailable'],
        comparables: ['Manual comparison needed'],
        riskAdjustment: 0
      };
    }
  }

  // Fallback methods for when AI is unavailable
  private generateFallbackReport(assetId: string, metadata: RWAAssetMetadata): AIDueDiligenceReport {
    return {
      id: `dd_${assetId}_${Date.now()}`,
      assetId,
      generatedAt: new Date(),
      aiProvider: 'openai', // Default
      
      riskAssessment: this.generateFallbackRiskAssessment(metadata),
      yieldProjection: this.generateFallbackYieldProjection(metadata),
      esgScore: this.generateFallbackESGScore(metadata),
      kycRisk: this.generateFallbackKYCRisk(metadata),
      jurisdiction: this.generateFallbackJurisdiction(metadata),
      
      executiveSummary: `Rule-based analysis of ${metadata.name} (${metadata.assetType}) located in ${metadata.jurisdiction}. Manual review recommended for comprehensive assessment.`,
      keyFindings: [
        'Asset type identified and categorized',
        'Basic risk factors assessed',
        'Jurisdiction compliance requirements noted'
      ],
      recommendations: [
        'Conduct manual due diligence review',
        'Verify asset documentation',
        'Confirm regulatory compliance'
      ],
      
      overallConfidence: 0.4,
      dataQuality: 'FAIR',
      limitations: ['AI analysis unavailable', 'Rule-based assessment only'],
      
      regulatoryFlags: [],
      complianceScore: 60,
      
      marketComparables: [],
      liquidityAssessment: 'Liquidity assessment pending',
      valuationRange: { 
        min: metadata.value * 0.8, 
        max: metadata.value * 1.2, 
        currency: metadata.currency 
      }
    };
  }

  private generateFallbackRiskAssessment(metadata: RWAAssetMetadata): RiskAssessment {
    // Rule-based risk assessment
    let score = 300; // Base medium risk
    const factors: string[] = [];
    
    // Asset type risk
    switch (metadata.assetType) {
      case 'real_estate':
        score += 100;
        factors.push('Real estate market volatility');
        break;
      case 'precious_metals':
        score += 200;
        factors.push('Commodity price volatility');
        break;
      case 'art_collectibles':
        score += 300;
        factors.push('Illiquid market', 'Subjective valuation');
        break;
      case 'carbon_credits':
        score += 150;
        factors.push('Regulatory uncertainty');
        break;
    }
    
    // Value-based risk
    if (metadata.value > 10000000) {
      score += 100;
      factors.push('High value concentration risk');
    }
    
    const level = score <= 200 ? 'LOW' : score <= 400 ? 'MEDIUM' : score <= 600 ? 'HIGH' : 'VERY_HIGH';
    
    return {
      level,
      score: Math.min(score, 1000),
      factors,
      mitigations: [
        'Enhanced due diligence',
        'Regular asset monitoring',
        'Diversification recommended'
      ]
    };
  }

  private generateFallbackYieldProjection(metadata: RWAAssetMetadata): YieldProjection {
    // Rule-based yield projection
    let baseAPY = 5.0;
    
    switch (metadata.assetType) {
      case 'real_estate':
        baseAPY = 6.5;
        break;
      case 'precious_metals':
        baseAPY = 3.0;
        break;
      case 'carbon_credits':
        baseAPY = 8.0;
        break;
      case 'art_collectibles':
        baseAPY = 4.0;
        break;
    }
    
    return {
      suggestedAPY: baseAPY,
      confidence: 0.5,
      factors: ['Asset type baseline', 'Market conditions'],
      comparables: ['Historical asset performance'],
      riskAdjustment: 0
    };
  }

  private generateFallbackESGScore(metadata: RWAAssetMetadata): ESGScore {
    // Basic ESG scoring
    let environmental = 50;
    let social = 50;
    let governance = 50;
    
    if (metadata.assetType === 'carbon_credits') {
      environmental = 85;
    } else if (metadata.assetType === 'real_estate') {
      environmental = 40;
      social = 60;
    }
    
    const overall = Math.round((environmental + social + governance) / 3);
    
    return {
      environmental,
      social,
      governance,
      overall,
      factors: ['Basic ESG assessment'],
      improvements: ['Detailed ESG analysis recommended']
    };
  }

  private generateFallbackKYCRisk(metadata: RWAAssetMetadata): KYCRiskProfile {
    const level = metadata.value > 1000000 ? 'INSTITUTIONAL' : 
                 metadata.value > 100000 ? 'ENHANCED' : 'BASIC';
    
    return {
      level,
      requirements: ['Identity verification', 'Source of funds'],
      redFlags: ['High value transaction'],
      verificationSteps: ['Document collection', 'Identity verification'],
      estimatedTime: '3-5 business days'
    };
  }

  private generateFallbackJurisdiction(metadata: RWAAssetMetadata): JurisdictionAnalysis {
    return {
      country: metadata.jurisdiction,
      riskLevel: 'MEDIUM',
      regulations: ['Local securities laws'],
      compliance: ['KYC/AML requirements'],
      restrictions: ['Foreign investment limits may apply'],
      taxImplications: ['Consult tax advisor']
    };
  }
}
