import { useQuery } from "@tanstack/react-query";
import { fetchFurnitureCatalog } from "@/services/furnitureApi";

export const FURNITURE_CATALOG_QUERY_KEY = ["furniture-catalog"] as const;

export function useFurnitureCatalog() {
  return useQuery({
    queryKey: FURNITURE_CATALOG_QUERY_KEY,
    queryFn: fetchFurnitureCatalog,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
