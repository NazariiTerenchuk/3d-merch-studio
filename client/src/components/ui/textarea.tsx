import * as React from 'react';
import { cn } from '@/lib/utils';
import { fieldClass } from './field-styles';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea className={cn(fieldClass, 'min-h-[88px] py-2.5', className)} ref={ref} {...props} />
));
Textarea.displayName = 'Textarea';

export { Textarea };
