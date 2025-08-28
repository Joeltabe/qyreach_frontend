import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Send, 
  Calendar, 
  Users, 
  Eye, 
  Mail,
  TrendingUp,
  Clock,
  FileText,
  Download,
  Share,
  Trash2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import EmailPreview from '../../components/EmailPreview';
import { useCampaigns } from '../../hooks/useCampaigns';
import { robustCampaignsApi } from '../../lib/robust-campaigns-api';
import type { Campaign } from '../../lib/api';
import toast from 'react-hot-toast';

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sendCampaign, deleteCampaign } = useCampaigns();

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await robustCampaignsApi.getCampaign(id);
      if (response.data.success) {
        setCampaign(response.data.data);
      } else {
        setError('Failed to load campaign details');
      }
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSendCampaign = async () => {
    if (!campaign) return;
    
    try {
      const success = await sendCampaign(campaign.id);
      if (success) {
        toast.success('Campaign sent successfully!');
        fetchCampaignDetails(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to send campaign');
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaign) return;
    
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        const success = await deleteCampaign(campaign.id);
        if (success) {
          toast.success('Campaign deleted successfully!');
          navigate('/campaigns');
        }
      } catch (error) {
        toast.error('Failed to delete campaign');
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !campaign) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The campaign you\'re looking for doesn\'t exist.'}</p>
            <Button onClick={() => navigate('/campaigns')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: 'Recipients',
      value: campaign.recipients.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Open Rate',
      value: campaign.openRate ? `${campaign.openRate}%` : 'N/A',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Click Rate',
      value: campaign.clickRate ? `${campaign.clickRate}%` : 'N/A',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Status',
      value: campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1),
      icon: <Mail className="w-5 h-5" />,
      color: 'text-orange-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/campaigns')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                {getStatusBadge(campaign.status)}
              </div>
              <p className="text-gray-600 mt-1">{campaign.subject}</p>
            </div>
            <div className="flex items-center gap-2">
              {campaign.status === 'draft' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={handleSendCampaign}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleDeleteCampaign}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Email Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Email Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmailPreview
                  content={campaign.content}
                  subject={campaign.subject}
                  className="border-0"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Info */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(campaign.createdAt).toLocaleDateString()} at{' '}
                    {new Date(campaign.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                {campaign.scheduledAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Scheduled</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(campaign.scheduledAt).toLocaleDateString()} at{' '}
                      {new Date(campaign.scheduledAt).toLocaleTimeString()}
                    </p>
                  </div>
                )}
                
                {campaign.sentAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sent</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(campaign.sentAt).toLocaleDateString()} at{' '}
                      {new Date(campaign.sentAt).toLocaleTimeString()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Recipients</label>
                  <p className="text-sm text-gray-900">
                    {campaign.recipients.toLocaleString()} contacts
                  </p>
                </div>

                {campaign.templateId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Template</label>
                    <p className="text-sm text-gray-900">{campaign.templateId}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {(campaign.status === 'sent' && (campaign.openRate || campaign.clickRate)) && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign.openRate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Open Rate</span>
                      <span className="text-sm font-medium">{campaign.openRate}%</span>
                    </div>
                  )}
                  {campaign.clickRate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Click Rate</span>
                      <span className="text-sm font-medium">{campaign.clickRate}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share Campaign
                </Button>
                {campaign.status === 'sent' && (
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetailPage;
