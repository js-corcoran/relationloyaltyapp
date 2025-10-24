"use client";
import * as React from 'react';
import { ArticleRow } from './ArticleRow';
import { Button } from '@/design-system';
import type { FaqArticle } from '@/services/support.service';

export interface FAQResultsListProps {
  articles: FaqArticle[];
  query: string;
  onClearSearch: () => void;
  onArticleToggle: (articleId: string) => void;
}

export function FAQResultsList({ articles, query, onClearSearch, onArticleToggle }: FAQResultsListProps) {
  const [expandedArticleId, setExpandedArticleId] = React.useState<string | null>(null);

  const handleToggle = (articleId: string) => {
    setExpandedArticleId(prev => prev === articleId ? null : articleId);
    onArticleToggle(articleId);
  };

  if (articles.length === 0 && query) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">
          No results found. Try different keywords.
        </p>
        <Button variant="secondary" onClick={onClearSearch}>
          Clear search
        </Button>
      </div>
    );
  }

  if (articles.length === 0 && !query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No articles available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {articles.length} {articles.length === 1 ? 'article' : 'articles'} found
      </p>
      <div className="space-y-2" role="list">
        {articles.map((article) => (
          <ArticleRow
            key={article.id}
            article={article}
            isExpanded={expandedArticleId === article.id}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

