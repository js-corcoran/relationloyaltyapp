import { http, HttpResponse } from 'msw';
import homeSeed from '@/seed/home.json';
import rewardsSeed from '@/seed/rewards.json';
import offersSeed from '@/seed/offers.json';
import tiersSeed from '@/seed/tiers.json';
import historySeed from '@/seed/history.json';
import badgesSeed from '@/seed/badges.json';
import goalsSeed from '@/seed/goals.json';
import supportSeed from '@/seed/support.json';
import preferencesSeed from '@/seed/preferences.json';
import navSeed from '@/seed/nav.json';

let accountContext = homeSeed.accountContext.value;
let rewardsData = { ...rewardsSeed };
let offersData = [...offersSeed.offers];
let badgesData = { ...badgesSeed, badges: [...badgesSeed.badges], challenges: [...badgesSeed.challenges] };
let goalsData = { ...goalsSeed, goals: [...goalsSeed.goals] };
let preferencesData = { ...preferencesSeed };
let navData = { ...navSeed };

// Helper to calculate ETA days for goals
function calculateEtaDays(goal: any, roundUpsMonthly: number) {
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return 0;
  
  const autosavePerMonth = goal.autosave.enabled 
    ? goal.autosave.amount * (goal.autosave.cadence === 'weekly' ? 4.33 : 1)
    : 0;
  const roundUpsContrib = goal.roundUpsEnabled ? roundUpsMonthly : 0;
  const totalPerMonth = autosavePerMonth + roundUpsContrib;
  
  if (totalPerMonth <= 0) return null; // No auto contributions
  return Math.ceil((remaining / totalPerMonth) * 30);
}

