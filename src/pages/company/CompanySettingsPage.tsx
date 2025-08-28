import { useState, useRef } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Upload, Building2, Palette, User, Settings, Save, X, Camera, Trash2 } from 'lucide-react';
import type { CompanyFormData, BrandingFormData } from '../../lib/companyApi';

const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'other', label: 'Other' },
];

const SIZE_OPTIONS = [
  { value: 'STARTUP', label: 'Startup (1-10)' },
  { value: 'SMALL', label: 'Small (11-50)' },
  { value: 'MEDIUM', label: 'Medium (51-200)' },
  { value: 'LARGE', label: 'Large (201-1000)' },
  { value: 'ENTERPRISE', label: 'Enterprise (1000+)' },
];

export function CompanySettingsPage() {
  const { 
    company, 
    isLoading, 
    updateProfile, 
    updateBranding, 
    uploadLogo, 
    uploadBrandLogo, 
    removeLogo 
  } = useCompany();

  const [activeTab, setActiveTab] = useState<'profile' | 'branding'>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile form data
  const [profileData, setProfileData] = useState<CompanyFormData>({
    name: company?.name || '',
    domain: company?.domain || '',
    industry: company?.industry || '',
    size: company?.size || '',
    website: company?.website || '',
    address: company?.address || '',
    phone: company?.phone || '',
    billingEmail: company?.billingEmail || '',
  });

  // Branding form data
  const [brandingData, setBrandingData] = useState<BrandingFormData>({
    brandName: company?.brandName || '',
    brandColor: company?.brandColor || '#3498db',
    emailSignature: company?.emailSignature || '',
    emailTemplate: company?.emailTemplate || '',
  });

  const logoFileRef = useRef<HTMLInputElement>(null);
  const brandLogoFileRef = useRef<HTMLInputElement>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateBranding(brandingData);
    } catch (error) {
      console.error('Failed to update branding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadLogo(file);
      } catch (error) {
        console.error('Failed to upload logo:', error);
      }
    }
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadBrandLogo(file);
      } catch (error) {
        console.error('Failed to upload brand logo:', error);
      }
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await removeLogo();
    } catch (error) {
      console.error('Failed to remove logo:', error);
    }
  };

  if (isLoading && !company) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'branding', label: 'Branding & Design', icon: Palette },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Company Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your company profile, branding, and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'profile' | 'branding')}
                  className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-8">
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Company Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={profileData.domain}
                    onChange={(e) => setProfileData({ ...profileData, domain: e.target.value })}
                    placeholder="example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={profileData.industry}
                    onValueChange={(value) => setProfileData({ ...profileData, industry: value })}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Company Size</Label>
                  <Select
                    value={profileData.size}
                    onValueChange={(value) => setProfileData({ ...profileData, size: value })}
                  >
                    <option value="">Select size</option>
                    {SIZE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    rows={3}
                    placeholder="Company address..."
                  />
                </div>

                <div>
                  <Label htmlFor="billingEmail">Billing Email</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    value={profileData.billingEmail}
                    onChange={(e) => setProfileData({ ...profileData, billingEmail: e.target.value })}
                    placeholder="billing@example.com"
                  />
                </div>
              </div>
            </Card>

            {/* Company Logo */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Company Logo
                </h2>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {company?.logo ? (
                    <div className="relative">
                      <img
                        src={company.logo}
                        alt="Company logo"
                        className="h-24 w-24 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoFileRef.current?.click()}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Recommended: Square image, max 5MB
                  </p>
                  <input
                    ref={logoFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <form onSubmit={handleBrandingSubmit} className="space-y-8">
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Brand Identity
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={brandingData.brandName}
                    onChange={(e) => setBrandingData({ ...brandingData, brandName: e.target.value })}
                    placeholder="Your brand name"
                  />
                </div>

                <div>
                  <Label htmlFor="brandColor">Brand Color</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={brandingData.brandColor}
                      onChange={(e) => setBrandingData({ ...brandingData, brandColor: e.target.value })}
                      className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600"
                    />
                    <Input
                      value={brandingData.brandColor}
                      onChange={(e) => setBrandingData({ ...brandingData, brandColor: e.target.value })}
                      placeholder="#3498db"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="emailSignature">Email Signature</Label>
                  <Textarea
                    id="emailSignature"
                    value={brandingData.emailSignature}
                    onChange={(e) => setBrandingData({ ...brandingData, emailSignature: e.target.value })}
                    rows={4}
                    placeholder="Your email signature template..."
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="emailTemplate">Custom Email Template</Label>
                  <Textarea
                    id="emailTemplate"
                    value={brandingData.emailTemplate}
                    onChange={(e) => setBrandingData({ ...brandingData, emailTemplate: e.target.value })}
                    rows={6}
                    placeholder="Custom HTML email template..."
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Use HTML for custom email templates. Variables: {'{company.name}'}, {'{brand.color}'}, etc.
                  </p>
                </div>
              </div>
            </Card>

            {/* Brand Logo */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Brand Logo (For Emails)
                </h2>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {company?.brandLogo ? (
                    <img
                      src={company.brandLogo}
                      alt="Brand logo"
                      className="h-16 w-auto max-w-32 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg border p-2"
                    />
                  ) : (
                    <div className="h-16 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Palette className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => brandLogoFileRef.current?.click()}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Brand Logo
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Recommended: Horizontal logo, max 5MB
                  </p>
                  <input
                    ref={brandLogoFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBrandLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Branding
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
