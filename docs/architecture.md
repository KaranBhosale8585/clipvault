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
- `users`: Stores user profile and authentication status.
- `otp`: Stores one-time passwords for verification and password reset.
- `otp_requests`: Tracks OTP requests for rate limiting/logging.
- `downloads`: Tracks user download history including Reel metadata and status.

## API Flow
1. Client makes a request to `/api/...`.
2. Middleware/Utils handle authentication (JWT) and rate limiting.
3. Route handlers interact with the database via Drizzle.
4. Responses are returned in a consistent JSON format.

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
