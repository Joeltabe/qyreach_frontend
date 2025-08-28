import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Save, 
  Eye, 
  Send, 
  Smartphone, 
  Monitor,
  Undo,
  Redo,
  Copy,
  Trash2,
  Plus,
  Settings
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import api from '../../lib/api';

interface EmailBlock {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'spacer' | 'divider';
  content: {
    [key: string]: any;
  };
  styles: {
    [key: string]: string;
  };
}

interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  design: {
    blocks: EmailBlock[];
    globalStyles: {
      backgroundColor: string;
      fontFamily: string;
      textColor: string;
    };
  };
  variables: string[];
}

const EmailDesignerPage: React.FC = () => {
  const [template, setTemplate] = useState<EmailTemplate>({
    name: 'Untitled Template',
    subject: 'Your Subject Line Here',
    design: {
      blocks: [],
      globalStyles: {
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        textColor: '#333333'
      }
    },
    variables: []
  });
  
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activePanel, setActivePanel] = useState<'blocks' | 'design' | 'settings'>('blocks');
  const [saving, setSaving] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const blockTypes = [
    { type: 'text', label: 'Text Block', icon: Type, color: 'blue' },
    { type: 'image', label: 'Image', icon: Image, color: 'green' },
    { type: 'button', label: 'Button', icon: Layout, color: 'purple' },
    { type: 'header', label: 'Header', icon: Type, color: 'orange' },
    { type: 'spacer', label: 'Spacer', icon: Layout, color: 'gray' },
    { type: 'divider', label: 'Divider', icon: Layout, color: 'gray' }
  ];

  const addBlock = (type: EmailBlock['type']) => {
    const newBlock: EmailBlock = {
      id: `block_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };

    setTemplate(prev => ({
      ...prev,
      design: {
        ...prev.design,
        blocks: [...prev.design.blocks, newBlock]
      }
    }));
  };

  const getDefaultContent = (type: EmailBlock['type']) => {
    switch (type) {
      case 'text':
        return { text: 'Your text content goes here. You can personalize it with {{firstName}} and other variables.' };
      case 'header':
        return { text: 'Header Title', logo: '', backgroundColor: '#f8f9fa' };
      case 'image':
        return { src: '', alt: 'Image description', url: '' };
      case 'button':
        return { text: 'Click Here', url: 'https://example.com', backgroundColor: '#007bff', textColor: '#ffffff' };
      case 'spacer':
        return { height: '20px' };
      case 'divider':
        return { color: '#e5e7eb', thickness: '1px' };
      default:
        return {};
    }
  };

  const getDefaultStyles = (type: EmailBlock['type']) => {
    const baseStyles = {
      padding: '16px',
      margin: '8px 0'
    };

    switch (type) {
      case 'text':
        return { ...baseStyles, fontSize: '16px', lineHeight: '1.5', textAlign: 'left' };
      case 'header':
        return { ...baseStyles, textAlign: 'center', fontSize: '24px', fontWeight: 'bold' };
      case 'button':
        return { ...baseStyles, textAlign: 'center', borderRadius: '6px' };
      default:
        return baseStyles;
    }
  };

  const updateBlock = (blockId: string, updates: Partial<EmailBlock>) => {
    setTemplate(prev => ({
      ...prev,
      design: {
        ...prev.design,
        blocks: prev.design.blocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        )
      }
    }));
  };

  const deleteBlock = (blockId: string) => {
    setTemplate(prev => ({
      ...prev,
      design: {
        ...prev.design,
        blocks: prev.design.blocks.filter(block => block.id !== blockId)
      }
    }));
    setSelectedBlock(null);
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blocks = [...template.design.blocks];
    const index = blocks.findIndex(block => block.id === blockId);
    
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    
    setTemplate(prev => ({
      ...prev,
      design: {
        ...prev.design,
        blocks
      }
    }));
  };

  const saveTemplate = async () => {
    try {
      setSaving(true);
      const response = await api.post('/api/templates', template);
      console.log('Template saved:', response.data);
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setSaving(false);
    }
  };

  const previewTemplate = async () => {
    try {
      const response = await api.post('/api/designer/preview', template);
      // Open preview in new window/tab
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(response.data.html);
      }
    } catch (error) {
      console.error('Failed to preview template:', error);
    }
  };

  const sendTestEmail = async () => {
    try {
      const email = prompt('Enter test email address:');
      if (email) {
        await api.post('/api/designer/test-send', {
          template,
          testEmail: email
        });
        alert('Test email sent successfully!');
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
    }
  };

  const renderBlock = (block: EmailBlock, isSelected: boolean) => {
    const baseStyles = {
      ...block.styles,
      border: isSelected ? '2px solid #007bff' : '1px solid transparent',
      cursor: 'pointer',
      position: 'relative' as const
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedBlock(block.id);
    };

    switch (block.type) {
      case 'text':
        return (
          <div key={block.id} style={baseStyles} onClick={handleClick}>
            <div
              dangerouslySetInnerHTML={{ __html: block.content.text }}
              style={{
                fontSize: block.styles.fontSize,
                lineHeight: block.styles.lineHeight,
                textAlign: block.styles.textAlign as any,
                color: block.styles.color || template.design.globalStyles.textColor
              }}
            />
          </div>
        );

      case 'header':
        return (
          <div 
            key={block.id} 
            style={{
              ...baseStyles,
              backgroundColor: block.content.backgroundColor,
              textAlign: 'center'
            }}
            onClick={handleClick}
          >
            {block.content.logo && (
              <img src={block.content.logo} alt="Logo" style={{ maxHeight: '60px', marginBottom: '16px' }} />
            )}
            <h1 style={{
              margin: 0,
              fontSize: block.styles.fontSize || '24px',
              fontWeight: block.styles.fontWeight || 'bold',
              color: block.styles.color || template.design.globalStyles.textColor
            }}>
              {block.content.text}
            </h1>
          </div>
        );

      case 'image':
        return (
          <div key={block.id} style={baseStyles} onClick={handleClick}>
            {block.content.src ? (
              <img 
                src={block.content.src} 
                alt={block.content.alt}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            ) : (
              <div className="bg-gray-200 p-8 text-center text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-2" />
                <p>Click to add image</p>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div key={block.id} style={baseStyles} onClick={handleClick}>
            <div style={{ textAlign: block.styles.textAlign as any || 'center' }}>
              <a
                href={block.content.url}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: block.content.backgroundColor,
                  color: block.content.textColor,
                  textDecoration: 'none',
                  borderRadius: block.styles.borderRadius || '6px',
                  fontWeight: '500'
                }}
              >
                {block.content.text}
              </a>
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div 
            key={block.id} 
            style={{
              ...baseStyles,
              height: block.content.height,
              minHeight: '20px',
              backgroundColor: isSelected ? '#f0f8ff' : 'transparent'
            }}
            onClick={handleClick}
          >
            {isSelected && (
              <div className="text-center text-xs text-gray-500 pt-2">
                Spacer ({block.content.height})
              </div>
            )}
          </div>
        );

      case 'divider':
        return (
          <div key={block.id} style={baseStyles} onClick={handleClick}>
            <hr style={{
              border: 'none',
              borderTop: `${block.content.thickness} solid ${block.content.color}`,
              margin: 0
            }} />
          </div>
        );

      default:
        return null;
    }
  };

  const renderBlockEditor = () => {
    if (!selectedBlock) return null;
    
    const block = template.design.blocks.find(b => b.id === selectedBlock);
    if (!block) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Edit {block.type} Block</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteBlock(block.id)}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {block.type === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, text: e.target.value }
                })}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your text content..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Font Size"
                value={block.styles.fontSize || '16px'}
                onChange={(e) => updateBlock(block.id, {
                  styles: { ...block.styles, fontSize: e.target.value }
                })}
                placeholder="16px"
              />
              <select
                value={block.styles.textAlign || 'left'}
                onChange={(e) => updateBlock(block.id, {
                  styles: { ...block.styles, textAlign: e.target.value }
                })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )}

        {block.type === 'header' && (
          <div className="space-y-3">
            <Input
              label="Header Text"
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, text: e.target.value }
              })}
            />
            <Input
              label="Logo URL"
              value={block.content.logo}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, logo: e.target.value }
              })}
              placeholder="https://example.com/logo.png"
            />
            <Input
              label="Background Color"
              type="color"
              value={block.content.backgroundColor}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, backgroundColor: e.target.value }
              })}
            />
          </div>
        )}

        {block.type === 'image' && (
          <div className="space-y-3">
            <Input
              label="Image URL"
              value={block.content.src}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, src: e.target.value }
              })}
              placeholder="https://example.com/image.jpg"
            />
            <Input
              label="Alt Text"
              value={block.content.alt}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, alt: e.target.value }
              })}
              placeholder="Image description"
            />
          </div>
        )}

        {block.type === 'button' && (
          <div className="space-y-3">
            <Input
              label="Button Text"
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, text: e.target.value }
              })}
            />
            <Input
              label="Link URL"
              value={block.content.url}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, url: e.target.value }
              })}
              placeholder="https://example.com"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Background Color"
                type="color"
                value={block.content.backgroundColor}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, backgroundColor: e.target.value }
                })}
              />
              <Input
                label="Text Color"
                type="color"
                value={block.content.textColor}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, textColor: e.target.value }
                })}
              />
            </div>
          </div>
        )}

        {block.type === 'spacer' && (
          <Input
            label="Height"
            value={block.content.height}
            onChange={(e) => updateBlock(block.id, {
              content: { ...block.content, height: e.target.value }
            })}
            placeholder="20px"
          />
        )}

        {block.type === 'divider' && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Color"
              type="color"
              value={block.content.color}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, color: e.target.value }
              })}
            />
            <Input
              label="Thickness"
              value={block.content.thickness}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, thickness: e.target.value }
              })}
              placeholder="1px"
            />
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveBlock(block.id, 'up')}
            disabled={template.design.blocks.indexOf(block) === 0}
          >
            ↑
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveBlock(block.id, 'down')}
            disabled={template.design.blocks.indexOf(block) === template.design.blocks.length - 1}
          >
            ↓
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newBlock = { ...block, id: `block_${Date.now()}` };
              setTemplate(prev => ({
                ...prev,
                design: {
                  ...prev.design,
                  blocks: [...prev.design.blocks, newBlock]
                }
              }));
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Email Designer</h1>
              <p className="text-sm text-gray-600">Build beautiful emails</p>
            </div>
          </div>

          {/* Template Info */}
          <div className="space-y-3">
            <Input
              value={template.name}
              onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Template name"
            />
            <Input
              value={template.subject}
              onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Email subject line"
            />
          </div>
        </div>

        {/* Panel Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'blocks', label: 'Blocks', icon: Layout },
            { id: 'design', label: 'Design', icon: Palette },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((panel) => {
            const Icon = panel.icon;
            return (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id as any)}
                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activePanel === panel.id
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {panel.label}
              </button>
            );
          })}
        </div>

        {/* Panel Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activePanel === 'blocks' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Add Blocks</h3>
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map((blockType) => {
                  const Icon = blockType.icon;
                  return (
                    <button
                      key={blockType.type}
                      onClick={() => addBlock(blockType.type as any)}
                      className={`p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-${blockType.color}-500 hover:bg-${blockType.color}-50 transition-colors group`}
                    >
                      <Icon className={`w-6 h-6 text-gray-400 group-hover:text-${blockType.color}-600 mx-auto mb-2`} />
                      <p className="text-xs font-medium text-gray-600">{blockType.label}</p>
                    </button>
                  );
                })}
              </div>

              {selectedBlock && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {renderBlockEditor()}
                </div>
              )}
            </div>
          )}

          {activePanel === 'design' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Global Design</h3>
              <div className="space-y-3">
                <Input
                  label="Background Color"
                  type="color"
                  value={template.design.globalStyles.backgroundColor}
                  onChange={(e) => setTemplate(prev => ({
                    ...prev,
                    design: {
                      ...prev.design,
                      globalStyles: {
                        ...prev.design.globalStyles,
                        backgroundColor: e.target.value
                      }
                    }
                  }))}
                />
                <Input
                  label="Text Color"
                  type="color"
                  value={template.design.globalStyles.textColor}
                  onChange={(e) => setTemplate(prev => ({
                    ...prev,
                    design: {
                      ...prev.design,
                      globalStyles: {
                        ...prev.design.globalStyles,
                        textColor: e.target.value
                      }
                    }
                  }))}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                  <select
                    value={template.design.globalStyles.fontFamily}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      design: {
                        ...prev.design,
                        globalStyles: {
                          ...prev.design.globalStyles,
                          fontFamily: e.target.value
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'settings' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Template Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variables</label>
                  <div className="text-sm text-gray-600">
                    Variables found in your template:
                  </div>
                  {template.variables.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.variables.map((variable) => (
                        <Badge key={variable} className="bg-blue-100 text-blue-800">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No variables found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={previewTemplate}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={sendTestEmail}>
                <Send className="w-4 h-4 mr-2" />
                Test Send
              </Button>
              <Button onClick={saveTemplate} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="flex justify-center">
            <motion.div
              ref={canvasRef}
              className={`bg-white shadow-lg ${
                previewMode === 'mobile' ? 'w-96' : 'w-full max-w-2xl'
              }`}
              style={{
                backgroundColor: template.design.globalStyles.backgroundColor,
                fontFamily: template.design.globalStyles.fontFamily,
                color: template.design.globalStyles.textColor
              }}
              onClick={() => setSelectedBlock(null)}
            >
              {template.design.blocks.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Layout className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Start Building Your Email</h3>
                  <p>Add blocks from the sidebar to begin designing your email template</p>
                </div>
              ) : (
                template.design.blocks.map((block) =>
                  renderBlock(block, selectedBlock === block.id)
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDesignerPage;
