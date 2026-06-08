---
name: TryNex TypeScript fixes
description: Key TS bugs fixed in storefront and generated types — must apply manually since orval won't regenerate.
---

## Waterbottle mockup path bug
`design-studio/mockups.tsx` had wrong paths for waterbottle:
- Was: `/products/water-bottle.png` (×2)
- Fix: `/mockups/white-waterbottle-front.png` and `/mockups/white-waterbottle-cutout.png`

**Why:** The real PNG files live in `/public/mockups/` not `/public/products/`.

## R3F JSX type declarations
Created `artifacts/trynex-storefront/src/r3f.d.ts` with:
```typescript
/// <reference types="@react-three/fiber" />
```
This extends the JSX namespace so `<group>`, `<mesh>`, etc. are recognised in `garment3d.tsx`.

## Generated type patches (lib/api-client-react/src/generated/api.ts)
These must be added manually — orval codegen will not include them from the spec:
- `GetBlogSettings200` needs `trendingThreshold?: number` (blog route returns it but spec was stale)
- `SiteSettings` interface needs `homepage_layout?: string` (used by AdminPageBuilder)

## HealthStatus double-export
`api.schemas.ts` and `api.ts` both define `HealthStatus`. Fixed `api.schemas.ts` to:
```typescript
export type { HealthStatus } from "./api";
```
instead of its own interface declaration.

## Other per-file fixes
- `AdminDeployment.tsx`: `ChevronDown` was used but missing from lucide import
- `AdminOrders.tsx`: `PAYMENT_LABELS[order.paymentMethod]` → `PAYMENT_LABELS[order.paymentMethod ?? '']`
- `ProductDetail.tsx`: `useGetProduct(numericId, ...)` → `useGetProduct(String(numericId), ...)`
- `SalePage.tsx`: `parseFloat(p.price)` → `parseFloat(String(p.price))` (price typed as number in some contexts)
- `Checkout.tsx`: `createOrder(payload)` → `createOrder({ data: payload } as any)` (hook expects `{ data }` wrapper)
- `Dashboard.tsx`: missing `getApiUrl` import from `@/lib/utils`; `recentOrders` items cast as `any` (generated type is `{ [k: string]: unknown }`)
- `AdminPageBuilder.tsx`: query options cast `as any` to satisfy required `queryKey`; update data cast `as any`
- `AdminSettings.tsx`: `spinWheelResetAt: String(Date.now())` → `Date.now()` (field is `number`)
- `DesignStudio.tsx`: `ref={svgRef}` → `ref={svgRef as any}` on `motion.svg` (framer-motion ref type conflict)

**Why:** Orval generates types from an OpenAPI spec that can lag behind actual API implementation. Always patch generated types manually for new fields rather than trying to regenerate.
