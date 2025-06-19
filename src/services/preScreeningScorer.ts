
export interface PreScreeningScores {
  motivationScore: number;
  experienceScore: number;
  availabilityScore: number;
  communicationScore: number;
  overallScore: number;
}

export const scorePreScreeningResponses = async (
  motivationResponse: string,
  experienceResponse: string,
  availabilityResponse: string,
  collaborationResponse?: string,
  isVideoEditor: boolean = false
): Promise<PreScreeningScores> => {
  // Motivation scoring with role-specific keywords
  const motivationScore = scoreMotivation(motivationResponse, isVideoEditor);
  
  // Experience scoring with role-specific keywords
  const experienceScore = scoreExperience(experienceResponse, isVideoEditor);
  
  // Availability scoring with role-specific preferences
  const availabilityScore = scoreAvailability(availabilityResponse, isVideoEditor);
  
  // Communication scoring based on written quality (including collaboration for video editors)
  const combinedText = collaborationResponse 
    ? motivationResponse + ' ' + experienceResponse + ' ' + collaborationResponse
    : motivationResponse + ' ' + experienceResponse;
  const communicationScore = scoreCommunication(combinedText);
  
  // Overall weighted score
  const overallScore = Math.round(
    (motivationScore * 0.3) + 
    (experienceScore * 0.25) + 
    (availabilityScore * 0.25) + 
    (communicationScore * 0.2)
  );

  return {
    motivationScore,
    experienceScore,
    availabilityScore,
    communicationScore,
    overallScore
  };
};

const scoreMotivation = (response: string, isVideoEditor: boolean): number => {
  const commonHungerKeywords = [
    'motivated', 'driven', 'ambitious', 'eager', 'passionate', 'excited',
    'hungry', 'determined', 'goal-oriented', 'success', 'achieve', 'grow',
    'opportunity', 'challenge', 'thrive', 'excel', 'dedicated', 'committed'
  ];

  const videoEditorKeywords = [
    'creative', 'storytelling', 'visual', 'artistic', 'innovative', 'ai tools',
    'cutting-edge', 'technology', 'craft', 'portfolio', 'vision', 'aesthetic',
    'narrative', 'cinematic', 'post-production', 'editing'
  ];

  const appointmentSetterKeywords = [
    'sales', 'people', 'communication', 'helping', 'connecting', 'relationship',
    'target', 'goals', 'revenue', 'client', 'customer', 'phone', 'outreach'
  ];
  
  const negativeKeywords = [
    'just need a job', 'desperate', 'anything', 'dont care', 'whatever',
    'easy money', 'quick cash', 'temporary', 'until something better'
  ];
  
  let score = 40; // Base score
  const lowerResponse = response.toLowerCase();
  
  // Add points for common positive keywords
  commonHungerKeywords.forEach(keyword => {
    if (lowerResponse.includes(keyword)) {
      score += 6;
    }
  });

  // Add points for role-specific keywords
  const roleKeywords = isVideoEditor ? videoEditorKeywords : appointmentSetterKeywords;
  roleKeywords.forEach(keyword => {
    if (lowerResponse.includes(keyword)) {
      score += 8;
    }
  });
  
  // Subtract points for negative keywords
  negativeKeywords.forEach(keyword => {
    if (lowerResponse.includes(keyword)) {
      score -= 15;
    }
  });
  
  // Bonus for length and detail (shows effort)
  if (response.length > 200) score += 10;
  if (response.length > 400) score += 10;
  
  return Math.min(Math.max(score, 0), 100);
};

const scoreExperience = (response: string, isVideoEditor: boolean): number => {
  const commonKeywords = [
    'years experience', 'worked in', 'professional', 'skilled', 'proficient'
  ];

  const videoEditorKeywords = [
    'video editing', 'premiere pro', 'after effects', 'final cut', 'davinci resolve',
    'motion graphics', 'color grading', 'sound design', 'post-production',
    'commercial', 'documentary', 'social media', 'youtube', 'vimeo', 'portfolio',
    'client work', 'freelance', 'agency', 'broadcast', 'film', 'television'
  ];

  const appointmentSetterKeywords = [
    'sales', 'customer service', 'phone', 'call center', 'telemarketing',
    'appointment', 'lead generation', 'cold calling', 'outbound', 'inbound',
    'client', 'customer', 'communication', 'support', 'representative'
  ];
  
  let score = 30; // Base score
  const lowerResponse = response.toLowerCase();
  
  // Add points for common experience keywords
  commonKeywords.forEach(keyword => {
    if (lowerResponse.includes(keyword)) {
      score += 8;
    }
  });

  // Add points for role-specific experience keywords
  const roleKeywords = isVideoEditor ? videoEditorKeywords : appointmentSetterKeywords;
  roleKeywords.forEach(keyword => {
    if (lowerResponse.includes(keyword)) {
      score += 10;
    }
  });
  
  // Look for years of experience
  const yearsMatch = response.match(/(\d+)\s*years?/i);
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1]);
    score += Math.min(years * 5, 25); // Max 25 bonus points
  }
  
  // Bonus for specific examples or metrics
  if (lowerResponse.includes('increased') || lowerResponse.includes('improved') || 
      lowerResponse.includes('achieved') || lowerResponse.includes('%')) {
    score += 15;
  }
  
  return Math.min(Math.max(score, 0), 100);
};

const scoreAvailability = (availabilityResponse: string, isVideoEditor: boolean): number => {
  const videoEditorAvailabilityScores: Record<string, number> = {
    'full-time-flexible': 100,
    'part-time-flexible': 90,
    'project-based': 95,
    'retainer-based': 85,
    'rush-projects': 90
  };

  const appointmentSetterAvailabilityScores: Record<string, number> = {
    'full-time-flexible': 100,
    'part-time-flexible': 85,
    'weekdays-only': 70,
    'evenings-weekends': 60,
    'specific-hours': 55
  };
  
  const availabilityScores = isVideoEditor ? videoEditorAvailabilityScores : appointmentSetterAvailabilityScores;
  return availabilityScores[availabilityResponse] || 50;
};

const scoreCommunication = (combinedText: string): number => {
  let score = 50; // Base score
  
  // Check for proper grammar and structure
  const sentences = combinedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = combinedText.length / sentences.length;
  
  // Good sentence structure (not too short, not too long)
  if (avgSentenceLength > 15 && avgSentenceLength < 100) {
    score += 15;
  }
  
  // Check for professional language
  const professionalWords = [
    'experience', 'professional', 'skills', 'ability', 'capable',
    'responsible', 'reliable', 'dedicated', 'committed', 'efficient'
  ];
  
  professionalWords.forEach(word => {
    if (combinedText.toLowerCase().includes(word)) {
      score += 5;
    }
  });
  
  // Penalty for excessive casual language or poor grammar indicators
  const casualWords = ['gonna', 'wanna', 'kinda', 'sorta', 'ur', 'u', 'thru'];
  casualWords.forEach(word => {
    if (combinedText.toLowerCase().includes(word)) {
      score -= 10;
    }
  });
  
  // Bonus for proper capitalization and punctuation
  if (combinedText.match(/^[A-Z]/) && combinedText.includes('.')) {
    score += 10;
  }
  
  return Math.min(Math.max(score, 0), 100);
};
