import { useState, useEffect, useCallback } from 'react';
import { robustCampaignsApi } from '../lib/robust-campaigns-api';
import type { Campaign } from '../lib/api';
import toast from 'react-hot-toast';

interface UseCampaignsOptions {
  page?: number;
  limit?: number;
  status?: 'all' | 'draft' | 'scheduled' | 'sent' | 'sending';
  search?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  refreshCampaigns: () => Promise<void>;
  createCampaign: (data: {
    name: string;
    subject: string;
    content: string;
    recipients: string[];
    scheduledAt?: string;
  }) => Promise<Campaign | null>;
  updateCampaign: (id: string, data: {
    name?: string;
    subject?: string;
    content?: string;
    recipientList?: string[];
    scheduledAt?: string;
    status?: 'draft' | 'scheduled' | 'sent' | 'sending';
  }) => Promise<Campaign | null>;
  deleteCampaign: (id: string) => Promise<boolean>;
  sendCampaign: (id: string) => Promise<boolean>;
  scheduleCampaign: (id: string, scheduledAt: string) => Promise<boolean>;
}

export const useCampaigns = (options: UseCampaignsOptions = {}): UseCampaignsReturn => {
  const {
    page = 1,
    limit = 50,
    status = 'all',
    search = '',
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const currentPage = page;

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const statusParam = status === 'all' ? undefined : status;
      const response = await robustCampaignsApi.getCampaigns(currentPage, limit, statusParam, search);
      
      if (response.data.success && response.data.data) {
        setCampaigns(response.data.data.campaigns);
        setTotal(response.data.data.total);
      } else {
        throw new Error(response.data.message || 'Failed to fetch campaigns');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to fetch campaigns';
      
      if (err.response?.status === 400) {
        errorMessage = 'Campaigns API endpoint not found. The backend may not have campaigns functionality implemented yet.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Campaigns endpoint not found (404). Backend server needs campaigns API implementation.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Backend server error (500). Check backend logs for database or server issues.';
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the backend is running.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Failed to fetch campaigns:', err);
      
      // For production: Show empty state when API fails
      // This encourages proper backend setup instead of relying on fake data
      setCampaigns([]);
      setTotal(0);
      
      // Display helpful error message for development
      if (import.meta.env.DEV) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, status, search]);

  const refreshCampaigns = useCallback(async () => {
    await fetchCampaigns();
  }, [fetchCampaigns]);

  const createCampaign = useCallback(async (data: {
    name: string;
    subject: string;
    content: string;
    recipients: string[];
    scheduledAt?: string;
  }): Promise<Campaign | null> => {
    try {
      const response = await robustCampaignsApi.createCampaign(data);
      if (response.data.success && response.data.data) {
        await refreshCampaigns();
        toast.success('Campaign created successfully!');
        return response.data.data.campaign;
      }
      throw new Error(response.data.message || 'Failed to create campaign');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      toast.error(`Error: ${errorMessage}`);
      return null;
    }
  }, [refreshCampaigns]);

  const updateCampaign = useCallback(async (id: string, updateData: {
    name?: string;
    subject?: string;
    content?: string;
    recipientList?: string[];
    scheduledAt?: string;
    status?: 'draft' | 'scheduled' | 'sent' | 'sending';
  }): Promise<Campaign | null> => {
    try {
      const response = await robustCampaignsApi.updateCampaign(id, updateData);
      if (response.data.success && response.data.data) {
        await refreshCampaigns();
        toast.success('Campaign updated successfully!');
        return response.data.data.campaign;
      }
      throw new Error(response.data.message || 'Failed to update campaign');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign';
      toast.error(`Error: ${errorMessage}`);
      return null;
    }
  }, [refreshCampaigns]);

  const deleteCampaign = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await robustCampaignsApi.deleteCampaign(id);
      if (response.data.success) {
        await refreshCampaigns();
        toast.success('Campaign deleted successfully!');
        return true;
      }
      throw new Error(response.data.message || 'Failed to delete campaign');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      toast.error(`Error: ${errorMessage}`);
      return false;
    }
  }, [refreshCampaigns]);

  const sendCampaign = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await robustCampaignsApi.sendCampaign(id);
      if (response.data.success) {
        await refreshCampaigns();
        toast.success('Campaign is being sent!');
        return true;
      }
      throw new Error(response.data.message || 'Failed to send campaign');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send campaign';
      toast.error(`Error: ${errorMessage}`);
      return false;
    }
  }, [refreshCampaigns]);

  const scheduleCampaign = useCallback(async (id: string, scheduledAt: string): Promise<boolean> => {
    try {
      const response = await robustCampaignsApi.scheduleCampaign(id, scheduledAt);
      if (response.data.success) {
        await refreshCampaigns();
        toast.success('Campaign scheduled successfully!');
        return true;
      }
      throw new Error(response.data.message || 'Failed to schedule campaign');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule campaign';
      toast.error(`Error: ${errorMessage}`);
      return false;
    }
  }, [refreshCampaigns]);

  // Initial load - disabled to prevent 404 errors when backend campaigns API is not implemented
  useEffect(() => {
    // fetchCampaigns(); // Commented out - uncomment when backend has campaigns API
    setLoading(false);
    setError('Campaigns API not yet implemented in backend. This feature will be available once the backend endpoints are ready.');
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchCampaigns, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchCampaigns]);

  const hasMore = currentPage * limit < total;

  return {
    campaigns,
    loading,
    error,
    total,
    page: currentPage,
    hasMore,
    refreshCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
    scheduleCampaign
  };
};
