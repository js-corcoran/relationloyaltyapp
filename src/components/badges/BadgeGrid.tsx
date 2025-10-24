import * as React from 'react';
import { Card, CardContent, CardTitle, Button } from '@/design-system';
import { BadgeCard } from './BadgeCard';
import type { Badge, BadgeStatus } from '@/services/badges.service';

export interface BadgeGridProps {
  badges: Badge[];
  selectedView: "all" | BadgeStatus;
  loading: boolean;
  onBadgeClick: (badgeId: string) => void;
}

export function BadgeGrid({ badges, selectedView, loading, onBadgeClick }: BadgeGridProps) {
  // Filter badges by selected view
  const filteredBadges = React.useMemo(() => {
    if (selectedView === 'all') return badges;
    return badges.filter(b => b.status === selectedView);
  }, [badges, selectedView]);

  // Loading state
  if (loading) {
    return (
      <div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
        aria-busy="true"
        id={`badges-panel-${selectedView}`}
        role="tabpanel"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-8 space-y-3 min-h-[200px]">
              <div className="h-14 w-14 mx-auto bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (filteredBadges.length === 0) {
    return (
      <Card 
        className="text-center"
        id={`badges-panel-${selectedView}`}
        role="tabpanel"
      >
        <CardContent className="py-12">
          <CardTitle className="mb-4">
            {selectedView === 'earned' && 'No badges earned yet'}
            {selectedView === 'in_progress' && 'No badges in progress'}
            {selectedView === 'locked' && 'No locked badges'}
            {selectedView === 'all' && 'No badges available'}
          </CardTitle>
          <p className="text-muted-foreground mb-6">
            Your first badge is just ahead—try these actions.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button variant="primary" onClick={() => window.location.href = '/offers'}>
              Browse Offers
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = '/goals'}>
              Set Goals
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state
  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      id={`badges-panel-${selectedView}`}
      role="tabpanel"
    >
      {filteredBadges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} onClick={onBadgeClick} />
      ))}
    </div>
  );
}

