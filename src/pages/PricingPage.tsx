import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses and startups',
      features: [
        'Up to 1,000 contacts',
        '5,000 emails per month',
        'Basic templates',
        'Email support',
        'Basic analytics',
        'API access',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 10,000 contacts',
        '50,000 emails per month',
        'Premium templates',
        'Priority support',
        'Advanced analytics',
        'A/B testing',
        'Automation workflows',
        'API access',
        'Custom domains',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large organizations with advanced needs',
      features: [
        'Unlimited contacts',
        'Unlimited emails',
        'Custom templates',
        'Dedicated support',
        'Advanced analytics & reporting',
        'Advanced A/B testing',
        'Advanced automation',
        'Full API access',
        'Custom domains',
        'White-label solution',
        'Custom integrations',
        'SLA guarantee',
      ],
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes, we offer a 14-day free trial on all plans. No credit card required.',
    },
    {
      question: 'What happens if I exceed my email limit?',
      answer: 'We\'ll notify you when you\'re approaching your limit. You can upgrade your plan or purchase additional email credits.',
    },
    {
      question: 'Is there an API available?',
      answer: 'Yes, all plans include API access. Higher-tier plans have higher rate limits and additional API features.',
    },
    {
      question: 'Can I cancel at any time?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Choose the perfect plan for your business. Start with our free trial and scale as you grow.
          </motion.p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full ${plan.popular ? 'ring-2 ring-primary-600 shadow-xl' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'primary' : 'outline'}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            Need a custom solution?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-100 mb-8"
          >
            We offer custom enterprise solutions with dedicated support, custom integrations, 
            and volume discounts for large organizations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" variant="secondary">
              Contact Sales
            </Button>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
