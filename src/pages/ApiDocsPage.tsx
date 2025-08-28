import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Copy, Check, ExternalLink, Code, Book, Shield, Zap, Moon, Sun, Mail, Sparkles } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import api from '../lib/api'

interface Endpoint {
  method: string
  path: string
  description: string
  status: string
  params?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  requestBody?: string
  response?: string
}

interface TryItFormData {
  [key: string]: string
}

export function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({})
  const [tryItResults, setTryItResults] = useState<{ [key: string]: any }>({})
  const [tryItLoading, setTryItLoading] = useState<{ [key: string]: boolean }>({})
  const { theme, toggleTheme } = useTheme()

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const setTabActive = (endpointId: string, tabName: string) => {
    setActiveTab(prev => ({ ...prev, [endpointId]: tabName }))
  }

  const isTabActive = (endpointId: string, tabName: string) => {
    return activeTab[endpointId] === tabName || (!activeTab[endpointId] && tabName === 'request')
  }

  const tryEndpoint = async (endpointId: string, method: string, path: string, formData: TryItFormData) => {
    setTryItLoading(prev => ({ ...prev, [endpointId]: true }))
    
    try {
      let response
      if (method === 'POST' && path.includes('/api/auth/register')) {
        response = await api.post('/api/auth/register', formData)
      } else if (method === 'POST' && path.includes('/api/auth/login')) {
        response = await api.post('/api/auth/login', formData)
      } else {
        throw new Error('Endpoint not implemented in demo')
      }
      
      setTryItResults(prev => ({ ...prev, [endpointId]: response.data }))
    } catch (error: any) {
      const errorResponse = error.response?.data || { 
        success: false, 
        error: error.message,
        code: 'NETWORK_ERROR'
      }
      setTryItResults(prev => ({ ...prev, [endpointId]: errorResponse }))
    } finally {
      setTryItLoading(prev => ({ ...prev, [endpointId]: false }))
    }
  }

  const authEndpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/api/auth/register',
      status: '201',
      description: 'Register a new user and company with multi-tenant support',
      requestBody: `{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corp",
  "industry": "Technology",
  "companySize": "STARTUP"
}`,
      response: `{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": false
    },
    "company": {
      "id": "company_123",
      "name": "Acme Corp",
      "industry": "Technology",
      "subscriptionPlan": "FREE"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}`
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      status: '200',
      description: 'Authenticate user and get access tokens',
      requestBody: `{
  "email": "user@example.com",
  "password": "SecurePass123!"
}`,
      response: `{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "company": {
      "id": "company_123",
      "name": "Acme Corp",
      "subscriptionPlan": "STARTER",
      "userRole": "OWNER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}`
    }
  ]

  const emailEndpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/email/send-bulk',
      status: '200',
      description: 'Send bulk emails with advanced compliance checking and usage tracking',
      requestBody: `{
  "subject": "Welcome to our service!",
  "body": "Hello {{firstName}}, welcome to our amazing service!",
  "recipients": [
    {
      "email": "customer1@example.com",
      "firstName": "Alice",
      "lastName": "Johnson"
    }
  ],
  "senderName": "Acme Corp",
  "replyTo": "support@acme.com"
}`,
      response: `{
  "success": true,
  "message": "Bulk email sent successfully",
  "data": {
    "emailId": "email_batch_123",
    "totalRecipients": 1,
    "complianceCheck": {
      "isCompliant": true,
      "spamScore": 15,
      "riskLevel": "LOW"
    },
    "usageImpact": {
      "emailsUsed": 1,
      "remainingEmails": 999
    }
  }
}`
    }
  ]

  const aiEndpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/ai/compose',
      status: '200',
      description: 'Generate high-quality email content using AI with customizable tone and context',
      requestBody: `{
  "prompt": "Create a welcome email for new SaaS customers",
  "tone": "professional",
  "type": "email",
  "context": {
    "companyName": "Acme Corp",
    "productName": "Qyreach",
    "industry": "Technology"
  }
}`,
      response: `{
  "success": true,
  "message": "Content generated successfully",
  "data": {
    "content": {
      "subject": "Welcome to Qyreach - Let's Get Started!",
      "body": "Dear {{firstName}}, Welcome to Qyreach!...",
      "variables": ["firstName"],
      "estimatedEngagement": "High"
    },
    "usageImpact": {
      "aiRequestsUsed": 1,
      "remainingRequests": 49
    }
  }
}`
    }
  ]

  const codeExamples = {
    javascript: `// Initialize Qyreach API client
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Register user
const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

// Send bulk email
const sendBulkEmail = async (emailData) => {
  const response = await api.post('/api/email/send-bulk', emailData);
  return response.data;
};`,
    
    python: `import requests

# API Configuration
BASE_URL = 'http://localhost:3000/api'

class QyreachAPI:
    def __init__(self, token=None):
        self.token = token
        self.session = requests.Session()
        if token:
            self.session.headers.update({
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            })

    def register(self, user_data):
        response = self.session.post(f'{BASE_URL}/auth/register', json=user_data)
        return response.json()

    def send_bulk_email(self, email_data):
        response = self.session.post(f'{BASE_URL}/email/send-bulk', json=email_data)
        return response.json()

# Usage
api = QyreachAPI(token='your-jwt-token')
result = api.send_bulk_email({
    'subject': 'Welcome!',
    'body': 'Hello {{firstName}}!',
    'recipients': [{'email': 'user@example.com', 'firstName': 'John'}]
})`,
    
    curl: `# Register a new user
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Acme Corp"
  }'

# Send bulk email (with auth token)
curl -X POST http://localhost:3000/api/email/send-bulk \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "subject": "Welcome!",
    "body": "Hello {{firstName}}!",
    "recipients": [
      {
        "email": "user@example.com",
        "firstName": "John"
      }
    ]
  }'`
  }

  const reactHookExample = `import { useState, useEffect } from 'react';
import { api } from './api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const { user, tokens } = response.data.data;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setUser(user);
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/auth/profile')
        .then(response => setUser(response.data.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return { user, login, logout, loading };
};`

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '200': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case '201': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case '400': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case '401': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case '429': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-600 text-white'
      case 'POST': return 'bg-green-600 text-white'
      case 'PUT': return 'bg-orange-600 text-white'
      case 'DELETE': return 'bg-red-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const TryItForm = ({ endpoint, endpointId }: { endpoint: Endpoint; endpointId: string }) => {
    const [formData, setFormData] = useState<TryItFormData>({})

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
      tryEndpoint(endpointId, endpoint.method, endpoint.path, formData)
    }

    const getFormFields = () => {
      if (endpoint.path.includes('/api/auth/register')) {
        return [
          { name: 'email', type: 'email', placeholder: 'Email', required: true },
          { name: 'password', type: 'password', placeholder: 'Password', required: true },
          { name: 'firstName', type: 'text', placeholder: 'First Name', required: true },
          { name: 'lastName', type: 'text', placeholder: 'Last Name', required: true },
          { name: 'companyName', type: 'text', placeholder: 'Company Name', required: true },
          { name: 'industry', type: 'text', placeholder: 'Industry', required: false },
          { name: 'companySize', type: 'text', placeholder: 'Company Size (STARTUP, SMALL, etc.)', required: false }
        ]
      } else if (endpoint.path.includes('/api/auth/login')) {
        return [
          { name: 'email', type: 'email', placeholder: 'Email', required: true },
          { name: 'password', type: 'password', placeholder: 'Password', required: true }
        ]
      }
      return []
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-3">
          {getFormFields().map((field) => (
            <input
              key={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required={field.required}
            />
          ))}
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={tryItLoading[endpointId]}
          className="w-full"
        >
          {tryItLoading[endpointId] ? 'Trying...' : `Try ${endpoint.method} Request`}
        </Button>
        {tryItResults[endpointId] && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Response:</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(tryItResults[endpointId], null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  }

  const EndpointCard = ({ endpoint, index, endpointId }: { endpoint: Endpoint; index: number; endpointId: string }) => (
    <motion.div
      key={endpointId}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6"
    >
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 flex-wrap">
          <Badge className={getMethodColor(endpoint.method)}>
            {endpoint.method}
          </Badge>
          <code className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded">
            {endpoint.path}
          </code>
          <Badge className={getStatusBadgeColor(endpoint.status)}>
            {endpoint.status} {endpoint.status === '200' ? 'OK' : endpoint.status === '201' ? 'Created' : 'Error'}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
          {endpoint.description}
        </p>

        <Tabs defaultValue="request" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="try-it">Try It</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request">
            {endpoint.requestBody && (
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{endpoint.requestBody}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(endpoint.requestBody!, `${endpointId}-req`)}
                >
                  {copiedCode === `${endpointId}-req` ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="response">
            {endpoint.response && (
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{endpoint.response}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(endpoint.response!, `${endpointId}-res`)}
                >
                  {copiedCode === `${endpointId}-res` ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="try-it">
            <TryItForm endpoint={endpoint} endpointId={endpointId} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Theme Toggle */}
      <Button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 rounded-full p-3 bg-primary-600 hover:bg-primary-700 text-white"
        size="sm"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center items-center gap-3 mb-6">
              <Sparkles className="h-12 w-12 text-white" />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Qyreach API
              </h1>
            </div>
            <p className="text-xl text-primary-100 max-w-4xl mx-auto mb-8">
              Comprehensive documentation for the Qyreach SaaS Platform API with interactive testing
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30">
                <Shield className="h-4 w-4 mr-2" />
                API Status: Online
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30">
                <Code className="h-4 w-4 mr-2" />
                Version: 1.0.0
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30">
                <Zap className="h-4 w-4 mr-2" />
                Interactive Testing
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <a href="#auth" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200 text-gray-700 dark:text-gray-300">
                🔐 Authentication
              </a>
              <a href="#email" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200 text-gray-700 dark:text-gray-300">
                📧 Email Operations
              </a>
              <a href="#ai" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200 text-gray-700 dark:text-gray-300">
                🤖 AI Features
              </a>
              <a href="#pricing" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200 text-gray-700 dark:text-gray-300">
                💰 Pricing Plans
              </a>
              <a href="#errors" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200 text-gray-700 dark:text-gray-300">
                ⚠️ Error Codes
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Quick Jump
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-3">
                  <a href="#overview" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                    📚 Overview
                  </a>
                  <a href="#auth" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    🔐 Authentication
                  </a>
                  <a href="#email" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    📧 Email Operations
                  </a>
                  <a href="#ai" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    🤖 AI Features
                  </a>
                  <a href="#pricing" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    💰 Pricing Plans
                  </a>
                  <a href="#errors" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    ⚠️ Error Codes
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <section id="overview">
              <Card className="border-l-4 border-l-primary-600">
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center">
                    📚 API Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    The Qyreach API provides comprehensive bulk email functionality with multi-tenant support, 
                    usage tracking, AI-powered content generation, and advanced compliance features.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Development</h4>
                      <code className="text-sm text-blue-800 dark:text-blue-200">
                        http://localhost:3000/api
                      </code>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Production</h4>
                      <code className="text-sm text-green-800 dark:text-green-200">
                        https://api.qyreach.com/api
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Authentication Endpoints */}
            <section id="auth">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center">
                    🔐 Authentication Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Authentication Methods</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-amber-800 dark:text-amber-200">
                        <strong>JWT Token:</strong> <code className="bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded">Authorization: Bearer YOUR_JWT_TOKEN</code>
                      </p>
                      <p className="text-amber-800 dark:text-amber-200">
                        <strong>API Key:</strong> <code className="bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded">X-API-Key: YOUR_API_KEY</code>
                      </p>
                    </div>
                  </div>
                  {authEndpoints.map((endpoint, index) => (
                    <EndpointCard key={`auth-${index}`} endpoint={endpoint} index={index} endpointId={`auth-${index}`} />
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Email Endpoints */}
            <section id="email">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center">
                    📧 Email Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">✨ Bulk Email Features</h3>
                    <p className="text-green-800 dark:text-green-200 text-sm">
                      Send bulk emails with advanced compliance checking, usage tracking, and personalization support.
                    </p>
                  </div>
                  {emailEndpoints.map((endpoint, index) => (
                    <EndpointCard key={`email-${index}`} endpoint={endpoint} index={index} endpointId={`email-${index}`} />
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* AI Endpoints */}
            <section id="ai">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center">
                    🤖 AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      AI-Powered Content Generation
                    </h3>
                    <p className="text-purple-700 dark:text-purple-200">
                      Generate engaging email content, optimize for deliverability, and improve engagement 
                      rates using our advanced AI models with customizable tone and context.
                    </p>
                  </div>
                  {aiEndpoints.map((endpoint, index) => (
                    <EndpointCard key={`ai-${index}`} endpoint={endpoint} index={index} endpointId={`ai-${index}`} />
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Subscription Plans */}
            <section id="pricing">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center">
                    💰 Subscription Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      {
                        name: 'FREE',
                        price: '$0',
                        period: '/month',
                        features: ['100 emails/month', '10 AI requests', '1,000 contacts', '5 templates', 'Basic support']
                      },
                      {
                        name: 'STARTER',
                        price: '$29',
                        period: '/month',
                        features: ['1,000 emails/month', '50 AI requests', '5,000 contacts', '25 templates', 'API access']
                      },
                      {
                        name: 'PROFESSIONAL',
                        price: '$99',
                        period: '/month',
                        features: ['10,000 emails/month', '200 AI requests', '25,000 contacts', '100 templates', 'Advanced analytics', 'Priority support']
                      },
                      {
                        name: 'ENTERPRISE',
                        price: 'Custom',
                        period: '',
                        features: ['Unlimited emails', 'Unlimited AI requests', 'Unlimited contacts', 'Custom integrations', 'Dedicated support', 'SLA guarantees']
                      }
                    ].map((plan, index) => (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <h3 className="text-xl font-bold text-primary-600 mb-3">{plan.name}</h3>
                        <div className="mb-6">
                          <span className="text-3xl font-bold">{plan.price}</span>
                          <span className="text-gray-500">{plan.period}</span>
                        </div>
                        <ul className="space-y-3 text-left">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-800">
                    <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-4">
                      Need a Custom Enterprise Plan?
                    </h3>
                    <p className="text-primary-700 dark:text-primary-200 mb-6">
                      Enterprise customers with specific requirements can contact us for a custom solution with dedicated support and SLA guarantees.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                        <Mail className="h-5 w-5 mr-2" />
                        Contact Sales
                      </Button>
                      <Button size="lg" variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white">
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Schedule Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Error Codes */}
            <section id="errors">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center">
                    ⚠️ Error Responses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Error Format</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      All errors follow this standard format:
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}`}
                    </pre>
                  </div>

                  <div className="grid gap-6">
                    <div className="border border-red-200 dark:border-red-800 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-600 mb-3">400 - Bad Request</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "password": "Password too weak"
  }
}`}
                      </pre>
                    </div>

                    <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-yellow-600 mb-3">429 - Usage Limit Exceeded</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Usage limit exceeded",
  "code": "USAGE_LIMIT_EXCEEDED",
  "details": {
    "type": "monthly_emails",
    "limit": 1000,
    "used": 1000,
    "resetDate": "2025-09-01T00:00:00Z"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
