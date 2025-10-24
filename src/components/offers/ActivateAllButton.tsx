"use client";
import * as React from "react";
import { Button } from "@/design-system";
import { Check } from "lucide-react";

type ActivateAllState = "idle" | "activating" | "success";

export interface ActivateAllButtonProps {
  inactiveCount: number;
  onActivateAll: () => Promise<void>;
  className?: string;
}

export function ActivateAllButton({
  inactiveCount,
  onActivateAll,
  className,
}: ActivateAllButtonProps) {
  const [state, setState] = React.useState<ActivateAllState>("idle");
  const [progress, setProgress] = React.useState({ current: 0, total: 0 });

  const handleClick = async () => {
    if (state === "activating" || inactiveCount === 0) return;

    setState("activating");
    setProgress({ current: 0, total: inactiveCount });

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => ({
          ...prev,
          current: Math.min(prev.current + 1, prev.total),
        }));
      }, 100);

      await onActivateAll();

      clearInterval(progressInterval);
      setProgress({ current: inactiveCount, total: inactiveCount });
      setState("success");

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setState("idle");
      }, 2000);
    } catch (e) {
      console.error("Failed to activate all:", e);
      setState("idle");
    }
  };

  const getButtonText = () => {
    if (state === "activating") {
      return `Activating ${progress.current}/${progress.total}...`;
    }
    if (state === "success") {
      return "Activated";
    }
    return `Activate All (${inactiveCount})`;
  };

  const isDisabled = inactiveCount === 0 || state === "activating";

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      variant={state === "success" ? "secondary" : "primary"}
      className={className}
      data-testid="activate-all-button"
    >
      {state === "success" && <Check className="h-4 w-4 mr-1" />}
      {getButtonText()}
    </Button>
  );
}

