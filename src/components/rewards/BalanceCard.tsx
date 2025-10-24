import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/design-system';
import { PointsBalance } from '../rewards/PointsBalance';

interface BalanceCardProps {
  points: number;
  usdPerPoint: number;
  onRedeemClick: () => void;
  disabled?: boolean;
}

export function BalanceCard({ points, usdPerPoint, onRedeemClick, disabled }: BalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <PointsBalance points={points} usdPerPoint={usdPerPoint} />
        <Button onClick={onRedeemClick} disabled={disabled} data-testid="redeem-open">
          Redeem
        </Button>
      </CardContent>
    </Card>
  );
}

