import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, TrendingUp, Eye, MousePointer, Users, Target, Calendar, Zap, CheckCircle, Star, PieChart, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'

const SmartAnalytics = () => {
  const features = [
    {
      icon: <Eye className="w-8 h-8 text-blue-500" />,
      title: "Real-Time Tracking",
      description: "Monitor opens, clicks, and engagement in real-time with instant notifications and live dashboard updates."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Conversion Attribution",
      description: "Track the complete customer journey from email click to purchase with multi-touch attribution modeling."
    },
    {
      icon: <PieChart className="w-8 h-8 text-purple-500" />,
      title: "Audience Insights",
      description: "Deep dive into subscriber behavior, preferences, and engagement patterns to optimize your strategy."
    },
    {
      icon: <LineChart className="w-8 h-8 text-orange-500" />,
      title: "Predictive Analytics",
      description: "AI-powered predictions for optimal send times, content preferences, and churn risk assessment."
    }
  ]

  const metrics = [
    {
      name: "Open Rate Optimization",
      value: "45%",
      change: "+12%",
      description: "Average improvement in open rates"
    },
    {
      name: "Click-Through Rate",
      value: "8.2%",
      change: "+25%",
      description: "Industry-leading CTR performance"
    },
    {
      name: "Conversion Tracking",
      value: "99.9%",
      change: "+0.1%",
      description: "Accuracy in conversion attribution"
    },
    {
      name: "ROI Visibility",
      value: "450%",
      change: "+150%",
      description: "Average ROI increase with insights"
    }
  ]

  const analyticsFeatures = [
    {
      category: "Email Performance",
      features: [
        "Open rates by device, location, and time",
        "Click heatmaps and link performance",
        "Bounce and unsubscribe tracking",
        "Subject line A/B testing results",
        "Send time optimization",
        "Deliverability monitoring"
      ]
    },
    {
      category: "Audience Analytics",
      features: [
        "Subscriber growth and churn analysis",
        "Engagement scoring and segmentation",
        "Geographic and demographic insights",
        "Behavioral pattern recognition",
        "Lifetime value calculations",
        "Re-engagement opportunities"
      ]
    },
    {
      category: "Revenue Attribution",
      features: [
        "Multi-touch attribution modeling",
        "Campaign ROI calculation",
        "Revenue per subscriber metrics",
        "Purchase journey mapping",
        "Cross-channel attribution",
        "Customer acquisition cost tracking"
      ]
    },
    {
      category: "Predictive Insights",
      features: [
        "Optimal send time predictions",
        "Content preference forecasting",
        "Churn risk assessment",
        "Engagement likelihood scoring",
        "Revenue forecasting",
        "Trend analysis and alerts"
      ]
    }
  ]

  const dashboardFeatures = [
    {
      title: "Executive Dashboard",
      description: "High-level KPIs and performance summaries perfect for leadership reporting.",
      benefits: ["Quick performance overview", "Trend identification", "Goal tracking"]
    },
    {
      title: "Campaign Deep Dive",
      description: "Detailed analytics for individual campaigns with granular performance data.",
      benefits: ["Click heatmaps", "Engagement timelines", "A/B test results"]
    },
    {
      title: "Audience Intelligence",
      description: "Comprehensive subscriber analytics and behavioral insights.",
      benefits: ["Segmentation analysis", "Engagement patterns", "Growth metrics"]
    },
    {
      title: "Revenue Analytics",
      description: "Complete revenue attribution and ROI analysis across all campaigns.",
      benefits: ["Attribution modeling", "Revenue tracking", "ROI calculations"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Smart Analytics</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Track, Analyze, and
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
                Optimize Every Campaign
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get deep insights into your email performance with advanced analytics that help you understand 
              what works, what doesn't, and how to improve your ROI with every campaign.
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                  {metric.change} vs industry avg
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                  {metric.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.description}
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

      {/* Analytics Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Comprehensive Analytics Suite
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every metric you need to understand your email performance and make data-driven decisions 
              that drive real business results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {analyticsFeatures.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Multiple Dashboard Views
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From high-level executive summaries to granular campaign analysis, 
              access the right level of detail for every stakeholder.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {dashboardFeatures.map((dashboard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {dashboard.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {dashboard.description}
                </p>
                <div className="space-y-2">
                  {dashboard.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Features */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Real-Time Analytics That Drive Action
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Don't wait for end-of-month reports. Monitor your campaigns as they happen 
                and make real-time optimizations that maximize performance.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-200" />
                  <span>Live open and click tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-200" />
                  <span>Instant performance alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-200" />
                  <span>Real-time A/B test results</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-200" />
                  <span>Automated reporting schedules</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-6">Success Story</h3>
              <div className="bg-white/10 p-6 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg mb-4">
                  "The real-time analytics helped us identify that our Tuesday sends were 
                  underperforming. We shifted to Wednesday and saw a 40% improvement immediately."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Marcus Thompson</div>
                    <div className="text-blue-100">VP Marketing, GrowthTech</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">40%</div>
                  <div className="text-blue-100 text-sm">Open Rate Boost</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">$75K</div>
                  <div className="text-blue-100 text-sm">Revenue Increase</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Seamless Integration & Export
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect your analytics with the tools you already use and export data 
              in the format you need for deeper analysis and reporting.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                CRM Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Sync analytics data with your CRM for complete customer insights and attribution.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Salesforce, HubSpot, Pipedrive & more
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                BI Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect to business intelligence platforms for advanced analytics and reporting.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Tableau, PowerBI, Looker & more
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MousePointer className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Export
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Export your data in multiple formats for custom analysis and reporting.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                CSV, JSON, API access & webhooks
              </div>
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
            className="bg-gradient-to-br from-blue-600 to-green-600 p-12 rounded-2xl text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Start Making Data-Driven Decisions Today
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of marketers who use our analytics to optimize their campaigns 
              and drive better results. Start your free trial and see the insights you've been missing.
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
                View Analytics Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default SmartAnalytics
