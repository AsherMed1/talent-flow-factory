
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
  avatar?: string;
}

export interface CandidateAssignment {
  id: string;
  candidate_id: string;
  assigned_to: string;
  assigned_by: string;
  assigned_at: string;
  status: 'active' | 'completed';
  notes?: string;
}

export interface InternalNote {
  id: string;
  candidate_id: string;
  author_id: string;
  content: string;
  is_private: boolean;
  mentioned_users?: string[];
  created_at: string;
  updated_at: string;
}
