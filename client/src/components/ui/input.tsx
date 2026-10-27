import * as React from 'react';
import { cn } from '@/lib/utils';
import { fieldClass } from './field-styles';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn(fieldClass, 'h-10', className)} ref={ref} {...props} />
));
Input.displayName = 'Input';

export { Input };
