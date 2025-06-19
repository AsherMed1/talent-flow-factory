
import { useState, useEffect } from 'react';
import { Check, Save, AlertCircle, Cloud, CloudOff } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved?: Date;
  hasUnsavedChanges: boolean;
}

export const AutoSaveIndicator = ({ isSaving, lastSaved, hasUnsavedChanges }: AutoSaveIndicatorProps) => {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  const getStatusDisplay = () => {
    if (isSaving) {
      return (
        <div className="flex items-center text-blue-600 text-sm">
          <Cloud className="w-4 h-4 mr-2 animate-pulse" />
          <div>
            <div className="font-medium">Auto-saving...</div>
            <div className="text-xs text-blue-500">Including all uploads and recordings</div>
          </div>
        </div>
      );
    }

    if (showSaved && lastSaved) {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <Check className="w-4 h-4 mr-2" />
          <div>
            <div className="font-medium">Draft saved</div>
            <div className="text-xs text-green-500">All progress preserved</div>
          </div>
        </div>
      );
    }

    if (hasUnsavedChanges) {
      return (
        <div className="flex items-center text-amber-600 text-sm">
          <Save className="w-4 h-4 mr-2" />
          <div>
            <div className="font-medium">Saving changes...</div>
            <div className="text-xs text-amber-500">Please wait</div>
          </div>
        </div>
      );
    }

    if (lastSaved) {
      return (
        <div className="flex items-center text-gray-500 text-sm">
          <CloudOff className="w-4 h-4 mr-2" />
          <div>
            <div className="text-xs">Last saved</div>
            <div className="font-medium">{lastSaved.toLocaleTimeString()}</div>
          </div>
        </div>
      );
    }

    return null;
  };

  const statusDisplay = getStatusDisplay();
  if (!statusDisplay) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 min-w-[200px]">
      {statusDisplay}
    </div>
  );
};
