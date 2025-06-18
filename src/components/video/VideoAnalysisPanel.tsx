
import { VideoAnalysisPanelProps } from './types/VideoAnalysisTypes';
import { getRecordingUrl } from './utils/videoAnalysisUtils';
import { useVideoAnalysis } from './hooks/useVideoAnalysis';
import { VideoAnalysisStatus } from './components/VideoAnalysisStatus';
import { SpeakingTimeAnalysis } from './components/SpeakingTimeAnalysis';
import { EngagementAnalysis } from './components/EngagementAnalysis';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { KeyTopicsCard } from './components/KeyTopicsCard';
import { RecommendationsCard } from './components/RecommendationsCard';
import { RecruiterSummaryCard } from './components/RecruiterSummaryCard';
import { NoVideoRecording } from './components/NoVideoRecording';

export const VideoAnalysisPanel = ({ application, autoAnalyze = false, onAnalysisComplete }: VideoAnalysisPanelProps) => {
  const { isAnalyzing, analysisResults, error, retryCount, analysisStatus, analyzeVideo } = useVideoAnalysis(application, autoAnalyze);

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
        retryCount={retryCount}
        analysisStatus={analysisStatus}
        onAnalyze={handleAnalyze}
      />

      {analysisResults && (
        <>
          <RecruiterSummaryCard recruiterSummary={analysisResults.recruiterSummary} />
          <SpeakingTimeAnalysis results={analysisResults} />
          <EngagementAnalysis results={analysisResults} />
          <SentimentAnalysis results={analysisResults} />
          
          {/* Enhanced Communication Skills Card */}
          {analysisResults.communicationSkills && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-5 h-5 text-purple-600">💬</span>
                  Communication Skills Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisResults.communicationSkills.pace}/10
                    </div>
                    <div className="text-sm text-gray-600">Pace</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analysisResults.communicationSkills.tone}/10
                    </div>
                    <div className="text-sm text-gray-600">Tone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analysisResults.communicationSkills.clarity}/10
                    </div>
                    <div className="text-sm text-gray-600">Clarity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {analysisResults.communicationSkills.confidence}/10
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {analysisResults.communicationSkills.fillerWordsRate}
                    </div>
                    <div className="text-sm text-gray-600">Filler/min</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <KeyTopicsCard topics={analysisResults.keyTopics} />
          <RecommendationsCard recommendations={analysisResults.recommendations} />
          
          <div className="text-xs text-gray-500 text-center">
            Enhanced analysis completed on {new Date(analysisResults.analysisTimestamp).toLocaleString()}
            {retryCount > 0 && ` (after ${retryCount} retries)`}
          </div>
        </>
      )}
    </div>
  );
};
