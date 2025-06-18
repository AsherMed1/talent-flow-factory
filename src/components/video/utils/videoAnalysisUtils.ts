
export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'text-green-600 bg-green-100';
    case 'negative': return 'text-red-600 bg-red-100';
    default: return 'text-yellow-600 bg-yellow-100';
  }
};

export const getEngagementLevel = (level: number) => {
  if (level >= 80) return { label: 'High', color: 'text-green-600' };
  if (level >= 60) return { label: 'Medium', color: 'text-yellow-600' };
  return { label: 'Low', color: 'text-red-600' };
};

export const getRecordingUrl = (application: any) => {
  if (application.interview_recording_link) return application.interview_recording_link;
  if (application.zoom_recording_url) return application.zoom_recording_url;
  if (application.zoom_recording_files?.[0]?.play_url) return application.zoom_recording_files[0].play_url;
  return null;
};
