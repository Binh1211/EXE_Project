---
title: "BE Docker + Traefik VPS Deploy"
status: in-progress
created: 2026-06-07
scope: project
target: be-exe
blockedBy: []
blocks: []
---

# BE Docker + Traefik VPS Deploy

## Overview
Create a safe implementation path to containerize `be-exe` and deploy it behind an existing Traefik edge on a VPS without breaking previous Docker projects.

This is a planning artifact only. No Docker, Traefik, or backend source files are changed by this plan.

Target public API domain: `api-vistory.treklink.site`.

Known VPS target:
- SSH target: `deploy@103.75.185.68`
- SSH port: `24700`
- SSH key: `~/.ssh/id_ed25519` works for user `deploy`.
- Deploy scope: backend only; frontend is not deployed in this plan.
- Frontend/CORS value: `CLIENT_URL=https://vistory-xi.vercel.app`.
- SSH preflight status on 2026-06-07: `deploy@103.75.185.68:24700` connects successfully.
- Traefik container: `treklink-edge-traefik-1`.
- Traefik Docker network: `treklink-edge`.
- Traefik compose path: `/opt/treklink/edge`.
- Traefik compose file: `/opt/treklink/edge/docker-compose.yml`.
- Traefik certificate resolver: `letsencrypt`.
- Existing production app path: `/opt/treklink/production`; do not deploy this backend there.
- VPS resources: 1.9 GiB RAM, no swap, 26 GiB free on `/`; build backend image only, no full-stack parallel build.
- DNS status on 2026-06-07: Google DNS resolves `api-vistory.treklink.site` to `103.75.185.68`; local router DNS may still cache an old NXDOMAIN response.
- Deployed image tag on 2026-06-07: `exe-be-api:local-863f4d9-2606070417`.
- Runtime path used: `/home/deploy/exe/be` because `deploy` cannot write `/opt` and has no passwordless sudo.

## Current Codebase Facts
- Backend path: `be-exe`.
- Runtime: Express 4 + TypeScript ESM + Socket.IO.
- Build/start: `npm run build` compiles to `dist`; `npm start` runs `node dist/index.js`.
- Default port: `8080` from `PORT`.
- Database: MongoDB Atlas via `MONGODB_URI`; no local Mongo container needed.
- CORS and Socket.IO origin: `CLIENT_URL`.
- Google OAuth callback: `GOOGLE_CALLBACK_URL`.
- Runtime upload path: `/uploads` maps to `be-exe/uploads` locally and should become a Docker volume.
- No Dockerfile, Compose, or Traefik config was found in the repo during scan.
- `npm run build` in `be-exe` passed on 2026-06-07.
- `be-exe/.env.example` appears to contain a real MongoDB URI. Treat it as leaked secret material: rotate the Atlas credential and replace example values with placeholders before any deploy commit.

## Non-Goals
- Do not provision a new VPS from scratch.
- Do not migrate DNS unless the user approves exact domains.
- Do not restore, move, or containerize MongoDB; keep MongoDB Atlas.
- Do not modify existing Docker Compose stacks or Traefik edge config unless a later preflight proves the exact target and the user approves.
- Do not run destructive Docker cleanup such as `docker system prune -a --volumes`.

## Safety Invariants
- Use a unique Compose project name, recommended `exe-be-prod`.
- Use a separate deploy path, `/home/deploy/exe/be`.
- Use unique Traefik router/service names, recommended `exe-be-api`.
- Do not publish host ports for the API unless needed for temporary localhost-only debugging. Let Traefik reach port `8080` over its Docker network.
- Join only the confirmed existing Traefik external network. Never create a new network with the same name as the existing edge network.
- Keep uploads in a named volume dedicated to this service, recommended `exe-be-uploads`.
- Keep production secrets only on the VPS `.env.production`; never commit them.
- Deploy from `origin/main` using `git archive` when using the VPS deploy runbook, so dirty local files are excluded.
- For backend-only updates, recreate only the API service. Do not run commands that recreate old frontend, database, or edge services.

## Proposed Target Architecture

```text
Browser
  |
  | HTTPS https://api-vistory.treklink.site
  v
Existing VPS Traefik container
  |
  | Docker network: treklink-edge
  v
exe-be-prod-api-1
  | port 8080, Express + Socket.IO
  | volume: exe-be-uploads:/app/uploads
  v
MongoDB Atlas
```

## Implementation Phases

| Phase | Status | Title | Output |
| --- | --- | --- | --- |
| 1 | in-progress | VPS and repo safety inventory | Confirm deploy contract without touching old stacks |
| 2 | completed | Backend production readiness | Add safe health/env behavior |
| 3 | completed | Docker artifact | Add production Dockerfile and ignore rules |
| 4 | completed | Traefik-safe Compose | Add isolated Compose config for API |
| 5 | completed | VPS deploy and rollback runbook | Deploy, verify, and rollback without breaking old projects |

## Dependencies
- VPS SSH target: `deploy@103.75.185.68`.
- VPS SSH port: `24700`.
- SSH key: `~/.ssh/id_ed25519`.
- Traefik edge path: `/opt/treklink/edge`.
- Traefik Docker network: `treklink-edge`.
- API domain: `api-vistory.treklink.site`.
- Traefik certificate resolver: `letsencrypt`.
- DNS A record for `api-vistory.treklink.site` pointing to `103.75.185.68`; verified via Google DNS.
- Frontend is hosted on Vercel. Use `CLIENT_URL=https://vistory-xi.vercel.app`.
- MongoDB Atlas credential rotated if the current example URI is real.
- Production values for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `GOOGLE_CALLBACK_URL`, and optional SMTP/Google OAuth values.

## Success Criteria
- Backend image builds from a clean checkout.
- Container starts as non-root and listens on `8080`.
- `/health` responds internally and through public HTTPS.
- Socket.IO connects through Traefik.
- Uploaded avatars persist after container recreate.
- Existing Docker stacks, volumes, networks, and Traefik routes remain untouched.
- Rollback can restore the previous image/env without `compose down` or destructive prune.

## Handoff Command
After this plan is reviewed, implementation can start with:

```powershell
/ck:cook W:\repo\EmBinh\EXE_Project\plans\260607-0311-be-docker-traefik-vps\plan.md
```

## Unresolved Questions
- Is the MongoDB credential currently present in `.env.example` real and already exposed?
- If the old MongoDB URI was real, has the Atlas user/password been rotated?
