"use client";
import * as React from 'react';
import { Card, CardContent, CardTitle, Switch } from '@/design-system';

export interface RoundUpsCardProps {
  enabled: boolean;
  estimateMonthly: number;
  onToggle: (enabled: boolean) => Promise<void>;
}

export function RoundUpsCard({ enabled, estimateMonthly, onToggle }: RoundUpsCardProps) {
  const [isToggling, setIsToggling] = React.useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await onToggle(!enabled);
    } catch (e) {
      console.error('Toggle failed:', e);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Round-Ups</CardTitle>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isToggling}
            aria-label="Toggle Round-Ups"
          />
        </div>

        {enabled ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Round purchases to the next dollar and save the difference.
            </p>
            <p className="text-sm font-semibold">
              Estimated: ${estimateMonthly.toFixed(2)}/mo
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Turn on to start saving small amounts automatically with every purchase.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

