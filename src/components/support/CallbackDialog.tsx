"use client";
import * as React from 'react';
import { Button, Input, Label } from '@/design-system';
import { cn } from '@/design-system';
import { X } from 'lucide-react';
import type { CallbackRequest, CallbackWindow, CallbackReason } from '@/services/support.service';

export interface CallbackDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (req: CallbackRequest) => Promise<void>;
}

export function CallbackDialog({ open, onClose, onSubmit }: CallbackDialogProps) {
  const [phone, setPhone] = React.useState('');
  const [reason, setReason] = React.useState<CallbackReason>('Card issue');
  const [window, setWindow] = React.useState<CallbackWindow>('today_pm');
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const phoneInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setPhone('');
      setReason('Card issue');
      setWindow('today_pm');
      setPhoneError(null);
      setSubmitting(false);

      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const validatePhone = (value: string): string | null => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return 'Enter a valid phone number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneErr = validatePhone(phone);
    setPhoneError(phoneErr);

    if (phoneErr) return;

    setSubmitting(true);
    try {
      await onSubmit({
        phone,
        reason,
        window,
      });
      onClose();
    } catch (e: any) {
      console.error('Failed to request callback:', e);
      setPhoneError(e.message || 'Failed to request callback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
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
      aria-labelledby="callback-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-background shadow-lg rounded-lg p-6 w-full max-w-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        )}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="callback-title" className="text-xl font-semibold">
            Request a Callback
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="callback-phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="callback-phone"
              ref={phoneInputRef}
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError(null);
              }}
              onBlur={() => setPhoneError(validatePhone(phone))}
              placeholder="(555) 123-4567"
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? "phone-error" : undefined}
              className={cn(phoneError && "border-destructive")}
            />
            {phoneError && (
              <p id="phone-error" className="text-sm text-destructive mt-1" role="alert">
                {phoneError}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="callback-reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <select
              id="callback-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as CallbackReason)}
              className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Card issue">Card issue</option>
              <option value="Rewards question">Rewards question</option>
              <option value="Account access">Account access</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="callback-window">
              Preferred Time <span className="text-destructive">*</span>
            </Label>
            <select
              id="callback-window"
              value={window}
              onChange={(e) => setWindow(e.target.value as CallbackWindow)}
              className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="today_am">Today AM (8am-12pm)</option>
              <option value="today_pm">Today PM (1pm-5pm)</option>
              <option value="tomorrow_am">Tomorrow AM (8am-12pm)</option>
              <option value="tomorrow_pm">Tomorrow PM (1pm-5pm)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={submitting || !phone}
            >
              {submitting ? 'Requesting...' : 'Request Callback'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

