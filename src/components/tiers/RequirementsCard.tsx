import * as React from 'react';
import { Card, CardContent, CardTitle } from '@/design-system';
import { cn } from '@/design-system';
import type { TierThreshold, TierName } from '@/services/tiers.service';

export interface RequirementsCardProps {
  thresholds: TierThreshold[];
  currentTier: TierName;
  nextTier: TierName;
}

export function RequirementsCard({ thresholds, currentTier, nextTier }: RequirementsCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <CardTitle>Requirements</CardTitle>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold">Tier</th>
                <th className="text-right py-2 font-semibold">Min. AUM</th>
                <th className="text-right py-2 font-semibold">Min. AAB</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((threshold) => {
                const isCurrent = threshold.name === currentTier;
                const isNext = threshold.name === nextTier;
                
                return (
                  <tr 
                    key={threshold.name}
                    className={cn(
                      "border-b last:border-b-0",
                      isCurrent && "bg-primary/10 font-semibold",
                      isNext && "bg-accent/10"
                    )}
                  >
                    <td className="py-2 flex items-center gap-2">
                      {threshold.name}
                      {isCurrent && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          You are here
                        </span>
                      )}
                      {isNext && !isCurrent && (
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                          Next
                        </span>
                      )}
                    </td>
                    <td className="text-right py-2">
                      ${threshold.aumMin.toLocaleString()}
                    </td>
                    <td className="text-right py-2">
                      ${threshold.aabMin.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {thresholds[0]?.notes && (
          <p className="text-xs text-muted-foreground mt-2">
            {thresholds[0].notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

