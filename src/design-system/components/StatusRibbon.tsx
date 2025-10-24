import * as React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../utils';
import type { BadgeStatus } from '@/services/badges.service';

export interface StatusRibbonProps {
  status: BadgeStatus;
  earnedAt?: string | null;
  className?: string;
}

export function StatusRibbon({ status, earnedAt, className }: StatusRibbonProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'earned':
        return {
          bg: 'bg-green-600',
          text: 'text-white',
          label: earnedAt ? `Earned ${new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Earned',
          icon: null,
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-600',
          text: 'text-white',
          label: 'In Progress',
          icon: null,
        };
      case 'locked':
        return {
          bg: 'bg-gray-400',
          text: 'text-white',
          label: 'Locked',
          icon: <Lock className="h-3 w-3" aria-hidden="true" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={cn(
        "absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1",
        config.bg,
        config.text,
        className
      )}
      role="status"
      aria-label={config.label}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

