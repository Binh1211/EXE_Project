# Backend VPS Deploy

Deploy `be-exe` as an isolated Docker Compose project behind the existing Traefik edge.

## Known VPS Values

- SSH target: `deploy@103.75.185.68`
- SSH port: `24700`
- API domain: `api-vistory.treklink.site`
- Traefik network: `treklink-edge`
- Traefik path: `/opt/treklink/edge`
- Traefik cert resolver: `letsencrypt`
- Existing Treklink production path to avoid: `/opt/treklink/production`
- Target backend path: `/home/deploy/exe/be`

## DNS

Create this DNS record before public HTTPS validation:

```text
api-vistory.treklink.site A 103.75.185.68
```

## VPS Env

On the VPS, create `/home/deploy/exe/be/.env.production` from `.env.production.example`.

Do not commit or print real values for:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `SMTP_PASS`

`CLIENT_URL` is `https://vistory-xi.vercel.app` for the current Vercel frontend.

## Validate Compose Locally

From repo root:

```powershell
$env:APP_ENV_FILE='.env.production.example'
docker compose --env-file deploy/be-exe/.env.production.example -f deploy/be-exe/docker-compose.yml config --quiet
Remove-Item Env:\APP_ENV_FILE
```

Use the example env for rendered config output. With a real `.env.production`, use `config --quiet` only because normal `docker compose config` can print secrets.

## Build Image

```powershell
docker build -f be-exe/Dockerfile -t exe-be-api:local be-exe
```

## Deploy Pattern

Use `git archive` from the intended main ref so dirty local files are excluded.

```powershell
$sha = git rev-parse origin/main
$short = $sha.Substring(0, 7)
$archive = Join-Path $env:TEMP "exe-main-$short.tar"
if (Test-Path $archive) { Remove-Item -LiteralPath $archive -Force }
git archive --format=tar origin/main -o $archive
scp -P 24700 -i "$HOME\.ssh\id_ed25519" $archive "deploy@103.75.185.68:/tmp/exe-main-$short.tar"
```

On VPS:

```bash
short=<short>
rm -rf /tmp/exe-main-$short
mkdir -p /tmp/exe-main-$short
tar -xf /tmp/exe-main-$short.tar -C /tmp/exe-main-$short

cd /tmp/exe-main-$short
docker build -f be-exe/Dockerfile -t exe-be-api:$short be-exe

mkdir -p /home/deploy/exe/be
cp deploy/be-exe/docker-compose.yml /home/deploy/exe/be/docker-compose.yml

cd /home/deploy/exe/be
IMAGE_TAG=$short docker compose -p exe-be-prod --env-file .env.production up -d --no-deps api
docker compose -p exe-be-prod --env-file .env.production ps api
```

## Verify

```bash
cd /home/deploy/exe/be
docker compose -p exe-be-prod --env-file .env.production logs --tail=120 api
docker compose -p exe-be-prod --env-file .env.production exec -T api \
  node -e "fetch('http://127.0.0.1:8080/health').then(r=>{console.log(r.status);process.exit(r.ok?0:1)}).catch(e=>{console.error(e);process.exit(1)})"
curl -i --max-time 30 https://api-vistory.treklink.site/health
```

If internal health passes but public HTTPS fails, inspect Traefik logs and Docker network attachment first. Restarting Traefik can briefly affect every service behind the shared edge, so use it only as an explicitly approved last resort, ideally during a maintenance window:

```bash
cd /opt/treklink/edge
docker compose restart traefik
```

## Rollback

Rollback by using the previous image tag and recreating only the API service:

```bash
cd /home/deploy/exe/be
IMAGE_TAG=<previous-tag> docker compose -p exe-be-prod --env-file .env.production up -d --no-deps api
```

Do not run `docker compose down` or Docker prune commands for this project unless downtime and cleanup have been explicitly approved.
