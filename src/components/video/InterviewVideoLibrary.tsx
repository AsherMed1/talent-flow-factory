import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Calendar, User, Briefcase, Video } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { LoomVideoPreview } from './LoomVideoPreview';

interface VideoLibraryFilters {
  search: string;
  jobRole: string;
  interviewer: string;
  dateRange: string;
  minRating: string;
  status: string;
}

export const InterviewVideoLibrary = () => {
  const { data: applications, isLoading } = useApplications();
  const [filters, setFilters] = useState<VideoLibraryFilters>({
    search: '',
    jobRole: 'all',
    interviewer: 'all',
    dateRange: 'all',
    minRating: 'all',
    status: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get applications with interview recordings
  const interviewApplications = useMemo(() => {
    if (!applications) return [];
    
    return applications.filter(app => 
      app.interview_recording_link || 
      app.zoom_recording_url || 
      (app.zoom_recording_files && Array.isArray(app.zoom_recording_files) && app.zoom_recording_files.length > 0)
    );
  }, [applications]);

  // Apply filters
  const filteredApplications = useMemo(() => {
    if (!interviewApplications) return [];

    return interviewApplications.filter(app => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          app.candidate.name.toLowerCase().includes(searchLower) ||
          app.candidate.email.toLowerCase().includes(searchLower) ||
          (app.job_role?.name && app.job_role.name.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Job role filter
      if (filters.jobRole !== 'all' && app.job_role?.name !== filters.jobRole) {
        return false;
      }

      // Rating filter
      if (filters.minRating !== 'all') {
        const minRating = parseInt(filters.minRating);
        if (!app.rating || app.rating < minRating) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && app.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const interviewDate = app.interview_date ? new Date(app.interview_date) : null;
        const now = new Date();
        
        if (!interviewDate) return false;
        
        switch (filters.dateRange) {
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (interviewDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (interviewDate < monthAgo) return false;
            break;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            if (interviewDate < quarterAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [interviewApplications, filters]);

  // Get unique values for filter dropdowns
  const uniqueJobRoles = useMemo(() => {
    const roles = new Set(interviewApplications.map(app => app.job_role?.name).filter(Boolean));
    return Array.from(roles);
  }, [interviewApplications]);

  const getStatusColor = (status: string) => {
    const colors = {
      'hired': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'interview_completed': 'bg-yellow-100 text-yellow-800',
      'offer_sent': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderRating = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400 text-sm">No rating</span>;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const getRecordingUrl = (app: any) => {
    if (app.interview_recording_link) return app.interview_recording_link;
    if (app.zoom_recording_url) return app.zoom_recording_url;
    if (app.zoom_recording_files?.[0]?.play_url) return app.zoom_recording_files[0].play_url;
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Video Library</h1>
          <p className="text-gray-600 mt-1">
            {filteredApplications.length} of {interviewApplications.length} interview recordings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search candidates..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select value={filters.jobRole} onValueChange={(value) => setFilters(prev => ({ ...prev, jobRole: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Job Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueJobRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.minRating} onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="interview_completed">Completed</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="offer_sent">Offer Sent</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline"
              onClick={() => setFilters({
                search: '',
                jobRole: 'all',
                interviewer: 'all',
                dateRange: 'all',
                minRating: 'all',
                status: 'all'
              })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid/List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interview recordings found</h3>
            <p className="text-gray-500">
              {interviewApplications.length === 0 
                ? "No interview recordings have been uploaded yet."
                : "Try adjusting your filters to see more results."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"}>
          {filteredApplications.map((application) => {
            const recordingUrl = getRecordingUrl(application);
            
            if (viewMode === 'grid') {
              return (
                <div key={application.id} className="space-y-3">
                  <LoomVideoPreview
                    loomUrl={recordingUrl || ''}
                    title={`${application.candidate.name} - ${application.job_role?.name || 'Interview'}`}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{application.candidate.name}</h4>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{application.job_role?.name || 'Unknown Role'}</span>
                      </div>
                      {application.interview_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(application.interview_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    {renderRating(application.rating)}
                  </div>
                </div>
              );
            } else {
              return (
                <Card key={application.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-20 flex-shrink-0">
                        <LoomVideoPreview
                          loomUrl={recordingUrl || ''}
                          title={application.candidate.name}
                          className="h-full"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{application.candidate.name}</h4>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{application.job_role?.name || 'Unknown Role'}</span>
                          </div>
                          {application.interview_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(application.interview_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        {renderRating(application.rating)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
