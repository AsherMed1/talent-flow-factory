
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import type { Candidate } from '@/hooks/useCandidates';

interface CandidateDeleteButtonProps {
  candidate: Candidate;
  onDelete: (candidateId: string, candidateName: string) => Promise<void>;
  isDeleting: boolean;
}

export const CandidateDeleteButton = ({ candidate, onDelete, isDeleting }: CandidateDeleteButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permanently Delete Candidate</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete {candidate.name}? This will remove them from:
            <br /><br />
            <strong>• Talent Vault</strong><br />
            <strong>• Pipeline</strong><br />
            <strong>• All Applications</strong><br />
            <strong>• Interview Notes & Recordings</strong><br />
            <strong>• Voice & Video Analysis</strong><br />
            <strong>• Pre-screening Data</strong><br />
            <strong>• All Tags & History</strong>
            <br /><br />
            <span className="text-red-600 font-medium">This action cannot be undone and will completely remove all traces of this candidate from the system.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(candidate.id, candidate.name)}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting All Records...' : 'Delete Everything'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
