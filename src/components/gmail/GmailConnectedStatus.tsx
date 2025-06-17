
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings, XCircle } from 'lucide-react';

interface GmailConnection {
  email: string;
  isConnected: boolean;
  lastSync: string;
  accessToken?: string;
}

interface GmailConnectedStatusProps {
  gmailConnection: GmailConnection;
  onTestConnection: () => void;
  onDisconnect: () => void;
}

export const GmailConnectedStatus = ({
  gmailConnection,
  onTestConnection,
  onDisconnect,
}: GmailConnectedStatusProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Gmail Connected</p>
            <p className="text-sm text-green-700">{gmailConnection.email}</p>
            <p className="text-xs text-green-600">
              Last synced: {new Date(gmailConnection.lastSync).toLocaleString()}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          Active
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onTestConnection} className="flex-1">
          <Settings className="w-4 h-4 mr-2" />
          Test Connection
        </Button>
        <Button variant="outline" onClick={onDisconnect} className="flex-1">
          <XCircle className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </div>
  );
};
