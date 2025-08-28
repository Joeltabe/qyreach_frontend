import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Send, 
  Save, 
  Eye, 
  Users, 
  FileText, 
  Calendar,
  Settings,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import SimpleEmailPreview from '../../../components/SimpleEmailPreview';
import api from '../../../lib/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useContactGroups } from '../../../hooks/useContactGroups';
import type { ContactGroup } from '../../../services/contactGroupsService';

interface CampaignForm {
  name: string;
  subject: string;
  senderName: string;
  replyTo: string;
  templateId?: string;
  recipientGroups: string[];
  scheduledAt?: string;
  content: string;
}

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  
  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    name: '',
    subject: '',
    senderName: '',
    replyTo: '',
    recipientGroups: [],
    content: ''
  });

  // Use the new contact groups hook
  const {
    contactGroups,
    loading: loadingContacts,
    error: contactGroupsError,
    refreshGroups,
    getTotalRecipientsForGroups,
    getContactEmailsForGroups
  } = useContactGroups();

  // Load AI-generated content if coming from AI Composer
  useEffect(() => {
    const source = searchParams.get('source');
    if (source === 'ai-composer') {
      try {
        const pendingContent = localStorage.getItem('pendingCampaignContent');
        if (pendingContent) {
          const aiData = JSON.parse(pendingContent);
          setCampaignForm(prev => ({
            ...prev,
            subject: aiData.subject || '',
            content: aiData.content || '',
            name: aiData.subject ? `Campaign: ${aiData.subject}` : ''
          }));
          
          // Navigate to content step if we have AI content
          setCurrentStep(3);
          
          // Clear the pending content
          localStorage.removeItem('pendingCampaignContent');
          
          // Show success notification
          toast.success('✨ AI-generated content loaded successfully!');
        }
      } catch (error) {
        console.error('Failed to load AI content:', error);
        toast.error('Failed to load AI-generated content');
      }
    }
  }, [searchParams]);

  const steps = [
    { id: 1, name: 'Campaign Details', icon: Settings },
    { id: 2, name: 'Recipients', icon: Users },
    { id: 3, name: 'Content', icon: FileText },
    { id: 4, name: 'Schedule', icon: Calendar },
    { id: 5, name: 'Review', icon: Eye }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      
      // Validate basic required fields for draft
      if (!campaignForm.name) {
        toast.error('Please enter a campaign name');
        return;
      }
      
      // For draft, we can save with empty recipients
      const recipients = campaignForm.recipientGroups.length > 0 
        ? await getContactEmailsForGroups(campaignForm.recipientGroups)
        : [];
      
      const campaignData = {
        name: campaignForm.name,
        subject: campaignForm.subject || 'Draft Campaign',
        content: campaignForm.content || '',
        recipients,
        type: 'MARKETING',
        status: 'DRAFT'
      };
      
      await api.post('/api/campaigns', campaignData);
      toast.success('Draft saved successfully!');
      navigate('/campaigns');
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      toast.error(error.response?.data?.error || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!campaignForm.name || !campaignForm.subject || !campaignForm.content) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (campaignForm.recipientGroups.length === 0) {
        toast.error('Please select at least one recipient group');
        return;
      }
      
      // Get email addresses from selected groups
      const recipients = await getContactEmailsForGroups(campaignForm.recipientGroups);
      
      if (recipients.length === 0) {
        toast.error('No contacts found in selected groups');
        return;
      }
      
      const campaignData = {
        name: campaignForm.name,
        subject: campaignForm.subject,
        content: campaignForm.content,
        recipients, // Array of email addresses
        type: 'MARKETING',
        ...(campaignForm.scheduledAt && { scheduledAt: campaignForm.scheduledAt }),
        status: campaignForm.scheduledAt ? 'SCHEDULED' : 'SENDING'
      };
      
      await api.post('/api/campaigns', campaignData);
      toast.success('Campaign created successfully!');
      navigate('/campaigns');
    } catch (error: any) {
      console.error('Failed to schedule campaign:', error);
      toast.error(error.response?.data?.error || 'Failed to create campaign');
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Campaign Details</h3>
            <div className="space-y-4">
              <Input
                label="Campaign Name"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                placeholder="Enter campaign name"
                required
              />
              <Input
                label="Email Subject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                placeholder="Enter email subject line"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sender Name"
                  value={campaignForm.senderName}
                  onChange={(e) => setCampaignForm({ ...campaignForm, senderName: e.target.value })}
                  placeholder="Your Company"
                  required
                />
                <Input
                  label="Reply To Email"
                  type="email"
                  value={campaignForm.replyTo}
                  onChange={(e) => setCampaignForm({ ...campaignForm, replyTo: e.target.value })}
                  placeholder="replies@yourcompany.com"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Select Recipients</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/contacts')}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Contacts
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">Choose which contact groups to send this campaign to:</p>
              
              {loadingContacts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactGroups.map((group) => {
                    const isSelected = campaignForm.recipientGroups.includes(group.id);
                    return (
                      <div 
                        key={group.id} 
                        className={`relative flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            setCampaignForm({
                              ...campaignForm,
                              recipientGroups: campaignForm.recipientGroups.filter(id => id !== group.id)
                            });
                          } else {
                            setCampaignForm({
                              ...campaignForm,
                              recipientGroups: [...campaignForm.recipientGroups, group.id]
                            });
                          }
                        }}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <Users className={`w-6 h-6 ${
                              isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {group.name}
                            </h4>
                            <p className={`text-sm ${
                              isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {group.description}
                            </p>
                            <p className={`text-xs mt-1 ${
                              isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {group.count.toLocaleString()} contacts
                            </p>
                          </div>
                        </div>
                        
                        <Badge className={`ml-4 ${
                          isSelected 
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {group.count.toLocaleString()}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Selection Summary */}
              {campaignForm.recipientGroups.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Campaign Summary
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {campaignForm.recipientGroups.length} group{campaignForm.recipientGroups.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {contactGroups
                          .filter(group => campaignForm.recipientGroups.includes(group.id))
                          .reduce((total, group) => total + group.count, 0)
                          .toLocaleString()
                        }
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Total Recipients</p>
                    </div>
                  </div>
                  
                  {/* Selected Groups List */}
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex flex-wrap gap-2">
                      {campaignForm.recipientGroups.map(groupId => {
                        const group = contactGroups.find(g => g.id === groupId);
                        if (!group) return null;
                        return (
                          <span 
                            key={groupId}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full"
                          >
                            {group.name} ({group.count.toLocaleString()})
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCampaignForm({
                                  ...campaignForm,
                                  recipientGroups: campaignForm.recipientGroups.filter(id => id !== groupId)
                                });
                              }}
                              className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {campaignForm.recipientGroups.length === 0 && !loadingContacts && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Select Recipient Groups
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Choose at least one contact group to send your campaign to
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/contacts')}
                  >
                    Import Contacts First
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Email Content</h3>
            
            {searchParams.get('source') === 'ai-composer' && campaignForm.content && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      <strong>AI-Generated Content Loaded!</strong> Your AI-generated email content has been automatically loaded from AI Composer.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex gap-3 mb-4">
                <Button variant="outline">Use Template</Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/ai/composer')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Composer
                </Button>
                <Button variant="outline">Import HTML</Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Content with Preview</label>
                <SimpleEmailPreview
                  initialContent={campaignForm.content}
                  onContentChange={(newContent) => setCampaignForm({ ...campaignForm, content: newContent })}
                  placeholder="Write your email content here... You can add text, images, and see a live preview!"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Available Variables</h4>
                <div className="flex flex-wrap gap-2">
                  {['{{firstName}}', '{{lastName}}', '{{email}}', '{{company}}'].map((variable) => (
                    <Badge key={variable} className="bg-blue-100 text-blue-800 cursor-pointer">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Schedule Campaign</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="send-now"
                    name="schedule"
                    checked={!campaignForm.scheduledAt}
                    onChange={() => setCampaignForm({ ...campaignForm, scheduledAt: undefined })}
                    className="rounded"
                  />
                  <label htmlFor="send-now" className="font-medium text-gray-900">
                    Send immediately
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="schedule-later"
                    name="schedule"
                    checked={!!campaignForm.scheduledAt}
                    onChange={() => setCampaignForm({ 
                      ...campaignForm, 
                      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
                    })}
                    className="rounded"
                  />
                  <label htmlFor="schedule-later" className="font-medium text-gray-900">
                    Schedule for later
                  </label>
                </div>
              </div>
              
              {campaignForm.scheduledAt && (
                <Input
                  label="Schedule Date & Time"
                  type="datetime-local"
                  value={campaignForm.scheduledAt}
                  onChange={(e) => setCampaignForm({ ...campaignForm, scheduledAt: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Review Campaign</h3>
            <div className="space-y-6">
              {/* Campaign Summary */}
              <Card className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Campaign Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{campaignForm.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">{campaignForm.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sender:</span>
                    <span className="font-medium">{campaignForm.senderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipients:</span>
                    <span className="font-medium">{campaignForm.recipientGroups.length * 100} contacts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Schedule:</span>
                    <span className="font-medium">
                      {campaignForm.scheduledAt 
                        ? new Date(campaignForm.scheduledAt).toLocaleString()
                        : 'Send immediately'
                      }
                    </span>
                  </div>
                </div>
              </Card>

              {/* Content Preview */}
              <Card className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Content Preview</h4>
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="text-sm text-gray-600 mb-2">Subject: {campaignForm.subject}</div>
                  <div className="text-sm whitespace-pre-wrap">
                    {campaignForm.content || 'No content provided'}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/campaigns')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Campaign</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Follow the steps below to create and send your email campaign</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-brand-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {step.id < steps.length && (
                    <div className={`w-12 h-px mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-8">
          {renderStepContent()}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSchedule} disabled={saving}>
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {campaignForm.scheduledAt ? 'Schedule Campaign' : 'Send Campaign'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCampaignPage;