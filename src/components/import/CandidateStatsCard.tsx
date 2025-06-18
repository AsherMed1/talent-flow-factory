
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trash2 } from 'lucide-react';
import { useUploadedCandidateStats } from '@/hooks/useUploadedCandidates';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const CandidateStatsCard = () => {
  const { data: candidateStats } = useUploadedCandidateStats();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleClearCandidates = () => {
    localStorage.removeItem('uploaded-candidates');
    queryClient.invalidateQueries({ queryKey: ['uploaded-candidates'] });
    queryClient.invalidateQueries({ queryKey: ['uploaded-candidate-stats'] });
    
    toast({
      title: "Cleared Successfully",
      description: "All uploaded candidate data has been cleared.",
    });
  };

  const hasData = candidateStats?.totalUploaded && candidateStats.totalUploaded > 0;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
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
          
          {hasData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCandidates}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
