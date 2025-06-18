
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useUploadedCandidateStats } from '@/hooks/useUploadedCandidates';

export const CandidateStatsCard = () => {
  const { data: candidateStats } = useUploadedCandidateStats();

  return (
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
  );
};
