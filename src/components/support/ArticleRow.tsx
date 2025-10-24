"use client";
import * as React from 'react';
import { cn } from '@/design-system';
import { ChevronDown } from 'lucide-react';
import type { FaqArticle } from '@/services/support.service';

export interface ArticleRowProps {
  article: FaqArticle;
  onToggle: (articleId: string) => void;
  isExpanded: boolean;
}

export function ArticleRow({ article, onToggle, isExpanded }: ArticleRowProps) {
  const contentId = `article-content-${article.id}`;

  return (
    <div className="border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(article.id)}
        className={cn(
          "w-full p-4 text-left flex items-start gap-3",
          "hover:bg-muted/50 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        role="button"
      >
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-base">{article.title}</h3>
          {!isExpanded && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {article.snippet}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div
          id={contentId}
          className="px-4 pb-4 space-y-2 text-sm text-foreground animate-in slide-in-from-top-2"
          role="region"
          aria-labelledby={`article-title-${article.id}`}
        >
          <p className="whitespace-pre-line">{article.body}</p>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

