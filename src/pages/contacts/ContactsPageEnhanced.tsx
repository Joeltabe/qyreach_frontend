import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Download, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserPlus,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  Building,
  Phone,
  Tag,
  Settings,
  PieChart,
  BarChart3,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags: string[];
  status: 'ACTIVE' | 'BOUNCED' | 'UNSUBSCRIBED';
  source: string;
  createdAt: string;
  lastContactedAt?: string;
  engagementScore: number;
  totalCampaigns: number;
  openRate: number;
  clickRate: number;
  location?: string;
  industry?: string;
  customFields?: Record<string, any>;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  contactCount: number;
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
}

interface SegmentCriteria {
  status?: string[];
  tags?: string[];
  source?: string[];
  engagementScore?: { min?: number; max?: number };
  openRate?: { min?: number; max?: number };
  clickRate?: { min?: number; max?: number };
  location?: string[];
  industry?: string[];
  dateRange?: { field: string; start?: string; end?: string };
  customFields?: Record<string, any>;
}

// Mock data to handle API issues
const mockContacts: Contact[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Tech Corp',
    phone: '+1-555-0123',
    tags: ['VIP', 'Enterprise'],
    status: 'ACTIVE',
    source: 'Website',
    createdAt: '2024-01-15T10:00:00Z',
    lastContactedAt: '2024-08-20T14:30:00Z',
    engagementScore: 85,
    totalCampaigns: 12,
    openRate: 78.5,
    clickRate: 12.3,
    location: 'New York, NY',
    industry: 'Technology'
  },
  {
    id: '2',
    email: 'jane.smith@startup.io',
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'Startup Inc',
    phone: '+1-555-0124',
    tags: ['Startup', 'Early Adopter'],
    status: 'ACTIVE',
    source: 'Social Media',
    createdAt: '2024-02-10T11:00:00Z',
    lastContactedAt: '2024-08-18T16:45:00Z',
    engagementScore: 92,
    totalCampaigns: 8,
    openRate: 89.2,
    clickRate: 18.7,
    location: 'San Francisco, CA',
    industry: 'Technology'
  },
  {
    id: '3',
    email: 'mike.johnson@retail.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    company: 'Retail Plus',
    phone: '+1-555-0125',
    tags: ['Retail', 'B2B'],
    status: 'ACTIVE',
    source: 'Trade Show',
    createdAt: '2024-03-05T09:30:00Z',
    lastContactedAt: '2024-08-15T10:20:00Z',
    engagementScore: 67,
    totalCampaigns: 15,
    openRate: 65.8,
    clickRate: 8.9,
    location: 'Chicago, IL',
    industry: 'Retail'
  },
  {
    id: '4',
    email: 'bounced@example.com',
    firstName: 'Bounced',
    lastName: 'Email',
    company: 'Unknown',
    tags: ['Invalid'],
    status: 'BOUNCED',
    source: 'Import',
    createdAt: '2024-01-20T15:00:00Z',
    engagementScore: 0,
    totalCampaigns: 3,
    openRate: 0,
    clickRate: 0,
    location: 'Unknown',
    industry: 'Unknown'
  },
  {
    id: '5',
    email: 'unsubscribed@test.com',
    firstName: 'Unsubscribed',
    lastName: 'User',
    company: 'Former Customer',
    tags: ['Former Customer'],
    status: 'UNSUBSCRIBED',
    source: 'Website',
    createdAt: '2024-02-01T12:00:00Z',
    lastContactedAt: '2024-06-01T08:00:00Z',
    engagementScore: 45,
    totalCampaigns: 20,
    openRate: 55.3,
    clickRate: 7.2,
    location: 'Boston, MA',
    industry: 'Finance'
  }
];

const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'High Engagement VIPs',
    description: 'Highly engaged contacts with VIP status and high open rates',
    criteria: {
      tags: ['VIP'],
      engagementScore: { min: 80 },
      openRate: { min: 70 }
    },
    contactCount: 45,
    createdAt: '2024-01-10T10:00:00Z',
    lastUpdated: '2024-08-20T14:30:00Z',
    isActive: true
  },
  {
    id: '2',
    name: 'Tech Industry Leaders',
    description: 'Technology industry contacts with leadership roles',
    criteria: {
      industry: ['Technology'],
      status: ['ACTIVE'],
      engagementScore: { min: 60 }
    },
    contactCount: 128,
    createdAt: '2024-02-05T11:00:00Z',
    lastUpdated: '2024-08-18T16:45:00Z',
    isActive: true
  },
  {
    id: '3',
    name: 'Re-engagement Needed',
    description: 'Active contacts with low engagement that need attention',
    criteria: {
      status: ['ACTIVE'],
      engagementScore: { max: 50 },
      openRate: { max: 40 }
    },
    contactCount: 89,
    createdAt: '2024-03-01T09:30:00Z',
    lastUpdated: '2024-08-15T10:20:00Z',
    isActive: true
  }
];

const ContactsPageEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'segments' | 'upload' | 'analytics'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [segments, setSegments] = useState<Segment[]>(mockSegments);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BOUNCED' | 'UNSUBSCRIBED'>('ALL');
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  
  // Modals
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showContactDetailModal, setShowContactDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Forms
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    tags: [] as string[],
    location: '',
    industry: ''
  });
  
  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    criteria: {} as SegmentCriteria
  });

  // Filter contacts based on search, status, and segment
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || contact.status === statusFilter;
    
    const matchesSegment = !selectedSegment || 
      (selectedSegment && checkContactMatchesSegment(contact, segments.find(s => s.id === selectedSegment)?.criteria));
    
    return matchesSearch && matchesStatus && matchesSegment;
  });

  // Check if contact matches segment criteria
  const checkContactMatchesSegment = (contact: Contact, criteria?: SegmentCriteria): boolean => {
    if (!criteria) return true;
    
    // Status check
    if (criteria.status && !criteria.status.includes(contact.status)) return false;
    
    // Tags check
    if (criteria.tags && !criteria.tags.some(tag => contact.tags.includes(tag))) return false;
    
    // Source check
    if (criteria.source && !criteria.source.includes(contact.source)) return false;
    
    // Engagement score check
    if (criteria.engagementScore) {
      if (criteria.engagementScore.min && contact.engagementScore < criteria.engagementScore.min) return false;
      if (criteria.engagementScore.max && contact.engagementScore > criteria.engagementScore.max) return false;
    }
    
    // Open rate check
    if (criteria.openRate) {
      if (criteria.openRate.min && contact.openRate < criteria.openRate.min) return false;
      if (criteria.openRate.max && contact.openRate > criteria.openRate.max) return false;
    }
    
    // Industry check
    if (criteria.industry && !criteria.industry.includes(contact.industry || '')) return false;
    
    return true;
  };

  const getStatusBadge = (status: Contact['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'BOUNCED': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'UNSUBSCRIBED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Contact['status']) => {
    switch (status) {
      case 'ACTIVE': return CheckCircle;
      case 'BOUNCED': return XCircle;
      case 'UNSUBSCRIBED': return AlertTriangle;
      default: return Users;
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleAddContact = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact,
        tags: newContact.tags,
        status: 'ACTIVE',
        source: 'MANUAL',
        createdAt: new Date().toISOString(),
        engagementScore: 50,
        totalCampaigns: 0,
        openRate: 0,
        clickRate: 0
      };
      
      setContacts(prev => [contact, ...prev]);
      setNewContact({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        tags: [],
        location: '',
        industry: ''
      });
      setShowAddContactModal(false);
      toast.success('Contact added successfully!');
    } catch (error) {
      toast.error('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSegment = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const segment: Segment = {
        id: Date.now().toString(),
        name: newSegment.name,
        description: newSegment.description,
        criteria: newSegment.criteria,
        contactCount: contacts.filter(c => checkContactMatchesSegment(c, newSegment.criteria)).length,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true
      };
      
      setSegments(prev => [segment, ...prev]);
      setNewSegment({
        name: '',
        description: '',
        criteria: {}
      });
      setShowSegmentModal(false);
      toast.success('Segment created successfully!');
    } catch (error) {
      toast.error('Failed to create segment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    toast.success('Contact deleted successfully!');
  };

  const handleDeleteSegment = (segmentId: string) => {
    setSegments(prev => prev.filter(s => s.id !== segmentId));
    toast.success('Segment deleted successfully!');
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAllContacts = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length 
        ? [] 
        : filteredContacts.map(c => c.id)
    );
  };

  // Analytics calculations
  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => c.status === 'ACTIVE').length;
  const averageEngagement = contacts.reduce((sum, c) => sum + c.engagementScore, 0) / contacts.length;
  const averageOpenRate = contacts.reduce((sum, c) => sum + c.openRate, 0) / contacts.length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Organize, segment, and engage with your audience effectively
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowAddContactModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
            <Button
              onClick={() => setShowSegmentModal(true)}
              variant="outline"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Segment
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Contacts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalContacts.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Contacts
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeContacts.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Engagement
                </p>
                <p className={`text-2xl font-bold ${getEngagementColor(averageEngagement)}`}>
                  {averageEngagement.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Open Rate
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {averageOpenRate.toFixed(1)}%
                </p>
              </div>
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'contacts', label: 'Contacts', icon: Users },
              { id: 'segments', label: 'Segments', icon: Target },
              { id: 'upload', label: 'Import', icon: Upload },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="BOUNCED">Bounced</option>
                      <option value="UNSUBSCRIBED">Unsubscribed</option>
                    </select>
                    
                    <select
                      value={selectedSegment}
                      onChange={(e) => setSelectedSegment(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">All Segments</option>
                      {segments.map(segment => (
                        <option key={segment.id} value={segment.id}>
                          {segment.name} ({segment.contactCount})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {filteredContacts.length} of {totalContacts} contacts
                    </span>
                    {selectedContacts.length > 0 && (
                      <Badge variant="secondary">
                        {selectedContacts.length} selected
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Contacts Table */}
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                            onChange={handleSelectAllContacts}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Engagement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tags
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredContacts.map((contact) => {
                        const StatusIcon = getStatusIcon(contact.status);
                        return (
                          <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact.id)}
                                onChange={() => handleSelectContact(contact.id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {contact.firstName?.[0] || contact.email[0].toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {contact.firstName} {contact.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {contact.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {contact.company || '-'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {contact.location || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <StatusIcon className="w-4 h-4 mr-2" />
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(contact.status)}`}>
                                  {contact.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <div className={`font-medium ${getEngagementColor(contact.engagementScore)}`}>
                                  {contact.engagementScore}% Score
                                </div>
                                <div className="text-gray-500">
                                  {contact.openRate.toFixed(1)}% Opens
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {contact.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {contact.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{contact.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedContact(contact);
                                    setShowContactDetailModal(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteContact(contact.id)}
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
              </Card>
            </motion.div>
          )}

          {activeTab === 'segments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segments.map((segment) => (
                  <Card key={segment.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {segment.name}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSegment(segment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {segment.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Contacts</span>
                        <span className="text-lg font-semibold text-blue-600">
                          {segment.contactCount}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Updated</span>
                        <span className="text-sm text-gray-600">
                          {new Date(segment.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedSegment(segment.id)}
                      >
                        View Contacts
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Contact Modal */}
        {showAddContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Contact</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name"
                    value={newContact.firstName}
                    onChange={(e) => setNewContact(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    placeholder="Last Name"
                    value={newContact.lastName}
                    onChange={(e) => setNewContact(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                />
                
                <Input
                  placeholder="Company"
                  value={newContact.company}
                  onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                />
                
                <Input
                  placeholder="Phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                />
                
                <Input
                  placeholder="Location"
                  value={newContact.location}
                  onChange={(e) => setNewContact(prev => ({ ...prev, location: e.target.value }))}
                />
                
                <Input
                  placeholder="Industry"
                  value={newContact.industry}
                  onChange={(e) => setNewContact(prev => ({ ...prev, industry: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddContactModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddContact}
                  disabled={!newContact.email || loading}
                >
                  {loading ? 'Adding...' : 'Add Contact'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Segment Modal */}
        {showSegmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Create New Segment</h3>
              
              <div className="space-y-4">
                <Input
                  placeholder="Segment Name"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                />
                
                <textarea
                  placeholder="Description"
                  value={newSegment.description}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Criteria</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Engagement Score
                    </label>
                    <Input
                      type="number"
                      placeholder="0-100"
                      onChange={(e) => setNewSegment(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria,
                          engagementScore: { min: parseInt(e.target.value) || 0 }
                        }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      onChange={(e) => setNewSegment(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria,
                          status: e.target.value ? [e.target.value] : undefined
                        }
                      }))}
                    >
                      <option value="">Any Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="BOUNCED">Bounced</option>
                      <option value="UNSUBSCRIBED">Unsubscribed</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSegmentModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSegment}
                  disabled={!newSegment.name || loading}
                >
                  {loading ? 'Creating...' : 'Create Segment'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Detail Modal */}
        {showContactDetailModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Contact Details</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowContactDetailModal(false)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedContact.email}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedContact.company || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedContact.phone || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedContact.status)}`}>
                      {selectedContact.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Engagement Score
                    </label>
                    <p className={`font-semibold ${getEngagementColor(selectedContact.engagementScore)}`}>
                      {selectedContact.engagementScore}%
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Open Rate
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedContact.openRate.toFixed(1)}%
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Click Rate
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedContact.clickRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {selectedContact.tags.length === 0 && (
                    <p className="text-gray-500">No tags</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContactsPageEnhanced;
