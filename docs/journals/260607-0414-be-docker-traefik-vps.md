# BE Docker Traefik VPS Implementation

## Context

Implemented local backend deployment artifacts for `be-exe` based on `plans/260607-0311-be-docker-traefik-vps/`.

## What Changed

- Added `GET /health` for backend health checks.
- Added production env guards for JWT secrets and fixed production `PORT=8080`.
- Sanitized `be-exe/.env.example` so it no longer contains the old MongoDB Atlas URI.
- Added Docker build artifacts under `be-exe/`.
- Added isolated Traefik Compose deployment assets under `deploy/be-exe/`.
- Added ignore rules so real env files such as `.env.production` are not commit-visible.
- Added backend deploy contract summary under `docs/codebase-summary.md`.

## Validation

- `npm run build` passed in `be-exe`.
- `/health` smoke test returned `200`.
- Production placeholder JWT secrets are rejected.
- Production `PORT` values other than `8080` are rejected.
- `docker compose config --quiet` passed with `deploy/be-exe/.env.production.example`.

## Decisions

- Keep this backend isolated from the existing Treklink stack.
- Use `deploy@103.75.185.68:24700`.
- Use existing Traefik network `treklink-edge`.
- Use deploy path `/home/deploy/exe/be`.
- Use Vercel frontend origin `CLIENT_URL=https://vistory-xi.vercel.app` in production.

## Open Items

- Docker image build is not verified locally because Docker Desktop engine was unavailable.
- DNS for `api-vistory.treklink.site` must point to `103.75.185.68`.
- Rotate the MongoDB Atlas credential if the old `.env.example` URI was real.
- Actual VPS deploy later completed with image `exe-be-api:local-863f4d9-2606070417`.
