"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppProvider, useApp } from '@/state/app-context';
import { Card, CardContent } from '@/design-system';
import { BalanceCard } from '@/components/rewards/BalanceCard';
import { ActivityPreviewList } from '@/components/rewards/ActivityPreviewList';
import { DestinationsExplainer } from '@/components/rewards/DestinationsExplainer';
import { RedeemSheet } from '@/components/rewards/RedeemSheet';
import { useToast } from '@/components/common/ToastHost';

function RewardsInner() {
  const { rewardsStatus, rewards, loadRewards, redeem, accountContext } = useApp();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  useEffect(() => {
    if (rewards && searchParams.get('autoOpen') === 'redeem') {
      setSheetOpen(true);
    }
  }, [rewards, searchParams]);

  const handleRedeem = async (req: any) => {
    try {
      const response = await redeem(req);
      showToast(`Redemption submitted. Expected credit by ${response.expectedCreditBy}.`, 'success');
    } catch (e) {
      showToast('Redemption failed. Please try again.', 'error');
      throw e;
    }
  };

  if (rewardsStatus === 'error') {
    return (
      <main className="min-h-dvh p-6 gradient-page">
        <div className="mx-auto max-w-2xl space-y-4">
          <Card className="panel">
            <CardContent className="flex items-center justify-between">
              <span>Failed to load rewards. Please try again.</span>
              <button className="btn-secondary" onClick={loadRewards}>
                Retry
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const loading = rewardsStatus === 'loading' || !rewards;

  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-4xl space-y-6" aria-busy={loading}>
        {rewards && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <BalanceCard
                  points={rewards.points}
                  usdPerPoint={rewards.usdPerPoint}
                  onRedeemClick={() => setSheetOpen(true)}
                  disabled={rewards.points === 0}
                />
                <ActivityPreviewList items={rewards.recentActivity} />
              </div>
              <div>
                <DestinationsExplainer />
              </div>
            </div>

            {rewards.points === 0 && (
              <Card className="panel">
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-lg font-medium mb-2">No points available</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Start earning points by shopping with our partners.
                    </div>
                    <a
                      href="/offers"
                      className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-[color:rgb(var(--cta-primary-rgb))] border-2 border-[color:rgb(var(--cta-primary-rgb))] hover:bg-[color:rgb(var(--cta-primary-rgb))] hover:text-white"
                    >
                      View Offers
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            <RedeemSheet
              open={sheetOpen}
              onClose={() => setSheetOpen(false)}
              availablePoints={rewards.points}
              usdPerPoint={rewards.usdPerPoint}
              rules={rewards.redemptionRules}
              accountContext={accountContext}
              onRedeem={handleRedeem}
            />
          </>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardContent className="h-32 animate-pulse bg-muted/30" />
              </Card>
              <Card>
                <CardContent className="h-48 animate-pulse bg-muted/30" />
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="h-48 animate-pulse bg-muted/30" />
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function RewardsPage() {
  return (
    <AppProvider>
      <RewardsInner />
    </AppProvider>
  );
}

