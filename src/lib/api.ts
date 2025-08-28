import axios, { type AxiosResponse, type AxiosError, type AxiosRequestConfig } from 'axios'
import { shouldUseMockApi, MockApiService } from './mockApi'

// API Configuration for Qyreach Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Auth token management
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('accessToken', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('accessToken')
    delete api.defaults.headers.common['Authorization']
  }
}

export const setCompanyId = (id: string | null) => {
  if (id) {
    localStorage.setItem('companyId', id)
    api.defaults.headers.common['x-company-id'] = id
  } else {
    localStorage.removeItem('companyId')
    delete api.defaults.headers.common['x-company-id']
  }
}

// Initialize auth from localStorage
const savedToken = localStorage.getItem('accessToken')
const savedCompanyId = localStorage.getItem('companyId')

// For development: Set default dev tokens if no tokens are saved
const isDevelopment = import.meta.env.DEV
if (isDevelopment && !savedToken) {
  setAuthToken('dev-test-token-12345')
  setCompanyId('dev-company-12345')
  console.log('🚀 Using development authentication tokens')
} else {
  if (savedToken) {
    setAuthToken(savedToken)
  }
  if (savedCompanyId) {
    setCompanyId(savedCompanyId)
  }
}

// Set initial token and company ID if exists


// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 errors (token expired/invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens
          setAuthToken(accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        setAuthToken(null)
        setCompanyId(null)
        localStorage.removeItem('refreshToken')
        
        // Only redirect if we're not already on auth pages
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  details?: any
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
  isVerified: boolean
  lastLoginAt?: string
  createdAt: string
  companies: UserCompany[]
}

export interface Company {
  id: string
  name: string
  industry?: string
  size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE'
  subscriptionPlan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
  createdAt: string
}

export interface UserCompany {
  id: string
  userId: string
  companyId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  isActive: boolean
  company: Company
}

export interface UsageStats {
  emailsSent: number
  aiRequestsMade: number
  filesUploaded: number
  apiCallsMade: number
  contactsCreated: number
  templatesCreated: number
}

export interface PlanLimits {
  maxEmailsPerMonth: number
  maxAiRequestsPerMonth: number
  maxFilesPerMonth: number
  maxApiCallsPerMonth: number
  maxContacts: number
  maxTemplates: number
  canUseAi: boolean
  canUseBulkUpload: boolean
  canUseAdvancedAnalytics: boolean
}

export interface EmailTemplate {
  id: string
  companyId: string
  name: string
  subject: string
  content: string
  description?: string
  variables?: string[]
  category: 'MARKETING' | 'WELCOME' | 'FOLLOW_UP' | 'NEWSLETTER' | 'PROMOTIONAL' | 'TRANSACTIONAL' | 'CUSTOM'
  isActive: boolean
  useCount: number
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  name: string
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sent' | 'sending'
  recipients: number
  recipientList: string[]
  openRate?: number
  clickRate?: number
  sentAt?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
  templateId?: string
}

export interface CampaignAnalytics {
  campaignId: string
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalBounced: number
  totalUnsubscribed: number
  openRate: number
  clickRate: number
  bounceRate: number
  unsubscribeRate: number
  topLinks: Array<{
    url: string
    clicks: number
  }>
  opensByHour: Array<{
    hour: number
    opens: number
  }>
  clicksByHour: Array<{
    hour: number
    clicks: number
  }>
}

export interface Contact {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  tags: string[]
  isActive: boolean
  createdAt: string
}

export interface EmailHistory {
  id: string
  subject: string
  recipientCount: number
  status: 'PENDING' | 'SENDING' | 'COMPLETED' | 'FAILED'
  sentAt?: string
  createdAt: string
}

