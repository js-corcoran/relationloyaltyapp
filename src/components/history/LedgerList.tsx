import * as React from 'react';
import { Button, Card, CardContent, CardTitle } from '@/design-system';
import { DayGroup } from './DayGroup';
import type { LedgerItem } from '@/services/history.service';

export interface LedgerListProps {
  items: LedgerItem[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export function LedgerList({ items, loading, error, onRetry }: LedgerListProps) {
  // Group items by date
  const groupedByDate = React.useMemo(() => {
    const groups: Record<string, LedgerItem[]> = {};
    
    items.forEach((item) => {
      const date = item.timestamp.slice(0, 10); // Extract YYYY-MM-DD
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });

    // Sort dates descending
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    
    return sortedDates.map((date) => ({
      date,
      items: groups[date],
    }));
  }, [items]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="text-center">
        <CardContent>
          <CardTitle className="text-destructive mb-2">Error loading history</CardTitle>
          <p className="text-muted-foreground mb-4">Failed to fetch transaction history.</p>
          <Button onClick={onRetry}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <Card className="text-center">
        <CardContent>
          <CardTitle className="mb-2">No activity yet</CardTitle>
          <p className="text-muted-foreground mb-4">
            Start earning points by activating offers or redeem your existing points.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="primary" onClick={() => window.location.href = '/offers'}>
              Browse Offers
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = '/rewards?autoOpen=redeem'}>
              Redeem Points
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state with grouped ledger
  return (
    <div>
      {groupedByDate.map((group) => (
        <DayGroup key={group.date} date={group.date} items={group.items} />
      ))}
    </div>
  );
}

