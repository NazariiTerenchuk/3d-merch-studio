import { useState } from 'react';
import { Images } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { CategoryFilter } from '@/components/shared/category-filter';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-views';
import { PrintCard, usePrintCategories, usePrints } from '@/features/prints';

export function PrintsPage() {
  const [category, setCategory] = useState('');
  const { data: categories = [] } = usePrintCategories();
  const { data: prints, isLoading, error, refetch } = usePrints({ category });
  const withImages = prints?.filter((p) => p.imageUrl) ?? [];

  return (
    <>
      <PageHeader title="Галерея принтів" description="Логотипи, емблеми й написи, які можна розмістити на виробі" />

      <div className="mb-8">
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {prints && withImages.length === 0 && (
        <EmptyState icon={<Images />} title="Принтів поки немає" description="Завантажте PNG-принти в адмін-панелі." />
      )}

      {withImages.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {withImages.map((print) => (
            <PrintCard key={print.id} print={print} />
          ))}
        </div>
      )}
    </>
  );
}
