import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LoadingState, ErrorState } from '@/components/shared/state-views';
import { PRINT_LIMITS } from '@/constants/placements';
import { PrintThumb, usePrints } from '@/features/prints';
import { useConfigurator } from '../state/configurator-context';

export function PrintPicker({ onAdded }: { onAdded?: () => void }) {
  const { state, dispatch } = useConfigurator();
  const { data: prints, isLoading, error, refetch } = usePrints();
  const [search, setSearch] = useState('');
  const isFull = state.prints.length >= PRINT_LIMITS.maxPrints;

  const available = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (prints ?? [])
      .filter((p) => p.imageUrl)
      .filter((p) => !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
  }, [prints, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Знайти принт"
          aria-label="Знайти принт"
          className="pl-9"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {isFull
          ? `На виробі вже ${PRINT_LIMITS.maxPrints} принтів. Видаліть один, щоб додати інший.`
          : `Принт зʼявиться ${state.side === 'front' ? 'спереду' : 'ззаду'}, далі його можна перемістити.`}
      </p>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && available.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {search ? 'Нічого не знайдено' : 'Принтів поки немає'}
        </p>
      )}

      <ul className="grid grid-cols-3 gap-3">
        {available.map((print) => (
          <li key={print.id}>
            <button
              type="button"
              disabled={isFull}
              onClick={() => {
                dispatch({ type: 'add-print', print });
                onAdded?.();
              }}
              aria-label={`Додати принт ${print.name}`}
              className="group w-full cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-45">
              <PrintThumb
                print={print}
                className="aspect-square rounded-lg border border-transparent p-2 transition-colors group-hover:border-input"
              />
              <span className="mt-1.5 block truncate text-xs font-medium">{print.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
