import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle, CheckCircle, Users, Mail } from 'lucide-react';
import { useJobRoles } from '@/hooks/useJobRoles';
import { useAddUploadedCandidates, useUploadedCandidateStats } from '@/hooks/useUploadedCandidates';
import { useEmailSender } from '@/hooks/emailTemplates/emailSender';

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
  const { data: jobRoles, isLoading: jobRolesLoading } = useJobRoles();
  const addUploadedCandidates = useAddUploadedCandidates();
  const { data: candidateStats } = useUploadedCandidateStats();
  const { sendTemplateEmail, isConnected } = useEmailSender();

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

  const sendApplicationEmails = async (candidates: any[], selectedJobRole: any) => {
    if (!isConnected) {
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings in Settings > Email Integration before importing candidates.",
        variant: "destructive",
      });
      return false;
    }

    setIsSendingEmails(true);
    let successCount = 0;
    let failureCount = 0;

    for (const candidate of candidates) {
      try {
        const success = await sendTemplateEmail({
          templateType: 'interview',
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          candidateEmail: candidate.email,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          jobRole: selectedJobRole?.name || 'General',
          bookingLink: selectedJobRole?.booking_link
        });

        if (success) {
          successCount++;
        } else {
          failureCount++;
        }

        // Small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to send email to ${candidate.email}:`, error);
        failureCount++;
      }
    }

    setIsSendingEmails(false);

    if (successCount > 0) {
      toast({
        title: "Application Emails Sent",
        description: `Successfully sent ${successCount} application emails${failureCount > 0 ? `. ${failureCount} failed to send.` : '.'}`,
      });
    }

    if (failureCount > 0 && successCount === 0) {
      toast({
        title: "Email Send Failed",
        description: `Failed to send ${failureCount} application emails. Please check your email configuration.`,
        variant: "destructive",
      });
    }

    return successCount > 0;
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

  const availableHeaders = previewData.length > 0 ? Object.keys(previewData[0]) : [];

  return (
    <div className="space-y-6">
      {/* Email Configuration Warning */}
      {!isConnected && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900">Email Configuration Required</h3>
                <p className="text-red-700">
                  Application emails will be sent automatically after import. Please configure your email settings first.
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Go to Settings &gt; Email Integration to set up your email provider
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Stats Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900">
                {candidateStats?.totalUploaded || 0}
              </h3>
              <p className="text-blue-700 font-medium">Total Candidates Uploaded</p>
              <p className="text-sm text-blue-600">
                {candidateStats?.notYetApplied || 0} awaiting application emails
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            CSV File Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job-role-select">Select Job Role *</Label>
              <select
                id="job-role-select"
                value={selectedJobRoleId}
                onChange={(e) => setSelectedJobRoleId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={jobRolesLoading}
              >
                <option value="">Select job role...</option>
                {jobRoles?.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.status})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Candidates will receive applications for this specific role
              </p>
            </div>

            <div>
              <Label htmlFor="csv-file">Select LinkedIn CSV Export</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your LinkedIn candidate export CSV file
              </p>
            </div>
          </div>

          {csvFile && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">{csvFile.name}</span>
              <Badge variant="secondary">{previewData.length} rows detected</Badge>
            </div>
          )}

          {isConnected && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-medium">Email configured - Application emails will be sent automatically</p>
                  <p>After importing, each candidate will receive an interview invitation email with the application link.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {previewData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(fieldMapping).map(([field, value]) => (
                  <div key={field}>
                    <Label htmlFor={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      {field === 'firstName' || field === 'lastName' || field === 'email' ? (
                        <span className="text-red-500 ml-1">*</span>
                      ) : null}
                    </Label>
                    <select
                      id={field}
                      value={value}
                      onChange={(e) => setFieldMapping(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select column...</option>
                      {availableHeaders.map(header => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Required fields: First Name, Last Name, Email</p>
                    <p>Phone and Job Role are optional but recommended for better candidate tracking.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview (First 5 rows)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">First Name</th>
                      <th className="text-left p-2">Last Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Phone</th>
                      <th className="text-left p-2">Job Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{row[fieldMapping.firstName] || '-'}</td>
                        <td className="p-2">{row[fieldMapping.lastName] || '-'}</td>
                        <td className="p-2">{row[fieldMapping.email] || '-'}</td>
                        <td className="p-2">{row[fieldMapping.phone] || '-'}</td>
                        <td className="p-2">{row[fieldMapping.jobRole] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleImport}
                  disabled={!fieldMapping.firstName || !fieldMapping.lastName || !fieldMapping.email || !selectedJobRoleId || isProcessing || isSendingEmails}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isProcessing ? 'Processing...' : 
                   isSendingEmails ? 'Sending Emails...' : 
                   `Import ${previewData.length} Candidates & Send Emails`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
