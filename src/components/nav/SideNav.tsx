"use client";
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/design-system';
import { NavItem } from './NavItem';
import type { NavItem as NavItemType } from '@/services/nav.service';

export interface SideNavProps {
  primaryItems: NavItemType[];
  secondaryItems: NavItemType[];
}

function isRouteActive(currentPath: string, navPath: string): boolean {
  // Exact match for home
  if (navPath === '/' && currentPath === '/') return true;
  
  // For other routes, match prefix
  if (navPath !== '/' && currentPath.startsWith(navPath)) return true;
  
  return false;
}

export function SideNav({ primaryItems, secondaryItems }: SideNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[72px] lg:w-[200px] flex-col border-r bg-background">
      {/* Primary Navigation */}
      <nav aria-label="Primary" className="flex-1 p-2 space-y-1">
        <div className="mb-4">
          {primaryItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={isRouteActive(pathname, item.path)}
              slot="primary"
            />
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="border-t pt-4 space-y-1">
          {secondaryItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={isRouteActive(pathname, item.path)}
              slot="secondary"
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}

