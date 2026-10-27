import { SegmentedControl } from '@/components/ui/segmented-control';
import { Stage } from '@/components/ui/stage';
import { cn } from '@/lib/utils';
import { useConfigurator } from '../state/configurator-context';
import type { GarmentSide } from '../state/configurator-reducer';
import { GarmentPreview } from './garment-preview';

const SIDES: { value: GarmentSide; label: string }[] = [
  { value: 'front', label: 'Спереду' },
  { value: 'back', label: 'Ззаду' },
];

interface CanvasPlaceholderProps {
  onPrintSelected?: () => void;
  className?: string;
}

/**
 * The product stage. Hosts the 2D mock-up for now;
 * the R3F <Canvas> with the .glb model replaces <GarmentPreview> in the diploma stage.
 */
export function CanvasPlaceholder({ onPrintSelected, className }: CanvasPlaceholderProps) {
  const { state, dispatch } = useConfigurator();

  return (
    <Stage role="region" className={cn('flex flex-col', className)} aria-label="Перегляд виробу">
      <p className="absolute left-4 top-4 text-xs text-muted-foreground">
        2D-макет. Тривимірний перегляд зʼявиться згодом
      </p>

      <div className="flex flex-1 items-center justify-center px-6 pb-20 pt-12">
        <GarmentPreview
          baseColor={state.baseColor}
          prints={state.prints}
          side={state.side}
          withHood={state.merchItem.category === 'Худі'}
          selectedId={state.selectedId}
          onSelect={(localId) => {
            dispatch({ type: 'select', localId });
            if (localId) onPrintSelected?.();
          }}
          className="h-full max-h-[600px] w-full max-w-[520px]"
        />
      </div>

      <div className="absolute inset-x-0 bottom-5 flex justify-center">
        <SegmentedControl
          label="Сторона виробу"
          options={SIDES}
          value={state.side}
          onChange={(side) => dispatch({ type: 'set-side', side })}
        />
      </div>
    </Stage>
  );
}
