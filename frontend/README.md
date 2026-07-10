# PuerbaRia — Frontend

SPA con SSR construida con Angular 21, PrimeNG y Tailwind CSS. Generada con Angular CLI 21.2.9.

## Comandos

```bash
pnpm install         # instalar dependencias
pnpm start           # servidor de desarrollo en http://localhost:4200
pnpm build           # build de producción (dist/puerbaria)
pnpm test            # tests unitarios (vitest)
pnpm watch           # build en modo watch
```

## Scaffolding

```bash
pnpm ng generate component nombre-del-componente
```

## Notas

- Gestor de paquetes: **pnpm** (no usar npm/yarn para no duplicar lockfiles).
- El archivo `src/.env` es local y no se versiona.
