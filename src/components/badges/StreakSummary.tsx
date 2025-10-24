import * as React from 'react';
import { Card, CardContent, CardTitle, ProgressRing, Pill, Button } from '@/design-system';
import type { Streak } from '@/services/badges.service';

export interface StreakSummaryProps {
  streak: Streak;
  onViewed?: () => void;
}

export function StreakSummary({ streak, onViewed }: StreakSummaryProps) {
  React.useEffect(() => {
    if (onViewed) {
      onViewed();
    }
  }, [onViewed]);

  const skipsLeft = Math.max(0, streak.skipAllowance - streak.skipsUsed);
  const progressPct = Math.min(100, (streak.days / streak.nextMilestone) * 100);

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle>Your Streak</CardTitle>
        
        <div className="flex items-center gap-6 flex-wrap">
          {/* Progress Ring */}
          <ProgressRing 
            progressPct={progressPct} 
            size={120} 
            strokeWidth={8}
            color="text-orange-500"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">{streak.days}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
          </ProgressRing>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <p className="text-lg font-semibold">
              {streak.days} day streak
            </p>
            <p className="text-sm text-muted-foreground">
              Next milestone: {streak.nextMilestone} days
            </p>
            <Pill variant={skipsLeft > 0 ? 'info' : 'warning'} className="text-xs">
              Skips left: {skipsLeft} / {streak.skipAllowance}
            </Pill>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.location.href = '/support#streaks'}
          className="w-full"
        >
          Learn how streaks work
        </Button>
      </CardContent>
    </Card>
  );
}

