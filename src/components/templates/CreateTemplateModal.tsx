import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Eye, Type } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { emailApi, type EmailTemplate } from '../../lib/api';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: EmailTemplate) => void;
}

interface FormData {
  name: string;
  subject: string;
  content: string;
  category: 'MARKETING' | 'TRANSACTIONAL' | 'NEWSLETTER' | 'WELCOME' | 'PROMOTIONAL' | 'CUSTOM';
}

interface FormErrors {
  name?: string;
  subject?: string;
  content?: string;
  submit?: string;
}

const TEMPLATE_CATEGORIES = [
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'TRANSACTIONAL', label: 'Transactional' },
  { value: 'NEWSLETTER', label: 'Newsletter' },
  { value: 'WELCOME', label: 'Welcome' },
  { value: 'PROMOTIONAL', label: 'Promotional' },
  { value: 'CUSTOM', label: 'Custom' },
];

const VARIABLE_SUGGESTIONS = [
  'firstName',
  'lastName',
  'email',
  'companyName',
  'unsubscribeLink',
  'date',
  'productName',
  'price',
  'discount',
  'eventDate'
];

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    subject: '',
    content: '',
    category: 'CUSTOM',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Email subject is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Email content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await emailApi.createTemplate({
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        content: formData.content.trim(),
        category: formData.category,
        variables: variables.length > 0 ? variables : undefined,
      });
      
      if (response.data.success && response.data.data?.template) {
        onTemplateCreated(response.data.data.template);
        // Reset form
        setFormData({
          name: '',
          subject: '',
          content: '',
          category: 'CUSTOM',
        });
        setVariables([]);
        setErrors({});
      } else {
        setErrors({ submit: response.data.message || 'Failed to create template' });
      }
    } catch (error: any) {
      console.error('Error creating template:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to create template. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addVariable = (variableName: string = newVariable) => {
    if (variableName && !variables.includes(variableName)) {
      setVariables(prev => [...prev, variableName]);
      setNewVariable('');
    }
  };

  const removeVariable = (variableName: string) => {
    setVariables(prev => prev.filter(v => v !== variableName));
  };

  const insertVariable = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + variable
    }));
  };

  const generatePreview = () => {
    let preview = formData.content;
    variables.forEach(variable => {
      const placeholder = `{{${variable}}}`;
      const sampleValue = getSampleValue(variable);
      preview = preview.replace(new RegExp(placeholder, 'g'), sampleValue);
    });
    return preview;
  };

  const getSampleValue = (variable: string): string => {
    const sampleValues: Record<string, string> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      companyName: 'Acme Corp',
      unsubscribeLink: '#unsubscribe',
      date: new Date().toLocaleDateString(),
      productName: 'Premium Plan',
      price: '$99.00',
      discount: '20%',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
    return sampleValues[variable] || `[${variable}]`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Type className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create Email Template</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Design reusable email templates for your campaigns</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-200px)]">
              {/* Form Side */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Template Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Welcome Email, Product Update..."
                      error={errors.name}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* Email Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Subject *
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Enter email subject line..."
                      error={errors.subject}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value as FormData['category'])}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TEMPLATE_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variables Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Template Variables
                    </label>
                    <div className="space-y-3">
                      {/* Add Variable */}
                      <div className="flex space-x-2">
                        <Input
                          value={newVariable}
                          onChange={(e) => setNewVariable(e.target.value)}
                          placeholder="Add variable name..."
                          className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addVariable();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addVariable()}
                          disabled={!newVariable.trim()}
                          className="px-4"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Variable Suggestions */}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick add:</p>
                        <div className="flex flex-wrap gap-2">
                          {VARIABLE_SUGGESTIONS.map(variable => (
                            <button
                              key={variable}
                              type="button"
                              onClick={() => addVariable(variable)}
                              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                            >
                              {variable}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Variables */}
                      {variables.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active variables (click to insert, double-click to remove):</p>
                          <div className="flex flex-wrap gap-2">
                            {variables.map(variable => (
                              <button
                                key={variable}
                                type="button"
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => insertVariable(variable)}
                                onDoubleClick={() => removeVariable(variable)}
                                title="Click to insert, double-click to remove"
                              >
                                {`{{${variable}}}`}
                                <X className="ml-1 h-3 w-3" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Content *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Write your email content here... Use {{variableName}} for dynamic content."
                      rows={12}
                      error={errors.content}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* Submit Errors */}
                  {errors.submit && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                    </div>
                  )}
                </form>
              </div>

              {/* Preview Side */}
              {showPreview && (
                <div className="w-1/2 border-l border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Preview</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">How your email will look with sample data</p>
                  </div>
                  <div className="p-6 overflow-y-auto h-full bg-white dark:bg-gray-900">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject:</h4>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{formData.subject || 'No subject'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content:</h4>
                        <div className="prose dark:prose-invert max-w-none">
                          <div 
                            className="whitespace-pre-wrap text-gray-900 dark:text-gray-100"
                            dangerouslySetInnerHTML={{ 
                              __html: generatePreview().replace(/\n/g, '<br/>') 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Use variables like {`{{firstName}}`} for personalization
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Template</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
