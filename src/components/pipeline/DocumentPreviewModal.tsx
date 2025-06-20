
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  documentType: string;
}

export const DocumentPreviewModal = ({ 
  isOpen, 
  onClose, 
  application, 
  documentType 
}: DocumentPreviewModalProps) => {
  const [imageError, setImageError] = useState(false);

  const getDocumentUrl = () => {
    if (!application.form_data) return null;
    
    const formData = application.form_data as any;
    
    switch (documentType) {
      case 'Resume':
        // Resume URLs might be stored in different locations
        return formData.resume || formData.resumeFile || null;
      
      case 'Download Speed Test':
        return formData.uploads?.downloadSpeedScreenshot || 
               formData.downloadSpeedScreenshot || null;
      
      case 'Upload Speed Test':
        return formData.uploads?.uploadSpeedScreenshot || 
               formData.uploadSpeedScreenshot || null;
      
      case 'Workstation Photo':
        return formData.uploads?.workstationPhoto || 
               formData.workstationPhoto || null;
      
      case 'Video':
        return formData.video || formData.videoFile || null;
      
      default:
        return null;
    }
  };

  const documentUrl = getDocumentUrl();
  const isImage = documentType.includes('Speed Test') || documentType.includes('Workstation');
  const isPdf = documentType === 'Resume';
  const isVideo = documentType === 'Video';

  console.log('DocumentPreviewModal - Document Type:', documentType);
  console.log('DocumentPreviewModal - Document URL:', documentUrl);
  console.log('DocumentPreviewModal - Form Data:', application.form_data);

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `${application.candidate.name}_${documentType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    if (!documentUrl) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Document Not Available</p>
            <p className="text-sm">This document was not uploaded or the file is no longer accessible.</p>
          </div>
        </div>
      );
    }

    if (isImage && !imageError) {
      return (
        <div className="max-h-96 overflow-auto">
          <img 
            src={documentUrl} 
            alt={documentType}
            className="w-full h-auto rounded-lg"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="h-96 w-full">
          <iframe 
            src={documentUrl} 
            className="w-full h-full rounded-lg border"
            title={`${documentType} for ${application.candidate.name}`}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="max-h-96">
          <video 
            controls 
            className="w-full h-auto rounded-lg"
            src={documentUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Fallback for unknown file types or error state
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Preview Not Available</p>
          <p className="text-sm">This file type cannot be previewed in the browser.</p>
          <Button 
            onClick={handleDownload} 
            className="mt-4"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex-1">
            {documentType} - {application.candidate.name}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {documentUrl && (
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
