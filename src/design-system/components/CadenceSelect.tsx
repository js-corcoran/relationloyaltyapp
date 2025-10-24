import * as React from 'react';
import { Select } from './Select';
import type { Cadence } from '@/services/goals.service';

export interface CadenceSelectProps {
  value: Cadence;
  onChange: (value: Cadence) => void;
  disabled?: boolean;
  id?: string;
}

export function CadenceSelect({ value, onChange, disabled, id }: CadenceSelectProps) {
  return (
    <Select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as Cadence)}
      disabled={disabled}
      aria-label="Savings cadence"
    >
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </Select>
  );
}

