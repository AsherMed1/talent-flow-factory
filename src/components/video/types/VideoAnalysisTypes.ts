
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
  recruiterSummary: {
    overallAssessment: string;
    strengths: string[];
    concerns: string[];
    hiringRecommendation: 'strong_hire' | 'hire' | 'no_hire' | 'more_data_needed';
    confidenceLevel: number;
  };
  analysisTimestamp: string;
}

export interface VideoAnalysisPanelProps {
  application: any;
  autoAnalyze?: boolean;
  onAnalysisComplete?: (results: VideoAnalysisResults) => void;
}
