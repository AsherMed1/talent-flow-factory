import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { useWebhooks, useCreateWebhook, WebhookConfig } from '@/hooks/useWebhooks';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const WebhookSettings = () => {
  const { data: webhooks, isLoading } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const { toast } = useToast();
  
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    event_type: 'application_submitted' as const,
    is_active: true
  });

  const eventTypes = [
    { value: 'application_submitted', label: 'Application Submitted' },
    { value: 'status_changed', label: 'Status Changed' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'offer_sent', label: 'Offer Sent' },
    { value: 'candidate_hired', label: 'Candidate Hired' },
    { value: 'candidate_rejected', label: 'Candidate Rejected' }
  ];

  const handleCreateWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Missing Information",
        description: "Please provide both a name and webhook URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createWebhook.mutateAsync(newWebhook);
      setNewWebhook({
        name: '',
        url: '',
        event_type: 'application_submitted',
        is_active: true
      });
    } catch (error) {
      console.error('Error creating webhook:', error);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Webhook Deleted",
        description: "The webhook configuration has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webhook.",
        variant: "destructive",
      });
    }
  };

  const handleToggleWebhook = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: isActive ? "Webhook Enabled" : "Webhook Disabled",
        description: `The webhook has been ${isActive ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update webhook status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Make.com Webhook Integration
            <ExternalLink className="w-4 h-4" />
          </CardTitle>
          <p className="text-sm text-gray-600">
            Connect your hiring pipeline to Make.com scenarios for automated emails and workflows.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Webhook */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-4">Add New Webhook</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="e.g., Application Confirmation Email"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="webhook-url">Make.com Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://hook.eu1.make.com/..."
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="event-type">Trigger Event</Label>
                <Select
                  value={newWebhook.event_type}
                  onValueChange={(value) => setNewWebhook(prev => ({ ...prev, event_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCreateWebhook}
                  disabled={createWebhook.isPending}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createWebhook.isPending ? 'Creating...' : 'Add Webhook'}
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Webhooks */}
          <div>
            <h3 className="font-medium mb-4">Configured Webhooks</h3>
            {webhooks && webhooks.length > 0 ? (
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{webhook.name}</h4>
                        <Badge variant={webhook.is_active ? "default" : "secondary"}>
                          {webhook.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {eventTypes.find(t => t.value === webhook.event_type)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{webhook.url}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={webhook.is_active}
                        onCheckedChange={(checked) => handleToggleWebhook(webhook.id, checked)}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No webhooks configured yet. Add your first webhook above.
              </div>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Create a new scenario in Make.com</p>
              <p>2. Add a "Webhook" trigger and copy the webhook URL</p>
              <p>3. Paste the URL above and select the appropriate trigger event</p>
              <p>4. Your scenario will receive candidate data when the event occurs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
