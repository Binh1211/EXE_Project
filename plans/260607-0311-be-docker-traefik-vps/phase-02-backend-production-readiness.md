---
phase: 2
title: "Backend production readiness"
status: completed
priority: P1
effort: "2-3h"
dependencies: [1]
---

# Phase 2: Backend Production Readiness

## Overview
Make the backend observable and production-safe before containerization. Keep changes minimal and aligned with current Express patterns.

## Requirements
- Functional: expose a health endpoint, keep CORS/OAuth values configurable, and preserve Socket.IO behavior.
- Non-functional: fail fast on missing production secrets; avoid leaking secrets in logs or examples.

## Architecture
Add a lightweight health route in the Express app before `/api` routes. Use current env module as the single source of runtime config.

## Related Code Files
- Modify: `be-exe/src/app.ts`
- Modify: `be-exe/src/config/env.ts`
- Modify: `be-exe/.env.example`
- Validate: `be-exe/package.json`

## Implementation Steps
1. Add `GET /health` in `createApp()` before API routes. Return JSON with status, service, and uptime only:
   ```ts
   app.get("/health", (_req, res) => {
     res.json({ status: "ok", service: "be-exe", uptime: process.uptime() });
   });
   ```
2. Make production JWT secrets required. Current fallback secrets are acceptable for local dev only, not `NODE_ENV=production`.
3. Keep `PORT`, `CLIENT_URL`, and `GOOGLE_CALLBACK_URL` environment-driven.
4. Replace real-looking values in `.env.example` with placeholders. Do not include any production secret.
5. Add production notes to `.env.example` for:
   - `NODE_ENV=production`
   - `PORT=8080`
   - `CLIENT_URL=https://vistory-xi.vercel.app`
   - `GOOGLE_CALLBACK_URL=https://api-vistory.treklink.site/api/auth/google/callback`
6. Run validation:
   ```bash
   cd be-exe
   npm run build
   ```
7. Optionally smoke-test locally with a temporary safe `.env`:
   ```bash
   npm start
   curl http://127.0.0.1:8080/health
   ```

## Success Criteria
- [x] `npm run build` passes.
- [x] `/health` works without database writes.
- [x] Production cannot start with default JWT secrets.
- [x] `.env.example` contains no real credentials.
- [x] CORS uses `CLIENT_URL=https://vistory-xi.vercel.app` for the Vercel frontend.
- [x] OAuth callback uses `https://api-vistory.treklink.site/api/auth/google/callback`.

## Risk Assessment
- Risk: health endpoint waits on MongoDB because server connects DB before listen. Mitigation: accept this as startup health for now; do not add complex readiness split unless needed.
- Risk: tightening env validation breaks dev. Mitigation: require stricter secrets only when `NODE_ENV=production`.
- Risk: FE cannot call API due CORS mismatch. Mitigation: confirm production `CLIENT_URL` and FE `VITE_API_BASE_URL`.
