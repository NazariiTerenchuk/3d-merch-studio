import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Stage } from '@/components/ui/stage';
import { cn } from '@/lib/utils';
import type { Print } from '@/types';

/** Subtle checkerboard (stage tones) so PNG transparency stays visible. */
export const CHECKERBOARD_CLASS =
  'bg-[length:14px_14px] bg-[linear-gradient(45deg,var(--color-stage-strong)_25%,transparent_25%),linear-gradient(-45deg,var(--color-stage-strong)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-stage-strong)_75%),linear-gradient(-45deg,transparent_75%,var(--color-stage-strong)_75%)] bg-[position:0_0,0_7px,7px_-7px,-7px_0]';

export function PrintThumb({ print, className }: { print: Pick<Print, 'imageUrl' | 'name'>; className?: string }) {
  // Tracks the URL that failed so a new URL gets a fresh attempt
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = print.imageUrl && failedUrl !== print.imageUrl;

  return (
    <div className={cn('flex items-center justify-center overflow-hidden bg-stage', CHECKERBOARD_CLASS, className)}>
      {showImage ? (
        <img
          src={print.imageUrl!}
          alt={print.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
          onError={() => setFailedUrl(print.imageUrl)}
        />
      ) : (
        <ImageOff className="size-1/3 max-h-7 max-w-7 text-muted-foreground" aria-label="Зображення недоступне" />
      )}
    </div>
  );
}

export function PrintCard({ print }: { print: Print }) {
  return (
    <article>
      <Stage>
        <PrintThumb print={print} className="aspect-square p-6" />
      </Stage>
      <div className="mt-2.5">
        <h3 className="truncate text-sm font-semibold">{print.name}</h3>
        <p className="text-sm text-muted-foreground">
          {print.category}
          {print.widthPx && print.heightPx && (
            <span className="tabular-nums">
              , {print.widthPx}×{print.heightPx}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
