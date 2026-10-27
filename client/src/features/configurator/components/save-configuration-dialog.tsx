import { useEffect, useState } from 'react';
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
import { FormField } from '@/components/shared/form-field';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/lib/toast';
import { useCreateConfiguration, useUpdateConfiguration } from '@/features/configurations';
import type { SavedConfiguration } from '@/types';
import { useConfigurator } from '../state/configurator-context';
import { toPrintInputs } from '../state/configurator-reducer';

interface SaveConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (configuration: SavedConfiguration, isNew: boolean) => void;
}

export function SaveConfigurationDialog({ open, onOpenChange, onSaved }: SaveConfigurationDialogProps) {
  const { state, dispatch } = useConfigurator();
  const createMutation = useCreateConfiguration();
  const updateMutation = useUpdateConfiguration();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const isUpdate = !!state.configurationId;

  const [name, setName] = useState(state.name);
  const trimmed = name.trim();
  const nameError = trimmed.length < 2 ? 'Мінімум 2 символи' : trimmed.length > 120 ? 'Максимум 120 символів' : null;

  useEffect(() => {
    if (open) setName(state.name || `${state.merchItem.name} — мій дизайн`);
  }, [open, state.name, state.merchItem.name]);

  const handleSave = async () => {
    if (nameError) return;

    const prints = toPrintInputs(state.prints);
    try {
      const saved = isUpdate
        ? await updateMutation.mutateAsync({
            id: state.configurationId!,
            data: { name: trimmed, baseColor: state.baseColor, prints },
          })
        : await createMutation.mutateAsync({
            name: trimmed,
            merchItemId: state.merchItem.id,
            baseColor: state.baseColor,
            prints,
          });

      dispatch({ type: 'saved', configuration: saved });
      toast.success(isUpdate ? 'Дизайн оновлено' : 'Дизайн збережено');
      onSaved(saved, !isUpdate);
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Не вдалося зберегти дизайн.'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Оновити дизайн' : 'Зберегти дизайн'}</DialogTitle>
          <DialogDescription>Після збереження ви отримаєте посилання, яким можна поділитися.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave();
          }}
          className="space-y-4">
          <FormField label="Назва дизайну" htmlFor="configuration-name" error={nameError ?? undefined} required>
            <Input id="configuration-name" value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isPending || !!nameError}>
              {isPending ? 'Збереження...' : 'Зберегти'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
