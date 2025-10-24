import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/design-system';
import { ActivityItem } from '@/services/rewards.service';

interface ActivityPreviewListProps {
  items: ActivityItem[];
}

export function ActivityPreviewList({ items }: ActivityPreviewListProps) {
  const preview = items.slice(0, 3);

  if (preview.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No activity yet.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Link
          href="/rewards/history"
          className="text-sm text-[color:rgb(var(--cta-primary-rgb))] hover:underline"
          onClick={() => console.log('rewards_history_link_clicked', {})}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {preview.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex-1">
                <div className="text-sm font-medium">{item.desc}</div>
                <div className="text-xs text-muted-foreground">{item.when}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${item.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.type === 'earn' ? '+' : '-'}
                  {item.points.toLocaleString()} pts
                </div>
                <div className="text-xs text-muted-foreground">${item.dollars.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

