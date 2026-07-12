# Puerba Ría

[![CI](https://github.com/alonso3107/PuerbaRia/actions/workflows/ci.yml/badge.svg)](https://github.com/alonso3107/PuerbaRia/actions/workflows/ci.yml)

![Puerba Ría — hotel frente al Pacífico](frontend/src/assets/hotel-heroreal.jpg)

Plataforma web del hotel Puerba Ría: catálogo de habitaciones y spa administrado desde base de datos, reservas con comprobante de pago (voucher) y paneles diferenciados para huéspedes y administración.

Monorepo con dos aplicaciones: una API REST en Spring Boot y una SPA con SSR en Angular.

## Funcionalidades

- Catálogo público de habitaciones, tratamientos y paquetes de spa servido desde PostgreSQL.
- Reserva mediante voucher: el huésped sube su comprobante (Yape, Plin o transferencia) y administración lo valida o rechaza.
- Panel del cliente con el estado de sus reservas y resumen de pagos confirmados.
- Dashboard administrativo: revisión de vouchers, usuarios registrados y gestión completa del catálogo (crear, editar, eliminar).
- Autenticación con JWT y roles (`USER` / `ADMIN`); las mutaciones del catálogo exigen rol de administrador.

## Stack

| Capa | Tecnologías |
|---|---|
| Backend | Java 17, Spring Boot, Spring Security (JWT), JPA/Hibernate, Flyway, PostgreSQL |
| Frontend | Angular 21 (signals + SSR), PrimeNG, Tailwind CSS 4, Mapbox |
| Infraestructura | Podman Compose (BD local), GitHub Actions (CI), Render + Netlify (deploy) |

## Estructura

```
PuerbaRia/
├── backend/    # API REST — Java 17, Spring Boot, PostgreSQL, JWT
├── frontend/   # SPA/SSR — Angular 21, PrimeNG, Tailwind CSS
├── bruno/      # Colección de Bruno para probar la API
├── infra/      # Infraestructura de producción — Terraform (GCP)
└── .zed/       # Tareas y configuración para el editor Zed
```

## Puesta en marcha

Requisitos: JDK 17, Node.js 20+ con [pnpm](https://pnpm.io/) y [Podman](https://podman.io/) (o Docker) para la base de datos.

### 1. Base de datos

```bash
podman compose up -d
```

Levanta PostgreSQL 18 en `localhost:5432` con la base `puerbaria_db`. Para detenerla: `podman compose down` (los datos persisten en el volumen `db_data`).

### 2. Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

Al iniciar, Flyway aplica las migraciones pendientes y la API queda en `http://localhost:8080`.

- **IntelliJ:** abrir la carpeta `backend/` y ejecutar `BackendApplication`.
- **Zed:** abrir la raíz del repo y lanzar la tarea `Backend: correr (spring-boot:run)` (`Alt+Shift+T`).

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm start
```

La app queda en `http://localhost:4200`. En Zed: tarea `Frontend: dev server (ng serve)`.

## Migraciones

El esquema lo gestiona [Flyway](https://flywaydb.org/): cada cambio es un archivo `V<n>__<descripcion>.sql` en `backend/src/main/resources/db/migration/`. Hibernate corre en modo `validate`, así que entidades y esquema deben mantenerse alineados a través de migraciones. Nunca se edita una migración ya aplicada; se crea la siguiente versión.

## Probar la API

- **Swagger UI:** con el backend corriendo, abrir `http://localhost:8080/swagger-ui.html`. Para los endpoints protegidos: hacer login, copiar el token y pegarlo en **Authorize**.
- **Bruno:** abrir la app [Bruno](https://www.usebruno.com/), elegir *Open Collection* y seleccionar la carpeta `bruno/`. Con el environment `local`, ejecutar **Login** (guarda el token solo) y luego cualquier otro request. La carpeta `catalogo/` cubre habitaciones y spa.

## Tests y CI

```bash
cd backend && mvnw.cmd verify     # tests del backend (usa la BD local)
cd frontend && pnpm test          # tests del frontend (Vitest)
```

Cada push a `main` y cada pull request ejecutan ambos en GitHub Actions: el backend contra un Postgres efímero y el frontend con tests y build de producción.

## Variables de entorno (producción)

En desarrollo local no hay nada que configurar: existen valores por defecto. En producción se sobreescriben:

| Variable | Descripción |
|---|---|
| `SPRING_DATASOURCE_URL` | URL JDBC de PostgreSQL (p. ej. Neon) |
| `SPRING_DATASOURCE_USERNAME` | Usuario de la base de datos |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Secreto para firmar tokens JWT (Base64, mínimo 256 bits) |
| `JWT_EXPIRATION` | Vigencia del token en milisegundos (opcional) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales del admin creado al iniciar (opcional) |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para el frontend desplegado |

## Despliegue

La infraestructura de producción está definida como código en [`infra/`](infra/) (Terraform) y documentada paso a paso en [infra/README.md](infra/README.md):

- **API:** VM e2-micro en GCP (capa gratuita, siempre encendida) con Caddy como reverse proxy y TLS automático vía sslip.io; el backend corre en un contenedor publicado en GHCR.
- **Base de datos:** Supabase (PostgreSQL gestionado, plan free).
- **Frontend:** Cloudflare Workers, publicado con Wrangler.

Cada push a `main` despliega automáticamente: `desplegar-backend.yml` publica la imagen y reinicia el contenedor en la VM; `desplegar-frontend.yml` publica el build en Cloudflare.
