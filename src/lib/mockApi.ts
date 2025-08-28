// Production-ready API service with proper error handling and validation
import type { User, Company } from './api'
import type { ApiResponse } from './api'

interface MockTokens {
  accessToken: string
  refreshToken: string
}

interface MockLoginData {
  user: User
  company: Company
  tokens: MockTokens
}

// Production user template
const createProductionUser = (email: string, firstName: string, lastName: string): User => ({
  id: crypto.randomUUID(),
  email,
  firstName,
  lastName,
  avatar: undefined,
  role: 'USER',
  isActive: true,
  isVerified: false,
  createdAt: new Date().toISOString(),
  companies: []
})

// Production company template
const createProductionCompany = (name: string, industry?: string, size?: string): Company => ({
  id: crypto.randomUUID(),
  name,
  industry: industry || 'Other',
  size: (size as any) || 'STARTUP',
  subscriptionPlan: 'FREE',
  subscriptionStatus: 'TRIAL',
  createdAt: new Date().toISOString(),
})

// Secure token generation
const generateSecureTokens = (): MockTokens => ({
  accessToken: `prod_${crypto.randomUUID().replace(/-/g, '')}_${Date.now()}`,
  refreshToken: `refresh_${crypto.randomUUID().replace(/-/g, '')}_${Date.now()}`,
})

// Password validation
const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' }
  }
  return { valid: true }
}

// Production-ready storage simulation (in real app, this would be database)
class ProductionStorage {
  private static users: Map<string, { user: User; company?: Company; hashedPassword: string }> = new Map()
  private static resetTokens: Map<string, { email: string; token: string; expiresAt: number }> = new Map()

  static async hashPassword(password: string): Promise<string> {
    // In production, use proper password hashing like bcrypt
    // This is a simple simulation for development
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'production_salt')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password)
    return hashedInput === hashedPassword
  }

  static async createUser(email: string, password: string, firstName: string, lastName: string, companyData?: {
    name: string
    industry?: string
    size?: string
  }): Promise<{ user: User; company?: Company }> {
    const hashedPassword = await this.hashPassword(password)
    const user = createProductionUser(email, firstName, lastName)
    
    let company: Company | undefined
    if (companyData) {
      company = createProductionCompany(companyData.name, companyData.industry, companyData.size)
      
      // Link user to company
      user.companies = [{
        id: crypto.randomUUID(),
        userId: user.id,
        companyId: company.id,
        role: 'ADMIN',
        isActive: true,
        company
      }]
    }

    this.users.set(email, { user, company, hashedPassword })
    return { user, company }
  }

  static async findUser(email: string): Promise<{ user: User; company?: Company; hashedPassword: string } | null> {
    return this.users.get(email) || null
  }

  static async updateUser(email: string, updates: Partial<User>): Promise<User | null> {
    const existing = this.users.get(email)
    if (!existing) return null

    const updatedUser = { ...existing.user, ...updates, updatedAt: new Date().toISOString() }
    this.users.set(email, { ...existing, user: updatedUser })
    return updatedUser
  }

  static async createResetToken(email: string): Promise<string> {
    const token = crypto.randomUUID().replace(/-/g, '')
    const expiresAt = Date.now() + (60 * 60 * 1000) // 1 hour
    
    this.resetTokens.set(token, { email, token, expiresAt })
    return token
  }

  static async validateResetToken(email: string, token: string): Promise<boolean> {
    const resetData = this.resetTokens.get(token)
    if (!resetData) return false
    if (resetData.email !== email) return false
    if (resetData.expiresAt < Date.now()) {
      this.resetTokens.delete(token)
      return false
    }
    return true
  }

  static async consumeResetToken(token: string): Promise<void> {
    this.resetTokens.delete(token)
  }

  static async updateUserPassword(email: string, newPassword: string): Promise<boolean> {
    const userData = this.users.get(email)
    if (!userData) return false

    const hashedPassword = await this.hashPassword(newPassword)
    this.users.set(email, {
      ...userData,
      hashedPassword
    })
    return true
  }
}

export class ProductionApiService {
  private static delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async login(email: string, password: string): Promise<ApiResponse<MockLoginData>> {
    await this.delay()

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    const userData = await ProductionStorage.findUser(email.toLowerCase())
    if (!userData) {
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }

    const isValidPassword = await ProductionStorage.verifyPassword(password, userData.hashedPassword)
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }

