import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FileUpload = ({ onFileUpload, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedTypes = ['.pdf', '.doc', '.docx'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!file) return { valid: false, error: 'No file selected' };

    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return { 
        valid: false, 
        error: `Invalid file type. Accepted formats: ${acceptedTypes.join(', ')}` 
      };
    }

    if (file.size > maxFileSize) {
      return { 
        valid: false, 
        error: 'File size must be less than 5MB' 
      };
    }

    return { valid: true };
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          const fileData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadDate: new Date().toISOString(),
            fileData: file
          };
          
          onFileUpload(fileData);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    simulateUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-1 max-w-full">
      <label className="block text-sm font-medium text-surface-700">
        Upload Resume
        <span className="text-surface-500 font-normal ml-1">(Optional)</span>
      </label>
      
      <AnimatePresence mode="wait">
        {!currentFile ? (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
              ${isDragging 
                ? 'border-accent bg-accent/5 scale-105' 
                : 'border-surface-300 hover:border-surface-400'
              }
              ${isUploading ? 'pointer-events-none' : ''}
            `}
            onClick={!isUploading ? handleBrowseClick : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Loader" className="w-12 h-12 mx-auto text-accent" />
                </motion.div>
                <p className="text-surface-600">Uploading...</p>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-accent h-2 rounded-full"
                  />
                </div>
                <p className="text-sm text-surface-500">{uploadProgress}%</p>
              </div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ApperIcon name="Upload" className="w-12 h-12 mx-auto text-surface-400" />
                </motion.div>
                <div>
                  <p className="text-surface-600 font-medium">
                    Drag and drop your resume here, or{' '}
                    <span className="text-accent hover:text-accent/80">browse</span>
                  </p>
                  <p className="text-sm text-surface-500 mt-1">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border border-surface-200 rounded-lg p-4 bg-surface-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" size={20} className="text-success" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-surface-900 truncate">{currentFile.fileName}</p>
                  <p className="text-sm text-surface-500">
                    {formatFileSize(currentFile.fileSize)} • Uploaded {new Date(currentFile.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <motion.button
                type="button"
                onClick={handleRemoveFile}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-error/10 hover:bg-error/20 rounded-lg flex items-center justify-center text-error transition-colors"
              >
                <ApperIcon name="Trash2" size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-xs text-surface-500">
        Accepted file types: {acceptedTypes.join(', ')} • Maximum file size: 5MB
      </p>
    </div>
  );
};

export default FileUpload;