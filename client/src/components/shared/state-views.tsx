import { type ReactNode } from 'react';
import { AlertTriangle, Loader2, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stage } from '@/components/ui/stage';
import { getApiErrorMessage } from '@/lib/api-error';

export function LoadingState({ label = 'Завантаження' }: { label?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center gap-2 py-20 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/25 px-6 py-14 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <p className="max-w-md text-sm">{getApiErrorMessage(error, 'Не вдалося завантажити дані.')}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Спробувати ще раз
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Stage className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="text-muted-foreground [&_svg]:size-8">{icon ?? <PackageOpen />}</div>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </Stage>
  );
}
