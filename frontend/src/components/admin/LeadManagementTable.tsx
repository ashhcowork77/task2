'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  ChevronDown,
  X,
  User,
  Home,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'property_inquiry' | 'whatsapp' | 'call' | 'callback_request' | 'referral' | 'organic';
  status: 'new' | 'contacted' | 'qualified' | 'site_visit' | 'negotiation' | 'closed_won' | 'closed_lost';
  type: 'buyer' | 'seller' | 'tenant' | 'investor';
  propertyReference?: string;
  message?: string;
  budget?: string;
  timeline?: string;
  assignedTo?: string;
  createdAt: string;
  lastContact?: string;
  notes: LeadNote[];
}

interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

interface LeadFilters {
  source: string[];
  status: string[];
  type: string[];
  search: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
}

const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    source: 'property_inquiry',
    status: 'qualified',
    type: 'buyer',
    propertyReference: '3BHK Villa in Whitefield',
    message: 'Looking for a spacious 3BHK villa in Whitefield with modern amenities.',
    budget: '₹1.5Cr - ₹2Cr',
    timeline: '1-3 months',
    assignedTo: 'Agent 1',
    createdAt: '2024-01-15T10:30:00Z',
    lastContact: '2024-01-18T14:00:00Z',
    notes: [
      { id: 'note-001', content: 'Pre-approved for home loan. Interested in ready-to-move-in properties.', createdAt: '2024-01-16T09:00:00Z', author: 'Agent 1' },
    ],
  },
  {
    id: 'lead-002',
    name: 'Rahul Mehta',
    email: 'rahul.m@company.com',
    phone: '+91 87654 32109',
    source: 'whatsapp',
    status: 'site_visit',
    type: 'investor',
    propertyReference: 'Commercial Space in HSR Layout',
    message: 'Looking for commercial property investment options with good rental yield.',
    budget: '₹50L - ₹80L',
    timeline: 'Immediately',
    assignedTo: 'Agent 2',
    createdAt: '2024-01-14T16:45:00Z',
    lastContact: '2024-01-19T11:30:00Z',
    notes: [],
  },
  {
    id: 'lead-003',
    name: 'Ananya Gupta',
    email: 'ananya.g@email.com',
    phone: '+91 76543 21098',
    source: 'call',
    status: 'new',
    type: 'tenant',
    propertyReference: '2BHK Apartment near Electronic City',
    message: 'Need a 2BHK apartment for family of 4 near Electronic City.',
    budget: '₹20K - ₹30K/month',
    timeline: 'This month',
    createdAt: '2024-01-20T08:15:00Z',
    notes: [],
  },
  {
    id: 'lead-004',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 65432 10987',
    source: 'callback_request',
    status: 'contacted',
    type: 'seller',
    propertyReference: 'Plot in Sarjapur Road',
    message: 'Want to sell a 2400 sqft residential plot.',
    budget: '₹85L',
    timeline: '3-6 months',
    assignedTo: 'Agent 1',
    createdAt: '2024-01-13T12:00:00Z',
    lastContact: '2024-01-17T10:00:00Z',
    notes: [
      { id: 'note-002', content: 'Owner is flexible on price. Need to schedule site visit.', createdAt: '2024-01-17T10:00:00Z', author: 'Agent 1' },
    ],
  },
  {
    id: 'lead-005',
    name: 'Kavitha Nair',
    email: 'kavitha.nair@email.com',
    phone: '+91 54321 09876',
    source: 'organic',
    status: 'negotiation',
    type: 'buyer',
    propertyReference: '4BHK Penthouse in Indiranagar',
    message: 'Interested in premium penthouse properties in Indiranagar.',
    budget: '₹3Cr+',
    timeline: 'Immediately',
    assignedTo: 'Agent 3',
    createdAt: '2024-01-10T09:30:00Z',
    lastContact: '2024-01-20T15:00:00Z',
    notes: [],
  },
  {
    id: 'lead-006',
    name: 'Arjun Reddy',
    email: 'arjun.reddy@email.com',
    phone: '+91 43210 98765',
    source: 'referral',
    status: 'closed_won',
    type: 'buyer',
    propertyReference: '3BHK Apartment in Koramangala',
    message: 'Referred by existing client. Looking for 3BHK in Koramangala.',
    budget: '₹1.2Cr',
    timeline: '1-3 months',
    assignedTo: 'Agent 2',
    createdAt: '2024-01-05T14:20:00Z',
    lastContact: '2024-01-19T16:00:00Z',
    notes: [
      { id: 'note-003', content: 'Deal closed! Successfully purchased 3BHK at Brigade Road.', createdAt: '2024-01-19T16:00:00Z', author: 'Agent 2' },
    ],
  },
  {
    id: 'lead-007',
    name: 'Meera Joshi',
    email: 'meera.j@email.com',
    phone: '+91 32109 87654',
    source: 'whatsapp',
    status: 'closed_lost',
    type: 'buyer',
    message: 'Looking for property in JP Nagar but budget was too low.',
    budget: '₹40L',
    timeline: 'Researching',
    createdAt: '2024-01-08T11:45:00Z',
    notes: [],
  },
  {
    id: 'lead-008',
    name: 'Suresh Kumar',
    email: 'suresh.k@email.com',
    phone: '+91 21098 76543',
    source: 'property_inquiry',
    status: 'qualified',
    type: 'seller',
    propertyReference: 'Independent House in Yelahanka',
    message: 'Want to sell 30-year old independent house, 4000 sqft built-up.',
    budget: '₹1.8Cr',
    timeline: '6+ months',
    createdAt: '2024-01-19T13:30:00Z',
    notes: [],
  },
];

