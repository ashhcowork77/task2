'use client';

import { useFilterStore } from '@/lib/stores/filterStore';
import { PriceRangeSlider } from './PriceRangeSlider';
import { LocalityAutocomplete } from './LocalityAutocomplete';
import { BedDouble, Home, Sofa, PawPrint, Users, Compass, ChevronDown, CheckSquare, Calendar, Eye, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const BHK_OPTIONS = [
  { value: '1_bhk', label: '1 BHK' },
  { value: '2_bhk', label: '2 BHK' },
  { value: '3_bhk', label: '3 BHK' },
  { value: '4_bhk', label: '4 BHK' },
  { value: '4_plus_bhk', label: '4+ BHK' },
  { value: '5_bhk', label: '5 BHK' },
  { value: 'studio', label: 'Studio' },
  { value: 'penthouse', label: 'Penthouse' },
];

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
  { value: 'farmhouse', label: 'Farmhouse' },
  { value: 'plot', label: 'Plot' },
  { value: 'office', label: 'Office Space' },
  { value: 'retail', label: 'Retail' },
];

const FURNISHING_OPTIONS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi_furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];

const POSSESSION_OPTIONS = [
  { value: 'ready_to_move', label: 'Ready to Move' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'new_launch', label: 'New Launch' },
  { value: 'resale', label: 'Resale' },
];

const FACING_OPTIONS = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'north_east', label: 'North-East' },
  { value: 'north_west', label: 'North-West' },
  { value: 'south_east', label: 'South-East' },
  { value: 'south_west', label: 'South-West' },
];

const LISTING_TYPE_OPTIONS = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'sale_or_rent', label: 'Both' },
];

const AMENITY_OPTIONS = [
  { value: 'wifi', label: 'WiFi' },
  { value: 'ac', label: 'Air Conditioning' },
  { value: 'pool', label: 'Pool' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'parking', label: 'Parking' },
  { value: 'tv', label: 'TV' },
  { value: 'gym', label: 'Gym' },
  { value: 'beach_access', label: 'Beach Access' },
  { value: 'hot_tub', label: 'Hot Tub' },
  { value: 'washer', label: 'Washer' },
  { value: 'dryer', label: 'Dryer' },
  { value: 'security', label: '24/7 Security' },
  { value: 'lift', label: 'Lift/Elevator' },
  { value: 'garden', label: 'Garden' },
  { value: 'power_backup', label: 'Power Backup' },
];

interface FilterSidebarProps {
  className?: string;
}

interface FilterSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ icon: Icon, title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </h3>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

/**
 * Main filter sidebar component
 * Provides all property filter controls
 */
