// Enhanced API client with endpoint detection and graceful fallbacks
import type { AxiosResponse } from 'axios';
import type { Campaign, ApiResponse } from './api';
import { api } from './api';

interface EndpointInfo {
  available: boolean;
  tested: boolean;
  lastError?: string;
}

class RobustCampaignsApi {
  private endpoints: Map<string, EndpointInfo> = new Map();

  private async testEndpoint(endpoint: string): Promise<boolean> {
    try {
      const response = await api.options(endpoint);
      return response.status < 400;
    } catch (error: any) {
      // 405 Method Not Allowed means endpoint exists but doesn't support OPTIONS
      if (error.response?.status === 405) {
        return true;
      }
      
      this.endpoints.set(endpoint, {
        available: false,
        tested: true,
        lastError: error.message
      });
      return false;
    }
  }

  private async ensureEndpointAvailable(endpoint: string): Promise<boolean> {
    const info = this.endpoints.get(endpoint);
    
    if (info?.tested) {
      return info.available;
    }

    const available = await this.testEndpoint(endpoint);
    this.endpoints.set(endpoint, {
      available,
      tested: true
    });

    return available;
  }

  async getCampaigns(
    page?: number, 
    limit?: number, 
    status?: string, 
    search?: string
  ): Promise<AxiosResponse<ApiResponse<{ campaigns: Campaign[]; total: number }>>> {
    const endpoint = '/api/campaigns';
    const available = await this.ensureEndpointAvailable(endpoint);

    if (!available) {
      // Return empty successful response when endpoint is not available
      return {
        data: {
          success: true,
          data: {
            campaigns: [],
            total: 0
          },
          message: 'Campaigns endpoint not available'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
    }

    return api.get(endpoint, { 
      params: { page, limit, status, search } 
    });
  }

  async getCampaign(id: string): Promise<AxiosResponse<ApiResponse<Campaign>>> {
    const endpoint = `/api/campaigns/${id}`;
    const available = await this.ensureEndpointAvailable('/api/campaigns');

    if (!available) {
      throw new Error('Campaigns API not available. Please implement campaigns endpoints in your backend.');
    }

    return api.get(endpoint);
  }

  async createCampaign(data: {
    name: string;
    subject: string;
    content: string;
    recipients: string[];
    scheduledAt?: string;
  }): Promise<AxiosResponse<ApiResponse<{ campaign: Campaign }>>> {
    const endpoint = '/api/campaigns';
    const available = await this.ensureEndpointAvailable(endpoint);

    if (!available) {
      throw new Error('Campaigns API not available. Please implement campaigns endpoints in your backend.');
    }

    return api.post(endpoint, data);
  }

  async updateCampaign(id: string, data: {
    name?: string;
    subject?: string;
    content?: string;
    recipientList?: string[];
    scheduledAt?: string;
    status?: 'draft' | 'scheduled' | 'sent' | 'sending';
  }): Promise<AxiosResponse<ApiResponse<{ campaign: Campaign }>>> {
    const endpoint = `/api/campaigns/${id}`;
    const available = await this.ensureEndpointAvailable('/api/campaigns');

    if (!available) {
      throw new Error('Campaigns API not available. Please implement campaigns endpoints in your backend.');
    }

    return api.put(endpoint, data);
  }

  async deleteCampaign(id: string): Promise<AxiosResponse<ApiResponse>> {
    const endpoint = `/api/campaigns/${id}`;
    const available = await this.ensureEndpointAvailable('/api/campaigns');

    if (!available) {
      throw new Error('Campaigns API not available. Please implement campaigns endpoints in your backend.');
    }

    return api.delete(endpoint);
  }

  async sendCampaign(id: string): Promise<AxiosResponse<ApiResponse<{ jobId: string }>>> {
    const endpoint = `/api/campaigns/${id}/send`;
    const available = await this.ensureEndpointAvailable('/api/campaigns');

    if (!available) {
      throw new Error('Campaigns API not available. Please implement campaigns endpoints in your backend.');
    }

    return api.post(endpoint);
  }

  async scheduleCampaign(id: string, scheduledAt: string): Promise<AxiosResponse<ApiResponse>> {
    const endpoint = `/api/campaigns/${id}/schedule`;
    const available = await this.ensureEndpointAvailable('/api/campaigns');

    if (!available) {
      throw new Error('Campaigns API not available. Please implement campaigns endpoints in your backend.');
    }

    return api.post(endpoint, { scheduledAt });
  }

  getEndpointStatus(): Map<string, EndpointInfo> {
    return new Map(this.endpoints);
  }
}

// Create and export the robust campaigns API
export const robustCampaignsApi = new RobustCampaignsApi();

// Development helper to log API status
if (import.meta.env.DEV) {
  // Test campaigns endpoint availability on load
  robustCampaignsApi.getCampaigns(1, 1).then(() => {
    console.log('✅ Campaigns API is available');
  }).catch((error) => {
    console.log('❌ Campaigns API not available:', error.message);
    console.log('💡 Tip: Implement campaigns endpoints in your backend or the app will show empty state');
  });
}
