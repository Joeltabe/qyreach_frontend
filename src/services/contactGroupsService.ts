import { contactsApi } from '../lib/api';

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  status: 'ACTIVE' | 'BOUNCED' | 'UNSUBSCRIBED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  lastOpenedAt?: string;
  lastClickedAt?: string;
  openCount?: number;
  clickCount?: number;
  bounceCount?: number;
  tags?: string[];
  segmentScores?: {
    engagement: number;
    recency: number;
    frequency: number;
  };
}

export interface ContactGroup {
  id: string;
  name: string;
  count: number;
  description: string;
  type: 'dynamic' | 'static';
  criteria?: ContactGroupCriteria;
  lastUpdated: string;
}

export interface ContactGroupCriteria {
  status?: string[];
  tags?: string[];
  dateRange?: {
    field: 'createdAt' | 'lastContactedAt' | 'lastOpenedAt';
    days: number;
  };
  engagement?: {
    minOpenRate?: number;
    minClickRate?: number;
    minOpenCount?: number;
    minClickCount?: number;
  };
  exclusions?: {
    bounced?: boolean;
    unsubscribed?: boolean;
    inactive?: boolean;
  };
}

class ContactGroupsService {
  private contacts: Contact[] = [];
  private contactsLoaded = false;
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all contacts from the API with caching
   */
  private async fetchContacts(): Promise<Contact[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.contactsLoaded && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.contacts;
    }

    try {
      const response = await contactsApi.getContacts(1, 10000); // Get all contacts
      
      if (response.data.success && response.data.data) {
        this.contacts = response.data.data.contacts.map(contact => ({
          ...contact,
          // Ensure all required fields have defaults
          status: contact.status || 'ACTIVE',
          openCount: contact.openCount || 0,
          clickCount: contact.clickCount || 0,
          bounceCount: contact.bounceCount || 0,
          tags: contact.tags || [],
          segmentScores: contact.segmentScores || {
            engagement: 0,
            recency: 0,
            frequency: 0
          }
        }));
        
        this.contactsLoaded = true;
        this.lastFetchTime = now;
        
        console.log(`Loaded ${this.contacts.length} contacts from API`);
      } else {
        throw new Error('Failed to fetch contacts from API');
      }
    } catch (error) {
      console.warn('Failed to fetch real contacts, using empty dataset:', error);
      
      // Return empty array for production - no fake data
      this.contacts = [];
      this.contactsLoaded = true;
      this.lastFetchTime = now;
    }

