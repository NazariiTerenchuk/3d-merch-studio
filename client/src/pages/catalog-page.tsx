import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { CategoryFilter } from '@/components/shared/category-filter';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-views';
import { buttonVariants } from '@/components/ui/button-variants';
import { MerchCard, useMerchCategories, useMerchItems } from '@/features/merch-items';

export function CatalogPage() {
  const [category, setCategory] = useState('');
  const { data: categories = [] } = useMerchCategories();
  const { data: items, isLoading, error, refetch } = useMerchItems({ category });

  return (
    <>
      <PageHeader title="Каталог мерчу" description="Виберіть виріб і додайте на нього символіку Острозької академії" />

      <div className="mb-8">
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {items && items.length === 0 && (
        <EmptyState
          title="Товарів поки немає"
          description={category ? 'У цій категорії немає товарів.' : 'Додайте перший товар в адмін-панелі.'}
          action={
            <Link to="/admin/merch-items" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              До адмін-панелі
            </Link>
          }
        />
      )}

      {items && items.length > 0 && (
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MerchCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
