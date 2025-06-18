
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useJobRoles } from '@/hooks/useJobRoles';

interface FileUploadSectionProps {
  csvFile: File | null;
  selectedJobRoleId: string;
  previewDataLength: number;
  isConnected: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onJobRoleChange: (jobRoleId: string) => void;
}

export const FileUploadSection = ({
  csvFile,
  selectedJobRoleId,
  previewDataLength,
  isConnected,
  onFileSelect,
  onJobRoleChange
}: FileUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: jobRoles, isLoading: jobRolesLoading } = useJobRoles();

  return (
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
              onChange={(e) => onJobRoleChange(e.target.value)}
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
              onChange={onFileSelect}
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
            <Badge variant="secondary">{previewDataLength} rows detected</Badge>
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
  );
};
