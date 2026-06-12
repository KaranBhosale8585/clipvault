# Project Architecture - Instagram Reel Downloader

## Folder Structure
```text
D:\products\downloader\
├── docs/                # Project documentation
├── app/                 # Next.js App Router (Routes & API)
│   ├── api/             # API routes
│   └── (Auth UI)/       # Authentication related pages
├── components/          # React components
├── db/                  # Database schema and connection
├── public/              # Static assets
├── utils/               # Utility functions
└── ...
```

## Database Schema
The project uses PostgreSQL with Drizzle ORM.

### tables:
- `users`: Stores user profile, role (user/admin), and authentication status.
- `otp`: Stores one-time passwords for verification and password reset.
- `otp_requests`: Tracks OTP requests for rate limiting/logging.
- `downloads`: Tracks user download history including Reel metadata and status.

## API Flow
1. Client makes a request to `/api/reel/metadata`.
2. Controller (`app/api/reel/metadata/route.ts`) checks rate limits and authorization. Unauthenticated users are allowed 1 free download tracked via their IP Address in the `downloads` table.
3. Controller checks the `downloads` table for a cached metadata record (within the last 12 hours) matching the requested URL.
4. If cached, it returns the cached metadata instantly. If not, the Utility layer (`utils/instagram.ts`) invokes the Python bridge.
5. Python bridge (`utils/pythonBridge.ts`) spawns a child process for `services/python/downloader.py`.
6. Python script uses `yt-dlp` to extract reliable metadata and returns JSON.
7. Node.js layer maps JSON to `ReelMetadata` and returns it to the client.
8. Metadata is persisted in PostgreSQL via Drizzle.
9. Client uses `/api/download-proxy` (Media Proxy) to fetch thumbnails and videos, bypassing CORS and hotlinking restrictions. Supports both `inline` and `attachment` modes.

## Security & Abuse Protection
- **Rate Limiting**: Authenticated users are limited to 5 downloads per 15 minutes. Anonymous users are restricted to 1 lifetime free download tracked by IP address.
- **Bot Protection & DDoS**: Public endpoints (`/`, `/api/reel/metadata`) are designed to be deployed behind Cloudflare or Vercel Edge Network for DDoS mitigation and WAF rules.
- **Input Validation**: URLs are validated using regex (`INSTAGRAM_REEL_REGEX`) before hitting the Python extraction service to prevent command injection.

## SEO Strategy
- **Dynamic Metadata**: `app/layout.tsx` includes comprehensive OpenGraph, Twitter Cards, and standard metadata.
- **Structured Data**: JSON-LD (`WebApplication` schema) is injected into `app/page.tsx` for enhanced search engine visibility.
- **Crawling**: `sitemap.xml` and `robots.txt` are dynamically generated to guide search engine bots.

## Scalability
- **Metadata Caching**: To prevent overwhelming the server with expensive `yt-dlp` Python child processes, the API caches extracted metadata in the database for 12 hours. Subsequent requests for the same Reel URL reuse the database record.
- **Database Optimization**: Added indexes to frequently queried columns like `userId`, `reelUrl`, and `level` (logs) for rapid lookups.

## Sub-Services
- **Python Downloader**: A standalone script using `yt-dlp` for robust Instagram extraction.
- **Node-Python Bridge**: Facilitates communication between Next.js and the Python script.

## Auth Flow
1. **Signup**: User provides name, email, password. OTP is sent to email.
2. **Verification**: User enters OTP to verify account.
3. **Login**: User provides credentials. JWT is issued and stored in cookies.
4. **Get Me**: `/api/get-me` returns the authenticated user data.
5. **Reset Password**: Forgot password flow via OTP.

## Docker Setup (Planned)
- `App Container`: Next.js application.
- `Database Container`: PostgreSQL.
- `Volumes`: Persistent storage for the database.
- `Networking`: Bridge network for communication between app and db.

## Deployment Flow (Planned)
- Deployment to Vercel (for frontend/API) or a VPS using Docker.
- Database hosted on a managed service or via Docker.
