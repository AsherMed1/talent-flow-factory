
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
  availabilityResponse: string
): Promise<PreScreeningScores> => {
  // Motivation scoring - look for hunger, drive, enthusiasm keywords
  const motivationScore = scoreMotivation(motivationResponse);
  
  // Experience scoring - look for relevant experience keywords
  const experienceScore = scoreExperience(experienceResponse);
  
  // Availability scoring - prioritize flexible schedules
  const availabilityScore = scoreAvailability(availabilityResponse);
  
  // Communication scoring based on written quality
  const communicationScore = scoreCommunication(motivationResponse + ' ' + experienceResponse);
  
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

const scoreMotivation = (response: string): number => {
  const hungerKeywords = [
    'motivated', 'driven', 'ambitious', 'eager', 'passionate', 'excited',
    'hungry', 'determined', 'goal-oriented', 'success', 'achieve', 'grow',
    'opportunity', 'challenge', 'thrive', 'excel', 'dedicated', 'committed'
  ];
  
  const negativeKeywords = [
    'just need a job', 'desperate', 'anything', 'dont care', 'whatever',
    'easy money', 'quick cash', 'temporary', 'until something better'
  ];
  
  let score = 40; // Base score
  const lowerResponse = response.toLowerCase();
  
  // Add points for positive keywords
  hungerKeywords.forEach(keyword => {
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

const scoreExperience = (response: string): number => {
  const relevantKeywords = [
    'sales', 'customer service', 'phone', 'call center', 'telemarketing',
    'appointment', 'lead generation', 'cold calling', 'outbound', 'inbound',
    'client', 'customer', 'communication', 'support', 'representative',
    'years experience', 'worked in', 'handled calls'
  ];
  
  let score = 30; // Base score
  const lowerResponse = response.toLowerCase();
  
  // Add points for relevant experience keywords
  relevantKeywords.forEach(keyword => {
    if (lowerResponse.includes(keyword)) {
      score += 12;
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

const scoreAvailability = (availabilityResponse: string): number => {
  const availabilityScores: Record<string, number> = {
    'full-time-flexible': 100,
    'part-time-flexible': 85,
    'full-time-standard': 70,
    'part-time-standard': 55,
    'evenings-only': 60,
    'weekends-only': 45
  };
  
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
