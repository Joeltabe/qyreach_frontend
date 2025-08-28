import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  Mail
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { CreateTemplateModal } from '../../components/templates/CreateTemplateModal';
import { TemplatePreview } from '../../components/templates/TemplatePreview';
import { emailApi, type EmailTemplate } from '../../lib/api';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await emailApi.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const duplicateTemplate = async (template: EmailTemplate) => {
    try {
      const newTemplate = {
        name: `${template.name} (Copy)`,
        subject: template.subject,
        content: template.content
      };
      const response = await emailApi.createTemplate(newTemplate);
      if (response.data.data?.template) {
        setTemplates([...templates, response.data.data.template]);
      }
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  const handleTemplateCreated = (newTemplate: EmailTemplate) => {
    setTemplates([...templates, newTemplate]);
    setShowCreateModal(false);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterActive === 'all' || 
      (filterActive === 'active' && template.isActive) ||
      (filterActive === 'inactive' && !template.isActive);
    
    return matchesSearch && matchesFilter;
  });

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
                <FileText className="text-brand-primary" />
                Email Templates
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create and manage reusable email templates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="px-3 py-1 text-sm bg-brand-primary text-white">
                {templates.length} Templates
              </Badge>
              <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Create Template
              </Button>
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
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Templates</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first email template to get started'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
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
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
                        <Badge className={`text-xs ${
                          template.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{template.subject}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preview</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {template.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>Template</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => duplicateTemplate(template)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTemplateCreated={handleTemplateCreated}
      />

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default TemplatesPage;