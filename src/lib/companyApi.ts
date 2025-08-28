import { api } from './api';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  logo?: string;
  website?: string;
  address?: string;
  phone?: string;
  brandName?: string;
  brandColor: string;
  brandLogo?: string;
  emailSignature?: string;
  emailTemplate?: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  billingEmail?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    contacts: number;
    emailHistory: number;
    emailTemplates: number;
  };
}

export interface CompanyBranding {
  id: string;
  name: string;
  brandName?: string;
  brandColor: string;
  brandLogo?: string;
  emailSignature?: string;
  emailTemplate?: string;
  logo?: string;
}

export interface CompanyFormData {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  website?: string;
  address?: string;
  phone?: string;
  brandName?: string;
  brandColor?: string;
  emailSignature?: string;
  billingEmail?: string;
}

export interface BrandingFormData {
  brandName?: string;
  brandColor?: string;
  emailSignature?: string;
  emailTemplate?: string;
}

class CompanyApiService {
  // Get company profile
  async getProfile() {
    const response = await api.get('/api/company/profile');
    return response.data;
  }

  // Update company profile
  async updateProfile(data: CompanyFormData) {
    const response = await api.put('/api/company/profile', data);
    return response.data;
  }

  // Upload company logo
  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.post('/api/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Upload brand logo
  async uploadBrandLogo(file: File) {
    const formData = new FormData();
    formData.append('brandLogo', file);
    
    const response = await api.post('/api/company/brand-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update branding
  async updateBranding(data: BrandingFormData) {
    const response = await api.put('/api/company/branding', data);
    return response.data;
  }

  // Get public branding (for email templates)
  async getBranding(companyId: string) {
    const response = await api.get(`/api/company/branding/${companyId}`);
    return response.data;
  }

  // Complete company setup (for new registrations)
  async setupCompany(data: CompanyFormData) {
    const response = await api.post('/api/company/setup', data);
    return response.data;
  }

  // Remove company logo
  async removeLogo() {
    const response = await api.delete('/api/company/logo');
    return response.data;
  }
}

export const companyApi = new CompanyApiService();
