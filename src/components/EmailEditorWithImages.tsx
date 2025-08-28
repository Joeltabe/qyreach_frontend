import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, X, Plus, Eye, Code, Monitor } from 'lucide-react';
import EmailPreview from './EmailPreview';
import ImageUpload from './ImageUpload';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface EmailEditorWithImagesProps {
  content: string;
  subject?: string;
  onContentChange: (content: string) => void;
  onSubjectChange?: (subject: string) => void;
  className?: string;
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export const EmailEditorWithImages: React.FC<EmailEditorWithImagesProps> = ({
  content,
  subject = '',
  onContentChange,
  onSubjectChange,
  className = ''
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  const handleImageUpload = (imageUrl: string, imageData: { name: string; size: number; type: string }) => {
    const newImage: UploadedImage = {
      id: Date.now().toString(),
      url: imageUrl,
      name: imageData.name,
      size: imageData.size,
      type: imageData.type
    };
    
    setUploadedImages(prev => [...prev, newImage]);
    setShowImageUpload(false);
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const insertImageIntoContent = (imageUrl: string, imageName: string) => {
    const imageHtml = `<img src="${imageUrl}" alt="${imageName}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
    onContentChange(content + '\n\n' + imageHtml);
  };

  const generateImagePlaceholders = () => {
    const placeholders: Record<string, string> = {};
    uploadedImages.forEach((image, index) => {
      placeholders[`{{IMAGE_${index + 1}}}`] = image.url;
      placeholders[`{{${image.name.toUpperCase().replace(/\.[^/.]+$/, "").replace(/[^A-Z0-9]/g, "_")}_IMAGE}}`] = image.url;
    });
    return placeholders;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Email Editor</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'editor' ? 'default' : 'outline'}
            onClick={() => setViewMode('editor')}
            size="sm"
          >
            <Code className="w-4 h-4 mr-2" />
            Editor
          </Button>
          <Button
            variant={viewMode === 'preview' ? 'default' : 'outline'}
            onClick={() => setViewMode('preview')}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {viewMode === 'editor' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Email Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject Input */}
                {onSubjectChange && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => onSubjectChange(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content (HTML)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="Enter your email content here..."
                    className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                {/* Quick Insert Buttons */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Quick Insert Images
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uploadedImages.map((image) => (
                        <Button
                          key={image.id}
                          variant="outline"
                          size="sm"
                          onClick={() => insertImageIntoContent(image.url, image.name)}
                        >
                          <Image className="w-3 h-3 mr-1" />
                          {image.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <EmailPreview
              content={content}
              subject={subject}
              initialReplacements={generateImagePlaceholders()}
              onContentChange={onContentChange}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Images ({uploadedImages.length})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              {showImageUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ImageUpload onImageUpload={handleImageUpload} />
                </motion.div>
              )}

              {/* Uploaded Images List */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Uploaded Images
                  </label>
                  {uploadedImages.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Image Placeholders Help */}
              {uploadedImages.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2 font-medium">
                    Available Image Placeholders:
                  </p>
                  <div className="space-y-1">
                    {uploadedImages.map((image, index) => (
                      <div key={image.id} className="text-xs font-mono text-gray-500">
                        {`{{IMAGE_${index + 1}}}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Email Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-600">
              <p>• Use HTML for rich formatting</p>
              <p>• Add images using the upload tool</p>
              <p>• Use placeholders like {`{{COMPANY_NAME}}`}</p>
              <p>• Test with different view modes</p>
              <p>• Keep images under 5MB for best performance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailEditorWithImages;
