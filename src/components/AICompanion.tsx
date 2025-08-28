import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Minimize2, 
  Maximize2,
  Volume2,
  VolumeX,
  Zap,
  ArrowRight,
  User,
  Brain,
  Search,
  Navigation,
  BarChart3,
  Users,
  Shield
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  actions?: Array<{
    label: string
    action: () => void
    icon?: any
  }>
}

interface AICompanionProps {
  isOpen: boolean
  onToggle: () => void
}

  // Helper function to render markdown-style content as HTML
  const renderMessageContent = (content: string) => {
    // Convert markdown-style formatting to JSX elements
    const lines = content.split('\n')
    
    return lines.map((line, index) => {
      // Handle headers (## or **)
      if (line.includes('**') && line.includes('**')) {
        const parts = line.split('**')
        return (
          <div key={index} className="mb-2">
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? (
                <span key={partIndex} className="font-bold text-blue-600 dark:text-blue-400">
                  {part}
                </span>
              ) : (
                <span key={partIndex}>{part}</span>
              )
            )}
          </div>
        )
      }
      
      // Handle bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('🎯') || line.trim().startsWith('📧') || 
          line.trim().startsWith('📊') || line.trim().startsWith('🎨') || line.trim().startsWith('👥') || 
          line.trim().startsWith('⚡') || line.trim().startsWith('🔒') || line.trim().startsWith('🤖') ||
          line.trim().startsWith('🚀') || line.trim().startsWith('💡')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <span className="text-sm leading-relaxed">{line.trim()}</span>
          </div>
        )
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />
      }
      
      // Regular text
      return (
        <div key={index} className="text-sm leading-relaxed mb-1">
          {line}
        </div>
      )
    })
  }

