import { cn } from '@/lib/utils';

export interface TabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  idPrefix: string;
  className?: string;
}

/** Underline tabs; pair each panel with id `${idPrefix}-panel-${value}`. */
export function Tabs<T extends string>({ options, value, onChange, label, idPrefix, className }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex border-b', className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            id={`${idPrefix}-tab-${option.value}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${option.value}`}
            onClick={() => onChange(option.value)}
            className={cn(
              '-mb-px flex h-12 flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 text-sm font-semibold transition-colors',
              active
                ? 'border-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}>
            {option.label}
            {option.count !== undefined && option.count > 0 && (
              <span className="tabular-nums text-xs font-medium text-muted-foreground">{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
