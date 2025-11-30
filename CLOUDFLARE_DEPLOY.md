# Cloudflare Pages Deployment Fix

## Problem
The deployment is failing with authentication errors when using `npx wrangler pages deploy`.

## Solution

### Option 1: Fix API Token Permissions (If Deploy Command Required)
If Cloudflare Pages requires a deploy command, you need to ensure your API token has the correct permissions:

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Find or create a token with these permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Zone** → **Zone Settings** → **Read** (if needed)
3. Update the `CLOUDFLARE_API_TOKEN` environment variable in Cloudflare Pages settings:
   - Go to **Settings** → **Environment variables**
   - Add/update `CLOUDFLARE_API_TOKEN` with your token
4. Use this deploy command:
   ```
   npx wrangler pages deploy .next --project-name=plus100app
   ```

### Option 2: Use No-Op Command (If Allowed)
If Cloudflare Pages allows it, use a simple command that does nothing:
```
echo "Deployment handled by Cloudflare Pages"
```

### Option 3: Remove Deploy Command (Recommended if Possible)
If possible, remove the deploy command entirely and let Cloudflare Pages handle deployment automatically.

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

