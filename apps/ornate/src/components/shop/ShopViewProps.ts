import type {
  FurnitureFilterState,
  FurnitureProduct,
  FurnitureSortOption,
  FurnitureSubcategory,
} from "@/types/furniture";

export interface ShopViewProps {
  sellerName: string;
  subcategories: FurnitureSubcategory[];
  products: FurnitureProduct[];
  filteredProducts: FurnitureProduct[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  filters: FurnitureFilterState;
  priceBounds: { min: number; max: number };
  availableBrands: string[];
  subcategoryCounts: Record<string, number>;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onInStockChange: (value: boolean) => void;
  onDealsOnlyChange: (value: boolean) => void;
  onSortChange: (value: FurnitureSortOption) => void;
  onResetFilters: () => void;
}
