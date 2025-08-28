import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Send, 
  Smartphone, 
  Target, 
  BarChart3,
  Heart,
  Eye,
  MousePointer,
  Bell,
  Calendar,
  Globe,
  ArrowRight,
  Star,
  Check,
  Zap
} from 'lucide-react'
import dashboardLightImg from '../assets/dashboard-light.png'
import dashboardDarkImg from '../assets/dashboard-dark.png'

export function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [imageLoaded, setImageLoaded] = useState(false)

  // Email and SMS Marketing Animations
  const createMarketingAnimations = () => {
    const emailIcons = [Mail, Send, Heart, Eye, MousePointer, Bell];
    const smsIcons = [Smartphone, MessageSquare, Target, Users];
    const analyticsIcons = [BarChart3, TrendingUp, Calendar, Globe];
    
    const allIcons = [...emailIcons, ...smsIcons, ...analyticsIcons];
    
    return Array.from({ length: 15 }, (_, i) => {
      const IconComponent = allIcons[i % allIcons.length];
      const isEmail = i % 3 === 0;
      const isSMS = i % 3 === 1;
      const isAnalytics = i % 3 === 2;
      
      const startX = Math.random() * 80 + 10;
      const startY = Math.random() * 80 + 10;
      const endX = Math.random() * 80 + 10;
      const endY = Math.random() * 80 + 10;
      const midX = Math.random() * 80 + 10;
      const midY = Math.random() * 80 + 10;
      
      return (
        <motion.div
          key={`marketing-${i}`}
          className="absolute"
          initial={{ 
            opacity: 0, 
            scale: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0.3, 0],
            scale: [0, 1.2, 1, 0],
            x: [`${startX}vw`, `${midX}vw`, `${endX}vw`],
            y: [`${startY}vh`, `${midY}vh`, `${endY}vh`],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
        >
          <div className={`p-3 rounded-lg backdrop-blur-sm shadow-lg transition-all duration-500 ${
            isEmail ? 'bg-blue-500/20 text-blue-600 border border-blue-200/50' :
            isSMS ? 'bg-green-500/20 text-green-600 border border-green-200/50' :
            isAnalytics ? 'bg-purple-500/20 text-purple-600 border border-purple-200/50' :
            'bg-gray-500/20 text-gray-600 border border-gray-200/50'
          }`}>
            <IconComponent size={24} />
          </div>
        </motion.div>
      );
    });
  };

  const createFloatingEmailCards = () => {
    const emailData = [
      { subject: "Welcome to Qyreach!", from: "team@qyreach.com", time: "2m ago" },
      { subject: "Your campaign is live!", from: "notifications@qyreach.com", time: "5m ago" },
      { subject: "Analytics Report Ready", from: "reports@qyreach.com", time: "1h ago" },
      { subject: "New subscriber joined", from: "system@qyreach.com", time: "3h ago" }
    ];
    
    return emailData.map((email, i) => (
      <motion.div
        key={`email-card-${i}`}
        className="absolute max-w-xs"
        initial={{ opacity: 0, y: 100, rotate: -10 }}
        animate={{
          opacity: [0, 0.8, 0.6, 0],
          y: [100, -20, -50, -100],
          rotate: [-10, 5, -5, 10],
          x: [0, 50, -30, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          delay: i * 3,
          ease: "easeInOut"
        }}
        style={{
          left: `${20 + i * 20}%`,
          bottom: `${10 + i * 5}%`,
        }}
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">{email.time}</span>
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {email.subject}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            From: {email.from}
          </div>
        </div>
      </motion.div>
    ));
  };

  const createSMSBubbles = () => {
    const smsMessages = [
      "🎉 Campaign sent to 1,250 contacts",
      "📱 85% mobile open rate achieved",
      "🎯 Click rate increased by 300%",
      "✅ 50 new subscribers today"
    ];
    
    return smsMessages.map((message, i) => (
      <motion.div
        key={`sms-${i}`}
        className="absolute"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.9, 0.7, 0],
          scale: [0, 1.1, 1, 0],
          y: [0, -20, -40, -60]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: i * 2.5,
          ease: "easeOut"
        }}
        style={{
          right: `${10 + i * 15}%`,
          top: `${30 + i * 15}%`,
        }}
      >
        <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-lg max-w-xs">
          <div className="text-sm font-medium">{message}</div>
        </div>
      </motion.div>
    ));
  };

  const createAnalyticsCharts = () => {
    return Array.from({ length: 3 }, (_, i) => (
      <motion.div
        key={`chart-${i}`}
        className="absolute"
        initial={{ opacity: 0, rotate: -90 }}
        animate={{
          opacity: [0, 0.4, 0.2, 0],
          rotate: [-90, 0, 0, 90],
          scale: [0.5, 1, 0.8, 0.5]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: i * 4,
          ease: "easeInOut"
        }}
        style={{
          left: `${10 + i * 30}%`,
          top: `${60 + i * 10}%`,
        }}
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-blue-600" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Analytics</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, j) => (
              <motion.div
                key={j}
                className="w-2 bg-blue-500 rounded-t"
                animate={{
                  height: [4, Math.random() * 20 + 4, 4]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: j * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    ));
  };

  // Animated background particles
  const createParticles = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
        animate={{
          x: [0, 200, 0],
          y: [0, -150, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 6 + i * 0.5,
          repeat: Infinity,
          delay: i * 0.3,
        }}
        style={{
          left: `${5 + i * 12}%`,
          top: `${15 + i * 8}%`,
        }}
      />
    ))
  }

  const features = [
    {
      title: 'AI-Powered Email Generation',
      description: 'Create compelling emails with our advanced AI that understands your brand voice and audience.',
      icon: '🤖',
      link: '/services/ai-email-generation'
    },
    {
      title: 'Smart Analytics',
      description: 'Track opens, clicks, and conversions with detailed insights to optimize your campaigns.',
      icon: '📊',
      link: '/services/smart-analytics'
    },
    {
      title: 'Template Library',
      description: 'Choose from hundreds of professionally designed templates or create your own.',
      icon: '📧',
      link: '/services/template-library'
    },
    {
      title: 'Contact Management',
      description: 'Organize and segment your contacts for targeted marketing campaigns.',
      icon: '👥',
      link: '/services/contact-management'
    },
    {
      title: 'Automation Workflows',
      description: 'Set up automated email sequences that nurture leads and drive conversions.',
      icon: '⚡',
      link: '/services/automation-workflows'
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance and advanced data protection.',
      icon: '🔒',
      link: '/services/enterprise-security'
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      quote: 'Qyreach transformed our email marketing. Our open rates increased by 300% in just 3 months.',
      avatar: '/placeholder-user.jpg',
    },
    {
      name: 'Michael Chen',
      company: 'StartupXYZ',
      quote: 'The AI-powered content generation is incredible. It saves us 10+ hours per week.',
      avatar: '/placeholder-user.jpg',
    },
    {
      name: 'Emily Rodriguez',
      company: 'E-commerce Plus',
      quote: 'Best ROI we\'ve ever seen from an email platform. Highly recommended!',
      avatar: '/placeholder-user.jpg',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Marketing Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {createParticles()}
        {createMarketingAnimations()}
        {createFloatingEmailCards()}
        {createSMSBubbles()}
        {createAnalyticsCharts()}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-primary-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      {/* Navigation */}
      <nav className="relative z-20 px-6 py-4">
        <motion.div 
          className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 rounded-2xl px-6 py-3 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <motion.div 
              className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-bold text-lg">Q</span>
            </motion.div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Qyreach</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                key={theme}
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </motion.span>
            </motion.button>
            
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </motion.div>
            ) : (
              <div className="flex space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={() => navigate('/register')} className="flex items-center gap-2">
                    Get Started
                    <ArrowRight size={16} />
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AI-Powered Email
            </motion.span>
            <motion.span 
              className="text-primary-600 block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Marketing Platform
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Transform your email marketing with intelligent automation, beautiful templates, 
            and powerful analytics. 
            <motion.span
              className="font-semibold text-primary-600"
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(59, 130, 246, 0.5)",
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                  "0 0 0px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Boost your conversions by up to 300%.
            </motion.span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" onClick={() => navigate('/register')} className="relative overflow-hidden flex items-center gap-2">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: [-200, 200],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
                Start Free Trial
                <ArrowRight size={18} />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" onClick={() => navigate('/api-docs')}>
                View API Docs
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-600 dark:text-gray-300"
          >
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 relative"
          >
            <Card variant="glass" className="max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-0 relative">
                {/* Dashboard Image with Theme-based Display */}
                <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={theme}
                      src={theme === 'dark' ? dashboardDarkImg : dashboardLightImg}
                      alt={`Qyreach Dashboard - ${theme === 'dark' ? 'Dark' : 'Light'} Mode`}
                      className="w-full h-full object-cover object-top"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        // Fallback to placeholder if images don't exist
                        e.currentTarget.src = '/placeholder.jpg';
                      }}
                    />
                  </AnimatePresence>
                  
                  {/* Loading Shimmer Effect */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse">
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"></div>
                    </div>
                  )}
                  
                  {/* Floating Action Indicators */}
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <motion.div
                    className="absolute top-4 right-12 w-3 h-3 bg-blue-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  />
                  <motion.div
                    className="absolute top-4 right-20 w-3 h-3 bg-purple-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1,
                    }}
                  />
                </div>
                
                {/* Theme Toggle Hint */}
                <motion.div
                  className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  💡 Try switching themes above!
                </motion.div>
              </CardContent>
            </Card>
            
            {/* Dashboard Features Showcase */}
            <motion.div
              className="flex justify-center mt-8 space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time Analytics</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>AI-Powered Insights</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Smart Automation</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features designed to maximize your email marketing ROI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <Card variant="glass" className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105">
                    <CardHeader>
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                      <CardTitle className="group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all duration-300">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by thousands of companies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers have to say about Qyreach
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Ready to transform your email marketing?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-100 mb-8"
          >
            Join thousands of companies already using Qyreach to grow their business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/pricing')}>
              View Pricing
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-xl font-bold text-white">Qyreach</span>
            </div>
            
            <div className="flex space-x-6 text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Qyreach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
