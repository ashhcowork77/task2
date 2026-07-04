import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { getPublishedActivities } from '@/lib/data/activities';
import { ActivityCard } from '@/components/ActivityCard';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Experiences & Activities | Not Just A Stay',
    description: 'Discover hosted local experiences for private villa stays in North Goa.',
    openGraph: {
      title: 'Experiences & Activities | Not Just A Stay',
      description: 'Discover hosted local experiences for private villa stays in North Goa.',
      type: 'website',
    },
  };
}

export default async function ActivitiesPage() {
  const activities = await getPublishedActivities();

  return (
    <main className="min-h-screen bg-[#F8F8F8] text-[#141414]">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-32 md:grid-cols-12 md:px-10 md:pb-28 md:pt-40">
        <Reveal className="md:col-span-7">
          <p className="mb-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase text-[#A1834C]">
            <Sparkles className="h-4 w-4" />
            Hosted experiences
          </p>
          <h1 className="max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
            Add a little ceremony to the stay.
          </h1>
        </Reveal>
        <Reveal as="p" delay={150} className="text-lg leading-8 text-[#6f6f6f] md:col-span-4 md:col-start-9 md:pt-14">
          Poolside mornings, local cooking, wellness rituals and coastal days can be arranged around your villa booking.
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-10 md:pb-36">
        {activities.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center">
            <h2 className="text-2xl font-medium tracking-tight">No experiences available</h2>
            <p className="mt-3 text-[#6f6f6f]">The host team can still help arrange something special for your group.</p>
          </div>
        )}
      </section>
    </main>
  );
}
