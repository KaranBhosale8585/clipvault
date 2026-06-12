# Project History - Instagram Reel Downloader

## 2026-06-12
### feat: complete authentication system
- **Description**: Implemented full authentication flow including Login, Signup, OTP Verification, and Password Reset.
- **Files Changed**: `app/api/(auth)/**/*`, `app/(Auth UI)/**/*`, `db/schema.ts`, `utils/sendOtp.ts`, `utils/jwt.ts`.

### feat: implement semantic theme system and Pitch Dark mode
- **Description**: Resolved CSS specificity issues, implemented semantic theme variables, and added a three-way theme cycle (Light, Dark, Pitch Dark).
- **Files Changed**: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `components/ThemeToggle.tsx`, `components/Header.tsx`, `components/Footer.tsx`, and all Auth UI pages.

### refactor: migrate middleware to proxy
- **Description**: Migrated `middleware.ts` to `proxy.ts` to align with the new Next.js convention. Renamed the exported function from `middleware` to `proxy`.
- **Files Changed**: `middleware.ts` (renamed to `proxy.ts`), `proxy.ts`.

### feat: begin ShadCN UI integration
- **Description**: Initialized ShadCN UI utilities and added the first component (`Button`). Installed `class-variance-authority`, `clsx`, `tailwind-merge`, and `@radix-ui/react-slot`. Created `utils/cn.ts` for class merging.
- **Files Changed**: `utils/cn.ts`, `components/ui/button.tsx`, `package.json`.

### feat: expand ShadCN UI components
- **Description**: Added `Card`, `Input`, and `Badge` components to the UI library. These components are based on Radix UI primitives and are styled with Tailwind CSS.
- **Files Changed**: `components/ui/card.tsx`, `components/ui/input.tsx`, `components/ui/badge.tsx`.

### feat: refactor UI components with ShadCN
- **Description**: Migrated `ReelDownloader.tsx` and `app/page.tsx` to use ShadCN components (`Card`, `Button`, `Badge`, `Input`, `Skeleton`). Improved consistency and removed redundant custom CSS.
- **Files Changed**: `components/ReelDownloader.tsx`, `app/page.tsx`.

### feat: refactor DownloadHistory with ShadCN
- **Description**: Migrated `DownloadHistory.tsx` to use ShadCN components (`Card`, `Button`, `Skeleton`). Enhanced the loading state with skeletal previews.
- **Files Changed**: `components/DownloadHistory.tsx`.

### feat: refactor Admin Dashboard with ShadCN
- **Description**: Migrated `app/admin/page.tsx` to use ShadCN components (`Card`, `Button`, `Badge`, `Skeleton`, `Tabs`, `Table`). Standardized the layout and improved the loading states.
- **Files Changed**: `app/admin/page.tsx`, `components/ui/table.tsx`, `components/ui/tabs.tsx`.

### feat: complete ShadCN UI refactor for Auth pages
- **Description**: Migrated `Login`, `Signup`, `Verify`, and `Forgot Password` pages to use ShadCN components. Added `Label`, `Table`, and `Tabs` to the UI library. Standardized input fields and buttons across all authentication flows.
- **Files Changed**: `app/(Auth UI)/**/*`, `components/ui/label.tsx`.

### feat: migrate to yt-dlp for reliable Reel extraction
- **Root Cause Analysis**: The previous HTML scraping method for Instagram Reels was frequently blocked by anti-bot measures, causing metadata extraction to fail.
- **Description**: Integrated `yt-dlp` via a Python service and a Node.js bridge. This migration ensures robust metadata extraction (title, thumbnail, video URL) and eliminates the need for manual HTML parsing. Updated Docker configuration to support Python 3 and `yt-dlp`.
- **Files Changed**: `utils/instagram.ts` (refactored), `utils/pythonBridge.ts` (new), `services/python/downloader.py` (new), `services/python/requirements.txt` (new), `Dockerfile`, `docs/architecture.md`.

## 2026-06-12 (Continued)
### docs: initialize project documentation and docker setup
- **Description**: Created `docs/` directory with `rules.md`, `history.md`, `tasks.md`, and `architecture.md`. Added `Dockerfile`, `docker-compose.yml`, and `.env.example`.
- **Files Changed**: `docs/**/*`, `Dockerfile`, `docker-compose.yml`, `.env.example`.

