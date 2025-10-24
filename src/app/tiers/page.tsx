"use client";
import * as React from 'react';
import { useApp } from '@/state/app-context';
import { Badge, Button, Card, CardContent, CardTitle } from '@/design-system';
import { TierHeader } from '@/components/tiers/TierHeader';
import { TierProgressCard } from '@/components/tiers/TierProgressCard';
import { RequirementsCard } from '@/components/tiers/RequirementsCard';
import { BenefitsAccordion } from '@/components/tiers/BenefitsAccordion';
import { WaysToAdvanceGrid } from '@/components/tiers/WaysToAdvanceGrid';

export default function TiersPage() {
  const { tiers, tiersStatus, loadTiers, accountContext, setAccountContext } = useApp();

  React.useEffect(() => {
    loadTiers();
  }, [loadTiers]);

  const handleBenefitOpened = (benefitId: string) => {
    console.log('benefit_opened', { benefitId });
  };

  const handleSuggestionClicked = (id: string, targetRoute: string) => {
    console.log('advance_suggestion_clicked', { id, targetRoute });
  };

  // Loading state
  if (tiersStatus === 'loading' || !tiers) {
    return (
      <main className="min-h-dvh p-6 gradient-page" aria-busy="true">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          
          {/* Skeleton for components */}
          <Card className="animate-pulse h-32"></Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="animate-pulse h-64"></Card>
            <Card className="animate-pulse h-64"></Card>
          </div>
          <Card className="animate-pulse h-48"></Card>
          <Card className="animate-pulse h-32"></Card>
        </div>
      </main>
    );
  }

  // Error state
  if (tiersStatus === 'error') {
    return (
      <main className="min-h-dvh p-6 gradient-page flex items-center justify-center">
        <Card className="text-center">
          <CardTitle>Error loading tiers</CardTitle>
          <CardContent>
            <p className="text-muted-foreground">Failed to fetch tier information.</p>
            <Button onClick={loadTiers} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Filter benefits for current tier
  const currentBenefits = tiers.benefits.filter(b => 
    b.tiers.includes(tiers.memberTier.tier)
  );

  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Tier Header */}
        <TierHeader 
          tier={tiers.memberTier.tier} 
          graceEndsAt={tiers.memberTier.graceEndsAt} 
        />

        {/* Desktop: Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <TierProgressCard
              progressPct={tiers.memberTier.progressPct}
              deltaToNextUsd={tiers.memberTier.deltaToNextUsd}
              nextTier={tiers.memberTier.nextTier}
              currentAum={tiers.memberTier.aum}
            />
            
            <BenefitsAccordion 
              benefits={currentBenefits}
              onBenefitOpened={handleBenefitOpened}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <RequirementsCard
              thresholds={tiers.thresholds}
              currentTier={tiers.memberTier.tier}
              nextTier={tiers.memberTier.nextTier}
            />
            
            <WaysToAdvanceGrid 
              suggestions={tiers.waysToAdvance}
              onSuggestionClicked={handleSuggestionClicked}
            />
          </div>
        </div>

        {/* Help/FAQ Link */}
        <div className="text-center pt-4">
          <a 
            href="/support#tiers-faq" 
            className="text-sm text-primary hover:underline"
          >
            Questions about tiers? Visit our FAQ
          </a>
        </div>
      </div>
    </main>
  );
}

