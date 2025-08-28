import { api } from '../lib/api';
import toast from 'react-hot-toast';

// Company interfaces
export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  logo?: string;
  branding: CompanyBranding;
  settings: CompanySettings;
  subscription: CompanySubscription;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members?: CompanyMember[];
  stats?: CompanyStats;
}

export interface CompanyBranding {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
  emailSignature?: string;
  customDomain?: string;
  whitelabel: boolean;
}

export interface CompanySettings {
  timezone: string;
  currency: string;
  dateFormat: string;
  language: string;
  emailFromName: string;
  emailFromAddress: string;
  notifications: {
    emailReports: boolean;
    campaignAlerts: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorRequired: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
  };
}

export interface CompanySubscription {
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED';
  contactLimit: number;
  emailLimit: number;
  features: string[];
  billingCycle: 'MONTHLY' | 'ANNUAL';
  nextBillingDate?: string;
}

export interface CompanyMember {
  id: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'USER';
  permissions: string[];
  joinedAt: string;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface CompanyStats {
  totalContacts: number;
  totalCampaigns: number;
  totalEmailsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  activeUsers: number;
}

export interface CompanyFormData {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
}

export interface CompanyBrandingUpdate {
  primaryColor?: string;
  secondaryColor?: string;
  emailSignature?: string;
  customDomain?: string;
  whitelabel?: boolean;
}

export interface CompanySettingsUpdate {
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  language?: string;
  emailFromName?: string;
  emailFromAddress?: string;
  notifications?: Partial<CompanySettings['notifications']>;
  security?: Partial<CompanySettings['security']>;
}

// Company Service Class
export class CompanyService {
  
  // Get current company profile
  static async getCurrentCompany(): Promise<Company> {
    try {
      const response = await api.get('/api/company/profile');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch company profile');
      }
    } catch (error: any) {
      console.error('Failed to fetch company profile:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Company profile not found. Please complete your setup.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        throw new Error('Failed to load company profile');
      }
    }
  }

  // Create a new company (for first-time setup)
  static async createCompany(data: CompanyFormData): Promise<Company> {
    try {
      const response = await api.post('/api/company', data);
      
      if (response.data.success) {
        toast.success('Company profile created successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to create company');
      }
    } catch (error: any) {
      console.error('Failed to create company:', error);
      
      if (error.response?.status === 409) {
        const message = 'A company with this name already exists';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.response?.data?.message || 'Failed to create company';
        toast.error(message);
        throw new Error(message);
      }
    }
  }

