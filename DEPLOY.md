# Deployment Guide

This guide covers deploying the Real Estate SaaS platform to Vercel with a managed PostgreSQL database.

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (free tier works)
- [Neon](https://neon.tech) or [Supabase](https://supabase.com) account for PostgreSQL

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel                                  │
│  ┌──────────────────┐    ┌──────────────────┐                │
│  │   Next.js App    │    │   Payload CMS    │                │
│  │   (Frontend)      │    │   (Admin/API)    │                │
│  └────────┬─────────┘    └────────┬─────────┘                │
│           │                       │                            │
│           └───────────┬───────────┘                            │
│                       │                                        │
│              ┌────────▼────────┐                              │
│              │  PostgreSQL DB  │                              │
│              │   (Neon/Supabase)                             │
│              └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

## Step 1: Set Up GitHub Repository

### Install GitHub CLI (if not already)
```bash
brew install gh
gh auth login
```

### Create GitHub Repo
```bash
cd real-estate-app
gh repo create real-estate-saas --public --push
```

## Step 2: Set Up PostgreSQL Database

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:pass@host/dbname`)

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection URI

### Option C: Vercel Postgres
1. In your Vercel dashboard, go to Storage tab
2. Create a Vercel Postgres database
3. Connection string is automatically provided

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `PAYLOAD_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_BASE_URL` - Your Vercel URL (e.g., `https://your-project.vercel.app`)
5. Deploy!

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## Step 4: Configure Environment Variables

In your Vercel project settings, add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgres://...` | Your Neon/Supabase connection string |
| `PAYLOAD_SECRET` | `openssl rand -base64 32` | Unique secret for each environment |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` | Your deployed URL |

**Important:** Enable "Encrypt" for `PAYLOAD_SECRET` and `DATABASE_URL`.

## Step 5: Initialize the Database

After first deployment, Payload will automatically create the database schema.

1. Visit `https://your-app.vercel.app/admin`
2. Create your first admin user
3. Start adding properties!

## Troubleshooting

### "Connection refused" errors
- Verify `DATABASE_URL` is correct
- Ensure your PostgreSQL provider allows external connections
- Check Neon/Supabase dashboard for connection issues

### "ENOTFOUND" DNS Resolution Errors (Neon + Vercel)

**Symptom:** Runtime logs show `getaddrinfo ENOTFOUND` for Neon hostname.

**Root Cause:** Node.js cannot resolve Neon's hostname in serverless environments.

**Solutions to Try:**
1. **Enable Connection Pooling in Neon** - Use the `-pooler` hostname
2. **Switch Database Provider** - Try Supabase instead (different DNS infrastructure)
3. **Deploy to Same Region** - Vercel us-east-1 with Neon ap-southeast-1 may have routing issues
4. **Use Neon Serverless Driver** - Requires custom integration (see Neon's docs)

**Status as of 2024-06-03:** This issue is documented in `PAYLOAD_VERCEL_TROUBLESHOOTING.md`

### "Module not found" errors
- Try a fresh deployment: Vercel dashboard > Deployments > Create New
- Clear cache: Vercel dashboard > Storage > PostgreSQL > Settings > Reset

### Payload CMS not loading
- Check browser console for specific errors
- Verify `NEXT_PUBLIC_BASE_URL` matches your Vercel URL exactly
- Ensure `PAYLOAD_SECRET` is set (not empty)

## Local Development with Production DB

To connect your local dev environment to your production database:

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your production values
# DATABASE_URL=postgres://user:pass@host/dbname
# PAYLOAD_SECRET=your-secret
# NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Start dev server
pnpm dev
```

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain (e.g., `notjustastay.com`)
3. Update `NEXT_PUBLIC_BASE_URL` to your custom domain

## What's Deployed

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | `your-app.vercel.app` | Public website |
| Admin | `your-app.vercel.app/admin` | CMS for managing content |
| API | `your-app.vercel.app/api` | REST API |

## Security Notes

- Never commit `.env` files
- Use different `PAYLOAD_SECRET` for production vs local
- Database credentials should be kept confidential
- Enable "Encrypt" for all sensitive environment variables in Vercel
