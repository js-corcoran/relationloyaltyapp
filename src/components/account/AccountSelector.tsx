"use client";
import * as React from 'react';
import { useApp } from '@/state/app-context';
import { Button } from '@/design-system';

const options = [
  { value: 'overview', label: 'Overview' },
  { value: 'preferred', label: 'Preferred' },
  { value: 'reserved', label: 'Reserved' },
] as const;

export function AccountSelector() {
  const { accountContext, setAccountContext } = useApp();
  return (
    <div className="inline-flex rounded-full border p-1 bg-white/70">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={accountContext === opt.value ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-full"
          onClick={() => setAccountContext(opt.value as any)}
          aria-pressed={accountContext === opt.value}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}


