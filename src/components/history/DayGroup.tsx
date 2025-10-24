import * as React from 'react';
import { LedgerRow } from './LedgerRow';
import type { LedgerItem } from '@/services/history.service';

export interface DayGroupProps {
  date: string; // YYYY-MM-DD
  items: LedgerItem[];
}

export function DayGroup({ date, items }: DayGroupProps) {
  const dateObj = new Date(date + 'T00:00:00');
  const formatted = dateObj.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const headingId = `day-heading-${date}`;

  return (
    <section 
      role="group" 
      aria-labelledby={headingId}
      className="mb-6"
    >
      <h2 
        id={headingId}
        className="sticky top-0 bg-background/95 backdrop-blur z-10 text-sm font-semibold text-muted-foreground py-2 mb-2 border-b"
      >
        {formatted}
      </h2>
      <div className="space-y-1">
        {items.map((item) => (
          <LedgerRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

