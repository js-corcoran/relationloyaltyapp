"use client";
import * as React from 'react';
import { Card, CardContent, Button } from '@/design-system';
import { TrendingUp, Gift, Target } from 'lucide-react';
import type { Goal } from '@/services/goals.service';

export interface WellnessTipsProps {
  goals: Goal[];
}

interface Tip {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  route: string;
}

export function WellnessTips({ goals }: WellnessTipsProps) {
  const activeGoals = goals.filter(g => g.status === 'active');
  const hasGoals = activeGoals.length > 0;
  const hasCompletedGoal = activeGoals.some(g => g.saved >= g.target);

  const allTips: Tip[] = [
    {
      id: 'tip-offers',
      icon: <Gift className="h-5 w-5 text-blue-600" />,
      title: 'Boost Your Savings',
      description: 'Activate cashback offers to earn more toward your goals.',
      cta: 'View Offers',
      route: '/offers',
    },
    {
      id: 'tip-tiers',
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      title: 'Advance Your Tier',
      description: 'Reach Gold tier for higher rewards and exclusive benefits.',
      cta: 'View Tiers',
      route: '/tiers',
    },
    {
      id: 'tip-create',
      icon: <Target className="h-5 w-5 text-purple-600" />,
      title: 'Start Your First Goal',
      description: 'Create an emergency fund goal to secure your financial future.',
      cta: 'Create Goal',
      route: '#create-goal',
    },
  ];

  // Filter tips based on context
  let displayTips: Tip[] = [];
  if (!hasGoals) {
    displayTips = [allTips[2], allTips[0]]; // Create goal + offers
  } else if (hasCompletedGoal) {
    displayTips = [allTips[1], allTips[0]]; // Tiers + offers
  } else {
    displayTips = [allTips[0], allTips[1]]; // Offers + tiers
  }

  const handleTipClick = (tip: Tip) => {
    console.log('wellness_tip_clicked', { tipId: tip.id, route: tip.route });
    if (tip.route === '#create-goal') {
      // This will be handled by parent component
      const event = new CustomEvent('create-goal-requested');
      window.dispatchEvent(event);
    } else {
      window.location.href = tip.route;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Wellness Tips</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayTips.map(tip => (
          <Card key={tip.id} className="card-hover">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  {tip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tip.description}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => handleTipClick(tip)}
              >
                {tip.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

