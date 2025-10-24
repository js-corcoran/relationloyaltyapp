import * as React from 'react';
import { TierChip } from '@/components/relationship/TierChip';
import { Card, CardContent } from '@/design-system';
import type { TierName } from '@/services/tiers.service';

export interface TierHeaderProps {
  tier: TierName;
  graceEndsAt: string | null;
}

export function TierHeader({ tier, graceEndsAt }: TierHeaderProps) {
  const showGrace = graceEndsAt && new Date(graceEndsAt) >= new Date();
  
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Your Tier</h1>
            <TierChip tier={tier} graceEndsAt={graceEndsAt} />
          </div>
          {showGrace && (
            <a 
              href="/support#grace" 
              className="text-sm text-primary hover:underline"
              aria-label="Learn how grace period works"
            >
              How grace works
            </a>
          )}
        </div>
        {showGrace && (
          <div 
            className="mt-3 text-sm text-muted-foreground" 
            role="status" 
            aria-live="polite"
          >
            Your benefits remain active until {new Date(graceEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

