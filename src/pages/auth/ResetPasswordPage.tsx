import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { enhancedAuthApi } from '../../lib/api'
import toast from 'react-hot-toast'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  useEffect(() => {
    const validateToken = async () => {
      if (!email || !token) {
        toast.error('Invalid reset link. Please request a new password reset.')
        navigate('/forgot-password')
        return
      }

      setValidating(true)
      try {
        const response = await enhancedAuthApi.validateResetToken(email, token)
        if (response.data.success && response.data.data?.valid) {
          setTokenValid(true)
        } else {
          toast.error('Invalid or expired reset token. Please request a new password reset.')
          navigate('/forgot-password')
        }
      } catch (error: any) {
        console.error('Token validation error:', error)
        toast.error('Failed to validate reset token. Please try again.')
        navigate('/forgot-password')
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [email, token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      await enhancedAuthApi.resetPassword({
        email,
        token,
        password: formData.password,
      })

      setSuccess(true)
      toast.success('Password reset successfully!')
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error: any) {
      console.error('Reset password error:', error)
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to reset password'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Validating reset token...</p>
        </motion.div>
      </div>
    )
  }

  if (success) {
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
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Password Reset Successfully!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your password has been updated. You can now log in with your new password.
              </p>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Redirecting to login page in a few seconds...
              </p>
              
              <Link
                to="/login"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                Continue to Login
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!tokenValid) {
    return null // Will redirect
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
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your new password below
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your new password"
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />

              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Password Requirements
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
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
