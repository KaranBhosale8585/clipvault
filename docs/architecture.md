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
2. Controller (`app/api/reel/metadata/route.ts`) validates the URL.
3. Utility layer (`utils/instagram.ts`) invokes the Python bridge.
4. Python bridge (`utils/pythonBridge.ts`) spawns a child process for `services/python/downloader.py`.
5. Python script uses `yt-dlp` to extract reliable metadata and returns JSON.
6. Node.js layer maps JSON to `ReelMetadata` and returns it to the client.
7. Metadata is persisted in PostgreSQL via Drizzle.
8. Client uses `/api/download-proxy` (Media Proxy) to fetch thumbnails and videos, bypassing CORS and hotlinking restrictions. Supports both `inline` and `attachment` modes.

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
