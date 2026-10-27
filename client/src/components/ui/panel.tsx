import * as React from 'react';
import { cn } from '@/lib/utils';

/** Bordered panel; the only container style besides Stage. No shadows: separation comes from hairlines. */
const Panel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-lg border bg-background', className)} {...props} />
));
Panel.displayName = 'Panel';

export { Panel };
