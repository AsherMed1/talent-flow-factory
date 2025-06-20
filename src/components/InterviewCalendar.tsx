import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, User, ExternalLink, Link, ChevronLeft, ChevronRight } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { format, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';

interface InterviewCalendarProps {
  applications: Application[];
  onSelectCandidate?: (candidateId: string) => void;
}

export const InterviewCalendar = ({ applications, onSelectCandidate }: InterviewCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const isMobile = useIsMobile();

  // Filter applications with scheduled interviews
  const interviewApplications = applications.filter(app => 
    ['interview_scheduled', 'interview_completed'].includes(app.status) && app.interview_date
  );

  // Get interviews for the selected date
  const selectedDateInterviews = interviewApplications.filter(app => 
    app.interview_date && isSameDay(parseISO(app.interview_date), selectedDate)
  );

  // Get dates that have interviews for calendar highlighting
  const interviewDates = interviewApplications
    .map(app => app.interview_date)
    .filter(Boolean)
    .map(date => parseISO(date));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'interview_completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatInterviewTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch {
      return 'Time TBD';
    }
  };

  const getMeetingLink = (application: Application) => {
    // Check GHL appointment data first
    if (application.ghl_appointment_data?.calendar?.address) {
      return application.ghl_appointment_data.calendar.address;
    }
    
    // Fallback to manual recording link if no GHL data
    return application.interview_recording_link;
  };

  const modifiers = {
    hasInterview: interviewDates
  };

  const modifiersStyles = {
    hasInterview: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: 'bold'
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Header with Date Navigation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <CardTitle className="text-lg">Interviews</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMobileCalendar(!showMobileCalendar)}
                className="text-sm"
              >
                {showMobileCalendar ? 'Hide Calendar' : 'Show Calendar'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Mobile Calendar Toggle */}
        {showMobileCalendar && (
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="w-full"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </CardContent>
          </Card>
        )}

        {/* Mobile Date Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const prevDay = new Date(selectedDate);
                  prevDay.setDate(prevDay.getDate() - 1);
                  setSelectedDate(prevDay);
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  {format(selectedDate, 'MMM d, yyyy')}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedDateInterviews.length} interview{selectedDateInterviews.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nextDay = new Date(selectedDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setSelectedDate(nextDay);
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Interview List */}
            <div className="space-y-3">
              {selectedDateInterviews.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No interviews scheduled</p>
                </div>
              ) : (
                selectedDateInterviews
                  .sort((a, b) => {
                    if (!a.interview_date || !b.interview_date) return 0;
                    return parseISO(a.interview_date).getTime() - parseISO(b.interview_date).getTime();
                  })
                  .map((application) => (
                    <div
                      key={application.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
                      onClick={() => onSelectCandidate?.(application.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-sm">
                              {application.candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">
                              {application.candidate.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {application.job_role?.name}
                            </div>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-blue-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {application.interview_date && formatInterviewTime(application.interview_date)}
                        </div>
                        
                        <div className="flex gap-2">
                          {getMeetingLink(application) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(getMeetingLink(application), '_blank');
                              }}
                              className="text-xs h-8 px-2"
                            >
                              <Link className="w-3 h-3 mr-1" />
                              Join
                            </Button>
                          )}
                          {application.job_role?.booking_link && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(application.job_role.booking_link, '_blank');
                              }}
                              className="text-xs h-8 px-2"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              GHL
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Interview Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className={cn("w-full pointer-events-auto")}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Legend:</strong>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Blue dates have scheduled interviews
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {selectedDateInterviews.length} interview{selectedDateInterviews.length !== 1 ? 's' : ''} scheduled
          </p>
        </CardHeader>
        <CardContent>
          {selectedDateInterviews.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-lg">No interviews scheduled</p>
              <p className="text-sm">Select a different date to view scheduled interviews</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDateInterviews
                .sort((a, b) => {
                  if (!a.interview_date || !b.interview_date) return 0;
                  return parseISO(a.interview_date).getTime() - parseISO(b.interview_date).getTime();
                })
                .map((application) => (
                  <div
                    key={application.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onSelectCandidate?.(application.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {application.candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {application.candidate.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {application.job_role?.name}
                          </div>
                          <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {application.interview_date && formatInterviewTime(application.interview_date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex gap-2">
                          {getMeetingLink(application) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(getMeetingLink(application), '_blank');
                              }}
                              className="text-xs"
                            >
                              <Link className="w-3 h-3 mr-1" />
                              Join Meeting
                            </Button>
                          )}
                          {application.job_role?.booking_link && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(application.job_role.booking_link, '_blank');
                              }}
                              className="text-xs"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              GHL
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional GoHighLevel webhook data if available */}
                    {application.ghl_appointment_data && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium text-gray-700">GHL Appointment Details:</div>
                        {application.ghl_appointment_data.calendarId && (
                          <div className="text-gray-600">Calendar ID: {application.ghl_appointment_data.calendarId}</div>
                        )}
                        {application.ghl_appointment_data.status && (
                          <div className="text-gray-600">GHL Status: {application.ghl_appointment_data.status}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
