import * as React from 'react';
import { Card, CardContent, CardTitle } from '@/design-system';
import { cn } from '@/design-system';
import type { TierName } from '@/services/tiers.service';

export interface TierProgressCardProps {
  progressPct: number; // 0-100
  deltaToNextUsd: number;
  nextTier: TierName;
  currentAum: number;
}

export function TierProgressCard({ progressPct, deltaToNextUsd, nextTier, currentAum }: TierProgressCardProps) {
  // Clamp progress between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progressPct));
  
  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle>Progress to {nextTier}</CardTitle>
        
        {/* Desktop: Progress ring */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - safeProgress / 100)}`}
                className="text-green-600 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{safeProgress}%</div>
              <div className="text-sm text-muted-foreground mt-1">
                ${deltaToNextUsd.toLocaleString()} to {nextTier}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile: Progress bar */}
        <div className="md:hidden space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{safeProgress}%</span>
            <span className="text-sm text-muted-foreground">
              ${deltaToNextUsd.toLocaleString()} to {nextTier}
            </span>
          </div>
          <div 
            role="progressbar" 
            aria-valuenow={safeProgress} 
            aria-valuemin={0} 
            aria-valuemax={100}
            aria-label={`${safeProgress}% progress to ${nextTier} tier`}
            className="w-full bg-muted rounded-full h-3 overflow-hidden"
          >
            <div 
              className={cn(
                "h-full bg-green-600 transition-all duration-500 rounded-full",
                safeProgress === 0 && "w-0"
              )}
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Based on deposits & balances (${currentAum.toLocaleString()} AUM)
        </p>
      </CardContent>
    </Card>
  );
}

