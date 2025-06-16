
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApplicationFormHeaderProps {
  onClearSavedData: () => void;
}

export const ApplicationFormHeader = ({ onClearSavedData }: ApplicationFormHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Appointment Setter – Remote</CardTitle>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-blue-600">(Must Be Available Weekends + Bonuses!)</p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
            <p><strong>What We Offer:</strong></p>
            <p>✅ Fully remote position with flexible hours (must be available weekends)</p>
            <p>✅ Opportunity for performance bonuses & career growth</p>
            <p>✅ Supportive, world-class team focused on your success</p>
            <p className="font-semibold text-green-600">💰 Pay: $5/hr + performance bonuses</p>
          </div>
        </div>
        
        {/* Auto-save notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
          <strong>Auto-save enabled:</strong> Your form data is automatically saved as you type.
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearSavedData}
            className="ml-2 text-xs"
          >
            Clear Saved Data
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
