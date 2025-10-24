"use client";
import * as React from 'react';
import { Input } from './Input';
import { cn } from '../utils';

export interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function MoneyInput({
  value,
  onChange,
  min = 0,
  max,
  error,
  disabled,
  placeholder = "0.00",
  id,
  className,
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(formatMoney(value));
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatMoney(value));
    }
  }, [value, isFocused]);

  function formatMoney(val: number): string {
    if (val === 0) return '';
    return val.toFixed(2);
  }

  function parseMoney(str: string): number {
    const cleaned = str.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number for editing
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = parseMoney(displayValue);
    let finalValue = numValue;

    // Apply min/max constraints
    if (min !== undefined && numValue < min) {
      finalValue = min;
    }
    if (max !== undefined && numValue > max) {
      finalValue = max;
    }

    onChange(finalValue);
    setDisplayValue(formatMoney(finalValue));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number or decimal point
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode !== 190 && e.keyCode !== 110) {
      e.preventDefault();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        $
      </span>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Amount in dollars"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("pl-8", error && "border-destructive")}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

