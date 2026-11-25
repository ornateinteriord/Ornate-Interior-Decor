import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { calculateCartSummary, getApiErrorMessage } from "@ornate/utils";
import type {
  CartItem,
  CouponRecord,
  FurnitureProduct,
  PricingSummary,
} from "@/types/furniture";
import { useAuth } from "@/context/AuthContext";
import { ecommerceApi } from "@/services/ecommerceApi";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";

const GUEST_CART_KEY = "ornate_guest_cart_v1";
const GUEST_COUPON_KEY = "ornate_guest_coupon_v1";

interface GuestCartRow {
  productId: string;
  quantity: number;
}

function readGuestCart(): GuestCartRow[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestCart(rows: GuestCartRow[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(rows));
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  summary: PricingSummary;
  activeCoupons: CouponRecord[];
  couponCode: string | null;
  isLoading: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (product: FurnitureProduct, quantity?: number, openDrawer?: boolean) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  applyCoupon: (code: string | null) => Promise<boolean>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { data: catalogData } = useFurnitureCatalog();
  const catalogProducts = useMemo(() => catalogData?.products ?? [], [catalogData]);

  const [guestRows, setGuestRows] = useState<GuestCartRow[]>(readGuestCart);
  const [guestCouponCode, setGuestCouponCode] = useState<string | null>(
    () => localStorage.getItem(GUEST_COUPON_KEY)
  );
  const [serverCart, setServerCart] = useState<{
    items: CartItem[];
    couponCode: string | null;
    summary: PricingSummary;
  } | null>(null);
  const [activeCoupons, setActiveCoupons] = useState<CouponRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch public active coupons for cart & checkout tips
  useEffect(() => {
    ecommerceApi
      .getActiveCoupons()
      .then(setActiveCoupons)
      .catch(() => {
        // Ignore when offline
      });
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setServerCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const pendingGuest = readGuestCart();
      let cartData;
      if (pendingGuest.length > 0) {
        cartData = await ecommerceApi.mergeGuestCart(pendingGuest);
        localStorage.removeItem(GUEST_CART_KEY);
        setGuestRows([]);
        if (guestCouponCode) {
          try {
            cartData = await ecommerceApi.applyCartCoupon(guestCouponCode);
          } catch {
            // Coupon minimum not met or expired
          }
          localStorage.removeItem(GUEST_COUPON_KEY);
          setGuestCouponCode(null);
        }
        toast.success("Your cart items were synced to your account");
      } else {
        cartData = await ecommerceApi.getCart();
      }
      setServerCart(cartData);
    } catch {
      // ignore transient errors
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, guestCouponCode]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart, user?.id]);

  // Hydrate guest cart locally against catalog
  const guestHydrated = useMemo(() => {
    const byId = new Map(catalogProducts.map((p) => [p.id, p]));
    const items: CartItem[] = [];
    for (const row of guestRows) {
      const prod = byId.get(row.productId);
      if (!prod) continue;
      const qty = Math.max(1, Math.min(row.quantity, Math.max(1, prod.stockCount)));
      items.push({
        productId: prod.id,
        sku: prod.sku,
        slug: prod.slug,
        name: prod.name,
        brand: prod.brand,
        image: prod.image,
        subcategoryName: prod.subcategoryName,
        source: prod.source,
        unitPrice: prod.price,
        mrp: prod.mrp,
        quantity: qty,
        stockCount: prod.stockCount,
        inStock: prod.inStock,
      });
    }
    const matchedCoupon = activeCoupons.find((c) => c.code === guestCouponCode) || null;
    const summary = calculateCartSummary(items, matchedCoupon);
    return {
      items,
      couponCode: summary.couponCode,
      summary,
    };
  }, [guestRows, catalogProducts, activeCoupons, guestCouponCode]);

  const activeCart = isAuthenticated && serverCart ? serverCart : guestHydrated;

  const addToCart = useCallback(
    async (product: FurnitureProduct, quantity = 1, openDrawer = true) => {
      if (!product.inStock || product.stockCount <= 0) {
        toast.error("This piece is currently out of stock");
        return;
      }

      if (isAuthenticated) {
        try {
          const updated = await ecommerceApi.addCartItem(product.id, quantity);
          setServerCart(updated);
          if (openDrawer) setDrawerOpen(true);
          toast.success(`Added ${product.name} to cart`);
        } catch (err: unknown) {
          toast.error(getApiErrorMessage(err, "Could not add item to cart"));
        }
        return;
      }

      setGuestRows((prev) => {
        const existing = prev.find((r) => r.productId === product.id);
        const nextQty = Math.min(product.stockCount, (existing?.quantity || 0) + quantity);
        const next = existing
          ? prev.map((r) =>
              r.productId === product.id ? { ...r, quantity: nextQty } : r
            )
          : [...prev, { productId: product.id, quantity: nextQty }];
        writeGuestCart(next);
        return next;
      });
      if (openDrawer) setDrawerOpen(true);
      toast.success(`Added ${product.name} to cart`);
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (isAuthenticated) {
        try {
          const updated = await ecommerceApi.updateCartItem(productId, quantity);
          setServerCart(updated);
        } catch (err: unknown) {
          toast.error(getApiErrorMessage(err, "Could not update quantity"));
        }
        return;
      }

      setGuestRows((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((r) => r.productId !== productId)
            : prev.map((r) =>
                r.productId === productId ? { ...r, quantity } : r
              );
        writeGuestCart(next);
        return next;
      });
    },
    [isAuthenticated]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        const updated = await ecommerceApi.removeCartItem(productId);
        setServerCart(updated);
        toast.info("Item removed from cart");
        return;
      }

      setGuestRows((prev) => {
        const next = prev.filter((r) => r.productId !== productId);
        writeGuestCart(next);
        return next;
      });
      toast.info("Item removed from cart");
    },
    [isAuthenticated]
  );

  const applyCoupon = useCallback(
    async (code: string | null) => {
      const normalized = code ? code.trim().toUpperCase() : null;
      if (isAuthenticated) {
        try {
          const updated = await ecommerceApi.applyCartCoupon(normalized);
          setServerCart(updated);
          if (normalized) {
            toast.success(`Coupon ${normalized} applied`);
          } else {
            toast.info("Coupon removed");
          }
          return true;
        } catch (err: unknown) {
          toast.error(getApiErrorMessage(err, "Invalid coupon code"));
          return false;
        }
      }

      if (!normalized) {
        localStorage.removeItem(GUEST_COUPON_KEY);
        setGuestCouponCode(null);
        toast.info("Coupon removed");
        return true;
      }

      try {
        await ecommerceApi.validateCoupon(normalized, guestHydrated.summary.subtotal);
        localStorage.setItem(GUEST_COUPON_KEY, normalized);
        setGuestCouponCode(normalized);
        toast.success(`Coupon ${normalized} applied`);
        return true;
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, "Coupon cannot be applied"));
        return false;
      }
    },
    [isAuthenticated, guestHydrated.summary.subtotal]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      const updated = await ecommerceApi.clearCart();
      setServerCart(updated);
      return;
    }
    localStorage.removeItem(GUEST_CART_KEY);
    localStorage.removeItem(GUEST_COUPON_KEY);
    setGuestRows([]);
    setGuestCouponCode(null);
  }, [isAuthenticated]);

  const itemCount = useMemo(
    () => activeCart.items.reduce((sum, item) => sum + item.quantity, 0),
    [activeCart.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: activeCart.items,
        itemCount,
        summary: activeCart.summary,
        activeCoupons,
        couponCode: activeCart.couponCode,
        isLoading,
        drawerOpen,
        setDrawerOpen,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
