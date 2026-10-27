import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import type { MerchItem } from '@/types';
import { useCreateMerchItem, useMerchCategories, useUpdateMerchItem } from '../hooks/use-merch-items';
import { ColorsEditor } from './colors-editor';

const schema = z.object({
  name: z.string().trim().min(2, 'Мінімум 2 символи').max(120, 'Максимум 120 символів'),
  description: z.string().max(2000, 'Максимум 2000 символів'),
  category: z.string().min(1, 'Оберіть категорію'),
  availableColors: z.array(z.string()).min(1, 'Додайте хоча б один колір').max(20, 'Максимум 20 кольорів'),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface MerchItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit mode when provided. */
  item?: MerchItem | null;
  onCreated?: (item: MerchItem) => void;
}

const toFormValues = (item?: MerchItem | null): FormValues => ({
  name: item?.name ?? '',
  description: item?.description ?? '',
  category: item?.category ?? '',
  availableColors: item?.availableColors ?? ['#FFFFFF', '#22262E'],
  isActive: item?.isActive ?? true,
});

export function MerchItemFormDialog({ open, onOpenChange, item, onCreated }: MerchItemFormDialogProps) {
  const isEdit = !!item;
  const { data: categories = [] } = useMerchCategories();
  const createMutation = useCreateMerchItem();
  const updateMutation = useUpdateMerchItem();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toFormValues(item) });

  useEffect(() => {
    if (open) reset(toFormValues(item));
  }, [open, item, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description.trim() || null,
      category: values.category,
      availableColors: values.availableColors,
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: item.id, data: { ...payload, isActive: values.isActive } });
        toast.success('Товар оновлено');
      } else {
        const created = await createMutation.mutateAsync(payload);
        toast.success('Товар створено. Тепер завантажте 3D-модель.');
        onCreated?.(created);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редагувати товар' : 'Новий товар'}</DialogTitle>
          <DialogDescription>Файли (.glb модель і превʼю) завантажуються окремо після збереження.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Назва" htmlFor="merch-name" error={errors.name?.message} required>
            <Input id="merch-name" placeholder="Футболка з гербом НаУОА" {...register('name')} />
          </FormField>

          <FormField label="Категорія" htmlFor="merch-category" error={errors.category?.message} required>
            <Select id="merch-category" {...register('category')}>
              <option value="">Оберіть категорію</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Опис" htmlFor="merch-description" error={errors.description?.message}>
            <Textarea id="merch-description" rows={3} {...register('description')} />
          </FormField>

          <FormField
            label="Доступні кольори"
            htmlFor="merch-colors"
            error={errors.availableColors?.message}
            hint="Ці кольори зʼявляться в палітрі конфігуратора"
            required>
            <Controller
              control={control}
              name="availableColors"
              render={({ field }) => <ColorsEditor id="merch-colors" value={field.value} onChange={field.onChange} />}
            />
          </FormField>

          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" className="size-4 cursor-pointer accent-accent" {...register('isActive')} />
              Показувати в каталозі
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
