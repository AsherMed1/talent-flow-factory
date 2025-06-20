
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import { ImportTabs } from './import/ImportTabs';

export const CandidateImport = () => {
  const [importedCandidates, setImportedCandidates] = useState<any[]>([]);
  const [selectedJobRole, setSelectedJobRole] = useState<any>(null);
  const { toast } = useToast();

  const handleImportComplete = (candidates: any[], jobRole?: any) => {
    setImportedCandidates(candidates);
    setSelectedJobRole(jobRole);
    toast({
      title: "Import Complete",
      description: `Successfully imported ${candidates.length} candidates for ${jobRole?.name || 'selected role'}`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Import Center</h1>
          {selectedJobRole && (
            <p className="text-sm text-gray-600 mt-1">
              Current job role: <span className="font-medium">{selectedJobRole.name}</span>
            </p>
          )}
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Sample CSV
        </Button>
      </div>

      <ImportTabs onImportComplete={handleImportComplete} />
    </div>
  );
};
