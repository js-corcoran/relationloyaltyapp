export type TierName = "Member" | "Silver" | "Gold" | "Platinum" | "Reserved";
export type AccountContextValue = "overview" | "preferred" | "reserved";

export interface MemberTier {
  tier: TierName;
  aum: number;
  aab: number;
  progressPct: number; // 0-100
  graceEndsAt: string | null; // ISO date
  nextTier: TierName;
  deltaToNextUsd: number;
}

export interface TierThreshold {
  name: TierName;
  aumMin: number;
  aabMin: number;
  notes?: string | null;
}

export interface Benefit {
  id: string;
  title: string;
  summary: string;
  details?: string | null;
  tiers: TierName[];
  limits?: string | null;
}

export interface AdvanceSuggestion {
  id: string;
  title: string;
  copy?: string | null;
  cta: string;
  icon?: string | null;
  targetRoute: string;
}

export interface TiersPayload {
  memberTier: MemberTier;
  thresholds: TierThreshold[];
  benefits: Benefit[];
  waysToAdvance: AdvanceSuggestion[];
}

export interface TiersService {
  getTiers(): Promise<TiersPayload>;
}

export const tiersService: TiersService = {
  async getTiers() {
    const res = await fetch('/api/tiers', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load tiers');
    return res.json();
  },
};