  // Update company profile (for owners/admins)
  static async updateCompany(data: Partial<CompanyFormData>): Promise<Company> {
    try {
      const response = await api.put('/api/company/profile', data);
      
      if (response.data.success) {
        toast.success('Company profile updated successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update company');
      }
    } catch (error: any) {
      console.error('Failed to update company:', error);
      const message = error.response?.data?.message || 'Failed to update company profile';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Update company branding
  static async updateBranding(data: CompanyBrandingUpdate): Promise<CompanyBranding> {
    try {
      const response = await api.put('/api/company/branding', data);
      
      if (response.data.success) {
        toast.success('Branding updated successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update branding');
      }
    } catch (error: any) {
      console.error('Failed to update branding:', error);
      const message = error.response?.data?.message || 'Failed to update branding';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Update company settings
  static async updateSettings(data: CompanySettingsUpdate): Promise<CompanySettings> {
    try {
      const response = await api.put('/api/company/settings', data);
      
      if (response.data.success) {
        toast.success('Settings updated successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update settings');
      }
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      const message = error.response?.data?.message || 'Failed to update settings';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Upload company logo
  static async uploadLogo(file: File): Promise<string> {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const message = 'Invalid file type. Please upload JPG, PNG, SVG, or WebP images.';
      toast.error(message);
      throw new Error(message);
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const message = 'File too large. Please upload images smaller than 5MB.';
      toast.error(message);
      throw new Error(message);
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      toast.loading('Uploading logo...', { id: 'logo-upload' });
      
      const response = await api.post('/api/company/upload/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success('Logo uploaded successfully!', { id: 'logo-upload' });
        return response.data.data.logoUrl;
      } else {
        throw new Error(response.data.error || 'Failed to upload logo');
      }
    } catch (error: any) {
      console.error('Failed to upload logo:', error);
      const message = error.response?.data?.message || 'Failed to upload logo';
      toast.error(message, { id: 'logo-upload' });
      throw new Error(message);
    }
  }

  // Get company members (for owners/admins)
  static async getMembers(): Promise<CompanyMember[]> {
    try {
      const response = await api.get('/api/company/members');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch members');
      }
    } catch (error: any) {
      console.error('Failed to fetch members:', error);
      
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view company members');
      } else {
        throw new Error('Failed to load company members');
      }
    }
  }

  // Invite new member (for owners/admins)
  static async inviteMember(email: string, role: CompanyMember['role']): Promise<void> {
    try {
      const response = await api.post('/api/company/members/invite', { email, role });
      
      if (response.data.success) {
        toast.success(`Invitation sent to ${email}!`);
      } else {
        throw new Error(response.data.error || 'Failed to send invitation');
      }
    } catch (error: any) {
      console.error('Failed to invite member:', error);
      
      if (error.response?.status === 409) {
        const message = 'User is already a member of this company';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.response?.data?.message || 'Failed to send invitation';
        toast.error(message);
        throw new Error(message);
      }
    }
  }

  // Update member role (for owners/admins)
  static async updateMemberRole(memberId: string, role: CompanyMember['role']): Promise<void> {
    try {
      const response = await api.put(`/api/company/members/${memberId}`, { role });
      
      if (response.data.success) {
        toast.success('Member role updated successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to update member role');
      }
    } catch (error: any) {
      console.error('Failed to update member role:', error);
      const message = error.response?.data?.message || 'Failed to update member role';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Remove member (for owners/admins)
  static async removeMember(memberId: string): Promise<void> {
    try {
      const response = await api.delete(`/api/company/members/${memberId}`);
      
      if (response.data.success) {
        toast.success('Member removed successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to remove member');
      }
    } catch (error: any) {
      console.error('Failed to remove member:', error);
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Get company statistics
  static async getStats(): Promise<CompanyStats> {
    try {
      const response = await api.get('/api/company/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch stats');
      }
    } catch (error: any) {
      console.error('Failed to fetch company stats:', error);
      
      // Return default stats if API fails
      return {
        totalContacts: 0,
        totalCampaigns: 0,
        totalEmailsSent: 0,
        averageOpenRate: 0,
        averageClickRate: 0,
        activeUsers: 0,
      };
    }
  }

  // Check if user can edit company (owner/admin check)
  static async canEditCompany(): Promise<boolean> {
    try {
      const response = await api.get('/api/company/permissions');
      
      if (response.data.success) {
        const permissions = response.data.data.permissions;
        return permissions.includes('EDIT_COMPANY') || permissions.includes('OWNER');
      } else {
        return false;
      }
    } catch (error: any) {
      console.error('Failed to check company permissions:', error);
      return false;
    }
  }

  // Get user's role in company
  static async getUserRole(): Promise<CompanyMember['role'] | null> {
    try {
      const response = await api.get('/api/company/my-role');
      
      if (response.data.success) {
        return response.data.data.role;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Failed to get user role:', error);
      return null;
    }
  }

  // Leave company (for non-owners)
  static async leaveCompany(): Promise<void> {
    try {
      const response = await api.post('/api/company/leave');
      
      if (response.data.success) {
        toast.success('You have left the company successfully');
      } else {
        throw new Error(response.data.error || 'Failed to leave company');
      }
    } catch (error: any) {
      console.error('Failed to leave company:', error);
      
      if (error.response?.status === 403) {
        const message = 'Company owners cannot leave the company. Transfer ownership first.';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.response?.data?.message || 'Failed to leave company';
        toast.error(message);
        throw new Error(message);
      }
    }
  }

  // Transfer ownership (for owners only)
  static async transferOwnership(newOwnerId: string): Promise<void> {
    try {
      const response = await api.post('/api/company/transfer-ownership', { newOwnerId });
      
      if (response.data.success) {
        toast.success('Ownership transferred successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to transfer ownership');
      }
    } catch (error: any) {
      console.error('Failed to transfer ownership:', error);
      const message = error.response?.data?.message || 'Failed to transfer ownership';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Delete company (for owners only - dangerous operation)
  static async deleteCompany(confirmationText: string): Promise<void> {
    try {
      const response = await api.delete('/api/company', {
        data: { confirmation: confirmationText }
      });
      
      if (response.data.success) {
        toast.success('Company deleted successfully');
      } else {
        throw new Error(response.data.error || 'Failed to delete company');
      }
    } catch (error: any) {
      console.error('Failed to delete company:', error);
      const message = error.response?.data?.message || 'Failed to delete company';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Utility methods
  static formatCompanySize(size: string): string {
    const sizeMap: Record<string, string> = {
      'STARTUP': '1-10 employees',
      'SMALL': '11-50 employees',
      'MEDIUM': '51-200 employees',
      'LARGE': '201-1000 employees',
      'ENTERPRISE': '1000+ employees'
    };
    return sizeMap[size] || size;
  }

  static formatSubscriptionPlan(plan: string): string {
    return plan.charAt(0) + plan.slice(1).toLowerCase();
  }

  static canUserEdit(userRole: CompanyMember['role'] | null): boolean {
    return userRole === 'OWNER' || userRole === 'ADMIN';
  }

  static canUserManageMembers(userRole: CompanyMember['role'] | null): boolean {
    return userRole === 'OWNER' || userRole === 'ADMIN';
  }

  static canUserManageBilling(userRole: CompanyMember['role'] | null): boolean {
    return userRole === 'OWNER';
  }
}

export default CompanyService;
