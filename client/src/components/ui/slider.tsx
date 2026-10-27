import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: number;
  onValueChange: (value: number) => void;
}

/** Native range input; keeps keyboard support (arrows, Home/End) for free. */
const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, value, onValueChange, ...props }, ref) => (
  <input
    ref={ref}
    type="range"
    value={value}
    onChange={(e) => onValueChange(Number(e.target.value))}
    className={cn('h-1.5 w-full cursor-pointer accent-accent disabled:cursor-not-allowed', className)}
    {...props}
  />
));
Slider.displayName = 'Slider';

export { Slider };
