import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED';
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  template?: {
    name: string;
  };
}

const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Campaign['status']>('all');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/campaigns');
      setCampaigns(response.data.data.campaigns || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'SENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SENT': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'DRAFT': return Edit;
      case 'SCHEDULED': return Clock;
      case 'SENDING': return Send;
      case 'SENT': return CheckCircle;
      case 'PAUSED': return AlertCircle;
      default: return Edit;
    }
  };

  const calculateOpenRate = (campaign: Campaign) => {
    if (campaign.deliveredCount === 0) return 0;
    return (campaign.openedCount / campaign.deliveredCount) * 100;
  };

  const calculateClickRate = (campaign: Campaign) => {
    if (campaign.openedCount === 0) return 0;
    return (campaign.clickedCount / campaign.openedCount) * 100;
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statsOverview = {
    total: campaigns.length,
    sent: campaigns.filter(c => c.status === 'SENT').length,
    scheduled: campaigns.filter(c => c.status === 'SCHEDULED').length,
    draft: campaigns.filter(c => c.status === 'DRAFT').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Send className="text-brand-primary" />
                Email Campaigns
              </h1>
              <p className="text-gray-600 mt-2">
                Create, manage, and track your email campaigns
              </p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate('/campaigns/create')}
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Campaigns', value: statsOverview.total, icon: Send, color: 'blue' },
            { label: 'Sent', value: statsOverview.sent, icon: CheckCircle, color: 'green' },
            { label: 'Scheduled', value: statsOverview.scheduled, icon: Clock, color: 'yellow' },
            { label: 'Drafts', value: statsOverview.draft, icon: Edit, color: 'gray' }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="SENDING">Sending</option>
                <option value="SENT">Sent</option>
                <option value="PAUSED">Paused</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Campaigns List */}
        {filteredCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first email campaign to get started'}
            </p>
            <Button onClick={() => navigate('/campaigns/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => {
              const StatusIcon = getStatusIcon(campaign.status);
              const openRate = calculateOpenRate(campaign);
              const clickRate = calculateClickRate(campaign);
              
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                          <Badge className={`flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {campaign.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{campaign.subject}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{campaign.recipientCount.toLocaleString()} recipients</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {campaign.status === 'SCHEDULED' && campaign.scheduledAt
                                ? `Scheduled for ${new Date(campaign.scheduledAt).toLocaleDateString()}`
                                : `Created ${new Date(campaign.createdAt).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                          {campaign.template && (
                            <div>
                              Template: {campaign.template.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {campaign.status === 'SENT' && (
                          <div className="grid grid-cols-2 gap-4 text-center mr-6">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{openRate.toFixed(1)}%</p>
                              <p className="text-xs text-gray-500">Open Rate</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{clickRate.toFixed(1)}%</p>
                              <p className="text-xs text-gray-500">Click Rate</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          {campaign.status === 'DRAFT' && (
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {campaign.status === 'SENDING' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{campaign.sentCount} / {campaign.recipientCount} sent</span>
                        </div>
                        <Progress 
                          value={(campaign.sentCount / campaign.recipientCount) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {campaign.status === 'SENT' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{campaign.sentCount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Sent</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{campaign.deliveredCount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Delivered</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{campaign.openedCount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Opened</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{campaign.clickedCount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Clicked</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;