
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCandidates } from '@/hooks/useCandidates';
import { CandidateCard } from './talent-vault/CandidateCard';
import { CandidateFilters } from './talent-vault/CandidateFilters';
import { useCandidateDelete } from './talent-vault/useCandidateDelete';
import { useCandidateFilters } from './talent-vault/useCandidateFilters';

export const CandidateCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { data: candidates, isLoading, refetch } = useCandidates();
  const { deletingCandidateId, deletedCandidateIds, handleDeleteCandidate } = useCandidateDelete(refetch);
  
  // Filter out deleted candidates immediately
  const activeCandidates = candidates?.filter(candidate => !deletedCandidateIds.has(candidate.id));
  const { filteredCandidates, filters } = useCandidateFilters(activeCandidates, searchTerm, selectedFilter);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Talent Vault</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Talent Vault</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          Export Candidates
        </Button>
      </div>

      {/* Search and Filters */}
      <CandidateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        filters={filters}
      />

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onDelete={handleDeleteCandidate}
            deletingCandidateId={deletingCandidateId}
          />
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No candidates found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
