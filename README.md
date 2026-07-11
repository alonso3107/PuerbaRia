# PuerbaRia

[![CI](https://github.com/alonso3107/PuerbaRia/actions/workflows/ci.yml/badge.svg)](https://github.com/alonso3107/PuerbaRia/actions/workflows/ci.yml)

Aplicación web para la gestión de reservas y vouchers de Puerba Ría. Monorepo con backend en Spring Boot y frontend en Angular.

## Estructura

```
PuerbaRia/
├── backend/    # API REST — Java 17, Spring Boot, PostgreSQL, JWT
├── frontend/   # SPA/SSR — Angular 21, PrimeNG, Tailwind CSS
├── bruno/      # Colección de Bruno para probar la API
└── .zed/       # Tareas y configuración para el editor Zed
```

## Requisitos

- Java 17 (JDK)
- Node.js 20+ y [pnpm](https://pnpm.io/)
- [Podman](https://podman.io/) (o Docker) para la base de datos local

## Cómo correr el proyecto

### Base de datos

```bash
podman compose up -d
```

Levanta PostgreSQL 18 en `localhost:5432` con la base `puerbaria_db`. Al iniciar el backend, Flyway aplica las migraciones de `backend/src/main/resources/db/migration/` automáticamente. Para detenerla: `podman compose down` (los datos persisten en el volumen `db_data`).

### Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

- **IntelliJ:** abrir la carpeta `backend/` y ejecutar `BackendApplication`.
- **Zed:** abrir la raíz del repo y lanzar la tarea `Backend: correr (spring-boot:run)` (menú `task: spawn`, atajo `Alt+Shift+T`).

La API queda disponible en `http://localhost:8080`.

### Migraciones de base de datos

El esquema lo gestiona [Flyway](https://flywaydb.org/): cada cambio de esquema es un archivo `V<n>__<descripcion>.sql` en `backend/src/main/resources/db/migration/`. Hibernate corre en modo `validate`, por lo que las entidades y el esquema deben mantenerse alineados a través de migraciones — nunca editar una migración ya aplicada, siempre crear la siguiente versión.

## Documentación y pruebas de la API

- **Swagger UI:** con el backend corriendo, abrir `http://localhost:8080/swagger-ui.html`. Para probar endpoints protegidos, hacer login, copiar el token y pegarlo en el botón **Authorize**.
- **Bruno:** abrir la app [Bruno](https://www.usebruno.com/), elegir *Open Collection* y seleccionar la carpeta `bruno/` del repo. Elegir el environment `local`, ejecutar **Login** (guarda el token automáticamente) y luego cualquier otro request.

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
