"use client";
import * as React from 'react';
import { Card, CardContent, Pill, PercentBadge, ExpiryBadge, Button } from '@/design-system';
import { cn } from '@/design-system';
import type { Offer } from '@/services/offers.service';

export interface OfferTileProps {
  offer: Offer;
  onToggle?: (id: string, active: boolean) => void;
  onClick?: (offer: Offer) => void;
  isDisabled?: boolean;
  disabledReason?: string;
}

export function OfferTile({ offer, onToggle, onClick, isDisabled = false, disabledReason }: OfferTileProps) {
  const [isTogglingLocal, setIsTogglingLocal] = React.useState(false);

  const handleToggleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (isDisabled || !onToggle || isTogglingLocal) return;

    setIsTogglingLocal(true);
    try {
      await onToggle(offer.id, !offer.active);
    } catch (e) {
      console.error('Toggle failed:', e);
    } finally {
      setIsTogglingLocal(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(offer);
    }
  };

  return (
    <Card
      className={cn(
        "card-hover cursor-pointer transition-all",
        offer.active && "ring-2 ring-green-500/50"
      )}
      onClick={handleCardClick}
      role="listitem"
      data-testid={`offer-tile-${offer.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate">{offer.merchant}</h3>
            <Pill variant="muted" className="mt-1">
              {offer.category}
            </Pill>
          </div>
          <PercentBadge percent={offer.cashbackPct} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ExpiryBadge expiryDate={offer.expires} />
          {offer.active && (
            <Pill variant="success">Active</Pill>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Credit by {new Date(offer.creditBy).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>

        {onToggle && (
          <Button
            variant={offer.active ? "secondary" : "primary"}
            size="sm"
            onClick={handleToggleClick}
            disabled={isDisabled || isTogglingLocal}
            aria-pressed={offer.active}
            className="w-full"
            title={isDisabled ? disabledReason : undefined}
          >
            {isTogglingLocal ? "..." : offer.active ? "Deactivate" : "Activate"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}


