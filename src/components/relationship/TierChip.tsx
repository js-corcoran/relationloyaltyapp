import * as React from 'react';
import { Badge } from '@/design-system';

export function TierChip({ tier, graceEndsAt }: { tier: string; graceEndsAt: string | null }) {
  const showGrace = graceEndsAt && new Date(graceEndsAt) > new Date();
  return (
    <div className="flex items-center gap-2" role="status" aria-label={`Tier ${tier}${showGrace ? `, Grace ends ${graceEndsAt}` : ''}`}>
      <Badge variant="info">{tier}</Badge>
      {showGrace && <Badge variant="warning">Grace ends {graceEndsAt}</Badge>}
    </div>
  );
}


