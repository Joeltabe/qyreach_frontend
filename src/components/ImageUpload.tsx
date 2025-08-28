import React, { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, imageData: { name: string; size: number; type: string }) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  maxSize = 5, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Please upload: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSize}MB`;
    }
    
    return null;
  };

  const processFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    setUploading(true);
    try {
      // Convert to base64 data URL for preview/storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onImageUpload(dataUrl, {
          name: file.name,
          size: file.size,
          type: file.type
        });
        setUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Uploading image...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Image className="w-8 h-8 mx-auto text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop an image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Supports: JPG, PNG, GIF, WebP (max {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
};

export default ImageUpload;
