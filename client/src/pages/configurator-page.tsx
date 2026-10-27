import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Box } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-views';
import { CONFIGURATIONS_QUERY_KEY, useConfiguration } from '@/features/configurations';
import { ConfiguratorProvider, ConfiguratorWorkspace } from '@/features/configurator';
import { useMerchItem } from '@/features/merch-items';
import type { SavedConfiguration } from '@/types';

/** /configurator/:merchItemId?config=<configurationId> */
export function ConfiguratorPage() {
  const { merchItemId } = useParams<{ merchItemId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const configId = searchParams.get('config');
  const queryClient = useQueryClient();

  const merchQuery = useMerchItem(merchItemId);
  const configQuery = useConfiguration(configId);

  if (merchQuery.isLoading || configQuery.isLoading) return <LoadingState label="Завантаження конфігуратора..." />;
  if (merchQuery.error) return <ErrorState error={merchQuery.error} onRetry={merchQuery.refetch} />;
  if (configQuery.error) return <ErrorState error={configQuery.error} onRetry={configQuery.refetch} />;

  const merchItem = merchQuery.data;
  if (!merchItem) return null;

  if (!merchItem.modelUrl || !merchItem.isActive) {
    return (
      <EmptyState
        icon={<Box />}
        title="Цей виріб ще не готовий до налаштування"
        description="Для нього не завантажено 3D-модель або його приховано з каталогу."
        action={
          <Link to="/catalog" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Повернутися до каталогу
          </Link>
        }
      />
    );
  }

  // A config of another merch item in the URL is ignored
  const configuration = configQuery.data?.merchItemId === merchItem.id ? configQuery.data : null;

  const handleSaved = (saved: SavedConfiguration, isNew: boolean) => {
    if (!isNew) return;
    // Prime the cache so the remount triggered by the new ?config= renders instantly
    queryClient.setQueryData([CONFIGURATIONS_QUERY_KEY, saved.id], saved);
    setSearchParams({ config: saved.id }, { replace: true });
  };

  return (
    <ConfiguratorProvider
      key={`${merchItem.id}:${configuration?.id ?? 'new'}`}
      merchItem={merchItem}
      configuration={configuration}>
      <ConfiguratorWorkspace onSaved={handleSaved} />
    </ConfiguratorProvider>
  );
}
