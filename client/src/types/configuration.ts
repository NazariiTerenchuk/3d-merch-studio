import type { MerchItem } from './merch-item';

export type PrintPlacement = 'front' | 'back' | 'left-sleeve' | 'right-sleeve' | 'hood';

export interface ConfigurationPrint {
  id: string;
  printId: string;
  printName: string | null;
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

export interface SavedConfiguration {
  id: string;
  name: string;
  shareCode: string;
  baseColor: string;
  merchItemId: string;
  merchItem: MerchItem | null;
  prints: ConfigurationPrint[];
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationPrintInput {
  printId: string;
  placement: PrintPlacement;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface CreateSavedConfiguration {
  name: string;
  merchItemId: string;
  baseColor: string;
  prints: ConfigurationPrintInput[];
}

export interface UpdateSavedConfiguration {
  name: string;
  baseColor: string;
  prints: ConfigurationPrintInput[];
}
