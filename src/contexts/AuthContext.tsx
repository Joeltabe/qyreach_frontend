import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { authApi, enhancedAuthApi, setAuthToken, setCompanyId, type User, type Company } from '../lib/api'
import { toast } from 'react-hot-toast'

// Session storage utilities
const SESSION_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  COMPANY_DATA: 'companyData',
  SESSION_EXPIRY: 'sessionExpiry',
  REMEMBER_ME: 'rememberMe'
} as const

interface SessionData {
  user: User | null
  company: Company | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  rememberMe: boolean
}

class SessionStorage {
  static save(data: SessionData): void {
    try {
      const storage = data.rememberMe ? localStorage : sessionStorage
      
      if (data.accessToken) {
        storage.setItem(SESSION_KEYS.AUTH_TOKEN, data.accessToken)
      }
      if (data.refreshToken) {
        storage.setItem(SESSION_KEYS.REFRESH_TOKEN, data.refreshToken)
      }
      if (data.user) {
        storage.setItem(SESSION_KEYS.USER_DATA, JSON.stringify(data.user))
      }
      if (data.company) {
        storage.setItem(SESSION_KEYS.COMPANY_DATA, JSON.stringify(data.company))
      }
      if (data.expiresAt) {
        storage.setItem(SESSION_KEYS.SESSION_EXPIRY, data.expiresAt.toString())
      }
      storage.setItem(SESSION_KEYS.REMEMBER_ME, data.rememberMe.toString())
      
      // Also store in localStorage for remember me functionality
      if (data.rememberMe) {
        localStorage.setItem(SESSION_KEYS.REMEMBER_ME, 'true')
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  static load(): SessionData {
    try {
      // Check both localStorage and sessionStorage
      const rememberMe = localStorage.getItem(SESSION_KEYS.REMEMBER_ME) === 'true'
      const storage = rememberMe ? localStorage : sessionStorage
      
      const accessToken = storage.getItem(SESSION_KEYS.AUTH_TOKEN)
      const refreshToken = storage.getItem(SESSION_KEYS.REFRESH_TOKEN)
      const userDataStr = storage.getItem(SESSION_KEYS.USER_DATA)
      const companyDataStr = storage.getItem(SESSION_KEYS.COMPANY_DATA)
      const expiryStr = storage.getItem(SESSION_KEYS.SESSION_EXPIRY)
      
      return {
        user: userDataStr ? JSON.parse(userDataStr) : null,
        company: companyDataStr ? JSON.parse(companyDataStr) : null,
        accessToken,
        refreshToken,
        expiresAt: expiryStr ? parseInt(expiryStr) : null,
        rememberMe
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      return {
        user: null,
        company: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        rememberMe: false
      }
    }
  }

  static clear(): void {
    try {
      // Clear from both storage types
      Object.values(SESSION_KEYS).forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }

  static isExpired(): boolean {
    const session = this.load()
    if (!session.expiresAt) return false
    return Date.now() > session.expiresAt
  }
}

interface AuthState {
  user: User | null
  company: Company | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  sessionExpiry: number | null
  rememberMe: boolean
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; company: Company; expiresAt?: number; rememberMe?: boolean } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SESSION_EXPIRED' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: { user: User; company: Company; expiresAt?: number } }

const initialState: AuthState = {
  user: null,
  company: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sessionExpiry: null,
  rememberMe: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        company: action.payload.company,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiry: action.payload.expiresAt || null,
        rememberMe: action.payload.rememberMe || false,
      }
    
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        company: action.payload.company,
        sessionExpiry: action.payload.expiresAt || null,
        isLoading: false,
        error: null,
      }
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        company: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        sessionExpiry: null,
      }
    
    case 'SESSION_EXPIRED':
      return {
        ...initialState,
        isLoading: false,
        error: 'Your session has expired. Please log in again.',
      }
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      }
    
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    
    case 'UPDATE_COMPANY':
      return { ...state, company: action.payload }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    industry?: string
    companySize?: string
  }, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { firstName?: string; lastName?: string; avatar?: string }) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  clearError: () => void
  refreshSession: () => Promise<void>
  checkSessionExpiry: () => boolean
  clearSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount and setup session monitoring
  useEffect(() => {
    const initAuth = async () => {
      const sessionData = SessionStorage.load()
      
      if (sessionData.accessToken && sessionData.accessToken !== 'null' && sessionData.accessToken !== 'undefined') {
        // Check if session is expired
        if (SessionStorage.isExpired()) {
          // Try to refresh the token
          if (sessionData.refreshToken) {
            try {
              await refreshSession()
              return
            } catch (error) {
              console.log('Token refresh failed, clearing session')
            }
          }
          
          // Session expired and refresh failed
          SessionStorage.clear()
          dispatch({ type: 'SESSION_EXPIRED' })
          return
        }

        // Session is valid, restore user data
        setAuthToken(sessionData.accessToken)
        try {
          const response = await authApi.getProfile()
          if (response.data.success && response.data.data) {
            const company = response.data.data.user.companies[0]?.company || null
            setCompanyId(company?.id || null)
            const expiresAt = sessionData.expiresAt || Date.now() + (24 * 60 * 60 * 1000) // Default 24h
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.data.user,
                company,
                expiresAt,
                rememberMe: sessionData.rememberMe,
              },
            })
          } else {
            throw new Error('Failed to get profile')
          }
        } catch (error) {
          // Token is invalid
          SessionStorage.clear()
          setAuthToken(null)
          dispatch({ type: 'AUTH_FAILURE', payload: '' })
        }
      } else {
        // No valid token found
        dispatch({ type: 'AUTH_FAILURE', payload: '' })
      }
    }

    initAuth()
  }, [])

  // Setup session expiry monitoring
  useEffect(() => {
    if (!state.isAuthenticated || !state.sessionExpiry) return

    const timeUntilExpiry = state.sessionExpiry - Date.now()
    const warningTime = 5 * 60 * 1000 // 5 minutes before expiry

    // Set timeout to warn user before session expires
    const warningTimeout = setTimeout(() => {
      toast('Your session will expire soon. Please save your work.', {
        icon: '⚠️',
        duration: 10000,
      })
    }, Math.max(0, timeUntilExpiry - warningTime))

    // Set timeout to handle session expiry
    const expiryTimeout = setTimeout(() => {
      SessionStorage.clear()
      setAuthToken(null)
      dispatch({ type: 'SESSION_EXPIRED' })
      toast.error('Your session has expired. Please log in again.')
    }, Math.max(0, timeUntilExpiry))

    return () => {
      clearTimeout(warningTimeout)
      clearTimeout(expiryTimeout)
    }
  }, [state.isAuthenticated, state.sessionExpiry])

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const response = await enhancedAuthApi.login({ email, password })
      if (response.data.success && response.data.data) {
        const { user, company, tokens } = response.data.data
        
        // Calculate session expiry (24 hours from now)
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000)
        
        // Save session data
        SessionStorage.save({
          user,
          company,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
          rememberMe,
        })
        
        setAuthToken(tokens.accessToken)
        setCompanyId(company.id)
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, company, expiresAt, rememberMe } 
        })
        toast.success('Welcome back!')
      } else {
        throw new Error(response.data.error || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message)
      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      toast.error(message)
      throw error
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    industry?: string
    companySize?: string
  }, rememberMe: boolean = false) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const response = await authApi.register(data)
      if (response.data.success && response.data.data) {
        const { user, company, tokens } = response.data.data
        
        // Calculate session expiry (24 hours from now)
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000)
        
        // Save session data
        SessionStorage.save({
          user,
          company,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
          rememberMe,
        })
        
        setAuthToken(tokens.accessToken)
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, company, expiresAt, rememberMe } 
        })
        toast.success('Account created successfully!')
      } else {
        throw new Error(response.data.error || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message)
      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAuthToken(null)
      setCompanyId(null)
      SessionStorage.clear()
      dispatch({ type: 'LOGOUT' })
      toast.success('Logged out successfully')
    }
  }

  const refreshSession = async () => {
    const sessionData = SessionStorage.load()
    if (!sessionData.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await authApi.refresh(sessionData.refreshToken)
      if (response.data.success && response.data.data) {
        const { user, company, tokens } = response.data.data
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000)
        
        // Update session storage
        SessionStorage.save({
          user,
          company,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
          rememberMe: sessionData.rememberMe,
        })
        
        setAuthToken(tokens.accessToken)
        setCompanyId(company.id)
        dispatch({ 
          type: 'REFRESH_TOKEN_SUCCESS', 
          payload: { user, company, expiresAt } 
        })
      } else {
        throw new Error('Failed to refresh token')
      }
    } catch (error) {
      SessionStorage.clear()
      setAuthToken(null)
      setCompanyId(null)
      dispatch({ type: 'SESSION_EXPIRED' })
      throw error
    }
  }

  const checkSessionExpiry = (): boolean => {
    return SessionStorage.isExpired()
  }

  const clearSession = () => {
    SessionStorage.clear()
    setAuthToken(null)
    dispatch({ type: 'LOGOUT' })
  }

  const updateProfile = async (data: { firstName?: string; lastName?: string; avatar?: string }) => {
    try {
      const response = await authApi.updateProfile(data)
      if (response.data.success && response.data.data) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.data.user })
        toast.success('Profile updated successfully')
      } else {
        throw new Error(response.data.error || 'Update failed')
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Update failed'
      toast.error(message)
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await authApi.changePassword({ currentPassword, newPassword })
      if (response.data.success) {
        toast.success('Password changed successfully')
      } else {
        throw new Error(response.data.error || 'Password change failed')
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Password change failed'
      toast.error(message)
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        clearError,
        refreshSession,
        checkSessionExpiry,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
