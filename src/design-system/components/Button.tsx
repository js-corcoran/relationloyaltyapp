"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[.99]",
  {
    variants: {
      variant: {
        primary:
          "rounded-full border-2 px-4 py-2 text-sm font-medium text-[color:rgb(var(--cta-primary-rgb))] border-[color:rgb(var(--cta-primary-rgb))] bg-transparent hover:text-white hover:bg-[color:rgb(var(--cta-primary-rgb))]",
        secondary:
          "rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50",
        ghost: "rounded-md px-3 py-2 text-sm hover:bg-muted",
        outline: "rounded-md border px-3 py-2 text-sm bg-transparent hover:bg-gray-50",
        destructive: "rounded-md px-3 py-2 text-sm text-white bg-destructive hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

