import * as React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/** Toggleable pill used for filters. Selected state uses the accent like every other selection. */
const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(({ className, selected, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-pressed={selected}
    className={cn(
      'inline-flex h-9 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-colors',
      selected
        ? 'border-accent bg-accent/8 text-accent'
        : 'border-border bg-background text-foreground hover:border-foreground/40',
      className
    )}
    {...props}
  />
));
Chip.displayName = 'Chip';

export { Chip };
