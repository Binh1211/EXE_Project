---
phase: 1
title: "VPS and repo safety inventory"
status: in-progress
priority: P1
effort: "1-2h"
dependencies: []
---

# Phase 1: VPS and Repo Safety Inventory

## Overview
Establish the production contract before writing Docker or Traefik config. This phase prevents accidental changes to existing Docker projects.

## Requirements
- Functional: identify VPS target, existing Traefik container, Traefik Docker network, existing compose projects, target API domain, and deploy path.
- Non-functional: do not stop, remove, recreate, prune, or rename existing containers, networks, or volumes.

## Architecture
The backend will be a separate Compose project joined to the existing Traefik external network. Traefik remains owned by the existing edge stack.

Known target:
- SSH target: `deploy@103.75.185.68`
- SSH port: `24700`
- SSH key: `~/.ssh/id_ed25519`
- API domain: `api-vistory.treklink.site`
- Frontend: Vercel app `https://vistory-xi.vercel.app`; use this as production `CLIENT_URL`.
- SSH status: `ssh -p 24700 -i ~/.ssh/id_ed25519 deploy@103.75.185.68` connects successfully.
- Traefik container: `treklink-edge-traefik-1`.
- Traefik network: `treklink-edge`.
- Traefik path: `/opt/treklink/edge`.
- Traefik compose file: `/opt/treklink/edge/docker-compose.yml`.
- Certificate resolver: `letsencrypt`.
- Existing app path to avoid: `/opt/treklink/production`.
- DNS status: Google DNS resolves `api-vistory.treklink.site` to `103.75.185.68`; local router DNS may still cache an old NXDOMAIN response.
- Runtime path used: `/home/deploy/exe/be` because `deploy` cannot write `/opt` and has no passwordless sudo.

## Related Code Files
- Read: `be-exe/package.json`
- Read: `be-exe/src/index.ts`
- Read: `be-exe/src/app.ts`
- Read: `be-exe/src/config/env.ts`
- Read: `be-exe/.env.example`
- Create later: `plans/260607-0311-be-docker-traefik-vps/reports/vps-preflight.md`

## Implementation Steps
1. Use the confirmed SSH target for all VPS commands:
   ```bash
   ssh -p 24700 -i ~/.ssh/id_ed25519 deploy@103.75.185.68 'echo ssh-ok'
   ```
2. Confirm deploy path and optional frontend domain.
   - API domain is fixed for this plan: `api-vistory.treklink.site`.
   - SSH target is fixed: `deploy@103.75.185.68`.
   - SSH port is fixed: `24700`.
   - Frontend is not deployed; default `CLIENT_URL` should be `http://localhost:5173` until a frontend domain exists.
3. On VPS, list current containers without changing state:
   ```bash
   docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
   docker network ls
   docker volume ls
   ```
4. Identify Traefik container and network:
   ```bash
   docker inspect <traefik-container> --format '{{json .NetworkSettings.Networks}}'
   docker inspect <traefik-container> --format '{{range .Config.Labels}}{{println .}}{{end}}'
   ```
5. Identify Traefik compose path from Compose labels, if present:
   ```bash
   docker inspect <traefik-container> \
     --format '{{ index .Config.Labels "com.docker.compose.project.working_dir" }}'
   docker inspect <traefik-container> \
     --format '{{ index .Config.Labels "com.docker.compose.project.config_files" }}'
   ```
6. Record existing Compose project names and avoid reusing them.
7. Check disk/RAM before building images on VPS:
   ```bash
   free -h
   df -h /
   docker system df
   pgrep -af "docker build|buildx" || true
   ```
8. Check DNS before public HTTPS validation:
   ```bash
   nslookup api-vistory.treklink.site
   ```
   It should resolve to `103.75.185.68`.
9. Verify `be-exe/.env.example` secret status. If the MongoDB URI is real, rotate that Atlas user password before deploy.
10. Confirm MongoDB Atlas network access for the VPS IP. Prefer allowlisting the VPS IP over `0.0.0.0/0` for production.

## Success Criteria
- [x] Existing Docker projects, networks, and volumes are documented.
- [x] Traefik network `treklink-edge` and cert resolver `letsencrypt` are used.
- [x] API domain `api-vistory.treklink.site` is confirmed in DNS via Google DNS.
- [x] Production frontend origin is reflected in env: `CLIENT_URL=https://vistory-xi.vercel.app`.
- [x] Compose project name `exe-be-prod` does not conflict.
- [x] Deploy path `/home/deploy/exe/be` is separate from previous projects.
- [ ] Secret rotation decision for `.env.example` is made.

## Risk Assessment
- Risk: wrong Traefik network breaks routing. Mitigation: inspect existing Traefik container before config.
- Risk: compose project name collision recreates old services. Mitigation: use unique `-p exe-be-prod` and unique labels.
- Risk: leaked MongoDB URI remains valid. Mitigation: rotate credential and replace examples with placeholders.
