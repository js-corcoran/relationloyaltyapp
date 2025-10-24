"use client";
import * as React from 'react';
import { Card, CardContent, CardTitle } from '@/design-system';
import { cn } from '@/design-system';
import { ChevronDown } from 'lucide-react';
import type { Benefit } from '@/services/tiers.service';

export interface BenefitsAccordionProps {
  benefits: Benefit[];
  onBenefitOpened?: (benefitId: string) => void;
}

export function BenefitsAccordion({ benefits, onBenefitOpened }: BenefitsAccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      const wasOpen = next.has(id);
      
      if (isMobile) {
        // Mobile: single-open (strict)
        next.clear();
        if (!wasOpen) {
          next.add(id);
        }
      } else {
        // Desktop: multi-open allowed
        if (wasOpen) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      
      if (!wasOpen && onBenefitOpened) {
        onBenefitOpened(id);
      }
      
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(id);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextButton = document.querySelector(
        `button[data-benefit-index="${index + 1}"]`
      ) as HTMLButtonElement;
      nextButton?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevButton = document.querySelector(
        `button[data-benefit-index="${index - 1}"]`
      ) as HTMLButtonElement;
      prevButton?.focus();
    }
  };

  if (benefits.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No special benefits at this tier yet—see ways to advance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3">
        <CardTitle>Your Benefits</CardTitle>
        
        <div className="space-y-2">
          {benefits.map((benefit, index) => {
            const isOpen = openItems.has(benefit.id);
            
            return (
              <div key={benefit.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(benefit.id)}
                  onKeyDown={(e) => handleKeyDown(e, benefit.id, index)}
                  aria-expanded={isOpen}
                  aria-controls={`benefit-content-${benefit.id}`}
                  data-benefit-index={index}
                  className={cn(
                    "w-full px-4 py-3 flex items-center justify-between",
                    "hover:bg-muted/50 transition-colors text-left",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{benefit.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {benefit.summary}
                    </div>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform ml-2 flex-shrink-0",
                      isOpen && "transform rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                
                {isOpen && (
                  <div
                    id={`benefit-content-${benefit.id}`}
                    role="region"
                    aria-labelledby={`benefit-header-${benefit.id}`}
                    className="px-4 py-3 bg-muted/30 border-t space-y-2"
                  >
                    {benefit.details && (
                      <p className="text-sm">{benefit.details}</p>
                    )}
                    {benefit.limits && (
                      <p className="text-xs text-muted-foreground">
                        <strong>Limits:</strong> {benefit.limits}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground">
                      <strong>Available for:</strong> {benefit.tiers.join(', ')} tiers
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

