
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RoleEditFormProps {
  editRole: {
    name: string;
    description: string;
    booking_link: string;
    hiring_process: string;
    screening_questions: string;
    job_description: string;
    ai_tone_prompt: string;
  };
  setEditRole: (role: any) => void;
}

export const RoleEditForm = ({ editRole, setEditRole }: RoleEditFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700">Role Name *</Label>
        <Input
          value={editRole.name}
          onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
          className="text-lg font-semibold mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">Description</Label>
        <Input
          value={editRole.description}
          onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
          placeholder="Description"
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">Custom Booking Link</Label>
        <Input
          value={editRole.booking_link}
          onChange={(e) => setEditRole({ ...editRole, booking_link: e.target.value })}
          placeholder="e.g., https://calendly.com/yourname/interview"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-700">Hiring Process</Label>
        <Textarea
          value={editRole.hiring_process}
          onChange={(e) => setEditRole({ ...editRole, hiring_process: e.target.value })}
          className="mt-1 min-h-20"
          placeholder="Describe your hiring process steps..."
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">Screening Questions</Label>
        <Textarea
          value={editRole.screening_questions}
          onChange={(e) => setEditRole({ ...editRole, screening_questions: e.target.value })}
          className="mt-1 min-h-20"
          placeholder="Position-specific screening requirements..."
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">Job Description</Label>
        <Textarea
          value={editRole.job_description}
          onChange={(e) => setEditRole({ ...editRole, job_description: e.target.value })}
          className="mt-1 min-h-24"
          placeholder="Full job description..."
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">AI Analysis Tone</Label>
        <Textarea
          value={editRole.ai_tone_prompt}
          onChange={(e) => setEditRole({ ...editRole, ai_tone_prompt: e.target.value })}
          className="mt-1 min-h-20"
          placeholder="Define AI expertise for this role..."
        />
      </div>
    </div>
  );
};