### feat: implement reel url validation and metadata extraction
- **Description**: Added `downloads` table to database schema. Implemented `utils/instagram.ts` for URL validation. Created `/api/reel/metadata` for extraction. Integrated `ReelDownloader` UI component into the dashboard.
- **Files Changed**: `db/schema.ts`, `docs/architecture.md`, `utils/instagram.ts`, `app/api/reel/metadata/route.ts`, `components/ReelDownloader.tsx`, `app/page.tsx`.

### feat: implement download history api and ui
- **Description**: Created `/api/reel/history` to fetch user's download records. Implemented `DownloadHistory.tsx` component to display past reels. Integrated refresh logic using CustomEvents between downloader and history components.
- **Files Changed**: `app/api/reel/history/route.ts`, `components/DownloadHistory.tsx`, `components/ReelDownloader.tsx`, `app/page.tsx`.

### feat: implement download proxy and enhance metadata extraction
- **Description**: Created `/api/download-proxy` to bypass CORS and force file downloads. Updated `fetchReelMetadata` to attempt real HTML parsing for Open Graph tags. Standardized download experience across Downloader and History components.
- **Files Changed**: `app/api/download-proxy/route.ts`, `utils/instagram.ts`, `components/ReelDownloader.tsx`, `components/DownloadHistory.tsx`.

### fix: remove all fallback behavior and implement high-verbosity logging
- **Root Cause Analysis**: Identified that metadata extraction was frequently being blocked by Instagram's anti-bot measures (redirects to login). The previous code returned a simulated "Big Buck Bunny" video as a fallback, masking these failures.
- **Description**: Deleted all mock/demo logic. Implemented detailed server-side logging for incoming URLs, shortcodes, request headers, and response HTML snippets. Added UI logging for extraction lifecycle. Updated API to only persist successful extractions.
- **Files Changed**: `utils/instagram.ts`, `app/api/reel/metadata/route.ts`, `components/ReelDownloader.tsx`.

### feat: implement download rate limiting
- **Description**: Added `checkDownloadRateLimit` to `utils/rateLimit.ts`. Applied 5 requests per 15 minutes limit to the metadata API. Updated UI to handle 429 status codes with user-friendly messages.
- **Files Changed**: `utils/rateLimit.ts`, `app/api/reel/metadata/route.ts`, `components/ReelDownloader.tsx`.

### feat: implement admin dashboard and role-based access
- **Description**: Added `role` field to `usersTable`. Created `/api/admin/stats` for platform analytics. Implemented `app/admin/page.tsx` for authorized administrators. Integrated Admin Control link into the Workspace profile card.
- **Files Changed**: `db/schema.ts`, `utils/getUser.ts`, `app/api/admin/stats/route.ts`, `app/admin/page.tsx`, `app/page.tsx`.

### feat: implement persistent logging system
- **Description**: Added `logsTable` to database. Created centralized `logger` utility for `info`, `warn`, and `error` events. Instrumentated Instagram scraper to log extraction lifecycle and failure metadata. Integrated "System Audit" viewer into the Admin Dashboard.
- **Files Changed**: `db/schema.ts`, `utils/logger.ts`, `utils/instagram.ts`, `app/api/admin/stats/route.ts`, `app/admin/page.tsx`.

### feat: secure admin authentication and middleware
- **Description**: Updated `utils/jwt.ts` to include user roles in tokens. Refined `proxy.ts` to protect `/admin` routes. Created `middleware.ts` to enforce these checks globally.
- **Files Changed**: `utils/jwt.ts`, `proxy.ts`, `middleware.ts`.

### feat: perform final production audit and implement security hardening
- **Description**: Conducted a final production audit and implemented several critical hardening measures:
  - **Robust Tracking**: Replaced simple IP tracking for anonymous users with a hybrid approach using signed "Visitor ID" cookies and IP correlation.
  - **Abuse Protection**: Implemented a global IP-based rate limit (100 req / 15 mins) to protect against bot spam.
  - **Data Retention**: Added an automatic 30-day purge for logs and download history to ensure database scalability.
  - **SEO Finalization**: Added canonical URLs, refined OpenGraph site configuration, and verified crawler instructions.
- **Files Changed**: `utils/auth.ts`, `db/schema.ts`, `app/api/reel/metadata/route.ts`, `app/api/admin/stats/route.ts`, `app/layout.tsx`, `utils/rateLimit.ts`, `docs/architecture.md`.
