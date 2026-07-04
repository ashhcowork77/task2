'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type RevealProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  delay?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Reveal<T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  delay = 0,
  ...props
}: RevealProps<T>) {
  const Tag = (as || 'div') as React.ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn('reveal', isVisible && 'reveal-visible', className)}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
