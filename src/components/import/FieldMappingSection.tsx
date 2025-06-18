
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface FieldMappingSectionProps {
  fieldMapping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobRole: string;
  };
  availableHeaders: string[];
  onFieldMappingChange: (field: string, value: string) => void;
}

export const FieldMappingSection = ({ 
  fieldMapping, 
  availableHeaders, 
  onFieldMappingChange 
}: FieldMappingSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Mapping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(fieldMapping).map(([field, value]) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                {field === 'firstName' || field === 'lastName' || field === 'email' ? (
                  <span className="text-red-500 ml-1">*</span>
                ) : null}
              </Label>
              <select
                id={field}
                value={value}
                onChange={(e) => onFieldMappingChange(field, e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column...</option>
                {availableHeaders.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Required fields: First Name, Last Name, Email</p>
              <p>Phone and Job Role are optional but recommended for better candidate tracking.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
