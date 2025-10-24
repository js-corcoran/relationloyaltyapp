"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardTitle, Button } from '@/design-system';
import type { AdvanceSuggestion } from '@/services/tiers.service';

export interface WaysToAdvanceGridProps {
  suggestions: AdvanceSuggestion[];
  onSuggestionClicked?: (id: string, targetRoute: string) => void;
}

export function WaysToAdvanceGrid({ suggestions, onSuggestionClicked }: WaysToAdvanceGridProps) {
  const router = useRouter();

  const handleClick = (suggestion: AdvanceSuggestion) => {
    if (onSuggestionClicked) {
      onSuggestionClicked(suggestion.id, suggestion.targetRoute);
    }
    router.push(suggestion.targetRoute);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle>Ways to Advance</CardTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className="p-4 border rounded-lg hover:border-primary/50 transition-colors space-y-2"
            >
              <h3 className="font-semibold text-sm">{suggestion.title}</h3>
              {suggestion.copy && (
                <p className="text-xs text-muted-foreground">{suggestion.copy}</p>
              )}
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => handleClick(suggestion)}
                className="w-full mt-2"
              >
                {suggestion.cta}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

