import * as React from "react"
import { cn } from "../utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: number
}

export function Avatar({ src, alt, fallback, size = 36, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn("inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary text-secondary-foreground", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-medium">{fallback}</span>
      )}
    </div>
  )
}


