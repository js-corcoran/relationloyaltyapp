"use client";
import * as React from 'react';
import { Button } from '@/design-system';
import { cn } from '@/design-system';

export interface SaveBarProps {
  show: boolean;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function SaveBar({ show, onSave, onCancel, saving }: SaveBarProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg",
        "md:relative md:border md:rounded-lg md:shadow-sm md:mt-6",
        "animate-in slide-in-from-bottom duration-300",
        show ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          You have unsaved changes
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Discard
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