    return this.contacts;
  }

  /**
   * Calculate engagement score for a contact
   */
  private calculateEngagementScore(contact: Contact): number {
    const now = new Date();
    const createdAt = new Date(contact.createdAt);
    const daysSinceCreated = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate rates
    const openRate = (contact.openCount || 0) / Math.max(1, daysSinceCreated);
    const clickRate = (contact.clickCount || 0) / Math.max(1, daysSinceCreated);
    
    // Weight factors
    const openWeight = 0.6;
    const clickWeight = 0.4;
    
    return (openRate * openWeight) + (clickRate * clickWeight);
  }

  /**
   * Filter contacts based on date criteria
   */
  private filterByDateRange(contacts: Contact[], criteria: ContactGroupCriteria['dateRange']): Contact[] {
    if (!criteria) return contacts;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - criteria.days);
    
    return contacts.filter(contact => {
      const dateValue = contact[criteria.field];
      if (!dateValue) return false;
      
      return new Date(dateValue) >= cutoffDate;
    });
  }

  /**
   * Filter contacts based on engagement criteria
   */
  private filterByEngagement(contacts: Contact[], criteria: ContactGroupCriteria['engagement']): Contact[] {
    if (!criteria) return contacts;
    
    return contacts.filter(contact => {
      const engagementScore = this.calculateEngagementScore(contact);
      
      if (criteria.minOpenCount && (contact.openCount || 0) < criteria.minOpenCount) return false;
      if (criteria.minClickCount && (contact.clickCount || 0) < criteria.minClickCount) return false;
      
      return true;
    });
  }

  /**
   * Get All Active Contacts
   */
  async getAllContacts(): Promise<Contact[]> {
    const contacts = await this.fetchContacts();
    return contacts.filter(contact => 
      contact.status === 'ACTIVE' && 
      contact.status !== 'UNSUBSCRIBED' && 
      contact.status !== 'BOUNCED'
    );
  }

  /**
   * Get Active Subscribers (opened emails in last 90 days)
   */
  async getActiveSubscribers(): Promise<Contact[]> {
    const contacts = await this.fetchContacts();
    const activeContacts = contacts.filter(contact => contact.status === 'ACTIVE');
    
    return this.filterByDateRange(activeContacts, {
      field: 'lastOpenedAt',
      days: 90
    });
  }

  /**
   * Get New Subscribers (created in last 30 days)
   */
  async getNewSubscribers(): Promise<Contact[]> {
    const contacts = await this.fetchContacts();
    const activeContacts = contacts.filter(contact => contact.status === 'ACTIVE');
    
    return this.filterByDateRange(activeContacts, {
      field: 'createdAt',
      days: 30
    });
  }

  /**
   * Get VIP Customers (tagged as VIP, Premium, or high engagement)
   */
  async getVIPCustomers(): Promise<Contact[]> {
    const contacts = await this.fetchContacts();
    
    return contacts.filter(contact => 
      contact.status === 'ACTIVE' && (
        contact.tags?.includes('VIP') ||
        contact.tags?.includes('Premium') ||
        contact.tags?.includes('Enterprise') ||
        contact.tags?.includes('High-Value') ||
        this.calculateEngagementScore(contact) > 0.8
      )
    );
  }

  /**
   * Get Highly Engaged Contacts (high open/click rates)
   */
  async getHighlyEngaged(): Promise<Contact[]> {
    const contacts = await this.fetchContacts();
    const activeContacts = contacts.filter(contact => contact.status === 'ACTIVE');
    
    return activeContacts.filter(contact => {
      const engagementScore = this.calculateEngagementScore(contact);
      const hasRecentActivity = contact.lastOpenedAt && 
        new Date(contact.lastOpenedAt) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // Last 60 days
      
      return engagementScore > 0.3 && hasRecentActivity && (contact.openCount || 0) >= 3;
    });
  }

  /**
   * Get Re-engagement List (inactive but not unsubscribed)
   */
  async getReengagementList(): Promise<Contact[]> {
    const contacts = await this.fetchContacts();
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    return contacts.filter(contact => 
      contact.status === 'ACTIVE' && (
        !contact.lastOpenedAt || 
        new Date(contact.lastOpenedAt) < ninetyDaysAgo
      ) && (
        !contact.lastContactedAt ||
        new Date(contact.lastContactedAt) < ninetyDaysAgo
      )
    );
  }

  /**
   * Get all dynamic contact groups with current counts
   */
  async getDynamicContactGroups(): Promise<ContactGroup[]> {
    const now = new Date().toISOString();
    
    try {
      // Execute all group queries in parallel for better performance
      const [
        allContacts,
        activeSubscribers,
        newSubscribers,
        vipCustomers,
        highlyEngaged,
        reengagementList
      ] = await Promise.all([
        this.getAllContacts(),
        this.getActiveSubscribers(),
        this.getNewSubscribers(),
        this.getVIPCustomers(),
        this.getHighlyEngaged(),
        this.getReengagementList()
      ]);

      return [
        {
          id: 'all',
          name: 'All Contacts',
          count: allContacts.length,
          description: 'All active contacts in your database',
          type: 'dynamic',
          lastUpdated: now,
          criteria: {
            status: ['ACTIVE'],
            exclusions: {
              bounced: true,
              unsubscribed: true
            }
          }
        },
        {
          id: 'active',
          name: 'Active Subscribers',
          count: activeSubscribers.length,
          description: 'Contacts who have opened emails recently',
          type: 'dynamic',
          lastUpdated: now,
          criteria: {
            status: ['ACTIVE'],
            dateRange: {
              field: 'lastOpenedAt',
              days: 90
            }
          }
        },
        {
          id: 'new',
          name: 'New Subscribers',
          count: newSubscribers.length,
          description: 'Contacts added in the last 30 days',
          type: 'dynamic',
          lastUpdated: now,
          criteria: {
            status: ['ACTIVE'],
            dateRange: {
              field: 'createdAt',
              days: 30
            }
          }
        },
        {
          id: 'vip',
          name: 'VIP Customers',
          count: vipCustomers.length,
          description: 'High-value customers and premium subscribers',
          type: 'dynamic',
          lastUpdated: now,
          criteria: {
            status: ['ACTIVE'],
            tags: ['VIP', 'Premium', 'Enterprise', 'High-Value'],
            engagement: {
              minOpenRate: 0.8
            }
          }
        },
        {
          id: 'engaged',
          name: 'Highly Engaged',
          count: highlyEngaged.length,
          description: 'Contacts with high open and click rates',
          type: 'dynamic',
          lastUpdated: now,
          criteria: {
            status: ['ACTIVE'],
            engagement: {
              minOpenCount: 3
            },
            dateRange: {
              field: 'lastOpenedAt',
              days: 60
            }
          }
        },
        {
          id: 'inactive',
          name: 'Re-engagement List',
          count: reengagementList.length,
          description: 'Contacts who need re-engagement',
          type: 'dynamic',
          lastUpdated: now,
          criteria: {
            status: ['ACTIVE'],
            exclusions: {
              bounced: true,
              unsubscribed: true,
              inactive: false // We want inactive contacts for re-engagement
            }
          }
        }
      ];
    } catch (error) {
      console.error('Failed to calculate dynamic contact groups:', error);
      
      // Return empty groups for production
      return [
        {
          id: 'all',
          name: 'All Contacts',
          count: 0,
          description: 'All active contacts in your database',
          type: 'dynamic',
          lastUpdated: now
        },
        {
          id: 'active',
          name: 'Active Subscribers',
          count: 0,
          description: 'Contacts who have opened emails recently',
          type: 'dynamic',
          lastUpdated: now
        },
        {
          id: 'new',
          name: 'New Subscribers',
          count: 0,
          description: 'Contacts added in the last 30 days',
          type: 'dynamic',
          lastUpdated: now
        },
        {
          id: 'vip',
          name: 'VIP Customers',
          count: 0,
          description: 'High-value customers and premium subscribers',
          type: 'dynamic',
          lastUpdated: now
        },
        {
          id: 'engaged',
          name: 'Highly Engaged',
          count: 0,
          description: 'Contacts with high open and click rates',
          type: 'dynamic',
          lastUpdated: now
        },
        {
          id: 'inactive',
          name: 'Re-engagement List',
          count: 0,
          description: 'Contacts who need re-engagement',
          type: 'dynamic',
          lastUpdated: now
        }
      ];
    }
  }

  /**
   * Get contacts for a specific group
   */
  async getContactsForGroup(groupId: string): Promise<Contact[]> {
    switch (groupId) {
      case 'all':
        return this.getAllContacts();
      case 'active':
        return this.getActiveSubscribers();
      case 'new':
        return this.getNewSubscribers();
      case 'vip':
        return this.getVIPCustomers();
      case 'engaged':
        return this.getHighlyEngaged();
      case 'inactive':
        return this.getReengagementList();
      default:
        return [];
    }
  }

  /**
   * Get contact emails for campaign sending
   */
  async getContactEmailsForGroups(groupIds: string[]): Promise<string[]> {
    const allContacts = new Set<string>();
    
    for (const groupId of groupIds) {
      const contacts = await this.getContactsForGroup(groupId);
      contacts.forEach(contact => allContacts.add(contact.email));
    }
    
    return Array.from(allContacts);
  }

  /**
   * Refresh contact data (clear cache)
   */
  refreshCache(): void {
    this.contactsLoaded = false;
    this.lastFetchTime = 0;
    this.contacts = [];
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { loaded: boolean; lastFetch: number; count: number } {
    return {
      loaded: this.contactsLoaded,
      lastFetch: this.lastFetchTime,
      count: this.contacts.length
    };
  }
}

// Export singleton instance
export const contactGroupsService = new ContactGroupsService();
export default contactGroupsService;
