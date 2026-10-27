import * as React from 'react';
import { cn } from '@/lib/utils';

/** Grey surface the product (or print) sits on. Used for every product image in the app. */
const Stage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('relative overflow-hidden rounded-lg bg-stage', className)} {...props} />
));
Stage.displayName = 'Stage';

export { Stage };
