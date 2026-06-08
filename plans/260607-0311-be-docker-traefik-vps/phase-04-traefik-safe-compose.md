---
phase: 4
title: "Traefik-safe Compose"
status: completed
priority: P1
effort: "2-4h"
dependencies: [1, 3]
---

# Phase 4: Traefik-Safe Compose

## Overview
Create Compose config that exposes the backend only through the existing Traefik network and does not collide with previous Docker projects.

## Requirements
- Functional: start API container, attach to existing Traefik network, define HTTPS router, keep uploads volume.
- Non-functional: no host port collisions, no old-stack recreation, no Traefik container replacement.

## Architecture
Recommended repo path for implementation:

```text
deploy/be-exe/
  docker-compose.yml
  .env.production.example
  README.md
```

Recommended VPS runtime path:

```text
/home/deploy/exe/be/
  docker-compose.yml
  .env.production
```

Compose should use:
- `COMPOSE_PROJECT_NAME=exe-be-prod`
- service name `api`
- image tag from `IMAGE_TAG`
- API host `api-vistory.treklink.site`
- external network name `treklink-edge`
- volume name `exe-be-uploads`
- Traefik router/service names starting with `exe-be-api`

## Related Code Files
- Create later: `deploy/be-exe/docker-compose.yml`
- Create later: `deploy/be-exe/.env.production.example`
- Create later: `deploy/be-exe/README.md`

## Implementation Steps
1. Create Compose config with no `ports:` by default:
   ```yaml
   services:
     api:
       image: ${API_IMAGE:-exe-be-api}:${IMAGE_TAG:-latest}
       restart: unless-stopped
       env_file:
         - .env.production
       volumes:
         - uploads:/app/uploads
       networks:
         - traefik
       labels:
         - traefik.enable=true
         - traefik.docker.network=${TRAEFIK_NETWORK}
         - traefik.http.routers.exe-be-api.rule=Host(`${API_HOST}`)
         - traefik.http.routers.exe-be-api.entrypoints=websecure
         - traefik.http.routers.exe-be-api.tls=true
         - traefik.http.routers.exe-be-api.tls.certresolver=${TRAEFIK_CERT_RESOLVER}
         - traefik.http.services.exe-be-api.loadbalancer.server.port=8080
   networks:
     traefik:
       external: true
       name: ${TRAEFIK_NETWORK}
   volumes:
     uploads:
       name: ${UPLOADS_VOLUME_NAME:-exe-be-uploads}
   ```
2. Add a Compose healthcheck using Node fetch or a small shell command against `http://127.0.0.1:8080/health`.
3. Add `.env.production.example` with placeholders only:
   ```text
   COMPOSE_PROJECT_NAME=exe-be-prod
   API_HOST=api-vistory.treklink.site
   TRAEFIK_NETWORK=treklink-edge
   TRAEFIK_CERT_RESOLVER=letsencrypt
   API_IMAGE=exe-be-api
   IMAGE_TAG=latest
   PORT=8080
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   CLIENT_URL=https://vistory-xi.vercel.app
   GOOGLE_CALLBACK_URL=https://api-vistory.treklink.site/api/auth/google/callback
   JWT_ACCESS_SECRET=replace-me
   JWT_REFRESH_SECRET=replace-me
   ```
4. Validate Compose without starting:
   ```bash
   docker compose --env-file .env.production config
   ```
5. On VPS, ensure the external Traefik network exists before `up`:
   ```bash
   docker network inspect "$TRAEFIK_NETWORK"
   ```

## Success Criteria
- [x] Compose config renders with `docker compose config --quiet`.
- [x] No host ports are published by default.
- [x] Traefik labels use unique router/service names.
- [x] Traefik router host is `api-vistory.treklink.site`.
- [x] External network references `treklink-edge`.
- [x] Upload volume name is unique and dedicated to this API.

## Risk Assessment
- Risk: Compose interpolation in Traefik labels can fail if `API_HOST` is empty. Mitigation: validate `docker compose config` and fail before deploy.
- Risk: old stack uses same router name. Mitigation: prefix every router/service with `exe-be`.
- Risk: public HTTPS hangs after API recreate. Mitigation: if internal health is OK, restart only the existing Traefik container after confirming edge path.
