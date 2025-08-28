import { motion } from 'framer-motion'
import { ArrowLeft, Zap, GitBranch, Clock, Target, Users, TrendingUp, CheckCircle, Star, Mail, Send, BarChart3, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

const AutomationWorkflows = () => {
  const features = [
    {
      icon: <GitBranch className="w-8 h-8 text-purple-500" />,
      title: "Visual Workflow Builder",
      description: "Create complex automation sequences with our intuitive drag-and-drop interface - no coding required."
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "Smart Triggers",
      description: "Start workflows based on subscriber behavior, dates, email engagement, and hundreds of other triggers."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Conditional Logic",
      description: "Build sophisticated decision trees that adapt to each subscriber's unique journey and preferences."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      title: "Performance Tracking",
      description: "Monitor workflow performance with detailed analytics and optimization recommendations."
    }
  ]

  const workflowTypes = [
    {
      name: "Welcome & Onboarding",
      description: "Create powerful first impressions and guide new subscribers through your brand experience",
      icon: <Users className="w-12 h-12 text-blue-500" />,
      features: [
        "Multi-step welcome sequences",
        "Progressive profiling forms",
        "Product education series",
        "Preference center setup",
        "Brand introduction campaigns",
        "Getting started guides"
      ],
      results: "85% improvement in subscriber engagement"
    },
    {
      name: "Lead Nurturing",
      description: "Convert prospects into customers with targeted educational content and strategic follow-ups",
      icon: <TrendingUp className="w-12 h-12 text-green-500" />,
      features: [
        "Educational drip campaigns",
        "Lead scoring automation",
        "Behavioral triggers",
        "Content recommendation",
        "Sales-ready notifications",
        "Demo scheduling flows"
      ],
      results: "40% increase in sales qualified leads"
    },
    {
      name: "E-commerce Automation",
      description: "Recover abandoned carts, cross-sell products, and maximize customer lifetime value",
      icon: <Mail className="w-12 h-12 text-purple-500" />,
      features: [
        "Cart abandonment recovery",
        "Post-purchase follow-ups",
        "Product recommendations",
        "Win-back campaigns",
        "Replenishment reminders",
        "VIP customer recognition"
      ],
      results: "25% recovery rate on abandoned carts"
    },
    {
      name: "Re-engagement Campaigns",
      description: "Win back inactive subscribers and reduce list churn with targeted reactivation sequences",
      icon: <Send className="w-12 h-12 text-orange-500" />,
      features: [
        "Inactivity detection",
        "Progressive re-engagement",
        "Preference updates",
        "Content variety testing",
        "Sunset campaigns",
        "List cleaning automation"
      ],
      results: "30% reactivation success rate"
    }
  ]

  const triggerTypes = [
    {
      category: "Behavioral Triggers",
      description: "React to subscriber actions and engagement patterns",
      triggers: [
        "Email opens and clicks",
        "Website page visits",
        "Download completions",
        "Video watch time",
        "Social media engagement",
        "App usage patterns"
      ]
    },
    {
      category: "Time-Based Triggers",
      description: "Schedule communications at optimal times",
      triggers: [
        "Subscription anniversaries",
        "Birthday and special dates",
        "Inactivity periods",
        "Trial expiration",
        "Renewal reminders",
        "Seasonal campaigns"
      ]
    },
    {
      category: "Data Changes",
      description: "Respond to profile and preference updates",
      triggers: [
        "Contact field updates",
        "List membership changes",
        "Purchase history",
        "Location changes",
        "Preference modifications",
        "Score threshold reached"
      ]
    },
    {
      category: "Integration Triggers",
      description: "Connect with external systems and platforms",
      triggers: [
        "CRM status changes",
        "E-commerce purchases",
        "Support ticket creation",
        "Webinar attendance",
        "Survey responses",
        "API data updates"
      ]
    }
  ]

  const advancedFeatures = [
    {
      title: "A/B Testing Within Workflows",
      description: "Test different paths, content, and timing to optimize your automation performance.",
      benefits: ["Split test email content", "Compare timing strategies", "Test subject lines", "Optimize send frequency"]
    },
    {
      title: "Dynamic Content Personalization",
      description: "Adapt email content based on subscriber data, behavior, and preferences automatically.",
      benefits: ["Product recommendations", "Location-based content", "Behavioral triggers", "Custom field insertion"]
    },
    {
      title: "Multi-Channel Workflows",
      description: "Coordinate email campaigns with SMS, push notifications, and other channels.",
      benefits: ["Cross-channel messaging", "Channel preference respect", "Unified customer journey", "Consistent brand experience"]
    },
    {
      title: "Machine Learning Optimization",
      description: "AI-powered optimization that improves workflow performance over time.",
      benefits: ["Send time optimization", "Content selection", "Path recommendation", "Engagement prediction"]
    }
  ]

  const stats = [
    { value: "15x", label: "Better ROI", description: "Compared to one-off campaigns" },
    { value: "80%", label: "Time Savings", description: "On repetitive marketing tasks" },
    { value: "45%", label: "Higher Engagement", description: "With automated sequences" },
    { value: "320%", label: "Revenue Increase", description: "From marketing automation" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <div className="inline-flex items-center gap-3 bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-full mb-6">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-700 dark:text-purple-300">Automation Workflows</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Set Up Automated Email
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                Sequences That Convert
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create sophisticated automation workflows that nurture leads, engage customers, and drive conversions 
              while you sleep. No coding required - just smart marketing that works around the clock.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
              >
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
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

      {/* Workflow Types */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Pre-Built Workflow Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start with proven automation templates designed for common marketing scenarios, 
              then customize them to match your unique business needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {workflowTypes.map((workflow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    {workflow.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      {workflow.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {workflow.description}
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {workflow.results}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {workflow.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trigger Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Automation Triggers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start your workflows with the right triggers to ensure your messages reach subscribers 
              at the perfect moment for maximum impact and engagement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {triggerTypes.map((trigger, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {trigger.category}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {trigger.description}
                </p>
                <div className="space-y-3">
                  {trigger.triggers.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Advanced Automation Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Take your automation to the next level with advanced features that enable sophisticated 
              personalization, optimization, and multi-channel experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Builder Demo */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-12 rounded-2xl text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-4xl font-bold mb-6">
                  Visual Workflow Builder
                </h2>
                <p className="text-xl text-purple-100 mb-8">
                  Design complex automation sequences with our intuitive drag-and-drop builder. 
                  See exactly how your workflows will function before you activate them.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-6 h-6 text-purple-200" />
                    <span>Visual flowchart interface</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-purple-200" />
                    <span>Drag-and-drop simplicity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-purple-200" />
                    <span>Real-time workflow testing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-purple-200" />
                    <span>Pre-built template library</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm"
              >
                <h3 className="text-2xl font-bold mb-6">Success Metrics</h3>
                <div className="bg-white/10 p-6 rounded-xl mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-4">
                    "Building automation workflows used to take our team weeks. Now we can create 
                    sophisticated sequences in hours, not days."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <GitBranch className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Amanda Roberts</div>
                      <div className="text-purple-100">Automation Specialist, GrowthCorp</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">90%</div>
                    <div className="text-purple-100 text-sm">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">500%</div>
                    <div className="text-purple-100 text-sm">ROI Increase</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Setting up your first automation workflow is easier than you think. 
              Follow our simple process to start automating your email marketing today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Choose a Template
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start with one of our proven workflow templates or build from scratch using our visual builder.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Customize & Test
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Personalize your workflow with your content, set up triggers, and test the flow before going live.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Activate & Monitor
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Launch your workflow and track performance with real-time analytics and optimization suggestions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600 to-blue-600 p-12 rounded-2xl text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Automate Your Success?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join thousands of marketers who are saving time and increasing revenue with 
              automated email workflows. Start building your first automation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                See Workflow Builder
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AutomationWorkflows