// Helper to compute callback window times
function computeCallbackWindow(window: string): { start: string; end: string } {
  const now = new Date();
  const today = new Date(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (window === 'today_am') {
    today.setHours(8, 0, 0, 0);
    const end = new Date(today);
    end.setHours(12, 0, 0, 0);
    return { start: today.toISOString(), end: end.toISOString() };
  } else if (window === 'today_pm') {
    today.setHours(13, 0, 0, 0);
    const end = new Date(today);
    end.setHours(17, 0, 0, 0);
    return { start: today.toISOString(), end: end.toISOString() };
  } else if (window === 'tomorrow_am') {
    tomorrow.setHours(8, 0, 0, 0);
    const end = new Date(tomorrow);
    end.setHours(12, 0, 0, 0);
    return { start: tomorrow.toISOString(), end: end.toISOString() };
  } else { // tomorrow_pm
    tomorrow.setHours(13, 0, 0, 0);
    const end = new Date(tomorrow);
    end.setHours(17, 0, 0, 0);
    return { start: tomorrow.toISOString(), end: end.toISOString() };
  }
}

export const handlers = [
  http.get('/api/home', () => {
    return HttpResponse.json({ ...homeSeed, accountContext: { value: accountContext } });
  }),
  http.get('/api/rewards/overview', () => {
    return HttpResponse.json({ ...rewardsData, accountContext });
  }),
  http.post('/api/rewards/redeem', async ({ request }) => {
    try {
      const body = (await request.json()) as { amountPoints: number; destination: string; accountContext: string };
      const { amountPoints, destination } = body;
      
      // Validate
      if (amountPoints < rewardsData.redemptionRules.minPoints) {
        return HttpResponse.json({ error: 'Below minimum' }, { status: 400 });
      }
      if (amountPoints % rewardsData.redemptionRules.step !== 0) {
        return HttpResponse.json({ error: 'Invalid step' }, { status: 400 });
      }
      if (amountPoints > rewardsData.points) {
        return HttpResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }
      
      // Process redemption
      const amountDollars = +(amountPoints * rewardsData.usdPerPoint).toFixed(2);
      const creditBy = new Date();
      creditBy.setDate(creditBy.getDate() + rewardsData.redemptionRules.creditByDays);
      const newPointsBalance = rewardsData.points - amountPoints;
      
      // Update in-memory state
      rewardsData.points = newPointsBalance;
      
      return HttpResponse.json({
        id: `r_${Date.now()}`,
        amountPoints,
        amountDollars,
        destination,
        expectedCreditBy: creditBy.toISOString().slice(0, 10),
        newPointsBalance,
      });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.put('/api/account-context', async ({ request }) => {
    try {
      const body = (await request.json()) as { value: string };
      if (typeof body?.value === 'string') accountContext = body.value;
      return HttpResponse.json({ ok: true });
    } catch {
      return HttpResponse.json({ ok: false }, { status: 400 });
    }
  }),
  http.get('/api/offers', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase();
    const category = url.searchParams.get('category');
    
    let filtered = offersData.filter(o => new Date(o.expires) >= new Date()); // hide expired
    
    if (q) {
      filtered = filtered.filter(o => 
        o.merchant.toLowerCase().includes(q) || 
        o.category.toLowerCase().includes(q)
      );
    }
    
    if (category && category !== 'All') {
      filtered = filtered.filter(o => o.category === category);
    }
    
    // Sort by valueScore desc
    filtered.sort((a, b) => b.valueScore - a.valueScore);
    
    return HttpResponse.json(filtered);
  }),
  http.post('/api/offers/:id/activate', async ({ params, request }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as { active: boolean };
      const offerIndex = offersData.findIndex(o => o.id === id);
      
      if (offerIndex === -1) {
        return HttpResponse.json({ error: 'Offer not found' }, { status: 404 });
      }
      
      offersData[offerIndex].active = body.active;
      
      return HttpResponse.json({
        id: offersData[offerIndex].id,
        active: offersData[offerIndex].active,
      });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.post('/api/offers/activate-all', async ({ request }) => {
    try {
      const body = (await request.json()) as { q?: string; category?: string; accountContext: string };
      const q = body.q?.toLowerCase();
      const category = body.category;
      
      // Filter same as GET /api/offers
      let filtered = offersData.filter(o => new Date(o.expires) >= new Date());
      
      if (q) {
        filtered = filtered.filter(o => 
          o.merchant.toLowerCase().includes(q) || 
          o.category.toLowerCase().includes(q)
        );
      }
      
      if (category && category !== 'All') {
        filtered = filtered.filter(o => o.category === category);
      }
      
      // Only activate inactive ones
      const toActivate = filtered.filter(o => !o.active);
      const updatedIds: string[] = [];
      
      toActivate.forEach(offer => {
        const index = offersData.findIndex(o => o.id === offer.id);
        if (index !== -1) {
          offersData[index].active = true;
          updatedIds.push(offer.id);
        }
      });
      
      return HttpResponse.json({ updatedIds });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.get('/api/tiers', () => {
    return HttpResponse.json(tiersSeed);
  }),
  http.get('/api/rewards/history', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const q = url.searchParams.get('q')?.toLowerCase();
    const sort = url.searchParams.get('sort') || 'recent';
    const cursor = url.searchParams.get('cursor');

    let filtered = [...historySeed.items];

    // Filter by type
    if (type && type !== 'all') {
      filtered = filtered.filter(item => item.type === type);
    }

    // Filter by date range
    if (from) {
      filtered = filtered.filter(item => item.timestamp >= from);
    }
    if (to) {
      const toEnd = new Date(to);
      toEnd.setDate(toEnd.getDate() + 1); // Include entire 'to' day
      filtered = filtered.filter(item => item.timestamp < toEnd.toISOString());
    }

    // Filter by search query
    if (q) {
      filtered = filtered.filter(item => 
        item.desc.toLowerCase().includes(q) ||
        (item.merchant && item.merchant.toLowerCase().includes(q))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.timestamp.localeCompare(b.timestamp);
        case 'amount_desc':
          return Math.abs(b.points) - Math.abs(a.points);
        case 'amount_asc':
          return Math.abs(a.points) - Math.abs(b.points);
        case 'recent':
        default:
          return b.timestamp.localeCompare(a.timestamp);
      }
    });

    // Pagination
    const pageSize = 25;
    const page = cursor ? parseInt(atob(cursor), 10) : 0;
    const start = page * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end);
    const nextCursor = end < filtered.length ? btoa(String(page + 1)) : null;

    return HttpResponse.json({
      items,
      nextCursor,
      total: filtered.length,
    });
  }),
  http.get('/api/rewards/badges', () => {
    return HttpResponse.json({
      ...badgesData,
      accountContext,
    });
  }),
  http.post('/api/rewards/challenges/:id/step', async ({ params }) => {
    try {
      const { id } = params;
      const challengeIndex = badgesData.challenges.findIndex(c => c.id === id);

      if (challengeIndex === -1) {
        return HttpResponse.json({ error: 'Challenge not found' }, { status: 404 });
      }

      const challenge = badgesData.challenges[challengeIndex];
      
      // Increment stepsDone
      challenge.stepsDone = Math.min(challenge.stepsDone + 1, challenge.stepsTotal);

      let badgeEarned = false;

      // If challenge complete, mark related badge as earned
      if (challenge.stepsDone === challenge.stepsTotal) {
        const badgeIndex = badgesData.badges.findIndex(b => b.id === challenge.relatedBadgeId);
        if (badgeIndex !== -1) {
          badgesData.badges[badgeIndex].status = 'earned';
          badgesData.badges[badgeIndex].earnedAt = new Date().toISOString().slice(0, 10);
          badgesData.badges[badgeIndex].progressPct = 100;
          badgeEarned = true;
        }
      }

      return HttpResponse.json({
        id: challenge.id,
        stepsDone: challenge.stepsDone,
        badgeEarned,
      });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.get('/api/goals', () => {
    return HttpResponse.json({
      ...goalsData,
      accountContext,
    });
  }),
  http.post('/api/goals', async ({ request }) => {
    try {
      const body = (await request.json()) as { name: string; target: number; icon?: string | null; accountContext: string };
      
      // Validate
      if (!body.name || body.name.trim().length === 0 || body.name.length > 40) {
        return HttpResponse.json({ error: 'Name must be 1-40 characters' }, { status: 400 });
      }
      if (body.target < 50) {
        return HttpResponse.json({ error: 'Target must be at least $50' }, { status: 400 });
      }
      
      // Check for duplicate name (case-insensitive)
      const existingGoal = goalsData.goals.find(g => 
        g.name.toLowerCase() === body.name.toLowerCase() && g.status === 'active'
      );
      if (existingGoal) {
        return HttpResponse.json({ error: 'A goal with this name already exists' }, { status: 400 });
      }

      // Create new goal
      const newGoal = {
        id: `g${Date.now()}`,
        name: body.name,
        icon: body.icon || '🎯',
        target: body.target,
        saved: 0,
        etaDays: null, // No contributions yet
        status: 'active' as const,
        accountContext: body.accountContext as any,
        autosave: {
          enabled: false,
          amount: goalsData.autoSaveDefaults.amount,
          cadence: goalsData.autoSaveDefaults.cadence,
          nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        },
        roundUpsEnabled: false,
      };

      goalsData.goals.push(newGoal);
      return HttpResponse.json(newGoal);
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.post('/api/goals/:id/contribute', async ({ params, request }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as { amount: number };
      
      const goalIndex = goalsData.goals.findIndex(g => g.id === id);
      if (goalIndex === -1) {
        return HttpResponse.json({ error: 'Goal not found' }, { status: 404 });
      }

      const goal = goalsData.goals[goalIndex];
      
      // Validate
      if (body.amount < 1) {
        return HttpResponse.json({ error: 'Amount must be at least $1' }, { status: 400 });
      }

      // Add contribution (allow overshoot but clamp to target)
      goal.saved = Math.min(goal.saved + body.amount, goal.target);
      
      // Recalculate ETA
      goal.etaDays = calculateEtaDays(goal, goalsData.roundUps.estimateMonthly);

      return HttpResponse.json({
        goalId: goal.id,
        newSaved: goal.saved,
      });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.put('/api/goals/:id/autosave', async ({ params, request }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as { enabled: boolean; amount: number; cadence: string; nextRun: string };
      
      const goalIndex = goalsData.goals.findIndex(g => g.id === id);
      if (goalIndex === -1) {
        return HttpResponse.json({ error: 'Goal not found' }, { status: 404 });
      }

      const goal = goalsData.goals[goalIndex];
      
      // Validate
      if (body.enabled && body.amount < 5) {
        return HttpResponse.json({ error: 'Auto-save amount must be at least $5' }, { status: 400 });
      }

      // Update config
      goal.autosave = {
        enabled: body.enabled,
        amount: body.amount,
        cadence: body.cadence as 'weekly' | 'monthly',
        nextRun: body.nextRun,
      };

      // Recalculate ETA
      goal.etaDays = calculateEtaDays(goal, goalsData.roundUps.estimateMonthly);

      return HttpResponse.json(goal.autosave);
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.post('/api/goals/:id/archive', async ({ params }) => {
    try {
      const { id } = params;
      const goalIndex = goalsData.goals.findIndex(g => g.id === id);
      
      if (goalIndex === -1) {
        return HttpResponse.json({ error: 'Goal not found' }, { status: 404 });
      }

      goalsData.goals[goalIndex].status = 'archived';

      return HttpResponse.json({
        goalId: id as string,
        status: 'archived' as const,
      });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.put('/api/roundups', async ({ request }) => {
    try {
      const body = (await request.json()) as { enabled: boolean };
      
      goalsData.roundUps.enabled = body.enabled;

      // Recalculate ETA for all goals
      goalsData.goals.forEach(goal => {
        goal.etaDays = calculateEtaDays(goal, goalsData.roundUps.estimateMonthly);
      });

      return HttpResponse.json(goalsData.roundUps);
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.get('/api/support/profile', () => {
    return HttpResponse.json(supportSeed.supportProfile);
  }),
  http.post('/api/support/callbacks', async ({ request }) => {
    try {
      const body = (await request.json()) as { phone: string; reason: string; window: string };
      
      // Validate phone (simple: 10-15 digits after stripping)
      const digitsOnly = body.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return HttpResponse.json({ error: 'Enter a valid phone number' }, { status: 400 });
      }
      
      // Validate reason and window
      if (!body.reason || !body.window) {
        return HttpResponse.json({ error: 'Reason and window are required' }, { status: 400 });
      }
      
      // Compute window times
      const { start, end } = computeCallbackWindow(body.window);
      
      return HttpResponse.json({
        id: `cb_${Date.now()}`,
        windowStart: start,
        windowEnd: end,
        status: 'scheduled' as const,
      });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.post('/api/support/secure-messages', async ({ request }) => {
    try {
      const body = (await request.json()) as { subject: string; body: string };
      
      // Validate subject (3-120 chars)
      if (!body.subject || body.subject.trim().length < 3 || body.subject.trim().length > 120) {
        return HttpResponse.json({ error: 'Subject must be 3-120 characters' }, { status: 400 });
      }
      
      // Validate body (5-2000 chars)
      if (!body.body || body.body.trim().length < 5 || body.body.trim().length > 2000) {
        return HttpResponse.json({ error: 'Message must be 5-2000 characters' }, { status: 400 });
      }
      
      // Generate case ID
      const caseId = `C-${Math.floor(Math.random() * 100000)}`;
      
      return HttpResponse.json({
        id: caseId,
        subject: body.subject.trim(),
        body: body.body.trim(),
        createdAt: new Date().toISOString(),
        status: 'open' as const,
      });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.get('/api/support/faq', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase();
    
    if (!q || q.trim().length === 0) {
      // Return all articles if no query
      return HttpResponse.json(supportSeed.faq);
    }
    
    // Filter by title, body, or tags (case-insensitive)
    const filtered = supportSeed.faq.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(q);
      const bodyMatch = article.body.toLowerCase().includes(q);
      const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(q));
      return titleMatch || bodyMatch || tagsMatch;
    });
    
    // Simple relevance sort: exact title match first, then partial
    filtered.sort((a, b) => {
      const aExact = a.title.toLowerCase() === q ? 1 : 0;
      const bExact = b.title.toLowerCase() === q ? 1 : 0;
      return bExact - aExact;
    });
    
    return HttpResponse.json(filtered);
  }),
  http.get('/api/preferences', () => {
    return HttpResponse.json(preferencesData);
  }),
  http.patch('/api/preferences', async ({ request }) => {
    try {
      const patch = (await request.json()) as Partial<any>;

      // Validate language
      if (patch.language && !['en', 'es', 'fr'].includes(patch.language)) {
        return HttpResponse.json({ error: 'Invalid language' }, { status: 400 });
      }

      // Validate nudgeSensitivity
      if (patch.nudgeSensitivity && !['low', 'medium', 'high'].includes(patch.nudgeSensitivity)) {
        return HttpResponse.json({ error: 'Invalid nudge sensitivity' }, { status: 400 });
      }

      // Validate quietHours
      if (patch.quietHours) {
        const qh = patch.quietHours;
        if (qh.enabled) {
          if (!qh.start || !qh.end) {
            return HttpResponse.json({ error: 'Quiet hours start and end are required when enabled' }, { status: 400 });
          }
          // Validate HH:MM format
          const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;
          if (!timeRegex.test(qh.start) || !timeRegex.test(qh.end)) {
            return HttpResponse.json({ error: 'Use HH:MM format (e.g., 09:30)' }, { status: 400 });
          }
          // Validate start !== end
          if (qh.start === qh.end) {
            return HttpResponse.json({ error: "Start and end can't be the same" }, { status: 400 });
          }
        }
      }

      // Validate interests
      if (patch.interests) {
        const validInterests = ['Grocery', 'Dining', 'Fuel', 'Travel', 'Retail', 'Services'];
        if (patch.interests.length > 6) {
          return HttpResponse.json({ error: 'Maximum 6 interests allowed' }, { status: 400 });
        }
        for (const interest of patch.interests) {
          if (!validInterests.includes(interest)) {
            return HttpResponse.json({ error: `Invalid interest: ${interest}` }, { status: 400 });
          }
        }
        // Check for duplicates
        const uniqueInterests = new Set(patch.interests);
        if (uniqueInterests.size !== patch.interests.length) {
          return HttpResponse.json({ error: 'Duplicate interests not allowed' }, { status: 400 });
        }
      }

      // Merge patch with current preferences
      preferencesData = {
        ...preferencesData,
        ...patch,
        version: preferencesData.version + 1, // Increment version
      };

      return HttpResponse.json(preferencesData);
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  http.post('/api/preferences/export', () => {
    try {
      // Build export JSON with preferences + mock member/points snapshot
      const exportData = {
        exportedAt: new Date().toISOString(),
        preferences: preferencesData,
        member: {
          name: 'Gold Member',
          tier: homeSeed.tierBadge.tier,
          since: '2024-01-15',
        },
        points: {
          balance: rewardsData.balance,
          ytd: 8200,
        },
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      return new HttpResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="settings-export-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json"`,
        },
      });
    } catch {
      return HttpResponse.json({ error: 'Export failed' }, { status: 500 });
    }
  }),

  // Navigation API
  http.get('/api/nav', () => {
    return HttpResponse.json(navData);
  }),
  http.put('/api/nav/badges/:id', async ({ params, request }) => {
    try {
      const { id } = params;
      const { count } = (await request.json()) as { count: number | null };

      // Find and update badge count
      const primaryItem = navData.primary.find((item: any) => item.id === id);
      const secondaryItem = navData.secondary.find((item: any) => item.id === id);

      if (primaryItem) {
        primaryItem.badgeCount = count;
      } else if (secondaryItem) {
        secondaryItem.badgeCount = count;
      } else {
        return HttpResponse.json({ error: 'Nav item not found' }, { status: 404 });
      }

      return HttpResponse.json({ success: true });
    } catch {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
];


