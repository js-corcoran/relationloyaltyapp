"use client";
import * as React from 'react';
import { Button } from '@/design-system';
import { cn } from '@/design-system';
import { X } from 'lucide-react';

export interface CallConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  phone: string;
  slaMinutes: number;
  onConfirm: () => void;
}

export function CallConfirmDialog({ open, onClose, phone, slaMinutes, onConfirm }: CallConfirmDialogProps) {
  const callButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        callButtonRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    // Open tel: link
    const telLink = `tel:${phone.replace(/\D/g, '')}`;
    window.location.href = telLink;
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      )}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="call-confirm-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-background shadow-lg rounded-lg p-6 w-full max-w-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        )}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="call-confirm-title" className="text-xl font-semibold">
            Call Priority Line
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Phone Number</p>
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="text-lg font-mono font-semibold text-blue-600 hover:underline"
            >
              {phone}
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated wait time</p>
            <p className="text-base font-semibold">
              {slaMinutes <= 2 ? 'Under 2 minutes' : `About ${slaMinutes} minutes`}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleConfirm}
            ref={callButtonRef}
          >
            Call
          </Button>
        </div>
      </div>
    </div>
  );
}

