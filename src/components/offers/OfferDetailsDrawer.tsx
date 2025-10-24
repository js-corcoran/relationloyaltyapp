"use client";
import * as React from 'react';
import { Button, Card, CardContent, Pill, PercentBadge, ExpiryBadge } from '@/design-system';
import { cn } from '@/design-system';
import { X, MapPin } from 'lucide-react';
import type { Offer } from '@/services/offers.service';

export interface OfferDetailsDrawerProps {
  offer: Offer | null;
  open: boolean;
  onClose: () => void;
  onToggle?: (id: string, active: boolean) => void;
  isDisabled?: boolean;
  disabledReason?: string;
}

export function OfferDetailsDrawer({
  offer,
  open,
  onClose,
  onToggle,
  isDisabled = false,
  disabledReason,
}: OfferDetailsDrawerProps) {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const [isToggling, setIsToggling] = React.useState(false);

  // Focus trap
  React.useEffect(() => {
    if (!open || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    drawer.addEventListener('keydown', handleTab);
    closeButtonRef.current?.focus();

    return () => {
      drawer.removeEventListener('keydown', handleTab);
    };
  }, [open]);

  // ESC key handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleToggle = async () => {
    if (!offer || !onToggle || isDisabled || isToggling) return;

    setIsToggling(true);
    try {
      await onToggle(offer.id, !offer.active);
    } catch (e) {
      console.error('Toggle failed:', e);
    } finally {
      setIsToggling(false);
    }
  };

  if (!open || !offer) return null;

  const displayLocations = offer.locations.slice(0, 3);
  const remainingCount = offer.locations.length - displayLocations.length;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      )}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="offer-details-title"
      aria-describedby="offer-details-description"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        className={cn(
          "fixed right-0 top-0 h-full w-full bg-background shadow-lg flex flex-col",
          "sm:max-w-md md:max-w-[480px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        )}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b p-6 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 id="offer-details-title" className="text-xl font-semibold truncate">
              {offer.merchant}
            </h2>
            <Pill variant="muted" className="mt-1">
              {offer.category}
            </Pill>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close offer details"
            ref={closeButtonRef}
            data-testid="offer-details-close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Offer Meta */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cashback</span>
                <PercentBadge percent={offer.cashbackPct} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {offer.active ? (
                  <Pill variant="success">Active</Pill>
                ) : (
                  <Pill variant="muted">Inactive</Pill>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <ExpiryBadge expiryDate={offer.expires} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Credit By</span>
                <span className="text-sm font-medium">
                  {new Date(offer.creditBy).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Eligible Cards</span>
                <div className="flex gap-1">
                  {offer.eligibleCards.map(card => (
                    <Pill key={card} variant="info" className="text-xs">
                      {card}
                    </Pill>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          {offer.terms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Terms & Conditions</h3>
              <Card>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground" id="offer-details-description">
                    {offer.terms.map((term, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Locations */}
          {offer.locations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Locations
              </h3>
              <Card>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {displayLocations.map((location) => (
                      <li key={location.id}>
                        {location.address && (
                          <div className="font-medium">{location.address}</div>
                        )}
                        <div className="text-muted-foreground">
                          {location.city}, {location.state}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {remainingCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-3">
                      + {remainingCount} more location{remainingCount > 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        {onToggle && (
          <div className="border-t p-6">
            <Button
              variant={offer.active ? "secondary" : "primary"}
              onClick={handleToggle}
              disabled={isDisabled || isToggling}
              className="w-full"
              aria-pressed={offer.active}
              title={isDisabled ? disabledReason : undefined}
            >
              {isToggling ? "..." : offer.active ? "Deactivate Offer" : "Activate Offer"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

