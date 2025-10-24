"use client";
import * as React from 'react';
import { Button, MoneyInput, Pill } from '@/design-system';
import { cn } from '@/design-system';
import { X } from 'lucide-react';
import type { Goal } from '@/services/goals.service';

export interface ContributeSheetProps {
  open: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSubmit: (goalId: string, amount: number) => Promise<void>;
}

export function ContributeSheet({ open, onClose, goal, onSubmit }: ContributeSheetProps) {
  const [amount, setAmount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  
  const amountInputRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (open && goal) {
      setAmount(0);
      setError(null);
      setSubmitting(false);
      
      setTimeout(() => {
        const input = document.getElementById('contribute-amount');
        input?.focus();
      }, 100);
    }
  }, [open, goal]);

  const remaining = goal ? goal.target - goal.saved : 0;

  const validateAmount = (value: number): string | null => {
    if (value < 1) {
      return 'Amount must be at least $1';
    }
    if (goal && value > remaining) {
      return `Amount exceeds remaining $${remaining.toFixed(2)}`;
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!goal) return;

    const err = validateAmount(amount);
    setError(err);
    if (err) return;

    setSubmitting(true);
    try {
      await onSubmit(goal.id, amount);
      onClose();
    } catch (e: any) {
      console.error('Failed to contribute:', e);
      setError(e.message || 'Failed to add contribution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickChip = (chipAmount: number) => {
    const finalAmount = Math.min(chipAmount, remaining);
    setAmount(finalAmount);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && amount >= 1 && !error && !submitting) {
      handleSubmit();
    }
  };

  if (!open || !goal) return null;

  const quickAmounts = [25, 50, 100].filter(amt => amt <= remaining);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      )}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="contribute-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full bg-background shadow-lg p-6 flex flex-col",
          "sm:max-w-md md:max-w-[440px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        )}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 id="contribute-title" className="text-xl font-semibold">
              Contribute to {goal.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Current: ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close contribution sheet"
            ref={closeButtonRef}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div>
            <p className="text-sm font-medium mb-2">Contribution Amount</p>
            <MoneyInput
              id="contribute-amount"
              ref={amountInputRef}
              value={amount}
              onChange={(val) => {
                setAmount(val);
                setError(validateAmount(val));
              }}
              min={1}
              max={remaining}
              error={error}
              placeholder="0.00"
            />
          </div>

          {quickAmounts.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Quick Add</p>
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map(amt => (
                  <Pill
                    key={amt}
                    variant="info"
                    className="cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleQuickChip(amt)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleQuickChip(amt);
                      }
                    }}
                  >
                    +${amt}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Remaining to goal: <span className="font-semibold text-foreground">${remaining.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-6 border-t">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!!error || amount < 1 || submitting}
          >
            {submitting ? 'Adding...' : `Add $${amount.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

