
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const Analytics = () => {
  const funnelData = [
    { stage: 'Applied', count: 45, percentage: 100 },
    { stage: 'Application Started', count: 38, percentage: 84 },
    { stage: 'Reviewed', count: 28, percentage: 62 },
    { stage: 'Interview Scheduled', count: 15, percentage: 33 },
    { stage: 'Interview Completed', count: 12, percentage: 27 },
    { stage: 'Offers Sent', count: 6, percentage: 13 },
    { stage: 'Hired', count: 4, percentage: 9 },
  ];

  const sourceData = [
    { source: 'LinkedIn', candidates: 18, color: '#0077B5' },
    { source: 'Indeed', candidates: 12, color: '#2557A7' },
    { source: 'Direct', candidates: 8, color: '#6366F1' },
    { source: 'Referral', candidates: 5, color: '#10B981' },
    { source: 'Company Website', candidates: 2, color: '#F59E0B' },
  ];

  const timeToHireData = [
    { role: 'Appointment Setter', avgDays: 14, target: 10 },
    { role: 'Virtual Assistant', avgDays: 18, target: 15 },
    { role: 'Sales Closer', avgDays: 25, target: 20 },
  ];

  const monthlyHiringData = [
    { month: 'Jan', hired: 2, applications: 15 },
    { month: 'Feb', hired: 3, applications: 22 },
    { month: 'Mar', hired: 4, applications: 28 },
    { month: 'Apr', hired: 1, applications: 18 },
    { month: 'May', hired: 5, applications: 35 },
    { month: 'Jun', hired: 3, applications: 25 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">9.2%</div>
            <div className="text-sm text-gray-600">Overall Conversion Rate</div>
            <div className="text-xs text-green-600 mt-1">↑ 2.1% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">16 days</div>
            <div className="text-sm text-gray-600">Avg Time to Hire</div>
            <div className="text-xs text-red-600 mt-1">↑ 3 days from target</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">$1,200</div>
            <div className="text-sm text-gray-600">Cost per Hire</div>
            <div className="text-xs text-green-600 mt-1">↓ $300 from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">4.2/5</div>
            <div className="text-sm text-gray-600">Candidate Satisfaction</div>
            <div className="text-xs text-green-600 mt-1">↑ 0.3 from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="candidates"
                  label={({ source, candidates }) => `${source}: ${candidates}`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time to Hire by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeToHireData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgDays" fill="#3B82F6" name="Actual Days" />
                <Bar dataKey="target" fill="#E5E7EB" name="Target Days" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Hiring Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyHiringData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#8B5CF6" name="Applications" />
                <Line type="monotone" dataKey="hired" stroke="#10B981" name="Hired" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Role Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Total Applications</th>
                  <th className="text-left p-2">Interviews</th>
                  <th className="text-left p-2">Offers</th>
                  <th className="text-left p-2">Hired</th>
                  <th className="text-left p-2">Conversion Rate</th>
                  <th className="text-left p-2">Avg Time to Hire</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Appointment Setter</td>
                  <td className="p-2">24</td>
                  <td className="p-2">8</td>
                  <td className="p-2">4</td>
                  <td className="p-2">3</td>
                  <td className="p-2 text-green-600">12.5%</td>
                  <td className="p-2">14 days</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Virtual Assistant</td>
                  <td className="p-2">15</td>
                  <td className="p-2">5</td>
                  <td className="p-2">2</td>
                  <td className="p-2">1</td>
                  <td className="p-2 text-yellow-600">6.7%</td>
                  <td className="p-2">18 days</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Sales Closer</td>
                  <td className="p-2">6</td>
                  <td className="p-2">2</td>
                  <td className="p-2">0</td>
                  <td className="p-2">0</td>
                  <td className="p-2 text-red-600">0%</td>
                  <td className="p-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
