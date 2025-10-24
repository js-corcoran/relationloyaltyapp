import * as React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Pill } from '@/design-system';
import { cn } from '@/design-system';
import type { LedgerItem } from '@/services/history.service';

export interface LedgerRowProps {
  item: LedgerItem;
}

export function LedgerRow({ item }: LedgerRowProps) {
  const isPositive = item.points > 0;
  const isNegative = item.points < 0;
  
  const timestamp = new Date(item.timestamp);
  const timeFormatted = timestamp.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  const Icon = item.type === 'earn' ? ArrowUp : item.type === 'redeem' ? ArrowDown : Minus;
  const iconColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-muted-foreground';

  return (
    <div 
      className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-muted/30 rounded-lg transition-colors min-h-[44px]"
      data-ledger-id={item.id}
      data-type={item.type}
    >
      {/* Left side */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted", iconColor)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{item.desc}</span>
            {item.highlight && (
              <Pill variant="success" className="text-xs">New</Pill>
            )}
          </div>
          {item.merchant && (
            <div className="text-xs text-muted-foreground truncate">{item.merchant}</div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <div className={cn(
          "font-semibold text-sm",
          isPositive && "text-green-600",
          isNegative && "text-red-600"
        )}>
          {isPositive && '+'}{item.points.toLocaleString()} pts
        </div>
        <div className="text-xs text-muted-foreground">
          ${Math.abs(item.dollars).toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground">
          {timeFormatted}
        </div>
      </div>
    </div>
  );
}

