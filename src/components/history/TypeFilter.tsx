"use client";
import * as React from 'react';
import { Button } from '@/design-system';
import { cn } from '@/design-system';
import type { LedgerType } from '@/services/history.service';

export interface TypeFilterProps {
  selected: "all" | LedgerType;
  onSelect: (type: "all" | LedgerType) => void;
}

const types: Array<{ value: "all" | LedgerType; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'earn', label: 'Earn' },
  { value: 'redeem', label: 'Redeem' },
  { value: 'adjustment', label: 'Adjustment' },
];

export function TypeFilter({ selected, onSelect }: TypeFilterProps) {
  return (
    <div role="group" aria-label="Transaction type filter" className="flex gap-1 flex-wrap">
      {types.map((type) => (
        <Button
          key={type.value}
          variant={selected === type.value ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelect(type.value)}
          aria-pressed={selected === type.value}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}

