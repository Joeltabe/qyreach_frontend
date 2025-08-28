import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { companyApi, type Company, type BrandingFormData } from '../lib/companyApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Company state interface
interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
}

// Action types
type CompanyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_COMPANY'; payload: Company | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_COMPANY'; payload: Partial<Company> }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'RESET' };

// Reducer
const companyReducer = (state: CompanyState, action: CompanyAction): CompanyState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_COMPANY':
      return { 
        ...state, 
        company: action.payload, 
        isLoading: false, 
        error: null,
        isDirty: false 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'UPDATE_COMPANY':
      return { 
        ...state, 
        company: state.company ? { ...state.company, ...action.payload } : null,
        isDirty: true 
      };
    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };
    case 'RESET':
      return {
        company: null,
        isLoading: false,
        error: null,
        isDirty: false,
      };
    default:
      return state;
  }
};

// Context interface
interface CompanyContextType extends CompanyState {
  // Profile operations
  fetchCompany: () => Promise<void>;
  updateProfile: (data: Partial<Company>) => Promise<boolean>;
  updateBranding: (data: BrandingFormData) => Promise<boolean>;
  
  // File operations
  uploadLogo: (file: File) => Promise<string | null>;
  removeLogo: () => Promise<boolean>;
  
  // Company setup
  setupCompany: (data: any) => Promise<boolean>;
  
  // Utility
  resetState: () => void;
  hasUnsavedChanges: () => boolean;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

// Provider component
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(companyReducer, {
    company: null,
    isLoading: false,
    error: null,
    isDirty: false,
  });

  // Fetch company data
  const fetchCompany = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const company = await companyApi.getProfile();
      dispatch({ type: 'SET_COMPANY', payload: company });
    } catch (error: any) {
      console.error('Failed to fetch company:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load company profile' });
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        // Company doesn't exist yet - this is normal for new setups
        dispatch({ type: 'SET_COMPANY', payload: null });
      }
    }
  };

  // Update company profile
  const updateProfile = async (data: Partial<Company>): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCompany = await companyApi.updateProfile(data);
      dispatch({ type: 'SET_COMPANY', payload: updatedCompany });
      toast.success('Company profile updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const message = error.response?.data?.message || 'Failed to update company profile';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  };

  // Update company branding
  const updateBranding = async (data: BrandingFormData): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCompany = await companyApi.updateBranding(data);
      dispatch({ type: 'SET_COMPANY', payload: updatedCompany });
      toast.success('Company branding updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to update branding:', error);
      const message = error.response?.data?.message || 'Failed to update company branding';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  };

  // Upload company logo
  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (PNG, JPG, JPEG)');
        return null;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('File size must be less than 5MB');
        return null;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      
      const logoUrl = await companyApi.uploadLogo(file);
      
      // Update the company state with new logo
      if (state.company) {
        dispatch({ 
          type: 'UPDATE_COMPANY', 
          payload: { logoUrl } 
        });
      }
      
      toast.success('Logo uploaded successfully!');
      dispatch({ type: 'SET_LOADING', payload: false });
      return logoUrl;
    } catch (error: any) {
      console.error('Failed to upload logo:', error);
      const message = error.response?.data?.message || 'Failed to upload logo';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return null;
    }
  };

  // Remove company logo
  const removeLogo = async (): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await companyApi.removeLogo();
      
      if (state.company) {
        dispatch({ 
          type: 'UPDATE_COMPANY', 
          payload: { logoUrl: null } 
        });
      }
      
      toast.success('Logo removed successfully!');
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error: any) {
      console.error('Failed to remove logo:', error);
      const message = error.response?.data?.message || 'Failed to remove logo';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  };

  // Setup new company
  const setupCompany = async (data: any): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newCompany = await companyApi.setupCompany(data);
      dispatch({ type: 'SET_COMPANY', payload: newCompany });
      toast.success('Company setup completed successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to setup company:', error);
      const message = error.response?.data?.message || 'Failed to setup company';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  };

  // Reset state
  const resetState = () => {
    dispatch({ type: 'RESET' });
  };

  // Check for unsaved changes
  const hasUnsavedChanges = (): boolean => {
    return state.isDirty;
  };

  // Auto-fetch company on user change
  useEffect(() => {
    if (user) {
      fetchCompany();
    } else {
      resetState();
    }
  }, [user]);

  // Handle page unload with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.isDirty]);

  const contextValue: CompanyContextType = {
    ...state,
    fetchCompany,
    updateProfile,
    updateBranding,
    uploadLogo,
    removeLogo,
    setupCompany,
    resetState,
    hasUnsavedChanges,
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

// Hook to use company context
export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export default CompanyContext;
