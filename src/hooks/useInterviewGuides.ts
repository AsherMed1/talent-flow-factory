import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InterviewStep {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'question' | 'task' | 'script';
  completed?: boolean;
}

interface InterviewGuide {
  id: string;
  jobRoleId: string;
  steps: InterviewStep[];
  stepNotes: Record<string, string>;
  completedSteps: string[];
}

// Default appointment setter guide
const appointmentSetterGuide: InterviewStep[] = [
  {
    id: 'intro',
    title: 'Introduction & Setup',
    content: 'Introduce yourself and your role. Ensure webcam is on for both parties. Ask candidate to turn on webcam if not already on.',
    type: 'instruction'
  },
  {
    id: 'candidate-background',
    title: 'Candidate Background',
    content: 'Ask them to talk a little about themselves and their previous experience.',
    type: 'question'
  },
  {
    id: 'company-overview',
    title: 'Company Overview',
    content: 'Explain what we do as a company and what their role will be.',
    type: 'instruction'
  },
  {
    id: 'wfh-requirements',
    title: 'Work From Home Requirements',
    content: 'Reiterate the following requirements:\n• Quality noise cancelling headset\n• Workplace free from background noise\n• Contingency plan for power/device/internet issues',
    type: 'instruction'
  },
  {
    id: 'speed-test',
    title: 'Internet Speed Test',
    content: 'Ask applicant to share screen and run speedtest using https://www.speedtest.net/\nRequired: Download 20mbps+ and Upload 10mbps+',
    type: 'task'
  },
  {
    id: 'dual-monitors',
    title: 'Dual Monitor Check',
    content: 'Applicant must have two monitors. Ask them to share screen and go to System>Display to show dual monitor setup.',
    type: 'task'
  },
  {
    id: 'interview-questions-cs',
    title: 'Interview Questions (CS Experience)',
    content: 'If candidate has Customer Service experience, ask:\n\n1. Can you provide an example of a time when you had to prioritize your work attendance over other commitments?\n\n2. How do you balance admitting mistakes while maintaining confidence?\n\n3. Describe a situation where you successfully handled a customer escalation.\n\n4. How do you feel when receiving critical feedback?',
    type: 'question'
  },
  {
    id: 'interview-questions-no-cs',
    title: 'Interview Questions (No CS Experience)',
    content: 'If candidate lacks CS experience, ask:\n\n1. How do you stay organized with multiple tasks and high volume work?\n\n2. How do you ensure consistent attendance and punctuality?\n\n3. How do you manage emotional reactions to feedback?\n\n4. Tell us about a time you received feedback about a mistake - how did you react?',
    type: 'question'
  },
  {
    id: 'feedback-test',
    title: 'Role Play & Feedback Test',
    content: 'Conduct the appointment setter role play using the provided script. Make it slightly uncomfortable with objections.\n\nAfter role play:\n1. Give direct feedback on improvements needed\n2. Repeat the mock call\n3. Assess if they incorporated feedback',
    type: 'script'
  },
  {
    id: 'schedule-confirmation',
    title: 'Schedule Confirmation',
    content: 'Confirm they can work the times specified in the application form.',
    type: 'instruction'
  },
  {
    id: 'operations-overview',
    title: 'Daily Operations',
    content: 'Explain day-to-day operations. Show them Slack, GHL, Hubstaff, etc.',
    type: 'instruction'
  },
  {
    id: 'payment-details',
    title: 'Payment Structure',
    content: 'Reconfirm payment rate and method:\n• Need Wise account\n• Bi-weekly pay (Monday-Sunday)\n• Invoice due Monday, pay Tuesday\n• Month 1: $800/month\n• Month 2+: $5/hour + $2/booked appointment',
    type: 'instruction'
  },
  {
    id: 'huddles',
    title: 'Team Huddles',
    content: 'Explain huddle schedule: 10 CST M-F and end of shift huddles.',
    type: 'instruction'
  },
  {
    id: 'next-steps',
    title: 'Next Steps (If Hired)',
    content: 'If moving forward:\n• Email with congratulations and system setup\n• 4-6 hour onboarding ($30 fixed rate, paid only if passed)\n• Trainer session after onboarding\n• Must message on Slack when training complete',
    type: 'instruction'
  },
  {
    id: 'final-questions',
    title: 'Final Questions',
    content: 'Ask if they have any questions about the role or company.',
    type: 'question'
  }
];

// Store guides in localStorage for persistence
const STORAGE_KEY = 'interview_guides';

const getStoredGuides = (): Record<string, InterviewStep[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setStoredGuides = (guides: Record<string, InterviewStep[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
  } catch (error) {
    console.error('Failed to save interview guides:', error);
  }
};

export const useInterviewGuides = (jobRoleId: string) => {
  const [guide, setGuide] = useState<InterviewGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuide();
  }, [jobRoleId]);

  const loadGuide = async () => {
    try {
      setLoading(true);
      
      // First try to load from stored guides
      const storedGuides = getStoredGuides();
      const customGuide = storedGuides[jobRoleId];
      
      let steps: InterviewStep[];
      
      if (customGuide && customGuide.length > 0) {
        // Use custom guide if available
        steps = customGuide;
      } else {
        // Fall back to default appointment setter guide
        steps = appointmentSetterGuide;
      }
      
      const guideData: InterviewGuide = {
        id: `guide-${jobRoleId}`,
        jobRoleId,
        steps: steps.map(step => ({ ...step, completed: false })),
        stepNotes: {},
        completedSteps: []
      };
      
      setGuide(guideData);
    } catch (error) {
      console.error('Error loading interview guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStepComplete = (stepId: string) => {
    if (!guide) return;
    
    const isCompleted = guide.completedSteps.includes(stepId);
    const newCompletedSteps = isCompleted 
      ? guide.completedSteps.filter(id => id !== stepId)
      : [...guide.completedSteps, stepId];
    
    setGuide({
      ...guide,
      completedSteps: newCompletedSteps,
      steps: guide.steps.map(step => ({
        ...step,
        completed: step.id === stepId ? !isCompleted : newCompletedSteps.includes(step.id)
      }))
    });
  };

  const updateStepNotes = (stepId: string, notes: string) => {
    if (!guide) return;
    
    setGuide({
      ...guide,
      stepNotes: {
        ...guide.stepNotes,
        [stepId]: notes
      }
    });
  };

  return {
    guide,
    loading,
    toggleStepComplete,
    updateStepNotes
  };
};

// Export functions for guide management
export const saveInterviewGuide = (jobRoleId: string, steps: InterviewStep[]) => {
  const guides = getStoredGuides();
  guides[jobRoleId] = steps;
  setStoredGuides(guides);
};

export const getInterviewGuide = (jobRoleId: string): InterviewStep[] | null => {
  const guides = getStoredGuides();
  return guides[jobRoleId] || null;
};

export const deleteInterviewGuide = (jobRoleId: string) => {
  const guides = getStoredGuides();
  delete guides[jobRoleId];
  setStoredGuides(guides);
};

export const getAllInterviewGuides = (): Record<string, InterviewStep[]> => {
  return getStoredGuides();
};
