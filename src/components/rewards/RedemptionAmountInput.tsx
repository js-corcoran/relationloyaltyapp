"use client";
import * as React from 'react';
import { Input, Button } from '@/design-system';
import { RedemptionRules } from '@/services/rewards.service';

interface RedemptionAmountInputProps {
  availablePoints: number;
  rules: RedemptionRules;
  value: number;
  onChange: (value: number) => void;
  error: string | null;
}

export function RedemptionAmountInput({ availablePoints, rules, value, onChange, error }: RedemptionAmountInputProps) {
  const [displayValue, setDisplayValue] = React.useState(value.toLocaleString());

  React.useEffect(() => {
    setDisplayValue(value > 0 ? value.toLocaleString() : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '' || /^\d+$/.test(raw)) {
      const num = raw === '' ? 0 : parseInt(raw, 10);
      setDisplayValue(raw === '' ? '' : num.toLocaleString());
      onChange(num);
    }
  };

  const handleQuickChip = (percent: number) => {
    let amount = Math.floor((availablePoints * percent) / 100);
    // Round down to nearest step
    amount = Math.floor(amount / rules.step) * rules.step;
    // Ensure it's at least minPoints
    amount = Math.max(rules.minPoints, amount);
    // Ensure it doesn't exceed available
    amount = Math.min(amount, availablePoints);
    onChange(amount);
    console.log('redeem_amount_entered', { amountPoints: amount });
  };

  const handleMAX = () => {
    const amount = Math.floor(availablePoints / rules.step) * rules.step;
    onChange(amount);
    console.log('redeem_amount_entered', { amountPoints: amount });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="amount-input" className="text-sm font-medium">
          Amount (points)
        </label>
        <Input
          id="amount-input"
          data-testid="amount-input"
          value={displayValue}
          onChange={handleChange}
          placeholder="0"
          aria-invalid={!!error}
          aria-describedby={error ? 'amount-error' : undefined}
          className="text-lg"
        />
        {error && (
          <div id="amount-error" className="text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => handleQuickChip(25)} data-testid="chip-25">
          25%
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleQuickChip(50)} data-testid="chip-50">
          50%
        </Button>
        <Button size="sm" variant="outline" onClick={handleMAX} data-testid="chip-max">
          MAX
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Min: {rules.minPoints.toLocaleString()} pts • Increments of {rules.step} pts
      </div>
    </div>
  );
}

