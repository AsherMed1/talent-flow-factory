import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { stages, ApplicationStatus } from './PipelineStages';

interface SearchAndFiltersProps {
  applications: Application[];
  onFilteredApplications: (filtered: Application[]) => void;
}

interface FilterState {
  search: string;
  status: ApplicationStatus | 'all';
  dateRange: 'all' | 'week' | 'month' | '3months';
  minRating: number | null;
  minVoiceScore: number | null;
  role: string | 'all';
}

export const SearchAndFilters = ({ applications, onFilteredApplications }: SearchAndFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    dateRange: 'all',
    minRating: null,
    minVoiceScore: null,
    role: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Get unique roles for filter dropdown - ensure we include common roles even if not in current applications
  const uniqueRoles = Array.from(new Set([
    ...applications.map(app => app.job_roles?.name).filter(Boolean),
    'Video Editor', // Always include Video Editor as an option
    'Appointment Setter',
    'Customer Service Representative'
  ])).sort();

  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...applications];

    // Search filter
    if (newFilters.search.trim()) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.candidates.name.toLowerCase().includes(searchLower) ||
        app.candidates.email.toLowerCase().includes(searchLower) ||
        app.job_roles?.name.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (newFilters.status !== 'all') {
      filtered = filtered.filter(app => app.status === newFilters.status);
    }

    // Date range filter
    if (newFilters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (newFilters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(app => new Date(app.applied_date) >= cutoffDate);
    }

    // Rating filter
    if (newFilters.minRating !== null) {
      filtered = filtered.filter(app => app.rating !== null && app.rating >= newFilters.minRating!);
    }

    // Voice score filter
    if (newFilters.minVoiceScore !== null) {
      filtered = filtered.filter(app => 
        app.voice_analysis_score !== null && app.voice_analysis_score >= newFilters.minVoiceScore!
      );
    }

    // Role filter
    if (newFilters.role !== 'all') {
      filtered = filtered.filter(app => app.job_roles?.name === newFilters.role);
    }

    onFilteredApplications(filtered);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      status: 'all',
      dateRange: 'all',
      minRating: null,
      minVoiceScore: null,
      role: 'all'
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.minRating !== null) count++;
    if (filters.minVoiceScore !== null) count++;
    if (filters.role !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search candidates, emails, or roles..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-gray-500"
          >
            <X className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value as ApplicationStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {stages.map(stage => (
                    <SelectItem key={stage.name} value={stage.name}>
                      {stage.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last month</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {uniqueRoles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
              <Select 
                value={filters.minRating?.toString() || 'all'} 
                onValueChange={(value) => updateFilter('minRating', value === 'all' ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any rating</SelectItem>
                  <SelectItem value="1">1+ stars</SelectItem>
                  <SelectItem value="2">2+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Voice Score Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Minimum Voice Score</label>
              <Select 
                value={filters.minVoiceScore?.toString() || 'all'} 
                onValueChange={(value) => updateFilter('minVoiceScore', value === 'all' ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any score</SelectItem>
                  <SelectItem value="60">60+ points</SelectItem>
                  <SelectItem value="70">70+ points</SelectItem>
                  <SelectItem value="80">80+ points</SelectItem>
                  <SelectItem value="90">90+ points</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              {filters.search && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: "{filters.search}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('search', '')}
                  />
                </Badge>
              )}
              {filters.status !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Status: {stages.find(s => s.name === filters.status)?.displayName}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('status', 'all')}
                  />
                </Badge>
              )}
              {filters.dateRange !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {filters.dateRange === 'week' && 'Last 7 days'}
                  {filters.dateRange === 'month' && 'Last month'}
                  {filters.dateRange === '3months' && 'Last 3 months'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('dateRange', 'all')}
                  />
                </Badge>
              )}
              {filters.role !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Role: {filters.role}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('role', 'all')}
                  />
                </Badge>
              )}
              {filters.minRating && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Rating: {filters.minRating}+ stars
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('minRating', null)}
                  />
                </Badge>
              )}
              {filters.minVoiceScore && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Voice: {filters.minVoiceScore}+ points
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('minVoiceScore', null)}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
