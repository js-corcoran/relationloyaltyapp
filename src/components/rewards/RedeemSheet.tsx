"use client";
import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { RedemptionAmountInput } from './RedemptionAmountInput';
import { DestinationPicker } from './DestinationPicker';
import { RedemptionSummary } from './RedemptionSummary';
import { RedemptionRules, Destination, RedemptionRequest } from '@/services/rewards.service';

interface RedeemSheetProps {
  open: boolean;
  onClose: () => void;
  availablePoints: number;
  usdPerPoint: number;
  rules: RedemptionRules;
  accountContext: string;
  onRedeem: (req: RedemptionRequest) => Promise<void>;
}

type Step = 'form' | 'confirm';

function validateAmount(amount: number, rules: RedemptionRules, available: number): string | null {
  if (amount === 0) return null;
  if (amount < rules.minPoints) return `Minimum redemption is ${rules.minPoints} points.`;
  if (amount % rules.step !== 0) return `Use increments of ${rules.step} points.`;
  if (amount > available) return "You don't have enough points for that.";
  return null;
}

export function RedeemSheet({ open, onClose, availablePoints, usdPerPoint, rules, accountContext, onRedeem }: RedeemSheetProps) {
  const [step, setStep] = React.useState<Step>('form');
  const [amount, setAmount] = React.useState(0);
  const [destination, setDestination] = React.useState<Destination>('statement');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const amountInputRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (open) {
      setStep('form');
      setAmount(0);
      setDestination('statement');
      setError(null);
      setSubmitting(false);
      // Focus amount input after render
      setTimeout(() => {
        const input = document.getElementById('amount-input');
        input?.focus();
      }, 100);
      console.log('redeem_opened', { accountContext, points: availablePoints });
    }
  }, [open, accountContext, availablePoints]);

  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = document.querySelectorAll<HTMLElement>(
        'dialog button, dialog input, dialog [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [open, onClose]);

  const handleAmountChange = (value: number) => {
    setAmount(value);
    const validationError = validateAmount(value, rules, availablePoints);
    setError(validationError);
  };

  const handleContinue = () => {
    const validationError = validateAmount(amount, rules, availablePoints);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!destination) {
      setError('Choose where to apply your credit.');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onRedeem({ amountPoints: amount, destination, accountContext: accountContext as any });
      onClose();
    } catch (e) {
      setError('Redemption failed. Please try again.');
      console.log('redeem_failed', { code: 'unknown' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const dollars = amount * usdPerPoint;
  const creditBy = new Date();
  creditBy.setDate(creditBy.getDate() + rules.creditByDays);
  const expectedCreditBy = creditBy.toISOString().slice(0, 10);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        role="dialog"
        aria-labelledby="redeem-title"
        aria-describedby="redeem-description"
        className="fixed inset-y-0 right-0 z-50 w-full md:w-[440px] bg-white shadow-xl overflow-auto"
      >
        <Card className="h-full rounded-none border-0 shadow-none flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle id="redeem-title">{step === 'form' ? 'Redeem Points' : 'Confirm Redemption'}</CardTitle>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
                data-testid="redeem-close"
              >
                ×
              </button>
            </div>
            <div id="redeem-description" className="sr-only">
              Redeem your points for statement credit or savings transfer
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            {step === 'form' ? (
              <>
                <div ref={amountInputRef}>
                  <RedemptionAmountInput
                    availablePoints={availablePoints}
                    rules={rules}
                    value={amount}
                    onChange={handleAmountChange}
                    error={error}
                  />
                </div>
                <DestinationPicker
                  value={destination}
                  onChange={setDestination}
                  availableDestinations={rules.destinations}
                />
                <div className="flex gap-2 pt-4">
                  <Button variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleContinue} disabled={!!error || amount === 0} className="flex-1" data-testid="redeem-continue">
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              <>
                <RedemptionSummary points={amount} dollars={dollars} destination={destination} expectedCreditBy={expectedCreditBy} />
                <div className="flex gap-2 pt-4">
                  <Button variant="secondary" onClick={() => setStep('form')} disabled={submitting} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleConfirm} disabled={submitting} className="flex-1" data-testid="confirm-submit">
                    {submitting ? 'Processing...' : 'Confirm'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

