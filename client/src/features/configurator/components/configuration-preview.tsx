import type { SavedConfiguration } from '@/types';
import { toPlacedPrints, type GarmentSide } from '../state/configurator-reducer';
import { GarmentPreview } from './garment-preview';

interface ConfigurationPreviewProps {
  configuration: SavedConfiguration;
  side?: GarmentSide;
  className?: string;
}

/** Read-only garment mock-up for a saved configuration. */
export function ConfigurationPreview({ configuration, side = 'front', className }: ConfigurationPreviewProps) {
  return (
    <GarmentPreview
      baseColor={configuration.baseColor}
      prints={toPlacedPrints(configuration)}
      side={side}
      withHood={configuration.merchItem?.category === 'Худі'}
      className={className}
    />
  );
}
