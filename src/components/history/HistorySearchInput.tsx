"use client";
import * as React from 'react';
import { Input, Badge } from '@/design-system';
import { Search, X } from 'lucide-react';
import { cn } from '@/design-system';

export interface HistorySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export function HistorySearchInput({ value, onChange, resultCount }: HistorySearchInputProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Max length 60
    if (newValue.length > 60) {
      newValue = newValue.slice(0, 60);
    }

    setLocalValue(newValue);

    // Debounce 300ms
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Trim and collapse whitespace
      const trimmed = newValue.trim().replace(/\s+/g, ' ');
      onChange(trimmed);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="flex-1 min-w-[200px] relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by merchant or description..."
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-20"
          aria-label="Search transaction history"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {value && resultCount !== undefined && (
        <Badge variant="outline" className="absolute -top-2 -right-2 text-xs">
          {resultCount}
        </Badge>
      )}
    </div>
  );
}

