"use client";
import * as React from "react";
import { Input } from "@/design-system";
import { Search, X } from "lucide-react";
import { cn } from "@/design-system";

export interface OffersSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function OffersSearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search offers...",
  className,
}: OffersSearchInputProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce 300ms
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
      if (onSubmit && newValue) {
        onSubmit(newValue);
      }
    }, 300);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search offers"
        className="pl-10 pr-10"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

