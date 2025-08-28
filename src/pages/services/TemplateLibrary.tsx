import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Palette, Layout, Smartphone, Monitor, Zap, CheckCircle, Star, Users, TrendingUp, Eye, MousePointer } from 'lucide-react'
import { Link } from 'react-router-dom'

const TemplateLibrary = () => {
  const features = [
    {
      icon: <Layout className="w-8 h-8 text-purple-500" />,
      title: "Professional Designs",
      description: "Beautiful, conversion-optimized templates designed by professional email marketers and designers."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      title: "Mobile-First Responsive",
      description: "All templates are built mobile-first and look perfect on every device and email client."
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-500" />,
      title: "Easy Customization",
      description: "Drag-and-drop editor with full customization options for colors, fonts, images, and layout."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Quick Setup",
      description: "Get started in minutes with pre-built templates that require minimal customization."
    }
  ]

  const templateCategories = [
    {
      name: "Welcome & Onboarding",
      count: 45,
      description: "Make great first impressions with new subscribers",
      templates: [
        "Welcome series starters",
        "Product onboarding flows",
        "Trial activation emails",
        "Getting started guides"
      ]
    },
    {
      name: "Promotional & Sales",
      count: 78,
      description: "Drive conversions with compelling offers",
      templates: [
        "Product launch announcements",
        "Sale and discount promotions",
        "Limited time offers",
        "Black Friday specials"
      ]
    },
    {
      name: "Newsletter & Content",
      count: 52,
      description: "Keep your audience engaged with valuable content",
      templates: [
        "Weekly newsletters",
        "Blog post announcements",
        "Curated content roundups",
        "Industry insights"
      ]
    },
    {
      name: "E-commerce",
      count: 89,
      description: "Maximize sales with retail-focused designs",
      templates: [
        "Cart abandonment recovery",
        "Product recommendations",
        "Order confirmations",
        "Review requests"
      ]
    },
    {
      name: "Events & Webinars",
      count: 34,
      description: "Promote and follow up on events effectively",
      templates: [
        "Event invitations",
        "Webinar reminders",
        "Post-event follow-ups",
        "Registration confirmations"
      ]
    },
    {
      name: "Seasonal & Holidays",
      count: 67,
      description: "Celebrate occasions with themed designs",
      templates: [
        "Holiday greetings",
        "Seasonal promotions",
        "New Year campaigns",
        "Valentine's Day specials"
      ]
    }
  ]

  const customizationFeatures = [
    {
      title: "Drag & Drop Editor",
      description: "Intuitive visual editor that lets you customize every element without coding knowledge.",
      features: ["Visual block editor", "Real-time preview", "Undo/redo functionality", "Mobile preview"]
    },
    {
      title: "Brand Consistency",
      description: "Maintain your brand identity across all communications with advanced styling options.",
      features: ["Custom color palettes", "Brand font integration", "Logo placement tools", "Style templates"]
    },
    {
      title: "Dynamic Content",
      description: "Personalize emails with dynamic content blocks that adapt to each subscriber.",
      features: ["Personalization tags", "Conditional content", "Product feeds", "Location-based content"]
    },
    {
      title: "A/B Testing Ready",
      description: "Built-in support for testing different template variations to optimize performance.",
      features: ["Subject line testing", "Content variations", "CTA button testing", "Send time optimization"]
    }
  ]

  const industryTemplates = [
    {
      industry: "SaaS & Technology",
      templates: 85,
      highlights: ["Trial conversion", "Feature announcements", "User onboarding", "Churn prevention"]
    },
    {
      industry: "E-commerce & Retail",
      templates: 120,
      highlights: ["Product showcases", "Abandoned cart", "Loyalty programs", "Seasonal sales"]
    },
    {
      industry: "Education & Training",
      templates: 42,
      highlights: ["Course announcements", "Student engagement", "Certification emails", "Alumni outreach"]
    },
    {
      industry: "Healthcare & Wellness",
      templates: 38,
      highlights: ["Appointment reminders", "Health tips", "Wellness programs", "Patient communications"]
    },
    {
      industry: "Financial Services",
      templates: 29,
      highlights: ["Account updates", "Investment insights", "Security alerts", "Market reports"]
    },
    {
      industry: "Real Estate",
      templates: 31,
      highlights: ["Property listings", "Market updates", "Open house invites", "Client testimonials"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-700 dark:text-purple-300">Template Library</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Hundreds of Professional
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Email Templates
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our extensive library of professionally designed, mobile-responsive email templates. 
              Customize them to match your brand and start engaging your audience in minutes.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-4 gap-8 mb-20"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Premium Templates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-300">Industry Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Mobile Responsive</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">Weekly</div>
              <div className="text-gray-600 dark:text-gray-300">New Additions</div>
            </div>
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

      {/* Template Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Templates for Every Occasion
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From welcome series to promotional campaigns, we have professionally designed templates 
              for every email marketing need.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templateCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                    {category.count} templates
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {category.description}
                </p>
                <div className="space-y-2">
                  {category.templates.map((template, templateIndex) => (
                    <div key={templateIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{template}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Advanced Customization Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Make every template uniquely yours with our powerful editing tools and customization options.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {customizationFeatures.map((feature, index) => (
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
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry-Specific Templates */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Industry-Specific Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Templates designed specifically for your industry, with messaging and design elements 
              that resonate with your target audience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industryTemplates.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {industry.industry}
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                    {industry.templates} templates
                  </span>
                </div>
                <div className="space-y-2">
                  {industry.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                    </div>
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
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-12 rounded-2xl text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-4xl font-bold mb-6">
                  From Template to Success Story
                </h2>
                <p className="text-xl text-purple-100 mb-8">
                  See how businesses transform their email marketing using our template library 
                  and achieve remarkable results in record time.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-purple-200" />
                    <span>90% faster email creation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-purple-200" />
                    <span>35% higher engagement rates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MousePointer className="w-6 h-6 text-purple-200" />
                    <span>Professional results without design skills</span>
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
                    "The template library saved us weeks of design work. We launched our email campaign 
                    in 2 days instead of 2 weeks, and the results exceeded all expectations."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Jessica Park</div>
                      <div className="text-purple-100">Head of Marketing, StyleCo</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">2 Days</div>
                    <div className="text-purple-100 text-sm">Launch Time</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">65%</div>
                    <div className="text-purple-100 text-sm">Open Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">$120K</div>
                    <div className="text-purple-100 text-sm">Campaign Revenue</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Perfect on Every Device
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              All our templates are rigorously tested across email clients and devices to ensure 
              your message looks perfect everywhere.
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
                <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Mobile Optimized
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Perfect rendering on all mobile devices with touch-friendly buttons and optimized layouts.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                iOS Mail, Gmail Mobile, Outlook Mobile
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Desktop Perfect
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Beautiful display on desktop email clients with proper formatting and image scaling.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Outlook, Apple Mail, Thunderbird
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Web Client Ready
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Consistent experience across all webmail clients with fallbacks for limited support.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Gmail, Yahoo, Outlook.com
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
            className="bg-gradient-to-br from-purple-600 to-pink-600 p-12 rounded-2xl text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Start Creating Beautiful Emails Today
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Access our complete template library and create professional emails in minutes. 
              No design experience required - just pick, customize, and send.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Browse Templates
              </Link>
              <Link
                to="/demo"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Try Editor Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default TemplateLibrary
