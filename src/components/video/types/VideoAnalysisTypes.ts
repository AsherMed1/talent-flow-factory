
export interface SpeakerSegment {
  start_time: number;
  end_time: number;
  speaker: 'interviewer' | 'candidate';
  confidence: number;
}

export interface SentimentTimelinePoint {
  timestamp: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  score: number; // -1 to 1
}

export interface KeyMoment {
  timestamp: number;
  type: 'strength' | 'concern' | 'highlight' | 'question' | 'answer';
  description: string;
  importance: number; // 1-10
}

export interface VideoAnalysisDetails {
  id: string;
  application_id: string;
  analysis_version: number;
  
  // Speaker diarization
  speaker_segments: SpeakerSegment[];
  interviewer_speaking_time: number;
  candidate_speaking_time: number;
  
  // Sentiment analysis over time
  sentiment_timeline: SentimentTimelinePoint[];
  sentiment_trends: {
    overall_trend: 'improving' | 'declining' | 'stable';
    peak_positive_moment: number;
    lowest_moment: number;
    volatility_score: number;
  };
  
  // Communication skills
  pace_score: number;
  tone_score: number;
  filler_words_count: number;
  filler_words_rate: number;
  clarity_score: number;
  confidence_score: number;
  
  // Key moments
  key_moments: KeyMoment[];
  interview_highlights: KeyMoment[];
  
  // Metadata
  ai_model_used: string;
  processing_duration: number;
  confidence_level: number;
  
  created_at: string;
  updated_at: string;
}

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
  
  // Enhanced analysis data
  detailedAnalysis?: VideoAnalysisDetails;
  communicationSkills?: {
    pace: number;
    tone: number;
    clarity: number;
    confidence: number;
    fillerWordsRate: number;
  };
  sentimentTimeline?: SentimentTimelinePoint[];
  keyMoments?: KeyMoment[];
}

export interface VideoAnalysisPanelProps {
  application: any;
  autoAnalyze?: boolean;
  onAnalysisComplete?: (results: VideoAnalysisResults) => void;
}

export interface AnalysisError {
  type: 'api_error' | 'timeout' | 'invalid_video' | 'processing_error' | 'quota_exceeded' | 'network_error';
  message: string;
  details?: any;
  retryable: boolean;
}
