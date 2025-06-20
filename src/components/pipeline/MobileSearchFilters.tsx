
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from './PipelineStages';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface MobileSearchFiltersProps {
  applications: Application[];
  onFilteredApplications: (filtered: Application[]) => void;
}

export const MobileSearchFilters = ({ applications, onFilteredApplications }: MobileSearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatus[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statuses: { value: ApplicationStatus; label: string }[] = [
    { value: 'applied', label: 'Applied' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'interview_scheduled', label: 'Interview' },
    { value: 'interview_completed', label: 'Completed' },
    { value: 'offer_sent', label: 'Offer Sent' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const applyFilters = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.job_role?.name && app.job_role.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(app => selectedStatuses.includes(app.status));
    }

    onFilteredApplications(filtered);
  };

  const handleStatusToggle = (status: ApplicationStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    onFilteredApplications(applications);
  };

  const activeFiltersCount = selectedStatuses.length + (searchTerm ? 1 : 0);

  // Apply filters whenever dependencies change
  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedStatuses, applications]);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Filter Button and Active Filters */}
      <div className="flex items-center gap-2">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Applications</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-medium mb-3">Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status.value}
                      variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusToggle(status.value)}
                      className="justify-start"
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Clear filters button when filters are active */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Status Filters */}
      {selectedStatuses.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedStatuses.map((status) => {
            const statusInfo = statuses.find(s => s.value === status);
            return (
              <Badge
                key={status}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={() => handleStatusToggle(status)}
              >
                {statusInfo?.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};
