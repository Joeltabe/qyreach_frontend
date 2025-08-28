import { motion } from 'framer-motion'
import { ArrowLeft, Users, Target, Filter, UserPlus, Heart, TrendingUp, CheckCircle, Star, BarChart3, Mail, Zap, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const ContactManagement = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Advanced Segmentation",
      description: "Create sophisticated audience segments based on behavior, demographics, and engagement patterns."
    },
    {
      icon: <Filter className="w-8 h-8 text-green-500" />,
      title: "Dynamic List Management",
      description: "Automatically organize contacts with smart filters and real-time list updates based on criteria."
    },
    {
      icon: <Target className="w-8 h-8 text-purple-500" />,
      title: "Behavioral Targeting",
      description: "Target contacts based on their actions, preferences, and engagement history for maximum relevance."
    },
    {
      icon: <UserPlus className="w-8 h-8 text-orange-500" />,
      title: "Easy Import & Export",
      description: "Seamlessly import contacts from any source and export data whenever you need it."
    }
  ]

  const segmentationOptions = [
    {
      category: "Demographic Segmentation",
      description: "Organize contacts by personal and professional characteristics",
      options: [
        "Age and gender targeting",
        "Location-based segments",
        "Job title and industry",
        "Company size and type",
        "Income and education level",
        "Language preferences"
      ]
    },
    {
      category: "Behavioral Segmentation",
      description: "Group contacts based on their actions and engagement patterns",
      options: [
        "Email engagement history",
        "Website activity tracking",
        "Purchase behavior patterns",
        "Content preferences",
        "Frequency preferences",
        "Device and platform usage"
      ]
    },
    {
      category: "Lifecycle Segmentation",
      description: "Target contacts based on their customer journey stage",
      options: [
        "New subscribers",
        "Active customers",
        "Lapsed customers",
        "High-value customers",
        "At-risk customers",
        "Brand advocates"
      ]
    },
    {
      category: "Custom Segmentation",
      description: "Create unique segments based on your specific business needs",
      options: [
        "Custom field combinations",
        "Survey responses",
        "Event attendance",
        "Product interests",
        "Support interactions",
        "Social media engagement"
      ]
    }
  ]

  const managementFeatures = [
    {
      title: "Smart Import System",
      description: "Import contacts from multiple sources with intelligent duplicate detection and data validation.",
      features: [
        "CSV, Excel, and API imports",
        "Automatic duplicate detection",
        "Data validation and cleaning",
        "Field mapping assistance",
        "Import history tracking",
        "Error reporting and fixes"
      ]
    },
    {
      title: "Contact Profiles",
      description: "Comprehensive contact records with complete interaction history and preferences.",
      features: [
        "Complete contact timeline",
        "Custom field management",
        "Engagement scoring",
        "Preference tracking",
        "Tag management",
        "Notes and annotations"
      ]
    },
    {
      title: "List Hygiene Tools",
      description: "Maintain clean, engaged lists with automated cleaning and validation tools.",
      features: [
        "Email validation service",
        "Bounce management",
        "Suppression list handling",
        "Re-engagement campaigns",
        "Inactive contact removal",
        "Compliance management"
      ]
    },
    {
      title: "Privacy & Compliance",
      description: "Built-in tools to ensure GDPR, CAN-SPAM, and other privacy regulation compliance.",
      features: [
        "Consent management",
        "Data retention policies",
        "Right to be forgotten",
        "Audit trail logging",
        "Privacy preference centers",
        "Compliance reporting"
      ]
    }
  ]

  const integrationSources = [
    {
      category: "CRM Systems",
      platforms: ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "Microsoft Dynamics", "Close"],
      description: "Sync contacts and customer data bidirectionally"
    },
    {
      category: "E-commerce Platforms",
      platforms: ["Shopify", "WooCommerce", "Magento", "BigCommerce", "Squarespace", "Wix"],
      description: "Import customer and purchase data automatically"
    },
    {
      category: "Lead Generation Tools",
      platforms: ["OptinMonster", "Leadpages", "Unbounce", "ConvertKit", "Typeform", "Gravity Forms"],
      description: "Capture leads directly into your contact database"
    },
    {
      category: "Social & Advertising",
      platforms: ["Facebook Ads", "Google Ads", "LinkedIn", "Twitter", "Instagram", "TikTok"],
      description: "Import leads from advertising campaigns and social media"
    }
  ]

  const stats = [
    { value: "99.9%", label: "Data Accuracy", description: "Email validation success rate" },
    { value: "50%", label: "Time Saved", description: "On contact management tasks" },
    { value: "85%", label: "Better Targeting", description: "Improvement in campaign relevance" },
    { value: "40%", label: "Higher Engagement", description: "With segmented campaigns" }
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
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Contact Management</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Organize & Segment Your
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
                Audience Like a Pro
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced contact management and segmentation tools that help you organize your audience, 
              target the right people, and deliver personalized experiences that drive results.
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
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
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

      {/* Segmentation Options */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Segmentation Options
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create highly targeted segments using our comprehensive range of criteria and filters. 
              Deliver the right message to the right audience every time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {segmentationOptions.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {segment.category}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {segment.description}
                </p>
                <div className="space-y-3">
                  {segment.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{option}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Contact Management Suite
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your contacts effectively, from import to engagement 
              tracking and compliance management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {managementFeatures.map((feature, index) => (
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
                <div className="grid grid-cols-1 gap-2">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Sources */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Import from Anywhere
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with your existing tools and platforms to automatically sync contact data 
              and keep your audience up-to-date across all systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {integrationSources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {source.category}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {source.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {source.platforms.map((platform, platformIndex) => (
                    <span
                      key={platformIndex}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-green-600 p-12 rounded-2xl text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-4xl font-bold mb-6">
                  Segmentation That Drives Results
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  See how advanced contact management and segmentation helped businesses 
                  achieve remarkable improvements in their email marketing performance.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-200" />
                    <span>5x better targeting accuracy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-200" />
                    <span>40% increase in engagement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-blue-200" />
                    <span>Improved customer satisfaction</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm"
              >
                <div className="bg-white/10 p-6 rounded-xl mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-4">
                    "The segmentation tools transformed our email strategy. We went from one-size-fits-all 
                    campaigns to highly targeted messages that our customers actually want to receive."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">David Chen</div>
                      <div className="text-blue-100">Email Marketing Manager, RetailPlus</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">68%</div>
                    <div className="text-blue-100 text-sm">Open Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">25%</div>
                    <div className="text-blue-100 text-sm">Click Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">400%</div>
                    <div className="text-blue-100 text-sm">ROI Increase</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Smart Contact Management Matters
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Effective contact management isn't just about organizing data - it's about creating 
                meaningful connections that drive business growth.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Increase email relevance and engagement</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Reduce unsubscribes and spam complaints</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Improve deliverability and sender reputation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Maximize campaign ROI and revenue</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Build stronger customer relationships</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">10M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Contacts Managed</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <Eye className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Segmentation Accuracy</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">65%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Better Targeting</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Happy Marketers</div>
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
              Transform Your Contact Strategy Today
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start organizing and segmenting your audience like a pro. See how advanced contact 
              management can improve your email marketing results immediately.
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
                See Segmentation Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactManagement
