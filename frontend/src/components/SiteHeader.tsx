'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Home, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Villas', href: '/properties', hasChevron: true },
  { label: 'Experiences', href: '/activities' },
  { label: 'Visit, Eat, Stay', href: '/#estate' },
  { label: 'Stories', href: '/#stories' },
  { label: 'Company', href: '/#contact' },
];

const agentNavItems = [
  { label: 'Listings', href: '/agents/listings', hasChevron: true },
  { label: 'Sell', href: '/agents/sell' },
  { label: 'Lead Engine', href: '/agents#lead-engine' },
  { label: 'Attribution', href: '/agents#attribution' },
  { label: 'Demo', href: '/agents' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isAgentRoute = true;
  const items = isAgentRoute ? agentNavItems : navItems;
  const brand = isAgentRoute ? (
    <>
      NORTHLINE<br />REALTY
    </>
  ) : (
    <>
      NOT JUST<br />A STAY
    </>
  );
  const cta = isAgentRoute
    ? { href: '/agents/sell', label: 'Value property', mobileLabel: 'Value' }
    : { href: '/properties', label: 'Book a villa', mobileLabel: 'Book' };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f8f8f8]/[0.82] backdrop-blur-xl">
      <div className="grid grid-cols-3 items-center px-5 py-4 md:px-10">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center justify-self-start border border-black/10 bg-white/70 text-[#141414] transition-colors hover:bg-white md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden items-center gap-7 justify-self-start md:flex">
          {items.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[#141414] transition-opacity hover:opacity-60"
            >
              {item.label}
              {item.hasChevron && <ChevronDown className="h-3.5 w-3.5" />}
            </Link>
          ))}
        </nav>

        <Link href="/" className="justify-self-center text-center text-xl font-black leading-[0.85] tracking-tight text-[#141414]">
          {brand}
        </Link>

        <div className="hidden items-center gap-7 justify-self-end md:flex">
          {items.slice(3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-[#141414] transition-opacity hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 border border-black/10 bg-white/80 px-6 py-2.5 text-[13px] font-medium text-[#141414] backdrop-blur-md transition-colors hover:bg-white"
          >
            <Home className="h-4 w-4" />
            {cta.label}
          </Link>
        </div>

        <Link
          href={cta.href}
          className="justify-self-end bg-[#141414] px-4 py-3 text-[12px] font-semibold uppercase text-white transition-colors hover:bg-[#a1834c] md:hidden"
        >
          {cta.mobileLabel}
        </Link>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/25 transition-opacity duration-300 md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-[84vw] max-w-sm flex-col bg-[#f8f8f8] p-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-start justify-between">
          <Link href="/" className="text-xl font-black leading-[0.85] tracking-tight text-[#141414]">
            {brand}
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-11 w-11 items-center justify-center border border-black/10 bg-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-14 flex flex-col gap-1">
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-menu-link flex items-center justify-between border-t border-black/10 py-5 text-2xl font-medium tracking-tight text-[#141414]"
              style={{ transitionDelay: `${index * 45}ms` }}
            >
              {item.label}
              {item.hasChevron && <ChevronDown className="h-4 w-4 text-[#a1834c]" />}
            </Link>
          ))}
        </nav>

        <Link
          href={cta.href}
          className="mt-auto inline-flex items-center justify-center gap-2 bg-[#141414] px-6 py-4 text-[13px] font-semibold uppercase text-white"
        >
          <Home className="h-4 w-4" />
          {cta.label}
        </Link>
      </aside>
    </header>
  );
}
