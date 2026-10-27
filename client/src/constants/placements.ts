import type { PrintPlacement } from '@/types';

/** Mirrors Domain.Configurations.PrintPlacement on the API. */
export const PLACEMENTS: { value: PrintPlacement; label: string }[] = [
  { value: 'front', label: 'Перед' },
  { value: 'back', label: 'Спина' },
  { value: 'left-sleeve', label: 'Лівий рукав' },
  { value: 'right-sleeve', label: 'Правий рукав' },
  { value: 'hood', label: 'Капюшон' },
];

export const placementLabel = (placement: PrintPlacement) =>
  PLACEMENTS.find((p) => p.value === placement)?.label ?? placement;

/** Ranges mirror ConfigurationPrint / ConfigurationRules validation on the API. */
export const PRINT_LIMITS = {
  offset: { min: -1, max: 1, step: 0.01 },
  scale: { min: 0.1, max: 3, step: 0.05 },
  rotation: { min: -180, max: 180, step: 1 },
  maxPrints: 20,
};
