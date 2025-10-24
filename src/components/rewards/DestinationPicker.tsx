"use client";
import * as React from 'react';
import { Destination } from '@/services/rewards.service';

interface DestinationPickerProps {
  value: Destination;
  onChange: (value: Destination) => void;
  availableDestinations: Destination[];
}

export function DestinationPicker({ value, onChange, availableDestinations }: DestinationPickerProps) {
  const handleChange = (dest: Destination) => {
    onChange(dest);
    console.log('redeem_destination_selected', { destination: dest });
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Apply to</div>
      <div className="space-y-2" role="radiogroup" aria-label="Select destination">
        {availableDestinations.includes('statement') && (
          <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="destination"
              value="statement"
              checked={value === 'statement'}
              onChange={() => handleChange('statement')}
              data-testid="destination-radio-statement"
              className="h-4 w-4"
            />
            <div>
              <div className="font-medium">Statement Credit</div>
              <div className="text-xs text-muted-foreground">Applied to your account balance</div>
            </div>
          </label>
        )}
        {availableDestinations.includes('savings') && (
          <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="destination"
              value="savings"
              checked={value === 'savings'}
              onChange={() => handleChange('savings')}
              data-testid="destination-radio-savings"
              className="h-4 w-4"
            />
            <div>
              <div className="font-medium">Transfer to Savings</div>
              <div className="text-xs text-muted-foreground">Deposited into your savings account</div>
            </div>
          </label>
        )}
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {value === 'statement' ? 'Statement Credit selected' : 'Transfer to Savings selected'}
      </div>
    </div>
  );
}

