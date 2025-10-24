"use client";
import * as React from 'react';
import { Card, CardContent, CardTitle, Button } from '@/design-system';
import { cn } from '@/design-system';
import type { Challenge } from '@/services/badges.service';

export interface ChallengeListProps {
  challenges: Challenge[];
  onCompleteStep: (challengeId: string) => Promise<void>;
}

export function ChallengeList({ challenges, onCompleteStep }: ChallengeListProps) {
  const [completingId, setCompletingId] = React.useState<string | null>(null);

  if (challenges.length === 0) {
    return null;
  }

  const handleCompleteStep = async (challengeId: string) => {
    setCompletingId(challengeId);
    try {
      await onCompleteStep(challengeId);
    } catch (e) {
      console.error('Failed to complete challenge step:', e);
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle>Active Challenges</CardTitle>
        
        <div className="space-y-3">
          {challenges.map((challenge) => {
            const progressPct = (challenge.stepsDone / challenge.stepsTotal) * 100;
            const isComplete = challenge.stepsDone >= challenge.stepsTotal;
            const isCompleting = completingId === challenge.id;
            const dueDate = new Date(challenge.due);
            const isOverdue = dueDate < new Date();

            return (
              <div 
                key={challenge.id} 
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{challenge.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {challenge.stepsDone} / {challenge.stepsTotal} steps complete
                    </p>
                    <p className={cn(
                      "text-xs mt-1",
                      isOverdue ? "text-destructive" : "text-muted-foreground"
                    )}>
                      Due: {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  {!isComplete && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCompleteStep(challenge.id)}
                      disabled={isCompleting}
                    >
                      {isCompleting ? 'Completing...' : 'Complete Step'}
                    </Button>
                  )}
                </div>

                {/* Progress bar */}
                <div 
                  role="progressbar" 
                  aria-valuenow={progressPct} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                  aria-label={`${progressPct.toFixed(0)}% complete`}
                  className="w-full bg-muted rounded-full h-2 overflow-hidden"
                >
                  <div 
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      isComplete ? "bg-green-600" : "bg-blue-600"
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {isComplete && (
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Challenge complete! Badge earned.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

