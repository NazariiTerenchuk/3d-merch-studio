import { useId, useRef, useState, type DragEvent } from 'react';
import { FileUp, X } from 'lucide-react';
import { UPLOAD_LIMITS, type UploadKind } from '@/constants/upload-limits';
import { cn, formatFileSize } from '@/lib/utils';

interface FileDropzoneProps {
  kind: UploadKind;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  label?: string;
}

/** Client-side mirror of the API rules (extension + size); the server still validates magic bytes. */
export function validateUploadFile(kind: UploadKind, file: File): string | null {
  const rule = UPLOAD_LIMITS[kind];
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

  if (!(rule.extensions as readonly string[]).includes(extension)) {
    return `Цей формат не підходить. Дозволені: ${rule.extensions.join(', ')}`;
  }
  if (file.size > rule.maxSizeMb * 1024 * 1024) {
    return `Файл завеликий. Максимум ${rule.maxSizeMb} MB`;
  }
  if (file.size === 0) {
    return 'Файл порожній';
  }
  return null;
}

export function FileDropzone({ kind, file, onFileChange, disabled, label }: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const rule = UPLOAD_LIMITS[kind];

  const pick = (selected: File | undefined) => {
    if (!selected) return;
    const validationError = validateUploadFile(kind, selected);
    setError(validationError);
    onFileChange(validationError ? null : selected);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) pick(e.dataTransfer.files[0]);
  };

  const clear = () => {
    onFileChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {file ? (
        <div className="flex items-center gap-3 rounded-md border px-3 py-2.5">
          <FileUp className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs tabular-nums text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label="Прибрати файл"
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-stage hover:text-foreground disabled:opacity-45">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-7 text-center transition-colors',
            isDragging ? 'border-accent bg-accent/5' : 'border-input bg-stage/50 hover:border-foreground/40',
            disabled && 'pointer-events-none opacity-45'
          )}>
          <FileUp className="size-5 text-muted-foreground" />
          <span className="text-sm font-medium">{label ?? 'Перетягніть файл сюди або виберіть на компʼютері'}</span>
          <span className="text-xs text-muted-foreground">
            {rule.extensions.join(', ')}, до {rule.maxSizeMb} MB
          </span>
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={rule.accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
