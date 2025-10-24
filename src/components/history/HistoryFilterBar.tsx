"use client";
import * as React from 'react';
import { Button, Badge } from '@/design-system';
import { TypeFilter } from './TypeFilter';
import { DateRangePicker } from './DateRangePicker';
import { HistorySearchInput } from './HistorySearchInput';
import { SortSelect } from './SortSelect';
import type { LedgerType, SortKey } from '@/services/history.service';

export interface HistoryFilterBarProps {
  type: "all" | LedgerType;
  from: string;
  to: string;
  searchQuery: string;
  sort: SortKey;
  resultCount?: number;
  onTypeChange: (type: "all" | LedgerType) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortKey) => void;
  onClearAll: () => void;
}

export function HistoryFilterBar({
  type,
  from,
  to,
  searchQuery,
  sort,
  resultCount,
  onTypeChange,
  onDateRangeChange,
  onSearchChange,
  onSortChange,
  onClearAll,
}: HistoryFilterBarProps) {
  // Count active filters
  const activeFilters = [
    type !== 'all' ? 1 : 0,
    searchQuery ? 1 : 0,
    // Date range is always set, so don't count it as active unless custom
  ].reduce((sum, val) => sum + val, 0);

  const hasActiveFilters = type !== 'all' || searchQuery;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-sm font-semibold">Filters</h2>
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{activeFilters} active</Badge>
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <TypeFilter selected={type} onSelect={onTypeChange} />
        
        <DateRangePicker from={from} to={to} onApply={onDateRangeChange} />
        
        <div className="flex gap-4 flex-wrap items-end">
          <HistorySearchInput 
            value={searchQuery} 
            onChange={onSearchChange}
            resultCount={resultCount}
          />
          
          <SortSelect value={sort} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}

