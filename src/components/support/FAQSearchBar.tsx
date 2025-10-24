"use client";
import * as React from 'react';
import { Input } from '@/design-system';
import { Search, X } from 'lucide-react';
import { cn } from '@/design-system';

export interface FAQSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}

export function FAQSearchBar({ query, onQueryChange, placeholder = "Search help articles..." }: FAQSearchBarProps) {
  const handleClear = () => {
    onQueryChange('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
        aria-label="Search FAQ"
        maxLength={60}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5",
            "text-muted-foreground hover:text-foreground",
            "rounded-full hover:bg-muted",
            "transition-colors"
          )}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

