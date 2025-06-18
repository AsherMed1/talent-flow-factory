
export interface VideoAnalysisResults {
  speakingTimeRatio: {
    interviewer: number;
    candidate: number;
  };
  engagementLevel: number;
  keyTopics: string[];
  sentimentAnalysis: {
    overall: 'positive' | 'neutral' | 'negative';
    confidence: number;
    details: string;
  };
  recommendations: string[];
  analysisTimestamp: string;
}

export interface VideoAnalysisPanelProps {
  application: any;
  autoAnalyze?: boolean;
  onAnalysisComplete?: (results: VideoAnalysisResults) => void;
}
