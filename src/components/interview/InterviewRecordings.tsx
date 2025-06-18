
import { Button } from '@/components/ui/button';
import { Video, ExternalLink, Link } from 'lucide-react';
import { LoomVideoPreview } from '../video/LoomVideoPreview';

interface InterviewRecordingsProps {
  application: any;
}

export const InterviewRecordings = ({ application }: InterviewRecordingsProps) => {
  const hasManualLink = application.interview_recording_link;
  const hasZoomRecording = application.zoom_recording_url || application.zoom_recording_files;

  if (!hasManualLink && !hasZoomRecording) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Video className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-lg">No recordings available</p>
        <p className="text-sm">Add a recording link manually or wait for Zoom integration</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Interview Recordings</h4>
      
      {/* Loom Video Preview */}
      {hasManualLink && hasManualLink.includes('loom.com') && (
        <LoomVideoPreview 
          loomUrl={application.interview_recording_link}
          title={`${application.candidates.name} Interview`}
        />
      )}
      
      {/* Manual Recording Link (non-Loom) */}
      {hasManualLink && !hasManualLink.includes('loom.com') && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-sm font-medium">Interview Recording</span>
              <div className="text-xs text-gray-500 truncate max-w-60">
                {application.interview_recording_link}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(application.interview_recording_link, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      )}

      {/* Zoom Recordings */}
      {application.zoom_recording_url && (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Zoom Recording (Auto)</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(application.zoom_recording_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      )}

      {application.zoom_recording_files && Array.isArray(application.zoom_recording_files) && (
        <div className="space-y-2">
          {application.zoom_recording_files.map((file: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-gray-600" />
                <div>
                  <span className="text-sm font-medium">{file.type} Recording (Auto)</span>
                  {file.recording_start && (
                    <div className="text-xs text-gray-500">
                      {new Date(file.recording_start).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {file.play_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.play_url, '_blank')}
                  >
                    Play
                  </Button>
                )}
                {file.download_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.download_url, '_blank')}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
