import axios from "axios";
import type {
  CartItem,
  CouponRecord,
  OrderRecord,
  PricingSummary,
  ProductReview,
  UserAddress,
  UserProfile,
} from "@/types/furniture";
import { LOCAL_API_BASE_URL } from "./furnitureApi";

const TOKEN_KEY = "ornate_customer_token";

export const storeApi = axios.create({
  baseURL: `${LOCAL_API_BASE_URL}/api`,
  timeout: 15000,
});

storeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getCustomerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setCustomerToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export interface HydratedCartResponse {
  items: CartItem[];
  couponCode: string | null;
  summary: PricingSummary;
}

export interface RazorpayOrderCreateResponse {
  order: OrderRecord;
  razorpay: {
    mode: "razorpay_live_test" | "razorpay_test_simulator";
    keyId: string;
    razorpayOrderId: string;
    amountPaise: number;
    currency: string;
  };
}

export const ecommerceApi = {
  // Auth
  async register(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ token: string; user: UserProfile }> {
    const { data } = await storeApi.post("/auth/register", payload);
    return data.data;
  },

  async login(payload: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: UserProfile }> {
    const { data } = await storeApi.post("/auth/login", payload);
    return data.data;
  },

  async getMe(): Promise<UserProfile> {
    const { data } = await storeApi.get("/auth/me");
    return data.data.user;
  },

  async updateMe(payload: {
    name?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<UserProfile> {
    const { data } = await storeApi.patch("/auth/me", payload);
    return data.data.user;
  },

  // Wishlist
  async toggleWishlist(productId: string): Promise<{ added: boolean; wishlist: string[] }> {
    const { data } = await storeApi.post("/auth/wishlist/toggle", { productId });
    return data.data;
  },

  async syncWishlist(productIds: string[]): Promise<string[]> {
    const { data } = await storeApi.post("/auth/wishlist/sync", { productIds });
    return data.data.wishlist;
  },

  // Addresses
  async getAddresses(): Promise<UserAddress[]> {
    const { data } = await storeApi.get("/addresses");
    return data.data;
  },

  async addAddress(
    payload: Omit<UserAddress, "id">
  ): Promise<UserAddress> {
    const { data } = await storeApi.post("/addresses", payload);
    return data.data;
  },

  async updateAddress(
    id: string,
    payload: Partial<Omit<UserAddress, "id">>
  ): Promise<UserAddress> {
    const { data } = await storeApi.patch(`/addresses/${id}`, payload);
    return data.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await storeApi.delete(`/addresses/${id}`);
  },

  // Cart
  async getCart(): Promise<HydratedCartResponse> {
    const { data } = await storeApi.get("/cart");
    return data.data;
  },

  async addCartItem(productId: string, quantity = 1): Promise<HydratedCartResponse> {
    const { data } = await storeApi.post("/cart/items", { productId, quantity });
    return data.data;
  },

  async updateCartItem(productId: string, quantity: number): Promise<HydratedCartResponse> {
    const { data } = await storeApi.patch(`/cart/items/${productId}`, { quantity });
    return data.data;
  },

  async removeCartItem(productId: string): Promise<HydratedCartResponse> {
    const { data } = await storeApi.delete(`/cart/items/${productId}`);
    return data.data;
  },

  async mergeGuestCart(
    items: { productId: string; quantity: number }[]
  ): Promise<HydratedCartResponse> {
    const { data } = await storeApi.post("/cart/merge", { items });
    return data.data;
  },

  async applyCartCoupon(code: string | null): Promise<HydratedCartResponse> {
    const { data } = await storeApi.post("/cart/coupon", { code });
    return data.data;
  },

  async clearCart(): Promise<HydratedCartResponse> {
    const { data } = await storeApi.delete("/cart");
    return data.data;
  },

  // Coupons, Reviews, Pincode, Stock Alerts
  async getActiveCoupons(): Promise<CouponRecord[]> {
    const { data } = await storeApi.get("/coupons/active");
    return data.data;
  },

  async validateCoupon(
    code: string,
    subtotal: number
  ): Promise<{ code: string; title: string; discountAmount: number }> {
    const { data } = await storeApi.post("/coupons/validate", { code, subtotal });
    return data.data;
  },

  async checkPincode(pincode: string): Promise<{
    pincode: string;
    serviceable: boolean;
    zone: string;
    estimatedDays: string;
    freeInstallation: boolean;
    note: string;
  }> {
    const { data } = await storeApi.get(`/delivery/check`, { params: { pincode } });
    return data.data;
  },

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    const { data } = await storeApi.get(`/products/${productId}/reviews`);
    return data.data;
  },

  async submitProductReview(
    productId: string,
    payload: { rating: number; title: string; comment: string }
  ): Promise<ProductReview> {
    const { data } = await storeApi.post(`/products/${productId}/reviews`, payload);
    return data.data;
  },

  async subscribeStockAlert(productId: string, email: string): Promise<string> {
    const { data } = await storeApi.post(`/products/${productId}/stock-alert`, {
      email,
    });
    return data.message;
  },

  // Orders & Razorpay Payments
  async createRazorpayOrder(payload: {
    addressId?: string;
    shippingAddress?: Omit<UserAddress, "id" | "isDefault">;
    items?: { productId: string; quantity: number }[];
    couponCode?: string | null;
    deliveryNotes?: string;
    giftWrap?: boolean;
  }): Promise<RazorpayOrderCreateResponse> {
    const { data } = await storeApi.post(
      "/orders/checkout/create-razorpay-order",
      payload
    );
    return data.data;
  },

  async getSimulatorSignature(razorpayOrderId: string): Promise<{
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }> {
    const { data } = await storeApi.post("/orders/checkout/simulator-sign", {
      razorpayOrderId,
    });
    return data.data;
  },

  async verifyRazorpayPayment(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    method?: string;
  }): Promise<OrderRecord> {
    const { data } = await storeApi.post("/orders/checkout/verify-payment", payload);
    return data.data.order;
  },

  async reportPaymentFailed(payload: {
    razorpay_order_id: string;
    razorpay_payment_id?: string;
    reason?: string;
    method?: string;
  }): Promise<OrderRecord> {
    const { data } = await storeApi.post("/orders/checkout/payment-failed", payload);
    return data.data.order;
  },

  async reportPaymentCancelled(payload: {
    razorpay_order_id: string;
    reason?: string;
  }): Promise<OrderRecord> {
    const { data } = await storeApi.post("/orders/checkout/payment-cancelled", payload);
    return data.data.order;
  },

  async retryOrderPayment(orderId: string): Promise<RazorpayOrderCreateResponse> {
    const { data } = await storeApi.post(`/orders/${orderId}/retry-payment`);
    return data.data;
  },

  async getOrders(): Promise<OrderRecord[]> {
    const { data } = await storeApi.get("/orders");
    return data.data;
  },

  async getOrder(identifier: string): Promise<OrderRecord> {
    const { data } = await storeApi.get(`/orders/${identifier}`);
    return data.data;
  },

  async cancelOrder(orderId: string, reason?: string): Promise<OrderRecord> {
    const { data } = await storeApi.post(`/orders/${orderId}/cancel`, { reason });
    return data.data;
  },
};
