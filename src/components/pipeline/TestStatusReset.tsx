
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

export const TestStatusReset = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  const resetJustinStatus = async () => {
    setIsResetting(true);
    try {
      // Find Justin Lesh's application
      const { data: applications, error: findError } = await supabase
        .from('applications')
        .select(`
          id,
          candidates!inner(name)
        `)
        .ilike('candidates.name', '%justin%lesh%');

      if (findError) throw findError;

      if (applications && applications.length > 0) {
        const justinApp = applications[0];
        
        // Reset his status to 'applied'
        const { error: updateError } = await supabase
          .from('applications')
          .update({ 
            status: 'applied',
            updated_at: new Date().toISOString()
          })
          .eq('id', justinApp.id);

        if (updateError) throw updateError;

        toast({
          title: "Status Reset",
          description: "Justin Lesh has been moved back to Applied status",
        });
      } else {
        toast({
          title: "Not Found",
          description: "Could not find Justin Lesh's application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error resetting status:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset Justin's status",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
      // Refresh the page to see the updated status
      window.location.reload();
    }
  };

  return (
    <Button
      onClick={resetJustinStatus}
      disabled={isResetting}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-50 bg-white shadow-lg"
    >
      {isResetting ? (
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <RefreshCw className="w-4 h-4 mr-2" />
      )}
      Reset Justin to Applied
    </Button>
  );
};
