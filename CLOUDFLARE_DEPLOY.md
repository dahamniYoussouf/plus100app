# Cloudflare Pages Deployment Fix

## Problem
The deployment is failing because `npx wrangler deploy` is for Cloudflare Workers, not Pages.

## Solution

### Option 1: Use Correct Pages Command (If Deploy Command Required)
If you must use a custom deploy command, use the **Pages** command with project name:

**Deploy command**: `npx wrangler pages deploy .next --project-name=plus100app`

**OR** (if project name is set in wrangler.toml):
**Deploy command**: `npx wrangler pages deploy .next`

**OR** (Recommended) Remove the deploy command entirely:

### Option 2: Remove Custom Deploy Command (Recommended)
1. Go to your Cloudflare Pages dashboard
2. Navigate to your project: **plus100app**
3. Go to **Settings** → **Builds & deployments**
4. Find the **Deploy command** field
5. **Remove/clear the custom deploy command** (leave it empty)
6. Make sure **Framework preset** is set to **Next.js**
7. **Build command** should be: `npm run build`
8. **Build output directory** should be: `.next` (or leave empty for auto-detection)
9. Save and redeploy

## Why This Happens
- `npx wrangler deploy` is for **Cloudflare Workers**
- `npx wrangler pages deploy` is for **Cloudflare Pages**
- For Next.js on Cloudflare Pages, you typically don't need a deploy command at all - Cloudflare handles it automatically

## Correct Settings
- **Build command**: `npm run build`
- **Build output directory**: `.next` (or leave empty)
- **Deploy command**: (empty) OR `npx wrangler pages deploy .next` if required

