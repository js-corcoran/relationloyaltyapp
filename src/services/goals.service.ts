export type AccountContextValue = "overview" | "preferred" | "reserved";
export type Cadence = "weekly" | "monthly";
export type GoalStatus = "active" | "archived";

export interface AutoSaveConfig {
  enabled: boolean;
  amount: number;
  cadence: Cadence;
  nextRun: string; // YYYY-MM-DD
}

export interface Goal {
  id: string;
  name: string;
  icon?: string | null;
  target: number;
  saved: number;
  etaDays: number | null;
  status: GoalStatus;
  accountContext: AccountContextValue;
  autosave: AutoSaveConfig;
  roundUpsEnabled: boolean;
}

export interface GoalsPayload {
  accountContext: AccountContextValue;
  goals: Goal[];
  roundUps: {
    enabled: boolean;
    estimateMonthly: number;
  };
  autoSaveDefaults: {
    amount: number;
    cadence: Cadence;
  };
}

export interface CreateGoalRequest {
  name: string;
  target: number;
  icon?: string | null;
  accountContext: AccountContextValue;
}

export interface ContributeRequest {
  goalId: string;
  amount: number;
}

export interface GoalsService {
  getGoals(): Promise<GoalsPayload>;
  createGoal(req: CreateGoalRequest): Promise<Goal>;
  contribute(req: ContributeRequest): Promise<{ goalId: string; newSaved: number }>;
  setRoundUps(enabled: boolean): Promise<{ enabled: boolean; estimateMonthly: number }>;
  setAutoSave(goalId: string, cfg: AutoSaveConfig): Promise<AutoSaveConfig>;
  archiveGoal(goalId: string): Promise<{ goalId: string; status: GoalStatus }>;
  setAccountContext(v: AccountContextValue): Promise<void>;
}

export const goalsService: GoalsService = {
  async getGoals() {
    const res = await fetch('/api/goals', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load goals');
    return res.json();
  },
  async createGoal(req) {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create goal');
    }
    return res.json();
  },
  async contribute(req) {
    const res = await fetch(`/api/goals/${req.goalId}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: req.amount }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to add contribution');
    }
    return res.json();
  },
  async setRoundUps(enabled) {
    const res = await fetch('/api/roundups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw new Error('Failed to update round-ups');
    return res.json();
  },
  async setAutoSave(goalId, cfg) {
    const res = await fetch(`/api/goals/${goalId}/autosave`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    });
    if (!res.ok) throw new Error('Failed to configure auto-save');
    return res.json();
  },
  async archiveGoal(goalId) {
    const res = await fetch(`/api/goals/${goalId}/archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to archive goal');
    return res.json();
  },
  async setAccountContext(v) {
    await fetch('/api/account-context', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: v }) });
  },
};

