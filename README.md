# nx-sample

Production-ready **Nx 22** monorepo — React 19 frontend, two NestJS 11 backends, and shared TypeScript types. Uses Yarn workspaces, Vitest for unit tests, Playwright for E2E, and a Docker build-outside strategy.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22 LTS |
| Yarn | 1.x |
| Docker | 24+ |
| Docker Compose | 2.x |

## Getting Started

```bash
# Install dependencies
yarn install

# Start frontend dev server (localhost:4200)
yarn nx serve web

# Start public API dev server (localhost:3000)
yarn nx serve api

# Start admin API dev server (localhost:3001)
yarn nx serve admin-api
```

## Project Structure

```
apps/
  web/          React 19 + Vite 7 SPA                    → dev: 4200, docker: 8080
  web-e2e/      Playwright E2E for web
  api/          NestJS 11 public REST API                 → dev: 3000, docker: 3000
  api-e2e/      Jest integration tests for api
  admin-api/    NestJS 11 internal/admin REST API         → dev: 3001, docker: 3001
  admin-api-e2e/ Jest integration tests for admin-api
libs/
  shared-types/ Shared TypeScript types and DTOs          → @org/shared-types
```

## Nx Task Reference

```bash
# Build
yarn nx run-many -t build                # Build all apps and libs
yarn nx build web                        # Build web app
yarn nx build api                        # Build api
yarn nx build admin-api                  # Build admin-api

# Test
yarn nx run-many -t test                 # All unit tests
yarn nx test web                         # Web unit tests (Vitest)
yarn nx test api                         # API unit tests (Vitest)
yarn nx run web-e2e:e2e                  # Web E2E (Playwright)

# Lint
yarn nx run-many -t lint                 # Lint everything

# Typecheck
yarn nx run-many -t typecheck            # TypeScript check all projects

# Visualize the project graph
yarn nx graph
```

## Docker Workflow

This repo uses a **build-outside** strategy. Dockerfiles copy pre-built `dist/` artifacts — they do not compile code.

### Build & Run All Services

```bash
# 1. Build all applications
yarn nx run-many -t build

# 2. Run the prune pipeline for each NestJS app
#    (generates pruned package.json + lockfile + workspace modules)
yarn nx run api:prune
yarn nx run admin-api:prune

# 3. Build Docker images (or run all at once)
yarn nx run-many -t docker-build

# 4. Start all services
docker-compose up
```

### Individual Image Builds

```bash
yarn nx run web:docker-build        # web  → nginx:alpine image
yarn nx run api:docker-build        # api  → node:22-alpine image
yarn nx run admin-api:docker-build  # admin-api → node:22-alpine image
```

### Docker Compose Commands

```bash
docker-compose up           # Start all services (foreground)
docker-compose up -d        # Start in background
docker-compose logs -f      # Follow logs
docker-compose down         # Stop all services
```

### Service URLs

| Service | URL |
|---------|-----|
| web | http://localhost:8080 |
| api | http://localhost:3000 |
| admin-api | http://localhost:3001 |

## Shared Types

The `@org/shared-types` package is the single source of truth for DTOs shared across all apps:

```typescript
import { CreateUserDto, UserResponseDto } from '@org/shared-types';
```

Add new shared types in `libs/shared-types/src/lib/dto.ts` and export from `libs/shared-types/src/index.ts`.

## Adding New Apps or Libraries

```bash
# New NestJS app
yarn nx g @nx/nest:app --name=<name> --directory=apps/<name>

# New React app
yarn nx g @nx/react:app --name=<name> --directory=apps/<name> --bundler=vite --unitTestRunner=vitest

# New shared library
yarn nx g @nx/js:lib --name=<name> --directory=libs/<name> --bundler=tsc --unitTestRunner=vitest
```

## Nx Cloud

To enable remote caching and distributed CI, connect this workspace:

```bash
yarn nx connect
```

See [Nx Cloud docs](https://nx.dev/ci/intro/why-nx-cloud) for details.
