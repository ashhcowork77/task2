import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyPopupProps {
  property: {
    id: string;
    title: string;
    nightlyPrice: number;
    currency: string;
    geolocation: { lat: number; lng: number };
    featuredImage?: { url: string };
  };
  onViewDetails?: () => void;
}

/**
 * Popup component for property marker clicks
 * Shows property details in the map popup
 */
export function PropertyPopup({ property, onViewDetails }: PropertyPopupProps) {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'INR') {
      return `Rs. ${price.toLocaleString('en-IN')}/night`;
    }
    return `${currency} ${price.toLocaleString()}/night`;
  };

  return (
    <div className="w-64 p-3">
      {/* Property Image */}
      {property.featuredImage?.url && (
        <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-gray-100">
          <img
            src={property.featuredImage.url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Property Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
        {property.title}
      </h3>

      {/* Price */}
      <div className="flex items-center gap-1 text-blue-600 font-medium mb-3">
        <span>{formatPrice(property.nightlyPrice, property.currency)}</span>
      </div>

      {/* Location */}
      <div className="flex items-start gap-1.5 text-gray-600 text-sm mb-3">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-1">
          {property.geolocation.lat.toFixed(4)}, {property.geolocation.lng.toFixed(4)}
        </span>
      </div>

      {/* View Details Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails?.();
        }}
        className={cn(
          'w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md',
          'hover:bg-blue-700 transition-colors'
        )}
      >
        View Details
      </button>
    </div>
  );
}
