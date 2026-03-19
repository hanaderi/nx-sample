<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `yarn nx build`, `yarn nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

---

# Project-Specific Context

## Workspace at a Glance

**Nx 22.6** monorepo — Yarn 1.x, TypeScript 5.9, React 19, NestJS 11, Vite 7, Vitest 4.

```
apps/
  web/           React 19 + Vite 7       (port 4200 dev, 8080 docker)
  web-e2e/       Playwright E2E
  api/           NestJS 11 public API    (port 3000)
  api-e2e/       Jest integration tests
  admin-api/     NestJS 11 admin API     (port 3001)
  admin-api-e2e/ Jest integration tests
libs/
  shared-types/  Shared TS types/DTOs   (@org/shared-types)
```

## Naming Conventions

- Org name: `@org`
- App packages: `@org/web`, `@org/api`, `@org/admin-api`
- Library packages: `@org/shared-types`
- Import alias: `@org/<lib-name>` (configured in root `tsconfig.json` via custom conditions)

## Importing Shared Types

```typescript
import { CreateUserDto, UserResponseDto, AdminUserResponseDto } from '@org/shared-types';
```

This works in all apps (`web`, `api`, `admin-api`) without any additional config.

## Targets Available Per App

| Target | web | api | admin-api | shared-types |
|--------|-----|-----|-----------|--------------|
| build | ✓ | ✓ | ✓ | ✓ |
| test | ✓ | ✓ | ✓ | ✓ |
| lint | ✓ | ✓ | ✓ | ✓ |
| serve | ✓ | ✓ | ✓ | — |
| typecheck | ✓ | — | — | ✓ |
| e2e | web-e2e | api-e2e | admin-api-e2e | — |
| prune | — | ✓ | ✓ | — |
| docker-build | ✓ | ✓ | ✓ | — |

## Project Configuration

This workspace uses **Nx inferred projects** (Nx 22). There are no `project.json` files.
Project targets are defined in the `"nx"` field of each app's `package.json`.

- `apps/web/package.json` — contains `docker-build` target
- `apps/api/package.json` — contains `build`, `prune-lockfile`, `copy-workspace-modules`, `prune`, `docker-build`, `serve` targets
- `apps/admin-api/package.json` — same as api

## ESLint (Flat Config)

This workspace uses **ESLint 9 flat config**. Configuration files are named `eslint.config.mjs`, NOT `.eslintrc.json`.

- Root config: `eslint.config.mjs`
- Per-app overrides: `apps/<app>/eslint.config.mjs`
- Run: `yarn nx run-many -t lint`

**Do NOT create `.eslintrc.json` files.** They are not supported in ESLint 9 flat config mode.

## Testing Approach

| Type | Tool | Where |
|------|------|--------|
| Frontend unit | Vitest (jsdom) | `apps/web/**/*.spec.{ts,tsx}` |
| Backend unit | Vitest (node) | `apps/api/**/*.spec.ts` |
| Shared lib unit | Vitest | `libs/**/*.spec.ts` |
| Frontend E2E | Playwright | `apps/web-e2e/src/**/*.spec.ts` |
| API integration | Jest | `apps/api-e2e/src/**/*.spec.ts` |

```bash
yarn nx test web                  # run web unit tests
yarn nx test api                  # run api unit tests
yarn nx run web-e2e:e2e           # run Playwright E2E
```

## Docker: Build-Outside Pattern

**Key rule:** Always run the build BEFORE the docker build.

```bash
# NestJS apps: run prune (which includes build)
yarn nx run api:prune
docker build -f apps/api/Dockerfile -t nx-sample-api:latest .

# Or just use the nx target which handles the dependency chain:
yarn nx run api:docker-build
```

**Build output locations:**
- `apps/web/dist/` — Vite build output
- `apps/api/dist/` — webpack build + pruned package.json + yarn.lock + workspace_modules/
- `apps/admin-api/dist/` — same as api

## Adding New Apps

When adding a new NestJS app, the generator automatically adds `prune-lockfile`, `copy-workspace-modules`, `prune`, and `serve` targets to its `package.json`. You only need to manually add `docker-build` (copy the pattern from `apps/api/package.json`).

## Common Pitfalls

- **Don't** run `tsc` or `webpack` directly — use `yarn nx build <app>` so Nx handles deps and caching
- **Don't** use `npm` or `pnpm` — this repo uses **Yarn**
- **Don't** create `.eslintrc.json` — ESLint 9 flat config only
- **Don't** build Docker images without running `prune` first on NestJS apps — the Dockerfile expects `dist/package.json` to exist
- Shared libraries live in `libs/` not `packages/` (matches the Yarn workspace glob)