const SOURCE_LABELS: Record<string, string> = {
  property_inquiry: 'Property Inquiry',
  whatsapp: 'WhatsApp',
  call: 'Phone Call',
  callback_request: 'Callback Request',
  referral: 'Referral',
  organic: 'Organic',
};

const SOURCE_COLORS: Record<string, string> = {
  property_inquiry: 'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
  call: 'bg-purple-100 text-purple-700',
  callback_request: 'bg-orange-100 text-orange-700',
  referral: 'bg-pink-100 text-pink-700',
  organic: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  site_visit: 'Site Visit',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  qualified: 'bg-green-100 text-green-700 border-green-200',
  site_visit: 'bg-purple-100 text-purple-700 border-purple-200',
  negotiation: 'bg-orange-100 text-orange-700 border-orange-200',
  closed_won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  closed_lost: 'bg-red-100 text-red-700 border-red-200',
};

const TYPE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  seller: 'Seller',
  tenant: 'Tenant',
  investor: 'Investor',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', STATUS_COLORS[status])}>
      {status === 'new' && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      {STATUS_LABELS[status]}
    </span>
  );
}

function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<LeadNote[]>(lead.notes);
  const [selectedStatus, setSelectedStatus] = useState(lead.status);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: LeadNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString(),
      author: 'Current User',
    };
    setNotes([...notes, note]);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
            <p className="mt-1 text-sm text-gray-500">Lead #{lead.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Contact Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{lead.phone}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{TYPE_LABELS[lead.type]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Source</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{SOURCE_LABELS[lead.source]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.budget || 'Not specified'}</p>
            </div>
          </div>

          {lead.propertyReference && (
            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
              <Home className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600">Property Interest</p>
                <p className="text-sm font-medium text-blue-900">{lead.propertyReference}</p>
              </div>
            </div>
          )}

          {/* Message */}
          {lead.message && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Initial Message</h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(lead.createdAt)}</p>
              </div>
            </div>
            {lead.lastContact && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(lead.lastContact)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Notes</h3>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg bg-amber-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-amber-700">{note.author}</span>
                    <span className="text-xs text-amber-600">{formatRelativeTime(note.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{note.content}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  rows={2}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-200 bg-white p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert(`Lead ${lead.id} status updated to: ${selectedStatus}`);
              onClose();
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export function LeadManagementTable() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);
  const [filters, setFilters] = useState<LeadFilters>({
    source: [],
    status: [],
    type: [],
    search: '',
    dateRange: 'all',
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone.includes(filters.search) ||
        lead.propertyReference?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Source filter
    if (filters.source.length > 0 && !filters.source.includes(lead.source)) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(lead.status)) {
      return false;
    }

    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(lead.type)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const leadDate = new Date(lead.createdAt);
      const now = new Date();
      if (filters.dateRange === 'today') {
        if (leadDate.toDateString() !== now.toDateString()) return false;
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (leadDate < weekAgo) return false;
      } else if (filters.dateRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (leadDate < monthAgo) return false;
      }
    }

    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 'Type', 'Property', 'Budget', 'Created'];
    const rows = filteredLeads.map((lead) => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      SOURCE_LABELS[lead.source],
      STATUS_LABELS[lead.status],
      TYPE_LABELS[lead.type],
      lead.propertyReference || '',
      lead.budget || '',
      lead.createdAt,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFilter = (filterType: keyof Pick<LeadFilters, 'source' | 'status' | 'type'>, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }));
  };

  const hasActiveFilters =
    filters.source.length > 0 || filters.status.length > 0 || filters.type.length > 0 || filters.dateRange !== 'all';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredLeads.length} of {leads.length} leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                showFilters || hasActiveFilters
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {filters.source.length + filters.status.length + filters.type.length + (filters.dateRange !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-4">
              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <div className="space-y-1">
                  {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.source.includes(value)}
                        onChange={() => toggleFilter('source', value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-1">
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(value)}
                        onChange={() => toggleFilter('status', value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="space-y-1">
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(value)}
                        onChange={() => toggleFilter('type', value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value as LeadFilters['dateRange'] }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
                {hasActiveFilters && (
                  <button
                    onClick={() => setFilters({ source: [], status: [], type: [], search: '', dateRange: 'all' })}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search by name, email, phone, or property..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lead
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.propertyReference || 'No property'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', SOURCE_COLORS[lead.source])}>
                        {SOURCE_LABELS[lead.source]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{TYPE_LABELS[lead.type]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatRelativeTime(lead.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}
