import type { ConfigurationPrintInput, MerchItem, Print, PrintPlacement, SavedConfiguration } from '@/types';
import { PRINT_LIMITS } from '@/constants/placements';

export type GarmentSide = 'front' | 'back';

export interface PlacedPrint {
  /** Client-only id; the API assigns new ids on every save. */
  localId: string;
  printId: string;
  name: string;
  imageUrl: string | null;
  widthPx: number | null;
  heightPx: number | null;
  placement: PrintPlacement;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

type Design = Pick<ConfiguratorState, 'name' | 'baseColor' | 'prints'>;

export interface ConfiguratorState {
  merchItem: MerchItem;
  configurationId: string | null;
  shareCode: string | null;
  name: string;
  baseColor: string;
  prints: PlacedPrint[];
  selectedId: string | null;
  side: GarmentSide;
  isDirty: boolean;
  /** Last saved (or initial) design, used by "reset". */
  baseline: Design;
}

export type PrintPatch = Partial<Pick<PlacedPrint, 'placement' | 'offsetX' | 'offsetY' | 'scale' | 'rotation'>>;

export type ConfiguratorAction =
  | { type: 'set-color'; color: string }
  | { type: 'set-side'; side: GarmentSide }
  | { type: 'add-print'; print: Print }
  | { type: 'update-print'; localId: string; patch: PrintPatch }
  | { type: 'remove-print'; localId: string }
  | { type: 'select'; localId: string | null }
  | { type: 'move-layer'; localId: string; direction: 'up' | 'down' }
  | { type: 'reset' }
  | { type: 'saved'; configuration: SavedConfiguration };

let localIdCounter = 0;
const nextLocalId = () => `p${++localIdCounter}`;

/** Which garment side shows a placement in the 2D preview. */
export const sideOf = (placement: PrintPlacement): GarmentSide | null =>
  placement === 'back' ? 'back' : placement === 'front' || placement === 'hood' ? 'front' : null;

export const toPlacedPrints = (configuration: SavedConfiguration): PlacedPrint[] =>
  configuration.prints.map((p) => ({
    localId: nextLocalId(),
    printId: p.printId,
    name: p.printName ?? 'Принт',
    imageUrl: p.imageUrl,
    widthPx: p.widthPx,
    heightPx: p.heightPx,
    placement: p.placement,
    offsetX: p.offsetX,
    offsetY: p.offsetY,
    scale: p.scale,
    rotation: p.rotation,
    zIndex: p.zIndex,
  }));

export function createInitialState(merchItem: MerchItem, configuration?: SavedConfiguration | null): ConfiguratorState {
  const design: Design = configuration
    ? { name: configuration.name, baseColor: configuration.baseColor, prints: toPlacedPrints(configuration) }
    : { name: '', baseColor: merchItem.availableColors[0] ?? '#FFFFFF', prints: [] };

  return {
    merchItem,
    configurationId: configuration?.id ?? null,
    shareCode: configuration?.shareCode ?? null,
    ...design,
    selectedId: null,
    side: 'front',
    isDirty: false,
    baseline: design,
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function clampPatch(patch: PrintPatch): PrintPatch {
  const { offset, scale, rotation } = PRINT_LIMITS;
  return {
    ...patch,
    ...(patch.offsetX !== undefined && { offsetX: clamp(patch.offsetX, offset.min, offset.max) }),
    ...(patch.offsetY !== undefined && { offsetY: clamp(patch.offsetY, offset.min, offset.max) }),
    ...(patch.scale !== undefined && { scale: clamp(patch.scale, scale.min, scale.max) }),
    ...(patch.rotation !== undefined && { rotation: clamp(patch.rotation, rotation.min, rotation.max) }),
  };
}

export function configuratorReducer(state: ConfiguratorState, action: ConfiguratorAction): ConfiguratorState {
  switch (action.type) {
    case 'set-color':
      return { ...state, baseColor: action.color, isDirty: true };

    case 'set-side':
      return { ...state, side: action.side };

    case 'add-print': {
      if (state.prints.length >= PRINT_LIMITS.maxPrints) return state;
      const placed: PlacedPrint = {
        localId: nextLocalId(),
        printId: action.print.id,
        name: action.print.name,
        imageUrl: action.print.imageUrl,
        widthPx: action.print.widthPx,
        heightPx: action.print.heightPx,
        placement: state.side,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        rotation: 0,
        zIndex: Math.max(-1, ...state.prints.map((p) => p.zIndex)) + 1,
      };
      return { ...state, prints: [...state.prints, placed], selectedId: placed.localId, isDirty: true };
    }

    case 'update-print': {
      const patch = clampPatch(action.patch);
      const prints = state.prints.map((p) => (p.localId === action.localId ? { ...p, ...patch } : p));
      // Follow the print to the other side when its placement moves there
      const side = (patch.placement && sideOf(patch.placement)) || state.side;
      return { ...state, prints, side, isDirty: true };
    }

    case 'remove-print':
      return {
        ...state,
        prints: state.prints.filter((p) => p.localId !== action.localId),
        selectedId: state.selectedId === action.localId ? null : state.selectedId,
        isDirty: true,
      };

    case 'select': {
      const selected = state.prints.find((p) => p.localId === action.localId);
      const side = (selected && sideOf(selected.placement)) || state.side;
      return { ...state, selectedId: action.localId, side };
    }

    case 'move-layer': {
      const ordered = [...state.prints].sort((a, b) => a.zIndex - b.zIndex);
      const index = ordered.findIndex((p) => p.localId === action.localId);
      const swapWith = action.direction === 'up' ? index + 1 : index - 1;
      if (index < 0 || swapWith < 0 || swapWith >= ordered.length) return state;

      const a = ordered[index];
      const b = ordered[swapWith];
      const prints = state.prints.map((p) => {
        if (p.localId === a.localId) return { ...p, zIndex: b.zIndex };
        if (p.localId === b.localId) return { ...p, zIndex: a.zIndex };
        return p;
      });
      return { ...state, prints, isDirty: true };
    }

    case 'reset':
      return { ...state, ...state.baseline, selectedId: null, isDirty: false };

    case 'saved': {
      const design: Design = { name: action.configuration.name, baseColor: state.baseColor, prints: state.prints };
      return {
        ...state,
        configurationId: action.configuration.id,
        shareCode: action.configuration.shareCode,
        name: action.configuration.name,
        isDirty: false,
        baseline: design,
      };
    }
  }
}

/** API payload; zIndex is compacted to 0..n-1 to stay within server limits. */
export function toPrintInputs(prints: PlacedPrint[]): ConfigurationPrintInput[] {
  return [...prints]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((p, index) => ({
      printId: p.printId,
      placement: p.placement,
      offsetX: p.offsetX,
      offsetY: p.offsetY,
      scale: p.scale,
      rotation: p.rotation,
      zIndex: index,
    }));
}
