export interface MerchItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  availableColors: string[];
  modelUrl: string | null;
  previewUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MerchItemSummary {
  id: string;
  name: string;
  category: string;
  availableColors: string[];
  previewUrl: string | null;
  hasModel: boolean;
  isActive: boolean;
}

export interface CreateMerchItem {
  name: string;
  description: string | null;
  category: string;
  availableColors: string[];
}

export interface UpdateMerchItem extends CreateMerchItem {
  isActive: boolean;
}
