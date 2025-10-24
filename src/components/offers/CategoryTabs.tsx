"use client";
import * as React from "react";
import { cn } from "@/design-system";

export type Category = "All" | "Grocery" | "Dining" | "Fuel" | "Travel" | "Retail" | "Services" | "Other";

const categories: Category[] = ["All", "Grocery", "Dining", "Fuel", "Travel", "Retail", "Services"];

export interface CategoryTabsProps {
  selected: Category;
  onSelect: (category: Category) => void;
  counts?: Record<Category, number>;
  className?: string;
}

export function CategoryTabs({
  selected,
  onSelect,
  counts,
  className,
}: CategoryTabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="tablist" aria-label="Category filter">
      {categories.map((category) => {
        const isSelected = selected === category;
        const count = counts?.[category];
        
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`offers-panel-${category.toLowerCase()}`}
            onClick={() => onSelect(category)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {category}
            {count !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium",
                  isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

