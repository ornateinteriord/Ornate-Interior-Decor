import React from "react";
import Seo from "@/components/seo/Seo";
import DesktopShopView from "@/components/shop/DesktopShopView";
import MobileShopView from "@/components/mobile/MobileShopView";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { useFurnitureFilters } from "@/hooks/useFurnitureFilters";

const Shop: React.FC = () => {
  const { data, isLoading, isError, refetch } = useFurnitureCatalog();

  const subcategories = data?.subcategories ?? [];
  const products = data?.products ?? [];
  const sellerName = data?.sellerName ?? "Ornate Interior Decor";

  const {
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
  } = useFurnitureFilters(products, subcategories);

  const sharedProps = {
    sellerName,
    subcategories,
    products,
    filteredProducts,
    isLoading,
    isError,
    onRetry: () => {
      void refetch();
    },
    filters,
    priceBounds,
    availableBrands,
    subcategoryCounts,
    activeFilterCount,
    onSearchChange: setSearch,
    onSubcategoryChange: setSubcategory,
    onBrandChange: setBrand,
    onPriceRangeChange: setPriceRange,
    onInStockChange: setInStockOnly,
    onDealsOnlyChange: setDealsOnly,
    onSortChange: setSortBy,
    onResetFilters: resetFilters,
  };

  return (
    <>
      <Seo
        title="Shop Furniture Collection"
        description="Browse curated furniture from Ornate Interior Decor in Bengaluru."
        path="/shop"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ]}
      />

      <div className="hidden md:block">
        <DesktopShopView {...sharedProps} />
      </div>

      <div className="md:hidden">
        <MobileShopView {...sharedProps} />
      </div>
    </>
  );
};

export default Shop;
