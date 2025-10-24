"use client";
import * as React from 'react';
import { Card, CardContent, Button, Pill, ProgressRing } from '@/design-system';
import { cn } from '@/design-system';
import { Archive } from 'lucide-react';
import type { Goal } from '@/services/goals.service';

export interface GoalCardProps {
  goal: Goal;
  onContribute: (goalId: string) => void;
  onEdit: (goalId: string) => void;
  onArchive: (goalId: string) => void;
}

export function GoalCard({ goal, onContribute, onEdit, onArchive }: GoalCardProps) {
  const progressPct = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
  const isComplete = goal.saved >= goal.target;

  return (
    <Card
      className="card-hover"
      data-goal-id={goal.id}
    >
      <CardContent className="space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start gap-3">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/30 flex-shrink-0"
            aria-label={`${goal.name} icon`}
          >
            {goal.icon || '🎯'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{goal.name}</h3>
            <p className="text-sm text-muted-foreground">
              ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()} • {progressPct.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Progress Visualization */}
        <div>
          {/* Desktop: Progress Ring */}
          <div className="hidden md:flex justify-center">
            <ProgressRing
              progressPct={progressPct}
              size={120}
              strokeWidth={8}
              color={isComplete ? "text-green-600" : "text-blue-600"}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{progressPct.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </ProgressRing>
          </div>

          {/* Mobile: Progress Bar */}
          <div className="md:hidden">
            <div 
              role="progressbar" 
              aria-valuenow={progressPct} 
              aria-valuemin={0} 
              aria-valuemax={100}
              aria-label={`${progressPct.toFixed(0)}% complete`}
              className="w-full bg-muted rounded-full h-3 overflow-hidden"
            >
              <div 
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  isComplete ? "bg-green-600" : "bg-blue-600"
                )}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* ETA and Status Pills */}
        <div className="flex flex-wrap gap-2">
          {goal.etaDays !== null && goal.etaDays > 0 && (
            <Pill variant="info" className="text-xs">
              Est. {goal.etaDays} days
            </Pill>
          )}
          {goal.etaDays === null && !isComplete && (
            <Pill variant="muted" className="text-xs">
              No auto-save
            </Pill>
          )}
          {goal.autosave.enabled && (
            <Pill variant="success" className="text-xs">
              Auto-save: ${goal.autosave.amount}/{goal.autosave.cadence === 'weekly' ? 'wk' : 'mo'}
            </Pill>
          )}
          {goal.roundUpsEnabled && (
            <Pill variant="info" className="text-xs">
              Round-ups: On
            </Pill>
          )}
          {isComplete && (
            <Pill variant="success" className="text-xs">
              ✓ Goal Reached!
            </Pill>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onContribute(goal.id)}
            disabled={isComplete}
          >
            Contribute
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(goal.id)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onArchive(goal.id)}
            aria-label="Archive goal"
            title="Archive goal"
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

