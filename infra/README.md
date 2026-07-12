# Infraestructura de producción

Terraform crea una VM **e2-micro** (capa gratuita de GCP) que corre Caddy como
reverse proxy con TLS automático y el backend en un contenedor. La base de datos
vive en Supabase y el frontend en Cloudflare Workers.

```
Navegador ──► Cloudflare Workers (Angular estático)
                    │  fetch /api/v1/...
                    ▼
        https://api-<IP>.sslip.io  ──►  Caddy (VM e2-micro, GCP)
                                          │ reverse proxy
                                          ▼
                                  backend :8080 (contenedor GHCR)
                                          │ JDBC + SSL
                                          ▼
                                  Supabase (PostgreSQL)
```

Los deploys son automáticos: cada push a `main` que toque `backend/` publica la
imagen en GHCR y reinicia el contenedor en la VM; cada push que toque `frontend/`
publica el build en Cloudflare.

## Requisitos previos (una sola vez)

1. **Cuenta de GCP** con facturación habilitada (pide tarjeta, pero la e2-micro,
   el disco de 30 GB y 1 GB de salida mensual entran en la capa *Always Free*;
   las cuentas nuevas además traen USD 300 de crédito). La IP externa puede
   facturar unos USD 3–4/mes según la política vigente de IPv4 — revisa
   *Facturación → Informes* tras el primer día.
2. **Proyecto de Supabase** (free): [supabase.com](https://supabase.com) → New
   project. Guarda la contraseña de la base de datos.
3. **Cuenta de Cloudflare** (free): [dash.cloudflare.com](https://dash.cloudflare.com).
4. Herramientas locales:

```powershell
winget install Hashicorp.Terraform
winget install Google.CloudSDK
```

## Paso 1 — Proyecto y credenciales de GCP

```powershell
gcloud auth login
gcloud projects create puerbaria --name="PuerbaRia"
gcloud config set project puerbaria
# Vincular la cuenta de facturación (o hacerlo desde la consola web)
gcloud billing accounts list
gcloud billing projects link puerbaria --billing-account=XXXXXX-XXXXXX-XXXXXX
gcloud services enable compute.googleapis.com
# Credenciales que usará Terraform
gcloud auth application-default login
```

## Paso 2 — Llave SSH para el deploy

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\puerbaria -C "deploy-puerbaria"
```

La pública (`puerbaria.pub`) va a Terraform; la privada va a los secrets de GitHub.

## Paso 3 — Crear la infraestructura

```powershell
cd infra
terraform init
terraform apply -var "project_id=puerbaria" -var "llave_ssh_publica=$(Get-Content $env:USERPROFILE\.ssh\puerbaria.pub -Raw)"
```

Al terminar imprime tres salidas: `ip_publica`, `url_api` (la URL con TLS) y
`conexion_ssh`. La VM instala Docker, crea swap y deja listos el `Caddyfile` y el
`compose.yaml` en `/opt/puerbaria/` — pero no levanta nada hasta el paso 5.

## Paso 4 — Connection string de Supabase

En el dashboard de Supabase: **Connect → Session pooler** (funciona por IPv4, que
es lo que tiene la VM; la conexión directa de Supabase es solo IPv6). El formato
JDBC queda así:

```
jdbc:postgresql://aws-1-<region>.pooler.supabase.com:5432/postgres?sslmode=require
```

y el usuario es `postgres.<ref-del-proyecto>`.

## Paso 5 — Secretos en la VM

```powershell
ssh -i $env:USERPROFILE\.ssh\puerbaria deploy@<IP_PUBLICA>
```

Ya dentro, crear `/opt/puerbaria/.env` (estos valores nunca van al repo):

```bash
cat > /opt/puerbaria/.env <<'EOF'
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.REF_DEL_PROYECTO
SPRING_DATASOURCE_PASSWORD=LA_PASSWORD_DE_SUPABASE
JWT_SECRET=UN_SECRETO_NUEVO_BASE64_DE_256_BITS
ADMIN_EMAIL=admin@puerbaria.com
ADMIN_PASSWORD=UNA_PASSWORD_FUERTE
CORS_ALLOWED_ORIGINS=https://puerbaria.TU_SUBDOMINIO.workers.dev,http://localhost:4200
EOF
chmod 600 /opt/puerbaria/.env
cd /opt/puerbaria && docker compose up -d
```

Para generar el `JWT_SECRET` en PowerShell:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

Al levantar por primera vez, Flyway crea todo el esquema en Supabase (V1–V3) y
`AdminUserInitializer` siembra el admin. Verificar:

```
https://api-<IP con guiones>.sslip.io/actuator/health   →  {"status":"UP"}
```

## Paso 6 — Secrets de GitHub Actions

En el repo: *Settings → Secrets and variables → Actions*:

| Secret | Valor |
|---|---|
| `VM_HOST` | La `ip_publica` de Terraform |
| `VM_USUARIO` | `deploy` |
| `VM_LLAVE_SSH` | Contenido de `~/.ssh/puerbaria` (la privada, completa) |
| `CLOUDFLARE_API_TOKEN` | Token con permiso *Workers Scripts: Edit* (Cloudflare → My Profile → API Tokens) |
| `CLOUDFLARE_ACCOUNT_ID` | En el dashboard de Cloudflare, barra lateral derecha |

Además, tras el primer deploy del backend, hacer público el paquete
`puerbaria-backend` (GitHub → Packages → Package settings → Change visibility)
para que la VM pueda descargarlo sin credenciales.

## Paso 7 — Apuntar el frontend a la API

En `frontend/src/environments/environment.ts`, reemplazar el host por la
`url_api` de Terraform (conservando `/api/v1`), commit y push a `main`. El
workflow `desplegar-frontend.yml` publica en Cloudflare y el sitio queda en
`https://puerbaria.<subdominio>.workers.dev`.

Si ese subdominio difiere del que pusiste en `CORS_ALLOWED_ORIGINS`, actualiza el
`.env` de la VM y corre `docker compose up -d` de nuevo.

## Operación

- **Logs del backend:** `ssh` a la VM → `docker logs -f puerbaria-backend-1`
- **Redeploy manual:** pestaña *Actions* → workflow → *Run workflow*
- **Uptime:** la VM no se duerme; para monitorearla, crear un monitor HTTP
  gratuito en [UptimeRobot](https://uptimerobot.com) hacia `/actuator/health`.
- **Destruir todo:** `terraform destroy` (la BD de Supabase no se toca).

## Notas de la capa gratuita

- Solo **una** e2-micro gratuita por cuenta y debe estar en `us-central1`,
  `us-west1` o `us-east1` (esta configuración usa `us-central1-a`).
- Disco `pd-standard` de 30 GB: dentro del límite gratuito.
- Los certificados TLS los emite Let's Encrypt a través de Caddy usando
  `sslip.io`. Si algún día la emisión falla por límites del dominio compartido
  sslip.io, la alternativa es un subdominio gratuito de DuckDNS: solo cambia
  `dominio_api` y el Caddyfile.
