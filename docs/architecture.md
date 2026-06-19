# Project Architecture - ClipVault

## Overview
ClipVault is a premium Instagram Reel downloader built with Next.js, Python, and PostgreSQL. It separates a public-facing marketing experience from a secure, high-performance extraction application.

## Folder Structure
```text
D:\products\downloader\
├── docs/                # Project documentation
├── app/                 # Next.js App Router (Routes & API)
│   ├── (Auth UI)/       # Login, Signup, Verify, etc.
│   ├── about/           # About Page
│   ├── admin/           # Admin Control Center
│   ├── api/             # API Endpoints (Auth, Metadata, History, Proxy)
│   ├── contact/         # Contact Page
│   ├── dashboard/       # User Dashboard
│   ├── features/        # Features Page
│   ├── history/         # History Page
│   ├── pricing/         # Pricing Page
│   └── page.tsx         # Core Downloader (Homepage)
├── components/          # Shared React UI components
├── db/                  # Drizzle ORM Schema and DB client
├── services/            # Python extraction scripts
└── utils/               # Auth, JWT, and Bridge utilities
```

## Route Structure
- `/`: Core downloader application. Public access for free trial (3 downloads), then requires authentication.
- `/about`: Company mission, values, and platform limitations.
- `/features`: Detailed technical capabilities of the extraction engine.
- `/pricing`: Subscription tiers (Free/Pro).
- `/contact`: Support and feedback channel (split Server/Client form).
- `/privacy`: Privacy Policy detailing data handling, session cookies, rate limits, and 30-day purge cycle.
- `/terms`: Terms & Conditions outlining user responsibility and liability waivers.
- `/dashboard`: Protected user overview and profile.
- `/history`: Protected download history viewer.
- `/admin`: Protected admin dashboard for platform monitoring.

## API Flow
1. Client makes a request to `/api/reel/metadata`.
2. Controller (`app/api/reel/metadata/route.ts`) checks rate limits and authorization. Unauthenticated users are allowed 3 free downloads tracked via their IP Address and a signed Visitor ID in the `downloads` table.
3. Controller checks the `downloads` table for a cached metadata record (within the last 12 hours) matching the requested URL.
4. If cached, it returns the cached metadata instantly. If not, the Utility layer (`utils/instagram.ts`) invokes the Python bridge.
5. Python bridge (`utils/pythonBridge.ts`) spawns a child process for `services/python/downloader.py`.
6. Python script uses `yt-dlp` to extract reliable metadata and returns JSON.
7. Node.js layer maps JSON to `ReelMetadata` and returns it to the client.
8. Metadata is persisted in PostgreSQL via Drizzle.
9. Client uses `/api/download-proxy` (Media Proxy) to fetch thumbnails and videos, bypassing CORS and hotlinking restrictions. Supports both `inline` and `attachment` modes.
10. Users can manage their history via `/api/reel/history`. The `DELETE` method is strictly scoped to the authenticated user's ID to prevent unauthorized data loss.

## Security & Abuse Protection
- **Robust Tracking**: Anonymous usage is tracked using a hybrid of IP Address and a signed "Visitor ID" JWT cookie.
- **Global Rate Limiting**: All extraction requests are subject to an IP-based rate limit (100 req / 15 mins) to prevent bot-driven resource exhaustion.
- **Data Retention**: Log and download records older than 30 days are automatically purged via background tasks in the Admin API.
- **Input Validation**: URLs are validated using regex (`INSTAGRAM_REEL_REGEX`) before hitting the Python extraction service.

