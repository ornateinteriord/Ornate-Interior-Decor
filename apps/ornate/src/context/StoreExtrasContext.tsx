import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ecommerceApi } from "@/services/ecommerceApi";

const GUEST_WISHLIST_KEY = "ornate_guest_wishlist_v1";
const RECENTLY_VIEWED_KEY = "ornate_recently_viewed_v1";
const COMPARE_KEY = "ornate_compare_v1";

function readIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

interface StoreExtrasContextValue {
  wishlistIds: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => Promise<void>;
  recentlyViewedIds: string[];
  trackProductView: (productId: string) => void;
  compareIds: string[];
  toggleCompare: (productId: string, productName?: string) => void;
  clearCompare: () => void;
}

const StoreExtrasContext = createContext<StoreExtrasContextValue | null>(null);

export const StoreExtrasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user, setUserState } = useAuth();
  const [guestWishlist, setGuestWishlist] = useState<string[]>(() =>
    readIds(GUEST_WISHLIST_KEY)
  );
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    readIds(RECENTLY_VIEWED_KEY)
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    readIds(COMPARE_KEY)
  );

  // Sync guest wishlist to MongoDB when customer logs in
  useEffect(() => {
    if (!isAuthenticated || guestWishlist.length === 0) return;
    ecommerceApi
      .syncWishlist(guestWishlist)
      .then((merged) => {
        localStorage.removeItem(GUEST_WISHLIST_KEY);
        setGuestWishlist([]);
        setUserState((prev) => (prev ? { ...prev, wishlist: merged } : prev));
      })
      .catch(() => {
        // ignore
      });
  }, [isAuthenticated, guestWishlist, setUserState]);

  const wishlistIds = isAuthenticated && user ? user.wishlist : guestWishlist;

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string, productName?: string) => {
      if (isAuthenticated) {
        try {
          const res = await ecommerceApi.toggleWishlist(productId);
          setUserState((prev) => (prev ? { ...prev, wishlist: res.wishlist } : prev));
          toast.success(
            res.added
              ? `Saved ${productName || "item"} to Wishlist`
              : `Removed ${productName || "item"} from Wishlist`
          );
        } catch {
          toast.error("Could not update wishlist");
        }
        return;
      }

      setGuestWishlist((prev) => {
        const exists = prev.includes(productId);
        const next = exists
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(next));
        toast.success(
          exists
            ? `Removed ${productName || "item"} from Wishlist`
            : `Saved ${productName || "item"} to Wishlist`
        );
        return next;
      });
    },
    [isAuthenticated, setUserState]
  );

  const trackProductView = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 8);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((productId: string, productName?: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        const next = prev.filter((id) => id !== productId);
        localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
        return next;
      }
      if (prev.length >= 3) {
        toast.info("You can compare up to 3 furniture pieces at a time");
        return prev;
      }
      const next = [...prev, productId];
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      toast.success(`Added ${productName || "piece"} to Compare (${next.length}/3)`);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    localStorage.removeItem(COMPARE_KEY);
    setCompareIds([]);
  }, []);

  return (
    <StoreExtrasContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        recentlyViewedIds,
        trackProductView,
        compareIds,
        toggleCompare,
        clearCompare,
      }}
    >
      {children}
    </StoreExtrasContext.Provider>
  );
};

export function useStoreExtras() {
  const ctx = useContext(StoreExtrasContext);
  if (!ctx) throw new Error("useStoreExtras must be used inside StoreExtrasProvider");
  return ctx;
}
