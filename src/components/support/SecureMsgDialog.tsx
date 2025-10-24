"use client";
import * as React from 'react';
import { Button, Input, Label, Textarea } from '@/design-system';
import { cn } from '@/design-system';
import { X } from 'lucide-react';

export interface SecureMsgDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (subject: string, body: string) => Promise<void>;
}

export function SecureMsgDialog({ open, onClose, onSubmit }: SecureMsgDialogProps) {
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [subjectError, setSubjectError] = React.useState<string | null>(null);
  const [bodyError, setBodyError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const subjectInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setSubject('');
      setBody('');
      setSubjectError(null);
      setBodyError(null);
      setSubmitting(false);

      setTimeout(() => {
        subjectInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const validateSubject = (value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 120) {
      return 'Subject must be 3-120 characters';
    }
    return null;
  };

  const validateBody = (value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed.length < 5 || trimmed.length > 2000) {
      return 'Message must be 5-2000 characters';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const subjErr = validateSubject(subject);
    const bodyErr = validateBody(body);

    setSubjectError(subjErr);
    setBodyError(bodyErr);

    if (subjErr || bodyErr) return;

    setSubmitting(true);
    try {
      await onSubmit(subject.trim(), body.trim());
      onClose();
    } catch (e: any) {
      console.error('Failed to send message:', e);
      setBodyError(e.message || 'Failed to send message');
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
      aria-labelledby="secure-msg-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-background shadow-lg rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        )}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="secure-msg-title" className="text-xl font-semibold">
            Send Secure Message
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="msg-subject">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="msg-subject"
              ref={subjectInputRef}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setSubjectError(null);
              }}
              onBlur={() => setSubjectError(validateSubject(subject))}
              placeholder="Brief description of your inquiry"
              maxLength={120}
              aria-invalid={!!subjectError}
              aria-describedby={subjectError ? "subject-error" : undefined}
              className={cn(subjectError && "border-destructive")}
            />
            {subjectError && (
              <p id="subject-error" className="text-sm text-destructive mt-1" role="alert">
                {subjectError}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="msg-body">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="msg-body"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setBodyError(null);
              }}
              onBlur={() => setBodyError(validateBody(body))}
              placeholder="Please provide details about your inquiry..."
              rows={6}
              maxLength={2000}
              error={bodyError}
            />
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">📎 Attachments</span> — Coming soon
            </p>
          </div>

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
              disabled={submitting || !subject || !body}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

