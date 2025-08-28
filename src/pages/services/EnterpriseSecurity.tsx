import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Lock, Eye, UserCheck, FileText, AlertTriangle, CheckCircle, Star, Users, BarChart3, Globe, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const EnterpriseSecurity = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "SOC 2 Type II Compliance",
      description: "Rigorous security controls and regular audits ensure your data is protected to enterprise standards."
    },
    {
      icon: <Lock className="w-8 h-8 text-green-500" />,
      title: "Advanced Encryption",
      description: "End-to-end encryption for data in transit and at rest using industry-standard AES-256 encryption."
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-500" />,
      title: "Access Controls",
      description: "Granular permissions, multi-factor authentication, and role-based access controls for team security."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-orange-500" />,
      title: "Privacy Compliance",
      description: "Built-in GDPR, CCPA, and CAN-SPAM compliance tools to ensure you meet all regulatory requirements."
    }
  ]

  const securityStandards = [
    {
      standard: "SOC 2 Type II",
      description: "Annual third-party audits of our security controls and procedures",
      status: "Certified",
      details: [
        "Security availability controls",
        "Processing integrity verification",
        "Confidentiality measures",
        "Privacy protection protocols"
      ]
    },
    {
      standard: "ISO 27001",
      description: "International standard for information security management systems",
      status: "Certified",
      details: [
        "Risk management framework",
        "Continuous improvement process",
        "Regular security assessments",
        "Incident response procedures"
      ]
    },
    {
      standard: "GDPR Ready",
      description: "European data protection regulation compliance built-in",
      status: "Compliant",
      details: [
        "Data portability tools",
        "Right to be forgotten",
        "Consent management",
        "Data processing agreements"
      ]
    },
    {
      standard: "HIPAA Compatible",
      description: "Healthcare data protection for medical organizations",
      status: "Available",
      details: [
        "Business associate agreements",
        "Audit trail logging",
        "Access monitoring",
        "Secure data handling"
      ]
    }
  ]

  const dataProtection = [
    {
      category: "Data Encryption",
      description: "Multi-layered encryption protecting your data at every stage",
      features: [
        "AES-256 encryption at rest",
        "TLS 1.3 for data in transit",
        "End-to-end email encryption",
        "Encrypted database storage",
        "Secure key management",
        "Hardware security modules"
      ]
    },
    {
      category: "Access Security",
      description: "Comprehensive controls to ensure only authorized access",
      features: [
        "Multi-factor authentication (MFA)",
        "Single sign-on (SSO) integration",
        "Role-based permissions",
        "IP address restrictions",
        "Session timeout controls",
        "Failed login monitoring"
      ]
    },
    {
      category: "Infrastructure Security",
      description: "Enterprise-grade infrastructure with multiple security layers",
      features: [
        "AWS secure cloud hosting",
        "Network segmentation",
        "DDoS protection",
        "Intrusion detection systems",
        "Regular security scanning",
        "24/7 security monitoring"
      ]
    },
    {
      category: "Data Governance",
      description: "Complete control and visibility over your data lifecycle",
      features: [
        "Data retention policies",
        "Automated data purging",
        "Backup and recovery",
        "Data residency controls",
        "Audit trail logging",
        "Data loss prevention"
      ]
    }
  ]

  const complianceFeatures = [
    {
      title: "GDPR Compliance Tools",
      description: "Built-in features to help you comply with European data protection regulations.",
      tools: [
        "Consent management system",
        "Data subject request handling",
        "Right to be forgotten automation",
        "Data portability exports",
        "Privacy impact assessments",
        "Lawful basis tracking"
      ]
    },
    {
      title: "CAN-SPAM Compliance",
      description: "Automatic compliance with US anti-spam regulations for all email campaigns.",
      tools: [
        "Automatic unsubscribe links",
        "Sender identification",
        "Subject line validation",
        "Physical address inclusion",
        "Suppression list management",
        "Bounce handling automation"
      ]
    },
    {
      title: "Industry-Specific Compliance",
      description: "Additional compliance frameworks for regulated industries.",
      tools: [
        "HIPAA business associate agreements",
        "PCI DSS for payment data",
        "FERPA for educational institutions",
        "FINRA for financial services",
        "Custom compliance frameworks",
        "Compliance reporting dashboards"
      ]
    }
  ]

  const securityMetrics = [
    { value: "99.9%", label: "Uptime SLA", description: "Guaranteed platform availability" },
    { value: "< 1min", label: "Breach Detection", description: "Average threat detection time" },
    { value: "24/7", label: "Security Monitoring", description: "Continuous threat surveillance" },
    { value: "Zero", label: "Data Breaches", description: "In our company history" }
  ]

  const enterpriseFeatures = [
    {
      title: "Advanced User Management",
      description: "Comprehensive tools for managing team access and permissions across your organization.",
      capabilities: [
        "Unlimited user accounts",
        "Custom role definitions",
        "Department-based access",
        "Audit trail for all actions",
        "Bulk user management",
        "API access controls"
      ]
    },
    {
      title: "Data Residency Controls",
      description: "Choose where your data is stored and processed to meet local regulations.",
      capabilities: [
        "Multiple data center options",
        "Geographic data isolation",
        "Local data processing",
        "Cross-border transfer controls",
        "Compliance reporting",
        "Data sovereignty assurance"
      ]
    },
    {
      title: "Advanced Monitoring",
      description: "Real-time security monitoring and threat detection with instant alerts.",
      capabilities: [
        "Real-time threat detection",
        "Anomaly detection AI",
        "Security event correlation",
        "Automated incident response",
        "Custom security dashboards",
        "Integration with SIEM tools"
      ]
    },
    {
      title: "Backup & Recovery",
      description: "Enterprise-grade backup and disaster recovery to ensure business continuity.",
      capabilities: [
        "Automated daily backups",
        "Point-in-time recovery",
        "Cross-region replication",
        "Disaster recovery testing",
        "RTO/RPO guarantees",
        "Business continuity planning"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Enterprise Security</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Bank-Level Security with
              <span className="bg-gradient-to-r from-blue-600 to-gray-600 bg-clip-text text-transparent block">
                SOC 2 Compliance
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Protect your business and customer data with enterprise-grade security, comprehensive compliance 
              frameworks, and advanced data protection that meets the strictest industry standards.
            </p>
          </motion.div>

          {/* Security Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-4 gap-8 mb-20"
          >
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
              >
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {metric.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
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

      {/* Security Standards */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Industry-Leading Compliance Standards
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform meets or exceeds the most rigorous security and compliance standards 
              required by enterprise organizations and regulated industries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityStandards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {standard.standard}
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    {standard.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {standard.description}
                </p>
                <div className="space-y-3">
                  {standard.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Comprehensive Data Protection
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Multiple layers of security protect your data at every stage, from collection 
              and processing to storage and transmission.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {dataProtection.map((protection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {protection.category}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {protection.description}
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {protection.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Built-in Compliance Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Automated compliance features help you meet regulatory requirements without 
              the complexity of manual processes and documentation.
            </p>
          </motion.div>

          <div className="space-y-8">
            {complianceFeatures.map((compliance, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-1">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {compliance.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {compliance.description}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      {compliance.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Enterprise Security Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced security capabilities designed for large organizations with complex 
              requirements and global operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {enterpriseFeatures.map((feature, index) => (
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
                <div className="grid grid-cols-1 gap-3">
                  {feature.capabilities.map((capability, capabilityIndex) => (
                    <div key={capabilityIndex} className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{capability}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Transparency & Trust
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                We believe security requires transparency. Our open security practices, 
                regular audits, and clear policies ensure you can trust us with your most sensitive data.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-200" />
                  <span>Public security documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-200" />
                  <span>Regular third-party audits</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-blue-200" />
                  <span>Incident response transparency</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-200" />
                  <span>Global compliance monitoring</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-6">Customer Trust Story</h3>
              <div className="bg-white/10 p-6 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg mb-4">
                  "Security was our biggest concern when evaluating email platforms. Qyreach's 
                  SOC 2 compliance and transparent security practices gave us the confidence we needed."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Jennifer Walsh</div>
                    <div className="text-blue-100">CISO, SecureFinance Corp</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-blue-100 text-sm">Security Compliance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-blue-100 text-sm">Data Breaches</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Resources */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Security Resources & Documentation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access our comprehensive security documentation, compliance reports, 
              and resources to support your security evaluation and implementation.
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
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Security Whitepaper
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Detailed overview of our security architecture, controls, and compliance frameworks.
              </p>
              <Link
                to="/security-whitepaper"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                Download Whitepaper
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Compliance Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Access our latest SOC 2, ISO 27001, and other compliance audit reports.
              </p>
              <Link
                to="/compliance-reports"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                View Reports
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Security Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Schedule a personalized security assessment with our compliance team.
              </p>
              <Link
                to="/security-assessment"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                Schedule Assessment
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
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
            className="bg-gradient-to-br from-blue-600 to-gray-600 p-12 rounded-2xl text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready for Enterprise-Grade Security?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join enterprise organizations worldwide who trust Qyreach with their most sensitive data. 
              Experience security that doesn't compromise on functionality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Enterprise Trial
              </Link>
              <Link
                to="/contact-security"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Security Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EnterpriseSecurity
