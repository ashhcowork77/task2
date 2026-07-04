'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSearchProps {
  className?: string;
}

/**
 * Hero search component with location and guest inputs
 * Client Component for interactivity
 */
export function HeroSearch({ className }: HeroSearchProps) {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (guests > 1) params.set('guests', guests.toString());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section
      className={cn(
        'relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 md:py-24',
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find Your Perfect Short-Let
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Discover unique properties for your next getaway. Book directly with local hosts
            for authentic experiences.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-2 md:p-3"
        >
          <div className="flex flex-col md:flex-row gap-2">
            {/* Location Input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Guests Input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <label className="flex-1">
                <span className="sr-only">Number of guests</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-transparent outline-none text-gray-900 cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="text-blue-100 text-sm">Popular:</span>
          {['Mumbai', 'Goa', 'Bangalore', 'Pune'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setLocation(city);
                const params = new URLSearchParams();
                params.set('location', city);
                if (guests > 1) params.set('guests', guests.toString());
                router.push(`/properties?${params.toString()}`);
              }}
              className="px-3 py-1 text-sm text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
