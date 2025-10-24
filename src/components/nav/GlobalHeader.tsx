"use client";
import * as React from 'react';
import { cn } from '@/design-system';
import { AccountSelector } from '@/components/account/AccountSelector';

export function GlobalHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Brand Mark */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Relation</h1>
        </div>

        {/* Account Selector */}
        <div className="flex items-center">
          <AccountSelector />
        </div>
      </div>
    </header>
  );
}

