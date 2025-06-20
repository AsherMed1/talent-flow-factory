
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock,
  Brain,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface SmartSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  suggestions?: string[];
}

export const SmartSearch = ({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFiltersChange,
  suggestions = []
}: SmartSearchProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filterOptions = [
    { 
      label: 'Rating', 
      icon: Star,
      options: ['5 Stars', '4+ Stars', '3+ Stars', 'Unrated']
    },
    {
      label: 'Voice Analysis',
      icon: Brain,
      options: ['High Score (8+)', 'Good Score (6-8)', 'Needs Review (<6)', 'Not Analyzed']
    },
    {
      label: 'Status',
      icon: Users,
      options: ['Active', 'Interviewed', 'Hired', 'Rejected', 'On Hold']
    },
    {
      label: 'Recency',
      icon: Clock,
      options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Older']
    }
  ];

  const handleFilterToggle = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFiltersChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFiltersChange([...selectedFilters, filter]);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search candidates by name, email, skills, or job role..."
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-4 py-2 text-sm"
        />
        
        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-10 mt-1 shadow-lg">
            <CardContent className="p-2">
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  onClick={() => {
                    onSearchChange(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((category) => {
          const Icon = category.icon;
          return (
            <DropdownMenu key={category.label}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Icon className="w-3 h-3 mr-1" />
                  {category.label}
                  <Filter className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{category.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {category.options.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleFilterToggle(option)}
                  >
                    <div className="flex items-center w-full">
                      <span className="flex-1">{option}</span>
                      {selectedFilters.includes(option) && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}

        {(selectedFilters.length > 0 || searchTerm) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Active filters:</span>
          {selectedFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-gray-200"
              onClick={() => handleFilterToggle(filter)}
            >
              {filter}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
