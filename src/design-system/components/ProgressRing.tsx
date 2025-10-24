import * as React from 'react';
import { cn } from '../utils';

export interface ProgressRingProps {
  progressPct: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  color?: string; // Tailwind color class
  children?: React.ReactNode;
  className?: string;
}

export function ProgressRing({
  progressPct,
  size = 192,
  strokeWidth = 8,
  color = 'text-green-600',
  children,
  className,
}: ProgressRingProps) {
  // Clamp progress between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progressPct));
  
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safeProgress / 100);

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        role="img"
        aria-label={`${safeProgress}% progress`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(color, "transition-all duration-500")}
          strokeLinecap="round"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

