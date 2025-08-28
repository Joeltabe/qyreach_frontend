import React, { useState, useCallback } from 'react';
import { Upload, FileText, Users, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactService, type UploadResult } from '../../services/ContactService';
import toast from 'react-hot-toast';

interface ContactUploadEnhancedProps {
  onUploadComplete?: (result: UploadResult) => void;
  onContactsAdded?: (contacts: any[]) => void;
  className?: string;
}

interface UploadProgress {
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
}

export const ContactUploadEnhanced: React.FC<ContactUploadEnhancedProps> = ({
  onUploadComplete,
  onContactsAdded,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      setUploadProgress({
        stage: 'uploading',
        progress: 0,
        message: `Uploading ${file.name}...`
      });

      setUploadResult(null);
      setShowDetails(false);

      const result = await ContactService.uploadContacts(file, (progress) => {
        setUploadProgress(prev => ({
          ...prev,
          progress,
          message: progress < 100 
            ? `Uploading ${file.name}... ${progress}%`
            : 'Processing file...'
        }));
        
        if (progress >= 100) {
          setUploadProgress(prev => ({
            ...prev,
            stage: 'processing',
            message: 'Processing contacts...'
          }));
        }
      });

      setUploadProgress({
        stage: 'complete',
        progress: 100,
        message: 'Upload completed successfully!'
      });

      setUploadResult(result);
      
      // Call callbacks
      if (onUploadComplete) {
        onUploadComplete(result);
      }
      
      if (onContactsAdded && result.contacts) {
        onContactsAdded(result.contacts);
      }

    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadProgress({
        stage: 'error',
        progress: 0,
        message: error.message || 'Upload failed'
      });
      
      toast.error(error.message || 'Failed to upload contacts');
    }
  };

  const resetUpload = () => {
    setUploadProgress({
      stage: 'idle',
      progress: 0,
      message: ''
    });
    setUploadResult(null);
    setShowDetails(false);
  };

  const getSupportedFormats = () => [
    { ext: 'PDF', desc: 'PDF documents with contact information' },
    { ext: 'DOCX', desc: 'Word documents with contact lists' },
    { ext: 'XLSX', desc: 'Excel spreadsheets' },
    { ext: 'CSV', desc: 'Comma-separated values files' },
    { ext: 'TXT', desc: 'Plain text files with contact data' },
    { ext: 'JSON', desc: 'JSON files with contact objects' }
  ];

  const getProgressColor = () => {
    switch (uploadProgress.stage) {
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStageIcon = () => {
    switch (uploadProgress.stage) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'uploading':
      case 'processing':
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  if (uploadProgress.stage !== 'idle') {
    return (
      <div className={`bg-white rounded-lg border-2 border-gray-200 p-6 ${className}`}>
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStageIcon()}
              <div>
                <h3 className="font-medium text-gray-900">
                  {uploadProgress.stage === 'complete' ? 'Upload Complete' :
                   uploadProgress.stage === 'error' ? 'Upload Failed' :
                   uploadProgress.stage === 'processing' ? 'Processing File' :
                   'Uploading File'}
                </h3>
                <p className="text-sm text-gray-600">{uploadProgress.message}</p>
              </div>
            </div>
            
            {uploadProgress.stage === 'complete' || uploadProgress.stage === 'error' ? (
              <button
                onClick={resetUpload}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
          </div>

          {/* Progress Bar */}
          {uploadProgress.stage !== 'error' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getProgressColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Upload Results */}
          <AnimatePresence>
            {uploadResult && uploadProgress.stage === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Processing Summary</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-blue-600">
                        {uploadResult.summary?.totalExtracted || 0}
                      </div>
                      <div className="text-gray-600">Extracted</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-green-600">
                        {uploadResult.summary?.savedContacts || 0}
                      </div>
                      <div className="text-gray-600">Saved</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-yellow-600">
                        {uploadResult.summary?.duplicatesSkipped || 0}
                      </div>
                      <div className="text-gray-600">Duplicates</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-red-600">
                        {uploadResult.summary?.errors || 0}
                      </div>
                      <div className="text-gray-600">Errors</div>
                    </div>
                  </div>
                </div>

                {/* File Details */}
                {uploadResult.fileName && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">{uploadResult.fileName}</div>
                        <div className="text-sm text-gray-600">
                          {uploadResult.fileSize ? `${(uploadResult.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                          {uploadResult.processedAt && ` • Processed at ${new Date(uploadResult.processedAt).toLocaleTimeString()}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warnings/Errors */}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-900">Processing Warnings</h4>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-sm text-yellow-700 underline"
                      >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1 text-sm text-yellow-800"
                        >
                          {uploadResult.errors.slice(0, 5).map((error, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                              <div>{error}</div>
                            </div>
                          ))}
                          {uploadResult.errors.length > 5 && (
                            <div className="text-yellow-700 italic">
                              And {uploadResult.errors.length - 5} more...
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={resetUpload}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload Another File
                  </button>
                  {uploadResult.summary?.savedContacts && uploadResult.summary.savedContacts > 0 && (
                    <button
                      onClick={() => {
                        toast.success(`${uploadResult.summary?.savedContacts} contacts are now available in your contact list!`);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Contacts
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Contact File
            </h3>
            <p className="text-gray-600">
              {isDragOver
                ? 'Drop your file here to upload'
                : 'Drag and drop your contact file here, or click to browse'
              }
            </p>
          </div>

          <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </div>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-gray-900">Supported File Formats</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {getSupportedFormats().map((format, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-blue-100 text-blue-700 text-xs font-medium rounded flex items-center justify-center">
                {format.ext}
              </div>
              <span className="text-gray-700">{format.desc}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-start space-x-2">
            <Users className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> For best results, ensure your files contain email addresses. 
              We can extract contacts from various formats including structured data (CSV, Excel) 
              and unstructured text (PDF, Word documents).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUploadEnhanced;
