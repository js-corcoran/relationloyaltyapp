"use client";
import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/design-system';
import { 
  Home, 
  Gift, 
  Tag, 
  Award, 
  List, 
  Trophy, 
  Target, 
  Headphones, 
  Settings,
  LucideIcon
} from 'lucide-react';
import type { NavItem as NavItemType } from '@/services/nav.service';

function getNavIcon(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    home: Home,
    gift: Gift,
    tag: Tag,
    medal: Award,
    list: List,
    trophy: Trophy,
    target: Target,
    headset: Headphones,
    settings: Settings,
  };
  return iconMap[iconName] || Home;
}

export interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  onClick?: () => void;
  slot: 'primary' | 'secondary' | 'tab' | 'more';
}

export function NavItem({ item, isActive, onClick, slot }: NavItemProps) {
  const Icon = getNavIcon(item.icon);
  const showBadge = item.badgeCount != null && item.badgeCount > 0;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
    }
    console.log('nav_item_clicked', { id: item.id, path: item.path, slot });
  };

  const baseClasses = cn(
    "flex items-center gap-3 rounded-lg transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  );

  // Slot-specific styles
  const slotClasses = {
    primary: cn(
      "px-3 py-2",
      isActive
        ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    ),
    secondary: cn(
      "px-3 py-2",
      isActive
        ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    ),
    tab: cn(
      "flex-col gap-1 px-3 py-2 min-h-[56px] justify-center relative",
      isActive
        ? "text-primary font-semibold after:absolute after:top-0 after:left-0 after:right-0 after:h-1 after:bg-primary"
        : "text-muted-foreground hover:text-foreground"
    ),
    more: cn(
      "px-4 py-3 w-full justify-start",
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "text-foreground hover:bg-accent"
    ),
  };

  return (
    <Link
      href={item.path}
      onClick={handleClick}
      className={cn(baseClasses, slotClasses[slot])}
      aria-current={isActive ? 'page' : undefined}
      aria-label={item.ariaLabel || undefined}
    >
      <div className="relative">
        <Icon className={cn("h-5 w-5", slot === 'tab' && "h-6 w-6")} />
        {showBadge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {item.badgeCount}
          </span>
        )}
      </div>
      <span className={cn(
        slot === 'tab' && "text-xs",
        slot !== 'tab' && "text-sm"
      )}>
        {item.label}
      </span>
    </Link>
  );
}

