# Codebase Summary

## Backend

- `be-exe` is a Node.js/TypeScript Express API.
- Runtime configuration is centralized in `be-exe/src/config/env.ts`.
- The backend exposes a `GET /health` endpoint in `be-exe/src/app.ts`.
- Production runtime expects `PORT=8080` and enforces it in config.
- CORS is driven by `CLIENT_URL`; production currently uses `https://vistory-xi.vercel.app`.
- Authentication and messaging-related environment variables include JWT, Google OAuth, and SMTP settings.
- The backend serves uploaded assets from `/uploads`.

## Backend Deploy Contract

- `deploy/be-exe/docker-compose.yml` defines a single API service behind an external Traefik network.
- The compose file uses Traefik labels for HTTPS routing and a named volume for uploads.
- `deploy/be-exe/.env.production.example` provides the production environment template.
- `deploy/be-exe/README.md` documents the VPS deploy, verify, and rollback workflow.
- The target API domain is `api-vistory.treklink.site`.
- The existing Traefik network is `treklink-edge`.
- The existing Traefik edge path is `/opt/treklink/edge`.
- The deploy path for this backend is `/home/deploy/exe/be`.
- The existing Treklink production path `/opt/treklink/production` must not be reused for this backend.

## Related Planning Docs

- `plans/260607-0311-be-docker-traefik-vps/` contains the implementation plan and deploy runbook for the Docker + Traefik VPS work.

## Open Deployment Items

- Create and verify DNS for `api-vistory.treklink.site -> 103.75.185.68`.
- Rotate the MongoDB Atlas credential if the old `.env.example` value was real.
- Verify Docker image build once Docker daemon access is available.
