
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, Users, Calendar } from 'lucide-react';

const QuickActions = memo(() => {
  const navigate = useNavigate();

  const handleCreateNewRole = () => {
    navigate('/', { state: { activeView: 'roles' } });
    // Set active view to roles in the parent component
    window.dispatchEvent(new CustomEvent('setActiveView', { detail: 'roles' }));
  };

  const handleAddCandidate = () => {
    navigate('/', { state: { activeView: 'import' } });
    // Set active view to import in the parent component
    window.dispatchEvent(new CustomEvent('setActiveView', { detail: 'import' }));
  };

  const handleScheduleInterview = () => {
    navigate('/', { state: { activeView: 'pipeline' } });
    // Set active view to pipeline in the parent component
    window.dispatchEvent(new CustomEvent('setActiveView', { detail: 'pipeline' }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleCreateNewRole}
            className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Create New Role</h3>
              <p className="text-sm text-gray-500">Set up a new hiring workflow</p>
            </div>
          </button>
          
          <button 
            onClick={handleAddCandidate}
            className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Add Candidate</h3>
              <p className="text-sm text-gray-500">Manually add a new applicant</p>
            </div>
          </button>
          
          <button 
            onClick={handleScheduleInterview}
            className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Schedule Interview</h3>
              <p className="text-sm text-gray-500">Book time with candidates</p>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
