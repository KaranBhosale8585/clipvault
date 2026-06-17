# ClipVault

ClipVault is a professional, high-performance Instagram Reel downloader designed for speed, reliability, and ease of use. It features a robust extraction engine powered by `yt-dlp`, a semantic theme system, and a comprehensive administrative dashboard.

## Features

- **Video Downloader**: Fast and reliable Instagram Reel extraction with high-quality video previews.
- **User Accounts**: Secure authentication system with OTP verification and password reset functionality.
- **Download History**: Personal dashboard to track and manage previously downloaded Reels.
- **Daily Limits**: Intelligent usage tracking for both guest and authenticated users.
- **Pro Access Requests**: Integrated application system for users seeking unrestricted download capabilities.
- **Admin Dashboard**: Centralized control center for platform analytics, user management, and system auditing.
- **Contact System**: Professional inquiry management with automated admin notifications.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Radix UI + Shadcn UI
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: JWT-based custom auth system
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Extraction Engine**: `yt-dlp` via Python bridge

## Installation

```bash
# Clone the repository
git clone https://github.com/KaranBhosale8585/clipvault.git

# Install dependencies
pnpm install

# Run the development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=
```

## Development Setup

1.  **Database**: Ensure a PostgreSQL instance is running.
2.  **Migrations**: Run `npm run db:push` to synchronize the schema.
3.  **Python**: Ensure Python 3 and `yt-dlp` are installed for the extraction service.

## Production Deployment

The project is optimized for deployment on Vercel or any containerized environment using the provided `Dockerfile` and `docker-compose.yml`.

## Database Setup

```bash
# Push schema to database
npm run db:push

# Open Drizzle Studio for manual management
npm run db:studio
```

## Admin Features

- **Stats Overview**: Real-time analytics on users, downloads, and system logs.
- **Pro Access Management**: Review, approve, or reject user applications for unlimited access.
- **Contact Inquiries**: Manage and respond to user submissions.
- **System Maintenance**: Tools for clearing cache, purging logs, and managing downloads.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components and business logic.
- `db/`: Database schema and connection configuration.
- `services/python/`: Python-based extraction service.
- `utils/`: Centralized utility functions and bridges.
- `docs/`: Technical documentation and development logs.

## Future Roadmap

- [ ] Support for Instagram Stories and Posts.
- [ ] Bulk download capabilities.
- [ ] Browser extension for one-click extraction.
- [ ] Advanced analytics for Pro users.

## Screenshots

*(Placeholder for screenshots)*

## Contributing

This project is private and is **not accepting public contributions** at this time.

## Deployment Guide

Follow these steps to deploy ClipVault to production.

### 1. Database Setup (Neon)
1.  Create a new project on [Neon](https://neon.tech/).
2.  Get your `DATABASE_URL` (connection string).
3.  Ensure `?sslmode=require` is appended to the connection string.
4.  Run migrations locally to initialize the production database:
    ```bash
    DATABASE_URL=your_neon_url pnpm run db:push
    ```

### 2. Email Setup (Resend Recommended)
1.  Create an account on [Resend](https://resend.com/).
2.  Get your API Key.
3.  Set `EMAIL_SERVER_HOST` to `smtp.resend.com` and `EMAIL_SERVER_PORT` to `465`.
4.  Set `EMAIL_SERVER_PASSWORD` to your Resend API Key.

### 3. GitHub Setup
1.  Push your code to a private GitHub repository.
2.  Ensure `.env` is NOT committed.

### 4. Render Deployment (Docker)
1.  Create a new **Web Service** on [Render](https://render.com/).
2.  Connect your GitHub repository.
3.  Select **Docker** as the Runtime.
4.  Add the following **Environment Variables** in Render:
    - `DATABASE_URL`: Your Neon connection string.
    - `JWT_SECRET`: A long random string.
    - `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`, `ADMIN_EMAIL`.
    - `NEXT_PUBLIC_APP_URL`: Your Render service URL (e.g., `https://clipvault.onrender.com`).
5.  Render will automatically build and deploy the container using the provided `Dockerfile`.

### 5. Post-Deployment
1.  Verify the health check (Render handles this via port 3000).
2.  Test the downloader with an Instagram URL.
3.  Verify that emails are being sent for contact submissions and PRO requests.

---

Copyright © 2026 Karan Bhosale. All Rights Reserved.
