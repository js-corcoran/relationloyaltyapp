export type TierName = "Member" | "Silver" | "Gold" | "Platinum" | "Reserved";
export type CallbackWindow = "today_am" | "today_pm" | "tomorrow_am" | "tomorrow_pm";
export type CallbackReason = "Card issue" | "Rewards question" | "Account access" | "Other";
export type MessageStatus = "open" | "replied" | "closed";
export type CallbackStatus = "scheduled" | "completed" | "missed" | "canceled";

export interface SupportProfile {
  tier: TierName;
  hasPriorityLine: boolean;
  phone: string;
  hours: string;
  slaMinutes: number;
  standardSlaMinutes: number;
}

export interface CallbackRequest {
  phone: string;
  reason: CallbackReason;
  window: CallbackWindow;
}

export interface CallbackResponse {
  id: string;
  windowStart: string;
  windowEnd: string;
  status: CallbackStatus;
}

export interface SecureMessage {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  status: MessageStatus;
}

export interface FaqArticle {
  id: string;
  title: string;
  snippet: string;
  body: string;
  tags: string[];
}

export interface SupportService {
  getProfile(): Promise<SupportProfile>;
  requestCallback(req: CallbackRequest): Promise<CallbackResponse>;
  createSecureMessage(subject: string, body: string): Promise<SecureMessage>;
  searchFaq(q: string): Promise<FaqArticle[]>;
}

export const supportService: SupportService = {
  async getProfile() {
    const res = await fetch('/api/support/profile', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load support profile');
    return res.json();
  },
  async requestCallback(req) {
    const res = await fetch('/api/support/callbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to request callback');
    }
    return res.json();
  },
  async createSecureMessage(subject, body) {
    const res = await fetch('/api/support/secure-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create message');
    }
    return res.json();
  },
  async searchFaq(q) {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    
    const res = await fetch(`/api/support/faq?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to search FAQ');
    return res.json();
  },
};

