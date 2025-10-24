"use client";
import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge, Button } from '@/design-system';
import { HistoryFilterBar } from '@/components/history/HistoryFilterBar';
import { LedgerList } from '@/components/history/LedgerList';
import { historyService } from '@/services/history.service';
import type { LedgerItem, LedgerType, SortKey } from '@/services/history.service';

export default function RewardsHistoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query params
  const typeParam = (searchParams.get('type') || 'all') as "all" | LedgerType;
  const fromParam = searchParams.get('from') || getDefaultFrom();
  const toParam = searchParams.get('to') || getDefaultTo();
  const qParam = searchParams.get('q') || '';
  const sortParam = (searchParams.get('sort') || 'recent') as SortKey;

  // Local state
  const [items, setItems] = React.useState<LedgerItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState(0);
  const [loadingMore, setLoadingMore] = React.useState(false);

  // Load history
  const loadHistory = React.useCallback(async (append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(false);
    }

    try {
      const response = await historyService.list({
        type: typeParam,
        from: fromParam,
        to: toParam,
        q: qParam,
        sort: sortParam,
        cursor: append ? nextCursor : null,
        accountContext,
      });

      if (append) {
        setItems((prev) => [...prev, ...response.items]);
      } else {
        setItems(response.items);
      }
      setNextCursor(response.nextCursor);
      setTotal(response.total);

      if (!append) {
        console.log('history_viewed', { 
          accountContext, 
          total: response.total, 
          initialFilters: { type: typeParam, from: fromParam, to: toParam, q: qParam, sort: sortParam }
        });
      } else {
        console.log('history_load_more', { pageSize: 25, newCount: response.items.length });
      }
    } catch (e) {
      console.error('Failed to load history:', e);
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [typeParam, fromParam, toParam, qParam, sortParam, nextCursor]);

  // Initial load
  React.useEffect(() => {
    loadHistory();
  }, [typeParam, fromParam, toParam, qParam, sortParam]);

  // Update URL
  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/rewards/history?${params.toString()}`);
  };

  const handleTypeChange = (type: "all" | LedgerType) => {
    updateUrl({ type: type === 'all' ? '' : type });
    console.log('history_filter_changed', { type, from: fromParam, to: toParam, q: qParam });
  };

  const handleDateRangeChange = (from: string, to: string) => {
    updateUrl({ from, to });
    console.log('history_filter_changed', { type: typeParam, from, to, q: qParam });
  };

  const handleSearchChange = (q: string) => {
    updateUrl({ q });
    console.log('history_filter_changed', { type: typeParam, from: fromParam, to: toParam, q });
  };

  const handleSortChange = (sort: SortKey) => {
    updateUrl({ sort });
    console.log('history_sort_changed', { sort });
  };

  const handleClearAll = () => {
    router.push('/rewards/history');
  };

  const handleLoadMore = () => {
    loadHistory(true);
  };


  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">Rewards History</h1>

        {/* Filter Bar */}
        <HistoryFilterBar
          type={typeParam}
          from={fromParam}
          to={toParam}
          searchQuery={qParam}
          sort={sortParam}
          resultCount={total}
          onTypeChange={handleTypeChange}
          onDateRangeChange={handleDateRangeChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onClearAll={handleClearAll}
        />

        {/* Results count live region */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {!loading && `Showing ${items.length} of ${total} results`}
        </div>

        {/* Ledger List */}
        <LedgerList
          items={items}
          loading={loading}
          error={error}
          onRetry={() => loadHistory()}
        />

        {/* Load More */}
        {!loading && !error && nextCursor && (
          <div className="text-center pt-4">
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

// Helper functions for default date range (90 days)
function getDefaultFrom(): string {
  const date = new Date();
  date.setDate(date.getDate() - 90);
  return date.toISOString().slice(0, 10);
}

function getDefaultTo(): string {
  return new Date().toISOString().slice(0, 10);
}

