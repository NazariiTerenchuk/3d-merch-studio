import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileDropzone } from '@/components/shared/file-dropzone';
import type { UploadKind } from '@/constants/upload-limits';
import type { UploadProgressHandler } from '@/lib/api-client';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/lib/toast';

interface UploadSectionProps {
  title: string;
  kind: UploadKind;
  currentUrl: string | null;
  upload: (file: File, onProgress: UploadProgressHandler) => Promise<unknown>;
  successMessage: string;
}

/** Dropzone + upload button + progress bar for a single file slot. */
export function UploadSection({ title, kind, currentUrl, upload, successMessage }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const isUploading = progress !== null;

  const handleUpload = async () => {
    if (!file) return;
    setProgress(0);
    try {
      await upload(file, setProgress);
      toast.success(successMessage);
      setFile(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Не вдалося завантажити файл.'));
    } finally {
      setProgress(null);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {currentUrl ? (
          <a href={currentUrl} target="_blank" rel="noreferrer" className="hover:opacity-80">
            <Badge variant="success">Завантажено</Badge>
          </a>
        ) : (
          <Badge variant="outline">Ще немає</Badge>
        )}
      </div>

      <FileDropzone
        kind={kind}
        file={file}
        onFileChange={setFile}
        disabled={isUploading}
        label={currentUrl ? 'Перетягніть новий файл, щоб замінити поточний' : undefined}
      />

      {isUploading && (
        <div className="flex items-center gap-3">
          <Progress value={progress} />
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{progress}%</span>
        </div>
      )}

      {file && (
        <Button onClick={handleUpload} disabled={isUploading} className="w-full">
          <Upload /> {isUploading ? 'Завантажуємо' : 'Завантажити файл'}
        </Button>
      )}
    </section>
  );
}
