"use client";
import * as React from 'react';
import { Card, CardContent, CardTitle, Button, Select, MoneyInput, CadenceSelect, Label } from '@/design-system';
import type { Goal, Cadence, AutoSaveConfig } from '@/services/goals.service';

export interface AutoSaveCardProps {
  goals: Goal[];
  onConfigure: (goalId: string, cfg: AutoSaveConfig) => Promise<void>;
}

export function AutoSaveCard({ goals, onConfigure }: AutoSaveCardProps) {
  const activeGoals = goals.filter(g => g.status === 'active');
  
  const [selectedGoalId, setSelectedGoalId] = React.useState<string>(activeGoals[0]?.id || '');
  const [amount, setAmount] = React.useState(25);
  const [cadence, setCadence] = React.useState<Cadence>('weekly');
  const [enabled, setEnabled] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Update form when selected goal changes
  React.useEffect(() => {
    if (selectedGoalId) {
      const goal = activeGoals.find(g => g.id === selectedGoalId);
      if (goal) {
        setAmount(goal.autosave.amount || 25);
        setCadence(goal.autosave.cadence);
        setEnabled(goal.autosave.enabled);
      }
    }
  }, [selectedGoalId, activeGoals]);

  if (activeGoals.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CardTitle className="mb-4">Auto-Save</CardTitle>
          <p className="text-muted-foreground">
            Create a goal first to enable auto-save.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSave = async () => {
    if (!selectedGoalId) return;

    if (enabled && amount < 5) {
      setError('Amount must be at least $5');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Calculate next run date
      const nextRun = new Date();
      if (cadence === 'weekly') {
        // Next Monday
        const daysUntilMonday = (8 - nextRun.getDay()) % 7 || 7;
        nextRun.setDate(nextRun.getDate() + daysUntilMonday);
      } else {
        // 1st of next month
        nextRun.setMonth(nextRun.getMonth() + 1, 1);
      }

      await onConfigure(selectedGoalId, {
        enabled,
        amount,
        cadence,
        nextRun: nextRun.toISOString().slice(0, 10),
      });
    } catch (e: any) {
      console.error('Failed to configure auto-save:', e);
      setError(e.message || 'Failed to save configuration');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedGoal = activeGoals.find(g => g.id === selectedGoalId);

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle>Auto-Save</CardTitle>

        <div>
          <Label htmlFor="autosave-goal">Select Goal</Label>
          <Select
            id="autosave-goal"
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            disabled={submitting}
          >
            {activeGoals.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.icon} {goal.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="autosave-amount">Amount</Label>
          <MoneyInput
            id="autosave-amount"
            value={amount}
            onChange={setAmount}
            min={5}
            disabled={submitting}
            error={error}
          />
        </div>

        <div>
          <Label htmlFor="autosave-cadence">Frequency</Label>
          <CadenceSelect
            id="autosave-cadence"
            value={cadence}
            onChange={setCadence}
            disabled={submitting}
          />
        </div>

        {selectedGoal?.autosave.enabled && (
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Next save: <span className="font-semibold text-foreground">{selectedGoal.autosave.nextRun}</span>
            </p>
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleSave}
          disabled={submitting || (enabled && amount < 5)}
        >
          {submitting ? 'Saving...' : 'Save Configuration'}
        </Button>
      </CardContent>
    </Card>
  );
}

