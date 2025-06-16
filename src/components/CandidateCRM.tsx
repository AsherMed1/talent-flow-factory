
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Star, Mail, Phone } from 'lucide-react';

export const CandidateCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      role: 'Appointment Setter',
      status: 'Active Application',
      rating: 4.5,
      tags: ['Top Performer', 'Spanish Speaker'],
      appliedDate: '2024-03-15',
      notes: 'Excellent communication skills, previous healthcare experience',
      lastContact: '2024-03-16',
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      role: 'Virtual Assistant',
      status: 'Interview Scheduled',
      rating: 4.8,
      tags: ['Tech Savvy', 'Project Management'],
      appliedDate: '2024-03-12',
      notes: 'Strong technical background, great portfolio',
      lastContact: '2024-03-15',
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 345-6789',
      role: 'Appointment Setter',
      status: 'Offer Sent',
      rating: 5.0,
      tags: ['Top Setter', 'Quick Learner'],
      appliedDate: '2024-03-10',
      notes: 'Outstanding interview performance, immediate availability',
      lastContact: '2024-03-16',
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 456-7890',
      role: 'Sales Closer',
      status: 'Previous Applicant',
      rating: 3.5,
      tags: ['Sales Experience', 'Follow Up'],
      appliedDate: '2024-02-28',
      notes: 'Good potential, needs more training',
      lastContact: '2024-03-01',
    },
  ];

  const filters = [
    { id: 'all', label: 'All Candidates', count: candidates.length },
    { id: 'active', label: 'Active Applications', count: 2 },
    { id: 'hired', label: 'Hired', count: 1 },
    { id: 'previous', label: 'Previous Applicants', count: 1 },
  ];

  const renderStars = (rating: number) => {
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
      case 'Active Application':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Offer Sent':
        return 'bg-green-100 text-green-800';
      case 'Previous Applicant':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        {candidates.map((candidate) => (
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
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-gray-600">{candidate.role}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(candidate.status)}>
                  {candidate.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {renderStars(candidate.rating)}
                <div className="text-sm text-gray-500">
                  Applied: {candidate.appliedDate}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{candidate.phone}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {candidate.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{candidate.notes}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Last contact: {candidate.lastContact}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">View Profile</Button>
                <Button size="sm" variant="outline">Send Message</Button>
                <Button size="sm" variant="outline">Schedule Interview</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
