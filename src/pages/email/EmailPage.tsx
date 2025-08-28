import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Plus, 
  Send, 
  Calendar, 
  Users, 
  FileText, 
  Sparkles,
  TrendingUp,
  Search,
  Eye,
  Clock,
  Trash2,
  Edit
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useCampaigns } from '../../hooks/useCampaigns';
import type { Campaign } from '../../lib/api';
import { Modal } from '../../components/ui/Modal';

export const EmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'sending'>('all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; campaign: Campaign | null }>({ isOpen: false, campaign: null });

  const { 
    campaigns, 
    loading, 
    error, 
    total,
    refreshCampaigns,
    sendCampaign,
    scheduleCampaign,
    deleteCampaign
  } = useCampaigns({
    search: searchTerm,
    status: filterStatus,
    autoRefresh: true,
    refreshInterval: 10000
  });

  // Calculate stats from campaigns
  const stats = [
    {
      title: 'Total Campaigns',
      value: total.toString(),
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    
    {
      title: 'Active Recipients',
      value: campaigns.reduce((sum, campaign) => sum + campaign.recipients, 0).toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Avg Open Rate',
      value: campaigns.length > 0 
        ? `${(campaigns.filter(c => c.openRate).reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.filter(c => c.openRate).length || 0).toFixed(1)}%`
        : '0%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Emails Sent Today',
      value: campaigns.filter(c => c.sentAt && new Date(c.sentAt).toDateString() === new Date().toDateString()).reduce((sum, c) => sum + c.recipients, 0).toLocaleString(),
      icon: <Send className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ];

  const getStatusBadge = (status: Campaign['status']) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sent: 'bg-green-100 text-green-800',
      sending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleSendCampaign = async (campaignId: string) => {
    await sendCampaign(campaignId);
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    await deleteCampaign(campaignId);
  };

  const handleRescheduleCampaign = async (campaignId: string) => {
    // For now, just reschedule to tomorrow at 9 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    await scheduleCampaign(campaignId, tomorrow.toISOString());
  };

  const filteredCampaigns = campaigns;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
              <p className="text-gray-600 mt-1">Manage and track your email marketing campaigns</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/ai-composer')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Compose
              </Button>
              <Button
                onClick={() => navigate('/campaigns/create')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 ${stat.color} rounded-lg`}>
                      <div className="text-white">{stat.icon}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'draft' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('draft')}
                >
                  Drafts
                </Button>
                <Button
                  variant={filterStatus === 'scheduled' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('scheduled')}
                >
                  Scheduled
                </Button>
                <Button
                  variant={filterStatus === 'sent' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('sent')}
                >
                  Sent
                </Button>
                <Button
                  variant={filterStatus === 'sending' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('sending')}
                >
                  Sending
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-sm">⚠️ {error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshCampaigns}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaigns List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{campaign.subject}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {(campaign.recipients || campaign.recipientCount || 0).toLocaleString()} recipients
                          </span>
                          {campaign.openRate && (
                            <span>Open Rate: {campaign.openRate}%</span>
                          )}
                          {campaign.clickRate && (
                            <span>Click Rate: {campaign.clickRate}%</span>
                          )}
                          <span>
                            {campaign.status === 'sent' && campaign.sentAt && 
                              `Sent: ${new Date(campaign.sentAt).toLocaleDateString()}`
                            }
                            {campaign.status === 'scheduled' && campaign.scheduledAt && 
                              `Scheduled: ${new Date(campaign.scheduledAt).toLocaleDateString()}`
                            }
                            {(campaign.status === 'draft' || campaign.status === 'sending') &&
                              `Created: ${new Date(campaign.createdAt).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        
                        {campaign.status === 'draft' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleSendCampaign(campaign.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Send
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDeleteModal({ isOpen: true, campaign })}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                        
                        {campaign.status === 'scheduled' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRescheduleCampaign(campaign.id)}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Reschedule
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </>
                        )}
                        
                        {campaign.status === 'sent' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
                            >
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Analytics
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/campaigns/${campaign.id}/duplicate`)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Duplicate
                            </Button>
                          </>
                        )}
                        
                        {campaign.status === 'sending' && (
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <Clock className="w-4 h-4 animate-spin" />
                            Sending...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {filteredCampaigns.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {error ? 'Backend Connection Issue' : 'No campaigns found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {error ? (
                  <>
                    {error}
                    <br />
                    <span className="text-sm mt-2 block">
                      Check the browser console for more details or see BACKEND_SETUP.md for setup instructions.
                    </span>
                  </>
                ) : searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first email campaign"
                }
              </p>
              {error ? (
                <div className="flex gap-3 justify-center">
                  <Button onClick={refreshCampaigns} variant="outline">
                    🔄 Retry Connection
                  </Button>
                  <Button 
                    onClick={() => window.open('https://github.com/your-repo/backend-setup', '_blank')}
                    variant="outline"
                  >
                    📖 Setup Guide
                  </Button>
                </div>
              ) : !searchTerm && filterStatus === 'all' && (
                <Button onClick={() => navigate('/campaigns/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, campaign: null })}
        title="Delete Campaign"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{deleteModal.campaign?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, campaign: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (deleteModal.campaign) {
                  await handleDeleteCampaign(deleteModal.campaign.id);
                  setDeleteModal({ isOpen: false, campaign: null });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EmailPage;
