import * as React from 'react';
import { Card, CardContent } from '@/design-system';
import type { Goal } from '@/services/goals.service';

export interface GoalSummaryBarProps {
  goals: Goal[];
  roundUpsMonthly: number;
}

export function GoalSummaryBar({ goals, roundUpsMonthly }: GoalSummaryBarProps) {
  const activeGoals = goals.filter(g => g.status === 'active');
  
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = activeGoals.reduce((sum, g) => sum + g.target, 0);
  
  // Calculate estimated monthly adds from auto-saves
  const autoSaveMonthly = activeGoals.reduce((sum, g) => {
    if (!g.autosave.enabled) return sum;
    const perMonth = g.autosave.cadence === 'weekly' ? g.autosave.amount * 4.33 : g.autosave.amount;
    return sum + perMonth;
  }, 0);

  const totalMonthlyEstimate = autoSaveMonthly + roundUpsMonthly;

  return (
    <Card className="glass-card">
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Saved</p>
          <p className="text-2xl font-bold">${totalSaved.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            of ${totalTarget.toLocaleString()} target
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Active Goals</p>
          <p className="text-2xl font-bold">{activeGoals.length}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Est. Monthly Adds</p>
          <p className="text-2xl font-bold">${totalMonthlyEstimate.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            Auto-save + Round-ups
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

