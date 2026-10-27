import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button-variants';
import { EmptyState } from '@/components/shared/state-views';

export function NotFoundPage() {
  return (
    <EmptyState
      title="Сторінку не знайдено"
      description="Можливо, посилання застаріло або містить помилку."
      action={
        <Link to="/catalog" className={buttonVariants({ size: 'sm' })}>
          До каталогу
        </Link>
      }
    />
  );
}
