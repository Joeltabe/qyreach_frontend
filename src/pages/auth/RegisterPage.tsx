import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    agreeToTerms: false,
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password validation
  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
  }

  const passwordValidation = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const passwordsMatch = formData.password === formData.confirmPassword
  const canSubmit = isPasswordValid && passwordsMatch && formData.agreeToTerms && 
    formData.firstName && formData.lastName && formData.email && formData.companyName

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit) {
      toast.error('Please fill all fields and meet password requirements')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setLoading(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
      })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Qyreach</span>
          </Link>
        </div>

        <Card variant="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Start your free trial today
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>

              <Input
                label="Company Name"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                required
                leftIcon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@acme.com"
                required
                leftIcon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />
                  
                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password Requirements:
                      </p>
                      <div className="space-y-1">
                        <div className={`flex items-center text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordValidation.minLength ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                          At least 8 characters
                        </div>
                        <div className={`flex items-center text-sm ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordValidation.hasUppercase ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                          At least one uppercase letter (A-Z)
                        </div>
                        <div className={`flex items-center text-sm ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordValidation.hasLowercase ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                          At least one lowercase letter (a-z)
                        </div>
                        <div className={`flex items-center text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordValidation.hasNumber ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                          At least one number (0-9)
                        </div>
                        <div className={`flex items-center text-sm ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordValidation.hasSpecialChar ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                          At least one special character (!@#$%^&*(),.?":{}|{`<>`})
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className={`mt-2 flex items-center text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordsMatch ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={!canSubmit || loading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
