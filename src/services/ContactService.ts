import { api } from '../lib/api';
import toast from 'react-hot-toast';

// Contact interfaces
export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  position?: string;
  tags: string[];
  status: 'ACTIVE' | 'BOUNCED' | 'UNSUBSCRIBED';
  source: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export interface ContactFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  position?: string;
  tags?: string[];
  status?: 'ACTIVE' | 'BOUNCED' | 'UNSUBSCRIBED';
  source?: string;
}

export interface ContactFilters {
  search?: string;
  status?: string;
  source?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export interface ContactStats {
  total: number;
  active: number;
  bounced: number;
  unsubscribed: number;
  recentlyAdded: number;
}

export interface UploadResult {
  fileName?: string;
  fileSize?: number;
  processedAt?: string;
  summary?: {
    totalExtracted: number;
    newContacts: number;
    duplicatesSkipped: number;
    savedContacts: number;
    errors: number;
  };
  contacts?: Contact[];
  errors?: string[];
}

// Contact Service Class
export class ContactService {
  
  // Fetch contacts with filters and pagination
  static async getContacts(filters: ContactFilters = {}): Promise<{
    contacts: Contact[];
    pagination: any;
  }> {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 1000,
        search: filters.search || '',
        status: filters.status || '',
        source: filters.source || '',
        tags: filters.tags || '',
      };

      const response = await api.get('/api/contacts', { params });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch contacts');
      }
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error('Company context required. Please ensure you are logged in properly.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        throw new Error('Failed to load contacts. Please try again.');
      }
    }
  }

  // Get single contact by ID
  static async getContact(id: string): Promise<Contact> {
    try {
      const response = await api.get(`/api/contacts/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch contact');
      }
    } catch (error: any) {
      console.error('Failed to fetch contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to load contact');
    }
  }

  // Create a new contact
  static async createContact(data: ContactFormData): Promise<Contact> {
    try {
      const contactData = {
        ...data,
        status: data.status || 'ACTIVE',
        source: data.source || 'MANUAL'
      };

      const response = await api.post('/api/contacts', contactData);
      
      if (response.data.success) {
        toast.success('Contact created successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to create contact');
      }
    } catch (error: any) {
      console.error('Failed to create contact:', error);
      
      if (error.response?.status === 409) {
        const message = 'A contact with this email already exists';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.response?.data?.message || 'Failed to create contact';
        toast.error(message);
        throw new Error(message);
      }
    }
  }

  // Update an existing contact
  static async updateContact(id: string, data: Partial<ContactFormData>): Promise<Contact> {
    try {
      const response = await api.put(`/api/contacts/${id}`, data);
      
      if (response.data.success) {
        toast.success('Contact updated successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update contact');
      }
    } catch (error: any) {
      console.error('Failed to update contact:', error);
      const message = error.response?.data?.message || 'Failed to update contact';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Delete a contact
  static async deleteContact(id: string): Promise<void> {
    try {
      const response = await api.delete(`/api/contacts/${id}`);
      
      if (response.data.success) {
        toast.success('Contact deleted successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to delete contact');
      }
    } catch (error: any) {
      console.error('Failed to delete contact:', error);
      const message = error.response?.data?.message || 'Failed to delete contact';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Delete multiple contacts
  static async deleteContacts(ids: string[]): Promise<void> {
    try {
      const response = await api.delete('/api/contacts/bulk', {
        data: { contactIds: ids }
      });
      
      if (response.data.success) {
        toast.success(`Successfully deleted ${ids.length} contacts!`);
      } else {
        throw new Error(response.data.error || 'Failed to delete contacts');
      }
    } catch (error: any) {
      console.error('Failed to delete contacts:', error);
      const message = error.response?.data?.message || 'Failed to delete contacts';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Upload contacts from file
  static async uploadContacts(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    // Enhanced file validation
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/plain',
      'application/json'
    ];

    const allowedExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.csv', '.txt', '.json'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    // Validate file type and extension
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      const message = 'Unsupported file format. Please upload PDF, Word, Excel, CSV, TXT, or JSON files.';
      toast.error(message);
      throw new Error(message);
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      const message = 'File size too large. Please upload files smaller than 50MB.';
      toast.error(message);
      throw new Error(message);
    }

    // Enhanced validation for empty files
    if (file.size === 0) {
      const message = 'Cannot upload empty files.';
      toast.error(message);
      throw new Error(message);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('skipDuplicates', 'true');
    formData.append('validateEmails', 'true');
    formData.append('parseDocuments', 'true');

    try {
      // Show loading toast with file info
      toast.loading(`Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)...`, { id: 'upload' });
      
      const response = await api.post('/api/upload/contacts/enhanced', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minute timeout for large files
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
            toast.loading(`Uploading ${file.name}... ${percentCompleted}%`, { id: 'upload' });
          }
        },
      });
      
      const result = response.data.data;
      
      // Enhanced success message with details
      const successMessage = result.summary?.errors > 0 
        ? `Processed ${result.summary.savedContacts} contacts with ${result.summary.errors} warnings`
        : `Successfully processed ${result.summary?.savedContacts || 0} contacts from ${file.name}`;
      
      toast.success(successMessage, { id: 'upload', duration: 5000 });
      
      // Show detailed results if there are issues
      if (result.summary?.duplicatesSkipped && result.summary.duplicatesSkipped > 0) {
        toast(`Skipped ${result.summary.duplicatesSkipped} duplicate contacts`, { 
          icon: 'ℹ️', 
          duration: 4000 
        });
      }
      
      return result;
      
    } catch (error: any) {
      console.error('Failed to upload file:', error);
      
      let errorMessage = 'Failed to process file';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please try with a smaller file.';
      } else if (error.response?.status === 413) {
        errorMessage = 'File too large. Please reduce file size and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many uploads. Please wait a moment and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, { id: 'upload', duration: 6000 });
      throw new Error(errorMessage);
    }
  }

  // Get contact statistics
  static async getStats(): Promise<ContactStats> {
    try {
      const response = await api.get('/api/contacts/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch stats');
      }
    } catch (error: any) {
      console.error('Failed to fetch contact stats:', error);
      
      // Return default stats if API fails
      return {
        total: 0,
        active: 0,
        bounced: 0,
        unsubscribed: 0,
        recentlyAdded: 0,
      };
    }
  }

  // Export contacts
  static async exportContacts(format: 'csv' | 'excel' = 'csv'): Promise<void> {
    try {
      const response = await api.get(`/api/contacts/export?format=${format}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contacts.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Contacts exported successfully!');
    } catch (error: any) {
      console.error('Failed to export contacts:', error);
      const message = error.response?.data?.message || 'Failed to export contacts';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Validate email address
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Format contact display name
  static getDisplayName(contact: Contact): string {
    if (contact.firstName && contact.lastName) {
      return `${contact.firstName} ${contact.lastName}`;
    } else if (contact.firstName) {
      return contact.firstName;
    } else if (contact.lastName) {
      return contact.lastName;
    } else {
      return contact.email;
    }
  }

  // Get contact initials for avatar
  static getInitials(contact: Contact): string {
    if (contact.firstName && contact.lastName) {
      return `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();
    } else if (contact.firstName) {
      return contact.firstName[0].toUpperCase();
    } else {
      return contact.email[0].toUpperCase();
    }
  }

  // Format contact tags
  static formatTags(tags: string[]): string {
    return tags.join(', ');
  }

  // Parse tag string to array
  static parseTags(tagString: string): string[] {
    if (!tagString) return [];
    return tagString.split(',').map(tag => tag.trim()).filter(Boolean);
  }
}

export default ContactService;
