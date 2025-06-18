
import { VideoAnalysisPanelProps } from './types/VideoAnalysisTypes';
import { getRecordingUrl } from './utils/videoAnalysisUtils';
import { useVideoAnalysis } from './hooks/useVideoAnalysis';
import { VideoAnalysisStatus } from './components/VideoAnalysisStatus';
import { SpeakingTimeAnalysis } from './components/SpeakingTimeAnalysis';
import { EngagementAnalysis } from './components/EngagementAnalysis';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { KeyTopicsCard } from './components/KeyTopicsCard';
import { RecommendationsCard } from './components/RecommendationsCard';
import { NoVideoRecording } from './components/NoVideoRecording';

export const VideoAnalysisPanel = ({ application, autoAnalyze = false, onAnalysisComplete }: VideoAnalysisPanelProps) => {
  const { isAnalyzing, analysisResults, error, analyzeVideo } = useVideoAnalysis(application, autoAnalyze);

  const handleAnalyze = async () => {
    const results = await analyzeVideo();
    if (results) {
      onAnalysisComplete?.(results);
    }
  };

  if (!getRecordingUrl(application)) {
    return <NoVideoRecording />;
  }

  return (
    <div className="space-y-6">
      <VideoAnalysisStatus
        isAnalyzing={isAnalyzing}
        error={error}
        hasResults={!!analysisResults}
        autoAnalyze={autoAnalyze}
        onAnalyze={handleAnalyze}
      />

      {analysisResults && (
        <>
          <SpeakingTimeAnalysis results={analysisResults} />
          <EngagementAnalysis results={analysisResults} />
          <SentimentAnalysis results={analysisResults} />
          <KeyTopicsCard topics={analysisResults.keyTopics} />
          <RecommendationsCard recommendations={analysisResults.recommendations} />
          
          <div className="text-xs text-gray-500 text-center">
            Analysis completed on {new Date(analysisResults.analysisTimestamp).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
};
