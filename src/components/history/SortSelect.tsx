"use client";
import * as React from 'react';
import { Select, Label } from '@/design-system';
import type { SortKey } from '@/services/history.service';

export interface SortSelectProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: 'recent', label: 'Recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'amount_desc', label: 'Highest Amount' },
  { value: 'amount_asc', label: 'Lowest Amount' },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="min-w-[160px]">
      <Label htmlFor="sort-select" className="text-xs">Sort by</Label>
      <Select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

