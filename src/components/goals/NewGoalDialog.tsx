"use client";
import * as React from 'react';
import { Button, Input, Label, MoneyInput } from '@/design-system';
import { cn } from '@/design-system';
import { X } from 'lucide-react';
import type { CreateGoalRequest } from '@/services/goals.service';

export interface NewGoalDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (req: Omit<CreateGoalRequest, 'accountContext'>) => Promise<void>;
  existingGoalNames: string[];
}

export function NewGoalDialog({ open, onClose, onSubmit, existingGoalNames }: NewGoalDialogProps) {
  const [name, setName] = React.useState('');
  const [target, setTarget] = React.useState(0);
  const [icon, setIcon] = React.useState('');
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [targetError, setTargetError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (open) {
      setName('');
      setTarget(0);
      setIcon('');
      setNameError(null);
      setTargetError(null);
      setSubmitting(false);
      
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const validateName = (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Name is required';
    }
    if (value.length > 40) {
      return 'Name must be 40 characters or less';
    }
    if (existingGoalNames.some(n => n.toLowerCase() === value.toLowerCase())) {
      return 'A goal with this name already exists';
    }
    return null;
  };

  const validateTarget = (value: number): string | null => {
    if (value < 50) {
      return 'Target must be at least $50';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nErr = validateName(name);
    const tErr = validateTarget(target);
    
    setNameError(nErr);
    setTargetError(tErr);

    if (nErr || tErr) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        target,
        icon: icon.trim() || null,
      });
      onClose();
    } catch (e: any) {
      console.error('Failed to create goal:', e);
      setNameError(e.message || 'Failed to create goal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      )}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="new-goal-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-background shadow-lg rounded-lg p-6 w-full max-w-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        )}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="new-goal-title" className="text-xl font-semibold">
            New Goal
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            ref={closeButtonRef}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="goal-name">
              Goal Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="goal-name"
              ref={nameInputRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              onBlur={() => setNameError(validateName(name))}
              placeholder="e.g., Emergency Fund"
              maxLength={40}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : undefined}
              className={cn(nameError && "border-destructive")}
            />
            {nameError && (
              <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
                {nameError}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="goal-target">
              Target Amount <span className="text-destructive">*</span>
            </Label>
            <MoneyInput
              id="goal-target"
              value={target}
              onChange={(val) => {
                setTarget(val);
                setTargetError(null);
              }}
              min={50}
              error={targetError}
              placeholder="50.00"
            />
          </div>

          <div>
            <Label htmlFor="goal-icon">Icon (optional)</Label>
            <Input
              id="goal-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., 🎯 or any emoji"
              maxLength={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add an emoji to personalize your goal
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={submitting || !name || target < 50}
            >
              {submitting ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

