import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Filter, Star, Mail, Phone, Trash2 } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const CandidateCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(null);
  const { data: candidates, isLoading, refetch } = useCandidates();
  const { toast } = useToast();

  const handleDeleteCandidate = async (candidateId: string, candidateName: string) => {
    setDeletingCandidateId(candidateId);
    
    try {
      console.log('Starting deletion process for candidate:', candidateId, 'Name:', candidateName);
      
      // Check if candidate exists first
      const { data: candidateCheck, error: checkError } = await supabase
        .from('candidates')
        .select('id, name, email')
        .eq('id', candidateId)
        .single();

      if (checkError) {
        console.error('Error checking candidate existence:', checkError);
        throw new Error(`Cannot find candidate: ${checkError.message}`);
      }

      console.log('Found candidate to delete:', candidateCheck);

      // Get all applications for this candidate first
      const { data: applications, error: getAppsError } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', candidateId);

      if (getAppsError) {
        console.error('Error getting applications:', getAppsError);
        throw getAppsError;
      }

      console.log(`Found ${applications?.length || 0} applications to delete`);

      // Delete applications first
      if (applications && applications.length > 0) {
        const { error: applicationsError } = await supabase
          .from('applications')
          .delete()
          .eq('candidate_id', candidateId);

        if (applicationsError) {
          console.error('Error deleting applications:', applicationsError);
          throw new Error(`Failed to delete applications: ${applicationsError.message}`);
        }
        console.log('Successfully deleted applications');
      }

      // Delete candidate tags
      const { error: tagsError } = await supabase
        .from('candidate_tags')
        .delete()
        .eq('candidate_id', candidateId);

      if (tagsError) {
        console.error('Error deleting tags:', tagsError);
        throw new Error(`Failed to delete tags: ${tagsError.message}`);
      }
      console.log('Successfully deleted tags');

      // Finally delete the candidate
      const { error: candidateError } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId);

      if (candidateError) {
        console.error('Error deleting candidate:', candidateError);
        throw new Error(`Failed to delete candidate: ${candidateError.message}`);
      }

      console.log('Successfully deleted candidate:', candidateId);

      toast({
        title: "Candidate Deleted",
        description: `${candidateName} has been successfully removed from the system.`,
      });

      // Force refresh the candidates list
      await refetch();
      
    } catch (error) {
      console.error('Detailed error during candidate deletion:', error);
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete candidate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingCandidateId(null);
    }
  };

  const filteredCandidates = candidates?.filter(candidate => {
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

  const filters = [
    { id: 'all', label: 'All Candidates', count: candidates?.length || 0 },
    { id: 'active', label: 'Active Applications', count: candidates?.filter(c => 
      c.applications.some(app => !['hired', 'rejected'].includes(app.status))
    ).length || 0 },
    { id: 'hired', label: 'Hired', count: candidates?.filter(c => 
      c.applications.some(app => app.status === 'hired')
    ).length || 0 },
  ];

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }, (_, index) => (
          <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star className="w-4 h-4 fill-yellow-200 text-yellow-400" />}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'offer_sent':
        return 'bg-green-100 text-green-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'applied':
        return 'Active Application';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'offer_sent':
        return 'Offer Sent';
      case 'hired':
        return 'Hired';
      default:
        return 'Previous Applicant';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Talent Vault</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
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
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={selectedFilter === filter.id ? "bg-gradient-to-r from-purple-500 to-blue-500" : ""}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate) => {
          const latestApplication = candidate.applications.length > 0 ? candidate.applications[0] : null;
          const tags = candidate.candidate_tags.map(tag => tag.tag);
          
          return (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {candidate.name}
                        <span className="text-xs text-gray-500 ml-2">ID: {candidate.id.slice(0, 8)}</span>
                      </CardTitle>
                      {latestApplication?.job_roles?.name && (
                        <p className="text-sm text-gray-600">{latestApplication.job_roles.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {latestApplication && (
                      <Badge className={getStatusColor(latestApplication.status)}>
                        {getDisplayStatus(latestApplication.status)}
                      </Badge>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          disabled={deletingCandidateId === candidate.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {candidate.name} (ID: {candidate.id.slice(0, 8)})? This will permanently remove their profile, all applications, and notes from the system. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deletingCandidateId === candidate.id}
                          >
                            {deletingCandidateId === candidate.id ? 'Deleting...' : 'Delete Candidate'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {latestApplication?.rating && renderStars(latestApplication.rating)}
                  <div className="text-sm text-gray-500">
                    {latestApplication && `Applied: ${new Date(latestApplication.applied_date).toLocaleDateString()}`}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {latestApplication?.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{latestApplication.notes}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Last contact: {new Date(latestApplication.applied_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Profile</Button>
                  <Button size="sm" variant="outline">Send Message</Button>
                  <Button size="sm" variant="outline">Schedule Interview</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
