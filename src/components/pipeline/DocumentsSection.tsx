
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Image, Wifi, AlertCircle } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface DocumentsSectionProps {
  application: Application;
  onDocumentView?: (docType: string) => void;
}

export const DocumentsSection = ({ application, onDocumentView }: DocumentsSectionProps) => {
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    documentType: string;
  }>({
    isOpen: false,
    documentType: ''
  });

  const getUploadedDocuments = () => {
    const docs = [];
    if (application.form_data) {
      const formData = application.form_data as any;
      
      // Check for download speed test
      if (formData.uploads?.hasDownloadSpeed || formData.uploads?.downloadSpeedScreenshot || formData.downloadSpeedScreenshot) {
        docs.push({ 
          type: 'Download Speed Test', 
          key: 'downloadSpeed', 
          icon: Wifi,
          hasData: !!(formData.uploads?.downloadSpeedScreenshot || formData.downloadSpeedScreenshot)
        });
      }
      
      // Check for upload speed test
      if (formData.uploads?.hasUploadSpeed || formData.uploads?.uploadSpeedScreenshot || formData.uploadSpeedScreenshot) {
        docs.push({ 
          type: 'Upload Speed Test', 
          key: 'uploadSpeed', 
          icon: Wifi,
          hasData: !!(formData.uploads?.uploadSpeedScreenshot || formData.uploadSpeedScreenshot)
        });
      }
      
      // Check for workstation photo
      if (formData.uploads?.hasWorkstation || formData.uploads?.workstationPhoto || formData.workstationPhoto) {
        docs.push({ 
          type: 'Workstation Photo', 
          key: 'workstation', 
          icon: Image,
          hasData: !!(formData.uploads?.workstationPhoto || formData.workstationPhoto)
        });
      }
    }
    return docs;
  };

  const uploadedDocs = getUploadedDocuments();
  const hasDocuments = application.has_resume || uploadedDocs.length > 0 || application.has_video;

  const handleDocumentClick = (docType: string) => {
    // Call the optional callback for backwards compatibility
    if (onDocumentView) {
      onDocumentView(docType);
    }
    
    // Open the preview modal
    setPreviewModal({
      isOpen: true,
      documentType: docType
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      documentType: ''
    });
  };

  if (!hasDocuments) return null;

  return (
    <>
      <div className="flex flex-wrap gap-1 mb-3">
        {application.has_resume && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-green-50 transition-colors flex items-center gap-1 bg-green-50 border-green-200"
            onClick={() => handleDocumentClick('Resume')}
          >
            <FileText className="w-3 h-3" />
            Resume
          </Badge>
        )}
        
        {uploadedDocs.map((doc, index) => {
          const IconComponent = doc.icon;
          return (
            <Badge 
              key={index}
              variant="outline" 
              className={`text-xs cursor-pointer transition-colors flex items-center gap-1 ${
                doc.hasData 
                  ? 'hover:bg-blue-50 bg-blue-50 border-blue-200' 
                  : 'hover:bg-yellow-50 bg-yellow-50 border-yellow-200'
              }`}
              onClick={() => handleDocumentClick(doc.type)}
            >
              <IconComponent className="w-3 h-3" />
              {doc.type}
              {!doc.hasData && <AlertCircle className="w-3 h-3 text-yellow-600" />}
            </Badge>
          );
        })}
        
        {application.has_video && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-purple-50 transition-colors flex items-center gap-1 bg-purple-50 border-purple-200"
            onClick={() => handleDocumentClick('Video')}
          >
            <Eye className="w-3 h-3" />
            Video
          </Badge>
        )}
      </div>

      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        application={application}
        documentType={previewModal.documentType}
      />
    </>
  );
};
