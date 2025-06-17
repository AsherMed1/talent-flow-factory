
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Mail, Users, Download } from 'lucide-react';
import { CSVImportProcessor } from './import/CSVImportProcessor';
import { EmailTemplateManager } from './import/EmailTemplateManager';
import { BulkCandidateProcessor } from './import/BulkCandidateProcessor';

export const CandidateImport = () => {
  const [activeTab, setActiveTab] = useState<'import' | 'templates' | 'bulk'>('import');
  const [importedCandidates, setImportedCandidates] = useState<any[]>([]);
  const { toast } = useToast();

  const tabs = [
    { id: 'import' as const, label: 'CSV Import', icon: Upload },
    { id: 'templates' as const, label: 'Email Templates', icon: Mail },
    { id: 'bulk' as const, label: 'Bulk Processing', icon: Users }
  ];

  const handleImportComplete = (candidates: any[]) => {
    setImportedCandidates(candidates);
    setActiveTab('bulk');
    toast({
      title: "Import Complete",
      description: `Successfully imported ${candidates.length} candidates`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Import Center</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Sample CSV
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'bulk' && importedCandidates.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {importedCandidates.length}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'import' && (
          <CSVImportProcessor onImportComplete={handleImportComplete} />
        )}
        
        {activeTab === 'templates' && (
          <EmailTemplateManager />
        )}
        
        {activeTab === 'bulk' && (
          <BulkCandidateProcessor 
            candidates={importedCandidates}
            onProcessComplete={() => setImportedCandidates([])}
          />
        )}
      </div>
    </div>
  );
};
