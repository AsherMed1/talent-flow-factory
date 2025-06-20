
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Trash2, 
  Mail, 
  Tag, 
  ArrowRight, 
  Download,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsBarProps {
  selectedCandidates: string[];
  totalCandidates: number;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  onBulkDelete: (candidateIds: string[]) => Promise<void>;
  onBulkTag: (candidateIds: string[], tag: string) => Promise<void>;
  onBulkExport: (candidateIds: string[]) => void;
}

export const BulkActionsBar = ({
  selectedCandidates,
  totalCandidates,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkTag,
  onBulkExport
}: BulkActionsBarProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleBulkAction = async (action: () => Promise<void>) => {
    setIsProcessing(true);
    try {
      await action();
      onClearSelection();
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const commonTags = [
    'High Priority',
    'Technical Interview Ready',
    'Follow Up Required',
    'Reference Check Pending',
    'Salary Negotiation',
    'Top Performer'
  ];

  if (selectedCandidates.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedCandidates.length === totalCandidates}
              onCheckedChange={onSelectAll}
            />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCandidates.length} selected
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction(() => onBulkDelete(selectedCandidates))}
              disabled={isProcessing}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isProcessing}>
                  <Tag className="w-4 h-4 mr-1" />
                  Add Tag
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {commonTags.map(tag => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => handleBulkAction(() => onBulkTag(selectedCandidates, tag))}
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkExport(selectedCandidates)}
              disabled={isProcessing}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
