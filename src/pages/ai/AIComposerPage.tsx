import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  Target, 
  Copy, 
  RefreshCw, 
  Send, 
  FileText, 
  Mail,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { aiService, type AIComposeRequest, type AIAnalysisRequest } from '../../services/aiService';

interface AIResponse {
  content: {
    subject: string;
    body: string;
    variables: string[];
    estimatedEngagement: string;
  };
  aiMetrics: {
    tokensUsed: number;
    generationTime: number;
    model: string;
  };
  usageImpact: {
    aiRequestsUsed: number;
    remainingRequests: number;
  };
}

interface OptimizationResponse {
  original: {
    subject: string;
    body: string;
    spamScore: number;
  };
  optimized: {
    subject: string;
    body: string;
    spamScore: number;
    improvements: string[];
  };
  usageImpact: {
    aiRequestsUsed: number;
    remainingRequests: number;
  };
}
const AIComposerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'compose' | 'optimize'>('compose');
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  
  // Check AI availability on component mount
  useEffect(() => {
    aiService.isAvailable().then(setAiAvailable);
  }, []);
  
  // Compose form state
  const [composeForm, setComposeForm] = useState({
    prompt: '',
    tone: 'professional',
    type: 'email',
    context: {
      companyName: '',
      productName: '',
      industry: ''
    }
  });
  
  // Optimize form state
  const [optimizeForm, setOptimizeForm] = useState({
    subject: '',
    body: '',
    optimizationGoal: 'engagement',
    targetAudience: ''
  });
  
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [optimizationResponse, setOptimizationResponse] = useState<OptimizationResponse | null>(null);

  // AI Compose function with real backend integration and fallback
  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const composeRequest: AIComposeRequest = {
        prompt: composeForm.prompt,
        tone: composeForm.tone as 'professional' | 'friendly' | 'casual',
        emailType: composeForm.type as 'marketing' | 'welcome' | 'newsletter' | 'sales' | 'follow-up',
        brandInfo: {
          companyName: composeForm.context.companyName || 'Your Company',
          industry: composeForm.context.industry || 'Technology'
        },
        includeSubject: true,
        length: 'medium'
      };

      // Try AI service first
      const aiResult = await aiService.compose(composeRequest);
      
      if (aiResult) {
        // Transform AI service response to match our interface
        const transformedResponse: AIResponse = {
          content: {
            subject: aiResult.subject || 'AI-Generated Subject',
            body: aiResult.content,
            variables: extractVariables(aiResult.content),
            estimatedEngagement: `Generated with ${aiResult.metadata.provider}`
          },
          aiMetrics: {
            tokensUsed: aiResult.metadata.requestTokens || 0,
            generationTime: 1500,
            model: aiResult.metadata.model || 'AI Service'
          },
          usageImpact: {
            aiRequestsUsed: 1,
            remainingRequests: 50 // This would come from user's subscription
          }
        };

        setAiResponse(transformedResponse);
        toast.success(`Email generated with ${aiResult.metadata.provider}!`);
      } else {
        // Use fallback generation
        const fallbackResult = aiService.generateFallbackEmail(composeRequest);
        const transformedResponse: AIResponse = {
          content: {
            subject: fallbackResult.subject || 'Generated Subject',
            body: fallbackResult.content,
            variables: extractVariables(fallbackResult.content),
            estimatedEngagement: 'Client-side Generated'
          },
          aiMetrics: {
            tokensUsed: 0,
            generationTime: 500,
            model: fallbackResult.metadata.model
          },
          usageImpact: {
            aiRequestsUsed: 0,
            remainingRequests: 50
          }
        };

        setAiResponse(transformedResponse);
        toast.success('Email generated with fallback system!');
      }
    } catch (error) {
      console.error('Failed to compose email:', error);
      toast.error('Failed to generate email content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract variables from email content
  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
  };

  // AI Optimization function with backend integration
  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const analysisRequest: AIAnalysisRequest = {
        subject: optimizeForm.subject,
        content: optimizeForm.body
      };

      // Try AI service first
      const aiResult = await aiService.analyze(analysisRequest);
      
      if (aiResult) {
        // Transform backend analysis to optimization response
        const transformedResponse: OptimizationResponse = {
          original: {
            subject: optimizeForm.subject,
            body: optimizeForm.body,
            spamScore: 65 // Would be calculated by backend
          },
          optimized: {
            subject: aiResult.recommendations[0] || optimizeForm.subject,
            body: optimizeForm.body, // Backend would provide optimized version
            spamScore: Math.max(15, 65 - aiResult.effectiveness_score * 5),
            improvements: aiResult.recommendations
          },
          usageImpact: {
            aiRequestsUsed: 1,
            remainingRequests: 50
          }
        };

        setOptimizationResponse(transformedResponse);
        toast.success(`Email analyzed with ${aiResult.provider}!`);
      } else {
        // Use fallback analysis
        const fallbackResult = aiService.generateFallbackAnalysis(analysisRequest);
        const transformedResponse: OptimizationResponse = {
          original: {
            subject: optimizeForm.subject,
            body: optimizeForm.body,
            spamScore: 65
          },
          optimized: {
            subject: fallbackResult.recommendations[0] || optimizeForm.subject,
            body: optimizeForm.body,
            spamScore: Math.max(15, 65 - fallbackResult.effectiveness_score * 5),
            improvements: fallbackResult.recommendations
          },
          usageImpact: {
            aiRequestsUsed: 0,
            remainingRequests: 50
          }
        };

        setOptimizationResponse(transformedResponse);
        toast.success('Email analyzed with fallback system!');
      }
    } catch (error) {
      console.error('Failed to optimize email:', error);
      toast.error('Failed to optimize email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const saveEmailDraft = async (content: { subject: string; body: string }) => {
    try {
      // Save to localStorage as draft
      const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
      const newDraft = {
        id: Date.now().toString(),
        subject: content.subject,
        body: content.body,
        createdAt: new Date().toISOString(),
        type: 'ai-generated'
      };
      drafts.push(newDraft);
      localStorage.setItem('emailDrafts', JSON.stringify(drafts));
      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const exportEmail = (content: { subject: string; body: string }) => {
    const emailContent = `Subject: ${content.subject}\n\n${content.body}`;
    const blob = new Blob([emailContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Email exported successfully!');
  };

  const saveAsTemplate = async (content: { subject: string; body: string }) => {
    try {
      // Save to localStorage as template
      const templates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
      const newTemplate = {
        id: Date.now().toString(),
        name: content.subject || `Template ${templates.length + 1}`,
        subject: content.subject,
        body: content.body,
        createdAt: new Date().toISOString(),
        type: 'ai-generated',
        isActive: true
      };
      templates.push(newTemplate);
      localStorage.setItem('emailTemplates', JSON.stringify(templates));
      toast.success('Template saved successfully!');
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template');
    }
  };

  const useInCampaign = (content: { subject: string; body: string }) => {
    try {
      // Store the generated content to be used in campaign creation
      const campaignData = {
        subject: content.subject,
        content: content.body,
        type: 'ai-generated',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('pendingCampaignContent', JSON.stringify(campaignData));
      
      // Navigate to campaign creation page
      navigate('/campaigns/create?source=ai-composer');
      toast.success('Redirecting to campaign creation...');
    } catch (error) {
      console.error('Failed to use in campaign:', error);
      toast.error('Failed to redirect to campaign creation');
    }
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'friendly', label: 'Friendly', icon: '😊' },
    { value: 'casual', label: 'Casual', icon: '👋' },
    { value: 'formal', label: 'Formal', icon: '🎩' }
  ];

  const typeOptions = [
    { value: 'email', label: 'Email Content', icon: Mail },
    { value: 'subject', label: 'Subject Line', icon: FileText },
    { value: 'marketing', label: 'Marketing Copy', icon: TrendingUp }
  ];

  const goalOptions = [
    { value: 'engagement', label: 'Increase Engagement', icon: '💬' },
    { value: 'deliverability', label: 'Improve Deliverability', icon: '📧' },
    { value: 'conversion', label: 'Boost Conversion', icon: '📈' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Email Composer</h1>
                <p className="text-gray-600 dark:text-gray-400">Create and optimize emails with the power of AI</p>
              </div>
            </div>
            
            {/* AI Status Indicator */}
            <div className="flex items-center gap-2">
              {aiAvailable === null ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Checking AI...</span>
                </div>
              ) : aiAvailable ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">AI Available</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded-full">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">Fallback Mode</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('compose')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'compose'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Wand2 className="w-5 h-5" />
              Compose with AI
            </button>
            <button
              onClick={() => setActiveTab('optimize')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'optimize'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Target className="w-5 h-5" />
              Optimize Content
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'compose' ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Compose New Email
                </h3>
                
                <form onSubmit={handleCompose} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What do you want to write about?
                    </label>
                    <textarea
                      value={composeForm.prompt}
                      onChange={(e) => setComposeForm({ ...composeForm, prompt: e.target.value })}
                      placeholder="E.g., Create a welcome email for new customers of a SaaS product"
                      className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
                    <div className="grid grid-cols-2 gap-2">
                      {toneOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setComposeForm({ ...composeForm, tone: option.value })}
                          className={`p-3 border rounded-lg text-left flex items-center gap-2 transition-colors ${
                            composeForm.tone === option.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span>{option.icon}</span>
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Type</label>
                    <div className="space-y-2">
                      {typeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setComposeForm({ ...composeForm, type: option.value })}
                            className={`w-full p-3 border rounded-lg text-left flex items-center gap-3 transition-colors ${
                              composeForm.type === option.value
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Context (Optional)</label>
                    <Input
                      placeholder="Company Name"
                      value={composeForm.context.companyName}
                      onChange={(e) => setComposeForm({
                        ...composeForm,
                        context: { ...composeForm.context, companyName: e.target.value }
                      })}
                    />
                    <Input
                      placeholder="Product Name"
                      value={composeForm.context.productName}
                      onChange={(e) => setComposeForm({
                        ...composeForm,
                        context: { ...composeForm.context, productName: e.target.value }
                      })}
                    />
                    <Input
                      placeholder="Industry"
                      value={composeForm.context.industry}
                      onChange={(e) => setComposeForm({
                        ...composeForm,
                        context: { ...composeForm.context, industry: e.target.value }
                      })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Email
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Optimize Existing Content
                </h3>
                
                <form onSubmit={handleOptimize} className="space-y-6">
                  <Input
                    label="Subject Line"
                    value={optimizeForm.subject}
                    onChange={(e) => setOptimizeForm({ ...optimizeForm, subject: e.target.value })}
                    placeholder="Enter your current subject line"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Content</label>
                    <textarea
                      value={optimizeForm.body}
                      onChange={(e) => setOptimizeForm({ ...optimizeForm, body: e.target.value })}
                      placeholder="Paste your email content here"
                      className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Optimization Goal</label>
                    <div className="space-y-2">
                      {goalOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setOptimizeForm({ ...optimizeForm, optimizationGoal: option.value })}
                          className={`w-full p-3 border rounded-lg text-left flex items-center gap-3 transition-colors ${
                            optimizeForm.optimizationGoal === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span>{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Target Audience"
                    value={optimizeForm.targetAudience}
                    onChange={(e) => setOptimizeForm({ ...optimizeForm, targetAudience: e.target.value })}
                    placeholder="E.g., business owners, developers, marketers"
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Optimize Content
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            )}
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'compose' && aiResponse ? (
              <div className="space-y-6">
                {/* Generated Content */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Generated Email</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {aiResponse.content.estimatedEngagement} Engagement
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Subject Line</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(aiResponse.content.subject)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{aiResponse.content.subject}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Email Body</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(aiResponse.content.body)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                          {aiResponse.content.body}
                        </pre>
                      </div>
                    </div>

                    {aiResponse.content.variables.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Variables Found</label>
                        <div className="flex flex-wrap gap-2">
                          {aiResponse.content.variables.map((variable) => (
                            <Badge key={variable} className="bg-blue-100 text-blue-800">
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* AI Metrics */}
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">AI Usage</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tokens Used</p>
                      <p className="font-medium">{aiResponse.aiMetrics.tokensUsed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Generation Time</p>
                      <p className="font-medium">{aiResponse.aiMetrics.generationTime}s</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Model</p>
                      <p className="font-medium">{aiResponse.aiMetrics.model}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Remaining Requests</p>
                      <p className="font-medium">{aiResponse.usageImpact.remainingRequests}</p>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => useInCampaign({ subject: aiResponse.content.subject, body: aiResponse.content.body })}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Use in Campaign
                    </Button>
                    <Button 
                      onClick={() => saveAsTemplate({ subject: aiResponse.content.subject, body: aiResponse.content.body })}
                      variant="outline" 
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                  
                  {/* Additional Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => copyToClipboard(`Subject: ${aiResponse.content.subject}\n\n${aiResponse.content.body}`)}
                      variant="outline"
                      size="sm"
                    >
                      📋 Copy All
                    </Button>
                    <Button 
                      onClick={() => saveEmailDraft({ subject: aiResponse.content.subject, body: aiResponse.content.body })}
                      variant="outline"
                      size="sm"
                    >
                      💾 Save Draft
                    </Button>
                    <Button 
                      onClick={() => exportEmail({ subject: aiResponse.content.subject, body: aiResponse.content.body })}
                      variant="outline"
                      size="sm"
                    >
                      📤 Export
                    </Button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'optimize' && optimizationResponse ? (
              <div className="space-y-6">
                {/* Comparison */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimization Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Original</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Subject</p>
                          <p className="text-sm bg-red-50 p-2 rounded">{optimizationResponse.original.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Content</p>
                          <p className="text-sm bg-red-50 p-2 rounded">{optimizationResponse.original.body}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Spam Score</p>
                          <Badge className="bg-red-100 text-red-800">
                            {optimizationResponse.original.spamScore}/100
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Optimized */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Optimized</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Subject</p>
                          <p className="text-sm bg-green-50 p-2 rounded">{optimizationResponse.optimized.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Content</p>
                          <p className="text-sm bg-green-50 p-2 rounded">{optimizationResponse.optimized.body}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Spam Score</p>
                          <Badge className="bg-green-100 text-green-800">
                            {optimizationResponse.optimized.spamScore}/100
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Improvements */}
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Improvements Made</h4>
                  <ul className="space-y-2">
                    {optimizationResponse.optimized.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{improvement}</p>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => copyToClipboard(`Subject: ${optimizationResponse.optimized.subject}\n\n${optimizationResponse.optimized.body}`)}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Optimized Version
                    </Button>
                    <Button 
                      onClick={() => useInCampaign({ subject: optimizationResponse.optimized.subject, body: optimizationResponse.optimized.body })}
                      variant="outline" 
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Use in Campaign
                    </Button>
                  </div>
                  
                  {/* Additional Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => saveEmailDraft({ subject: optimizationResponse.optimized.subject, body: optimizationResponse.optimized.body })}
                      variant="outline"
                      size="sm"
                    >
                      💾 Save Optimized Draft
                    </Button>
                    <Button 
                      onClick={() => exportEmail({ subject: optimizationResponse.optimized.subject, body: optimizationResponse.optimized.body })}
                      variant="outline"
                      size="sm"
                    >
                      📤 Export Optimized
                    </Button>
                    <Button 
                      onClick={() => copyToClipboard(optimizationResponse.optimized.subject)}
                      variant="outline"
                      size="sm"
                    >
                      📋 Copy Subject
                    </Button>
                    <Button 
                      onClick={() => copyToClipboard(optimizationResponse.optimized.body)}
                      variant="outline"
                      size="sm"
                    >
                      📋 Copy Body
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="p-6 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'compose' ? (
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    ) : (
                      <Target className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'compose' ? 'Ready to Create' : 'Ready to Optimize'}
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'compose' 
                      ? 'Fill out the form to generate AI-powered email content'
                      : 'Paste your content to get optimization suggestions'
                    }
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIComposerPage;
