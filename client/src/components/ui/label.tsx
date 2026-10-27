import * as React from 'react';
import { cn } from '@/lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, htmlFor, ...props }, ref) => (
  <label ref={ref} htmlFor={htmlFor} className={cn('text-sm font-medium text-foreground', className)} {...props} />
));
Label.displayName = 'Label';

export { Label };
