# Ornate Interior Decor — Turborepo E-Commerce Platform

A full-stack Turborepo monorepo powering **Ornate Interior Decor**'s customer storefront, admin portal, and multi-database Node + Express backend.

## Monorepo Structure

```text
├── apps/
│   ├── ornate/          # Customer E-Commerce Storefront (React + Vite + Tailwind, port 8080)
│   ├── admin/           # Admin Studio Console (React + Vite + Tailwind, port 5174)
│   └── api/             # Node.js + Express (JavaScript ESM) API Server (port 4000)
├── packages/
│   ├── types/           # @ornate/types — Shared TypeScript interfaces
│   └── utils/           # @ornate/utils — Shared INR, pricing, GST & order helpers
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Multi-Database MongoDB Atlas Architecture (`apps/api`)

`apps/api` connects to MongoDB Atlas and binds **4 logical databases** via Mongoose `useDb`:

| Database | Collections | Purpose |
| --- | --- | --- |
| `ornate_catalog` | `products`, `external_overrides`, `subcategories`, `coupons`, `reviews` | MongoDB-added products, external API overrides, categories, coupons, reviews |
| `ornate_users` | `users`, `addresses`, `stock_alerts` | Customer accounts, saved shipping addresses, back-in-stock alerts |
| `ornate_orders` | `carts`, `orders`, `payment_logs` | Persistent user carts, Razorpay orders, payment audit logs |
| `ornate_admin` | `admins`, `audit_logs` | Admin accounts and product/order/upload audit trail |

## Key Integrations

1. **Combined Product Catalog (`apps/api` + `apps/admin` + `apps/ornate`)**
   - Live-fetches `https://api-geteway.vercel.app/api/v1/seller/SLR00003/products` and combines it with MongoDB-added products (`ornate_catalog.products`).
   - Supports admin edits/overrides/visibility toggles on external API items via `external_overrides` and full CRUD on MongoDB-added products.
2. **ImageKit CDN (`Ornate_Firnitures` folder)**
   - Admin image uploads go through `POST /api/admin/upload`, upload directly to ImageKit under `/Ornate_Firnitures`, and persist the returned ImageKit URL in MongoDB.
3. **Razorpay Online Checkout (Online Payment Only)**
   - Checkout requires customer authentication (login or account creation with basic details; guest cart & wishlist merge automatically on sign-in).
   - Supports live Razorpay Test Keys (`RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in `apps/api/.env`) or **Razorpay Test Simulator Mode** when keys are blank, validating signature verification (HMAC-SHA256), payment failures, user dismissals, retry flows, idempotent replays, and atomic stock checks.

## Default Seeded Admin

- **Email:** `admin@ornateinteriordecor.com`
- **Password:** `OrnateAdmin@2026`

## Commands

```bash
pnpm install
pnpm dev          # Runs ornate (8080), admin (5174), and api (4000) via Turborepo
pnpm build        # Builds ornate and admin apps
pnpm typecheck    # Runs TypeScript checks across apps & shared packages
pnpm test         # Runs API & Razorpay scenario integration tests
```
