export type Language = "en" | "es" | "fr";
export type NudgeSensitivity = "low" | "medium" | "high";
export type Interest = "Grocery" | "Dining" | "Fuel" | "Travel" | "Retail" | "Services";

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:MM format (24h)
  end: string;   // HH:MM format (24h)
}

export interface Preferences {
  language: Language;
  nudgeSensitivity: NudgeSensitivity;
  interests: Interest[];
  quietHours: QuietHours;
  version: number;
}

export interface PreferencesService {
  get(): Promise<Preferences>;
  save(patch: Partial<Preferences>): Promise<Preferences>;
  export(): Promise<Blob>;
  clearLocal(): Promise<void>;
}

export const preferencesService: PreferencesService = {
  async get() {
    const res = await fetch('/api/preferences', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load preferences');
    return res.json();
  },
  async save(patch) {
    const res = await fetch('/api/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to save preferences');
    }
    return res.json();
  },
  async export() {
    const res = await fetch('/api/preferences/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to export data');
    return res.blob();
  },
  async clearLocal() {
    // Design-mode only: clears in-memory MSW data and reloads app
    // In a real app, this would call an API endpoint to clear user data
    window.location.reload();
  },
};

