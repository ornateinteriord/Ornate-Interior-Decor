import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  countActiveFilters,
  filterAndSortFurniture,
  getAvailableBrands,
  getPriceBounds,
  getSubcategoryCounts,
} from "@/lib/furnitureFilters";
import type {
  FurnitureFilterState,
  FurnitureProduct,
  FurnitureSortOption,
  FurnitureSubcategory,
} from "@/types/furniture";

export function useFurnitureFilters(
  products: FurnitureProduct[],
  subcategories: FurnitureSubcategory[]
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const priceBounds = useMemo(() => getPriceBounds(products), [products]);

  const validSlugs = useMemo(
    () => new Set(subcategories.map((sub) => sub.slug)),
    [subcategories]
  );

  const initialSubcategory = searchParams.get("category");
  const initialQuery = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState<FurnitureFilterState>({
    search: initialQuery,
    subcategory: "all",
    brand: "all",
    minPrice: priceBounds.min,
    maxPrice: priceBounds.max,
    inStockOnly: false,
    dealsOnly: false,
    sortBy: "featured",
  });

  // Sync URL ?category= and ?q= when navigation updates query params
  useEffect(() => {
    const paramCategory = searchParams.get("category");
    if (paramCategory && validSlugs.has(paramCategory)) {
      setFilters((prev) =>
        prev.subcategory === paramCategory
          ? prev
          : { ...prev, subcategory: paramCategory }
      );
    } else if (!paramCategory && initialSubcategory === null) {
      setFilters((prev) =>
        prev.subcategory === "all" ? prev : { ...prev, subcategory: "all" }
      );
    }

    const paramQuery = searchParams.get("q");
    if (paramQuery !== null) {
      setFilters((prev) =>
        prev.search === paramQuery ? prev : { ...prev, search: paramQuery }
      );
    }
  }, [searchParams, validSlugs, initialSubcategory]);

  // Keep price range aligned once API products load
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceBounds.min,
      maxPrice: priceBounds.max,
    }));
  }, [priceBounds.min, priceBounds.max]);

  const setSubcategory = useCallback(
    (subcategory: string) => {
      setFilters((prev) => ({ ...prev, subcategory }));
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (subcategory === "all") {
            next.delete("category");
          } else {
            next.set("category", subcategory);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setBrand = useCallback((brand: string) => {
    setFilters((prev) => ({ ...prev, brand }));
  }, []);

  const setPriceRange = useCallback((minPrice: number, maxPrice: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  }, []);

  const setInStockOnly = useCallback((inStockOnly: boolean) => {
    setFilters((prev) => ({ ...prev, inStockOnly }));
  }, []);

  const setDealsOnly = useCallback((dealsOnly: boolean) => {
    setFilters((prev) => ({ ...prev, dealsOnly }));
  }, []);

  const setSortBy = useCallback((sortBy: FurnitureSortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      subcategory: "all",
      brand: "all",
      minPrice: priceBounds.min,
      maxPrice: priceBounds.max,
      inStockOnly: false,
      dealsOnly: false,
      sortBy: "featured",
    });
    setSearchParams({}, { replace: true });
  }, [priceBounds.max, priceBounds.min, setSearchParams]);

  const availableBrands = useMemo(
    () => getAvailableBrands(products),
    [products]
  );

  const subcategoryCounts = useMemo(
    () => getSubcategoryCounts(products, subcategories),
    [products, subcategories]
  );

  const filteredProducts = useMemo(
    () => filterAndSortFurniture(products, filters),
    [products, filters]
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters, priceBounds),
    [filters, priceBounds]
  );

  return {
    filters,
    priceBounds,
    availableBrands,
    subcategoryCounts,
    filteredProducts,
    activeFilterCount,
    setSubcategory,
    setSearch,
    setBrand,
    setPriceRange,
    setInStockOnly,
    setDealsOnly,
    setSortBy,
    resetFilters,
  };
}