// Auth API
export const authApi = {
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    industry?: string
    companySize?: string
  }): Promise<AxiosResponse<ApiResponse<{ user: User; company: Company; tokens: { accessToken: string; refreshToken: string } }>>> =>
    api.post('/api/auth/register', data),

  login: (data: {
    email: string
    password: string
  }): Promise<AxiosResponse<ApiResponse<{ user: User; company: Company; tokens: { accessToken: string; refreshToken: string } }>>> =>
    api.post('/api/auth/login', data),

  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/api/auth/logout'),

  getProfile: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get('/api/auth/profile'),

  updateProfile: (data: {
    firstName?: string
    lastName?: string
    avatar?: string
  }): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.put('/api/auth/profile', data),

  changePassword: (data: {
    currentPassword: string
    newPassword: string
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/api/auth/change-password', data),

  refresh: (refreshToken: string): Promise<AxiosResponse<ApiResponse<{ user: User; company: Company; tokens: { accessToken: string; refreshToken: string } }>>> =>
    api.post('/api/auth/refresh', { refreshToken }),

  forgotPassword: (data: {
    email: string
    baseUrl?: string
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/api/auth/forgot-password', data),

  resetPassword: (data: {
    email: string
    token: string
    password: string
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/api/auth/reset-password', data),

  validateResetToken: (email: string, token: string): Promise<AxiosResponse<ApiResponse<{ valid: boolean }>>> =>
    api.get(`/api/auth/validate-reset-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`),
}

// Enhanced auth API with fallback to mock when backend is unavailable
export const enhancedAuthApi = {
  async login(data: { email: string; password: string }) {
    try {
      return await authApi.login(data)
    } catch (error: any) {
      // Only fall back to local API when backend is completely unavailable
      const isNetworkError = error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')
      
      if (shouldUseMockApi() && isNetworkError) {
        console.log('[FALLBACK] Backend unavailable, using local authentication service')
        const mockResult = await MockApiService.login(data.email, data.password)
        
        // Transform response to match expected API format
        return {
          data: mockResult,
          status: mockResult.success ? 200 : 401,
          statusText: mockResult.success ? 'OK' : 'Unauthorized',
          headers: {},
          config: {},
        } as AxiosResponse
      }
      throw error
    }
  },

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    industry?: string
    companySize?: string
  }) {
    try {
      return await authApi.register(data)
    } catch (error: any) {
      const isNetworkError = error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')
      const isBackendError = error.response?.status >= 500
      
      if (shouldUseMockApi() && (isNetworkError || isBackendError)) {
        console.log('[DEV] Backend unavailable or error, using mock API for registration')
        const mockResult = await MockApiService.register(data)
        
        return {
          data: mockResult,
          status: mockResult.success ? 200 : 400,
          statusText: mockResult.success ? 'OK' : 'Bad Request',
          headers: {},
          config: {},
        } as AxiosResponse
      }
      throw error
    }
  },

  async getProfile() {
    try {
      return await authApi.getProfile()
    } catch (error: any) {
      const isNetworkError = error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')
      const isAuthError = error.response?.status === 401
      
      if (shouldUseMockApi() && (isNetworkError || isAuthError)) {
        console.log('[DEV] Backend unavailable or auth error, using mock API for profile')
        const mockResult = await MockApiService.getProfile()
        
        return {
          data: mockResult,
          status: mockResult.success ? 200 : 401,
          statusText: mockResult.success ? 'OK' : 'Unauthorized',
          headers: {},
          config: {},
        } as AxiosResponse
      }
      throw error
    }
  },

  async forgotPassword(data: { email: string; baseUrl?: string }) {
    try {
      return await authApi.forgotPassword(data)
    } catch (error: any) {
      const isNetworkError = error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')
      const isBackendError = error.response?.status >= 500
      const isRateLimited = error.response?.status === 429 || error.response?.data?.code === 'RATE_LIMIT_EXCEEDED'
      
      // Don't use fallback for rate limiting - let the user see the rate limit message
      if (isRateLimited) {
        throw error
      }
      
      // Use mock API for network errors or backend errors in development
      if (shouldUseMockApi() && (isNetworkError || isBackendError)) {
        console.log('[DEV] Backend unavailable or error, using mock API for forgot password')
        
        const mockResult = await MockApiService.forgotPassword(data.email)
        
        return {
          data: mockResult,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse
      }
      throw error
    }
  },

  async resetPassword(data: { email: string; token: string; password: string }) {
    try {
      return await authApi.resetPassword(data)
    } catch (error: any) {
      const isNetworkError = error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')
      const isBackendError = error.response?.status >= 500
      
      if (shouldUseMockApi() && (isNetworkError || isBackendError)) {
        console.log('[DEV] Backend unavailable or error, using mock API for reset password')
        const mockResult = await MockApiService.resetPassword(data.email, data.token, data.password)
        
        return {
          data: mockResult,
          status: mockResult.success ? 200 : 400,
          statusText: mockResult.success ? 'OK' : 'Bad Request',
          headers: {},
          config: {},
        } as AxiosResponse
      }
      throw error
    }
  },

  async validateResetToken(email: string, token: string) {
    try {
      return await authApi.validateResetToken(email, token)
    } catch (error: any) {
      const isNetworkError = error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')
      const isBackendError = error.response?.status >= 500
      
      if (shouldUseMockApi() && (isNetworkError || isBackendError)) {
        console.log('[DEV] Backend unavailable or error, using mock API for validate reset token')
        const mockResult = await MockApiService.validateResetToken(email, token)
        
        return {
          data: mockResult,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse
      }
      throw error
    }
  },

  // Delegate other methods to original authApi
  logout: authApi.logout,
  updateProfile: authApi.updateProfile,
  changePassword: authApi.changePassword,
  refresh: authApi.refresh,
}

// Usage API
export const usageApi = {
  getStats: (): Promise<AxiosResponse<ApiResponse<UsageStats>>> =>
    api.get('/api/analytics/stats'),

  getLimits: (): Promise<AxiosResponse<ApiResponse<PlanLimits>>> =>
    api.get('/api/analytics/limits'),

  getAnalytics: (months?: number): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/api/analytics/usage', { params: { months } }),
}

// Email API
export const emailApi = {
  sendBulk: (data: {
    subject: string
    content: string
    recipients: string[]
    templateId?: string
  }): Promise<AxiosResponse<ApiResponse<{ jobId: string }>>> =>
    api.post('/api/email/send-bulk', data),

  getHistory: (page?: number, limit?: number): Promise<AxiosResponse<ApiResponse<{ emails: EmailHistory[]; total: number }>>> =>
    api.get('/api/email/history', { params: { page, limit } }),

  getTemplates: (): Promise<AxiosResponse<ApiResponse<{ templates: EmailTemplate[] }>>> =>
    api.get('/api/email/templates'),

  createTemplate: (data: {
    name: string
    subject: string
    content: string
  }): Promise<AxiosResponse<ApiResponse<{ template: EmailTemplate }>>> =>
    api.post('/api/email/templates', data),

  updateTemplate: (id: string, data: {
    name?: string
    subject?: string
    content?: string
    isActive?: boolean
  }): Promise<AxiosResponse<ApiResponse<{ template: EmailTemplate }>>> =>
    api.put(`/api/email/templates/${id}`, data),

  deleteTemplate: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/api/email/templates/${id}`),
}

// Campaigns API
export const campaignsApi = {
  getCampaigns: (page?: number, limit?: number, status?: string, search?: string): Promise<AxiosResponse<ApiResponse<{ campaigns: Campaign[]; total: number }>>> =>
    api.get('/api/campaigns', { params: { page, limit, status, search } }),

  getCampaign: (id: string): Promise<AxiosResponse<ApiResponse<{ campaign: Campaign }>>> =>
  api.get(`/api/campaigns/${id}`),

  createCampaign: (data: {
    name: string
    subject: string
    content: string
    recipients: string[]
    scheduledAt?: string
    templateId?: string
  }): Promise<AxiosResponse<ApiResponse<{ campaign: Campaign }>>> =>
  api.post('/api/campaigns', data),

  updateCampaign: (id: string, data: {
    name?: string
    subject?: string
    content?: string
    recipientList?: string[]
    scheduledAt?: string
    status?: 'draft' | 'scheduled' | 'sent' | 'sending'
  }): Promise<AxiosResponse<ApiResponse<{ campaign: Campaign }>>> =>
  api.put(`/api/campaigns/${id}`, data),

  deleteCampaign: (id: string): Promise<AxiosResponse<ApiResponse>> =>
  api.delete(`/api/campaigns/${id}`),

  sendCampaign: (id: string): Promise<AxiosResponse<ApiResponse<{ jobId: string }>>> =>
  api.post(`/api/campaigns/${id}/send`),

  scheduleCampaign: (id: string, scheduledAt: string): Promise<AxiosResponse<ApiResponse>> =>
  api.post(`/api/campaigns/${id}/schedule`, { scheduledAt }),

  getCampaignAnalytics: (id: string): Promise<AxiosResponse<ApiResponse<{ analytics: CampaignAnalytics }>>> =>
  api.get(`/api/campaigns/${id}/analytics`),
}

// Contacts API
export const contactsApi = {
  getContacts: (page?: number, limit?: number, search?: string): Promise<AxiosResponse<ApiResponse<{ contacts: Contact[]; total: number }>>> =>
    api.get('/api/contacts', { params: { page, limit, search } }),

  createContact: (data: {
    email: string
    firstName?: string
    lastName?: string
    company?: string
    tags?: string[]
  }): Promise<AxiosResponse<ApiResponse<{ contact: Contact }>>> =>
    api.post('/api/contacts', data),

  updateContact: (id: string, data: {
    firstName?: string
    lastName?: string
    company?: string
    tags?: string[]
    isActive?: boolean
  }): Promise<AxiosResponse<ApiResponse<{ contact: Contact }>>> =>
    api.put(`/api/contacts/${id}`, data),

  deleteContact: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/api/contacts/${id}`),

  importContacts: (file: File): Promise<AxiosResponse<ApiResponse<{ imported: number; failed: number }>>> => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/contacts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Company API
export const companyApi = {
  getCompany: (): Promise<AxiosResponse<ApiResponse<{ company: Company }>>> =>
    api.get('/api/company'),

  updateCompany: (data: {
    name?: string
    industry?: string
    size?: string
  }): Promise<AxiosResponse<ApiResponse<{ company: Company }>>> =>
    api.put('/api/company', data),

  getMembers: (): Promise<AxiosResponse<ApiResponse<{ members: UserCompany[] }>>> =>
    api.get('/api/company/members'),

  inviteMember: (data: {
    email: string
    role: 'ADMIN' | 'MEMBER' | 'VIEWER'
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/api/company/members/invite', data),

  updateMemberRole: (userId: string, role: 'ADMIN' | 'MEMBER' | 'VIEWER'): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/api/company/members/${userId}`, { role }),

  removeMember: (userId: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/api/company/members/${userId}`),
}

// File upload API
export const uploadApi = {
  uploadFile: (file: File, type: 'contacts' | 'template' | 'avatar'): Promise<AxiosResponse<ApiResponse<{ url: string; contacts?: Contact[] }>>> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// AI API - Comprehensive implementation matching backend
export const aiApi = {
  // Email composition with Gemini AI
  compose: (data: {
    prompt: string
    tone?: 'professional' | 'friendly' | 'casual'
    length?: 'short' | 'medium' | 'long'
    includeSubject?: boolean
    brandInfo?: {
      companyName: string
      industry: string
    }
    targetAudience?: string
    emailType?: 'marketing' | 'welcome' | 'newsletter' | 'sales' | 'follow-up'
  }): Promise<AxiosResponse<ApiResponse<{
    subject?: string
    content: string
    suggestions: string[]
    metadata: {
      tone: string
      length: string
      emailType: string
      generatedAt: string
      model: string
      provider: string
      requestTokens?: number
    }
  }>>> =>
    api.post('/api/ai/compose', data),

  // Improve email subject lines
  improveSubject: (data: {
    currentSubject: string
    emailContent?: string
    goal?: 'increase_open_rate' | 'improve_clarity' | 'add_urgency' | 'increase_curiosity'
  }): Promise<AxiosResponse<ApiResponse<{
    original: string
    improved_subjects: string[]
    reasoning: string
    generatedAt: string
    provider: string
  }>>> =>
    api.post('/api/ai/improve-subject', data),

  // Generate email variations for A/B testing
  generateVariations: (data: {
    content: string
    variationType?: 'tone' | 'length' | 'approach' | 'cta' | 'audience'
    count?: number
  }): Promise<AxiosResponse<ApiResponse<{
    original: string
    variationType: string
    variations: Array<{
      version: string
      content: string
      changes: string
    }>
    generatedAt: string
    provider: string
  }>>> =>
    api.post('/api/ai/generate-variations', data),

  // Comprehensive email analysis
  analyze: (data: {
    subject?: string
    content: string
  }): Promise<AxiosResponse<ApiResponse<{
    effectiveness_score: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    predicted_metrics: {
      open_rate: string
      click_rate: string
    }
    compliance_check: {
      has_clear_cta: boolean
      mobile_friendly: boolean | string
      spam_risk: string
      personalization?: string
    }
    improvement_priority?: string
    analyzedAt: string
    provider: string
  }>>> =>
    api.post('/api/ai/analyze', data),

  // Check AI service status
  getStatus: (): Promise<AxiosResponse<ApiResponse<{
    available: boolean
    configured: boolean
    working: boolean | null
    provider: string
    model: string
    api_key_status: string
    features: {
      compose: boolean
      improve_subject: boolean
      generate_variations: boolean
      analyze: boolean
    }
    last_test: string
  }>>> =>
    api.get('/api/ai/status'),

  // Legacy endpoints for backward compatibility
  generateContent: (data: {
    prompt: string
    type: 'email' | 'subject' | 'template'
    context?: string
  }): Promise<AxiosResponse<ApiResponse<{ content: string }>>> =>
    api.post('/api/ai/generate', data),

  optimizeContent: (data: {
    content: string
    type: 'email' | 'subject'
  }): Promise<AxiosResponse<ApiResponse<{ optimized: string; suggestions: string[] }>>> =>
    api.post('/api/ai/optimize', data),

  analyzeContent: (data: {
    content: string
    subject?: string
  }): Promise<AxiosResponse<ApiResponse<{ score: number; suggestions: string[]; risks: string[] }>>> =>
    api.post('/api/ai/analyze', data),
}

// Analytics API
export const analyticsApi = {
  getDashboard: (): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/api/analytics/dashboard'),

  getEmailAnalytics: (timeframe: 'week' | 'month' | 'quarter' | 'year'): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/api/analytics/emails', { params: { timeframe } }),

  getUsageAnalytics: (timeframe: 'week' | 'month' | 'quarter' | 'year'): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/api/analytics/usage', { params: { timeframe } }),
}

// Admin API (for admin users)
export const adminApi = {
  getSystemStats: (): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/api/admin/stats'),

  getUsers: (page?: number, limit?: number, search?: string): Promise<AxiosResponse<ApiResponse<{ users: User[]; total: number }>>> =>
    api.get('/api/admin/users', { params: { page, limit, search } }),

  getCompanies: (page?: number, limit?: number, search?: string): Promise<AxiosResponse<ApiResponse<{ companies: Company[]; total: number }>>> =>
    api.get('/api/admin/companies', { params: { page, limit, search } }),

  updateUserStatus: (userId: string, isActive: boolean): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/api/admin/users/${userId}/status`, { isActive }),

  updateCompanyPlan: (companyId: string, plan: string): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/api/admin/companies/${companyId}/plan`, { plan }),
}

export default api
