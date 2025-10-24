import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/design-system';

export function DestinationsExplainer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redemption Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm font-medium">Statement Credit</div>
          <div className="text-xs text-muted-foreground">
            Applied directly to your account balance. Reduces your current statement or next billing cycle.
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Transfer to Savings</div>
          <div className="text-xs text-muted-foreground">
            Deposited into your linked savings account. Helps you reach your savings goals faster.
          </div>
        </div>
        <Link href="/rewards/terms" className="text-sm text-[color:rgb(var(--cta-primary-rgb))] hover:underline inline-block">
          Learn more
        </Link>
      </CardContent>
    </Card>
  );
}

