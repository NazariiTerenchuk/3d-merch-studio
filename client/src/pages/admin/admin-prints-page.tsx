import { useState } from 'react';
import { ImageUp, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteDialog } from '@/components/shared/delete-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-views';
import { PrintFormDialog, PrintImageDialog, PrintThumb, useDeletePrint, usePrints } from '@/features/prints';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/lib/toast';
import type { Print } from '@/types';

export function AdminPrintsPage() {
  const { data: prints, isLoading, error, refetch } = usePrints({ onlyActive: false });
  const deleteMutation = useDeletePrint();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Print | null>(null);
  const [imageFor, setImageFor] = useState<Print | null>(null);
  const [toDelete, setToDelete] = useState<Print | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      toast.success('Принт видалено');
      setToDelete(null);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <>
      <PageHeader
        title="Принти"
        description="PNG-логотипи та емблеми, доступні в конфігураторі"
        action={{ label: 'Додати принт', onClick: openCreate }}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {prints && prints.length === 0 && (
        <EmptyState
          title="Принтів ще немає"
          description="Створіть принт і завантажте для нього PNG з прозорим фоном."
          action={<Button onClick={openCreate}>Додати принт</Button>}
        />
      )}

      {prints && prints.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Зображення</TableHead>
              <TableHead>Назва</TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead>Розмір</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prints.map((print) => (
              <TableRow key={print.id}>
                <TableCell>
                  <PrintThumb print={print} className="size-12 rounded-md p-1" />
                </TableCell>
                <TableCell className="font-semibold">{print.name}</TableCell>
                <TableCell>{print.category}</TableCell>
                <TableCell className="text-muted-foreground">
                  {print.widthPx && print.heightPx ? `${print.widthPx}×${print.heightPx}` : '—'}
                </TableCell>
                <TableCell>
                  {!print.imageUrl ? (
                    <Badge variant="destructive">Без зображення</Badge>
                  ) : (
                    <Badge variant={print.isActive ? 'neutral' : 'outline'}>
                      {print.isActive ? 'Активний' : 'Прихований'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setImageFor(print)}>
                      <ImageUp /> PNG
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Редагувати"
                      onClick={() => {
                        setEditing(print);
                        setFormOpen(true);
                      }}>
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Видалити"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setToDelete(print)}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <PrintFormDialog open={formOpen} onOpenChange={setFormOpen} print={editing} onCreated={setImageFor} />
      <PrintImageDialog print={imageFor} onOpenChange={(open) => !open && setImageFor(null)} />
      <DeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Видалити принт?"
        description={`«${toDelete?.name}» буде видалено. Принт, що використовується у збережених дизайнах, видалити не можна — його можна приховати.`}
      />
    </>
  );
}
