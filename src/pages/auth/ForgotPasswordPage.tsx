import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Clock } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { enhancedAuthApi } from '../../lib/api'
import toast from 'react-hot-toast'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Check for existing rate limit on component mount
  useEffect(() => {
    const storedRateLimit = localStorage.getItem('passwordResetRateLimit')
    if (storedRateLimit) {
      const { timestamp, duration } = JSON.parse(storedRateLimit)
      const elapsed = Math.floor((Date.now() - timestamp) / 1000)
      const remaining = duration - elapsed
      
      if (remaining > 0) {
        setRateLimited(true)
        setCountdown(remaining)
      } else {
        localStorage.removeItem('passwordResetRateLimit')
      }
    }
  }, [])

  // Save rate limit to localStorage when it's set
  const setRateLimitWithStorage = (seconds: number) => {
    setRateLimited(true)
    setCountdown(seconds)
    localStorage.setItem('passwordResetRateLimit', JSON.stringify({
      timestamp: Date.now(),
      duration: seconds
    }))
  }

  // Clear rate limit from localStorage
  const clearRateLimit = () => {
    setRateLimited(false)
    setCountdown(0)
    localStorage.removeItem('passwordResetRateLimit')
  }

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (rateLimited && countdown === 0) {
      clearRateLimit()
    }
    return () => clearTimeout(timer)
  }, [countdown, rateLimited])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      await enhancedAuthApi.forgotPassword({ 
        email: email.trim(),
        baseUrl: window.location.origin 
      })
      
      setSubmitted(true)
      toast.success('If an account with this email exists, you will receive a password reset link.')
    } catch (error: any) {
      console.error('Forgot password error:', error)
      
      // Handle specific error types
      if (error.response?.status === 429 || error.response?.data?.code === 'RATE_LIMIT_EXCEEDED') {
        setRateLimitWithStorage(15 * 60) // 15 minutes countdown
        toast.error('Too many password reset attempts. Please wait 15 minutes before trying again.')
      } else if (error.response?.data?.code === 'RATE_LIMIT_EXCEEDED') {
        setRateLimitWithStorage(15 * 60) // 15 minutes countdown
        toast.error('Too many password reset attempts. Please wait 15 minutes before trying again.')
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.error || 'Invalid request. Please check your email address.'
        toast.error(message)
      } else {
        const message = error.response?.data?.error || error.response?.data?.message || 'Failed to send reset email'
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (rateLimited) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Too Many Attempts
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                For security reasons, password reset requests are limited
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 dark:text-orange-200 font-medium">
                    Please wait before trying again
                  </p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatTime(countdown)}
                    </span>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    minutes remaining
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This security measure helps protect against automated attacks and ensures the safety of our users' accounts.
                </p>
                
                <button
                  onClick={clearRateLimit}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium text-sm"
                >
                  Try a different email address
                </button>
              </div>
              
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Check Your Email
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We've sent a password reset link to your email address
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  If you don't see the email, check your spam folder or{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    try again
                  </button>
                </p>
                
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Forgot Password?
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </CardHeader>
          
          <CardContent>
            {rateLimited && countdown > 0 && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-2" />
                  <span className="text-sm text-orange-800 dark:text-orange-200">
                    Rate limited. Try again in {formatTime(countdown)}
                  </span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                leftIcon={
                  <Mail className="w-5 h-5" />
                }
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || rateLimited}
              >
                {loading ? 'Sending...' : rateLimited ? `Wait ${formatTime(countdown)}` : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
