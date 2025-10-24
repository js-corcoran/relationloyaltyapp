"use client";
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/design-system';
import { MoreHorizontal } from 'lucide-react';
import { NavItem } from './NavItem';
import type { NavItem as NavItemType } from '@/services/nav.service';

export interface BottomTabBarProps {
  primaryItems: NavItemType[];
  onMoreClick: () => void;
}

function isRouteActive(currentPath: string, navPath: string): boolean {
  if (navPath === '/' && currentPath === '/') return true;
  if (navPath !== '/' && currentPath.startsWith(navPath)) return true;
  return false;
}

export function BottomTabBar({ primaryItems, onMoreClick }: BottomTabBarProps) {
  const pathname = usePathname();

  // Show first 4 primary items in tabs
  const tabItems = primaryItems.slice(0, 4);

  const handleMoreClick = () => {
    console.log('nav_more_opened', { from: 'tabbar' });
    onMoreClick();
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className={cn(
        "md:hidden fixed bottom-0 inset-x-0 z-40",
        "bg-background border-t",
        "grid grid-cols-5 h-[56px]",
        // Safe area padding for iOS
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      {tabItems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isActive={isRouteActive(pathname, item.path)}
          slot="tab"
        />
      ))}

      {/* More Button */}
      <button
        onClick={handleMoreClick}
        className={cn(
          "flex flex-col items-center justify-center gap-1 px-3 py-2",
          "text-muted-foreground hover:text-foreground transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        aria-label="More options"
      >
        <MoreHorizontal className="h-6 w-6" />
        <span className="text-xs">More</span>
      </button>
    </nav>
  );
}

