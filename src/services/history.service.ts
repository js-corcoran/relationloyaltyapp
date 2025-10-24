export type AccountContextValue = "overview" | "preferred" | "reserved";
export type LedgerType = "earn" | "redeem" | "adjustment";
export type SortKey = "recent" | "oldest" | "amount_desc" | "amount_asc";

export interface LedgerItem {
  id: string;
  type: LedgerType;
  points: number;      // negative for redeem/adjustment
  dollars: number;     // sign mirrors points
  timestamp: string;   // ISO datetime
  desc: string;
  merchant?: string | null;
  source?: string | null;
  authCode?: string | null;
  highlight?: boolean;
}

export interface HistoryQuery {
  type?: "all" | LedgerType;
  from?: string;
  to?: string;
  q?: string;
  sort?: SortKey;
  cursor?: string | null;
  accountContext: AccountContextValue;
}

export interface HistoryPage {
  items: LedgerItem[];
  nextCursor: string | null;
  total: number;
}

export interface HistoryService {
  list(query: HistoryQuery): Promise<HistoryPage>;
  setAccountContext(v: AccountContextValue): Promise<void>;
}

export const historyService: HistoryService = {
  async list(query) {
    const params = new URLSearchParams({ accountContext: query.accountContext });
    if (query.type && query.type !== 'all') params.append('type', query.type);
    if (query.from) params.append('from', query.from);
    if (query.to) params.append('to', query.to);
    if (query.q) params.append('q', query.q);
    if (query.sort) params.append('sort', query.sort);
    if (query.cursor) params.append('cursor', query.cursor);

    const res = await fetch(`/api/rewards/history?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
  },
  async setAccountContext(v) {
    await fetch('/api/account-context', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: v }) });
  },
};