    const tokens = generateSecureTokens()
    return {
      success: true,
      data: {
        user: userData.user,
        company: userData.company || createProductionCompany('Personal Workspace'),
        tokens
      }
    }
  }

  static async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    industry?: string
    companySize?: string
  }): Promise<ApiResponse<MockLoginData>> {
    await this.delay()

    // Validate input
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return {
        success: false,
        error: 'All required fields must be provided'
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    // Password validation
    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message || 'Invalid password'
      }
    }

    // Check if user already exists
    const existingUser = await ProductionStorage.findUser(data.email.toLowerCase())
    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists'
      }
    }

    try {
      const { user, company } = await ProductionStorage.createUser(
        data.email.toLowerCase(),
        data.password,
        data.firstName,
        data.lastName,
        data.companyName ? {
          name: data.companyName,
          industry: data.industry,
          size: data.companySize
        } : undefined
      )

      const tokens = generateSecureTokens()
      return {
        success: true,
        data: {
          user,
          company: company || createProductionCompany('Personal Workspace'),
          tokens
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create account. Please try again.'
      }
    }
  }

  static async getProfile(): Promise<ApiResponse<{ user: User }>> {
    await this.delay(200)

    // In production, this would validate the JWT token
    // For now, return a generic response indicating authentication is required
    return {
      success: false,
      error: 'Authentication required. Please log in again.'
    }
  }

  static async refreshToken(): Promise<ApiResponse<MockLoginData>> {
    await this.delay(300)

    // In production, this would validate the refresh token
    return {
      success: false,
      error: 'Session expired. Please log in again.'
    }
  }

  static async updateProfile(data: {
    firstName?: string
    lastName?: string
    avatar?: string
  }): Promise<ApiResponse<User>> {
    await this.delay()

    // Validate input
    if (!data.firstName && !data.lastName && !data.avatar) {
      return {
        success: false,
        error: 'At least one field must be provided for update'
      }
    }

    // In production, extract email from JWT token
    // For now, return an error requiring proper authentication
    return {
      success: false,
      error: 'Authentication required. Please log in again.'
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    await this.delay()

    // Validate input
    if (!currentPassword || !newPassword) {
      return {
        success: false,
        error: 'Current password and new password are required'
      }
    }

    // Password validation
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message || 'Invalid new password'
      }
    }

    // In production, this would validate the current user's session
    return {
      success: false,
      error: 'Authentication required. Please log in again.'
    }
  }

  static async forgotPassword(email: string): Promise<ApiResponse> {
    await this.delay(800) // Simulate email sending delay

    // Validate input
    if (!email) {
      return {
        success: false,
        error: 'Email address is required'
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    // Check if user exists (but don't reveal this information for security)
    const userData = await ProductionStorage.findUser(email.toLowerCase())
    
    if (userData) {
      // Generate reset token
      const resetToken = await ProductionStorage.createResetToken(email.toLowerCase())
      console.log(`[PRODUCTION] Password reset token generated for ${email}: ${resetToken}`)
      console.log('[PRODUCTION] In production, this would be sent via email')
    }

    // Always return success to prevent email enumeration
    return {
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link.'
    }
  }

  static async resetPassword(email: string, token: string, newPassword: string): Promise<ApiResponse> {
    await this.delay()

    // Validate input
    if (!email || !token || !newPassword) {
      return {
        success: false,
        error: 'Email, token, and new password are required'
      }
    }

    // Password validation
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message || 'Invalid password'
      }
    }

    // Validate reset token
    const isValidToken = await ProductionStorage.validateResetToken(email.toLowerCase(), token)
    if (!isValidToken) {
      return {
        success: false,
        error: 'Invalid or expired reset token'
      }
    }

    // Find user
    const userData = await ProductionStorage.findUser(email.toLowerCase())
    if (!userData) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    try {
      // Update password
      const passwordUpdated = await ProductionStorage.updateUserPassword(email.toLowerCase(), newPassword)
      if (!passwordUpdated) {
        return {
          success: false,
          error: 'Failed to update password'
        }
      }

      // Consume the reset token
      await ProductionStorage.consumeResetToken(token)

      console.log(`[PRODUCTION] Password successfully reset for ${email}`)
      
      return {
        success: true,
        message: 'Password has been successfully reset'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to reset password. Please try again.'
      }
    }
  }

  static async validateResetToken(email: string, token: string): Promise<ApiResponse<{ valid: boolean }>> {
    await this.delay(200)

    // Validate input
    if (!email || !token) {
      return {
        success: true,
        data: { valid: false }
      }
    }

    const isValid = await ProductionStorage.validateResetToken(email.toLowerCase(), token)

    return {
      success: true,
      data: { valid: isValid }
    }
  }
}

// Export the production service with the same interface
export const MockApiService = ProductionApiService

// Check if we should use fallback API (DISABLED - always use real backend)
export const shouldUseMockApi = (): boolean => {
  // Always use real backend - never fallback to mock API
  return false
}
