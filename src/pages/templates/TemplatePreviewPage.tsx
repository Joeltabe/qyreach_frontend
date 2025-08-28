import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { TemplatePreview } from '../../components/templates/TemplatePreview';
import { emailApi, type EmailTemplate } from '../../lib/api';

const TemplatePreviewPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await emailApi.getTemplates();
      setTemplates(response.data.data?.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      filterCategory === 'all' || 
      template.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

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
                <Eye className="text-brand-primary" />
                Template Preview Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Preview and test your email templates with live data
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="px-3 py-1 text-sm bg-brand-primary text-white">
                {filteredTemplates.length} Templates
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No templates found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'No templates available to preview'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.subject}</p>
                      <Badge 
                        className="text-xs"
                        variant={template.category === 'MARKETING' ? 'default' : 'secondary'}
                      >
                        {template.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {template.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                    {template.variables && template.variables.length > 0 && (
                      <span>{template.variables.length} variables</span>
                    )}
                  </div>

                  <Button 
                    className="w-full group-hover:bg-brand-primary group-hover:text-white transition-colors"
                    variant="outline"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Template
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Template Preview Modal */}
        {previewTemplate && (
          <TemplatePreview
            template={previewTemplate}
            isOpen={!!previewTemplate}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TemplatePreviewPage;
