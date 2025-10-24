export type AccountContextValue = "overview" | "preferred" | "reserved";
export type Destination = "statement" | "savings";

export interface ActivityItem {
  id: string;
  type: "earn" | "redeem" | "adjustment";
  points: number;
  dollars: number;
  when: string; // ISO date
  desc: string;
}

export interface RedemptionRules {
  minPoints: number;
  step: number;
  creditByDays: number;
  destinations: Destination[];
}

export interface RewardsOverview {
  points: number;
  usdPerPoint: number;
  accountContext: AccountContextValue;
  redemptionRules: RedemptionRules;
  recentActivity: ActivityItem[];
}

export interface RedemptionRequest {
  amountPoints: number;
  destination: Destination;
  accountContext: AccountContextValue;
}

export interface RedemptionResponse {
  id: string;
  amountPoints: number;
  amountDollars: number;
  destination: Destination;
  expectedCreditBy: string; // ISO date
  newPointsBalance: number;
}

export interface RewardsService {
  getOverview(): Promise<RewardsOverview>;
  redeem(req: RedemptionRequest): Promise<RedemptionResponse>;
}

export const rewardsService: RewardsService = {
  async getOverview() {
    const res = await fetch('/api/rewards/overview', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load rewards');
    return res.json();
  },
  async redeem(req: RedemptionRequest) {
    const res = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Redemption failed');
    return res.json();
  },
};

