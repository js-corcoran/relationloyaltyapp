import * as React from 'react';
import { Card, CardContent, Button } from '@/design-system';
import { MessageSquare } from 'lucide-react';

export interface SecureMessageCardProps {
  onStartClick: () => void;
}

export function SecureMessageCard({ onStartClick }: SecureMessageCardProps) {
  return (
    <Card className="card-hover">
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Secure Message</h3>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={onStartClick}
        >
          Start message
        </Button>
      </CardContent>
    </Card>
  );
}

