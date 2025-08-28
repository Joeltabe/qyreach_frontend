import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Users, 
  CheckCircle, 
  XCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  FileText,
  TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

// Contact interface
interface Contact {
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
  companyId: string;
}

// Upload result interface
interface UploadResult {
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

export default function ContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'contacts' | 'upload' | 'history'>('contacts');
  
  // Upload states
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    position: '',
    tags: [] as string[]
  });
  const [addingContact, setAddingContact] = useState(false);

  // Fetch contacts with proper company context
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/contacts', {
        params: {
          page: 1,
          limit: 10000
        }
      });
      
      if (response.data.success) {
        setContacts(response.data.data.contacts || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch contacts');
      }
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        toast.error('Company context required. Please ensure you are logged in properly.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error('Failed to load contacts. Please try again.');
      }
      
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user, fetchContacts]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleEnhancedFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  // Individual contact action handlers
  const handleViewContact = (contact: Contact) => {
    toast(`Viewing contact: ${contact.email}`, { icon: '👁️' });
  };

  const handleEditContact = (contact: Contact) => {
    toast(`Editing contact: ${contact.email}`, { icon: '✏️' });
  };

  const handleDeleteContact = async (contact: Contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.email}?`)) {
      return;
    }

    try {
      await api.delete(`/api/contacts/${contact.id}`);
      setContacts(contacts.filter(c => c.id !== contact.id));
      toast.success('Contact deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete contact:', error);
      toast.error(error.response?.data?.error || 'Failed to delete contact');
    }
  };

  // Add single contact
  const handleAddContact = async () => {
    if (!newContact.email) {
      toast.error('Email is required');
      return;
    }

    try {
      setAddingContact(true);
      const response = await api.post('/api/contacts', {
        ...newContact,
        status: 'ACTIVE',
        source: 'MANUAL'
      });

      if (response.data.success) {
        setContacts([response.data.data, ...contacts]);
        setNewContact({
          email: '',
          firstName: '',
          lastName: '',
          company: '',
          phone: '',
          position: '',
          tags: []
        });
        setShowAddModal(false);
        toast.success('Contact added successfully!');
      }
    } catch (error: any) {
      console.error('Failed to add contact:', error);
      if (error.response?.status === 409) {
        toast.error('A contact with this email already exists');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add contact');
      }
    } finally {
      setAddingContact(false);
    }
  };

  // Enhanced file upload with production-grade validation
  const handleEnhancedFileUpload = async (file: File) => {
    if (!file) return;

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
      toast.error('Unsupported file format. Please upload PDF, Word, Excel, CSV, TXT, or JSON files.');
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('File size too large. Please upload files smaller than 50MB.');
      return;
    }

    // Enhanced validation for empty files
    if (file.size === 0) {
      toast.error('Cannot upload empty files.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('skipDuplicates', 'true');
    formData.append('validateEmails', 'true');
    formData.append('parseDocuments', 'true');

    try {
      setUploading(true);
      
      // Show loading toast with file info
      toast.loading(`Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)...`, { id: 'upload' });
      
      const response = await api.post('/api/upload/contacts/enhanced', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minute timeout for large files
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            toast.loading(`Uploading ${file.name}... ${percentCompleted}%`, { id: 'upload' });
          }
        },
      });
      
      const result = response.data.data;
      setUploadResult(result);
      
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
      
      // Refresh contacts list
      fetchContacts();
      
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
    } finally {
      setUploading(false);
    }
  };

  // Helper functions for UI
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return CheckCircle;
      case 'BOUNCED': return XCircle;
      case 'UNSUBSCRIBED': return XCircle;
      default: return CheckCircle;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'BOUNCED': return 'bg-red-100 text-red-800';
      case 'UNSUBSCRIBED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'contacts', label: 'All Contacts', icon: Users },
    { id: 'upload', label: 'Upload Contacts', icon: Upload },
    { id: 'history', label: 'Upload History', icon: FileText }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Users className="text-brand-primary" />
                Contact Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Upload, manage, and organize your email contacts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="px-3 py-1 text-sm bg-brand-primary text-white">
                {contacts.length} Total Contacts
              </Badge>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Search and filters */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="BOUNCED">Bounced</option>
                    <option value="UNSUBSCRIBED">Unsubscribed</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Contacts List */}
            <Card className="overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                  <p className="text-gray-500 mb-4">
                    {contacts.length === 0 
                      ? "Get started by adding your first contact or uploading a contact list."
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-brand-primary hover:bg-brand-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Contact
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Added
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredContacts.map((contact) => {
                        const StatusIcon = getStatusIcon(contact.status);
                        return (
                          <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-medium">
                                    {contact.firstName?.[0] || contact.email[0].toUpperCase()}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {contact.firstName} {contact.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {contact.company || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={`flex items-center gap-1 ${getStatusBadge(contact.status)}`}>
                                <StatusIcon className="w-3 h-3" />
                                {contact.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {contact.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewContact(contact)}
                                  title="View contact"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditContact(contact)}
                                  title="Edit contact"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteContact(contact)}
                                  title="Delete contact"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Contact List</h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                    <p className="text-gray-600">Processing your file...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your file here, or{' '}
                        <label className="text-brand-primary cursor-pointer hover:underline">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,.txt,.json"
                            onChange={(e) => e.target.files?.[0] && handleEnhancedFileUpload(e.target.files[0])}
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        📊 Excel (.xlsx, .xls) • 📄 Word (.docx, .doc) • 📕 PDF (.pdf)
                      </p>
                      <p className="text-sm text-gray-500">
                        📋 CSV (.csv) • 📝 Text (.txt) • 🗂️ JSON (.json)
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Maximum file size: 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="skipDuplicates" defaultChecked className="rounded" />
                  <label htmlFor="skipDuplicates" className="text-sm text-gray-700">
                    Skip duplicate emails
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="validateEmails" defaultChecked className="rounded" />
                  <label htmlFor="validateEmails" className="text-sm text-gray-700">
                    Validate email addresses
                  </label>
                </div>
              </div>
            </Card>

            {/* Upload Result */}
            {uploadResult && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Upload Results</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setUploadResult(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* File Info */}
                  {uploadResult.fileName && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">File Name</span>
                          <span className="font-medium">{uploadResult.fileName}</span>
                        </div>
                        {uploadResult.fileSize && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">File Size</span>
                            <span className="font-medium">{(uploadResult.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        )}
                        {uploadResult.processedAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Processed At</span>
                            <span className="font-medium">
                              {new Date(uploadResult.processedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Summary Stats */}
                  {uploadResult.summary && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Saved Contacts</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900 mt-1">
                          {uploadResult.summary.savedContacts || 0}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Total Extracted</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                          {uploadResult.summary.totalExtracted || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contact Preview */}
                  {uploadResult.contacts && uploadResult.contacts.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Contact Preview ({uploadResult.contacts.length} shown)
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {uploadResult.contacts.map((contact: any, index: number) => (
                          <div key={index} className="text-sm bg-white p-2 rounded border">
                            <div className="font-medium">{contact.email}</div>
                            {(contact.firstName || contact.lastName) && (
                              <div className="text-gray-600">
                                {contact.firstName} {contact.lastName}
                              </div>
                            )}
                            {contact.company && (
                              <div className="text-gray-500">{contact.company}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Processing Errors</h4>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {uploadResult.errors.map((error: string, index: number) => (
                          <div key={index} className="text-sm text-red-700">
                            • {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload History</h3>
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upload history</h3>
              <p className="text-gray-500">Upload history will appear here once you start uploading files.</p>
            </div>
          </Card>
        )}
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Contact"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                value={newContact.firstName}
                onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                value={newContact.lastName}
                onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <Input
                value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <Input
              value={newContact.position}
              onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
              placeholder="CEO"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
              disabled={addingContact}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddContact}
              disabled={addingContact || !newContact.email}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              {addingContact ? 'Adding...' : 'Add Contact'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
