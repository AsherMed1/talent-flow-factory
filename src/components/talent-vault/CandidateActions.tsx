
import { Button } from '@/components/ui/button';

export const CandidateActions = () => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline">View Profile</Button>
      <Button size="sm" variant="outline">Send Message</Button>
      <Button size="sm" variant="outline">Schedule Interview</Button>
    </div>
  );
};
