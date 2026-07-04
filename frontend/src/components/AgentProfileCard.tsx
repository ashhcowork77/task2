'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, ShieldCheck, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CallButton } from './CallButton';
import { WhatsAppDirectButton } from './WhatsAppDirectButton';

interface AgentProfileCardProps {
  agent: {
    id: string;
    name: string;
    photo?: string;
    reraId?: string;
    yearsExperience?: number;
    specialization?: string[];
    serviceAreas?: string[];
    agency?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    rating?: number;
    stats?: {
      propertiesSold?: number;
      happyClients?: number;
    };
  };
  variant?: 'compact' | 'full' | 'minimal';
  showContact?: boolean;
  className?: string;
}

export function AgentProfileCard({
  agent,
  variant = 'compact',
  showContact = true,
  className,
}: AgentProfileCardProps) {
  const profileUrl = `/agents/profile/${agent.id}`;

  // Compact variant - for cards and listings
  if (variant === 'compact') {
    return (
      <div className={cn('group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md', className)}>
        <div className="flex items-center gap-4 p-4">
          {/* Photo */}
          <Link href={profileUrl} className="flex-shrink-0">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-100">
              {agent.photo ? (
                <Image
                  src={agent.photo}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100 text-xl font-medium text-gray-400">
                  {agent.name.charAt(0)}
                </div>
              )}
            </div>
          </Link>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <Link href={profileUrl} className="block">
              <h3 className="truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {agent.name}
              </h3>
            </Link>
            {agent.agency && (
              <p className="truncate text-sm text-gray-500">{agent.agency}</p>
            )}
            {agent.reraId && (
              <div className="mt-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-green-500" />
                <span className="text-xs text-gray-400">RERA Verified</span>
              </div>
            )}
          </div>

          {/* Rating */}
          {agent.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-900">{agent.rating}</span>
            </div>
          )}
        </div>

        {/* Specializations */}
        {agent.specialization && agent.specialization.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex flex-wrap gap-1">
              {agent.specialization.slice(0, 3).map((spec) => (
                <span
                  key={spec}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {agent.stats && (agent.stats.propertiesSold || agent.stats.happyClients) && (
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex gap-4 text-sm">
              {agent.stats.propertiesSold && (
                <div>
                  <span className="font-semibold text-gray-900">{agent.stats.propertiesSold}+</span>
                  <span className="text-gray-500"> sold</span>
                </div>
              )}
              {agent.stats.happyClients && (
                <div>
                  <span className="font-semibold text-gray-900">{agent.stats.happyClients}+</span>
                  <span className="text-gray-500"> happy</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Actions */}
        {showContact && (agent.phone || agent.whatsapp) && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-2">
              {agent.phone && (
                <CallButton
                  phoneNumber={agent.phone}
                  source="agent_card"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                />
              )}
              {agent.whatsapp && (
                <WhatsAppDirectButton
                  phoneNumber={agent.whatsapp}
                  source="agent_card"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant - for detailed views
  if (variant === 'full') {
    return (
      <div className={cn('overflow-hidden rounded-2xl bg-white shadow-sm', className)}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <div className="flex items-center gap-4">
            <Link href={profileUrl}>
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white/20">
                {agent.photo ? (
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-200 text-2xl font-medium text-gray-400">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>
            </Link>
            <div className="text-white">
              <Link href={profileUrl}>
                <h3 className="text-xl font-bold transition-colors hover:text-blue-300">
                  {agent.name}
                </h3>
              </Link>
              {agent.agency && <p className="mt-1 text-gray-300">{agent.agency}</p>}
              <div className="mt-2 flex items-center gap-2">
                {agent.reraId && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-300">
                    <ShieldCheck className="h-3 w-3" />
                    RERA Verified
                  </span>
                )}
                {agent.rating && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                    <Star className="h-3 w-3 fill-current" />
                    {agent.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Specializations */}
          {agent.specialization && agent.specialization.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">Specializations</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {agent.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Service Areas */}
          {agent.serviceAreas && agent.serviceAreas.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">Service Areas</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {agent.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    <MapPin className="h-3 w-3" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {agent.stats && (
            <div className="mb-6 grid grid-cols-2 gap-4">
              {agent.stats.propertiesSold && (
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{agent.stats.propertiesSold}+</p>
                  <p className="text-sm text-gray-500">Properties Sold</p>
                </div>
              )}
              {agent.stats.happyClients && (
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{agent.stats.happyClients}+</p>
                  <p className="text-sm text-gray-500">Happy Clients</p>
                </div>
              )}
            </div>
          )}

          {/* Contact */}
          {showContact && (
            <div className="space-y-3">
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
              )}
              {agent.whatsapp && (
                <WhatsAppDirectButton
                  phoneNumber={agent.whatsapp}
                  source="agent_card"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Minimal variant - just photo and name
  return (
    <div className={cn('group flex items-center gap-3', className)}>
      <Link href={profileUrl} className="flex-shrink-0">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200">
          {agent.photo ? (
            <Image
              src={agent.photo}
              alt={agent.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-400">
              {agent.name.charAt(0)}
            </div>
          )}
        </div>
      </Link>
      <div className="min-w-0">
        <Link href={profileUrl}>
          <h4 className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
            {agent.name}
          </h4>
        </Link>
        {agent.yearsExperience && (
          <p className="text-xs text-gray-500">{agent.yearsExperience}+ years</p>
        )}
      </div>
    </div>
  );
}
