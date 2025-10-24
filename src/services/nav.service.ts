// Navigation service for global app navigation

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badgeCount?: number | null;
  visible?: boolean;
  ariaLabel?: string | null;
}

export interface NavConfig {
  primary: NavItem[];
  secondary: NavItem[];
  flags: {
    showBadges: boolean;
    showGoals: boolean;
    bottomTabs: boolean;
    sideRail: boolean;
  };
}

export interface NavService {
  getConfig(): Promise<NavConfig>;
  setBadgeCount(id: string, count: number | null): Promise<void>;
}

export const navService: NavService = {
  async getConfig() {
    const res = await fetch('/api/nav', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load navigation config');
    return res.json();
  },
  async setBadgeCount(id: string, count: number | null) {
    const res = await fetch(`/api/nav/badges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    });
    if (!res.ok) throw new Error('Failed to update badge count');
  },
};

