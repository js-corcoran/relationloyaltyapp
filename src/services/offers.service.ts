export type AccountContextValue = "overview" | "preferred" | "reserved";
export type Category = "Grocery" | "Dining" | "Fuel" | "Travel" | "Retail" | "Services" | "Other";
export type EligibleCard = "Preferred" | "Reserved";

export interface Location {
  id: string;
  address?: string;
  city: string;
  state: string;
}

export interface Offer {
  id: string;
  merchant: string;
  category: Category;
  cashbackPct: number;
  expires: string; // ISO date
  creditBy: string; // ISO date
  active: boolean;
  valueScore: number; // 0..1 for sorting
  logoUrl?: string | null;
  terms: string[];
  locations: Location[];
  eligibleCards: EligibleCard[];
}

export interface OffersQuery {
  q?: string;
  category?: string;
  accountContext: AccountContextValue;
}

export interface ActivateOfferResponse {
  id: string;
  active: boolean;
}

export interface ActivateAllResponse {
  updatedIds: string[];
}

export interface OffersService {
  list(query: OffersQuery): Promise<Offer[]>;
  activateOffer(id: string, active: boolean): Promise<ActivateOfferResponse>;
  activateAll(query: OffersQuery): Promise<ActivateAllResponse>;
}

export const offersService: OffersService = {
  async list(query) {
    const params = new URLSearchParams();
    if (query.q) params.set('q', query.q);
    if (query.category) params.set('category', query.category);
    params.set('accountContext', query.accountContext);

    const res = await fetch(`/api/offers?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load offers');
    return res.json();
  },

  async activateOffer(id, active) {
    const res = await fetch(`/api/offers/${id}/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!res.ok) throw new Error('Failed to toggle offer');
    return res.json();
  },

  async activateAll(query) {
    const res = await fetch('/api/offers/activate-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    if (!res.ok) throw new Error('Failed to activate all');
    return res.json();
  },
};

