"use client";
import * as React from 'react';
import { AccountContextValue, HomePayload, homeService } from '@/services/home.service';
import { RewardsOverview, rewardsService, RedemptionRequest, RedemptionResponse } from '@/services/rewards.service';
import { Offer, offersService, OffersQuery, ActivateAllResponse } from '@/services/offers.service';
import { TiersPayload, tiersService } from '@/services/tiers.service';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AppState {
  status: Status;
  rewardsStatus: Status;
  offersStatus: Status;
  tiersStatus: Status;
  accountContext: AccountContextValue;
  home: HomePayload | null;
  rewards: RewardsOverview | null;
  offers: Offer[] | null;
  tiers: TiersPayload | null;
  loadHome: () => Promise<void>;
  loadRewards: () => Promise<void>;
  loadOffers: (query?: OffersQuery) => Promise<void>;
  loadTiers: () => Promise<void>;
  activateOffer: (id: string, active: boolean) => Promise<void>;
  activateAll: (query: OffersQuery) => Promise<ActivateAllResponse>;
  redeem: (req: RedemptionRequest) => Promise<RedemptionResponse>;
  setAccountContext: (v: AccountContextValue) => Promise<void>;
}

const AppContext = React.createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<Status>('idle');
  const [rewardsStatus, setRewardsStatus] = React.useState<Status>('idle');
  const [offersStatus, setOffersStatus] = React.useState<Status>('idle');
  const [tiersStatus, setTiersStatus] = React.useState<Status>('idle');
  const [home, setHome] = React.useState<HomePayload | null>(null);
  const [rewards, setRewards] = React.useState<RewardsOverview | null>(null);
  const [offers, setOffers] = React.useState<Offer[] | null>(null);
  const [tiers, setTiers] = React.useState<TiersPayload | null>(null);
  const accountContext = home?.accountContext.value ?? rewards?.accountContext ?? 'overview';

  const loadHome = React.useCallback(async () => {
    setStatus('loading');
    try {
      const data = await homeService.getHome();
      setHome(data);
      setStatus('success');
      console.log('home_viewed', { tier: data.member.tier, accountContext: data.accountContext.value });
    } catch (e) {
      setStatus('error');
    }
  }, []);

  const loadRewards = React.useCallback(async () => {
    setRewardsStatus('loading');
    try {
      const data = await rewardsService.getOverview();
      setRewards(data);
      setRewardsStatus('success');
      console.log('rewards_viewed', { accountContext: data.accountContext, points: data.points });
    } catch (e) {
      setRewardsStatus('error');
    }
  }, []);

  const redeem = React.useCallback(async (req: RedemptionRequest): Promise<RedemptionResponse> => {
    const response = await rewardsService.redeem(req);
    // Update local rewards state with new balance
    if (rewards) {
      setRewards({
        ...rewards,
        points: response.newPointsBalance,
        recentActivity: [
          {
            id: response.id,
            type: 'redeem',
            points: response.amountPoints,
            dollars: response.amountDollars,
            when: new Date().toISOString().slice(0, 10),
            desc: response.destination === 'statement' ? 'Statement Credit' : 'Transfer to Savings',
          },
          ...rewards.recentActivity,
        ],
      });
    }
    console.log('redeem_confirmed', {
      amountPoints: response.amountPoints,
      destination: response.destination,
      expectedCreditBy: response.expectedCreditBy,
    });
    return response;
  }, [rewards]);

  const loadOffers = React.useCallback(async (query?: OffersQuery) => {
    setOffersStatus('loading');
    try {
      const q = query || { accountContext };
      const data = await offersService.list(q);
      setOffers(data);
      setOffersStatus('success');
      const inactiveCount = data.filter(o => !o.active).length;
      console.log('offers_viewed', { accountContext: q.accountContext, category: q.category || 'All', total: data.length, inactiveCount });
    } catch (e) {
      setOffersStatus('error');
    }
  }, [accountContext]);

  const activateOffer = React.useCallback(async (id: string, active: boolean) => {
    try {
      const response = await offersService.activateOffer(id, active);
      // Optimistic update
      if (offers) {
        setOffers(offers.map(o => o.id === id ? { ...o, active: response.active } : o));
      }
      console.log('offer_toggled', { offerId: id, active: response.active });
    } catch (e) {
      console.error('Failed to toggle offer:', e);
      // Rollback on error
      if (offers) {
        setOffers(offers.map(o => o.id === id ? { ...o, active: !active } : o));
      }
      throw e;
    }
  }, [offers]);

  const activateAll = React.useCallback(async (query: OffersQuery): Promise<ActivateAllResponse> => {
    const response = await offersService.activateAll(query);
    // Update local state
    if (offers) {
      setOffers(offers.map(o => response.updatedIds.includes(o.id) ? { ...o, active: true } : o));
    }
    console.log('offers_activate_all_clicked', { affectedCount: response.updatedIds.length });
    return response;
  }, [offers]);

  const loadTiers = React.useCallback(async () => {
    setTiersStatus('loading');
    try {
      const data = await tiersService.getTiers();
      setTiers(data);
      setTiersStatus('success');
      const inGrace = data.memberTier.graceEndsAt && new Date(data.memberTier.graceEndsAt) >= new Date();
      console.log('tiers_viewed', { tier: data.memberTier.tier, progressPct: data.memberTier.progressPct, inGrace: !!inGrace });
    } catch (e) {
      setTiersStatus('error');
    }
  }, []);

  const setAccountContext = React.useCallback(async (v: AccountContextValue) => {
    await homeService.setAccountContext(v);
    await Promise.all([loadHome(), loadRewards(), loadOffers({ accountContext: v }), loadTiers()]);
    console.log('home_account_context_changed', { to: v });
  }, [loadHome, loadRewards, loadOffers, loadTiers]);

  const value: AppState = {
    status,
    rewardsStatus,
    offersStatus,
    tiersStatus,
    accountContext,
    home,
    rewards,
    offers,
    tiers,
    loadHome,
    loadRewards,
    loadOffers,
    loadTiers,
    activateOffer,
    activateAll,
    redeem,
    setAccountContext,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


