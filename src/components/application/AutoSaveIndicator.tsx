
import { useState, useEffect } from 'react';
import { Check, Save, AlertCircle } from 'lucide-react';

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
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  const getStatusDisplay = () => {
    if (isSaving) {
      return (
        <div className="flex items-center text-blue-600 text-sm">
          <Save className="w-4 h-4 mr-1 animate-pulse" />
          Saving...
        </div>
      );
    }

    if (showSaved && lastSaved) {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <Check className="w-4 h-4 mr-1" />
          Draft saved
        </div>
      );
    }

    if (hasUnsavedChanges) {
      return (
        <div className="flex items-center text-amber-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          Unsaved changes
        </div>
      );
    }

    if (lastSaved) {
      return (
        <div className="text-gray-500 text-sm">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
      {getStatusDisplay()}
    </div>
  );
};
