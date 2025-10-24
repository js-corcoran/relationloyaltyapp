"use client";
import * as React from 'react';
import { navService } from '@/services/nav.service';
import type { NavConfig } from '@/services/nav.service';
import { SkipLink } from './SkipLink';
import { GlobalHeader } from './GlobalHeader';
import { SideNav } from './SideNav';
import { BottomTabBar } from './BottomTabBar';
import { MoreSheet } from './MoreSheet';

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [navConfig, setNavConfig] = React.useState<NavConfig | null>(null);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await navService.getConfig();
        setNavConfig(config);
        setLoading(false);
      } catch (e) {
        console.error('Failed to load nav config:', e);
        setError('Failed to load navigation');
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !navConfig) {
    // Minimal fallback header
    return (
      <div className="flex h-screen flex-col">
        <GlobalHeader />
        <main id="main" className="flex-1 p-6">
          <div className="text-center">
            <p className="text-red-500">Failed to load navigation</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <SkipLink />
      
      <div className="flex h-screen flex-col">
        <GlobalHeader />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Side Navigation (Desktop) */}
          {navConfig.flags.sideRail && (
            <SideNav
              primaryItems={navConfig.primary}
              secondaryItems={navConfig.secondary}
            />
          )}

          {/* Main Content */}
          <main
            id="main"
            tabIndex={-1}
            className="flex-1 overflow-y-auto focus:outline-none"
          >
            {children}
          </main>
        </div>

        {/* Bottom Tab Bar (Mobile) */}
        {navConfig.flags.bottomTabs && (
          <BottomTabBar
            primaryItems={navConfig.primary}
            onMoreClick={() => setIsMoreSheetOpen(true)}
          />
        )}
      </div>

      {/* More Sheet */}
      <MoreSheet
        isOpen={isMoreSheetOpen}
        onClose={() => setIsMoreSheetOpen(false)}
        items={navConfig.secondary}
      />

      {/* Live Region for Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
    </>
  );
}

