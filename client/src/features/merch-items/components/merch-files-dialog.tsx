import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UploadSection } from '@/components/shared/upload-section';
import { useMerchItem, useUploadMerchFile } from '../hooks/use-merch-items';

interface MerchFilesDialogProps {
  merchItemId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function MerchFilesDialog({ merchItemId, onOpenChange }: MerchFilesDialogProps) {
  const { data: item } = useMerchItem(merchItemId ?? undefined);
  const uploadMutation = useUploadMerchFile();

  return (
    <Dialog open={!!merchItemId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Файли товару</DialogTitle>
          <DialogDescription>{item?.name ?? 'Завантаження...'}</DialogDescription>
        </DialogHeader>

        {merchItemId && (
          <div className="divide-y [&>*]:py-5 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
            <UploadSection
              title="3D-модель (.glb)"
              kind="model"
              currentUrl={item?.modelUrl ?? null}
              successMessage="3D-модель завантажено"
              upload={(file, onProgress) =>
                uploadMutation.mutateAsync({ id: merchItemId, kind: 'model', file, onProgress })
              }
            />
            <UploadSection
              title="Превʼю для каталогу"
              kind="preview"
              currentUrl={item?.previewUrl ?? null}
              successMessage="Превʼю завантажено"
              upload={(file, onProgress) =>
                uploadMutation.mutateAsync({ id: merchItemId, kind: 'preview', file, onProgress })
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
