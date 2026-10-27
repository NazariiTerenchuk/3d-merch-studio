import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UploadSection } from '@/components/shared/upload-section';
import type { Print } from '@/types';
import { useUploadPrintImage } from '../hooks/use-prints';
import { PrintThumb } from './print-card';

interface PrintImageDialogProps {
  print: Print | null;
  onOpenChange: (open: boolean) => void;
}

export function PrintImageDialog({ print, onOpenChange }: PrintImageDialogProps) {
  const uploadMutation = useUploadPrintImage();

  return (
    <Dialog open={!!print} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Зображення принта</DialogTitle>
          <DialogDescription>{print?.name}</DialogDescription>
        </DialogHeader>

        {print && (
          <div className="space-y-4">
            {print.imageUrl && <PrintThumb print={print} className="h-44 rounded-lg p-4" />}
            <UploadSection
              title="PNG-файл"
              kind="print"
              currentUrl={print.imageUrl}
              successMessage="Зображення завантажено"
              upload={async (file, onProgress) => {
                await uploadMutation.mutateAsync({ id: print.id, file, onProgress });
                onOpenChange(false);
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
