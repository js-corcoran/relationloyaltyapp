import * as React from "react";
import { cn } from "../utils";

export interface ExpiryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  expiryDate: string; // ISO date string
}

export function ExpiryBadge({ expiryDate, className, ...props }: ExpiryBadgeProps) {
  const formatExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays <= 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} left`;
    
    return `Expires ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };
  
  const daysLeft = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 7 && daysLeft > 0;
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isUrgent ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-gray-100 text-gray-700",
        className
      )}
      {...props}
    >
      {formatExpiry(expiryDate)}
    </span>
  );
}

