
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentPanel } from './AssignmentPanel';
import { InternalNotesPanel } from './InternalNotesPanel';
import { Users, MessageSquare } from 'lucide-react';

interface CollaborationPanelProps {
  candidateId: string;
}

export const CollaborationPanel = ({ candidateId }: CollaborationPanelProps) => {
  return (
    <Tabs defaultValue="assignments" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="assignments" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Assignments
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Internal Notes
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="assignments">
        <AssignmentPanel candidateId={candidateId} />
      </TabsContent>
      
      <TabsContent value="notes">
        <InternalNotesPanel candidateId={candidateId} />
      </TabsContent>
    </Tabs>
  );
};
