import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { Stage } from '@/components/ui/stage';
import { ColorSwatch } from '@/components/shared/color-swatch';
import { CopyLinkButton } from '@/components/shared/copy-link-button';
import { DeleteDialog } from '@/components/shared/delete-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-views';
import { shareUrl, useConfigurations, useDeleteConfiguration } from '@/features/configurations';
import { ConfigurationPreview } from '@/features/configurator';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/lib/toast';
import { formatDate } from '@/lib/utils';
import type { SavedConfiguration } from '@/types';

const printsLabel = (count: number) =>
  count === 0 ? 'без принтів' : count === 1 ? '1 принт' : count < 5 ? `${count} принти` : `${count} принтів`;

export function MyConfigurationsPage() {
  const { data: configurations, isLoading, error, refetch } = useConfigurations();
  const deleteMutation = useDeleteConfiguration();
  const [toDelete, setToDelete] = useState<SavedConfiguration | null>(null);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      toast.success('Дизайн видалено');
      setToDelete(null);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <>
      <PageHeader title="Мої дизайни" description="Відкрийте збережений дизайн, щоб змінити його або поділитися ним" />

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {configurations && configurations.length === 0 && (
        <EmptyState
          icon={<Palette />}
          title="Збережених дизайнів ще немає"
          description="Виберіть виріб у каталозі, додайте принти й збережіть результат."
          action={
            <Link to="/catalog" className={buttonVariants()}>
              Перейти до каталогу
            </Link>
          }
        />
      )}

      {configurations && configurations.length > 0 && (
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {configurations.map((configuration) => {
            const editUrl = `/configurator/${configuration.merchItemId}?config=${configuration.id}`;
            return (
              <article key={configuration.id}>
                <Link to={editUrl} className="group block rounded-lg" aria-label={`Редагувати ${configuration.name}`}>
                  <Stage className="flex aspect-[4/5] items-center justify-center p-8 transition-colors group-hover:bg-stage-strong">
                    <ConfigurationPreview configuration={configuration} className="h-full w-auto" />
                  </Stage>
                </Link>

                <div className="mt-3">
                  <h2 className="truncate text-base font-semibold">{configuration.name}</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <ColorSwatch color={configuration.baseColor} />
                    <span className="truncate">
                      {configuration.merchItem?.name}, {printsLabel(configuration.prints.length)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">Змінено {formatDate(configuration.updatedAt)}</p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <CopyLinkButton size="sm" url={shareUrl(configuration.shareCode)} label="Копіювати посилання" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    aria-label={`Видалити ${configuration.name}`}
                    onClick={() => setToDelete(configuration)}>
                    <Trash2 />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <DeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Видалити дизайн?"
        description={`Дизайн «${toDelete?.name}» зникне, а посилання на нього перестане працювати.`}
      />
    </>
  );
}
