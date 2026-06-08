---
phase: 3
title: "Docker artifact"
status: completed
priority: P1
effort: "2-3h"
dependencies: [2]
---

# Phase 3: Docker Artifact

## Overview
Add a production Docker image for `be-exe` that builds TypeScript, runs as a non-root user, and keeps uploads writable.

## Requirements
- Functional: build image from `be-exe`, run `node dist/index.js`, expose port `8080`.
- Non-functional: small production image, no dev dependencies at runtime, no secrets baked into image, non-root runtime.

## Architecture
Use a multi-stage Node image:
- deps/build stage: install all dependencies and run `npm run build`.
- runtime stage: copy `dist`, `package*.json`, and production `node_modules`.
- runtime user: `node`.
- uploads directory: `/app/uploads`, owned by runtime user and mounted as a volume in Compose.

## Related Code Files
- Create: `be-exe/Dockerfile`
- Create: `be-exe/.dockerignore`
- Validate: `be-exe/package-lock.json`

## Implementation Steps
1. Add `.dockerignore` to exclude:
   ```text
   node_modules
   dist
   .env
   npm-debug.log
   uploads
   ```
2. Add `be-exe/Dockerfile` based on Node 22 Alpine or Node 20 Alpine. Node 22 matches current `@types/node` and local toolchain.
3. Use `npm ci` from `package-lock.json`.
4. Run `npm run build` in the build stage.
5. Prune dev dependencies or install production dependencies in a dedicated runtime deps stage.
6. Create `/app/uploads` and `chown` it to the `node` user.
7. Set:
   ```dockerfile
   ENV NODE_ENV=production
   ENV PORT=8080
   EXPOSE 8080
   CMD ["node", "dist/index.js"]
   ```
8. Build locally:
   ```bash
   docker build -f be-exe/Dockerfile -t exe-be-api:local be-exe
   ```
9. Run locally with non-secret test env where possible:
   ```bash
   docker run --rm --env-file be-exe/.env -p 8080:8080 exe-be-api:local
   ```

## Success Criteria
- [x] Docker image builds cleanly on VPS as `exe-be-api:local-863f4d9-2606070417`.
- [x] Runtime image does not contain `.env`.
- [x] Container runs as non-root.
- [x] `/app/uploads` is writable.
- [x] Container listens on port `8080`.

## Risk Assessment
- Risk: native dependency build issues on Alpine. Mitigation: current dependencies are mostly pure JS; if build fails, switch runtime to `node:22-bookworm-slim`.
- Risk: upload path mismatch after compile. Mitigation: current `dist/app.js` resolves `../uploads`, which maps to `/app/uploads`.
- Risk: dev dependencies needed at runtime by mistake. Mitigation: run container smoke test after `npm prune --omit=dev`.
