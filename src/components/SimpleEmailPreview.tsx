import React, { useState } from 'react';
import { Copy, Eye, Code, Monitor, Upload, X, Image as ImageIcon } from 'lucide-react';

interface EmailPreviewProps {
  content: string;
  subject?: string;
  onContentChange?: (content: string) => void;
  className?: string;
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

const SimpleEmailPreview: React.FC<EmailPreviewProps> = ({
  content,
  subject = 'Email Subject',
  onContentChange,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split');
  const [copied, setCopied] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const newImage: UploadedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        name: file.name,
        size: file.size
      };
      
      setUploadedImages(prev => [...prev, newImage]);
      setShowImageUpload(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const insertImage = (imageUrl: string, imageName: string) => {
    const imageHtml = `\n<img src="${imageUrl}" alt="${imageName}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />\n`;
    const newContent = content + imageHtml;
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Process content with basic placeholder replacement
  const processedContent = content
    .replace(/\{\{COMPANY_NAME\}\}/g, 'Your Company')
    .replace(/\{\{WEBSITE_URL\}\}/g, 'https://yourcompany.com')
    .replace(/\{\{LOGO_URL\}\}/g, 'https://via.placeholder.com/200x60/2563eb/ffffff?text=LOGO')
    .replace(/\{\{HEADER_IMAGE\}\}/g, 'https://via.placeholder.com/600x200/f1f5f9/64748b?text=Header+Image');

  if (!content.trim()) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Enter email content to see preview</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with view mode controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold">Email Preview & Image Manager</h3>
        
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

          {/* Image Upload Toggle */}
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" />
            Add Images ({uploadedImages.length})
          </button>
        </div>
      </div>

      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="p-4 bg-white border rounded-lg">
          <h4 className="font-medium mb-3">Upload Images for Email</h4>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload an image or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </label>
          </div>

          {/* Uploaded Images List */}
          {uploadedImages.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-medium text-sm">Uploaded Images:</h5>
              {uploadedImages.map((image) => (
                <div key={image.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{image.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                  </div>
                  <button
                    onClick={() => insertImage(image.url, image.name)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Insert
                  </button>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Preview */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">
            {viewMode === 'preview' ? 'Visual Preview' : viewMode === 'code' ? 'HTML Source' : 'Split View'}
          </h4>
          
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
          <div className="h-96">
            {viewMode === 'split' ? (
              <div className="flex h-full">
                {/* HTML Code View */}
                <div className="w-1/2 border-r">
                  <div className="bg-gray-50 px-3 py-2 border-b text-xs font-medium text-gray-600">
                    HTML Source
                  </div>
                  <div className="h-full overflow-auto">
                    <pre className="p-4 text-xs font-mono bg-gray-900 text-green-400 whitespace-pre-wrap break-words">
                      <code>{content}</code>
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
                        dangerouslySetInnerHTML={{ __html: processedContent }}
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
                <pre className="p-4 text-sm font-mono bg-gray-900 text-green-400 whitespace-pre-wrap break-words">
                  <code>{content}</code>
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
                    dangerouslySetInnerHTML={{ __html: processedContent }}
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
        </div>
      </div>

      {/* Global styles for email content */}
      <style>{`
        .email-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 10px 0 !important;
        }
        
        .email-content table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 10px 0 !important;
        }
        
        .email-content td, .email-content th {
          padding: 8px !important;
          text-align: left !important;
          border-bottom: 1px solid #ddd !important;
        }
        
        .email-content a {
          color: #007bff !important;
          text-decoration: none !important;
        }
        
        .email-content a:hover {
          text-decoration: underline !important;
        }
        
        .email-content h1, .email-content h2, .email-content h3 {
          margin-top: 20px !important;
          margin-bottom: 10px !important;
          color: #333 !important;
        }
        
        .email-content p {
          margin-bottom: 10px !important;
          line-height: 1.6 !important;
        }
        
        .email-content .button {
          display: inline-block !important;
          padding: 10px 20px !important;
          background-color: #007bff !important;
          color: white !important;
          text-decoration: none !important;
          border-radius: 4px !important;
          margin: 10px 0 !important;
        }
        
        .email-content .button:hover {
          background-color: #0056b3 !important;
        }
      `}</style>
    </div>
  );
};

export default SimpleEmailPreview;
