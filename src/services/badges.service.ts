export type AccountContextValue = "overview" | "preferred" | "reserved";
export type BadgeStatus = "earned" | "in_progress" | "locked";
export type BadgeKind = "milestone" | "streak" | "challenge" | "surprise";

export interface RelatedAction {
  label: string;
  route: string;
}

export interface Badge {
  id: string;
  title: string;
  status: BadgeStatus;
  kind: BadgeKind;
  criteria: string;
  progressPct?: number;
  earnedAt?: string | null;
  emblem: string;
  relatedActions: RelatedAction[];
  source?: string | null;
  accountContext: AccountContextValue;
}

export interface Streak {
  days: number;
  skipAllowance: number;
  skipsUsed: number;
  nextMilestone: number;
}

export interface Challenge {
  id: string;
  title: string;
  due: string;
  stepsTotal: number;
  stepsDone: number;
  relatedBadgeId: string;
}

export interface BadgesPayload {
  accountContext: AccountContextValue;
  badges: Badge[];
  streak: Streak;
  challenges: Challenge[];
}

export interface BadgesService {
  getBadges(): Promise<BadgesPayload>;
  completeChallengeStep(id: string): Promise<{ id: string; stepsDone: number; badgeEarned?: boolean }>;
  setAccountContext(v: AccountContextValue): Promise<void>;
}

export const badgesService: BadgesService = {
  async getBadges() {
    const res = await fetch('/api/rewards/badges', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load badges');
    return res.json();
  },
  async completeChallengeStep(id: string) {
    const res = await fetch(`/api/rewards/challenges/${id}/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to complete step');
    return res.json();
  },
  async setAccountContext(v: AccountContextValue) {
    await fetch('/api/account-context', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: v }) });
  },
};

