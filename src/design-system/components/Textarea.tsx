import * as React from "react";
import { cn } from "../utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | null;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, maxLength, value, ...props }, ref) => {
    const valueLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 resize-y",
            error && "border-destructive",
            className
          )}
          value={value}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : maxLength ? `${props.id}-count` : undefined}
          {...props}
        />
        {maxLength && (
          <p id={`${props.id}-count`} className="text-xs text-muted-foreground mt-1 text-right">
            {valueLength} / {maxLength} characters
          </p>
        )}
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-destructive mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

