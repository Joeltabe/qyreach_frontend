// AI Service for managing AI-powered features with backend integration and fallbacks

export interface AIComposeRequest {
  prompt: string;
  tone?: 'professional' | 'friendly' | 'casual';
  emailType?: 'marketing' | 'welcome' | 'newsletter' | 'sales' | 'follow-up';
  brandInfo?: {
    companyName: string;
    industry: string;
  };
  targetAudience?: string;
  length?: 'short' | 'medium' | 'long';
  includeSubject?: boolean;
}

export interface AIComposeResponse {
  subject?: string;
  content: string;
  suggestions: string[];
  placeholders?: {
    company: string[];
    images: string[];
    links: string[];
  };
  metadata: {
    tone: string;
    length: string;
    emailType: string;
    generatedAt: string;
    model: string;
    provider: string;
    requestTokens?: number;
    hasPlaceholders?: boolean;
    requiresCustomization?: boolean;
  };
}

export interface AIPreviewRequest {
  content: string;
  replacements?: Record<string, string>;
}

export interface AIPreviewResponse {
  originalContent: string;
  previewContent: string;
  foundPlaceholders: string[];
  appliedReplacements: Record<string, string>;
  availableReplacements: {
    company: string[];
    images: string[];
    links: string[];
  };
}

export interface AIAnalysisRequest {
  subject?: string;
  content: string;
}

export interface AIAnalysisResponse {
  effectiveness_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  predicted_metrics: {
    open_rate: string;
    click_rate: string;
  };
  compliance_check: {
    has_clear_cta: boolean;
    mobile_friendly: boolean | string;
    spam_risk: string;
    personalization?: string;
  };
  improvement_priority?: string;
  analyzedAt: string;
  provider: string;
}

export interface AIVariationsRequest {
  content: string;
  variationType?: 'tone' | 'length' | 'approach' | 'cta' | 'audience';
  count?: number;
}

export interface AIVariationsResponse {
  original: string;
  variationType: string;
  variations: Array<{
    version: string;
    content: string;
    changes: string;
  }>;
  generatedAt: string;
  provider: string;
}

export interface AISubjectRequest {
  currentSubject: string;
  emailContent?: string;
  goal?: 'increase_open_rate' | 'improve_clarity' | 'add_urgency' | 'increase_curiosity';
}

export interface AISubjectResponse {
  original: string;
  improved_subjects: string[];
  reasoning: string;
  generatedAt: string;
  provider: string;
}