## SEO Strategy
- **Core Application Hub**: The root route (`/`) serves as the central downloader application, optimized for both conversion and search visibility.
- **Dynamic Metadata**: All public pages (`/about`, `/features`, `/pricing`, `/contact`, `/privacy`, `/terms`) export unique title templates, custom descriptions, canonical URL paths, OpenGraph properties, and Twitter Card specifications.
- **Secure Index Prevention**: Protected user paths (`/dashboard`, `/history`, `/unlimited-access`, and admin panels) are explicitly configured with `robots: { index: false, follow: false }` metadata using Server Layouts and exports to prevent search leaks. Intermediate auth paths (`/verify`, `/forgot-password`) are also index-blocked.
- **Dedicated Auth Meta Routing**: Configured isolated layouts for `/login` and `/signup` to assign search-friendly title structures, description details, and canonicals, preventing indexing defaults clashes.
- **Structured Data**: Injects detailed multi-schema JSON-LD metadata, including `WebApplication` on root, a dynamic `FAQPage` matching search intents, an `Organization` descriptor mapping site identity/social links, and a `BreadcrumbList` representation for home route verification.
- **Sitemap Indexing**: A dynamic sitemap (`app/sitemap.ts`) maps all public marketing, legal, support, and account endpoints. Crawling directives are managed through a robust `app/robots.ts` config.
- **LCP & Preconnect Acceleration**: Injects preconnect attributes for Instagram's CDN host `scontent.cdninstagram.com` inside the root head to reduce handshake times. Employs browser-level `loading="lazy"` and `decoding="async"` for image thumbnails in collections and previews to protect Largest Contentful Paint (LCP) and CLS thresholds.

## Limit Enforcement & Conversion
- **Anonymous Tracking**: Guest users are allowed 3 downloads total. Tracking uses a combination of IP address and a signed `visitor_id` cookie.
- **Authenticated Limits**: Logged-in users are allowed 10 downloads per day. This is tracked via `daily_download_count` and `last_download_reset` in the `users` table.
- **Daily Reset**: The system automatically resets the authenticated user's count if the last reset was on a previous day.
- **Dedicated Limit Screens**: 
    - Guest users see a "Free Download Limit Reached" screen.
    - Authenticated users see a "Daily Limit Reached" screen with upgrade options.
- **UX Preservation**: The user's last entered URL is preserved through the authentication flow using query parameters (`?url=...`), allowing them to resume extraction immediately after sign-in.

## Unlimited Access Request System
- **Request Flow**: Authenticated users can request "Pro Access" through `/unlimited-access`. This stores their use case, expected usage, and contact info in `unlimited_access_requests`.
- **Administrative Management**: Administrators review requests via a dedicated console at `/admin/unlimited-access`.
- **Approval Workflow**:
    - **Approval**: Updates request status to `APPROVED`, sets `reviewedAt`, and updates the user record with `isProAccess: true`. An automated approval email is sent.
    - **Rejection**: Updates status to `REJECTED` and sends a rejection email.
- **Entitlement Logic**: The extraction API (`/api/reel/metadata`) checks for `isProAccess` status. If active, all daily download limits and burst rate limits are bypassed, providing unrestricted access to the extraction engine.
- **Audit Trails**: All administrative actions are recorded in the `logs` table for security auditing.

## Contact System
- **Submission Flow**: Users submit inquiries via the `/contact` page. The `POST` endpoint at `/api/contact` validates input and persists data in the `contact_submissions` table.
- **Admin Notifications**: Upon successful submission, the system sends an automated notification email to the administrator containing the message details.
- **Management Console**: Administrators manage inquiries via `/admin/contact-submissions`.
- **Status Lifecycle**: Submissions track their state through `NEW`, `READ`, and `REPLIED` statuses.
- **Administrative Actions**: Admins can mark submissions as read/replied or delete them using a secure confirmation workflow.
- **Security**: The contact API includes basic input validation and email format checks. Admin routes are protected by role-based access control.

## Scalability
- **Metadata Caching**: Metadata is cached for 12 hours in the database to minimize expensive Python child process execution.
- **Database Optimization**: Added B-tree indexes to `user_id`, `reel_url`, and `visitor_id` for rapid lookups.
- **Resource Management**: The `yt-dlp` service is managed via a Node-Python bridge to ensure concurrency doesn't overwhelm system resources.

## Monitoring & Deployment
- **Security Logging**: All critical events (extraction hits, rate limit triggers) are recorded in the `logs` table.
- **Docker Ready**: Multi-stage build support for production-grade containerization.
