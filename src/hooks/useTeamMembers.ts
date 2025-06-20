
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/types/collaboration';

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('full_name');
      
      if (error) throw error;
      
      return data.map(member => ({
        id: member.id,
        name: member.full_name || member.email,
        email: member.email,
        role: member.role || 'recruiter'
      })) as TeamMember[];
    }
  });
};
