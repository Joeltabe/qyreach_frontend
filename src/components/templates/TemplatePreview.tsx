import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, Mail, User, Calendar, Building, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { type EmailTemplate } from '../../lib/api';

interface TemplatePreviewProps {
  template: EmailTemplate;
  isOpen: boolean;
  onClose: () => void;
}

interface PreviewData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  productName: string;
  price: string;
  discount: string;
  date: string;
  eventDate: string;
  unsubscribeLink: string;
  [key: string]: string;
}

const DEFAULT_PREVIEW_DATA: PreviewData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  companyName: 'Acme Corporation',
  productName: 'Premium Plan',
  price: '$99.99',
  discount: '25%',
  date: new Date().toLocaleDateString(),
  eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  unsubscribeLink: '#unsubscribe',
};

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isOpen,
  onClose,
}) => {
  const [previewData, setPreviewData] = useState<PreviewData>(DEFAULT_PREVIEW_DATA);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const renderPreviewContent = () => {
    let content = template.content;
    let subject = template.subject;

    // Replace variables in both content and subject
    Object.keys(previewData).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = previewData[key];
      content = content.replace(new RegExp(placeholder, 'g'), value);
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
    });

    // Handle any remaining template variables that weren't in our preview data
    if (template.variables) {
      template.variables.forEach(variable => {
        const placeholder = `{{${variable}}}`;
        if (!previewData[variable]) {
          content = content.replace(new RegExp(placeholder, 'g'), `[${variable}]`);
          subject = subject.replace(new RegExp(placeholder, 'g'), `[${variable}]`);
        }
      });
    }

    return { content, subject };
  };

  const { content: previewContent, subject: previewSubject } = renderPreviewContent();

  const handleDataChange = (key: string, value: string) => {
    setPreviewData(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Template Preview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{template.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Mobile
              </button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Data Panel */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Sample Data
              </h3>
              
              <div className="space-y-4">
                {/* Personal Info */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={previewData.firstName}
                    onChange={(e) => handleDataChange('firstName', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={previewData.lastName}
                    onChange={(e) => handleDataChange('lastName', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={previewData.email}
                    onChange={(e) => handleDataChange('email', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={previewData.companyName}
                    onChange={(e) => handleDataChange('companyName', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Product Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Building className="h-3 w-3 mr-1" />
                    Product Details
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={previewData.productName}
                        onChange={(e) => handleDataChange('productName', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        value={previewData.price}
                        onChange={(e) => handleDataChange('price', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount
                      </label>
                      <input
                        type="text"
                        value={previewData.discount}
                        onChange={(e) => handleDataChange('discount', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dates
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Date
                      </label>
                      <input
                        type="text"
                        value={previewData.date}
                        onChange={(e) => handleDataChange('date', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Event Date
                      </label>
                      <input
                        type="text"
                        value={previewData.eventDate}
                        onChange={(e) => handleDataChange('eventDate', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Variables */}
                {template.variables && template.variables.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Template Variables
                    </h4>
                    <div className="space-y-2">
                      {template.variables.map(variable => (
                        <div key={variable}>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {variable}
                          </label>
                          <input
                            type="text"
                            value={previewData[variable] || `[${variable}]`}
                            onChange={(e) => handleDataChange(variable, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div 
              className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
                viewMode === 'mobile' ? 'w-80 max-w-sm' : 'w-full max-w-2xl mx-8'
              }`}
            >
              {/* Email Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      Your Company Name
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      noreply@yourcompany.com
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {previewSubject}
                  </div>
                </div>
              </div>

              {/* Email Content */}
              <div className="p-6">
                <div 
                  className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100"
                  style={{ fontSize: viewMode === 'mobile' ? '14px' : '16px' }}
                >
                  <div 
                    className="whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: previewContent.replace(/\n/g, '<br/>') 
                    }}
                  />
                </div>

                {/* Email Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>This email was sent to {previewData.email}</div>
                    <div className="flex items-center space-x-4">
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View in browser
                      </a>
                      <a href={previewData.unsubscribeLink} className="text-blue-600 dark:text-blue-400 hover:underline">
                        Unsubscribe
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Adjust the sample data on the left to see how your template will look with different values
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
