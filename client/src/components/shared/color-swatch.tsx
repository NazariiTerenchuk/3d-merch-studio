import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Picks black or white for content drawn on top of the given hex color. */
export function contrastColor(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#22262E' : '#FFFFFF';
}

interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZES = { sm: 'size-3.5', md: 'size-8', lg: 'size-11' };

export function ColorSwatch({ color, size = 'sm', selected, onClick, className }: ColorSwatchProps) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/12',
    SIZES[size],
    className
  );

  if (!onClick) {
    return <span className={classes} style={{ backgroundColor: color }} title={color} />;
  }

  return (
    <button
      type="button"
      className={cn(
        classes,
        'cursor-pointer outline-offset-3 transition-shadow',
        selected
          ? 'shadow-[0_0_0_3px_var(--color-background),0_0_0_5px_var(--color-accent)]'
          : 'hover:shadow-[0_0_0_3px_var(--color-background),0_0_0_5px_var(--color-input)]'
      )}
      style={{ backgroundColor: color }}
      title={color}
      aria-label={`Колір ${color}`}
      aria-pressed={selected}
      onClick={onClick}>
      {selected && <Check className="size-4" style={{ color: contrastColor(color) }} />}
    </button>
  );
}

export function ColorSwatchList({ colors, max = 6 }: { colors: string[]; max?: number }) {
  const visible = colors.slice(0, max);
  const rest = colors.length - visible.length;

  return (
    <div className="flex items-center gap-1.5">
      {visible.map((c) => (
        <ColorSwatch key={c} color={c} />
      ))}
      {rest > 0 && <span className="text-xs tabular-nums text-muted-foreground">+{rest}</span>}
    </div>
  );
}
