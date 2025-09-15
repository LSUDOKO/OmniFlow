import { GoogleGenerativeAI } from '@google/generative-ai';

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
  aiProvider: 'gemini';
  
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
  private genAI?: GoogleGenerativeAI;
  private model?: any;

  constructor() {
    // Initialize Gemini
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      this.genAI = new GoogleGenerativeAI(apiKey!);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
    }
  }

  /**
   * Generate comprehensive AI due diligence report for RWA asset
   */
  async generateDueDiligenceReport(
    assetId: string, 
    metadata: RWAAssetMetadata,
    options: {
      includeMarketAnalysis?: boolean;
      includeESGAnalysis?: boolean;
      detailLevel?: 'basic' | 'comprehensive';
    } = {}
  ): Promise<AIDueDiligenceReport> {
    const startTime = Date.now();

    try {
      console.log(`🤖 Generating AI due diligence report for asset ${assetId} using Gemini`);

      // Prepare analysis prompt
      const analysisPrompt = this.buildAnalysisPrompt(metadata, options);
      
      // Generate AI analysis
      const aiAnalysis = await this.generateWithGemini(analysisPrompt);

      // Parse and structure the response
      const report = await this.parseAIResponse(aiAnalysis, assetId, metadata);
      
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
}

Respond only with valid JSON, no additional text.`;

      const response = await this.generateWithGemini(prompt, { maxTokens: 500 });
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
}

Respond only with valid JSON, no additional text.`;

    try {
      const response = await this.generateWithGemini(prompt, { maxTokens: 600 });
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
}

Respond only with valid JSON, no additional text.`;

    try {
      const response = await this.generateWithGemini(prompt, { maxTokens: 500 });
      return this.parseYieldProjection(response);
    } catch (error) {
      console.error('Yield projection failed:', error);
      return this.generateFallbackYieldProjection(metadata);
    }
  }

  // Private methods for Gemini integration
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

IMPORTANT: Respond only with valid JSON, no additional text or formatting. Structure your response as:
{
  "riskAssessment": { "level": "", "score": 0, "factors": [], "mitigations": [] },
  "yieldProjection": { "suggestedAPY": 0, "confidence": 0, "factors": [], "comparables": [], "riskAdjustment": 0 },
  "esgScore": { "environmental": 0, "social": 0, "governance": 0, "overall": 0, "factors": [], "improvements": [] },
  "kycRisk": { "level": "", "requirements": [], "redFlags": [], "verificationSteps": [], "estimatedTime": "" },
  "jurisdiction": { "country": "", "riskLevel": "", "regulations": [], "compliance": [], "restrictions": [], "taxImplications": [] },
  "executiveSummary": "",
  "keyFindings": [],
  "recommendations": [],
  "overallConfidence": 0,
  "dataQuality": "",
  "limitations": [],
  "regulatoryFlags": [],
  "complianceScore": 0,
  "marketComparables": [],
  "liquidityAssessment": "",
  "valuationRange": { "min": 0, "max": 0, "currency": "" }
}`;
  }

  private async generateWithGemini(prompt: string, options: { maxTokens?: number } = {}): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini not configured. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable');
    }

    try {
      // Update generation config if maxTokens is specified
      if (options.maxTokens) {
        const customModel = this.genAI!.getGenerativeModel({ 
          model: "gemini-1.5-pro",
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: options.maxTokens,
          },
        });
        const result = await customModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  private async parseAIResponse(
    aiResponse: string, 
    assetId: string, 
    metadata: RWAAssetMetadata
  ): Promise<AIDueDiligenceReport> {
    try {
      // Clean the response to extract JSON
      let cleanResponse = aiResponse.trim();
      
      // Remove markdown code blocks if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      const parsed = JSON.parse(cleanResponse);
      
      return {
        id: `dd_${assetId}_${Date.now()}`,
        assetId,
        generatedAt: new Date(),
        aiProvider: 'gemini',
        
        riskAssessment: parsed.riskAssessment || this.generateFallbackRiskAssessment(metadata),
        yieldProjection: parsed.yieldProjection || this.generateFallbackYieldProjection(metadata),
        esgScore: parsed.esgScore || this.generateFallbackESGScore(metadata),
        kycRisk: parsed.kycRisk || this.generateFallbackKYCRisk(metadata),
        jurisdiction: parsed.jurisdiction || this.generateFallbackJurisdiction(metadata),
        
        executiveSummary: parsed.executiveSummary || 'Gemini-generated analysis of RWA asset risk and opportunity profile.',
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
      console.error('Failed to parse Gemini response:', error);
      console.log('Raw response:', aiResponse);
      return this.generateFallbackReport(assetId, metadata);
    }
  }

  // Parsing helper methods
  private parseRiskAssessment(response: string): RiskAssessment {
    try {
      // Clean response similar to parseAIResponse
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      const parsed = JSON.parse(cleanResponse);
      return {
        level: parsed.level || 'MEDIUM',
        score: parsed.score || 500,
        factors: parsed.factors || ['Limited data available'],
        mitigations: parsed.mitigations || ['Enhanced monitoring recommended']
      };
    } catch (error) {
      console.error('Failed to parse risk assessment:', error);
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
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      const parsed = JSON.parse(cleanResponse);
      return {
        environmental: parsed.environmental || 50,
        social: parsed.social || 50,
        governance: parsed.governance || 50,
        overall: parsed.overall || 50,
        factors: parsed.factors || ['ESG analysis pending'],
        improvements: parsed.improvements || ['Enhance ESG reporting']
      };
    } catch (error) {
      console.error('Failed to parse ESG score:', error);
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
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      const parsed = JSON.parse(cleanResponse);
      return {
        suggestedAPY: parsed.suggestedAPY || 5.0,
        confidence: parsed.confidence || 0.6,
        factors: parsed.factors || ['Market conditions', 'Asset type'],
        comparables: parsed.comparables || ['Similar assets in market'],
        riskAdjustment: parsed.riskAdjustment || 0
      };
    } catch (error) {
      console.error('Failed to parse yield projection:', error);
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
      aiProvider: 'gemini',
      
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