"use client";
import * as React from "react";
import { cn } from "../utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <label className={cn("relative inline-flex h-6 w-10 cursor-pointer items-center", className)}>
        <input 
          ref={ref} 
          type="checkbox" 
          className="peer sr-only" 
          checked={checked} 
          onChange={handleChange}
          {...props} 
        />
        <span className="absolute inset-0 rounded-full bg-muted transition-colors peer-checked:bg-[color:rgb(var(--cta-primary-rgb))]" />
        <span className="relative left-0 inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </label>
    );
  }
);
Switch.displayName = "Switch";

