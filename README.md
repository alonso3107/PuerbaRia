# PuerbaRia

Aplicación web para la gestión de reservas y vouchers de Puerba Ría. Monorepo con backend en Spring Boot y frontend en Angular.

## Estructura

```
PuerbaRia/
├── backend/    # API REST — Java 17, Spring Boot, PostgreSQL, JWT
├── frontend/   # SPA/SSR — Angular 21, PrimeNG, Tailwind CSS
└── .zed/       # Tareas y configuración para el editor Zed
```

## Requisitos

- Java 17 (JDK)
- Node.js 20+ y [pnpm](https://pnpm.io/)
- PostgreSQL local con una base de datos `puerbaria_db` (usuario `postgres`)

## Cómo correr el proyecto

### Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

- **IntelliJ:** abrir la carpeta `backend/` y ejecutar `BackendApplication`.
- **Zed:** abrir la raíz del repo y lanzar la tarea `Backend: correr (spring-boot:run)` (menú `task: spawn`, atajo `Alt+Shift+T`).

La API queda disponible en `http://localhost:8080`.

### Frontend

```bash
cd frontend
pnpm install
pnpm start
```

- **Zed:** tarea `Frontend: dev server (ng serve)`.

La app queda disponible en `http://localhost:4200`.

## Variables de entorno (producción)

En desarrollo local no se necesita configurar nada: hay valores por defecto. En producción se sobreescriben con estas variables:

| Variable | Descripción |
|---|---|
| `SPRING_DATASOURCE_URL` | URL JDBC de PostgreSQL (p. ej. Neon) |
| `SPRING_DATASOURCE_USERNAME` | Usuario de la base de datos |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Secreto para firmar tokens JWT (Base64, mínimo 256 bits) |
| `JWT_EXPIRATION` | Vigencia del token en milisegundos (opcional) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales del admin creado al iniciar (opcional) |

## Despliegue

- **Backend:** Render, usando el `Dockerfile` de `backend/`.
- **Frontend:** Netlify, con directorio base `frontend/`.
