import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ShieldCheck,
  Star,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
} from 'lucide-react';
import { CallButton } from '@/components/CallButton';
import { WhatsAppDirectButton } from '@/components/WhatsAppDirectButton';
import { AgentProfileCard } from '@/components/AgentProfileCard';

interface AgentProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock agent data - in production, fetch from Payload CMS
const MOCK_AGENTS: Record<string, {
  id: string;
  name: string;
  photo: string;
  bio: string;
  reraId: string;
  licenseNumber: string;
  yearsExperience: number;
  specialization: string[];
  serviceAreas: string[];
  agency: string;
  email: string;
  phone: string;
  whatsapp: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  operatingHours: {
    mondayFriday: string;
    saturday: string;
    sunday: string;
  };
  stats: {
    propertiesSold: number;
    happyClients: number;
    yearsExperience: number;
    rating: number;
  };
  testimonials: Array<{
    clientName: string;
    quote: string;
    rating: number;
  }>;
}> = {
  'john-doe': {
    id: 'john-doe',
    name: 'John Doe',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'With over 12 years of experience in Bangalore\'s real estate market, I specialize in helping families find their dream homes and investors discover profitable opportunities. My deep knowledge of Whitefield, Electronic City, and surrounding areas has helped over 500 families make informed property decisions. I believe in building long-term relationships based on trust and transparency.',
    reraId: 'COM/A12345/1234567890',
    licenseNumber: 'RE/BNG/2020/12345',
    yearsExperience: 12,
    specialization: ['Residential', 'Investment Properties', 'New Projects'],
    serviceAreas: ['Whitefield', 'Electronic City', 'HSR Layout', 'Marathahalli', 'Sarjapur Road'],
    agency: 'Prime Property Solutions',
    email: 'john.doe@primeproperty.in',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      instagram: 'https://instagram.com/johndoerealestate',
    },
    operatingHours: {
      mondayFriday: '9:00 AM - 7:00 PM',
      saturday: '10:00 AM - 5:00 PM',
      sunday: 'By Appointment',
    },
    stats: {
      propertiesSold: 523,
      happyClients: 487,
      yearsExperience: 12,
      rating: 4.8,
    },
    testimonials: [
      {
        clientName: 'Priya Sharma',
        quote: 'John helped us find our dream home in Whitefield within our budget. His knowledge of the local market and honest approach made the entire process smooth and stress-free.',
        rating: 5,
      },
      {
        clientName: 'Rahul Mehta',
        quote: 'Excellent service! John understood our requirements perfectly and showed us properties that matched exactly what we were looking for.',
        rating: 5,
      },
    ],
  },
  'jane-smith': {
    id: 'jane-smith',
    name: 'Jane Smith',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'As a RERA-certified real estate consultant, I bring professionalism and integrity to every transaction. Specializing in luxury properties and commercial spaces in Indiranagar and Koramangala, I help discerning clients find properties that exceed their expectations.',
    reraId: 'COM/B67890/9876543210',
    licenseNumber: 'RE/BNG/2018/54321',
    yearsExperience: 8,
    specialization: ['Luxury Properties', 'Commercial', 'Residential'],
    serviceAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'MG Road'],
    agency: 'Elite Realty',
    email: 'jane.smith@eliterealty.in',
    phone: '+91 98765 43211',
    whatsapp: '+91 98765 43211',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/janesmith',
      instagram: 'https://instagram.com/janesmithrealty',
      twitter: 'https://twitter.com/janesmithreal',
      facebook: 'https://facebook.com/janesmithrealty',
    },
    operatingHours: {
      mondayFriday: '10:00 AM - 7:00 PM',
      saturday: '11:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
    stats: {
      propertiesSold: 312,
      happyClients: 298,
      yearsExperience: 8,
      rating: 4.9,
    },
    testimonials: [
      {
        clientName: 'Vikram Singh',
        quote: 'Jane\'s attention to detail and market expertise helped us secure an amazing deal on our commercial space. Highly recommended!',
        rating: 5,
      },
    ],
  },
};

