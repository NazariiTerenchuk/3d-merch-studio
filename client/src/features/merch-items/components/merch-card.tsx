import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import { Stage } from '@/components/ui/stage';
import { ColorSwatchList } from '@/components/shared/color-swatch';
import { GarmentPreview } from '@/features/configurator';
import type { MerchItemSummary } from '@/types';

/** Categories the 2D garment silhouette fits; others fall back to an icon. */
const GARMENT_CATEGORIES = ['Футболка', 'Худі', 'Світшот'];

function MerchVisual({ item }: { item: MerchItemSummary }) {
  if (item.previewUrl) {
    return <img src={item.previewUrl} alt="" className="size-full object-cover" loading="lazy" />;
  }
  if (GARMENT_CATEGORIES.includes(item.category)) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <GarmentPreview
          baseColor={item.availableColors[0] ?? '#FFFFFF'}
          prints={[]}
          side="front"
          withHood={item.category === 'Худі'}
          className="h-full w-auto"
        />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
      <Shirt className="size-16" strokeWidth={1} />
    </div>
  );
}

/** Product tile: the whole tile opens the configurator once a 3D model exists. */
export function MerchCard({ item }: { item: MerchItemSummary }) {
  const details = (
    <div className="mt-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          {item.hasModel ? item.category : `${item.category}, модель готується`}
        </p>
      </div>
      <div className="pt-1">
        <ColorSwatchList colors={item.availableColors} max={4} />
      </div>
    </div>
  );

  if (!item.hasModel) {
    return (
      <article>
        <Stage className="aspect-[4/5] opacity-70">
          <MerchVisual item={item} />
        </Stage>
        {details}
      </article>
    );
  }

  return (
    <article>
      <Link to={`/configurator/${item.id}`} className="group block rounded-lg" aria-label={`Налаштувати ${item.name}`}>
        <Stage className="aspect-[4/5] transition-colors group-hover:bg-stage-strong">
          <MerchVisual item={item} />
          <span className="absolute bottom-3 left-3 rounded-full bg-background px-3 py-1.5 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Налаштувати
          </span>
        </Stage>
        {details}
      </Link>
    </article>
  );
}
