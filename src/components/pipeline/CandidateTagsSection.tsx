
import { Badge } from '@/components/ui/badge';
import { Application } from '@/hooks/useApplications';

interface CandidateTagsSectionProps {
  application: Application;
}

export const CandidateTagsSection = ({ application }: CandidateTagsSectionProps) => {
  if (application.candidate.candidate_tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {application.candidate.candidate_tags.map((tag, index) => (
        <Badge key={index} variant="outline" className="text-xs bg-blue-50">
          {tag.tag}
        </Badge>
      ))}
    </div>
  );
};
