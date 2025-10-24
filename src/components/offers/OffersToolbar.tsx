"use client";
import * as React from "react";
import { OffersSearchInput } from "./OffersSearchInput";
import { CategoryTabs, type Category } from "./CategoryTabs";
import { ActivateAllButton } from "./ActivateAllButton";
import { cn } from "@/design-system";

export interface OffersToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  categoryCounts?: Record<Category, number>;
  inactiveCount: number;
  onActivateAll: () => Promise<void>;
  className?: string;
}

export function OffersToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  inactiveCount,
  onActivateAll,
  className,
}: OffersToolbarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <OffersSearchInput
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          className="w-full sm:flex-1"
        />
        <ActivateAllButton
          inactiveCount={inactiveCount}
          onActivateAll={onActivateAll}
          className="w-full sm:w-auto"
        />
      </div>
      <CategoryTabs
        selected={selectedCategory}
        onSelect={onCategoryChange}
        counts={categoryCounts}
      />
    </div>
  );
}

