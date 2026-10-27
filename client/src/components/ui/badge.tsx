import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent' | 'success' | 'destructive' | 'outline';
}

const VARIANTS: Record<NonNullable<BadgeProps['variant']>, string> = {
  neutral: 'bg-stage text-foreground',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  destructive: 'bg-destructive/10 text-destructive',
  outline: 'border border-border text-muted-foreground',
};

function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs font-medium [&_svg]:size-3',
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
