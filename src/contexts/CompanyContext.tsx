import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { companyApi } from '../lib/companyApi';
import type { Company, CompanyFormData, BrandingFormData } from '../lib/companyApi';
import { toast } from 'react-hot-toast';

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
}

type CompanyAction =
  | { type: 'LOADING_START' }
  | { type: 'LOADING_END' }
  | { type: 'SET_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: Partial<Company> }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

interface CompanyContextType extends CompanyState {
  fetchCompany: () => Promise<void>;
  updateProfile: (data: CompanyFormData) => Promise<void>;
  updateBranding: (data: BrandingFormData) => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  uploadBrandLogo: (file: File) => Promise<void>;
  removeLogo: () => Promise<void>;
  setupCompany: (data: CompanyFormData) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const initialState: CompanyState = {
  company: null,
  isLoading: false,
  error: null,
};

function companyReducer(state: CompanyState, action: CompanyAction): CompanyState {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOADING_END':
      return { ...state, isLoading: false };
    
    case 'SET_COMPANY':
      return { ...state, company: action.payload, isLoading: false, error: null };
    
    case 'UPDATE_COMPANY':
      return {
        ...state,
        company: state.company ? { ...state.company, ...action.payload } : null,
        isLoading: false,
        error: null,
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  const fetchCompany = async () => {
    try {
      dispatch({ type: 'LOADING_START' });
      const response = await companyApi.getProfile();
      if (response.success) {
        dispatch({ type: 'SET_COMPANY', payload: response.data.company });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch company profile' });
      }
    } catch (error: any) {
      console.error('Error fetching company:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch company' });
    }
  };

  const updateProfile = async (data: CompanyFormData) => {
    try {
      dispatch({ type: 'LOADING_START' });
      const response = await companyApi.updateProfile(data);
      if (response.success) {
        dispatch({ type: 'UPDATE_COMPANY', payload: response.data.company });
        toast.success('Company profile updated successfully!');
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const message = error.response?.data?.error || error.message || 'Failed to update profile';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const updateBranding = async (data: BrandingFormData) => {
    try {
      dispatch({ type: 'LOADING_START' });
      const response = await companyApi.updateBranding(data);
      if (response.success) {
        dispatch({ type: 'UPDATE_COMPANY', payload: response.data.company });
        toast.success('Company branding updated successfully!');
      } else {
        throw new Error(response.error || 'Failed to update branding');
      }
    } catch (error: any) {
      console.error('Error updating branding:', error);
      const message = error.response?.data?.error || error.message || 'Failed to update branding';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      dispatch({ type: 'LOADING_START' });
      const response = await companyApi.uploadLogo(file);
      if (response.success) {
        dispatch({ type: 'UPDATE_COMPANY', payload: { logo: response.data.logoUrl } });
        toast.success('Company logo uploaded successfully!');
      } else {
        throw new Error(response.error || 'Failed to upload logo');
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      const message = error.response?.data?.error || error.message || 'Failed to upload logo';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const uploadBrandLogo = async (file: File) => {
    try {
      dispatch({ type: 'LOADING_START' });
      const response = await companyApi.uploadBrandLogo(file);
      if (response.success) {
        dispatch({ type: 'UPDATE_COMPANY', payload: { brandLogo: response.data.brandLogoUrl } });
        toast.success('Brand logo uploaded successfully!');
      } else {
        throw new Error(response.error || 'Failed to upload brand logo');
      }
    } catch (error: any) {
      console.error('Error uploading brand logo:', error);
      const message = error.response?.data?.error || error.message || 'Failed to upload brand logo';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const removeLogo = async () => {
    try {
      dispatch({ type: 'LOADING_START' });
      const response = await companyApi.removeLogo();
      if (response.success) {
        dispatch({ type: 'UPDATE_COMPANY', payload: { logo: undefined } });
        toast.success('Company logo removed successfully!');
      } else {
        throw new Error(response.error || 'Failed to remove logo');
      }
    } catch (error: any) {
      console.error('Error removing logo:', error);
      const message = error.response?.data?.error || error.message || 'Failed to remove logo';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const setupCompany = async (data: CompanyFormData) => {
    try {
      dispatch({ type: 'LOADING_START' });
      const response = await companyApi.setupCompany(data);
      if (response.success) {
        dispatch({ type: 'SET_COMPANY', payload: response.data.company });
        toast.success('Company setup completed successfully!');
      } else {
        throw new Error(response.error || 'Failed to setup company');
      }
    } catch (error: any) {
      console.error('Error setting up company:', error);
      const message = error.response?.data?.error || error.message || 'Failed to setup company';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  // Auto-fetch company on mount
  useEffect(() => {
    fetchCompany();
  }, []);

  const contextValue: CompanyContextType = {
    ...state,
    fetchCompany,
    updateProfile,
    updateBranding,
    uploadLogo,
    uploadBrandLogo,
    removeLogo,
    setupCompany,
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
