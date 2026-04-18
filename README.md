# Migracion ATASAL a Next.js

Este proyecto vive en una carpeta separada (`next-atasal/`) y no modifica el mirror original.

## Que incluye

- App Router con rutas dinamicas para posts, paginas, categorias, tags y autores.
- Redireccion de URLs legacy (`/index.html?p=ID` y `?p=ID`) a rutas limpias.
- Carga de contenido desde `wp-json/wp/v2/*` del mirror local.
- Reescritura de enlaces internos del contenido HTML para que naveguen en Next.
- Handler `/legacy/*` para servir assets existentes (`wp-content`, `wp-includes`) sin mover archivos.

## Estructura clave

- `scripts/generate-content.mjs`: genera `src/data/content.json` y `src/data/redirects.json`.
- `app/[...slug]/page.tsx`: resuelve contenido y archivos de archivo (tags, category, autor).
- `middleware.ts`: aplica redirecciones legacy por ID.
- `app/legacy/[...asset]/route.ts`: sirve archivos estaticos del mirror original.

## Comandos

Desde `next-atasal/`:

```bash
npm install
npm run generate:content
npm run dev
```

Para produccion:

```bash
npm run build
npm run start
```

## Notas

- El script asume este layout:
  - mirror original en el directorio padre (`../`)
  - `wp-json/wp/v2/*` disponible localmente.
- Si cambias la ubicacion del mirror, actualiza `ROOT` en `scripts/generate-content.mjs`.
- Si agregas nuevo contenido al mirror, vuelve a correr `npm run generate:content`.
