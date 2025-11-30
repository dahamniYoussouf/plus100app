# Cloudflare Pages Deployment Fix

## Problem
The deployment is failing with: "Missing entry-point to Worker script or to assets directory"

## Solution

### Option 1: Remove Custom Deploy Command (Recommended)
1. Go to your Cloudflare Pages dashboard
2. Navigate to your project: **plus100app**
3. Go to **Settings** → **Builds & deployments**
4. Find the **Deploy command** field
5. **Remove/clear the custom deploy command** (leave it empty)
6. Make sure **Framework preset** is set to **Next.js**
7. **Build command** should be: `npm run build`
8. **Build output directory** should be: `.next` (or leave empty for auto-detection)
9. Save and redeploy

### Option 2: If You Need Custom Deploy Command
If you must keep a custom deploy command, update your Cloudflare Pages settings:
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Deploy command**: Leave empty (Cloudflare will handle it automatically)

## Why This Happens
Cloudflare Pages is trying to use `npx wrangler deploy` which is for Cloudflare Workers, not Next.js applications. Next.js apps on Cloudflare Pages should use the automatic deployment system, not Wrangler directly.

## Alternative: Static Export (If Needed)
If you need a static export, update `next.config.js` to include:
```js
output: 'export'
```
Then set **Build output directory** to `out` in Cloudflare Pages settings.

