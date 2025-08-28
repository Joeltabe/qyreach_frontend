import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DatePicker } from '../../components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { AlertCircle, TrendingUp, TrendingDown, Mail, MousePointer, Eye, Zap, Calendar, Download, Filter } from 'lucide-react';

interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  emailsSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  spam: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  spamRate: number;
  sentDate: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED' | 'CANCELLED';
}

interface OverviewMetrics {
  totalCampaigns: number;
  totalEmailsSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
  averageDeliveryRate: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageBounceRate: number;
  averageUnsubscribeRate: number;
}

interface EngagementData {
  date: string;
  emails: number;
  opens: number;
  clicks: number;
  bounces: number;
}

interface TopPerformers {
  campaigns: Array<{
    id: string;
    name: string;
    openRate: number;
    clickRate: number;
  }>;
  subjects: Array<{
    subject: string;
    openRate: number;
    campaigns: number;
  }>;
}

const AnalyticsPage: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedCampaigns] = useState<string[]>([]);
  
  // State for different analytics data
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics | null>(null);
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetrics[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformers | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, timeframe, selectedCampaigns]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      // Fetch overview metrics
      const overviewResponse = await fetch('/api/analytics/overview', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          campaignIds: selectedCampaigns.length > 0 ? selectedCampaigns : undefined,
        }),
      });
      
      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        setOverviewMetrics(overviewData);
      }

      // Fetch campaign metrics
      const campaignResponse = await fetch('/api/analytics/campaigns', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          campaignIds: selectedCampaigns.length > 0 ? selectedCampaigns : undefined,
        }),
      });
      
      if (campaignResponse.ok) {
        const campaignData = await campaignResponse.json();
        setCampaignMetrics(campaignData);
      }

      // Fetch engagement trends
      const engagementResponse = await fetch('/api/analytics/engagement', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          groupBy: timeframe === '7d' ? 'day' : timeframe === '30d' ? 'day' : 'week',
          campaignIds: selectedCampaigns.length > 0 ? selectedCampaigns : undefined,
        }),
      });
      
      if (engagementResponse.ok) {
        const engagementData = await engagementResponse.json();
        setEngagementData(engagementData);
      }

      // Fetch top performers
      const performersResponse = await fetch('/api/analytics/top-performers', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          limit: 10,
        }),
      });
      
      if (performersResponse.ok) {
        const performersData = await performersResponse.json();
        setTopPerformers(performersData);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'pdf' | 'csv') => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          format,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          campaignIds: selectedCampaigns.length > 0 ? selectedCampaigns : undefined,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return (num * 100).toFixed(1) + '%';
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    description?: string;
  }> = ({ title, value, change, icon, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`text-xs flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(change).toFixed(1)}% from last period
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your email campaign performance and engagement metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => exportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Time Range:</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {timeframe === 'custom' && (
              <>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">From:</label>
                  <DatePicker
                    date={dateRange.from}
                    onDateChange={(date) => setDateRange(prev => ({ ...prev, from: date || prev.from }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">To:</label>
                  <DatePicker
                    date={dateRange.to}
                    onDateChange={(date) => setDateRange(prev => ({ ...prev, to: date || prev.to }))}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          {overviewMetrics && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Campaigns"
                value={formatNumber(overviewMetrics.totalCampaigns)}
                icon={<Mail />}
                description="Active campaigns in period"
              />
              <MetricCard
                title="Emails Sent"
                value={formatNumber(overviewMetrics.totalEmailsSent)}
                icon={<Zap />}
                description="Total emails delivered"
              />
              <MetricCard
                title="Avg. Open Rate"
                value={formatPercentage(overviewMetrics.averageOpenRate)}
                icon={<Eye />}
                description="Average across all campaigns"
              />
              <MetricCard
                title="Avg. Click Rate"
                value={formatPercentage(overviewMetrics.averageClickRate)}
                icon={<MousePointer />}
                description="Average across all campaigns"
              />
              <MetricCard
                title="Delivery Rate"
                value={formatPercentage(overviewMetrics.averageDeliveryRate)}
                icon={<TrendingUp />}
                description="Successfully delivered emails"
              />
              <MetricCard
                title="Bounce Rate"
                value={formatPercentage(overviewMetrics.averageBounceRate)}
                icon={<AlertCircle />}
                description="Emails that bounced"
              />
              <MetricCard
                title="Total Opens"
                value={formatNumber(overviewMetrics.totalOpened)}
                icon={<Eye />}
                description="Unique opens across campaigns"
              />
              <MetricCard
                title="Total Clicks"
                value={formatNumber(overviewMetrics.totalClicked)}
                icon={<MousePointer />}
                description="Unique clicks across campaigns"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Detailed metrics for each campaign in the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Campaign</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-right p-2">Sent</th>
                      <th className="text-right p-2">Delivered</th>
                      <th className="text-right p-2">Open Rate</th>
                      <th className="text-right p-2">Click Rate</th>
                      <th className="text-right p-2">Bounce Rate</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignMetrics.map((campaign) => (
                      <tr key={campaign.campaignId} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{campaign.campaignName}</td>
                        <td className="p-2">
                          <Badge 
                            variant={campaign.status === 'SENT' ? 'default' : 
                                   campaign.status === 'SENDING' ? 'secondary' : 
                                   campaign.status === 'SCHEDULED' ? 'outline' : 'destructive'}
                          >
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="text-right p-2">{formatNumber(campaign.emailsSent)}</td>
                        <td className="text-right p-2">{formatNumber(campaign.delivered)}</td>
                        <td className="text-right p-2">{formatPercentage(campaign.openRate)}</td>
                        <td className="text-right p-2">{formatPercentage(campaign.clickRate)}</td>
                        <td className="text-right p-2">{formatPercentage(campaign.bounceRate)}</td>
                        <td className="p-2">{new Date(campaign.sentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>
                Track how your audience engagement changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for chart - would integrate with a charting library like recharts */}
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Engagement chart would be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Email Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {engagementData.slice(0, 5).map((data, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{new Date(data.date).toLocaleDateString()}</span>
                      <span className="font-medium">{formatNumber(data.emails)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Opens</span>
                    <span className="font-medium">
                      {formatNumber(engagementData.reduce((sum, data) => sum + data.opens, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Clicks</span>
                    <span className="font-medium">
                      {formatNumber(engagementData.reduce((sum, data) => sum + data.clicks, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Bounces</span>
                    <span className="font-medium">
                      {formatNumber(engagementData.reduce((sum, data) => sum + data.bounces, 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Campaigns</CardTitle>
                <CardDescription>
                  Campaigns with highest engagement rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers?.campaigns.map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPercentage(campaign.clickRate)} CTR
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {formatPercentage(campaign.openRate)} Open Rate
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Subjects</CardTitle>
                <CardDescription>
                  Subject lines with highest open rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers?.subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{subject.subject}</p>
                        <Badge variant="outline">
                          {formatPercentage(subject.openRate)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Used in {subject.campaigns} campaign{subject.campaigns !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;