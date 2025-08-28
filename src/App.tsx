import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { EmailPage } from './pages/email/EmailPage';

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CompanyProvider } from './contexts/CompanyContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'
import { setCompanyId } from './lib/api'

// Pages
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { PricingPage } from './pages/PricingPage'
import { ApiDocsPage } from './pages/ApiDocsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'

// New Pages
import { CompanySettingsPage } from './pages/company/CompanySettingsPage'
import AIComposerPage from './pages/ai/AIComposerPage'
import ContactsPage from './pages/contacts/ContactsPage'
import EmailDesignerPage from './pages/designer/EmailDesignerPage'
import UsageBillingPage from './pages/billing/UsageBillingPage'
import TemplatesPage from './pages/templates/TemplatesPage'
import CampaignsPage from './pages/campaigns/CampaignsPage'
import CreateCampaignPage from './pages/campaigns/create/CreateCampaignPage'
import CampaignDetailPage from './pages/campaigns/CampaignDetailPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'

// Service Pages
import AIEmailGeneration from './pages/services/AIEmailGeneration'
import SmartAnalytics from './pages/services/SmartAnalytics'
import TemplateLibrary from './pages/services/TemplateLibrary'
import ContactManagement from './pages/services/ContactManagement'
import AutomationWorkflows from './pages/services/AutomationWorkflows'
import EnterpriseSecurity from './pages/services/EnterpriseSecurity'

// AI Companion
import AICompanionToggle from './components/AICompanionToggleEnhanced'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

function App() {
  // Development initialization
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Set a default company ID for development
      setCompanyId('dev-company-12345');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CompanyProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/api-docs" element={<ApiDocsPage />} />
                
                {/* Service Pages */}
                <Route path="/services/ai-email-generation" element={<AIEmailGeneration />} />
                <Route path="/services/smart-analytics" element={<SmartAnalytics />} />
                <Route path="/services/template-library" element={<TemplateLibrary />} />
                <Route path="/services/contact-management" element={<ContactManagement />} />
                <Route path="/services/automation-workflows" element={<AutomationWorkflows />} />
                <Route path="/services/enterprise-security" element={<EnterpriseSecurity />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                
                {/* Company Management */}
                <Route path="/company" element={
                  <ProtectedRoute>
                    <CompanySettingsPage />
                  </ProtectedRoute>
                } />
                
                {/* AI Composer */}
                <Route path="/ai-composer" element={
                  <ProtectedRoute>
                    <AIComposerPage />
                  </ProtectedRoute>
                } />
                
                {/* Contacts Management */}
                <Route path="/contacts" element={
                  <ProtectedRoute>
                    <ContactsPage />
                  </ProtectedRoute>
                } />
                
                {/* Email Management */}
                <Route path="/email" element={
                  <ProtectedRoute>
                    <EmailPage />
                  </ProtectedRoute>
                } />
                
                {/* Email Designer */}
                <Route path="/email-designer" element={
                  <ProtectedRoute>
                    <EmailDesignerPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/email/designer" element={
                  <ProtectedRoute>
                    <EmailDesignerPage />
                  </ProtectedRoute>
                } />
                
                {/* Templates */}
                <Route path="/templates" element={
                  <ProtectedRoute>
                    <TemplatesPage />
                  </ProtectedRoute>
                } />
                
                {/* Campaigns */}
                <Route path="/campaigns" element={
                  <ProtectedRoute>
                    <CampaignsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/campaigns/create" element={
                  <ProtectedRoute>
                    <CreateCampaignPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/campaigns/:id" element={
                  <ProtectedRoute>
                    <CampaignDetailPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/campaigns/:id/edit" element={
                  <ProtectedRoute>
                    <CreateCampaignPage />
                  </ProtectedRoute>
                } />
                
                {/* Analytics */}
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />
                
                {/* Usage & Billing */}
                <Route path="/billing" element={
                  <ProtectedRoute>
                    <UsageBillingPage />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminRoute />}>
                  <Route index element={<AdminDashboard />} />
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    border: '1px solid var(--toast-border)',
                  },
                }}
              />
              
              {/* AI Companion - Available on all pages */}
              <AICompanionToggle />
            </div>
          </Router>
          </CompanyProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