export async function generateMetadata({ params }: AgentProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = MOCK_AGENTS[id];

  if (!agent) {
    return { title: 'Agent Not Found' };
  }

  return {
    title: `${agent.name} | Real Estate Agent in ${agent.serviceAreas[0]}`,
    description: `Contact ${agent.name}, a RERA-certified real estate agent with ${agent.yearsExperience}+ years experience. Specializing in ${agent.specialization.join(', ')}.`,
    openGraph: {
      type: 'profile',
      title: `${agent.name} | Real Estate Agent`,
      description: agent.bio.slice(0, 160),
      images: agent.photo ? [agent.photo] : [],
    },
  };
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { id } = await params;
  const agent = MOCK_AGENTS[id];

  if (!agent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-40 w-40 overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl md:h-56 md:w-56">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">{agent.stats.rating}</span>
                </div>
              </div>
            </div>

            {/* Agent Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold md:text-4xl">{agent.name}</h1>
                <div className="flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  <ShieldCheck className="h-4 w-4" />
                  RERA Verified
                </div>
              </div>

              <p className="mt-2 text-lg text-gray-300">{agent.agency}</p>

              {/* Credentials */}
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                  RERA: {agent.reraId}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {agent.yearsExperience}+ Years Experience
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 sm:gap-8">
                <div>
                  <p className="text-3xl font-bold">{agent.stats.propertiesSold}+</p>
                  <p className="text-sm text-gray-400">Properties Sold</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{agent.stats.happyClients}+</p>
                  <p className="text-sm text-gray-400">Happy Clients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{agent.stats.rating}/5</p>
                  <p className="text-sm text-gray-400">Client Rating</p>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <CallButton
                phoneNumber={agent.phone}
                source="agent_profile"
                variant="secondary"
                size="lg"
              />
              <WhatsAppDirectButton
                phoneNumber={agent.whatsapp}
                message={`Hi ${agent.name}! I'm interested in your properties.`}
                source="agent_card"
                variant="secondary"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">About {agent.name}</h2>
              <p className="mt-4 leading-relaxed text-gray-600">{agent.bio}</p>

              {/* Specializations */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Specializations</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {agent.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Service Areas</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {agent.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                    >
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials */}
            {agent.testimonials.length > 0 && (
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Client Reviews</h2>
                <div className="mt-6 space-y-6">
                  {agent.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="mt-3 italic text-gray-600">&ldquo;{testimonial.quote}&rdquo;</p>
                      <p className="mt-3 font-medium text-gray-900">- {testimonial.clientName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Get in Touch</h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${agent.phone}`} className="font-medium text-gray-900 hover:text-blue-600">
                      {agent.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${agent.email}`} className="font-medium text-gray-900 hover:text-blue-600">
                      {agent.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  Operating Hours
                </h4>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monday - Friday</span>
                    <span className="text-gray-700">{agent.operatingHours.mondayFriday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Saturday</span>
                    <span className="text-gray-700">{agent.operatingHours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sunday</span>
                    <span className="text-gray-700">{agent.operatingHours.sunday}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {Object.keys(agent.socialLinks).length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-medium text-gray-700">Follow on Social</h4>
                  <div className="mt-3 flex gap-3">
                    {agent.socialLinks.linkedin && (
                      <a
                        href={agent.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {agent.socialLinks.instagram && (
                      <a
                        href={agent.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-white hover:opacity-90"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {agent.socialLinks.twitter && (
                      <a
                        href={agent.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {agent.socialLinks.facebook && (
                      <a
                        href={agent.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Schedule Visit */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
              <h3 className="text-lg font-semibold">Schedule a Visit</h3>
              <p className="mt-2 text-sm text-blue-100">
                Book a site visit to explore properties with {agent.name.split(' ')[0]}.
              </p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50">
                <Calendar className="h-5 w-5" />
                Request Site Visit
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
