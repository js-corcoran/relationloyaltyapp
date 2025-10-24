import * as React from 'react';
import { Card, CardContent, Button } from '@/design-system';
import { PhoneIncoming } from 'lucide-react';

export interface CallbackCardProps {
  hours: string;
  onRequestClick: () => void;
}

export function CallbackCard({ hours, onRequestClick }: CallbackCardProps) {
  return (
    <Card className="card-hover">
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
            <PhoneIncoming className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Request a Callback</h3>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            We'll call you at your preferred time.
          </p>
          <p className="text-muted-foreground">Available {hours}</p>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={onRequestClick}
        >
          Request callback
        </Button>
      </CardContent>
    </Card>
  );
}

