import { useState, useEffect, useCallback } from 'react';
import { contactGroupsService, type ContactGroup, type Contact } from '../services/contactGroupsService';
import toast from 'react-hot-toast';

interface UseContactGroupsReturn {
  contactGroups: ContactGroup[];
  loading: boolean;
  error: string | null;
  refreshGroups: () => Promise<void>;
  getContactsForGroup: (groupId: string) => Promise<Contact[]>;
  getContactEmailsForGroups: (groupIds: string[]) => Promise<string[]>;
  getTotalRecipientsForGroups: (groupIds: string[]) => number;
}

export const useContactGroups = (): UseContactGroupsReturn => {
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const groups = await contactGroupsService.getDynamicContactGroups();
      setContactGroups(groups);
      
      // Log cache status for debugging
      const cacheStatus = contactGroupsService.getCacheStatus();
      console.log('Contact groups loaded:', {
        groupCount: groups.length,
        totalContacts: groups.find(g => g.id === 'all')?.count || 0,
        cacheStatus
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contact groups';
      setError(errorMessage);
      console.error('Failed to fetch contact groups:', err);
      
      // Show user-friendly error
      if (import.meta.env.DEV) {
        toast.error('Failed to load contact groups. Check if backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    contactGroupsService.refreshCache();
    await fetchContactGroups();
    toast.success('Contact groups refreshed!');
  }, [fetchContactGroups]);

  const getContactsForGroup = useCallback(async (groupId: string): Promise<Contact[]> => {
    try {
      return await contactGroupsService.getContactsForGroup(groupId);
    } catch (error) {
      console.error(`Failed to get contacts for group ${groupId}:`, error);
      return [];
    }
  }, []);

  const getContactEmailsForGroups = useCallback(async (groupIds: string[]): Promise<string[]> => {
    try {
      return await contactGroupsService.getContactEmailsForGroups(groupIds);
    } catch (error) {
      console.error('Failed to get contact emails for groups:', error);
      return [];
    }
  }, []);

  const getTotalRecipientsForGroups = useCallback((groupIds: string[]): number => {
    return contactGroups
      .filter(group => groupIds.includes(group.id))
      .reduce((total, group) => total + group.count, 0);
  }, [contactGroups]);

  // Initial load
  useEffect(() => {
    fetchContactGroups();
  }, [fetchContactGroups]);

  return {
    contactGroups,
    loading,
    error,
    refreshGroups,
    getContactsForGroup,
    getContactEmailsForGroups,
    getTotalRecipientsForGroups
  };
};
