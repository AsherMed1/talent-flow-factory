
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare, Lock, Eye, AtSign, Plus } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useCollaboration } from '@/hooks/useCollaboration';
import { InternalNote } from '@/types/collaboration';

interface InternalNotesPanelProps {
  candidateId: string;
}

export const InternalNotesPanel = ({ candidateId }: InternalNotesPanelProps) => {
  const [noteContent, setNoteContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);

  const { data: teamMembers } = useTeamMembers();
  const { internalNotes, addInternalNote, isAddingNote } = useCollaboration(candidateId);

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    
    addInternalNote({
      content: noteContent,
      isPrivate,
      mentionedUsers: mentionedUsers.length > 0 ? mentionedUsers : undefined
    });
    
    setNoteContent('');
    setIsPrivate(false);
    setMentionedUsers([]);
    setShowAddNote(false);
  };

  const handleMentionToggle = (userId: string) => {
    setMentionedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Internal Notes
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddNote(!showAddNote)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        {showAddNote && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Internal Note</label>
              <Textarea
                placeholder="Add internal notes, observations, or reminders about this candidate..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-24"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="private-note"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
              />
              <label htmlFor="private-note" className="text-sm font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Private note (only visible to you)
              </label>
            </div>

            {!isPrivate && (
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <AtSign className="w-3 h-3" />
                  Mention Team Members
                </label>
                <div className="flex flex-wrap gap-2">
                  {teamMembers?.map(member => (
                    <button
                      key={member.id}
                      onClick={() => handleMentionToggle(member.id)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        mentionedUsers.includes(member.id)
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      @{member.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!noteContent.trim() || isAddingNote}
              >
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddNote(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {internalNotes && internalNotes.length > 0 ? (
            internalNotes.map((note) => {
              const author = teamMembers?.find(m => m.id === note.author_id);
              
              return (
                <div key={note.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-sm">
                          {author?.name.split(' ').map(n => n[0]).join('') || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {author?.name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(note.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {note.is_private && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      )}
                      {!note.is_private && (
                        <Badge variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Team
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {note.content}
                  </div>
                  
                  {note.mentioned_users && note.mentioned_users.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                      <AtSign className="w-3 h-3" />
                      <span>
                        Mentioned: {note.mentioned_users.map(userId => {
                          const user = teamMembers?.find(m => m.id === userId);
                          return user?.name || 'Unknown';
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <div className="text-sm">No internal notes yet</div>
              <div className="text-xs">Add notes to collaborate with your team</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
