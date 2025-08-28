import { motion } from 'framer-motion'
import { ArrowLeft, Bot, Brain, Sparkles, Zap, Target, Users, TrendingUp, CheckCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const AIEmailGeneration = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      title: "Smart Content Analysis",
      description: "Our AI analyzes your brand voice, past campaigns, and audience engagement to generate personalized content that resonates."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Audience-Specific Messaging",
      description: "Create tailored messages for different customer segments, ensuring each email speaks directly to your audience's needs."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "Creative Variations",
      description: "Generate multiple versions of your emails for A/B testing, from subject lines to call-to-action buttons."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Instant Generation",
      description: "Create professional emails in seconds, not hours. Just provide a brief description and let AI do the heavy lifting."
    }
  ]

  const benefits = [
    "Increase open rates by up to 45% with AI-optimized subject lines",
    "Reduce content creation time by 80%",
    "Maintain consistent brand voice across all communications",
    "Generate emails in multiple languages automatically",
    "Optimize for mobile and desktop viewing",
    "Improve click-through rates with personalized CTAs"
  ]

  const useCases = [
    {
      title: "E-commerce Product Launches",
      description: "Generate compelling product announcements that drive sales and create buzz around new releases.",
      results: "Average 32% increase in launch day sales"
    },
    {
      title: "SaaS User Onboarding",
      description: "Create personalized welcome sequences that guide users through feature adoption and reduce churn.",
      results: "40% improvement in user activation rates"
    },
    {
      title: "B2B Lead Nurturing",
      description: "Develop sophisticated drip campaigns that educate prospects and move them through your sales funnel.",
      results: "25% higher conversion to sales qualified leads"
    },
    {
      title: "Retail Seasonal Campaigns",
      description: "Generate timely promotional content that captures seasonal shopping trends and maximizes revenue.",
      results: "Average 50% increase in seasonal revenue"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">AI-Powered Email Generation</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Create Compelling Emails with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Advanced AI Technology
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transform your email marketing with AI that understands your brand voice, analyzes your audience, 
              and generates high-converting content in seconds. No more writer's block, just results.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How AI Email Generation Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our advanced AI engine combines machine learning, natural language processing, 
              and marketing best practices to create emails that convert.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Brand Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our AI analyzes your existing content, brand guidelines, and previous successful campaigns 
                to understand your unique voice and messaging style.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Voice and tone analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Brand personality mapping
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Content pattern recognition
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Audience Intelligence
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We analyze your audience segments, engagement patterns, and preferences to create 
                personalized content that resonates with each group.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Behavioral pattern analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Engagement history review
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Demographic insights
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            >
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Content Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Based on your goals and audience insights, our AI generates multiple versions of 
                compelling email content optimized for maximum engagement.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Multiple content variations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  A/B testing suggestions
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Performance optimization
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Proven Results for Your Business
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of businesses that have transformed their email marketing 
                with AI-powered content generation.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white"
            >
              <h3 className="text-2xl font-bold mb-6">Customer Success Story</h3>
              <div className="bg-white/10 p-6 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg mb-4">
                  "Qyreach's AI email generation transformed our marketing. We went from spending 
                  hours crafting emails to generating high-converting content in minutes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Mitchell</div>
                    <div className="text-blue-100">Marketing Director, TechFlow</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">300%</div>
                  <div className="text-blue-100 text-sm">Open Rate Increase</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">85%</div>
                  <div className="text-blue-100 text-sm">Time Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">$50K</div>
                  <div className="text-blue-100 text-sm">Additional Revenue</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Perfect for Every Industry
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI adapts to your industry's unique requirements and generates content 
              that speaks your customers' language.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {useCase.description}
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      {useCase.results}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 rounded-2xl text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Email Marketing?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of businesses using AI to create compelling emails that convert. 
              Start your free trial today and see the difference AI can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AIEmailGeneration
