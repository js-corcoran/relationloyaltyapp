export type AccountContextValue = "overview" | "preferred" | "reserved";

export interface Member {
  id: string;
  tier: "Member" | "Silver" | "Gold" | "Platinum" | "Reserved";
  aum: number;
  aab: number;
  graceEndsAt: string | null;
  nextTier: string;
  nextTierThreshold: number;
  progressPct: number; // 0..100
}

export interface Points { points: number; usdPerPoint: number }

export interface NextBestAction { id: string; title: string; cta: string; priority: "low" | "medium" | "high" }

export interface OfferTeaser { id: string; merchant: string; category: string; status: "active" | "inactive"; cashbackPct: number; expires: string; creditBy: string }

export interface HomePayload {
  member: Member;
  points: Points;
  accountContext: { value: AccountContextValue };
  nextBestActions: NextBestAction[];
  offersTeaser: OfferTeaser[];
}

export interface HomeService {
  getHome(): Promise<HomePayload>;
  setAccountContext(v: AccountContextValue): Promise<void>;
}

export const homeService: HomeService = {
  async getHome() {
    const res = await fetch('/api/home', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load home');
    return res.json();
  },
  async setAccountContext(value) {
    await fetch('/api/account-context', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value }) });
  },
};


