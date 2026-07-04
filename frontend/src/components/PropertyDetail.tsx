import {
  Bath,
  Bed,
  Car,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  Home,
  MapPin,
  Maximize2,
  Phone,
  Ruler,
  Share2,
  Shield,
  Sofa,
  Star,
  Tv,
  Utensils,
  Users,
  Waves,
  Wind,
  Wifi,
} from 'lucide-react';
import Link from 'next/link';
import type { Property, PropertyMedia } from '@/types';
import InquiryForm from './InquiryForm';
import MobileFloatingContactBar from './MobileFloatingContactBar';
import { POIOverlay } from './poi/POIOverlay';
import { PropertyGallery } from './PropertyGallery';
import PropertyShareButtons from './PropertyShareButtons';
import AreaUnitConverter from './AreaUnitConverter';
import CallbackRequestForm from './CallbackRequestForm';

/** Supported amenity icon mapping */
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  internet: Wifi,
  'air conditioning': Wind,
  ac: Wind,
  'air conditioner': Wind,
  pool: Waves,
  swimming: Waves,
  kitchen: Utensils,
  cooking: Utensils,
  parking: Car,
  car: Car,
  tv: Tv,
  television: Tv,
  gym: Dumbbell,
  fitness: Dumbbell,
  exercise: Dumbbell,
  security: Shield,
};