export interface AIStatusResponse {
  available: boolean;
  configured: boolean;
  working: boolean | null;
  provider: string;
  model: string;
  api_key_status: string;
  features: {
    compose: boolean;
    improve_subject: boolean;
    generate_variations: boolean;
    analyze: boolean;
  };
  last_test: string;
}

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      // Get token from the same storage as api.ts
      let token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      let companyId = localStorage.getItem('companyId');
      
      // Development bypass - use same tokens as api.ts
      const isDevelopment = import.meta.env.DEV;
      if (isDevelopment && !token) {
        token = 'dev-test-token-12345';
        companyId = 'dev-company-12345';
        console.log('🚀 AI Service: Using development authentication tokens');
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...(companyId && { 'x-company-id': companyId }),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`AI Service Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async compose(request: AIComposeRequest): Promise<AIComposeResponse | null> {
    const result = await this.makeRequest<AIComposeResponse>('/api/ai/compose', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (result.success && result.data) {
      return result.data;
    }

    console.warn('AI Compose API failed, falling back to client-side generation');
    return null;
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> {
    const result = await this.makeRequest<AIAnalysisResponse>('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (result.success && result.data) {
      return result.data;
    }

    console.warn('AI Analysis API failed');
    return null;
  }

  async previewEmail(request: AIPreviewRequest): Promise<AIPreviewResponse | null> {
    const result = await this.makeRequest<AIPreviewResponse>('/api/ai/preview', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (result.success && result.data) {
      return result.data;
    }

    console.warn('AI Preview API failed');
    return null;
  }

  async generateVariations(request: AIVariationsRequest): Promise<AIVariationsResponse | null> {
    const result = await this.makeRequest<AIVariationsResponse>('/api/ai/generate-variations', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (result.success && result.data) {
      return result.data;
    }

    console.warn('AI Variations API failed');
    return null;
  }

  async improveSubject(request: AISubjectRequest): Promise<AISubjectResponse | null> {
    const result = await this.makeRequest<AISubjectResponse>('/api/ai/improve-subject', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (result.success && result.data) {
      return result.data;
    }

    console.warn('AI Subject Improvement API failed');
    return null;
  }

  async getStatus(): Promise<AIStatusResponse | null> {
    const result = await this.makeRequest<AIStatusResponse>('/api/ai/status', {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  }

  // Check if AI features are available
  async isAvailable(): Promise<boolean> {
    const status = await this.getStatus();
    return !!(status?.available && status?.configured && status?.working === true);
  }

  // Client-side fallback for email composition
  generateFallbackEmail(request: AIComposeRequest): AIComposeResponse {
    const templates = {
      professional: {
        subjects: [
          `Introducing ${request.brandInfo?.companyName || 'Our Solution'}: Transform Your ${request.brandInfo?.industry || 'Business'} Operations`,
          `${request.brandInfo?.companyName || 'We'} Present: Next-Generation ${request.brandInfo?.industry || 'Business'} Solutions`,
          `Exclusive Access: Professional ${request.brandInfo?.industry || 'Business'} Solution`
        ],
        bodies: [
          `Dear {{firstName}},

I hope this message finds you well. I'm reaching out because I believe our solution could significantly impact your ${request.brandInfo?.industry || 'business'} operations.

At ${request.brandInfo?.companyName || 'our company'}, we've developed a solution that addresses key challenges:

• Streamlined operations that reduce costs by up to 30%
• Enhanced efficiency through automated workflows
• Data-driven insights for better decision making

${request.prompt ? `Based on your specific needs: ${request.prompt}` : ''}

I'd love to schedule a brief 15-minute call to show you how this can specifically benefit your organization.

Would you be available for a quick conversation this week?

Best regards,
{{senderName}}
{{senderTitle}}
${request.brandInfo?.companyName || 'Our Company'}`,
        ]
      },
      friendly: {
        subjects: [
          `Hey {{firstName}}, thought you'd love this ${request.brandInfo?.industry || 'business'} solution!`,
          `Quick question about your ${request.brandInfo?.industry || 'business'} goals...`,
          `This is perfect for teams like yours`
        ],
        bodies: [
          `Hi {{firstName}},

Hope your week is going great! 🌟

I came across your company and was really impressed by what you're doing in ${request.brandInfo?.industry || 'your industry'}. It got me thinking - you might really benefit from what we've built.

Our solution is specifically designed for teams who want to:
• Save time on repetitive tasks
• Get better results with less effort  
• Actually enjoy their work more (yes, really!)

${request.prompt ? `I noticed you mentioned: ${request.prompt} - this is exactly what we help with!` : ''}

Want to see it in action? I can show you in just 10 minutes how it works.

Let me know if you're interested!

Cheers,
{{senderName}}
${request.brandInfo?.companyName || 'Our Team'}`,
        ]
      },
      casual: {
        subjects: [
          `Quick favor - 2 minutes?`,
          `This reminded me of you...`,
          `Thought you'd appreciate this`
        ],
        bodies: [
          `Hi {{firstName}},

Hope things are good on your end!

So I was just thinking about the challenges in ${request.brandInfo?.industry || 'business'} and your company came to mind.

We've been working on something - basically a way to make work way less painful. Early users are seeing some pretty cool results.

${request.prompt ? `Given what you mentioned about: ${request.prompt}, figured you might want to check it out.` : ''}

No pressure at all, but if you're curious, I'd be happy to show you how it works. Takes like 10 minutes.

Let me know!

{{senderName}}
${request.brandInfo?.companyName || 'Our Team'}`,
        ]
      }
    };

    const toneTemplates = templates[request.tone || 'professional'];
    const randomSubject = toneTemplates.subjects[Math.floor(Math.random() * toneTemplates.subjects.length)];
    const randomBody = toneTemplates.bodies[Math.floor(Math.random() * toneTemplates.bodies.length)];

    return {
      subject: request.includeSubject !== false ? randomSubject : undefined,
      content: randomBody,
      suggestions: [
        'Review and customize the content for your specific brand voice',
        'Add personalization variables like {{firstName}} and {{companyName}}',
        'Test the email with a small audience first',
        'Consider A/B testing different subject lines'
      ],
      metadata: {
        tone: request.tone || 'professional',
        length: request.length || 'medium',
        emailType: request.emailType || 'marketing',
        generatedAt: new Date().toISOString(),
        model: 'Qyreach Template System',
        provider: 'Client-side Fallback'
      }
    };
  }

  // Client-side fallback for email analysis
  generateFallbackAnalysis(request: AIAnalysisRequest): AIAnalysisResponse {
    const contentLength = request.content.length;
    const hasSubject = !!request.subject;
    const hasCTA = /click|button|link|visit|download|sign up|register|buy|purchase/i.test(request.content);
    const hasPersonalization = /\{\{\w+\}\}/.test(request.content);
    
    // Simple scoring algorithm
    let score = 5; // Base score
    if (hasSubject) score += 1;
    if (hasCTA) score += 2;
    if (hasPersonalization) score += 1;
    if (contentLength > 100 && contentLength < 1000) score += 1;

    return {
      effectiveness_score: Math.min(10, score),
      strengths: [
        hasSubject ? 'Subject line is present' : 'Content structure appears organized',
        hasCTA ? 'Clear call-to-action identified' : 'Appropriate content length',
        hasPersonalization ? 'Personalization variables detected' : 'Professional tone maintained'
      ].filter(Boolean),
      weaknesses: [
        !hasSubject ? 'Missing subject line' : null,
        !hasCTA ? 'No clear call-to-action found' : null,
        !hasPersonalization ? 'Could benefit from personalization' : null,
        contentLength < 50 ? 'Content seems too short' : null,
        contentLength > 2000 ? 'Content might be too long' : null
      ].filter((item): item is string => item !== null),
      recommendations: [
        'Enable AI analysis for detailed feedback',
        'Test email across different devices and email clients',
        'Consider A/B testing different versions',
        'Add tracking pixels for performance monitoring'
      ],
      predicted_metrics: {
        open_rate: '15-25% (industry average)',
        click_rate: '2-5% (industry average)'
      },
      compliance_check: {
        has_clear_cta: hasCTA,
        mobile_friendly: 'Unable to determine without AI analysis',
        spam_risk: 'Low (basic check)',
        personalization: hasPersonalization ? 'Variables detected' : 'Consider adding personalization'
      },
      improvement_priority: !hasCTA ? 'Add clear call-to-action' : 'Enhance personalization',
      analyzedAt: new Date().toISOString(),
      provider: 'Client-side Fallback'
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
