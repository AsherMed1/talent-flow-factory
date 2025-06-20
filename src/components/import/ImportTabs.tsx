
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CSVImportProcessor } from './CSVImportProcessor';
import { GoHighLevelImport } from './GoHighLevelImport';
import { EmailTemplateManager } from './EmailTemplateManager';
import { BulkCandidateProcessor } from './BulkCandidateProcessor';
import { Upload, Download, Mail, Users } from 'lucide-react';

interface ImportTabsProps {
  onImportComplete?: (candidates: any[], jobRole?: any) => void;
}

export const ImportTabs = ({ onImportComplete }: ImportTabsProps) => {
  return (
    <Tabs defaultValue="csv" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="csv" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          CSV Import
        </TabsTrigger>
        <TabsTrigger value="ghl" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          GoHighLevel
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Templates
        </TabsTrigger>
        <TabsTrigger value="bulk" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Bulk Processing
        </TabsTrigger>
      </TabsList>

      <TabsContent value="csv" className="mt-6">
        <CSVImportProcessor onImportComplete={onImportComplete} />
      </TabsContent>

      <TabsContent value="ghl" className="mt-6">
        <GoHighLevelImport />
      </TabsContent>

      <TabsContent value="templates" className="mt-6">
        <EmailTemplateManager />
      </TabsContent>

      <TabsContent value="bulk" className="mt-6">
        <BulkCandidateProcessor 
          candidates={[]}
          selectedJobRole={null}
          onProcessComplete={() => {}}
        />
      </TabsContent>
    </Tabs>
  );
};
