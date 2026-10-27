import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fieldClass } from './field-styles';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/** Native select styled like Input: accessible and keyboard-friendly out of the box. */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select ref={ref} className={cn(fieldClass, 'h-10 cursor-pointer appearance-none pr-9', className)} {...props}>
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  </div>
));
Select.displayName = 'Select';

export { Select };
