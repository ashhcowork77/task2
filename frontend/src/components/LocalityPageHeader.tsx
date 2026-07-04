'use client';

import { MapPin, Search, Home, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LocalityPageHeaderProps {
  locality: string;
  city: string;
  description: string;
  stats: {
    properties: number;
    avgPrice: string;
    trending: string;
  };
}

export function LocalityPageHeader({
  locality,
  city,
  description,
  stats,
}: LocalityPageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V0h32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <a href="/" className="transition-colors hover:text-white">
            Home
          </a>
          <span>/</span>
          <a href="/property-in" className="transition-colors hover:text-white">
            Locations
          </a>
          <span>/</span>
          <span className="text-white">{locality}</span>
        </nav>

        {/* Main Heading */}
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-blue-400">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              {city}, India
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Properties in <span className="text-blue-400">{locality}</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            {description}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
              <Home className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.properties}+</p>
              <p className="text-sm text-gray-400">Properties Listed</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgPrice}</p>
              <p className="text-sm text-gray-400">Average Price</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
              <TrendingUp className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.trending}</p>
              <p className="text-sm text-gray-400">Market Status</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-10">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${locality}...`}
              className="w-full rounded-xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-white placeholder-gray-400 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Popular:</span>
          {['2 BHK', '3 BHK', 'Villa', 'Apartment', 'Ready to Move'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                searchQuery === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="pointer-events-none absolute -bottom-px left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </header>
  );
}
