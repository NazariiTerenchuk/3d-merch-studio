import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/shared/form-field';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/lib/toast';
import type { Print } from '@/types';
import { useCreatePrint, usePrintCategories, useUpdatePrint } from '../hooks/use-prints';

const schema = z.object({
  name: z.string().trim().min(2, 'Мінімум 2 символи').max(120, 'Максимум 120 символів'),
  description: z.string().max(2000, 'Максимум 2000 символів'),
  category: z.string().min(1, 'Оберіть категорію'),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface PrintFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  print?: Print | null;
  onCreated?: (print: Print) => void;
}

const toFormValues = (print?: Print | null): FormValues => ({
  name: print?.name ?? '',
  description: print?.description ?? '',
  category: print?.category ?? '',
  isActive: print?.isActive ?? true,
});

export function PrintFormDialog({ open, onOpenChange, print, onCreated }: PrintFormDialogProps) {
  const isEdit = !!print;
  const { data: categories = [] } = usePrintCategories();
  const createMutation = useCreatePrint();
  const updateMutation = useUpdatePrint();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toFormValues(print) });

  useEffect(() => {
    if (open) reset(toFormValues(print));
  }, [open, print, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description.trim() || null,
      category: values.category,
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: print.id, data: { ...payload, isActive: values.isActive } });
        toast.success('Принт оновлено');
      } else {
        const created = await createMutation.mutateAsync(payload);
        toast.success('Принт створено. Тепер завантажте зображення.');
        onCreated?.(created);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редагувати принт' : 'Новий принт'}</DialogTitle>
          <DialogDescription>Зображення (.png з прозорістю) завантажується окремо після збереження.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Назва" htmlFor="print-name" error={errors.name?.message} required>
            <Input id="print-name" placeholder="Герб НаУОА" {...register('name')} />
          </FormField>

          <FormField label="Категорія" htmlFor="print-category" error={errors.category?.message} required>
            <Select id="print-category" {...register('category')}>
              <option value="">Оберіть категорію</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Опис" htmlFor="print-description" error={errors.description?.message}>
            <Textarea id="print-description" rows={3} {...register('description')} />
          </FormField>

          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" className="size-4 cursor-pointer accent-accent" {...register('isActive')} />
              Показувати в галереї та конфігураторі
            </label>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Збереження...' : isEdit ? 'Зберегти' : 'Створити'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
