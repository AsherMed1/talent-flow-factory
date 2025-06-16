
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { useJobRoles } from '@/hooks/useJobRoles';
import { Link } from 'react-router-dom';

export const PublicJobBoard = () => {
  const { data: roles, isLoading } = useJobRoles();

  const activeRoles = roles?.filter(role => role.status === 'active') || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-600">Loading available positions...</p>
          </div>
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're looking for talented individuals to help us connect patients with quality healthcare providers. 
            Explore our open positions and apply today!
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {activeRoles.length > 0 ? (
            activeRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{role.name}</CardTitle>
                      <p className="text-gray-600 mt-2">{role.description}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Open
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Remote</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Flexible Hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Competitive Pay</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">What We're Looking For:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {role.name.includes('Appointment') && (
                        <>
                          <li>Excellent communication skills</li>
                          <li>Experience in customer service or sales (preferred)</li>
                          <li>Reliable internet connection and quiet workspace</li>
                          <li>Ability to work independently</li>
                        </>
                      )}
                      {role.name.includes('Virtual') && (
                        <>
                          <li>Strong organizational and administrative skills</li>
                          <li>Proficiency with digital tools and software</li>
                          <li>Detail-oriented with excellent time management</li>
                          <li>Previous virtual assistant experience preferred</li>
                        </>
                      )}
                      {role.name.includes('Sales') && (
                        <>
                          <li>Proven sales experience and track record</li>
                          <li>Strong closing and objection handling skills</li>
                          <li>Self-motivated with results-driven mindset</li>
                          <li>Experience with healthcare or service industries preferred</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">What We Offer:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Competitive compensation</li>
                      <li>Flexible remote work environment</li>
                      <li>Performance-based bonuses</li>
                      <li>Professional development opportunities</li>
                      <li>Supportive team environment</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Link to={`/apply/${role.id}`}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        Apply for this Position
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Positions</h3>
                <p className="text-gray-600">
                  We don't have any open positions at the moment, but we're always looking for great talent. 
                  Check back soon or reach out to us directly!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About These Positions?</h3>
            <p className="text-gray-600 mb-4">
              We're here to help! If you have any questions about our open positions or the application process, 
              don't hesitate to reach out.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium">careers@patientpromarketing.com</span>
              </p>
              <p className="text-sm text-gray-600">
                We typically respond within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
