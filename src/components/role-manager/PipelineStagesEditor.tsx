
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { PipelineStage } from '@/hooks/useJobRoles';

interface PipelineStagesEditorProps {
  stages: PipelineStage[];
  onChange: (stages: PipelineStage[]) => void;
}

const defaultColors = [
  'bg-gray-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 
  'bg-green-100', 'bg-emerald-100', 'bg-orange-100', 'bg-cyan-100', 
  'bg-indigo-100', 'bg-pink-100', 'bg-red-100'
];

const colorLabels = {
  'bg-gray-100': 'Gray',
  'bg-blue-100': 'Blue', 
  'bg-yellow-100': 'Yellow',
  'bg-purple-100': 'Purple',
  'bg-green-100': 'Green',
  'bg-emerald-100': 'Emerald',
  'bg-orange-100': 'Orange',
  'bg-cyan-100': 'Cyan',
  'bg-indigo-100': 'Indigo',
  'bg-pink-100': 'Pink',
  'bg-red-100': 'Red'
};

export const PipelineStagesEditor = ({ stages, onChange }: PipelineStagesEditorProps) => {
  const addStage = () => {
    const newStage: PipelineStage = {
      name: `stage_${stages.length + 1}`,
      displayName: `Stage ${stages.length + 1}`,
      color: defaultColors[stages.length % defaultColors.length]
    };
    onChange([...stages, newStage]);
  };

  const updateStage = (index: number, field: keyof PipelineStage, value: string) => {
    const updatedStages = [...stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    
    // Auto-generate name from displayName
    if (field === 'displayName') {
      updatedStages[index].name = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    
    onChange(updatedStages);
  };

  const removeStage = (index: number) => {
    if (stages.length > 1) {
      const updatedStages = stages.filter((_, i) => i !== index);
      onChange(updatedStages);
    }
  };

  const moveStage = (fromIndex: number, toIndex: number) => {
    const updatedStages = [...stages];
    const [movedStage] = updatedStages.splice(fromIndex, 1);
    updatedStages.splice(toIndex, 0, movedStage);
    onChange(updatedStages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pipeline Stages</CardTitle>
        <p className="text-sm text-gray-600">
          Define the stages candidates will move through in your hiring process
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-gray-500">Display Name</Label>
                <Input
                  value={stage.displayName}
                  onChange={(e) => updateStage(index, 'displayName', e.target.value)}
                  placeholder="e.g., Applied"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs text-gray-500">Internal Name</Label>
                <Input
                  value={stage.name}
                  onChange={(e) => updateStage(index, 'name', e.target.value)}
                  placeholder="e.g., applied"
                  className="text-sm font-mono"
                />
              </div>
              
              <div>
                <Label className="text-xs text-gray-500">Color</Label>
                <select
                  value={stage.color}
                  onChange={(e) => updateStage(index, 'color', e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                >
                  {defaultColors.map(color => (
                    <option key={color} value={color}>
                      {colorLabels[color as keyof typeof colorLabels]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={`w-6 h-6 rounded ${stage.color} border`} />
            
            {stages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeStage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={addStage}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Stage
        </Button>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Preset Templates:</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([
                {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
                {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
                {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
                {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
                {"name": "sample_project_assigned", "displayName": "Sample Project Assigned", "color": "bg-orange-100"},
                {"name": "sample_project_submitted", "displayName": "Sample Project Submitted", "color": "bg-cyan-100"},
                {"name": "sample_project_reviewed", "displayName": "Sample Project Reviewed", "color": "bg-indigo-100"},
                {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
                {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
              ])}
            >
              Video Editor Template
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([
                {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
                {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
                {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
                {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
                {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
                {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
              ])}
            >
              Standard Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
