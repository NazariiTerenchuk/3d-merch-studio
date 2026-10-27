import { Link, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Pencil } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { Panel } from '@/components/ui/panel';
import { Stage } from '@/components/ui/stage';
import { ColorSwatch } from '@/components/shared/color-swatch';
import { CopyLinkButton } from '@/components/shared/copy-link-button';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-views';
import { placementLabel } from '@/constants/placements';
import { shareUrl, useConfigurationByShareCode } from '@/features/configurations';
import { ConfigurationPreview } from '@/features/configurator';
import { PrintThumb } from '@/features/prints';
import { cn, formatDate } from '@/lib/utils';

/** Public page behind the share link /c/:shareCode */
export function SharedConfigurationPage() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const { data: configuration, isLoading, error, refetch } = useConfigurationByShareCode(shareCode);

  if (isLoading) return <LoadingState />;
  if (isAxiosError(error) && error.response?.status === 404) {
    return (
      <EmptyState
        title="Дизайн не знайдено"
        description="Посилання застаріло або дизайн видалили. Попросіть автора надіслати нове посилання."
      />
    );
  }
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!configuration) return null;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {(['front', 'back'] as const).map((side) => (
          <figure key={side}>
            <Stage className="flex aspect-[4/5] items-center justify-center p-8">
              <ConfigurationPreview configuration={configuration} side={side} className="h-full w-auto" />
            </Stage>
            <figcaption className="mt-2 text-sm text-muted-foreground">
              {side === 'front' ? 'Спереду' : 'Ззаду'}
            </figcaption>
          </figure>
        ))}
      </div>

      <Panel className="space-y-6 p-6 lg:sticky lg:top-24">
        <div>
          <h1 className="text-2xl font-bold">{configuration.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Змінено {formatDate(configuration.updatedAt)}</p>
        </div>

        <dl className="divide-y border-y text-sm">
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-muted-foreground">Виріб</dt>
            <dd className="text-right font-medium">{configuration.merchItem?.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-muted-foreground">Колір</dt>
            <dd className="flex items-center gap-2 font-medium tabular-nums">
              <ColorSwatch color={configuration.baseColor} /> {configuration.baseColor}
            </dd>
          </div>
        </dl>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Принти</h2>
          {configuration.prints.length === 0 ? (
            <p className="text-sm text-muted-foreground">На цьому дизайні немає принтів.</p>
          ) : (
            <ul className="space-y-2">
              {configuration.prints.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <PrintThumb
                    print={{ imageUrl: p.imageUrl, name: p.printName ?? '' }}
                    className="size-10 shrink-0 rounded-md p-1"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{p.printName}</span>
                    <span className="block text-xs text-muted-foreground">{placementLabel(p.placement)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-2">
          <Link
            to={`/configurator/${configuration.merchItemId}?config=${configuration.id}`}
            className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
            <Pencil /> Відкрити в конструкторі
          </Link>
          <CopyLinkButton url={shareUrl(configuration.shareCode)} className="w-full" />
        </div>
      </Panel>
    </div>
  );
}
