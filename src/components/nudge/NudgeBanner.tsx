import * as React from 'react';
import { Card, CardContent, Button } from '@/design-system';

export function NudgeBanner({ title, cta }: { title: string; cta: string }) {
  return (
    <Card className="glass-card">
      <CardContent className="flex items-center justify-between gap-4">
        <span className="font-medium">{title}</span>
        <Button size="sm" onClick={() => console.log('home_nba_cta_clicked')}>{cta}</Button>
      </CardContent>
    </Card>
  );
}


