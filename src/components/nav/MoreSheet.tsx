"use client";
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/design-system';
import { X } from 'lucide-react';
import { NavItem } from './NavItem';
import type { NavItem as NavItemType } from '@/services/nav.service';

export interface MoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItemType[];
}

function isRouteActive(currentPath: string, navPath: string): boolean {
  if (navPath === '/' && currentPath === '/') return true;
  if (navPath !== '/' && currentPath.startsWith(navPath)) return true;
  return false;
}

export function MoreSheet({ isOpen, onClose, items }: MoreSheetProps) {
  const pathname = usePathname();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  // Store the element that opened the sheet
  React.useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement;
      // Focus close button after animation
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      // Return focus to trigger button
      if (returnFocusRef.current) {
        returnFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handle Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleItemClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet/Drawer */}
      <div
        role="dialog"
        aria-labelledby="more-title"
        aria-modal="true"
        className={cn(
          "fixed z-50 bg-background shadow-lg",
          // Mobile: bottom sheet
          "md:hidden inset-x-0 bottom-0 rounded-t-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          // Desktop: right drawer
          "md:flex md:inset-y-0 md:right-0 md:w-[440px] md:rounded-none",
          "md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-right"
        )}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 id="more-title" className="text-lg font-semibold">More</h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close more menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <nav aria-label="Secondary" className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {items.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={isRouteActive(pathname, item.path)}
                slot="more"
                onClick={handleItemClick}
              />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

