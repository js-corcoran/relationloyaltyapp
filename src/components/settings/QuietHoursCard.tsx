"use client";
import * as React from 'react';
import { Card, CardContent, Switch, Input, Label, Pill } from '@/design-system';
import type { QuietHours } from '@/services/preferences.service';

export interface QuietHoursCardProps {
  quietHours: QuietHours;
  onQuietHoursChange: (quietHours: QuietHours) => void;
  disabled?: boolean;
}

// Convert 24h time to 12h format for display
function formatTime12h(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${ampm}`;
}

export function QuietHoursCard({ quietHours, onQuietHoursChange, disabled }: QuietHoursCardProps) {
  const [startError, setStartError] = React.useState<string | null>(null);
  const [endError, setEndError] = React.useState<string | null>(null);

  const handleToggle = (checked: boolean) => {
    onQuietHoursChange({ ...quietHours, enabled: checked });
    setStartError(null);
    setEndError(null);
    console.log('settings_quiet_hours_toggled', { enabled: checked });
  };

  const handleStartChange = (value: string) => {
    onQuietHoursChange({ ...quietHours, start: value });
    setStartError(null);
    
    // Validate if both values are present
    if (value && quietHours.end && value === quietHours.end) {
      setStartError("Start and end can't be the same");
    }
  };

  const handleEndChange = (value: string) => {
    onQuietHoursChange({ ...quietHours, end: value });
    setEndError(null);
    
    // Validate if both values are present
    if (quietHours.start && value && quietHours.start === value) {
      setEndError("Start and end can't be the same");
    }
  };

  const getSummaryText = (): string => {
    if (!quietHours.enabled || !quietHours.start || !quietHours.end) return '';
    return `Quiet ${formatTime12h(quietHours.start)}–${formatTime12h(quietHours.end)}`;
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quiet Hours</h2>
          <Switch
            id="quiet-hours-toggle"
            checked={quietHours.enabled}
            onCheckedChange={handleToggle}
            disabled={disabled}
            aria-label="Toggle quiet hours"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          No notifications will be sent during these hours
        </p>

        {quietHours.enabled && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiet-start">Start Time</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={quietHours.start}
                  onChange={(e) => handleStartChange(e.target.value)}
                  disabled={disabled}
                  className={startError ? 'border-destructive' : ''}
                  aria-invalid={!!startError}
                  aria-describedby={startError ? 'quiet-start-error' : 'quiet-time-help'}
                />
                {startError && (
                  <p id="quiet-start-error" className="text-sm text-destructive mt-1" role="alert">
                    {startError}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="quiet-end">End Time</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={quietHours.end}
                  onChange={(e) => handleEndChange(e.target.value)}
                  disabled={disabled}
                  className={endError ? 'border-destructive' : ''}
                  aria-invalid={!!endError}
                  aria-describedby={endError ? 'quiet-end-error' : 'quiet-time-help'}
                />
                {endError && (
                  <p id="quiet-end-error" className="text-sm text-destructive mt-1" role="alert">
                    {endError}
                  </p>
                )}
              </div>
            </div>

            <p id="quiet-time-help" className="text-xs text-muted-foreground">
              Use 24-hour format. Wrap-around is allowed (e.g., 21:00 to 07:00)
            </p>

            {getSummaryText() && !startError && !endError && (
              <Pill variant="info" className="text-sm">
                {getSummaryText()}
              </Pill>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

