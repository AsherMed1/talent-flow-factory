
import { useMemo } from 'react';
import { Application } from '@/hooks/useApplications';
import { SmartFilterCriteria } from './SmartFilters';

export const useSmartFilters = (applications: Application[], filters: SmartFilterCriteria) => {
  const filteredApplications = useMemo(() => {
    if (!applications?.length) return [];

    let filtered = applications.filter(app => {
      // Hide rejected if enabled
      if (filters.hideRejected && app.status === 'rejected') {
        return false;
      }

      // Require voice analysis if enabled
      if (filters.requireVoiceAnalysis && !app.voice_analysis_score) {
        return false;
      }

      // Score filters (only apply if voice analysis exists)
      if (app.voice_analysis_score) {
        if (app.voice_analysis_score < filters.minOverallScore) {
          return false;
        }

        // Map the new enhanced scores to existing database columns
        // English Fluency maps to clarity score for now
        if (app.voice_clarity_score && app.voice_clarity_score < filters.minEnglishFluency) {
          return false;
        }

        // Motivation maps to energy score
        if (app.voice_energy_score && app.voice_energy_score < filters.minMotivation) {
          return false;
        }

        // Speech clarity check (additional clarity requirement)
        if (app.voice_clarity_score && app.voice_clarity_score < filters.minClarity) {
          return false;
        }
      }

      return true;
    });

    // Apply top percentage filter
    if (filters.topPercentOnly && filtered.length > 0) {
      // Sort by overall score descending
      const sortedByScore = filtered
        .filter(app => app.voice_analysis_score) // Only include analyzed candidates
        .sort((a, b) => (b.voice_analysis_score || 0) - (a.voice_analysis_score || 0));
      
      const topCount = Math.ceil((sortedByScore.length * filters.topPercentOnly) / 100);
      filtered = sortedByScore.slice(0, topCount);
    }

    return filtered;
  }, [applications, filters]);

  const statistics = useMemo(() => {
    if (!applications?.length) return null;

    const analyzed = applications.filter(app => app.voice_analysis_score);
    const highScoring = analyzed.filter(app => (app.voice_analysis_score || 0) >= 8);
    const nativeLevel = analyzed.filter(app => (app.voice_clarity_score || 0) >= 9);
    const motivated = analyzed.filter(app => (app.voice_energy_score || 0) >= 8);

    return {
      total: applications.length,
      analyzed: analyzed.length,
      highScoring: highScoring.length,
      nativeLevel: nativeLevel.length,
      motivated: motivated.length,
      filtered: filteredApplications.length,
    };
  }, [applications, filteredApplications]);

  return {
    filteredApplications,
    statistics
  };
};
