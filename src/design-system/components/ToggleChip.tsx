"use client";
import * as React from 'react';
import { cn } from '../utils';
import { Check } from 'lucide-react';

export interface ToggleChipProps {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function ToggleChip({ label, pressed, onToggle, disabled, icon }: ToggleChipProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      role="button"
      aria-pressed={pressed}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        pressed
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {icon}
      <span>{label}</span>
      {pressed && <Check className="h-4 w-4" />}
    </button>
  );
}

