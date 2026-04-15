# TryNex Lifestyle

## Overview
TryNex Lifestyle is a premium e-commerce platform specializing in custom apparel for the Bangladeshi market. It is a full-stack pnpm monorepo featuring a React/Vite storefront, an Express API, and a PostgreSQL database. The platform supports BDT pricing, local payment methods (bKash, Nagad, Rocket, COD), and is optimized for Bangladesh-specific marketing and logistics, targeting all 64 districts. The project aims to provide a robust, scalable, and localized online shopping experience with features like a design studio, comprehensive admin panel, and advanced analytics.

## User Preferences
I want to make sure the project is developed iteratively. Ask before making major changes.

## System Architecture

**Monorepo Structure**: pnpm workspaces manage the full-stack monorepo.
**Technology Stack**:
-   **Node.js**: 24, **TypeScript**: 5.9
-   **Frontend**: React 18 with Vite, Tailwind CSS v4, Framer Motion for animations, Recharts for data visualization.
-   **Backend**: Express 5.
-   **Database**: PostgreSQL with Drizzle ORM.
-   **Validation**: Zod (`zod/v4`) and `drizzle-zod`.
-   **API Codegen**: Orval, generating hooks and Zod schemas from OpenAPI specifications.
-   **Build Tool**: esbuild (for CJS bundles).

**UI/UX and Design System**:
-   **Theme**: Light/warm professional, no dark mode.
-   **Color Palette**: Primary `#E85D04` (orange-red), Accent `#FB8500` (warm orange), Backgrounds `#FFFAF5`, `#FFFFFF`, Text `#1C1917`, Success/Trust `#16a34a`.
-   **Typography**: Plus Jakarta Sans (body), Outfit (display headings).
-   **Iconography**: Lucide React SVGs, with `prefers-reduced-motion` support.
-   **Localization**: BDT currency (৳) formatted with `en-BD` locale.
-   **Performance**: Mobile-optimized ParticleCanvas, IntersectionObserver for off-screen elements, SplitTextReveal for text animations, Lenis disabled on touch devices, global `prefers-reduced-motion` respect.
-   **Skeleton Loading**: Implemented for product cards, blog cards, and orders across key pages.

**Key Features**:
-   **Storefront**: Announcement bar, WhatsApp floating button (with first-visit pulse tooltip), Wishlist (localStorage), Flash sale countdown, Category grid with Lucide SVG icons, Animated stats, Testimonials, Product detail page with size guide, WhatsApp order button, custom design upload, desktop hover-to-zoom, mobile sticky add-to-cart bar, Cart & Checkout with district auto-search, local payment gateways (bKash, Nagad, Rocket, COD, Card), dynamic shipping, checkout step progress bar, CartDrawer (slide-in mini-cart from navbar). Navbar transparent-to-solid scroll transition on homepage. Hero animated tagline "You Imagine — We Craft" + trust badges (48hr Production, 64 Districts, 320GSM Fabric). Enhanced empty states with animated illustrations (Cart, Wishlist, Products search). Micro-interaction button press animations throughout.
-   **Blog**: Magazine-style layout with featured posts, category filters, search, reading time estimates, Table of Contents, social share buttons, author bio, and JSON-LD schema.
-   **Order Tracking**: Customer order tracking with status updates.
-   **Dynamic Settings**: All site configurations (WhatsApp number, payment numbers, shipping costs, social media URLs, contact info, announcement text, analytics IDs) are manageable via the admin panel.
-   **SEO & Optimization**: `SEOHead` component for dynamic meta tags, JSON-LD structured data (Organization, WebSite, OnlineStore, Product, BreadcrumbList, BlogPosting schemas), `robots.txt` and `sitemap.xml` for search engine visibility, `ScrollToTop` and `BackToTop` components, Cloudflare Pages optimizations (`_headers`, `_redirects`). Route-based code splitting with React.lazy for all pages. Vendor chunk splitting (React, Framer Motion, TanStack Query, Radix UI, TipTap, Recharts). API rate limiting with express-rate-limit on auth, order creation, and promo endpoints. Cloudflare-friendly Cache-Control headers on API responses.
-   **Analytics & Tracking**: Integrated Google Analytics (GA4), Facebook Pixel, and Google Ads with configurable IDs from the admin panel. Tracks `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase` events.
-   **Admin Panel**:
    -   **Authentication**: JWT-based with `httpOnly` cookies, `JWT_SECRET` environment variable for security.
    -   **Features**: Dashboard with Recharts for revenue, payment distribution, orders, and top-selling products. CRUD management for products (including bulk CSV upload and low-stock filter), orders, blog posts (with Tiptap rich text editor, new fields like category, author info, featured toggle), customers (with CSV export and customer insights).
    -   **Settings**: Comprehensive site configuration, payment gateway settings, analytics tracking IDs.
    -   **Backup & Export**: CSV order export, full JSON database backup/restore.
    -   **Facebook Integration**: Product import from Facebook Page posts.
    -   **Reviews**: Admin approval/rejection of customer reviews.
    -   **UI**: Reusable `ConfirmDialog` and `RichTextEditor` components.
    -   **Special Pages**: Tech Stack page (`/admin/tech-stack`) and Facebook Guide (`/admin/facebook-guide`).
-   **Database Schema**: Includes `categories`, `products`, `orders`, `orderItems`, `siteSettings`, `blogPosts`, `customers`, `admin`, `promo_codes`, `reviews`, `referrals`.
-   **Enhancement Features**: Promo codes (percentage/fixed, usage limits), product reviews (with admin approval, verified buyer badges), referral program, WhatsApp order notifications for admin, customer authentication (email/password, Google/Facebook OAuth), admin promo banner, abandoned cart popup, Instagram feed placeholder.
-   **Bangladesh-Specific Features**: BDT currency, COD with advance payment, bKash/Nagad/Rocket/Card payment, 64 districts with auto-complete, WhatsApp-first support, SocialProofToast, Recently Viewed products, Bangla-friendly typography.

**Deployment Architecture**:
-   **Frontend**: Cloudflare Pages (static SPA).
-   **Backend + DB**: Render.com (Node.js server + PostgreSQL).
-   **Configuration**: `render.yaml` for one-click Render deployment, `VITE_API_BASE_URL` env var for API endpoint. UptimeRobot pings Render to prevent free-tier sleep. Custom design uploads are base64 encoded for portability.

## External Dependencies

-   **Cloudflare Pages**: For frontend hosting.
-   **Render.com**: For backend and database hosting.
-   **PostgreSQL**: Database system.
-   **Google Analytics (GA4)**: For website analytics.
-   **Facebook Pixel**: For Meta Ads tracking.
-   **Google Ads**: For conversion tracking.
-   **CallMeBot API**: For WhatsApp notifications and low stock alerts.
-   **Google OAuth**: For user authentication.
-   **Facebook Login**: For user authentication and product import.
-   **UptimeRobot**: For monitoring Render.com services.
-   **Lucide React**: For SVG icons.
-   **Framer Motion**: For animations.
-   **Recharts**: For data visualization in the admin panel.
-   **Tiptap**: For the rich text editor in the admin panel.
