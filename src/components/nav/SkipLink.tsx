"use client";
import * as React from 'react';
import { cn } from '@/design-system';

export function SkipLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main');
    if (main) {
      main.focus();
      main.scrollIntoView();
      console.log('nav_skiplink_used', {});
    }
  };

  return (
    <a
      href="#main"
      onClick={handleClick}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:px-4 focus:py-2 focus:rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
    >
      Skip to content
    </a>
  );
}