function getAmenityIcon(amenity: string) {
  const normalized = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (normalized.includes(key)) return icon;
  }
  return CheckCircle2;
}

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatBHKType(bhkType?: string) {
  if (!bhkType) return '';
  return bhkType
    .replace(/_/g, ' ')
    .replace('plus', '+')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatFurnishingStatus(status?: string) {
  if (!status) return '';
  return status.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface PropertyDetailProps {
  property: Property;
  similarProperties?: Property[];
}

export function PropertyDetail({ property, similarProperties = [] }: PropertyDetailProps) {
  const images = property.gallery?.length
    ? property.gallery.map((img: PropertyMedia) => ({ url: img.url, alt: img.alt }))
    : property.featuredImage
      ? [{ url: property.featuredImage.url, alt: property.featuredImage.alt }]
      : [];

  const locationString = [property.locality, property.address?.city].filter(Boolean).join(', ');

  const priceLabel = property.priceLabel
    ?? (property.nightlyPrice
      ? `${formatCurrency(property.nightlyPrice, property.currency)} / night`
      : property.salePrice
        ? formatCurrency(property.salePrice, property.currency)
        : property.monthlyRent
          ? `${formatCurrency(property.monthlyRent, property.currency)} / month`
          : null);

  // Agent contact info from property
  const agentPhone = property.agent?.phone;
  const agentWhatsApp = property.agent?.whatsapp ?? property.leadRouting?.whatsappNumber;
  const agentName = property.agent?.name;

  // Specs grid data
  const specs = [
    property.bedrooms !== undefined && { icon: Bed, label: 'Bedrooms', value: String(property.bedrooms) },
    property.bathrooms !== undefined && { icon: Bath, label: 'Bathrooms', value: String(property.bathrooms) },
    property.maxGuests !== undefined && { icon: Users, label: 'Max Guests', value: String(property.maxGuests) },
    property.floor?.current !== undefined && {
      icon: Ruler,
      label: 'Floor',
      value: property.floor.total
        ? `${property.floor.current} of ${property.floor.total}`
        : String(property.floor.current),
    },
    property.bhkType && { icon: Home, label: 'Type', value: formatBHKType(property.bhkType) },
    property.furnishingStatus && {
      icon: Sofa,
      label: 'Furnishing',
      value: formatFurnishingStatus(property.furnishingStatus),
    },
    property.propertyType && {
      icon: Home,
      label: 'Property Type',
      value: property.propertyType.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase()),
    },
    property.area?.carpetSqFt && {
      icon: Maximize2,
      label: 'Carpet Area',
      value: `${property.area.carpetSqFt.toLocaleString('en-IN')} sq ft`,
    },
    property.area?.builtUpSqFt && {
      icon: Maximize2,
      label: 'Built-up Area',
      value: `${property.area.builtUpSqFt.toLocaleString('en-IN')} sq ft`,
    },
    property.area?.plotSqFt && {
      icon: Maximize2,
      label: 'Plot Area',
      value: `${property.area.plotSqFt.toLocaleString('en-IN')} sq ft`,
    },
    property.facing && { icon: MapPin, label: 'Facing', value: property.facing.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase()) },
    property.reraId && { icon: Shield, label: 'RERA ID', value: property.reraId },
    property.possessionStatus && {
      icon: ExternalLink,
      label: 'Possession',
      value: property.possessionStatus.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
    },
  ].filter(Boolean) as Array<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string }>;

  return (
    <>
      <div className="space-y-10">
        {/* Gallery */}
        <section aria-label="Property images">
          <PropertyGallery images={images} title={property.title} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
            <section className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Tags / Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {property.bhkType && (
                      <span className="px-3 py-1 bg-[#A1834C]/10 text-[#A1834C] text-xs font-semibold rounded-full uppercase tracking-wide">
                        {formatBHKType(property.bhkType)}
                      </span>
                    )}
                    {property.furnishingStatus && (
                      <span className="px-3 py-1 bg-[#141414]/5 text-[#141414] text-xs font-semibold rounded-full uppercase tracking-wide">
                        {formatFurnishingStatus(property.furnishingStatus)}
                      </span>
                    )}
                    {property.possessionStatus && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                        {property.possessionStatus.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-[#141414] leading-tight tracking-tight">
                    {property.title}
                  </h1>

                  {locationString && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#6f6f6f]">
                      <MapPin className="h-4 w-4 text-[#A1834C] shrink-0" />
                      {locationString}
                    </p>
                  )}
                </div>

                {/* Share Button */}
                <PropertyShareButtons
                  propertyId={property.id}
                  propertyTitle={property.title}
                  showQR={false}
                />
              </div>
            </section>

            {/* Specs Grid */}
            {specs.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A1834C]/10">
                        <Icon className="h-4 w-4 text-[#A1834C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#A5A5A5]">{label}</p>
                        <p className="text-sm font-medium text-[#141414]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Area Unit Converter */}
            {(property.area?.carpetSqFt || property.area?.builtUpSqFt || property.area?.plotSqFt) && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">Area Conversion</h2>
                <div className="max-w-sm">
                  <AreaUnitConverter />
                </div>
              </section>
            )}

            {/* Description */}
            {property.description && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">About this property</h2>
                <p className="text-[#6f6f6f] leading-7 whitespace-pre-line">{property.description}</p>
              </section>
            )}

            {/* Property Highlights */}
            {property.propertyHighlights && property.propertyHighlights.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">Highlights</h2>
                <ul className="space-y-2">
                  {property.propertyHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#6f6f6f]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A1834C]" />
                      <span>
                        {h.title && <strong className="text-[#141414]">{h.title}: </strong>}
                        {h.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((amenity: string, idx: number) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-[#141414]"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#A1834C]" />
                        <span className="capitalize">{amenity.replace(/_/g, ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* House Rules */}
            {property.houseRules && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">House Rules</h2>
                <div className="rounded-lg border border-black/10 bg-[#F8F8F8] p-5">
                  <p className="whitespace-pre-line text-sm text-[#6f6f6f]">{property.houseRules}</p>
                </div>
              </section>
            )}

            {/* Pricing Details */}
            {(property.nightlyPrice || property.salePrice || property.monthlyRent) && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">Pricing</h2>
                <div className="space-y-3 rounded-lg border border-black/10 bg-white p-5">
                  {property.nightlyPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6f6f6f]">Nightly Rate</span>
                      <span className="font-medium text-[#141414]">
                        {formatCurrency(property.nightlyPrice, property.currency)}
                      </span>
                    </div>
                  )}
                  {property.salePrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6f6f6f]">Sale Price</span>
                      <span className="font-medium text-[#141414]">
                        {formatCurrency(property.salePrice, property.currency)}
                      </span>
                    </div>
                  )}
                  {property.monthlyRent && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6f6f6f]">Monthly Rent</span>
                      <span className="font-medium text-[#141414]">
                        {formatCurrency(property.monthlyRent, property.currency)}
                      </span>
                    </div>
                  )}
                  {property.minNights && (
                    <div className="flex items-center justify-between border-t border-black/10 pt-3">
                      <span className="text-sm text-[#6f6f6f]">Minimum Stay</span>
                      <span className="text-sm text-[#141414]">{property.minNights} night{property.minNights > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.maintenanceCharges && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6f6f6f]">Maintenance</span>
                      <span className="text-sm text-[#141414]">
                        {formatCurrency(property.maintenanceCharges, property.currency)}/mo
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Agent Info */}
            {agentName && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">Listed by</h2>
                <div className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4">
                  {property.agent?.headshot && (
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                      <img src={property.agent.headshot.url} alt={agentName} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-[#141414]">{agentName}</p>
                    {property.agent?.role && (
                      <p className="text-xs text-[#6f6f6f]">{property.agent.role}</p>
                    )}
                    {agentPhone && (
                      <a href={`tel:${agentPhone}`} className="mt-1 flex items-center gap-1.5 text-xs text-[#A1834C] hover:underline">
                        <Phone className="h-3 w-3" />
                        {agentPhone}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#141414]">Similar Properties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarProperties.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/properties/${p.slug || p.id}`}
                      className="group flex gap-3 rounded-lg border border-black/10 bg-white p-3 transition-colors hover:border-[#A1834C]"
                    >
                      {p.featuredImage?.url && (
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-neutral-200">
                          <img src={p.featuredImage.url} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#141414] group-hover:text-[#A1834C]">
                          {p.title}
                        </p>
                        {p.locality && <p className="text-xs text-[#6f6f6f]">{p.locality}</p>}
                        {p.nightlyPrice && (
                          <p className="mt-1 text-sm font-semibold text-[#141414]">
                            {formatCurrency(p.nightlyPrice, p.currency)}/night
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price */}
            {priceLabel && (
              <div className="rounded-lg bg-[#A1834C] p-5 text-white">
                <p className="text-sm font-medium text-white/70">From</p>
                <p className="text-3xl font-bold tracking-tight">{priceLabel}</p>
              </div>
            )}

            {/* Inquiry Form */}
            <InquiryForm
              propertyId={property.id}
              propertyTitle={property.title}
              nightlyPrice={property.nightlyPrice}
            />

            {/* Callback Request */}
            <CallbackRequestForm propertyId={property.id} propertyTitle={property.title} />

            {/* Agent Contact Buttons */}
            {(agentPhone || agentWhatsApp) && (
              <div className="space-y-3">
                {agentPhone && (
                  <a
                    href={`tel:${agentPhone}`}
                    className="flex w-full items-center justify-center gap-2 bg-[#141414] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A1834C]"
                  >
                    <Phone className="h-4 w-4" />
                    Call {agentName ?? 'Agent'}
                  </a>
                )}
                {agentWhatsApp && (
                  <a
                    href={`https://wa.me/${agentWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in "${property.title}" (ID: ${property.id}). Please share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Agent
                  </a>
                )}
              </div>
            )}

            {/* Map */}
            {property.geolocation && (
              <POIOverlay
                propertyId={property.id}
                lat={property.geolocation.lat}
                lng={property.geolocation.lng}
              />
            )}

            {/* Share + QR */}
            <PropertyShareButtons
              propertyId={property.id}
              propertyTitle={property.title}
              showQR={true}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Contact Bar */}
      <MobileFloatingContactBar
        phoneNumber={agentPhone}
        whatsappNumber={agentWhatsApp}
        propertyId={property.id}
        propertyTitle={property.title}
      />
    </>
  );
}
