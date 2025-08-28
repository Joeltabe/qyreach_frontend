import { api } from '../lib/api';
import toast from 'react-hot-toast';
import type { CompanyMember } from './CompanyService';

// User interfaces
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  position?: string;
  timezone?: string;
  language?: string;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  companyMemberships: CompanyMembership[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    campaignUpdates: boolean;
    systemAlerts: boolean;
    weeklyReports: boolean;
  };
  dashboard: {
    defaultView: 'overview' | 'campaigns' | 'contacts' | 'analytics';
    refreshInterval: number;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}

export interface CompanyMembership {
  companyId: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'USER';
  permissions: string[];
  joinedAt: string;
  company: {
    name: string;
    logo?: string;
  };
}

export interface UserFormData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  position?: string;
  timezone?: string;
  language?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PreferencesUpdate {
  theme?: 'light' | 'dark' | 'system';
  notifications?: Partial<UserPreferences['notifications']>;
  dashboard?: Partial<UserPreferences['dashboard']>;
  security?: Partial<UserPreferences['security']>;
}

// User Service Class
export class UserService {
  
  // Get current user profile
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/api/user/profile');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch user profile');
      }
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        throw new Error('Failed to load user profile');
      }
    }
  }

  // Update user profile
  static async updateProfile(data: UserFormData): Promise<User> {
    try {
      const response = await api.put('/api/user/profile', data);
      
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Upload user avatar
  static async uploadAvatar(file: File): Promise<string> {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const message = 'Invalid file type. Please upload JPG, PNG, or WebP images.';
      toast.error(message);
      throw new Error(message);
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      const message = 'File too large. Please upload images smaller than 2MB.';
      toast.error(message);
      throw new Error(message);
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      toast.loading('Uploading avatar...', { id: 'avatar-upload' });
      
      const response = await api.post('/api/user/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success('Avatar uploaded successfully!', { id: 'avatar-upload' });
        return response.data.data.avatarUrl;
      } else {
        throw new Error(response.data.error || 'Failed to upload avatar');
      }
    } catch (error: any) {
      console.error('Failed to upload avatar:', error);
      const message = error.response?.data?.message || 'Failed to upload avatar';
      toast.error(message, { id: 'avatar-upload' });
      throw new Error(message);
    }
  }

  // Change password
  static async changePassword(data: PasswordChangeData): Promise<void> {
    // Validate password match
    if (data.newPassword !== data.confirmPassword) {
      const message = 'New passwords do not match';
      toast.error(message);
      throw new Error(message);
    }

    // Validate password strength
    if (data.newPassword.length < 8) {
      const message = 'Password must be at least 8 characters long';
      toast.error(message);
      throw new Error(message);
    }

    try {
      const response = await api.put('/api/user/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Failed to change password:', error);
      
      if (error.response?.status === 400) {
        const message = 'Current password is incorrect';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.response?.data?.message || 'Failed to change password';
        toast.error(message);
        throw new Error(message);
      }
    }
  }

  // Update user preferences
  static async updatePreferences(data: PreferencesUpdate): Promise<UserPreferences> {
    try {
      const response = await api.put('/api/user/preferences', data);
      
      if (response.data.success) {
        toast.success('Preferences updated successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update preferences');
      }
    } catch (error: any) {
      console.error('Failed to update preferences:', error);
      const message = error.response?.data?.message || 'Failed to update preferences';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Enable/disable two-factor authentication
  static async toggleTwoFactor(enable: boolean): Promise<{ secret?: string; qrCode?: string }> {
    try {
      const response = await api.post('/api/user/2fa/toggle', { enable });
      
      if (response.data.success) {
        const message = enable ? 'Two-factor authentication enabled!' : 'Two-factor authentication disabled!';
        toast.success(message);
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to toggle two-factor authentication');
      }
    } catch (error: any) {
      console.error('Failed to toggle 2FA:', error);
      const message = error.response?.data?.message || 'Failed to toggle two-factor authentication';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Verify two-factor authentication code
  static async verifyTwoFactor(code: string): Promise<void> {
    try {
      const response = await api.post('/api/user/2fa/verify', { code });
      
      if (response.data.success) {
        toast.success('Two-factor authentication verified successfully!');
      } else {
        throw new Error(response.data.error || 'Invalid verification code');
      }
    } catch (error: any) {
      console.error('Failed to verify 2FA:', error);
      const message = error.response?.data?.message || 'Invalid verification code';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Get user's company memberships
  static async getCompanyMemberships(): Promise<CompanyMembership[]> {
    try {
      const response = await api.get('/api/user/companies');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch company memberships');
      }
    } catch (error: any) {
      console.error('Failed to fetch company memberships:', error);
      return []; // Return empty array if fails
    }
  }

  // Switch active company
  static async switchCompany(companyId: string): Promise<void> {
    try {
      const response = await api.post('/api/user/switch-company', { companyId });
      
      if (response.data.success) {
        // Update the API client's company header
        api.defaults.headers.common['x-company-id'] = companyId;
        toast.success('Company switched successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to switch company');
      }
    } catch (error: any) {
      console.error('Failed to switch company:', error);
      const message = error.response?.data?.message || 'Failed to switch company';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await api.post('/api/auth/password-reset/request', { email });
      
      if (response.data.success) {
        toast.success('Password reset email sent! Please check your inbox.');
      } else {
        throw new Error(response.data.error || 'Failed to request password reset');
      }
    } catch (error: any) {
      console.error('Failed to request password reset:', error);
      const message = error.response?.data?.message || 'Failed to request password reset';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Reset password with token
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post('/api/auth/password-reset/confirm', {
        token,
        newPassword,
      });
      
      if (response.data.success) {
        toast.success('Password reset successfully! You can now log in with your new password.');
      } else {
        throw new Error(response.data.error || 'Failed to reset password');
      }
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      
      if (error.response?.status === 400) {
        const message = 'Invalid or expired reset token';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.response?.data?.message || 'Failed to reset password';
        toast.error(message);
        throw new Error(message);
      }
    }
  }

  // Verify email address
  static async verifyEmail(token: string): Promise<void> {
    try {
      const response = await api.post('/api/user/verify-email', { token });
      
      if (response.data.success) {
        toast.success('Email verified successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to verify email');
      }
    } catch (error: any) {
      console.error('Failed to verify email:', error);
      const message = error.response?.data?.message || 'Failed to verify email';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Resend email verification
  static async resendEmailVerification(): Promise<void> {
    try {
      const response = await api.post('/api/user/resend-verification');
      
      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
      } else {
        throw new Error(response.data.error || 'Failed to resend verification email');
      }
    } catch (error: any) {
      console.error('Failed to resend verification email:', error);
      const message = error.response?.data?.message || 'Failed to resend verification email';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Get user activity log
  static async getActivityLog(limit: number = 50): Promise<any[]> {
    try {
      const response = await api.get(`/api/user/activity?limit=${limit}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch activity log');
      }
    } catch (error: any) {
      console.error('Failed to fetch activity log:', error);
      return []; // Return empty array if fails
    }
  }

  // Delete user account (dangerous operation)
  static async deleteAccount(password: string): Promise<void> {
    try {
      const response = await api.delete('/api/user/account', {
        data: { password }
      });
      
      if (response.data.success) {
        toast.success('Account deleted successfully');
      } else {
        throw new Error(response.data.error || 'Failed to delete account');
      }
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      
      if (error.response?.status === 400) {
        const message = 'Incorrect password';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.response?.data?.message || 'Failed to delete account';
        toast.error(message);
        throw new Error(message);
      }
    }
  }

  // Utility methods
  static getDisplayName(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else {
      return user.email;
    }
  }

  static getInitials(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName[0].toUpperCase();
    } else {
      return user.email[0].toUpperCase();
    }
  }

  static getUserRole(user: User, companyId: string): CompanyMember['role'] | null {
    const membership = user.companyMemberships.find(m => m.companyId === companyId);
    return membership?.role || null;
  }

  static canUserPerformAction(user: User, companyId: string, requiredRole: CompanyMember['role']): boolean {
    const userRole = this.getUserRole(user, companyId);
    if (!userRole) return false;

    const roleHierarchy = {
      'USER': 1,
      'MANAGER': 2,
      'ADMIN': 3,
      'OWNER': 4
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  static formatLastLogin(lastLoginAt?: string): string {
    if (!lastLoginAt) return 'Never';
    
    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export default UserService;
