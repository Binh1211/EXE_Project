---
phase: 5
title: "VPS deploy and rollback runbook"
status: completed
priority: P1
effort: "2-4h"
dependencies: [1, 2, 3, 4]
---

# Phase 5: VPS Deploy and Rollback Runbook

## Overview
Deploy the backend to the VPS using the safe pattern from `ck:vps-main-deploy`: archive `origin/main`, build or pull images, recreate only the target API service, verify internal and public health, and keep rollback ready.

## Requirements
- Functional: deploy BE container behind Traefik and verify API, auth, uploads, and Socket.IO.
- Non-functional: do not deploy dirty local files, do not recreate unrelated services, do not print secrets.

## Architecture
Use manual deployment until CI/CD exists:
1. local machine archives `origin/main`
2. archive copied to VPS temp dir
3. Docker image built on VPS from clean source
4. Compose runtime files live in `/home/deploy/exe/be`
5. Traefik routes public HTTPS to API container over external network

## Related Code Files
- Use: `be-exe/Dockerfile`
- Use: `deploy/be-exe/docker-compose.yml`
- Use: `deploy/be-exe/.env.production.example`
- Create on VPS only: `/home/deploy/exe/be/.env.production`

## Implementation Steps
1. Confirm main ref and local state:
   ```bash
   git fetch origin main
   git rev-parse origin/main
   git show --stat --oneline -1 origin/main
   git status --short --branch
   ```
2. Preflight VPS:
   ```bash
   ssh -p 24700 -i "$SSH_KEY" deploy@103.75.185.68 \
     'echo ssh-ok; uptime; free -h; df -h /; docker ps --format "{{.Names}} {{.Image}} {{.Status}}"'
   ```
3. Archive and upload only `origin/main`:
   ```powershell
   $sha = git rev-parse origin/main
   $short = $sha.Substring(0, 7)
   $archive = Join-Path $env:TEMP "exe-main-$short.tar"
   if (Test-Path $archive) { Remove-Item -LiteralPath $archive -Force }
   git archive --format=tar origin/main -o $archive
   scp -P 24700 -i "$HOME\.ssh\id_ed25519" $archive "deploy@103.75.185.68:/tmp/exe-main-$short.tar"
   ```
4. Extract in a temp directory on VPS:
   ```bash
   rm -rf /tmp/exe-main-<short>
   mkdir -p /tmp/exe-main-<short>
   tar -xf /tmp/exe-main-<short>.tar -C /tmp/exe-main-<short>
   ```
5. Build image on VPS, one service only:
   ```bash
   cd /tmp/exe-main-<short>
   docker build -f be-exe/Dockerfile -t exe-be-api:<short> be-exe
   ```
6. Prepare deploy path without touching old paths:
   ```bash
   mkdir -p /home/deploy/exe/be
   cp deploy/be-exe/docker-compose.yml /home/deploy/exe/be/docker-compose.yml
   ```
7. Create or patch `/home/deploy/exe/be/.env.production` using targeted keys only. Never print the full file.
8. Start or update only this Compose project:
   ```bash
   cd /home/deploy/exe/be
   IMAGE_TAG=<short> docker compose -p exe-be-prod --env-file .env.production up -d --no-deps api
   docker compose -p exe-be-prod --env-file .env.production ps api
   ```
9. Verify internally:
   ```bash
   docker compose -p exe-be-prod --env-file .env.production logs --tail=120 api
   docker compose -p exe-be-prod --env-file .env.production exec -T api \
     node -e "fetch('http://127.0.0.1:8080/health').then(r=>{console.log(r.status);process.exit(r.ok?0:1)}).catch(e=>{console.error(e);process.exit(1)})"
   ```
10. Verify through Traefik:
   ```bash
   curl -i --max-time 30 https://api-vistory.treklink.site/health
   ```
11. Verify Socket.IO and CORS from local frontend if needed:
   - Backend env for production frontend: `CLIENT_URL=https://vistory-xi.vercel.app`.
   - Local frontend should call `VITE_API_BASE_URL=https://api-vistory.treklink.site`.
12. If internal health is OK but public HTTPS fails, inspect Traefik logs first. Restart only Traefik if routing is stale:
   ```bash
   cd /opt/treklink/edge
   docker compose restart traefik
   sleep 8
   docker compose ps traefik
   ```
13. Cleanup temp archive only:
   ```bash
   rm -rf /tmp/exe-main-<short> /tmp/exe-main-<short>.tar
   docker system df
   ```

## Rollback Steps
1. Before deploy, record current image:
   ```bash
   docker compose -p exe-be-prod --env-file .env.production images
   ```
2. Keep previous `.env.production` backup:
   ```bash
   cp /home/deploy/exe/be/.env.production /home/deploy/exe/be/.env.production.bak-$(date +%Y%m%d-%H%M%S)
   ```
3. Roll back by setting `IMAGE_TAG` to the previous tag and recreating only API:
   ```bash
   cd /home/deploy/exe/be
   IMAGE_TAG=<previous-tag> docker compose -p exe-be-prod --env-file .env.production up -d --no-deps api
   ```
4. Do not run `docker compose down` unless the user explicitly wants downtime and has confirmed the project name.

## Success Criteria
- [x] Deployed image tag `exe-be-api:local-863f4d9-2606070417` matches local working-tree deploy tag.
- [x] API service is recreated without touching unrelated services.
- [x] Internal `/health` passes.
- [x] Public HTTPS `/health` passes at `https://api-vistory.treklink.site/health` when resolving the host to `103.75.185.68`.
- [x] Logs show no missing env, Mongo, CORS, or OAuth errors.
- [x] Rollback image/env are documented.
- [x] Temp archives are removed.

## Risk Assessment
- Risk: VPS has low memory and build hangs. Mitigation: build only the API image, avoid parallel builds, or switch to CI/prebuilt image.
- Risk: wrong env causes auth/OAuth failure. Mitigation: validate `CLIENT_URL`, `GOOGLE_CALLBACK_URL`, and FE `VITE_API_BASE_URL`.
- Risk: Traefik stale route after container recreate. Mitigation: restart only Traefik after internal health proves API is fine.
- Risk: accidental old stack impact. Mitigation: every command uses `/home/deploy/exe/be`, `-p exe-be-prod`, and service name `api`.
