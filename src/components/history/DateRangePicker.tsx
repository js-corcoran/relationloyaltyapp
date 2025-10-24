"use client";
import * as React from 'react';
import { Button, Input, Label } from '@/design-system';
import { cn } from '@/design-system';

export interface DateRangePickerProps {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
}

export function DateRangePicker({ from, to, onApply }: DateRangePickerProps) {
  const [localFrom, setLocalFrom] = React.useState(from);
  const [localTo, setLocalTo] = React.useState(to);
  const [error, setError] = React.useState<string | null>(null);

  const presets = [
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
    { label: 'YTD', days: null },
  ];

  const handlePreset = (days: number | null) => {
    const today = new Date();
    const toDate = today.toISOString().slice(0, 10);
    let fromDate: string;

    if (days === null) {
      // YTD
      fromDate = `${today.getFullYear()}-01-01`;
    } else {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - days);
      fromDate = pastDate.toISOString().slice(0, 10);
    }

    setLocalFrom(fromDate);
    setLocalTo(toDate);
    setError(null);
    onApply(fromDate, toDate);
  };

  const handleApplyCustom = () => {
    if (!localFrom || !localTo) {
      setError('Both dates are required');
      return;
    }

    if (localFrom > localTo) {
      setError('From date must be before To date');
      return;
    }

    // Check 24 month max range
    const fromDate = new Date(localFrom);
    const toDate = new Date(localTo);
    const diffMonths = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
    if (diffMonths > 24) {
      setError('Maximum range is 24 months');
      return;
    }

    setError(null);
    onApply(localFrom, localTo);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm font-medium">Date:</span>
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="secondary"
            size="sm"
            onClick={() => handlePreset(preset.days)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 items-end flex-wrap">
        <div className="flex-1 min-w-[140px]">
          <Label htmlFor="date-from" className="text-xs">From</Label>
          <Input
            id="date-from"
            type="date"
            value={localFrom}
            onChange={(e) => setLocalFrom(e.target.value)}
            aria-describedby={error ? "date-error" : "date-hint"}
            className="text-sm"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <Label htmlFor="date-to" className="text-xs">To</Label>
          <Input
            id="date-to"
            type="date"
            value={localTo}
            onChange={(e) => setLocalTo(e.target.value)}
            aria-describedby={error ? "date-error" : "date-hint"}
            className="text-sm"
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleApplyCustom}
          disabled={!!error || !localFrom || !localTo}
        >
          Apply
        </Button>
      </div>

      {error && (
        <p id="date-error" className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      {!error && (
        <p id="date-hint" className="text-xs text-muted-foreground">
          Format: YYYY-MM-DD, max 24 months
        </p>
      )}
    </div>
  );
}

