'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function PageTransition() {
  const pathname = usePathname();
  const hasMounted = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setIsAnimating(true);
    const timer = window.setTimeout(() => setIsAnimating(false), 720);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`page-transition ${isAnimating ? 'page-transition-active' : ''}`}
    />
  );
}
