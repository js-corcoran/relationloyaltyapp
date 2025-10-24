"use client";
import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge, Button, Card, CardContent, CardTitle } from '@/design-system';
import { BadgeTabs } from '@/components/badges/BadgeTabs';
import { BadgeGrid } from '@/components/badges/BadgeGrid';
import { StreakSummary } from '@/components/badges/StreakSummary';
import { ChallengeList } from '@/components/badges/ChallengeList';
import { BadgeDetailsDrawer } from '@/components/badges/BadgeDetailsDrawer';
import { badgesService } from '@/services/badges.service';
import { useToast } from '@/components/common/ToastHost';
import type { Badge as BadgeType, BadgeStatus, BadgesPayload } from '@/services/badges.service';

// Feature flags (can be env vars in production)
const SHOW_STREAK = true;
const SHOW_CHALLENGES = true;

export default function BadgesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();

  // Extract query params
  const viewParam = (searchParams.get('view') || 'all') as "all" | BadgeStatus;
  const badgeIdParam = searchParams.get('badge');

  // Local state
  const [data, setData] = React.useState<BadgesPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [drawerBadgeId, setDrawerBadgeId] = React.useState<string | null>(badgeIdParam);

  // Load badges
  const loadBadges = React.useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const payload = await badgesService.getBadges();
      setData(payload);

      // Calculate counts
      const counts = {
        all: payload.badges.length,
        earned: payload.badges.filter(b => b.status === 'earned').length,
        in_progress: payload.badges.filter(b => b.status === 'in_progress').length,
        locked: payload.badges.filter(b => b.status === 'locked').length,
      };

      console.log('badges_viewed', { counts });
    } catch (e) {
      console.error('Failed to load badges:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  // Deep-link: auto-open drawer
  React.useEffect(() => {
    if (badgeIdParam && data && !loading) {
      setDrawerBadgeId(badgeIdParam);
      // Remove query param after opening
      router.replace('/rewards/badges', undefined);
    }
  }, [badgeIdParam, data, loading, router]);

  // Update URL on view change
  const handleViewChange = (view: "all" | BadgeStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === 'all') {
      params.delete('view');
    } else {
      params.set('view', view);
    }
    router.push(`/rewards/badges${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleBadgeClick = (badgeId: string) => {
    setDrawerBadgeId(badgeId);
    console.log('badge_opened', { badgeId });
  };

  const handleCloseDrawer = () => {
    setDrawerBadgeId(null);
  };

  const handleCompleteStep = async (challengeId: string) => {
    try {
      const response = await badgesService.completeChallengeStep(challengeId);
      
      // Update local state
      if (data) {
        const updatedChallenges = data.challenges.map(c =>
          c.id === challengeId ? { ...c, stepsDone: response.stepsDone } : c
        );

        let updatedBadges = data.badges;
        if (response.badgeEarned) {
          const challenge = data.challenges.find(c => c.id === challengeId);
          if (challenge) {
            updatedBadges = data.badges.map(b =>
              b.id === challenge.relatedBadgeId
                ? { ...b, status: 'earned' as BadgeStatus, earnedAt: new Date().toISOString().slice(0, 10), progressPct: 100 }
                : b
            );

            const badge = updatedBadges.find(b => b.id === challenge.relatedBadgeId);
            if (badge) {
              console.log('badge_earned', { badgeId: badge.id, kind: badge.kind });
              addToast(`🎉 Badge earned: ${badge.title}!`, 'success', 5000);
            }
          }
        }

        setData({
          ...data,
          challenges: updatedChallenges,
          badges: updatedBadges,
        });
      }

      console.log('challenge_step_completed', {
        challengeId,
        stepsDone: response.stepsDone,
        stepsTotal: data?.challenges.find(c => c.id === challengeId)?.stepsTotal || 0,
      });

      if (!response.badgeEarned) {
        addToast('Challenge step completed!', 'success');
      }
    } catch (e) {
      console.error('Failed to complete challenge step:', e);
      addToast('Failed to complete challenge step', 'error');
    }
  };


  const handleStreakViewed = () => {
    if (data?.streak) {
      const skipsLeft = Math.max(0, data.streak.skipAllowance - data.streak.skipsUsed);
      console.log('streak_viewed', { days: data.streak.days, skipsLeft });
    }
  };

  // Calculate counts
  const counts = React.useMemo(() => {
    if (!data) return { all: 0, earned: 0, in_progress: 0, locked: 0 };
    return {
      all: data.badges.length,
      earned: data.badges.filter(b => b.status === 'earned').length,
      in_progress: data.badges.filter(b => b.status === 'in_progress').length,
      locked: data.badges.filter(b => b.status === 'locked').length,
    };
  }, [data]);

  // Find drawer badge
  const drawerBadge = data?.badges.find(b => b.id === drawerBadgeId) || null;

  // Error state
  if (error) {
    return (
      <main className="min-h-dvh p-6 gradient-page flex items-center justify-center">
        <Card className="text-center">
          <CardTitle>Error loading badges</CardTitle>
          <CardContent>
            <p className="text-muted-foreground">Failed to fetch badges data.</p>
            <Button onClick={loadBadges} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">Badges</h1>

        {/* Streak Summary */}
        {SHOW_STREAK && data?.streak && !loading && (
          <StreakSummary streak={data.streak} onViewed={handleStreakViewed} />
        )}

        {/* Tabs */}
        <BadgeTabs
          selected={viewParam}
          onSelect={handleViewChange}
          counts={counts}
        />

        {/* Badge Grid */}
        <BadgeGrid
          badges={data?.badges || []}
          selectedView={viewParam}
          loading={loading}
          onBadgeClick={handleBadgeClick}
        />

        {/* Challenges */}
        {SHOW_CHALLENGES && data?.challenges && data.challenges.length > 0 && !loading && (
          <ChallengeList
            challenges={data.challenges}
            onCompleteStep={handleCompleteStep}
          />
        )}
      </div>

      {/* Details Drawer */}
      <BadgeDetailsDrawer
        badge={drawerBadge}
        open={drawerBadgeId !== null}
        onClose={handleCloseDrawer}
      />
    </main>
  );
}

