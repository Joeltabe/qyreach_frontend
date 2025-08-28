import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Settings, Crown, Shield, Trash2, UserPlus, Edit } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  joinedAt: string;
  lastActiveAt: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  billingEmail: string;
  website?: string;
  createdAt: string;
  settings: {
    emailBranding: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
  };
}

const CompanyPage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    size: '',
    billingEmail: '',
    website: ''
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const [companyResponse, membersResponse] = await Promise.all([
        api.get('/api/company/profile'),
        api.get('/api/company/members')
      ]);

      setCompany(companyResponse.data.data.company);
      setMembers(membersResponse.data.data.members);
      
      // Initialize form with current company data
      const companyData = companyResponse.data.data.company;
      setCompanyForm({
        name: companyData.name,
        industry: companyData.industry,
        size: companyData.size,
        billingEmail: companyData.billingEmail,
        website: companyData.website || ''
      });
    } catch (error) {
      console.error('Failed to fetch company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/company/members', {
        email: inviteEmail,
        role: inviteRole,
        message: `You've been invited to join ${company?.name}`
      });
      
      setInviteEmail('');
      setInviteRole('MEMBER');
      await fetchCompanyData();
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/api/company/profile', companyForm);
      setEditingCompany(false);
      await fetchCompanyData();
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'MEMBER': return 'bg-green-100 text-green-800';
      case 'VIEWER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'FREE': return '🆓';
      case 'STARTER': return '🚀';
      case 'PROFESSIONAL': return '💼';
      case 'ENTERPRISE': return '👑';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Company Overview', icon: Building2 },
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

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
                <Building2 className="text-brand-primary" />
                {company?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your company profile, team members, and settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`px-3 py-1 text-sm ${
                company?.subscriptionStatus === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {company?.subscriptionStatus}
              </Badge>
              <Badge className="px-3 py-1 text-sm bg-brand-primary text-white">
                {getPlanIcon(company?.subscriptionPlan || '')} {company?.subscriptionPlan}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Custom Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCompany(!editingCompany)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {editingCompany ? 'Cancel' : 'Edit'}
                  </Button>
                </div>

                {editingCompany ? (
                  <form onSubmit={handleUpdateCompany} className="space-y-4">
                    <Input
                      label="Company Name"
                      value={companyForm.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Industry"
                      value={companyForm.industry}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                      required
                    />
                    <Input
                      label="Company Size"
                      value={companyForm.size}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, size: e.target.value })}
                      required
                    />
                    <Input
                      label="Billing Email"
                      type="email"
                      value={companyForm.billingEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, billingEmail: e.target.value })}
                      required
                    />
                    <Input
                      label="Website"
                      value={companyForm.website}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, website: e.target.value })}
                      placeholder="https://yourcompany.com"
                    />
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingCompany(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-gray-900">{company?.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Size</label>
                      <p className="text-gray-900">{company?.size}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Billing Email</label>
                      <p className="text-gray-900">{company?.billingEmail}</p>
                    </div>
                    {company?.website && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Website</label>
                        <p className="text-gray-900">
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary hover:underline"
                          >
                            {company.website}
                          </a>
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900">
                        {new Date(company?.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Plan Features */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Plan Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Branding</span>
                    <Badge className={company?.settings.emailBranding ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {company?.settings.emailBranding ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Advanced Analytics</span>
                    <Badge className={company?.settings.advancedAnalytics ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {company?.settings.advancedAnalytics ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Access</span>
                    <Badge className={company?.settings.apiAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {company?.settings.apiAccess ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button className="w-full" variant="outline">
                    Upgrade Plan
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Invite Member */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Invite Team Member</h3>
                <form onSubmit={handleInviteMember} className="flex gap-4">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                  <Button type="submit" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite
                  </Button>
                </form>
              </Card>

              {/* Members List */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Team Members ({members.length})</h3>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-xs text-gray-400">
                            Last active: {new Date(member.lastActiveAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role === 'OWNER' && <Crown className="w-3 h-3 mr-1" />}
                          {member.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                          {member.role}
                        </Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        {member.role !== 'OWNER' && (
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Security Settings */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">API Keys</h4>
                      <p className="text-sm text-gray-500">Manage API access tokens</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Login History</h4>
                      <p className="text-sm text-gray-500">View recent login activity</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Notification Settings */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Campaign updates and alerts</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Usage Alerts</h4>
                      <p className="text-sm text-gray-500">Notify when approaching limits</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Security Alerts</h4>
                      <p className="text-sm text-gray-500">Suspicious activity notifications</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyPage;
