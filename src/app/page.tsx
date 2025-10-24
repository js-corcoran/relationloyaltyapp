"use client";
import { useEffect } from 'react';
import { AppProvider, useApp } from '@/state/app-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/design-system';
import { TierChip } from '@/components/relationship/TierChip';
import { RelationshipValueCard } from '@/components/relationship/RelationshipValueCard';
import { PointsBalance } from '@/components/rewards/PointsBalance';
import { PrimaryCTA } from '@/components/rewards/PrimaryCTA';
import { NudgeBanner } from '@/components/nudge/NudgeBanner';
import { OfferTile } from '@/components/offers/OfferTile';

function HomeInner() {
  const { status, home, loadHome } = useApp();
  useEffect(() => { loadHome(); }, [loadHome]);

  if (status === 'error') {
    return (
      <main className="min-h-dvh p-6 gradient-page">
        <div className="mx-auto max-w-2xl space-y-4">
          <Card className="panel">
            <CardContent className="flex items-center justify-between">
              <span>Failed to load. Please try again.</span>
              <button className="btn-secondary" onClick={loadHome}>Retry</button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const loading = status === 'loading' || !home;
  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-2xl space-y-6" aria-busy={loading}>
        {home && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <TierChip tier={home.member.tier} graceEndsAt={home.member.graceEndsAt} />
            </div>

            <RelationshipValueCard aum={home.member.aum} aab={home.member.aab} nextTier={home.member.nextTier} nextTierThreshold={home.member.nextTierThreshold} progressPct={home.member.progressPct} />

            <Card>
              <CardHeader>
                <CardTitle>Points</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <PointsBalance points={home.points.points} usdPerPoint={home.points.usdPerPoint} />
                <PrimaryCTA />
              </CardContent>
            </Card>

            {home.nextBestActions.length > 0 ? (
              <NudgeBanner title={home.nextBestActions[0].title} cta={home.nextBestActions[0].cta} />
            ) : (
              <Card className="panel"><CardContent>No suggestions right now.</CardContent></Card>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {home.offersTeaser.slice(0,3).map(o => (
                <OfferTile 
                  key={o.id} 
                  offer={{
                    id: o.id,
                    merchant: o.merchant,
                    category: o.category,
                    cashbackPct: o.cashbackPct,
                    expires: o.expires,
                    creditBy: o.creditBy,
                    active: o.status === 'active',
                    valueScore: 0.5,
                    terms: [],
                    locations: [],
                    eligibleCards: ['Preferred', 'Reserved']
                  }}
                />
              ))}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <HomeInner />
    </AppProvider>
  );
}
