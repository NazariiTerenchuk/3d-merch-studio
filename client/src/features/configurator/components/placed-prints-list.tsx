import { Trash2 } from 'lucide-react';
import { placementLabel } from '@/constants/placements';
import { cn } from '@/lib/utils';
import { PrintThumb } from '@/features/prints';
import { useConfigurator } from '../state/configurator-context';

export function PlacedPrintsList({ onEmptyAction }: { onEmptyAction?: () => void }) {
  const { state, dispatch } = useConfigurator();
  // Top layer first, like in graphic editors
  const ordered = [...state.prints].sort((a, b) => b.zIndex - a.zIndex);

  if (ordered.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        На виробі ще немає принтів.{' '}
        {onEmptyAction && (
          <button
            type="button"
            onClick={onEmptyAction}
            className="cursor-pointer font-semibold text-accent hover:underline">
            Вибрати принт
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-1" aria-label="Шари, верхній першим">
      {ordered.map((print) => {
        const selected = print.localId === state.selectedId;
        return (
          <li key={print.localId}>
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg border p-1.5 pr-1 transition-colors',
                selected ? 'border-accent bg-accent/5' : 'border-transparent hover:bg-stage'
              )}>
              <button
                type="button"
                onClick={() => dispatch({ type: 'select', localId: print.localId })}
                aria-pressed={selected}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left">
                <PrintThumb print={print} className="size-11 shrink-0 rounded-md p-1" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{print.name}</span>
                  <span className="block text-xs text-muted-foreground">{placementLabel(print.placement)}</span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`Прибрати ${print.name}`}
                onClick={() => dispatch({ type: 'remove-print', localId: print.localId })}
                className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
