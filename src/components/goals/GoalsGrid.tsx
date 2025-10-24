import * as React from 'react';
import { Card, CardContent, CardTitle, Button } from '@/design-system';
import { GoalCard } from './GoalCard';
import type { Goal } from '@/services/goals.service';

export interface GoalsGridProps {
  goals: Goal[];
  loading: boolean;
  onContribute: (goalId: string) => void;
  onEdit: (goalId: string) => void;
  onArchive: (goalId: string) => void;
  onNewGoal: () => void;
}

export function GoalsGrid({ goals, loading, onContribute, onEdit, onArchive, onNewGoal }: GoalsGridProps) {
  const activeGoals = goals.filter(g => g.status === 'active');

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (activeGoals.length === 0) {
    return (
      <Card className="text-center">
        <CardContent className="py-12">
          <div className="text-6xl mb-4">🎯</div>
          <CardTitle className="mb-4">No goals yet</CardTitle>
          <p className="text-muted-foreground mb-6">
            Create your first goal to start saving!
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="primary" onClick={onNewGoal}>
              Create Goal
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = '/offers'}>
              View Offers
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = '/rewards'}>
              View Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onContribute={onContribute}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}

