import * as React from 'react';
import { Card, CardContent, ToggleChip } from '@/design-system';
import type { Interest } from '@/services/preferences.service';

export interface InterestsCardProps {
  selectedInterests: Interest[];
  onInterestsChange: (interests: Interest[]) => void;
  disabled?: boolean;
}

const availableInterests: Interest[] = ['Grocery', 'Dining', 'Fuel', 'Travel', 'Retail', 'Services'];

export function InterestsCard({ selectedInterests, onInterestsChange, disabled }: InterestsCardProps) {
  const handleToggle = (interest: Interest) => {
    if (selectedInterests.includes(interest)) {
      // Remove interest
      onInterestsChange(selectedInterests.filter((i) => i !== interest));
    } else {
      // Add interest (max 6)
      if (selectedInterests.length < 6) {
        onInterestsChange([...selectedInterests, interest]);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Interests</h2>
          <span className="text-sm text-muted-foreground">
            {selectedInterests.length} of 6 selected
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          We'll prioritize offers in these categories
        </p>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Interest categories">
          {availableInterests.map((interest) => {
            const isPressed = selectedInterests.includes(interest);
            const isDisabled = disabled || (!isPressed && selectedInterests.length >= 6);

            return (
              <ToggleChip
                key={interest}
                label={interest}
                pressed={isPressed}
                onToggle={() => handleToggle(interest)}
                disabled={isDisabled}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

