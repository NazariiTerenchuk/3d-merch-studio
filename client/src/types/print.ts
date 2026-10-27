export interface Print {
  id: string;
  name: string;
  description: string | null;
  category: string;
  imageUrl: string | null;
  widthPx: number | null;
  heightPx: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrint {
  name: string;
  description: string | null;
  category: string;
}

export interface UpdatePrint extends CreatePrint {
  isActive: boolean;
}
