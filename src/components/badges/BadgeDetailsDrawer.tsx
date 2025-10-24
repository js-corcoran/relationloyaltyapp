"use client";
import * as React from 'react';
import { Button, StatusRibbon, ProgressRing } from '@/design-system';
import { cn } from '@/design-system';
import { X } from 'lucide-react';
import type { Badge } from '@/services/badges.service';

export interface BadgeDetailsDrawerProps {
  badge: Badge | null;
  open: boolean;
  onClose: () => void;
}

export function BadgeDetailsDrawer({ badge, open, onClose }: BadgeDetailsDrawerProps) {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (open && badge) {
      // Focus on title after render
      setTimeout(() => {
        const title = document.getElementById('badge-drawer-title');
        title?.focus();
      }, 100);
    }
  }, [open, badge]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open || !badge) return null;

  const showProgress = badge.status === 'in_progress' && typeof badge.progressPct === 'number';

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      )}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="badge-drawer-title"
      aria-describedby="badge-drawer-description"
      onClick={onClose}
    >
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full bg-background shadow-lg p-6 flex flex-col overflow-y-auto",
          "sm:max-w-md md:max-w-[480px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        )}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 
              id="badge-drawer-title" 
              className="text-2xl font-bold"
              tabIndex={-1}
            >
              {badge.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close badge details"
            ref={closeButtonRef}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Emblem and Status */}
        <div className="flex flex-col items-center gap-4 mb-6 relative">
          <div 
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-5xl",
              "bg-gradient-to-br from-accent/20 to-accent/10 border-4 border-accent/30",
              badge.status === 'locked' && "grayscale opacity-60"
            )}
            aria-label={`${badge.title} emblem`}
          >
            {badge.emblem}
          </div>
          <StatusRibbon status={badge.status} earnedAt={badge.earnedAt} className="relative top-auto right-auto" />
        </div>

        {/* Description */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Criteria</h3>
            <p id="badge-drawer-description" className="text-sm text-muted-foreground">
              {badge.criteria}
            </p>
          </div>

          {badge.kind && (
            <div>
              <h3 className="font-semibold mb-2">Type</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {badge.kind === 'in_progress' ? 'In Progress' : badge.kind}
              </p>
            </div>
          )}
        </div>

        {/* Progress Section */}
        {showProgress && (
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Your Progress</h3>
            <div className="flex flex-col items-center gap-3">
              <ProgressRing 
                progressPct={badge.progressPct!} 
                size={160} 
                strokeWidth={10}
                color="text-blue-600"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">{badge.progressPct}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Complete</div>
                </div>
              </ProgressRing>
              <p className="text-sm text-muted-foreground text-center">
                Keep going to earn this badge!
              </p>
            </div>
          </div>
        )}

        {/* Earned Section */}
        {badge.status === 'earned' && badge.earnedAt && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Earned!</h3>
            <p className="text-sm text-green-700">
              Earned on {new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {badge.source && ` · Source: ${badge.source}`}
            </p>
          </div>
        )}

        {/* Related Actions */}
        {badge.relatedActions && badge.relatedActions.length > 0 && (
          <div className="space-y-3 mt-auto pt-6 border-t">
            <h3 className="font-semibold">Related Actions</h3>
            {badge.relatedActions.map((action, index) => (
              <Button
                key={index}
                variant="secondary"
                className="w-full"
                onClick={() => window.location.href = action.route}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

