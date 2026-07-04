'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Phone,
  Mail,
  MousePointerClick,
  Clock,
  Building2,
  Globe,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, className }: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={cn('bg-white p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
              {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-green-600',
                  isNegative && 'text-red-600',
                  !isPositive && !isNegative && 'text-gray-500'
                )}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="rounded-lg bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

interface LeadFunnelStep {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

function LeadFunnel({ data }: { data: LeadFunnelStep[] }) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="space-y-3">
      {data.map((step) => (
        <div key={step.stage} className="relative">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{step.stage}</span>
            <span className="text-gray-500">{step.count} ({step.percentage}%)</span>
          </div>
          <div className="mt-1 h-3 w-full rounded-full bg-gray-100">
            <div
              className={cn('h-3 rounded-full transition-all', step.color)}
              style={{ width: `${(step.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface TrafficSourceData {
  source: string;
  visitors: number;
  percentage: number;
  leads: number;
  conversion: number;
}

function TrafficSourcesTable({ data }: { data: TrafficSourceData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 text-left text-sm font-medium text-gray-500">Source</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">Visitors</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">%</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">Leads</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">Conv.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row.source} className="text-sm">
              <td className="py-3 font-medium text-gray-900">{row.source}</td>
              <td className="py-3 text-right text-gray-600">{row.visitors.toLocaleString()}</td>
              <td className="py-3 text-right text-gray-600">{row.percentage}%</td>
              <td className="py-3 text-right text-gray-600">{row.leads}</td>
              <td className="py-3 text-right">
                <span className={cn(
                  'font-medium',
                  row.conversion >= 5 ? 'text-green-600' : 'text-gray-600'
                )}>
                  {row.conversion}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TopLocalityData {
  locality: string;
  properties: number;
  views: number;
  leads: number;
  avgPrice: string;
}

function TopLocalitiesTable({ data }: { data: TopLocalityData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 text-left text-sm font-medium text-gray-500">Locality</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">Properties</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">Views</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">Leads</th>
            <th className="py-3 text-right text-sm font-medium text-gray-500">Avg Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row.locality} className="text-sm">
              <td className="py-3 font-medium text-gray-900">{row.locality}</td>
              <td className="py-3 text-right text-gray-600">{row.properties}</td>
              <td className="py-3 text-right text-gray-600">{row.views.toLocaleString()}</td>
              <td className="py-3 text-right text-gray-600">{row.leads}</td>
              <td className="py-3 text-right text-gray-600">{row.avgPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PropertyStatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

function PropertyStatusBreakdown({ data }: { data: PropertyStatusData[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-4">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
        {data.map((item) => (
          <div
            key={item.status}
            className={item.color}
            style={{ width: `${(item.count / total) * 100}%` }}
            title={`${item.status}: ${item.count}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div className={cn('h-3 w-3 rounded-full', item.color.replace('bg-', 'bg-'))} />
            <div>
              <p className="text-sm font-medium text-gray-700">{item.status}</p>
              <p className="text-xs text-gray-500">{item.count} ({item.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LeadSourceBreakdown {
  source: string;
  count: number;
  color: string;
}

function LeadSourcesPieChart({ data }: { data: LeadSourceBreakdown[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  let cumulativePercentage = 0;

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percentage = Math.round((item.count / total) * 100);
        const startPercentage = cumulativePercentage;
        cumulativePercentage += percentage;

        return (
          <div key={item.source} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('h-3 w-3 rounded-full', item.color)} />
              <span className="text-sm font-medium text-gray-700">{item.source}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn('h-2 rounded-full', item.color.replace('bg-', 'bg-'))}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-gray-500">{percentage}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type DateRange = '7d' | '30d' | '90d' | '12m';

const MOCK_METRICS = {
  views: { value: '24,531', change: 12.5 },
  leads: { value: '1,847', change: 8.3 },
  calls: { value: '423', change: -2.1 },
  emails: { value: '312', change: 5.7 },
  avgResponseTime: { value: '2.4 hrs', change: -15.2 },
  conversionRate: { value: '7.5%', change: 1.2 },
};

const MOCK_LEAD_FUNNEL: LeadFunnelStep[] = [
  { stage: 'New Inquiry', count: 1847, percentage: 100, color: 'bg-blue-500' },
  { stage: 'Contacted', count: 1423, percentage: 77, color: 'bg-blue-400' },
  { stage: 'Qualified', count: 892, percentage: 48, color: 'bg-blue-300' },
  { stage: 'Site Visit', count: 445, percentage: 24, color: 'bg-blue-200' },
  { stage: 'Negotiation', count: 178, percentage: 10, color: 'bg-green-500' },
  { stage: 'Closed', count: 89, percentage: 5, color: 'bg-green-400' },
];

const MOCK_TRAFFIC_SOURCES: TrafficSourceData[] = [
  { source: 'Google Search', visitors: 8456, percentage: 34, leads: 523, conversion: 6.2 },
  { source: 'Direct', visitors: 5234, percentage: 21, leads: 412, conversion: 7.9 },
  { source: 'Social Media', visitors: 4123, percentage: 17, leads: 287, conversion: 7.0 },
  { source: 'Referral', visitors: 3456, percentage: 14, leads: 345, conversion: 10.0 },
  { source: 'Email Campaign', visitors: 2345, percentage: 10, leads: 198, conversion: 8.4 },
  { source: 'Paid Ads', visitors: 917, percentage: 4, leads: 82, conversion: 8.9 },
];

const MOCK_TOP_LOCALITIES: TopLocalityData[] = [
  { locality: 'Whitefield', properties: 45, views: 5234, leads: 234, avgPrice: '₹85L' },
  { locality: 'Electronic City', properties: 38, views: 4123, leads: 198, avgPrice: '₹62L' },
  { locality: 'HSR Layout', properties: 32, views: 3891, leads: 187, avgPrice: '₹78L' },
  { locality: 'Marathahalli', properties: 29, views: 3456, leads: 156, avgPrice: '₹72L' },
  { locality: 'Indiranagar', properties: 24, views: 2987, leads: 134, avgPrice: '₹1.2Cr' },
];

const MOCK_PROPERTY_STATUS: PropertyStatusData[] = [
  { status: 'Active', count: 156, percentage: 45, color: 'bg-green-500' },
  { status: 'Under Offer', count: 67, percentage: 19, color: 'bg-yellow-500' },
  { status: 'Sold', count: 89, percentage: 26, color: 'bg-gray-400' },
  { status: 'Off Market', count: 35, percentage: 10, color: 'bg-red-400' },
];

const MOCK_LEAD_SOURCES: LeadSourceBreakdown[] = [
  { source: 'Property Inquiry Form', count: 523, color: 'bg-blue-500' },
  { source: 'Phone Call', count: 412, color: 'bg-green-500' },
  { source: 'WhatsApp', count: 356, color: 'bg-emerald-500' },
  { source: 'Site Visit Request', count: 234, color: 'bg-purple-500' },
  { source: 'Callback Request', count: 189, color: 'bg-orange-500' },
  { source: 'Referral', count: 133, color: 'bg-pink-500' },
];

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your property performance and lead metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d', '12m'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                )}
              >
                {range === '7d' && '7 Days'}
                {range === '30d' && '30 Days'}
                {range === '90d' && '90 Days'}
                {range === '12m' && '12 Months'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            title="Property Views"
            value={MOCK_METRICS.views.value}
            change={MOCK_METRICS.views.change}
            changeLabel="vs last period"
            icon={Eye}
          />
          <MetricCard
            title="Total Leads"
            value={MOCK_METRICS.leads.value}
            change={MOCK_METRICS.leads.change}
            changeLabel="vs last period"
            icon={Users}
          />
          <MetricCard
            title="Phone Inquiries"
            value={MOCK_METRICS.calls.value}
            change={MOCK_METRICS.calls.change}
            changeLabel="vs last period"
            icon={Phone}
          />
          <MetricCard
            title="Email Inquiries"
            value={MOCK_METRICS.emails.value}
            change={MOCK_METRICS.emails.change}
            changeLabel="vs last period"
            icon={Mail}
          />
          <MetricCard
            title="Avg Response Time"
            value={MOCK_METRICS.avgResponseTime.value}
            change={MOCK_METRICS.avgResponseTime.change}
            changeLabel="vs last period"
            icon={Clock}
          />
          <MetricCard
            title="Conversion Rate"
            value={MOCK_METRICS.conversionRate.value}
            change={MOCK_METRICS.conversionRate.change}
            changeLabel="vs last period"
            icon={MousePointerClick}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lead Status Funnel */}
          <div className="bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Lead Status Funnel</h2>
            </div>
            <LeadFunnel data={MOCK_LEAD_FUNNEL} />
          </div>

          {/* Lead Source Breakdown */}
          <div className="bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Lead Sources</h2>
            </div>
            <LeadSourcesPieChart data={MOCK_LEAD_SOURCES} />
          </div>
        </div>

        {/* Traffic & Localities Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Traffic by Source */}
          <div className="bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Traffic by Source</h2>
            </div>
            <TrafficSourcesTable data={MOCK_TRAFFIC_SOURCES} />
          </div>

          {/* Top Localities */}
          <div className="bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Top Localities</h2>
            </div>
            <TopLocalitiesTable data={MOCK_TOP_LOCALITIES} />
          </div>
        </div>

        {/* Property Status */}
        <div className="bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Property Status Breakdown</h2>
          </div>
          <PropertyStatusBreakdown data={MOCK_PROPERTY_STATUS} />
        </div>
      </div>
    </div>
  );
}
