
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, User, Clock, CheckCircle } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useCollaboration } from '@/hooks/useCollaboration';
import { CandidateAssignment } from '@/types/collaboration';

interface AssignmentPanelProps {
  candidateId: string;
}

export const AssignmentPanel = ({ candidateId }: AssignmentPanelProps) => {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [showAssignForm, setShowAssignForm] = useState(false);

  const { data: teamMembers } = useTeamMembers();
  const { assignments, assignCandidate, isAssigning } = useCollaboration(candidateId);

  const handleAssign = () => {
    if (!selectedMember) return;
    
    assignCandidate({
      assignedTo: selectedMember,
      notes: assignmentNotes || undefined
    });
    
    setSelectedMember('');
    setAssignmentNotes('');
    setShowAssignForm(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Assignments
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssignForm(!showAssignForm)}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Assign
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assignment Form */}
        {showAssignForm && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Assign to Team Member</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers?.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Assignment Notes (Optional)</label>
              <Textarea
                placeholder="Add context or specific instructions..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                className="min-h-20"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={!selectedMember || isAssigning}
              >
                {isAssigning ? 'Assigning...' : 'Assign'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssignForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Current Assignments */}
        <div className="space-y-3">
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => {
              const assignedMember = teamMembers?.find(m => m.id === assignment.assigned_to);
              const assignedBy = teamMembers?.find(m => m.id === assignment.assigned_by);
              
              return (
                <div key={assignment.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-sm">
                          {assignedMember?.name.split(' ').map(n => n[0]).join('') || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {assignedMember?.name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned by {assignedBy?.name || 'Unknown'}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1">{assignment.status}</span>
                    </Badge>
                  </div>
                  
                  {assignment.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {assignment.notes}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(assignment.assigned_at).toLocaleString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <div className="text-sm">No assignments yet</div>
              <div className="text-xs">Assign this candidate to a team member</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
