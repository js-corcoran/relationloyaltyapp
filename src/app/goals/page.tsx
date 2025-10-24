"use client";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardTitle } from '@/design-system';
import { GoalSummaryBar } from '@/components/goals/GoalSummaryBar';
import { GoalsGrid } from '@/components/goals/GoalsGrid';
import { NewGoalDialog } from '@/components/goals/NewGoalDialog';
import { ContributeSheet } from '@/components/goals/ContributeSheet';
import { RoundUpsCard } from '@/components/goals/RoundUpsCard';
import { AutoSaveCard } from '@/components/goals/AutoSaveCard';
import { WellnessTips } from '@/components/goals/WellnessTips';
import { goalsService } from '@/services/goals.service';
import { useToast } from '@/components/common/ToastHost';
import type { GoalsPayload, Goal, AutoSaveConfig } from '@/services/goals.service';

// Feature flags
const ENABLE_ROUNDUPS = true;
const SHOW_WELLNESS_TIPS = true;
const SHOW_AUTOSAVE = true;

export default function GoalsPage() {
  const { addToast } = useToast();

  // State
  const [data, setData] = React.useState<GoalsPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  
  // Dialog/sheet state
  const [newGoalDialogOpen, setNewGoalDialogOpen] = React.useState(false);
  const [contributeSheetOpen, setContributeSheetOpen] = React.useState(false);
  const [selectedGoalIdForContribute, setSelectedGoalIdForContribute] = React.useState<string | null>(null);
  const [archiveConfirmGoalId, setArchiveConfirmGoalId] = React.useState<string | null>(null);

  // Load goals
  const loadGoals = React.useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const payload = await goalsService.getGoals();
      setData(payload);
      
      const activeCount = payload.goals.filter(g => g.status === 'active').length;
      console.log('goals_viewed', { totalGoals: activeCount });
    } catch (e) {
      console.error('Failed to load goals:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Listen for create-goal-requested event from WellnessTips
  React.useEffect(() => {
    const handleCreateGoalRequest = () => {
      setNewGoalDialogOpen(true);
    };
    window.addEventListener('create-goal-requested', handleCreateGoalRequest);
    return () => window.removeEventListener('create-goal-requested', handleCreateGoalRequest);
  }, []);

  // Handlers
  const handleCreateGoal = async (req: { name: string; target: number; icon?: string | null }) => {
    try {
      const newGoal = await goalsService.createGoal(req);

      if (data) {
        setData({
          ...data,
          goals: [...data.goals, newGoal],
        });
      }

      addToast(`Goal created: ${newGoal.name}`, 'success');
      console.log('goal_created', { goalId: newGoal.id, target: newGoal.target });
    } catch (e: any) {
      throw e; // Let dialog handle error
    }
  };

  const handleOpenContribute = (goalId: string) => {
    setSelectedGoalIdForContribute(goalId);
    setContributeSheetOpen(true);
  };

  const handleContribute = async (goalId: string, amount: number) => {
    try {
      const response = await goalsService.contribute({ goalId, amount });

      if (data) {
        const updatedGoals = data.goals.map(g =>
          g.id === goalId ? { ...g, saved: response.newSaved } : g
        );
        setData({ ...data, goals: updatedGoals });
      }

      const goal = data?.goals.find(g => g.id === goalId);
      addToast(`$${amount.toFixed(2)} added to ${goal?.name}`, 'success');
      console.log('goal_contribution_submitted', { goalId, amount });
    } catch (e: any) {
      throw e; // Let sheet handle error
    }
  };

  const handleToggleRoundUps = async (enabled: boolean) => {
    if (!data) return;

    // Optimistic update
    const prevRoundUps = { ...data.roundUps };
    setData({
      ...data,
      roundUps: { ...data.roundUps, enabled },
    });

    try {
      const response = await goalsService.setRoundUps(enabled);
      setData({
        ...data,
        roundUps: response,
      });
      addToast(`Round-Ups ${enabled ? 'enabled' : 'disabled'}`, 'success');
      console.log('roundups_toggled', { enabled });
    } catch (e: any) {
      // Rollback on error
      setData({
        ...data,
        roundUps: prevRoundUps,
      });
      addToast(`Failed to toggle Round-Ups: ${e.message}`, 'error');
    }
  };

  const handleConfigureAutoSave = async (goalId: string, cfg: AutoSaveConfig) => {
    try {
      const response = await goalsService.setAutoSave(goalId, cfg);

      if (data) {
        const updatedGoals = data.goals.map(g =>
          g.id === goalId ? { ...g, autosave: response } : g
        );
        setData({ ...data, goals: updatedGoals });
      }

      const goal = data?.goals.find(g => g.id === goalId);
      addToast(`Auto-save configured for ${goal?.name}`, 'success');
      console.log('autosave_configured', { goalId, amount: cfg.amount, cadence: cfg.cadence });
    } catch (e: any) {
      throw e; // Let card handle error
    }
  };

  const handleArchiveGoal = async (goalId: string) => {
    // Show confirmation
    if (!archiveConfirmGoalId) {
      setArchiveConfirmGoalId(goalId);
      return;
    }

    try {
      await goalsService.archiveGoal(goalId);

      if (data) {
        const updatedGoals = data.goals.map(g =>
          g.id === goalId ? { ...g, status: 'archived' as const } : g
        );
        setData({ ...data, goals: updatedGoals });
      }

      const goal = data?.goals.find(g => g.id === goalId);
      addToast(`${goal?.name} archived`, 'success');
      console.log('goal_archived', { goalId });
      setArchiveConfirmGoalId(null);
    } catch (e: any) {
      addToast(`Failed to archive goal: ${e.message}`, 'error');
      setArchiveConfirmGoalId(null);
    }
  };

  const handleEditGoal = (goalId: string) => {
    // For MVP, just open contribute sheet
    // In future, could open an edit dialog
    handleOpenContribute(goalId);
  };


  const selectedGoalForContribute = data?.goals.find(g => g.id === selectedGoalIdForContribute) || null;
  const existingGoalNames = data?.goals.filter(g => g.status === 'active').map(g => g.name) || [];

  // Error state
  if (error) {
    return (
      <main className="min-h-dvh p-6 gradient-page flex items-center justify-center">
        <Card className="text-center">
          <CardTitle>Error loading goals</CardTitle>
          <CardContent>
            <p className="text-muted-foreground">Failed to fetch goals data.</p>
            <Button onClick={loadGoals} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">Goals & Wellness</h1>

        {/* New Goal Button (Sticky on mobile) */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => setNewGoalDialogOpen(true)}
            className="sticky top-4 z-10"
          >
            New Goal
          </Button>
        </div>

        {/* Summary Bar */}
        {data && data.goals.filter(g => g.status === 'active').length > 0 && (
          <GoalSummaryBar
            goals={data.goals}
            roundUpsMonthly={data.roundUps.enabled ? data.roundUps.estimateMonthly : 0}
          />
        )}

        {/* Goals Grid */}
        <GoalsGrid
          goals={data?.goals || []}
          loading={loading}
          onContribute={handleOpenContribute}
          onEdit={handleEditGoal}
          onArchive={handleArchiveGoal}
          onNewGoal={() => setNewGoalDialogOpen(true)}
        />

        {/* Automation Controls */}
        {data && data.goals.filter(g => g.status === 'active').length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ENABLE_ROUNDUPS && (
              <RoundUpsCard
                enabled={data.roundUps.enabled}
                estimateMonthly={data.roundUps.estimateMonthly}
                onToggle={handleToggleRoundUps}
              />
            )}
            {SHOW_AUTOSAVE && (
              <AutoSaveCard
                goals={data.goals}
                onConfigure={handleConfigureAutoSave}
              />
            )}
          </div>
        )}

        {/* Wellness Tips */}
        {SHOW_WELLNESS_TIPS && data && (
          <WellnessTips goals={data.goals} />
        )}
      </div>

      {/* Dialogs and Sheets */}
      <NewGoalDialog
        open={newGoalDialogOpen}
        onClose={() => setNewGoalDialogOpen(false)}
        onSubmit={handleCreateGoal}
        existingGoalNames={existingGoalNames}
      />

      <ContributeSheet
        open={contributeSheetOpen}
        onClose={() => {
          setContributeSheetOpen(false);
          setSelectedGoalIdForContribute(null);
        }}
        goal={selectedGoalForContribute}
        onSubmit={handleContribute}
      />

      {/* Archive Confirmation (Simple) */}
      {archiveConfirmGoalId && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setArchiveConfirmGoalId(null)}
        >
          <Card onClick={(e) => e.stopPropagation()} className="max-w-sm">
            <CardContent className="text-center py-6">
              <CardTitle className="mb-4">Archive Goal?</CardTitle>
              <p className="text-muted-foreground mb-6">
                This goal will be hidden from your active goals list.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setArchiveConfirmGoalId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleArchiveGoal(archiveConfirmGoalId)}
                >
                  Archive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

