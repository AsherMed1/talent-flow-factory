import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCandidates } from '@/hooks/useCandidates';
import { CandidateCard } from './talent-vault/CandidateCard';
import { CandidateFilters } from './talent-vault/CandidateFilters';
import { useCandidateDelete } from './talent-vault/useCandidateDelete';
import { useCandidateFilters } from './talent-vault/useCandidateFilters';
import { BulkActionsBar } from './talent-vault/BulkActionsBar';
import { SmartSearch } from './talent-vault/SmartSearch';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const CandidateCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [smartFilters, setSmartFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('candidates');

  const { data: candidates, isLoading, refetch } = useCandidates();
  const { deletingCandidateId, deletedCandidateIds, handleDeleteCandidate } = useCandidateDelete(refetch);
  const { toast } = useToast();
  
  // Filter out deleted candidates immediately
  const activeCandidates = candidates?.filter(candidate => !deletedCandidateIds.has(candidate.id));
  const { filteredCandidates, filters } = useCandidateFilters(activeCandidates, searchTerm, selectedFilter);

  // Handle bulk operations
  const handleSelectCandidate = (candidateId: string, selected: boolean) => {
    if (selected) {
      setSelectedCandidates(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleBulkDelete = async (candidateIds: string[]) => {
    for (const id of candidateIds) {
      const candidate = candidates?.find(c => c.id === id);
      if (candidate) {
        await handleDeleteCandidate(id, candidate.name);
      }
    }
    toast({
      title: "Bulk Delete Complete",
      description: `Successfully deleted ${candidateIds.length} candidates`,
    });
  };

  const handleBulkTag = async (candidateIds: string[], tag: string) => {
    try {
      const tagPromises = candidateIds.map(candidateId => 
        supabase.from('candidate_tags').insert({
          candidate_id: candidateId,
          tag: tag
        })
      );
      
      await Promise.all(tagPromises);
      await refetch();
      
      toast({
        title: "Tags Added",
        description: `Added "${tag}" tag to ${candidateIds.length} candidates`,
      });
    } catch (error) {
      toast({
        title: "Tag Failed",
        description: "Could not add tags to candidates",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = (candidateIds: string[]) => {
    const selectedCandidatesData = candidates?.filter(c => candidateIds.includes(c.id));
    if (!selectedCandidatesData) return;

    const csvData = selectedCandidatesData.map(candidate => ({
      Name: candidate.name,
      Email: candidate.email,
      Phone: candidate.phone || '',
      'Applied Date': candidate.applications[0]?.applied_date || '',
      Status: candidate.applications[0]?.status || '',
      Rating: candidate.applications[0]?.rating || '',
      'Voice Score': candidate.applications[0]?.voice_analysis_score || '',
      Tags: candidate.candidate_tags.map(t => t.tag).join(', ')
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${candidateIds.length} candidates to CSV`,
    });
  };

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
          Export All Candidates
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-6">
          {/* Enhanced Search and Filters */}
          <SmartSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedFilters={smartFilters}
            onFiltersChange={setSmartFilters}
            suggestions={candidates?.map(c => c.name) || []}
          />

          {/* Legacy Filters (keep for compatibility) */}
          <CandidateFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            filters={filters}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedCandidates={selectedCandidates}
            totalCandidates={filteredCandidates.length}
            onSelectAll={handleSelectAll}
            onClearSelection={() => setSelectedCandidates([])}
            onBulkDelete={handleBulkDelete}
            onBulkTag={handleBulkTag}
            onBulkExport={handleBulkExport}
          />

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={(e) => handleSelectCandidate(candidate.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                </div>
                <CandidateCard
                  candidate={candidate}
                  onDelete={handleDeleteCandidate}
                  deletingCandidateId={deletingCandidateId}
                />
              </div>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg">No candidates found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
