
import { useMemo } from 'react';
import type { Candidate } from '@/hooks/useCandidates';

export const useCandidateFilters = (candidates: Candidate[] | undefined, searchTerm: string, selectedFilter: string) => {
  const filteredCandidates = useMemo(() => {
    return candidates?.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'active') {
        return candidate.applications.some(app => !['hired', 'rejected'].includes(app.status));
      }
      if (selectedFilter === 'hired') {
        return candidate.applications.some(app => app.status === 'hired');
      }
      return false;
    }) || [];
  }, [candidates, searchTerm, selectedFilter]);

  const filters = useMemo(() => [
    { id: 'all', label: 'All Candidates', count: candidates?.length || 0 },
    { id: 'active', label: 'Active Applications', count: candidates?.filter(c => 
      c.applications.some(app => !['hired', 'rejected'].includes(app.status))
    ).length || 0 },
    { id: 'hired', label: 'Hired', count: candidates?.filter(c => 
      c.applications.some(app => app.status === 'hired')
    ).length || 0 },
  ], [candidates]);

  return {
    filteredCandidates,
    filters
  };
};
