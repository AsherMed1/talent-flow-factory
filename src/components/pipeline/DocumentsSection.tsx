
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Image, Wifi } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface DocumentsSectionProps {
  application: Application;
  onDocumentView: (docType: string) => void;
}

export const DocumentsSection = ({ application, onDocumentView }: DocumentsSectionProps) => {
  const getUploadedDocuments = () => {
    const docs = [];
    if (application.form_data) {
      const formData = application.form_data as any;
      if (formData.uploads?.hasDownloadSpeed) {
        docs.push({ type: 'Download Speed Test', key: 'downloadSpeed', icon: Wifi });
      }
      if (formData.uploads?.hasUploadSpeed) {
        docs.push({ type: 'Upload Speed Test', key: 'uploadSpeed', icon: Wifi });
      }
      if (formData.uploads?.hasWorkstation) {
        docs.push({ type: 'Workstation Photo', key: 'workstation', icon: Image });
      }
    }
    return docs;
  };

  const uploadedDocs = getUploadedDocuments();
  const hasDocuments = application.has_resume || uploadedDocs.length > 0 || application.has_video;

  if (!hasDocuments) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {application.has_resume && (
        <Badge 
          variant="outline" 
          className="text-xs cursor-pointer hover:bg-green-50 transition-colors flex items-center gap-1 bg-green-50 border-green-200"
          onClick={() => onDocumentView('Resume')}
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
            onClick={() => onDocumentView(doc.type)}
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
          onClick={() => onDocumentView('Video')}
        >
          <Eye className="w-3 h-3" />
          Video
        </Badge>
      )}
    </div>
  );
};
