import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';

export function RelationshipValueCard({ aum, aab, nextTier, nextTierThreshold, progressPct }: { aum: number; aab: number; nextTier: string; nextTierThreshold: number; progressPct: number }) {
  const delta = Math.max(0, nextTierThreshold - (aum + aab));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relationship Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">AUM + AAB</div>
          <div className="text-lg font-semibold">${(aum + aab).toLocaleString()}</div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-[color:rgb(var(--cta-primary-rgb))]" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="text-sm">{progressPct}% to {nextTier}. Delta ${delta.toLocaleString()}.</div>
        </div>
      </CardContent>
    </Card>
  );
}


