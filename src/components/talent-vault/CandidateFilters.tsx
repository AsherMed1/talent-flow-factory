
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface CandidateFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  filters: FilterOption[];
}

export const CandidateFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedFilter, 
  onFilterChange, 
  filters 
}: CandidateFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={selectedFilter === filter.id ? "bg-gradient-to-r from-purple-500 to-blue-500" : ""}
          >
            {filter.label} ({filter.count})
          </Button>
        ))}
      </div>
    </div>
  );
};
