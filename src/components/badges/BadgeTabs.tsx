"use client";
import * as React from 'react';
import { Button, Badge } from '@/design-system';
import { cn } from '@/design-system';
import type { BadgeStatus } from '@/services/badges.service';

export interface BadgeTabsProps {
  selected: "all" | BadgeStatus;
  onSelect: (view: "all" | BadgeStatus) => void;
  counts: {
    all: number;
    earned: number;
    in_progress: number;
    locked: number;
  };
}

const tabs: Array<{ value: "all" | BadgeStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'earned', label: 'Earned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'locked', label: 'Locked' },
];

export function BadgeTabs({ selected, onSelect, counts }: BadgeTabsProps) {
  return (
    <div role="tablist" aria-label="Badge status filter" className="flex gap-2 flex-wrap">
      {tabs.map((tab) => {
        const count = counts[tab.value];
        const isSelected = selected === tab.value;
        
        return (
          <Button
            key={tab.value}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`badges-panel-${tab.value}`}
            variant={isSelected ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onSelect(tab.value)}
            className="flex items-center gap-2"
          >
            {tab.label}
            <Badge variant={isSelected ? 'default' : 'outline'} className="ml-1">
              {count}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}

