import { useState } from 'react';
import { Box, FileUp, Pencil, Shirt, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColorSwatchList } from '@/components/shared/color-swatch';
import { DeleteDialog } from '@/components/shared/delete-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-views';
import {
  MerchFilesDialog,
  MerchItemFormDialog,
  merchItemsApi,
  useDeleteMerchItem,
  useMerchItems,
} from '@/features/merch-items';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/lib/toast';
import type { MerchItem, MerchItemSummary } from '@/types';

export function AdminMerchItemsPage() {
  const { data: items, isLoading, error, refetch } = useMerchItems({ onlyActive: false });
  const deleteMutation = useDeleteMerchItem();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MerchItem | null>(null);
  const [filesFor, setFilesFor] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<MerchItemSummary | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = async (id: string) => {
    try {
      setEditing(await merchItemsApi.getById(id));
      setFormOpen(true);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      toast.success('Товар видалено');
      setToDelete(null);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <>
      <PageHeader
        title="Товари"
        description="Керування виробами каталогу та їхніми 3D-моделями"
        action={{ label: 'Додати товар', onClick: openCreate }}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {items && items.length === 0 && (
        <EmptyState
          title="Товарів ще немає"
          description="Створіть товар, а потім завантажте для нього .glb модель і превʼю."
          action={<Button onClick={openCreate}>Додати товар</Button>}
        />
      )}

      {items && items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Превʼю</TableHead>
              <TableHead>Назва</TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead>Кольори</TableHead>
              <TableHead>3D-модель</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex size-12 items-center justify-center overflow-hidden rounded-md bg-stage">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <Shirt className="size-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <ColorSwatchList colors={item.availableColors} max={5} />
                </TableCell>
                <TableCell>
                  {item.hasModel ? (
                    <Badge variant="success">
                      <Box /> Завантажено
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Немає моделі</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? 'neutral' : 'outline'}>
                    {item.isActive ? 'Активний' : 'Прихований'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setFilesFor(item.id)}>
                      <FileUp /> Файли
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Редагувати" onClick={() => openEdit(item.id)}>
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Видалити"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setToDelete(item)}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <MerchItemFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editing}
        onCreated={(created) => setFilesFor(created.id)}
      />
      <MerchFilesDialog merchItemId={filesFor} onOpenChange={(open) => !open && setFilesFor(null)} />
      <DeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Видалити товар?"
        description={`«${toDelete?.name}» і його файли буде видалено. Товар, що використовується у збережених дизайнах, видалити не можна — його можна приховати.`}
      />
    </>
  );
}
