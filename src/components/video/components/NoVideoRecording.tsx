
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const NoVideoRecording = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <h3 className="font-medium text-gray-900 mb-2">No Video Recording</h3>
        <p className="text-sm text-gray-500">
          Add an interview recording link to enable AI analysis.
        </p>
      </CardContent>
    </Card>
  );
};