export function FilterSidebar({ className }: FilterSidebarProps) {
  const {
    bhkTypes,
    toggleBHK,
    propertyTypes,
    togglePropertyType,
    furnishing,
    setFurnishing,
    amenities,
    toggleAmenity,
    petPolicy,
    setPetPolicy,
    tenantPreference,
    setTenantPreference,
    facing,
    setFacing,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
  } = useFilterStore();

  // Local state for additional filters
  const [listingType, setListingType] = useState<string[]>([]);
  const [possession, setPossession] = useState<string[]>([]);
  const [reraVerified, setReraVerified] = useState(false);
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');

  const toggleListingType = (type: string) => {
    setListingType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const togglePossession = (status: string) => {
    setPossession(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <aside className={cn('space-y-4 p-4 bg-white rounded-lg shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {(bhkTypes.length > 0 || propertyTypes.length > 0 || amenities.length > 0) && (
          <button
            type="button"
            onClick={() => {
              // Clear all filters logic would go here
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* BHK Type */}
      <FilterSection icon={BedDouble} title="BHK Type">
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleBHK(opt.value)}
              className={cn(
                'px-3 py-1 text-sm rounded-full border transition-colors',
                bhkTypes.includes(opt.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Listing Type */}
      <FilterSection icon={CheckSquare} title="Listing Type" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {LISTING_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleListingType(opt.value)}
              className={cn(
                'px-3 py-1 text-sm rounded-full border transition-colors',
                listingType.includes(opt.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection icon={Home} title="Property Type">
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => togglePropertyType(opt.value)}
              className={cn(
                'px-3 py-1 text-sm rounded-full border transition-colors',
                propertyTypes.includes(opt.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection icon={Compass} title="Budget Range">
        <PriceRangeSlider />
      </FilterSection>

      {/* Area Range */}
      <FilterSection icon={Ruler} title="Area (sq.ft)" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={areaMin}
            onChange={(e) => setAreaMin(e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 border rounded-md text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={areaMax}
            onChange={(e) => setAreaMax(e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 border rounded-md text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </FilterSection>

      {/* Locality */}
      <FilterSection icon={Home} title="Locality">
        <LocalityAutocomplete />
      </FilterSection>

      {/* Facing Direction */}
      <FilterSection icon={Eye} title="Facing Direction" defaultOpen={false}>
        <div className="grid grid-cols-4 gap-2">
          {FACING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFacing(facing === opt.value ? null : opt.value)}
              className={cn(
                'px-2 py-1.5 text-xs rounded border transition-colors',
                facing === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection icon={BedDouble} title="Bedrooms" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setBedrooms(bedrooms === num ? null : num)}
              className={cn(
                'px-4 py-2 text-sm rounded-lg border transition-colors',
                bedrooms === num
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection icon={Users} title="Bathrooms" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setBathrooms(bathrooms === num ? null : num)}
              className={cn(
                'px-4 py-2 text-sm rounded-lg border transition-colors',
                bathrooms === num
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Possession Status */}
      <FilterSection icon={Calendar} title="Possession Status" defaultOpen={false}>
        <div className="space-y-2">
          {POSSESSION_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={possession.includes(opt.value)}
                onChange={() => togglePossession(opt.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Furnishing */}
      <FilterSection icon={Sofa} title="Furnishing">
        <select
          value={furnishing ?? ''}
          onChange={(e) => setFurnishing(e.target.value || null)}
          className={cn(
            'w-full px-3 py-2 border rounded-md text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          )}
        >
          <option value="">Any</option>
          {FURNISHING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Amenities */}
      <FilterSection icon={Compass} title="Amenities">
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleAmenity(opt.value)}
              className={cn(
                'px-3 py-1 text-sm rounded-full border transition-colors',
                amenities.includes(opt.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* RERA Verified */}
      <FilterSection icon={CheckSquare} title="Verification" defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={reraVerified}
            onChange={(e) => setReraVerified(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700">RERA Verified Only</span>
        </label>
      </FilterSection>

      {/* Pet Policy */}
      <FilterSection icon={PawPrint} title="Pet Policy" defaultOpen={false}>
        <select
          value={petPolicy ?? ''}
          onChange={(e) => setPetPolicy(e.target.value || null)}
          className={cn(
            'w-full px-3 py-2 border rounded-md text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          )}
        >
          <option value="">Any</option>
          <option value="pets_allowed">Pets Allowed</option>
          <option value="pets_not_allowed">Pets Not Allowed</option>
          <option value="cats_only">Cats Only</option>
          <option value="dogs_only">Dogs Only</option>
        </select>
      </FilterSection>

      {/* Tenant Preference */}
      <FilterSection icon={Users} title="Guest Type" defaultOpen={false}>
        <select
          value={tenantPreference ?? ''}
          onChange={(e) => setTenantPreference(e.target.value || null)}
          className={cn(
            'w-full px-3 py-2 border rounded-md text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          )}
        >
          <option value="">Any</option>
          <option value="families">Families</option>
          <option value="couples">Couples</option>
          <option value="business_travelers">Business Travelers</option>
          <option value="anyone">Anyone</option>
        </select>
      </FilterSection>
    </aside>
  );
}
