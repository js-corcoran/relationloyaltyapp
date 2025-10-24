import * as React from 'react';
import { Card, CardContent, Button, Pill } from '@/design-system';
import { Phone } from 'lucide-react';

export interface PriorityLineCardProps {
  phone: string;
  hours: string;
  slaMinutes: number;
  onCallClick: () => void;
}

export function PriorityLineCard({ phone, hours, slaMinutes, onCallClick }: PriorityLineCardProps) {
  const slaText = slaMinutes <= 2 ? 'Under 2 min' : `About ${slaMinutes} min`;
  const slaVariant = slaMinutes <= 2 ? 'success' as const : 'info' as const;

  return (
    <Card className="card-hover">
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
            <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Priority Line</h3>
            <Pill variant={slaVariant} className="mt-1 text-xs">
              Est. wait: {slaText}
            </Pill>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-mono text-base">{phone}</p>
          <p className="text-muted-foreground">{hours}</p>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={onCallClick}
          aria-describedby="priority-line-sla"
        >
          Call now
        </Button>
        <p id="priority-line-sla" className="sr-only">
          Estimated wait time: {slaText}. Available {hours}
        </p>
      </CardContent>
    </Card>
  );
}

