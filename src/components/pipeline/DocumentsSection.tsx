import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Image, Wifi, AlertCircle, Video, ExternalLink, Play } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { detectRoleType } from '@/utils/roleDetection';

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

  // Detect role type for better categorization
  const roleName = application.job_role?.name;
  const { isVideoEditor, isAppointmentSetter } = detectRoleType(roleName);

  const getUploadedDocuments = () => {
    const docs = [];
    if (application.form_data) {
      const formData = application.form_data as any;
      
      // Video Editor specific documents
      if (isVideoEditor) {
        // Portfolio URL
        if (formData.portfolio?.hasPortfolioUrl || formData.portfolio?.portfolioUrl || formData.portfolioUrl) {
          docs.push({ 
            type: 'Portfolio', 
            key: 'portfolio', 
            icon: ExternalLink,
            hasData: !!(formData.portfolio?.portfolioUrl || formData.portfolioUrl),
            category: 'portfolio',
            priority: 1
          });
        }

        // Demo Reel Video
        if (formData.portfolio?.hasVideoUpload || formData.portfolio?.videoUpload || formData.videoUpload) {
          docs.push({ 
            type: 'Demo Reel', 
            key: 'videoDemo', 
            icon: Play,
            hasData: !!(formData.portfolio?.videoUpload || formData.videoUpload),
            category: 'video',
            priority: 2
          });
        }

        // Experience documents if any technical uploads exist
        if (formData.experience?.softwareSkills || formData.experience?.recentProjects) {
          docs.push({
            type: 'Experience Details',
            key: 'experience',
            icon: FileText,
            hasData: true,
            category: 'experience',
            priority: 3
          });
        }
      }

      // Appointment Setter specific documents
      if (isAppointmentSetter) {
        // Network speed tests
        if (formData.uploads?.hasDownloadSpeed || formData.uploads?.downloadSpeedScreenshot || formData.downloadSpeedScreenshot) {
          docs.push({ 
            type: 'Download Speed', 
            key: 'downloadSpeed', 
            icon: Wifi,
            hasData: !!(formData.uploads?.downloadSpeedScreenshot || formData.downloadSpeedScreenshot),
            category: 'network',
            priority: 1
          });
        }
        
        if (formData.uploads?.hasUploadSpeed || formData.uploads?.uploadSpeedScreenshot || formData.uploadSpeedScreenshot) {
          docs.push({ 
            type: 'Upload Speed', 
            key: 'uploadSpeed', 
            icon: Wifi,
            hasData: !!(formData.uploads?.uploadSpeedScreenshot || formData.uploadSpeedScreenshot),
            category: 'network',
            priority: 2
          });
        }
        
        // Workstation setup
        if (formData.uploads?.hasWorkstation || formData.uploads?.workstationPhoto || formData.workstationPhoto) {
          docs.push({ 
            type: 'Workstation', 
            key: 'workstation', 
            icon: Image,
            hasData: !!(formData.uploads?.workstationPhoto || formData.workstationPhoto),
            category: 'setup',
            priority: 3
          });
        }
      }
    }
    
    // Remove duplicates and sort by priority
    const uniqueDocs = docs.filter((doc, index, self) => 
      index === self.findIndex(d => d.type === doc.type)
    ).sort((a, b) => a.priority - b.priority);
    
    return uniqueDocs;
  };

  const uploadedDocs = getUploadedDocuments();
  const hasDocuments = application.has_resume || uploadedDocs.length > 0 || application.has_video;

  const handleDocumentClick = (docType: string) => {
    if (onDocumentView) {
      onDocumentView(docType);
    }
    
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

  const getBadgeStyle = (category: string, hasData: boolean) => {
    if (!hasData) {
      return 'hover:bg-yellow-50 bg-yellow-50 border-yellow-200 text-yellow-800';
    }

    switch (category) {
      case 'portfolio':
        return 'hover:bg-purple-50 bg-purple-50 border-purple-200 text-purple-800';
      case 'video':
        return 'hover:bg-indigo-50 bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'experience':
        return 'hover:bg-green-50 bg-green-50 border-green-200 text-green-800';
      case 'network':
        return 'hover:bg-blue-50 bg-blue-50 border-blue-200 text-blue-800';
      case 'setup':
        return 'hover:bg-emerald-50 bg-emerald-50 border-emerald-200 text-emerald-800';
      default:
        return 'hover:bg-gray-50 bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!hasDocuments) return null;

  return (
    <>
      <div className="flex flex-wrap gap-1 mb-3">
        {/* Resume (universal) */}
        {application.has_resume && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-green-50 transition-colors flex items-center gap-1 bg-green-50 border-green-200 text-green-800"
            onClick={() => handleDocumentClick('Resume')}
          >
            <FileText className="w-3 h-3" />
            Resume
          </Badge>
        )}
        
        {/* Role-specific documents */}
        {uploadedDocs.map((doc, index) => {
          const IconComponent = doc.icon;
          return (
            <Badge 
              key={index}
              variant="outline" 
              className={`text-xs cursor-pointer transition-colors flex items-center gap-1 ${
                getBadgeStyle(doc.category, doc.hasData)
              }`}
              onClick={() => handleDocumentClick(doc.type)}
            >
              <IconComponent className="w-3 h-3" />
              {doc.type}
              {!doc.hasData && <AlertCircle className="w-3 h-3" />}
            </Badge>
          );
        })}
        
        {/* Video indicator (legacy support) */}
        {application.has_video && !isVideoEditor && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-purple-50 transition-colors flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-800"
            onClick={() => handleDocumentClick('Video')}
          >
            <Video className="w-3 h-3" />
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
