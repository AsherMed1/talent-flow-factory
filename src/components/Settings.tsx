
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <Input defaultValue="Patient Pro Marketing" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <Input defaultValue="https://patientpromarketing.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HR Email</label>
              <Input defaultValue="hr@patientpromarketing.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
              <Input placeholder="smtp.gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
              <Input defaultValue="Patient Pro Hiring Team" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reply-To Email</label>
              <Input defaultValue="noreply@patientpromarketing.com" />
            </div>
            <Button variant="outline">Test Configuration</Button>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Zoom Integration</h4>
                <p className="text-sm text-gray-500">Auto-generate interview links</p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Calendly Integration</h4>
                <p className="text-sm text-gray-500">Sync interview scheduling</p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">DocuSign Integration</h4>
                <p className="text-sm text-gray-500">Electronic signatures for offers</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Slack Notifications</h4>
                <p className="text-sm text-gray-500">Send updates to team channel</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Application Alerts</h4>
                <p className="text-sm text-gray-500">Notify when new candidates apply</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Interview Reminders</h4>
                <p className="text-sm text-gray-500">Send reminders 24h before interviews</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Overdue Task Alerts</h4>
                <p className="text-sm text-gray-500">Notify about pending reviews</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Weekly Summary Reports</h4>
                <p className="text-sm text-gray-500">Email hiring metrics every Monday</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium mb-2">Export Data</h4>
                <p className="text-sm text-gray-500 mb-3">Download all candidate data</p>
                <Button variant="outline" size="sm">Export CSV</Button>
              </div>
              
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium mb-2">Data Retention</h4>
                <p className="text-sm text-gray-500 mb-3">Auto-delete rejected applications</p>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>90 days</option>
                  <option>180 days</option>
                  <option>365 days</option>
                </select>
              </div>
              
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium mb-2">Compliance</h4>
                <p className="text-sm text-gray-500 mb-3">GDPR & CCPA ready</p>
                <Button variant="outline" size="sm">View Policy</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
