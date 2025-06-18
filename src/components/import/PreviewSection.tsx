
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PreviewSectionProps {
  previewData: any[];
  fieldMapping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobRole: string;
  };
  isProcessing: boolean;
  isSendingEmails: boolean;
  canImport: boolean;
  onImport: () => void;
}

export const PreviewSection = ({ 
  previewData, 
  fieldMapping, 
  isProcessing, 
  isSendingEmails, 
  canImport, 
  onImport 
}: PreviewSectionProps) => {
  return (
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
            onClick={onImport}
            disabled={!canImport || isProcessing || isSendingEmails}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isProcessing ? 'Processing...' : 
             isSendingEmails ? 'Sending Emails...' : 
             `Import ${previewData.length} Candidates & Send Emails`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
