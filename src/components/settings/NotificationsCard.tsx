import * as React from 'react';
import { Card, CardContent } from '@/design-system';
import { Check } from 'lucide-react';
import { cn } from '@/design-system';
import type { NudgeSensitivity } from '@/services/preferences.service';

export interface NotificationsCardProps {
  selectedSensitivity: NudgeSensitivity;
  onSensitivityChange: (sensitivity: NudgeSensitivity) => void;
  disabled?: boolean;
}

const sensitivities: { value: NudgeSensitivity; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Minimal nudges, only critical alerts' },
  { value: 'medium', label: 'Medium', description: 'Balanced notifications for offers and milestones' },
  { value: 'high', label: 'High', description: 'All available nudges and recommendations' },
];

export function NotificationsCard({ selectedSensitivity, onSensitivityChange, disabled }: NotificationsCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Control how often you receive nudges and recommendations
        </p>

        <div role="radiogroup" aria-label="Notification sensitivity" className="space-y-2">
          {sensitivities.map((sens) => (
            <label
              key={sens.value}
              className={cn(
                "flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors",
                "hover:bg-muted/50",
                selectedSensitivity === sens.value
                  ? "border-primary bg-primary/5"
                  : "border-border",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input
                type="radio"
                name="nudgeSensitivity"
                value={sens.value}
                checked={selectedSensitivity === sens.value}
                onChange={() => onSensitivityChange(sens.value)}
                disabled={disabled}
                className="sr-only"
                aria-checked={selectedSensitivity === sens.value}
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                  selectedSensitivity === sens.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}
              >
                {selectedSensitivity === sens.value && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{sens.label}</div>
                <div className="text-sm text-muted-foreground mt-1">{sens.description}</div>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

