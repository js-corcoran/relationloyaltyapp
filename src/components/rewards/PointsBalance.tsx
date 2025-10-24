import * as React from 'react';

export function PointsBalance({ points, usdPerPoint }: { points: number; usdPerPoint: number }) {
  const usd = points * usdPerPoint;
  return (
    <div className="flex items-baseline gap-3" aria-describedby="points-equivalence">
      <div className="text-2xl font-bold">{points.toLocaleString()} pts</div>
      <div id="points-equivalence" className="text-sm text-muted-foreground">≈ ${usd.toFixed(2)}</div>
    </div>
  );
}


