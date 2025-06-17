
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useGoHighLevel } from '@/hooks/useGoHighLevel';
import { Calendar, ExternalLink } from 'lucide-react';

export const GoHighLevelConfiguration = () => {
  const [locationId, setLocationId] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const { toast } = useToast();
  const { getConfig, saveConfig, getBookingLink, isConfigured } = useGoHighLevel();

  useEffect(() => {
    const config = getConfig();
    if (config) {
      setLocationId(config.locationId);
      setCalendarId(config.calendarId || '');
      setBookingLink(getBookingLink(config.calendarId));
    }
  }, [getConfig, getBookingLink]);

  const handleSave = () => {
    if (!locationId.trim()) {
      toast({
        title: "Validation Error",
        description: "Location ID is required.",
        variant: "destructive",
      });
      return;
    }

    const config = {
      locationId: locationId.trim(),
      calendarId: calendarId.trim() || undefined
    };

    saveConfig(config);
    setBookingLink(getBookingLink(config.calendarId));

    toast({
      title: "Configuration Saved",
      description: "GoHighLevel calendar settings have been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          GoHighLevel Calendar Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Go to your GoHighLevel dashboard</li>
            <li>Navigate to Settings → Locations</li>
            <li>Copy your Location ID from the URL or settings</li>
            <li>Optionally, get your Calendar ID from Calendar settings</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="location-id">Location ID *</Label>
            <Input
              id="location-id"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="e.g., 5f5b7c8d9e1f2a3b4c5d6e7f"
            />
            <p className="text-xs text-gray-600 mt-1">
              Found in your GoHighLevel dashboard under Settings → Locations
            </p>
          </div>

          <div>
            <Label htmlFor="calendar-id">Calendar ID (Optional)</Label>
            <Input
              id="calendar-id"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              placeholder="e.g., interview-calendar"
            />
            <p className="text-xs text-gray-600 mt-1">
              Leave empty to use default calendar. Found in Calendar settings.
            </p>
          </div>

          {bookingLink && (
            <div className="bg-green-50 p-3 rounded-lg">
              <Label className="text-green-800 font-medium">Generated Booking Link:</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={bookingLink}
                  readOnly
                  className="bg-white text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(bookingLink, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-green-700 mt-1">
                This link will be included in your interview invitation emails
              </p>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            Save Configuration
          </Button>

          {isConfigured && (
            <div className="text-center text-sm text-green-600">
              ✅ GoHighLevel calendar is configured and ready to use
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
