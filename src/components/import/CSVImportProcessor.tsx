
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useJobRoles } from '@/hooks/useJobRoles';
import { useAddUploadedCandidates } from '@/hooks/useUploadedCandidates';
import { EmailConfigurationWarning } from './EmailConfigurationWarning';
import { CandidateStatsCard } from './CandidateStatsCard';
import { FileUploadSection } from './FileUploadSection';
import { FieldMappingSection } from './FieldMappingSection';
import { PreviewSection } from './PreviewSection';
import { useCSVEmailService } from './CSVEmailService';

interface CSVImportProcessorProps {
  onImportComplete: (candidates: any[], selectedJobRole?: any) => void;
}

export const CSVImportProcessor = ({ onImportComplete }: CSVImportProcessorProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState('');
  const [fieldMapping, setFieldMapping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobRole: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data: jobRoles } = useJobRoles();
  const addUploadedCandidates = useAddUploadedCandidates();
  const { sendApplicationEmails, isConnected } = useCSVEmailService({
    onEmailStatusUpdate: setIsSendingEmails
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      processCSVPreview(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
    }
  };

  const processCSVPreview = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Auto-detect common field mappings
    const mapping = { ...fieldMapping };
    headers.forEach((header, index) => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
        mapping.firstName = header;
      } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
        mapping.lastName = header;
      } else if (lowerHeader.includes('email')) {
        mapping.email = header;
      } else if (lowerHeader.includes('phone')) {
        mapping.phone = header;
      } else if (lowerHeader.includes('job') || lowerHeader.includes('role') || lowerHeader.includes('position')) {
        mapping.jobRole = header;
      }
    });
    setFieldMapping(mapping);

    // Show preview of first 5 rows
    const preview = lines.slice(1, 6).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    }).filter(row => Object.values(row).some(val => val !== ''));

    setPreviewData(preview);
  };

  const handleImport = async () => {
    if (!csvFile || !selectedJobRoleId) {
      toast({
        title: "Validation Error",
        description: "Please select a CSV file and job role before importing.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Email Configuration Required",
        description: "Please configure your email settings in Settings > Email Integration before importing candidates. Application emails will be sent automatically after import.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const candidates = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      }).filter(row => Object.values(row).some(val => val !== ''))
      .map(row => ({
        firstName: row[fieldMapping.firstName] || '',
        lastName: row[fieldMapping.lastName] || '',
        email: row[fieldMapping.email] || '',
        phone: row[fieldMapping.phone] || '',
        jobRole: row[fieldMapping.jobRole] || '',
        originalData: row
      })).filter(candidate => candidate.email && candidate.firstName);

      // Add to uploaded candidates tracking
      const newCandidates = await addUploadedCandidates.mutateAsync(candidates.map(c => ({
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        jobRole: c.jobRole
      })));

      const selectedJobRole = jobRoles?.find(role => role.id === selectedJobRoleId);

      // Automatically send application emails to all uploaded candidates
      if (newCandidates.length > 0) {
        await sendApplicationEmails(candidates, selectedJobRole);
      }

      onImportComplete(candidates, selectedJobRole);
      
      // Reset form
      setCsvFile(null);
      setPreviewData([]);
      setSelectedJobRoleId('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to process the CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldMappingChange = (field: string, value: string) => {
    setFieldMapping(prev => ({ ...prev, [field]: value }));
  };

  const availableHeaders = previewData.length > 0 ? Object.keys(previewData[0]) : [];
  const canImport = fieldMapping.firstName && fieldMapping.lastName && fieldMapping.email && selectedJobRoleId;

  return (
    <div className="space-y-6">
      <EmailConfigurationWarning isConnected={isConnected} />
      <CandidateStatsCard />
      <FileUploadSection
        csvFile={csvFile}
        selectedJobRoleId={selectedJobRoleId}
        previewDataLength={previewData.length}
        isConnected={isConnected}
        onFileSelect={handleFileSelect}
        onJobRoleChange={setSelectedJobRoleId}
      />
      
      {previewData.length > 0 && (
        <>
          <FieldMappingSection
            fieldMapping={fieldMapping}
            availableHeaders={availableHeaders}
            onFieldMappingChange={handleFieldMappingChange}
          />
          <PreviewSection
            previewData={previewData}
            fieldMapping={fieldMapping}
            isProcessing={isProcessing}
            isSendingEmails={isSendingEmails}
            canImport={canImport}
            onImport={handleImport}
          />
        </>
      )}
    </div>
  );
};
