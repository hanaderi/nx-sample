# Project Plan

## Overview

This is a production-ready **Nx 22** monorepo using **Yarn** as the package manager.

### Goals
- Full-stack TypeScript from a single repository
- Shared types/DTOs across frontend and backend with no duplication
- Docker images that are minimal, secure, and fast to build in CI
- Nx caching and task pipeline for fast local and CI workflows

---

## Architecture

```
nx-sample/
├── apps/
│   ├── web/          React 19 + Vite 7 (SPA)         → port 8080
│   ├── web-e2e/      Playwright E2E tests for web
│   ├── api/          NestJS 11 (public REST API)      → port 3000
│   ├── api-e2e/      Jest integration tests for api
│   ├── admin-api/    NestJS 11 (admin REST API)       → port 3001
│   └── admin-api-e2e/  Jest integration tests for admin-api
└── libs/
    └── shared-types/ Shared TypeScript types/DTOs     (@org/shared-types)
```

### Port Map

| Service   | Dev port | Docker port |
|-----------|----------|-------------|
| web       | 4200     | 8080        |
| api       | 3000     | 3000        |
| admin-api | 3001     | 3001        |

---

## Stack

| Layer       | Technology            | Version  |
|-------------|-----------------------|----------|
| Build system | Nx                   | 22.6.x   |
| Frontend    | React                 | 19       |
| Bundler     | Vite                  | 7        |
| Backend     | NestJS                | 11       |
| Language    | TypeScript            | 5.9      |
| Unit tests  | Vitest                | 4        |
| E2E tests   | Playwright (web)      | 1.36+    |
|             | Jest (API)            |          |
| Linting     | ESLint 9 (flat config)| 9        |
| Containers  | Docker + Compose      |          |

---

## Docker Strategy: Build-Outside

The Dockerfiles in this repo are **runners, not builders**. They assume the build artifacts already exist on the host and simply copy them into a minimal image.

```
CI/CD Pipeline:
  1. nx run-many -t build        ← compile all apps
  2. nx run api:prune            ← generate pruned package.json + lockfile + workspace modules
  3. nx run admin-api:prune      ← same for admin-api
  4. docker build ...            ← copy dist/ into thin image, install prod deps only
```

### Why Build-Outside?
- Docker layer caching is preserved across builds (deps layer rarely changes)
- Nx handles incremental builds and caching — Docker doesn't need to re-compile
- Images stay minimal (no build tools, no dev dependencies)
- Single build artifact can be promoted across environments (dev → staging → prod)

### Prune Targets (Nx 22 native)

Each NestJS app has three auto-generated prune targets in `apps/{app}/package.json`:

| Target | What it does |
|--------|-------------|
| `prune-lockfile` | Emits `dist/package.json` + `dist/yarn.lock` with only production deps |
| `copy-workspace-modules` | Copies compiled local packages (e.g. `@org/shared-types`) into `dist/workspace_modules/` |
| `prune` | Depends on both — runs the full prune pipeline |

The `docker-build` target depends on `prune`, which depends on `build`.

---

## Nx Task Pipeline

```
docker-build
    └── prune (NestJS only)
            ├── prune-lockfile
            │       └── build
            └── copy-workspace-modules
                    └── build
build
    └── ^build (build dependencies first)
```

### Common Commands

```bash
# Development
nx serve web                      # Frontend dev server (localhost:4200)
nx serve api                      # NestJS api dev server (localhost:3000)
nx serve admin-api                # NestJS admin-api dev server (localhost:3001)

# Build
nx build web                      # Build web app → apps/web/dist/
nx build api                      # Build api → apps/api/dist/
nx build admin-api                # Build admin-api → apps/admin-api/dist/
nx run-many -t build              # Build all apps and libs

# Test
nx test web                       # Unit tests for web
nx test api                       # Unit tests for api
nx test shared-types              # Unit tests for shared-types
nx run-many -t test               # All unit tests
nx run web-e2e:e2e                # Playwright E2E for web

# Lint
nx run-many -t lint               # Lint everything

# Docker (single app)
nx run api:prune                  # Run full prune pipeline for api
nx run api:docker-build           # Prune + docker build for api
nx run admin-api:docker-build     # Prune + docker build for admin-api
nx run web:docker-build           # Build + docker build for web

# Docker (all apps)
nx run-many -t docker-build       # Build all Docker images

# Run full stack locally
docker-compose up                 # Start all services
docker-compose up --build         # Rebuild images and start
docker-compose down               # Stop all services
```

---

## Adding New Apps or Libraries

### New NestJS App
```bash
npx nx g @nx/nest:app --name=<app-name> --directory=apps/<app-name>
```

### New React App
```bash
npx nx g @nx/react:app --name=<app-name> --directory=apps/<app-name> --bundler=vite --unitTestRunner=vitest
```

### New Shared Library
```bash
npx nx g @nx/js:lib --name=<lib-name> --directory=libs/<lib-name> --bundler=tsc --unitTestRunner=vitest
```

Import shared libraries using the `@org/<lib-name>` alias (auto-configured in `tsconfig.json`).

---

## Shared Types

The `@org/shared-types` package (`libs/shared-types/`) is the single source of truth for DTOs and interfaces shared across the frontend and backends.

```typescript
import { CreateUserDto, UserResponseDto } from '@org/shared-types';
```

When adding new types:
1. Add the type/interface to `libs/shared-types/src/lib/dto.ts` (or create a new file)
2. Export it from `libs/shared-types/src/index.ts`
3. Both NestJS apps and the React app can import it immediately

---

## ESLint

This workspace uses **ESLint 9 flat config** (`eslint.config.mjs`). There is **no `.eslintrc.json`**.

- Root config: `eslint.config.mjs` at workspace root
- Per-app overrides: `apps/<app>/eslint.config.mjs`
- Run linting: `nx run-many -t lint`

---

## Decisions Log

| Decision | Rationale |
|----------|-----------|
| Two NestJS APIs | Separate public (`api`) and admin (`admin-api`) concerns; different auth policies, rate limits |
| `libs/` for shared libs | Matches Yarn workspace glob; keeps libs separate from apps |
| Build-outside Docker | Nx handles incremental builds; Docker images stay thin and promotable |
| Nx 22 prune targets | Native Nx prune pipeline; no extra tooling for minimal production images |
| Vitest for unit tests | Vite-native, fast, single runner for both frontend and Node |
| ESLint 9 flat config | Modern config format; required by ESLint 9+ |
