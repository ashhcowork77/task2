'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

/**
 * Individual filter pill with remove button
 */
export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm',
        className
      )}
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-blue-200 rounded-full p-0.5"
        aria-label={`Remove ${label} filter`}
        type="button"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
