import type {
  FurnitureFilterState,
  FurnitureProduct,
  FurnitureSubcategory,
} from "@/types/furniture";
import { formatAttributeKey, formatINR } from "@ornate/utils";

export { formatAttributeKey, formatINR };

export function getPriceBounds(products: FurnitureProduct[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) {
    return { min: 0, max: 50000 };
  }
  let min = Infinity;
  let max = -Infinity;
  for (const product of products) {
    if (product.price < min) min = product.price;
    if (product.price > max) max = product.price;
  }
  return { min, max };
}

export function getAvailableBrands(products: FurnitureProduct[]): string[] {
  const set = new Set<string>();
  for (const product of products) {
    if (product.brand) {
      set.add(product.brand);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getSubcategoryCounts(
  products: FurnitureProduct[],
  subcategories: FurnitureSubcategory[]
): Record<string, number> {
  const counts: Record<string, number> = { all: products.length };
  for (const sub of subcategories) {
    counts[sub.slug] = 0;
  }
  for (const product of products) {
    counts[product.subcategorySlug] =
      (counts[product.subcategorySlug] ?? 0) + 1;
  }
  return counts;
}

export function filterAndSortFurniture(
  products: FurnitureProduct[],
  filters: FurnitureFilterState
): FurnitureProduct[] {
  const normalizedQuery = filters.search.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (
      filters.subcategory !== "all" &&
      product.subcategorySlug !== filters.subcategory
    ) {
      return false;
    }

    if (filters.brand !== "all" && product.brand !== filters.brand) {
      return false;
    }

    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    if (filters.dealsOnly && !product.dealActive) {
      return false;
    }

    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    if (normalizedQuery) {
      const attributeText = product.attributes
        .map((attr) => `${attr.key} ${attr.value}`)
        .join(" ");
      const haystack = [
        product.name,
        product.sku,
        product.brand,
        product.subcategoryName,
        product.shortDescription,
        product.longDescription,
        attributeText,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...filtered];
  switch (filters.sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "discount-desc":
      sorted.sort((a, b) => b.savingsPercent - a.savingsPercent);
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      break;
  }

  return sorted;
}

export function countActiveFilters(
  filters: FurnitureFilterState,
  bounds: { min: number; max: number }
): number {
  let count = 0;
  if (filters.subcategory !== "all") count += 1;
  if (filters.brand !== "all") count += 1;
  if (filters.inStockOnly) count += 1;
  if (filters.dealsOnly) count += 1;
  if (filters.minPrice > bounds.min || filters.maxPrice < bounds.max) count += 1;
  return count;
}
