import * as React from 'react';
import { Card, CardContent, StatusRibbon, Pill } from '@/design-system';
import { Lock } from 'lucide-react';
import { cn } from '@/design-system';
import type { Badge } from '@/services/badges.service';

export interface BadgeCardProps {
  badge: Badge;
  onClick: (badgeId: string) => void;
}

export function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const isLocked = badge.status === 'locked';
  const showProgress = badge.status === 'in_progress' && typeof badge.progressPct === 'number';

  return (
    <Card
      className={cn(
        "relative card-hover cursor-pointer transition-all",
        isLocked && "opacity-60"
      )}
      onClick={() => onClick(badge.id)}
      data-badge-id={badge.id}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(badge.id);
        }
      }}
      role="button"
      aria-label={`View details for ${badge.title} badge`}
    >
      <StatusRibbon status={badge.status} earnedAt={badge.earnedAt} />
      
      <CardContent className="pt-8 space-y-3 min-h-[200px] flex flex-col">
        {/* Emblem */}
        <div className="flex justify-center">
          <div 
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-3xl",
              "bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/30",
              isLocked && "grayscale"
            )}
            aria-label={`${badge.title} emblem`}
          >
            {badge.emblem}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-center font-semibold text-base line-clamp-2 min-h-[3rem]">
          {badge.title}
        </h3>

        {/* Criteria */}
        <p className="text-center text-sm text-muted-foreground line-clamp-2 flex-1">
          {badge.criteria}
        </p>

        {/* Progress bar for in-progress badges */}
        {showProgress && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{badge.progressPct}%</span>
            </div>
            <div 
              role="progressbar" 
              aria-valuenow={badge.progressPct} 
              aria-valuemin={0} 
              aria-valuemax={100}
              aria-label={`${badge.progressPct}% complete`}
              className="w-full bg-muted rounded-full h-2 overflow-hidden"
            >
              <div 
                className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                style={{ width: `${badge.progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Earned date chip */}
        {badge.status === 'earned' && badge.earnedAt && (
          <div className="flex justify-center">
            <Pill variant="success" className="text-xs">
              Earned {new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Pill>
          </div>
        )}

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-[14px] pointer-events-none">
            <Lock className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