const AICompanion = ({ isOpen, onToggle }: AICompanionProps) => {
  const getSmartWelcomeMessage = () => {
    const hour = new Date().getHours()
    let greeting = "Hello!"
    if (hour < 12) greeting = "Good morning!"
    else if (hour < 18) greeting = "Good afternoon!"
    else greeting = "Good evening!"

    return {
      id: '1',
      type: 'ai' as const,
      content: `${greeting} I'm your Qyreach AI assistant! 🚀

I'm trained on everything about our platform and can help you:

🎯 Navigate instantly to any feature
📧 Create campaigns with AI assistance  
📊 Analyze performance and get insights
🎨 Find perfect templates for your brand
👥 Manage contacts and segments
⚡ Set up automation that converts
🔒 Understand security features

Just tell me what you want to do! I understand natural language and can guide you anywhere on the platform. ✨`,
      timestamp: new Date(),
      actions: [
        { label: 'Create First Campaign', action: () => navigate('/campaigns/create'), icon: Zap },
        { label: 'Explore AI Features', action: () => navigate('/services/ai-email-generation'), icon: Bot },
        { label: 'View Dashboard', action: () => navigate('/dashboard'), icon: ArrowRight }
      ]
    }
  }

  const [messages, setMessages] = useState<Message[]>([getSmartWelcomeMessage()])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasSound, setHasSound] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Knowledge base about the website and its routes
  const websiteKnowledge = {
    routes: {
      '/': 'Landing page - Main homepage with features overview, testimonials, and getting started',
      '/login': 'Login page - User authentication',
      '/register': 'Registration page - Sign up for new account',
      '/pricing': 'Pricing page - Subscription plans and pricing information',
      '/dashboard': 'Main dashboard - User dashboard with campaign overview',
      '/campaigns': 'Campaigns page - Manage and view all email campaigns',
      '/campaigns/create': 'Create campaign - Build new email campaigns',
      '/analytics': 'Analytics page - Detailed campaign performance metrics',
      '/contacts': 'Contacts page - Manage contact lists and segments',
      '/templates': 'Templates page - Browse and manage email templates',
      '/ai-composer': 'AI Composer - AI-powered email content generation',
      '/email-designer': 'Email Designer - Visual email template builder',
      '/settings': 'Settings page - Account and platform configuration',
      '/services/ai-email-generation': 'AI Email Generation service details',
      '/services/smart-analytics': 'Smart Analytics service details',
      '/services/template-library': 'Template Library service details',
      '/services/contact-management': 'Contact Management service details',
      '/services/automation-workflows': 'Automation Workflows service details',
      '/services/enterprise-security': 'Enterprise Security service details'
    },
    features: {
      'ai-generation': {
        name: 'AI Email Generation',
        description: 'Create compelling email content with advanced AI',
        benefits: ['45% higher open rates', '80% time savings', 'Brand voice consistency'],
        capabilities: ['Multi-language support', 'A/B testing integration', 'Audience targeting']
      },
      'analytics': {
        name: 'Smart Analytics',
        description: 'Comprehensive performance tracking and insights',
        benefits: ['Real-time tracking', 'Conversion attribution', 'Predictive analytics'],
        capabilities: ['SOC 2 compliance', '99.9% uptime', 'Custom dashboards']
      },
      'templates': {
        name: 'Template Library',
        description: '500+ professional email designs',
        benefits: ['90% faster creation', 'Mobile responsive', 'Industry-specific'],
        capabilities: ['Drag-and-drop editor', 'Brand customization', 'Asset library']
      },
      'contacts': {
        name: 'Contact Management',
        description: 'Advanced segmentation and list management',
        benefits: ['40% higher engagement', 'Dynamic segmentation', 'GDPR compliance'],
        capabilities: ['Behavioral targeting', 'CRM integration', 'Import/export tools']
      },
      'automation': {
        name: 'Automation Workflows',
        description: '24/7 automated email sequences',
        benefits: ['15x better ROI', '80% time savings', '320% revenue increase'],
        capabilities: ['Visual builder', 'Machine learning', 'Pre-built templates']
      },
      'security': {
        name: 'Enterprise Security',
        description: 'Bank-level security and compliance',
        benefits: ['Zero data breaches', '99.9% uptime', 'Comprehensive audits'],
        capabilities: ['SOC 2 Type II', 'ISO 27001', 'GDPR compliance']
      }
    },
    quickActions: [
      { name: 'Create Campaign', route: '/campaigns/create', icon: 'Zap' },
      { name: 'View Analytics', route: '/analytics', icon: 'BarChart3' },
      { name: 'Browse Templates', route: '/templates', icon: 'Search' },
      { name: 'Manage Contacts', route: '/contacts', icon: 'Users' },
      { name: 'Try AI Composer', route: '/ai-composer', icon: 'Brain' },
      { name: 'View Dashboard', route: '/dashboard', icon: 'Home' }
    ]
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const playNotificationSound = () => {
    if (hasSound) {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  const simulateTyping = (text: string, callback: () => void) => {
    setIsTyping(true)
    
    // More realistic typing simulation based on content length and complexity
    const baseSpeed = 15 // Base characters per interval
    const hasEmojis = /[\u{1F600}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu.test(text)
    const hasFormatting = text.includes('**') || text.includes('\n')
    
    let adjustedSpeed = baseSpeed
    if (hasEmojis) adjustedSpeed += 5 // Slower for emojis
    if (hasFormatting) adjustedSpeed += 10 // Slower for formatted text
    
    // Realistic typing duration (50-150 WPM equivalent)
    const wordsPerMinute = 120
    const words = text.split(' ').length
    const typingDuration = Math.max((words / wordsPerMinute) * 60 * 1000, 500)
    const maxDuration = 3000 // Cap at 3 seconds for UX
    
    const finalDuration = Math.min(typingDuration, maxDuration)
    
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, finalDuration)
  }

  const generateAIResponse = (userMessage: string): { content: string; actions?: Array<{label: string, action: () => void, icon?: any}> } => {
    const message = userMessage.toLowerCase()

    // Advanced pattern matching for better understanding
    const patterns = {
      navigation: /go to|navigate|take me|show me|open|visit/,
      creation: /create|new|build|make|start|begin/,
      analytics: /analytics|reports?|performance|metrics|stats|data|insights/,
      campaigns: /campaign|email|send|blast|newsletter/,
      templates: /template|design|layout|theme/,
      contacts: /contact|list|segment|audience|subscriber|customer/,
      ai: /ai|artificial|intelligent|smart|generate|write|compose/,
      automation: /automat|workflow|sequence|drip|nurture/,
      security: /security|safe|protect|complian|gdpr|soc/,
      pricing: /pric|cost|plan|subscription|payment|billing/,
      help: /help|assist|support|guide|tutorial|how/,
      features: /feature|service|capabilit|function|tool/
    }

    // Smart navigation with contextual understanding
    if (patterns.navigation.test(message)) {
      if (message.includes('dashboard') || message.includes('home')) {
        return {
          content: "🏠 Taking you to your dashboard! This is your command center where you can see campaign overviews, recent activity, and quick actions.",
          actions: [{ label: 'Open Dashboard', action: () => navigate('/dashboard'), icon: ArrowRight }]
        }
      }
      
      if (message.includes('analytics') || message.includes('reports')) {
        return {
          content: "📊 Let's dive into your analytics! Here you'll find comprehensive performance data, conversion tracking, and actionable insights to optimize your campaigns.",
          actions: [{ label: 'View Analytics', action: () => navigate('/analytics'), icon: BarChart3 }]
        }
      }
      
      if (message.includes('campaign')) {
        return {
          content: "📧 Perfect! I can take you to campaigns where you can view all your email campaigns or create new ones.",
          actions: [
            { label: 'View Campaigns', action: () => navigate('/campaigns'), icon: ArrowRight },
            { label: 'Create New Campaign', action: () => navigate('/campaigns/create'), icon: Zap }
          ]
        }
      }
    }

    // Enhanced campaign creation with smart suggestions
    if ((patterns.creation.test(message) && patterns.campaigns.test(message)) || message.includes('new campaign')) {
      return {
        content: "🚀 Ready to create something amazing? Our campaign builder includes AI-powered content generation, professional templates, and advanced targeting options!",
        actions: [
          { label: 'Create Campaign', action: () => navigate('/campaigns/create'), icon: Zap },
          { label: 'Try AI Composer First', action: () => navigate('/ai-composer'), icon: Brain }
        ]
      }
    }

    // Analytics with specific insights
    if (patterns.analytics.test(message) || message.includes('performance')) {
      const insights = [
        "📈 Open rates trending analysis",
        "🎯 Click-through optimization",
        "💰 Revenue attribution tracking",
        "👥 Audience engagement patterns"
      ]
      
      return {
        content: `📊 Your analytics dashboard provides deep insights:\n\n${insights.join('\n')}\n\nI'll take you there to explore your data!`,
        actions: [{ label: 'Open Analytics', action: () => navigate('/analytics'), icon: BarChart3 }]
      }
    }

    // Template browsing with intelligent suggestions
    if (patterns.templates.test(message) || message.includes('design')) {
      return {
        content: "🎨 Explore our template library! We have 500+ professionally designed templates for every industry and occasion. You can also use our visual email designer for custom creations.",
        actions: [
          { label: 'Browse Templates', action: () => navigate('/templates'), icon: Search },
          { label: 'Email Designer', action: () => navigate('/email-designer'), icon: Sparkles },
          { label: 'Template Service Details', action: () => navigate('/services/template-library'), icon: ArrowRight }
        ]
      }
    }

    // Contact management with segmentation focus
    if (patterns.contacts.test(message) || message.includes('list') || message.includes('segment')) {
      return {
        content: "👥 Smart contact management is key to successful campaigns! Create dynamic segments, track engagement, and organize your audience for maximum impact.",
        actions: [
          { label: 'Manage Contacts', action: () => navigate('/contacts'), icon: Users },
          { label: 'Segmentation Guide', action: () => navigate('/services/contact-management'), icon: ArrowRight }
        ]
      }
    }

    // AI features with detailed explanations
    if (patterns.ai.test(message) && (message.includes('write') || message.includes('compose') || message.includes('generate'))) {
      return {
        content: "🤖 Our AI Composer is powered by advanced language models trained specifically for email marketing! It understands your brand voice, audience preferences, and conversion best practices.",
        actions: [
          { label: 'Try AI Composer', action: () => navigate('/ai-composer'), icon: Brain },
          { label: 'AI Features Details', action: () => navigate('/services/ai-email-generation'), icon: ArrowRight }
        ]
      }
    }

    // Automation workflows with use cases
    if (patterns.automation.test(message) || message.includes('workflow')) {
      const workflows = [
        "🎯 Welcome series for new subscribers",
        "🛒 Cart abandonment recovery",
        "💎 Lead nurturing sequences",
        "🔄 Re-engagement campaigns"
      ]
      
      return {
        content: `⚡ Automation workflows that work 24/7:\n\n${workflows.join('\n')}\n\nSet them up once and watch them convert!`,
        actions: [
          { label: 'Explore Automation', action: () => navigate('/services/automation-workflows'), icon: Zap },
          { label: 'Create Workflow', action: () => navigate('/campaigns/create'), icon: ArrowRight }
        ]
      }
    }

    // Security with compliance details
    if (patterns.security.test(message) || message.includes('compliance')) {
      return {
        content: "🔒 Enterprise-grade security with SOC 2 Type II compliance! We protect your data with bank-level encryption, advanced access controls, and comprehensive audit trails.",
        actions: [
          { label: 'Security Details', action: () => navigate('/services/enterprise-security'), icon: Shield },
          { label: 'Compliance Reports', action: () => navigate('/services/enterprise-security'), icon: ArrowRight }
        ]
      }
    }

    // Pricing with value proposition
    if (patterns.pricing.test(message) || message.includes('cost') || message.includes('plan')) {
      return {
        content: "💰 Flexible pricing that scales with your business! Start with our free trial (no credit card required) and upgrade as you grow. Every plan includes our core AI features.",
        actions: [
          { label: 'View Pricing', action: () => navigate('/pricing'), icon: ArrowRight },
          { label: 'Start Free Trial', action: () => navigate('/register'), icon: Zap }
        ]
      }
    }

    // Feature overview with service details
    if (patterns.features.test(message) || message.includes('what can')) {
      return {
        content: `🌟 Qyreach's Powerful Features:

🤖 AI Email Generation - Smart content creation
📊 Smart Analytics - Deep performance insights  
📧 Template Library - 500+ professional designs
👥 Contact Management - Advanced segmentation
⚡ Automation Workflows - 24/7 lead nurturing
🔒 Enterprise Security - SOC 2 compliant

Which would you like to explore?`,
        actions: [
          { label: 'AI Features', action: () => navigate('/services/ai-email-generation'), icon: Bot },
          { label: 'View All Services', action: () => navigate('/'), icon: Sparkles },
          { label: 'Start Free Trial', action: () => navigate('/register'), icon: Zap }
        ]
      }
    }

    // Help and guidance
    if (patterns.help.test(message) || message.includes('guide')) {
      return {
        content: `🎯 I'm your Qyreach expert! I can help you:

• Navigate to any feature or page
• Explain our AI-powered tools  
• Guide you through campaign creation
• Show analytics and insights
• Help with contact management
• Answer pricing questions

Just tell me what you need! 🚀`,
        actions: [
          { label: 'Quick Start Guide', action: () => navigate('/dashboard'), icon: Navigation },
          { label: 'Explore Features', action: () => navigate('/'), icon: Sparkles },
          { label: 'Create First Campaign', action: () => navigate('/campaigns/create'), icon: Zap }
        ]
      }
    }

    // Sign up and trial
    if (message.includes('sign up') || message.includes('register') || message.includes('free trial')) {
      return {
        content: "🎉 Ready to transform your email marketing? Our 14-day free trial includes full access to all features - AI generation, analytics, templates, automation, and more!",
        actions: [
          { label: 'Start Free Trial', action: () => navigate('/register'), icon: Zap },
          { label: 'See What\'s Included', action: () => navigate('/pricing'), icon: ArrowRight }
        ]
      }
    }

    // Intelligent fallback with contextual suggestions
    const fallbackSuggestions = [
      { text: "Create a new campaign", action: () => navigate('/campaigns/create'), icon: Zap },
      { text: "View analytics dashboard", action: () => navigate('/analytics'), icon: BarChart3 },
      { text: "Browse email templates", action: () => navigate('/templates'), icon: Search },
      { text: "Try AI email composer", action: () => navigate('/ai-composer'), icon: Brain },
      { text: "Manage contacts & segments", action: () => navigate('/contacts'), icon: Users }
    ]

    return {
      content: `🤔 I understand you're looking for help! Here are some popular actions:

Try asking me:
• "Create a new campaign"
• "Show me analytics"  
• "Browse templates"
• "Help with contacts"
• "Explain AI features"
• "What are your security features?"

Or choose a quick action below: 👇`,
      actions: fallbackSuggestions.map(suggestion => ({
        label: suggestion.text,
        action: suggestion.action,
        icon: suggestion.icon
      }))
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI processing
    const response = generateAIResponse(input.trim())
    
    simulateTyping(response.content, () => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
      playNotificationSound()
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Bot className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="font-semibold">Qyreach AI</h3>
            <p className="text-xs text-blue-100">Your intelligent companion</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHasSound(!hasSound)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {hasSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white rounded-2xl rounded-br-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-md'
                } p-3 shadow-sm`}>
                  <div className="flex items-start gap-2">
                    {message.type === 'ai' && (
                      <Bot className="w-4 h-4 mt-1 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-4 h-4 mt-1 text-blue-100 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm">{renderMessageContent(message.content)}</div>
                      {message.actions && (
                        <div className="mt-3 space-y-2">
                          {message.actions.map((action, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={action.action}
                              className="flex items-center gap-2 w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              {action.icon && <action.icon size={14} />}
                              {action.label}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Qyreach..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-xl transition-colors"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default AICompanion
