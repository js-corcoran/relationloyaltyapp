import * as React from "react";
import { cn } from "../utils";

export interface PercentBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  percent: number;
}

export function PercentBadge({ percent, className, ...props }: PercentBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-green-600 text-white font-bold",
        "text-sm px-3 py-1.5 shadow-sm",
        className
      )}
      {...props}
    >
      {percent}%
    </div>
  );
}

