
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Filter, Star, Volume2 } from 'lucide-react';

interface SmartFiltersProps {
  onFiltersChange: (filters: SmartFilterCriteria) => void;
  applicantCount: number;
  filteredCount: number;
}

export interface SmartFilterCriteria {
  minOverallScore: number;
  minEnglishFluency: number;
  minMotivation: number;
  minClarity: number;
  requireVoiceAnalysis: boolean;
  hideRejected: boolean;
  topPercentOnly: number | null;
}

export const SmartFilters = ({ onFiltersChange, applicantCount, filteredCount }: SmartFiltersProps) => {
  const [filters, setFilters] = useState<SmartFilterCriteria>({
    minOverallScore: 6,
    minEnglishFluency: 7,
    minMotivation: 6,
    minClarity: 6,
    requireVoiceAnalysis: true,
    hideRejected: true,
    topPercentOnly: null,
  });

  const updateFilters = (newFilters: Partial<SmartFilterCriteria>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const applyQuickFilter = (preset: 'top10' | 'top25' | 'native' | 'motivated' | 'clear') => {
    let quickFilters: Partial<SmartFilterCriteria> = {};
    
    switch (preset) {
      case 'top10':
        quickFilters = { topPercentOnly: 10, minOverallScore: 8 };
        break;
      case 'top25':
        quickFilters = { topPercentOnly: 25, minOverallScore: 7 };
        break;
      case 'native':
        quickFilters = { minEnglishFluency: 9, minClarity: 8 };
        break;
      case 'motivated':
        quickFilters = { minMotivation: 8, minOverallScore: 7 };
        break;
      case 'clear':
        quickFilters = { minClarity: 8, minEnglishFluency: 8 };
        break;
    }
    
    updateFilters(quickFilters);
  };

  const clearFilters = () => {
    const defaultFilters: SmartFilterCriteria = {
      minOverallScore: 1,
      minEnglishFluency: 1,
      minMotivation: 1,
      minClarity: 1,
      requireVoiceAnalysis: false,
      hideRejected: false,
      topPercentOnly: null,
    };
    updateFilters(defaultFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Smart Filtering
          <Badge variant="outline" className="ml-auto">
            {filteredCount} of {applicantCount} candidates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Filter Buttons */}
        <div>
          <h4 className="font-medium mb-3">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter('top10')}
              className="text-green-700 border-green-200 hover:bg-green-50"
            >
              <Star className="w-3 h-3 mr-1" />
              Top 10%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter('top25')}
              className="text-blue-700 border-blue-200 hover:bg-blue-50"
            >
              <Filter className="w-3 h-3 mr-1" />
              Top 25%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter('native')}
              className="text-purple-700 border-purple-200 hover:bg-purple-50"
            >
              <Volume2 className="w-3 h-3 mr-1" />
              Native English
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter('motivated')}
              className="text-orange-700 border-orange-200 hover:bg-orange-50"
            >
              High Motivation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter('clear')}
              className="text-teal-700 border-teal-200 hover:bg-teal-50"
            >
              Clear Speech
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Score Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Min Overall Score: {filters.minOverallScore}/10
            </label>
            <Slider
              value={[filters.minOverallScore]}
              onValueChange={([value]) => updateFilters({ minOverallScore: value })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Min English Fluency: {filters.minEnglishFluency}/10
            </label>
            <Slider
              value={[filters.minEnglishFluency]}
              onValueChange={([value]) => updateFilters({ minEnglishFluency: value })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Min Motivation: {filters.minMotivation}/10
            </label>
            <Slider
              value={[filters.minMotivation]}
              onValueChange={([value]) => updateFilters({ minMotivation: value })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Min Speech Clarity: {filters.minClarity}/10
            </label>
            <Slider
              value={[filters.minClarity]}
              onValueChange={([value]) => updateFilters({ minClarity: value })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requireVoice"
              checked={filters.requireVoiceAnalysis}
              onCheckedChange={(checked) => updateFilters({ requireVoiceAnalysis: !!checked })}
            />
            <label htmlFor="requireVoice" className="text-sm">
              Require Voice Analysis
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hideRejected"
              checked={filters.hideRejected}
              onCheckedChange={(checked) => updateFilters({ hideRejected: !!checked })}
            />
            <label htmlFor="hideRejected" className="text-sm">
              Hide Rejected
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
