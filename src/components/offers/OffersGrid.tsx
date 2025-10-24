"use client";
import * as React from "react";
import { cn } from "@/design-system";
import { Button } from "@/design-system";

export interface OffersGridProps {
  children: React.ReactNode;
  isEmpty?: boolean;
  onClearFilters?: () => void;
  className?: string;
}

export function OffersGrid({
  children,
  isEmpty = false,
  onClearFilters,
  className,
}: OffersGridProps) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No offers found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Try adjusting your search or filters
        </p>
        {onClearFilters && (
          <Button variant="secondary" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        className
      )}
      role="list"
      aria-label="Available offers"
    >
      {children}
    </div>
  );
}

