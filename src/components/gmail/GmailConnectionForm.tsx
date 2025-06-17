
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, RefreshCw } from 'lucide-react';

interface GmailConnectionFormProps {
  clientId: string;
  clientSecret: string;
  isConnecting: boolean;
  onClientIdChange: (value: string) => void;
  onClientSecretChange: (value: string) => void;
  onConnect: () => void;
}

export const GmailConnectionForm = ({
  clientId,
  clientSecret,
  isConnecting,
  onClientIdChange,
  onClientSecretChange,
  onConnect,
}: GmailConnectionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="client-id">Gmail OAuth Client ID</Label>
          <Input
            id="client-id"
            type="password"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            placeholder="Your Google Cloud OAuth Client ID"
          />
        </div>
        <div>
          <Label htmlFor="client-secret">Gmail OAuth Client Secret</Label>
          <Input
            id="client-secret"
            type="password"
            value={clientSecret}
            onChange={(e) => onClientSecretChange(e.target.value)}
            placeholder="Your Google Cloud OAuth Client Secret"
          />
        </div>
      </div>

      <Button 
        onClick={onConnect} 
        disabled={isConnecting || !clientId || !clientSecret}
        className="w-full"
      >
        {isConnecting ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Connecting to Gmail...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Connect Gmail Account
          </>
        )}
      </Button>
    </div>
  );
};
