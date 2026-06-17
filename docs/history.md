# Project History - Instagram Reel Downloader

## 2026-06-12
### feat: complete authentication system
- **Description**: Implemented full authentication flow including Login, Signup, OTP Verification, and Password Reset.
- **Files Changed**: `app/api/(auth)/**/*`, `app/(Auth UI)/**/*`, `db/schema.ts`, `utils/sendOtp.ts`, `utils/jwt.ts`.

### feat: implement semantic theme system and Pitch Dark mode
- **Description**: Resolved CSS specificity issues, implemented semantic theme variables, and added a three-way theme cycle (Light, Dark, Pitch Dark).
- **Files Changed**: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `components/ThemeToggle.tsx`, `components/Header.tsx`, `components/Footer.tsx`, and all Auth UI pages.

### fix: auth state synchronization after verification and logout
- **Description**: Resolved issues where users were not properly redirected or recognized as verified/logged-out without a manual page refresh. Switched to `cookies().delete()` for robust cookie termination and implemented `window.location.href` to bypass client-side router caching during authentication boundary crossings.
- **Files Changed**: `utils/auth.ts`, `components/Header.tsx`, `app/(Auth UI)/verify/page.tsx`.

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
## 2026-06-15
### feat: rebrand to ClipVault and separate landing page
- **Description**: Rebranded the entire application to "ClipVault", including metadata, SEO, and user-facing text. Separated the core downloader interface from the marketing landing page.
- **Key Changes**:
  - Root route (`/`) is now a marketing-focused landing page with "How It Works", "Stats", and "FAQ" sections.
  - Core downloader moved to `/download`.
  - Implemented `callbackUrl` support in authentication flow to preserve user destination after login.
- **Files Changed**: `app/layout.tsx`, `app/page.tsx`, `app/download/page.tsx`, `proxy.ts`, `app/(Auth UI)/login/page.tsx`, `app/(Auth UI)/signup/page.tsx`, `components/Header.tsx`, `components/Footer.tsx`.

### feat: implement MPA structure and route restructuring
- **Description**: Migrated the core downloader to the homepage (`/`) and created dedicated public pages (About, Features, Pricing, Contact) to improve SEO and user acquisition. Added protected routes (`/dashboard`, `/history`).
- **Files Changed**: `app/page.tsx`, `app/about/page.tsx`, `app/features/page.tsx`, `app/pricing/page.tsx`, `app/contact/page.tsx`, `proxy.ts`, `components/Header.tsx`, `components/Footer.tsx`.

### feat: implement usage limits and conversion screens
- **Description**: Implemented strict usage limits for both guest and authenticated users to prevent abuse and manage server resources.
- **Key Changes**:
  - **Guest Users**: Limited to 3 downloads total (tracked via IP and signed `visitor_id`). Redirected to a `LimitReached` conversion screen.
  - **Authenticated Users**: Limited to 10 downloads per day (tracked via `daily_download_count` and `last_download_reset` in DB). Redirected to a `DailyLimitReached` screen.
  - **Intent Persistence**: Preserved the user's intended Reel URL through the authentication flow via `callbackUrl`.
- **Files Changed**: `app/api/reel/metadata/route.ts`, `db/schema.ts`, `components/LimitReached.tsx`, `components/DailyLimitReached.tsx`, `app/page.tsx`, `components/ReelDownloader.tsx`.

### feat: comprehensive responsiveness overhaul
- **Description**: Standardized responsive behavior across the entire application using a "mobile-first" approach. Fluidly scaled typography, padding, grid layouts, and interactive elements for optimal display on small devices (320px) up to large desktops.
- **Files Changed**: `app/page.tsx`, `components/ReelDownloader.tsx`, `components/LimitReached.tsx`, `app/pricing/page.tsx`, `app/contact/page.tsx`, `components/DownloadHistory.tsx`, `app/features/page.tsx`, `app/about/page.tsx`, `components/Header.tsx`, `components/Footer.tsx`.

### feat: implement admin management for unlimited access requests
- **Description**: Developed a complete administrative workflow for managing PRO access applications.
- **Key Changes**:
  - **Admin Control Center**: Created a dedicated management console at `/admin/unlimited-access` with filterable request tables.
  - **Approval/Rejection Flow**: Implemented secure API endpoints for reviewing requests. Approval automatically grants the user `isProAccess` status and bypasses all download limits.
  - **Automated Notifications**: Integrated Nodemailer to send professional approval and rejection emails to users.
  - **Usage Entitlement**: Updated the extraction engine to honor `isProAccess` status, allowing unrestricted Reel extractions.
  - **Audit Logging**: Added detailed logging for all administrative actions to ensure accountability.
- **Files Changed**: `app/api/admin/unlimited-access/**/*`, `app/admin/unlimited-access/page.tsx`, `utils/email.ts`, `app/api/reel/metadata/route.ts`, `app/admin/page.tsx`, `docs/*`.

### feat: implement unlimited access request system
- **Description**: Developed a comprehensive request system allowing authenticated users to apply for unrestricted extraction capabilities.
- **Key Changes**:
  - Designed the `unlimited_access_requests` table to track applications.
  - Prepared the `users` table (`is_pro_access`, `pro_access_granted_at`) for future automated administrative approval flows.
  - Built secure API endpoints (`/api/unlimited-access/request`) preventing duplicate pending requests.
  - Implemented the `UnlimitedAccessRequestForm` component, providing dynamic status interfaces (`PENDING`, `APPROVED`, `REJECTED`).
- **Files Changed**: `db/schema.ts`, `app/api/unlimited-access/request/route.ts`, `components/UnlimitedAccessRequestForm.tsx`, `app/unlimited-access/page.tsx`, `proxy.ts`.

## 2026-06-16
### feat: implement production-ready contact system
- **Description**: Developed a complete Contact System for user inquiries, featuring a functional frontend, secure backend storage, and an administrative management console.
- **Key Changes**:
  - **Database**: Added `contact_submissions` table with status tracking (`NEW`, `READ`, `REPLIED`).
  - **Frontend**: Created an interactive Contact Page with validation, loading states, and success transitions.
  - **Backend API**: Implemented a secure submission endpoint with automated admin email notifications via Nodemailer.
  - **Admin Interface**: Developed a dedicated management console at `/admin/contact-submissions` for reviewing and processing inquiries.
  - **Dashboard Integration**: Integrated contact management into the main Admin Control Center.
- **Files Changed**: `app/contact/page.tsx`, `app/api/contact/route.ts`, `app/admin/contact-submissions/page.tsx`, `app/api/admin/contact-submissions/**/*`, `db/schema.ts`, `utils/email.ts`, `app/admin/page.tsx`.

### fix: resolve contact api 500 error and enhance resilience
- **Description**: Fixed a reported 500 Internal Server Error in the contact submission flow by isolating database operations from secondary notification tasks.
- **Key Changes**:
  - **Error Isolation**: Wrapped database insertion in a dedicated try-catch block to prevent secondary failures (like email) from crashing the request.
  - **Resilient Flow**: Ensured that the API returns a success response to the user as long as the submission is saved to the database, even if the admin notification email fails.
  - **Granular Logging**: Added step-by-step server-side logging and full error stack traces for faster future diagnostics.
  - **Type Safety**: Refined error handling and linter compliance by using explicit `Error` casting.
- **Files Changed**: `app/api/contact/route.ts`.

