
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useJobRoles } from '@/hooks/useJobRoles';
import { EmailConfigurationWarning } from './EmailConfigurationWarning';
import { CandidateStatsCard } from './CandidateStatsCard';
import { FileUploadSection } from './FileUploadSection';
import { FieldMappingSection } from './FieldMappingSection';
import { PreviewSection } from './PreviewSection';
import { useCSVEmailService } from './CSVEmailService';

interface CSVImportProcessorProps {
  onImportComplete?: (candidates: any[], jobRole?: any) => void;
}

export const CSVImportProcessor = ({ onImportComplete }: CSVImportProcessorProps) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fieldMapping, setFieldMapping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobRole: ''
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState<string>('');
  const [selectedJobRole, setSelectedJobRole] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  const { toast } = useToast();
  const { data: jobRoles } = useJobRoles();
  const { sendApplicationEmails, isConnected } = useCSVEmailService({
    onEmailStatusUpdate: setIsSendingEmails
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });

      setCsvData(data);
      
      // Auto-map fields if possible
      const autoMapping = { ...fieldMapping };
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
          autoMapping.firstName = header;
        } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
          autoMapping.lastName = header;
        } else if (lowerHeader.includes('email')) {
          autoMapping.email = header;
        } else if (lowerHeader.includes('phone')) {
          autoMapping.phone = header;
        } else if (lowerHeader.includes('job') || lowerHeader.includes('role') || lowerHeader.includes('position')) {
          autoMapping.jobRole = header;
        }
      });
      
      setFieldMapping(autoMapping);
      setPreviewData(data.slice(0, 5));
    };
    
    reader.readAsText(file);
  };

  const handleFieldMappingChange = (field: string, value: string) => {
    const newMapping = { ...fieldMapping, [field]: value };
    setFieldMapping(newMapping);
    
    // Update preview when mapping changes
    if (csvData.length > 0) {
      setPreviewData(csvData.slice(0, 5));
    }
  };

  const handleJobRoleChange = (jobRoleId: string) => {
    setSelectedJobRoleId(jobRoleId);
    const role = jobRoles?.find(r => r.id === jobRoleId);
    setSelectedJobRole(role);
  };

  const handleImport = async () => {
    if (!csvData.length || !selectedJobRole) return;

    setIsProcessing(true);

    try {
      const candidates = csvData.map(row => ({
        firstName: row[fieldMapping.firstName] || '',
        lastName: row[fieldMapping.lastName] || '',
        email: row[fieldMapping.email] || '',
        phone: row[fieldMapping.phone] || '',
        jobRole: selectedJobRole?.name || row[fieldMapping.jobRole] || ''
      }));

      // Insert candidates into database
      const { data: insertedCandidates, error: candidatesError } = await supabase
        .from('candidates')
        .insert(
          candidates.map(candidate => ({
            name: `${candidate.firstName} ${candidate.lastName}`.trim(),
            email: candidate.email,
            phone: candidate.phone || null
          }))
        )
        .select();

      if (candidatesError) throw candidatesError;

      // Create applications for each candidate
      if (insertedCandidates && selectedJobRole) {
        const applications = insertedCandidates.map(candidate => ({
          candidate_id: candidate.id,
          job_role_id: selectedJobRole.id,
          status: 'applied' as const,
          notes: `Remote ${selectedJobRole.name} application. Location: ${candidates.find(c => c.email === candidate.email)?.jobRole || 'Not specified'}. Weekend availability: Not specified. Listening test completed.`,
          applied_date: new Date().toISOString()
        }));

        const { error: applicationsError } = await supabase
          .from('applications')
          .insert(applications);

        if (applicationsError) throw applicationsError;

        // Add tags for each candidate
        const tags = insertedCandidates.flatMap(candidate => [
          { candidate_id: candidate.id, tag: 'Remote Worker' },
          { candidate_id: candidate.id, tag: 'Weekend Available' }
        ]);

        const { error: tagsError } = await supabase
          .from('candidate_tags')
          .insert(tags);

        if (tagsError) throw tagsError;
      }

      // Send application emails
      await sendApplicationEmails(candidates, selectedJobRole);

      toast({
        title: "Import Successful",
        description: `Successfully imported ${candidates.length} candidates and sent application emails.`,
      });

      // Call onImportComplete if provided
      if (onImportComplete) {
        onImportComplete(candidates, selectedJobRole);
      }

      // Reset form
      setCsvData([]);
      setCsvFile(null);
      setPreviewData([]);
      setFieldMapping({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobRole: ''
      });
      setSelectedJobRole(null);
      setSelectedJobRoleId('');

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const availableHeaders = csvData.length > 0 ? Object.keys(csvData[0]) : [];
  const canImport = fieldMapping.firstName && fieldMapping.lastName && fieldMapping.email && selectedJobRole;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Import Candidates from CSV</h2>
      </div>

      <EmailConfigurationWarning isConnected={isConnected} />
      <CandidateStatsCard />

      <FileUploadSection
        csvFile={csvFile}
        selectedJobRoleId={selectedJobRoleId}
        previewDataLength={previewData.length}
        isConnected={isConnected}
        onFileSelect={handleFileSelect}
        onJobRoleChange={handleJobRoleChange}
      />

      {csvData.length > 0 && (
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
