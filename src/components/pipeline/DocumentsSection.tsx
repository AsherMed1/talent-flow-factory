
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Image, Wifi } from 'lucide-react';
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
      if (formData.uploads?.hasDownloadSpeed || formData.downloadSpeedScreenshot) {
        docs.push({ type: 'Download Speed Test', key: 'downloadSpeed', icon: Wifi });
      }
      if (formData.uploads?.hasUploadSpeed || formData.uploadSpeedScreenshot) {
        docs.push({ type: 'Upload Speed Test', key: 'uploadSpeed', icon: Wifi });
      }
      if (formData.uploads?.hasWorkstation || formData.workstationPhoto) {
        docs.push({ type: 'Workstation Photo', key: 'workstation', icon: Image });
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
              className="text-xs cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-1"
              onClick={() => handleDocumentClick(doc.type)}
            >
              <IconComponent className="w-3 h-3" />
              {doc.type}
            </Badge>
          );
        })}
        
        {application.has_video && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-purple-50 transition-colors flex items-center gap-1"
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
