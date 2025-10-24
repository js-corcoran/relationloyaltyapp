import * as React from 'react';

interface RedemptionSummaryProps {
  points: number;
  dollars: number;
  destination: string;
  expectedCreditBy: string;
}

export function RedemptionSummary({ points, dollars, destination, expectedCreditBy }: RedemptionSummaryProps) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Points to redeem</span>
        <span className="font-medium">{points.toLocaleString()} pts</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Dollar value</span>
        <span className="font-medium">${dollars.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Destination</span>
        <span className="font-medium">{destination === 'statement' ? 'Statement Credit' : 'Transfer to Savings'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Fees</span>
        <span className="font-medium">$0.00</span>
      </div>
      <div className="border-t pt-3">
        <div className="text-sm font-medium">Expected credit by {expectedCreditBy}</div>
      </div>
    </div>
  );
}

