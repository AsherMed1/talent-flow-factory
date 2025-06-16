import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Phone, Calendar, Target, Diamond, DollarSign } from 'lucide-react';

interface ApplicationFormHeaderProps {
  onClearSavedData: () => void;
}

export const ApplicationFormHeader = ({ onClearSavedData }: ApplicationFormHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-gray-900">
          Appointment Setter – Remote
        </CardTitle>
        <div className="text-center">
          <p className="text-xl font-semibold text-blue-600 mb-4">
            (Must Be Available Weekends + Bonuses!)
          </p>
        </div>

        {/* Loom Video Embed */}
        <div className="mb-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">J</span>
              Onboarding Process Overview
            </h4>
            <div className="w-full max-w-2xl mx-auto">
              <div style={{ position: 'relative', paddingBottom: '51.354166666666664%', height: 0 }}>
                <iframe
                  src="https://www.loom.com/embed/646c1476756c4fc3a96255e0a3a1c6ee?sid=7ea3293d-3735-4500-aadc-e1a790f42062"
                  frameBorder="0"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="Onboarding Process Overview"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">⏱</span>
                </div>
                <span>1 min 26 sec</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">👁</span>
                </div>
                <span>767 views</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 text-gray-700">
          <p className="text-lg">
            We are a <strong>fast-growing agency</strong> looking for a personable and detail-oriented{' '}
            <strong>Appointment Setter</strong> to contact prospective clients via phone and email. 
            You'll be working with various industries, ensuring an{' '}
            <strong>exciting and dynamic work environment</strong>.
          </p>

          {/* What We Offer */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">What We Offer:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Fully remote position with <strong>flexible hours</strong> (must be available weekends)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Opportunity for <strong>performance bonuses & career growth</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Supportive, <strong>world-class team</strong> focused on your success</span>
              </div>
            </div>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Key Responsibilities:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Call and qualify leads to <strong>book appointments</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span><strong>Schedule consultations</strong> and follow up with prospects</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>Ensure <strong>high-quality interactions</strong> that drive results</span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Requirements:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span><strong>Fluent English</strong> (B2+ level, spoken & written)</span>
              </div>
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span><strong>Friendly, engaging, and detail-oriented</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span><strong>Reliable internet</strong> (20 Mbps down, 10 Mbps up) & <strong>dual-screen setup</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Available to work a <strong>consistent shift (Eastern Time)</strong></span>
              </div>
            </div>
          </div>

          {/* Pay */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-lg font-bold text-green-700">
                Pay: $5/hr + performance bonuses
              </span>
            </div>
          </div>
        </div>
        
        {/* Auto-save notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700 mt-6">
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
