import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import type { AIPreviewResponse } from '../services/aiService';
import { Copy, Eye, Code, Monitor } from 'lucide-react';

interface EmailPreviewProps {
  content: string;
  subject?: string;
  initialReplacements?: Record<string, string>;
  onContentChange?: (previewContent: string) => void;
  className?: string;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({
  content,
  subject = 'Email Subject',
  initialReplacements = {},
  onContentChange,
  className = ''
}) => {
  const [previewData, setPreviewData] = useState<AIPreviewResponse | null>(null);
  const [replacements, setReplacements] = useState(initialReplacements);
  const [loading, setLoading] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePreview();
  }, [content, replacements]);

  const generatePreview = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const result = await aiService.previewEmail({
        content,
        replacements
      });

      if (result) {
        setPreviewData(result);
        if (onContentChange) {
          onContentChange(result.previewContent);
        }
      }
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplacementChange = (placeholder: string, value: string) => {
    setReplacements(prev => ({
      ...prev,
      [placeholder]: value
    }));
  };

  const copyToClipboard = async () => {
    if (!previewData?.previewContent) return;
    
    try {
      await navigator.clipboard.writeText(previewData.previewContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetReplacements = () => {
    setReplacements({});
  };

  const fillSampleData = () => {
    const sampleData = {
      '{{COMPANY_NAME}}': 'Acme Corporation',
      '{{BRAND_NAME}}': 'Acme',
      '{{WEBSITE_URL}}': 'https://acme.com',
      '{{CTA_LINK}}': 'https://acme.com/get-started',
      '{{UNSUBSCRIBE_LINK}}': 'https://acme.com/unsubscribe',
      '{{CONTACT_LINK}}': 'https://acme.com/contact',
      '{{LOGO_URL}}': 'https://via.placeholder.com/200x60/2563eb/ffffff?text=ACME',
      '{{HEADER_IMAGE}}': 'https://via.placeholder.com/600x200/f1f5f9/64748b?text=Welcome+to+Acme',
      '{{PRODUCT_IMAGE}}': 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Our+Product'
    };
    setReplacements(sampleData);
  };

  if (!content.trim()) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Enter email content to see preview</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPlaceholders(!showPlaceholders)}
            className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            {showPlaceholders ? 'Hide' : 'Show'} Placeholders
          </button>
          <button
            onClick={fillSampleData}
            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            Fill Sample Data
          </button>
          <button
            onClick={resetReplacements}
            className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Controls */}
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-2 text-sm flex items-center gap-1 ${
                viewMode === 'preview' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-2 text-sm flex items-center gap-1 border-l ${
                viewMode === 'code' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Code className="w-3 h-3" />
              HTML
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-2 text-sm flex items-center gap-1 border-l ${
                viewMode === 'split' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Monitor className="w-3 h-3" />
              Split
            </button>
          </div>

          {previewData?.foundPlaceholders && previewData.foundPlaceholders.length > 0 && (
            <span className="text-sm text-gray-600">
              {previewData.foundPlaceholders.length} placeholder(s) found
            </span>
          )}
        </div>
      </div>

      {/* Placeholder Editor */}
      {showPlaceholders && previewData?.foundPlaceholders && previewData.foundPlaceholders.length > 0 && (
        <div className="p-4 bg-white border rounded-lg">
          <h3 className="text-lg font-medium mb-3">Customize Placeholders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewData.foundPlaceholders.map((placeholder) => (
              <div key={placeholder} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {placeholder}
                </label>
                <input
                  type="text"
                  value={replacements[placeholder] || ''}
                  onChange={(e) => handleReplacementChange(placeholder, e.target.value)}
                  placeholder={`Enter value for ${placeholder}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Preview */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <span>Email Preview</span>
            {loading && (
              <span className="inline-flex items-center gap-1 text-blue-600">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            )}
          </h3>
          
          {viewMode === 'code' && (
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy HTML'}
            </button>
          )}
        </div>
        
        <div className="bg-white">
          {previewData ? (
            <div className="h-96">
              {viewMode === 'split' ? (
                <div className="flex h-full">
                  {/* HTML Code View */}
                  <div className="w-1/2 border-r">
                    <div className="bg-gray-50 px-3 py-2 border-b text-xs font-medium text-gray-600">
                      HTML Source
                    </div>
                    <div className="h-full overflow-auto">
                      <pre className="p-4 text-xs font-mono bg-gray-900 text-green-400 whitespace-pre-wrap break-words h-full overflow-auto">
                        <code>{previewData.previewContent}</code>
                      </pre>
                    </div>
                  </div>
                  
                  {/* Visual Preview */}
                  <div className="w-1/2">
                    <div className="bg-gray-50 px-3 py-2 border-b text-xs font-medium text-gray-600">
                      Visual Preview
                    </div>
                    <div className="h-full overflow-auto bg-white">
                      <div className="p-3">
                        {/* Email header simulation */}
                        <div className="border-b pb-2 mb-3 text-xs text-gray-600">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">From: Your Company &lt;noreply@yourcompany.com&gt;</div>
                              <div>To: recipient@example.com</div>
                              <div className="font-medium mt-1">Subject: {subject}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Email content */}
                        <div 
                          className="email-content"
                          dangerouslySetInnerHTML={{ __html: previewData.previewContent }}
                          style={{
                            fontFamily: 'Arial, sans-serif',
                            lineHeight: '1.6',
                            color: '#333333',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : viewMode === 'code' ? (
                <div className="h-full overflow-auto">
                  <pre className="p-4 text-sm font-mono bg-gray-900 text-green-400 whitespace-pre-wrap break-words h-full overflow-auto">
                    <code>{previewData.previewContent}</code>
                  </pre>
                </div>
              ) : (
                <div className="h-full overflow-auto bg-white">
                  <div className="max-w-2xl mx-auto p-4">
                    {/* Email header simulation */}
                    <div className="border-b pb-3 mb-4 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">From: Your Company &lt;noreply@yourcompany.com&gt;</div>
                          <div>To: recipient@example.com</div>
                          <div className="font-medium mt-1">Subject: {subject}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Email content */}
                    <div 
                      className="email-content"
                      dangerouslySetInnerHTML={{ __html: previewData.previewContent }}
                      style={{
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: '1.6',
                        color: '#333333'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              {loading ? 'Loading preview...' : 'Failed to load preview'}
            </div>
          )}
        </div>
      </div>

      {/* Preview Info */}
      {previewData && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <div className="flex flex-wrap gap-4">
            <span>Placeholders found: {previewData.foundPlaceholders.length}</span>
            <span>Replacements applied: {Object.keys(previewData.appliedReplacements).length}</span>
          </div>
        </div>
      )}

      {/* Styling for email content */}
      <style jsx>{`
        .email-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
        }
        
        .email-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        
        .email-content td, .email-content th {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .email-content a {
          color: #007bff;
          text-decoration: none;
        }
        
        .email-content a:hover {
          text-decoration: underline;
        }
        
        .email-content h1, .email-content h2, .email-content h3 {
          margin-top: 20px;
          margin-bottom: 10px;
          color: #333;
        }
        
        .email-content p {
          margin-bottom: 10px;
          line-height: 1.6;
        }
        
        .email-content .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        }
        
        .email-content .button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default EmailPreview;
