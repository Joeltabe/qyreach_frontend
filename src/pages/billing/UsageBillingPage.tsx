import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  Crown, 
  Mail, 
  Users, 
  Zap,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import api from '../../lib/api';

interface UsageData {
  currentPlan: {
    name: string;
    limits: {
      emailsPerMonth: number;
      aiRequestsPerMonth: number;
      maxContacts: number;
      maxTemplates: number;
    };
  };
  currentUsage: {
    emailsSent: number;
    aiRequestsMade: number;
    contactsStored: number;
    templatesCreated: number;
  };
  usagePercentage: {
    emails: number;
    aiRequests: number;
    contacts: number;
    templates: number;
  };
  monthlyTrend: Array<{
    month: string;
    emailsSent: number;
    aiRequests: number;
  }>;
}

interface BillingInfo {
  currentPlan: string;
  billingCycle: 'monthly' | 'annually';
  nextBillingDate: string;
  amount: number;
  paymentMethod: {
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
  };
  invoiceHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    downloadUrl: string;
  }>;
}

const UsageBillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'usage' | 'billing' | 'plans'>('usage');
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usageResponse, billingResponse] = await Promise.all([
        api.get('/api/analytics/usage'),
        api.get('/api/billing/info')
      ]);
      
      setUsageData(usageResponse.data.data);
      setBillingInfo(billingResponse.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { text: 'Critical', color: 'text-red-600', icon: AlertTriangle };
    if (percentage >= 75) return { text: 'Warning', color: 'text-yellow-600', icon: AlertTriangle };
    return { text: 'Good', color: 'text-green-600', icon: CheckCircle };
  };

  const plans = [
    {
      name: 'FREE',
      icon: '🆓',
      price: 0,
      features: [
        '100 emails/month',
        '10 AI requests',
        '1,000 contacts',
        '5 templates',
        'Basic support'
      ],
      limits: {
        emailsPerMonth: 100,
        aiRequestsPerMonth: 10,
        maxContacts: 1000,
        maxTemplates: 5
      }
    },
    {
      name: 'STARTER',
      icon: '🚀',
      price: 29,
      features: [
        '1,000 emails/month',
        '50 AI requests',
        '5,000 contacts',
        '25 templates',
        'Email support'
      ],
      limits: {
        emailsPerMonth: 1000,
        aiRequestsPerMonth: 50,
        maxContacts: 5000,
        maxTemplates: 25
      },
      popular: true
    },
    {
      name: 'PROFESSIONAL',
      icon: '💼',
      price: 99,
      features: [
        '10,000 emails/month',
        '200 AI requests',
        '25,000 contacts',
        '100 templates',
        'Advanced analytics',
        'Priority support'
      ],
      limits: {
        emailsPerMonth: 10000,
        aiRequestsPerMonth: 200,
        maxContacts: 25000,
        maxTemplates: 100
      }
    },
    {
      name: 'ENTERPRISE',
      icon: '👑',
      price: 299,
      features: [
        'Unlimited emails',
        'Unlimited AI requests',
        'Unlimited contacts',
        'Unlimited templates',
        'Custom integrations',
        'Dedicated support'
      ],
      limits: {
        emailsPerMonth: Infinity,
        aiRequestsPerMonth: Infinity,
        maxContacts: Infinity,
        maxTemplates: Infinity
      }
    }
  ];

  const tabs = [
    { id: 'usage', label: 'Usage Analytics', icon: BarChart3 },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'plans', label: 'Upgrade Plan', icon: Crown }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="text-brand-primary" />
                Usage & Billing
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor your usage and manage your subscription
              </p>
            </div>
            <div className="flex items-center gap-3">
              {usageData && (
                <Badge className="px-3 py-1 text-sm bg-brand-primary text-white">
                  {usageData.currentPlan.name} Plan
                </Badge>
              )}
              <Button variant="outline" onClick={fetchData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'usage' && usageData && (
            <div className="space-y-8">
              {/* Usage Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: 'Emails Sent',
                    current: usageData.currentUsage.emailsSent,
                    limit: usageData.currentPlan.limits.emailsPerMonth,
                    percentage: usageData.usagePercentage.emails,
                    icon: Mail,
                    color: 'blue'
                  },
                  {
                    label: 'AI Requests',
                    current: usageData.currentUsage.aiRequestsMade,
                    limit: usageData.currentPlan.limits.aiRequestsPerMonth,
                    percentage: usageData.usagePercentage.aiRequests,
                    icon: Zap,
                    color: 'purple'
                  },
                  {
                    label: 'Contacts',
                    current: usageData.currentUsage.contactsStored,
                    limit: usageData.currentPlan.limits.maxContacts,
                    percentage: usageData.usagePercentage.contacts,
                    icon: Users,
                    color: 'green'
                  },
                  {
                    label: 'Templates',
                    current: usageData.currentUsage.templatesCreated,
                    limit: usageData.currentPlan.limits.maxTemplates,
                    percentage: usageData.usagePercentage.templates,
                    icon: Calendar,
                    color: 'orange'
                  }
                ].map((metric) => {
                  const Icon = metric.icon;
                  const status = getUsageStatus(metric.percentage);
                  const StatusIcon = status.icon;

                  return (
                    <Card key={metric.label} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 bg-${metric.color}-100 rounded-lg`}>
                          <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                        </div>
                        <Badge className={`flex items-center gap-1 ${
                          metric.percentage >= 90 ? 'bg-red-100 text-red-800' :
                          metric.percentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.text}
                        </Badge>
                      </div>
                      
                      <h3 className="text-sm font-medium text-gray-500 mb-2">{metric.label}</h3>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-semibold text-gray-900">
                            {metric.current.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            / {metric.limit === Infinity ? '∞' : metric.limit.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={metric.percentage} 
                          className="h-2"
                        />
                      </div>
                      <p className="text-xs text-gray-600">
                        {metric.percentage.toFixed(1)}% used this month
                      </p>
                    </Card>
                  );
                })}
              </div>

              {/* Usage Trend */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Usage Trend</h3>
                <div className="space-y-4">
                  {usageData.monthlyTrend.map((month) => (
                    <div key={month.month} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium text-gray-600">
                        {month.month}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Emails</span>
                            <span className="font-medium">{month.emailsSent.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(month.emailsSent / usageData.currentPlan.limits.emailsPerMonth) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>AI Requests</span>
                            <span className="font-medium">{month.aiRequests}</span>
                          </div>
                          <Progress 
                            value={(month.aiRequests / usageData.currentPlan.limits.aiRequestsPerMonth) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Usage Alerts */}
              {usageData.usagePercentage.emails >= 75 && (
                <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-yellow-800">High Usage Alert</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        You've used {usageData.usagePercentage.emails.toFixed(1)}% of your monthly email limit. 
                        Consider upgrading your plan to avoid service interruption.
                      </p>
                      <Button className="mt-3" size="sm">
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'billing' && billingInfo && (
            <div className="space-y-8">
              {/* Current Plan */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Subscription</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Plan</label>
                        <p className="text-lg font-semibold text-gray-900">{billingInfo.currentPlan}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Billing Cycle</label>
                        <p className="text-gray-900 capitalize">{billingInfo.billingCycle}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Next Billing Date</label>
                        <p className="text-gray-900">
                          {new Date(billingInfo.nextBillingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Amount</label>
                        <p className="text-lg font-semibold text-gray-900">
                          ${billingInfo.amount}/{billingInfo.billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {billingInfo.paymentMethod.brand} •••• {billingInfo.paymentMethod.last4}
                          </p>
                          <p className="text-sm text-gray-500">Primary payment method</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3">
                        Update Payment Method
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Invoice History */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Invoice History</h3>
                  <Button variant="outline" size="sm">
                    Download All
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {billingInfo.invoiceHistory.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${invoice.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`flex items-center gap-1 ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status === 'paid' ? <CheckCircle className="w-3 h-3" /> :
                               invoice.status === 'pending' ? <RefreshCw className="w-3 h-3" /> :
                               <XCircle className="w-3 h-3" />}
                              {invoice.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="space-y-8">
              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.name} 
                    className={`p-6 relative ${plan.popular ? 'ring-2 ring-brand-primary' : ''}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white">
                        Most Popular
                      </Badge>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl mb-2">{plan.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${
                        plan.popular ? 'bg-brand-primary hover:bg-brand-primary/90' : ''
                      }`}
                      variant={plan.popular ? 'primary' : 'outline'}
                    >
                      {usageData?.currentPlan.name === plan.name ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Plan Comparison */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Feature Comparison</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                        {plans.map((plan) => (
                          <th key={plan.name} className="text-center py-3 px-4 font-medium text-gray-900">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { 
                          feature: 'Monthly Emails', 
                          values: plans.map(p => p.limits.emailsPerMonth === Infinity ? 'Unlimited' : p.limits.emailsPerMonth.toLocaleString())
                        },
                        { 
                          feature: 'AI Requests', 
                          values: plans.map(p => p.limits.aiRequestsPerMonth === Infinity ? 'Unlimited' : p.limits.aiRequestsPerMonth.toString())
                        },
                        { 
                          feature: 'Contacts', 
                          values: plans.map(p => p.limits.maxContacts === Infinity ? 'Unlimited' : p.limits.maxContacts.toLocaleString())
                        },
                        { 
                          feature: 'Templates', 
                          values: plans.map(p => p.limits.maxTemplates === Infinity ? 'Unlimited' : p.limits.maxTemplates.toString())
                        }
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-900">{row.feature}</td>
                          {row.values.map((value, valueIndex) => (
                            <td key={valueIndex} className="py-3 px-4 text-center text-gray-700">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Enterprise Contact */}
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Crown className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">Need a Custom Plan?</h4>
                    <p className="text-gray-600">
                      Contact our sales team for enterprise features, custom integrations, and volume discounts.
                    </p>
                  </div>
                  <Button>
                    Contact Sales
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UsageBillingPage;
