# Build-Outside Dockerfile — assumes apps/api/dist already exists on the host.
# Run `nx run api:prune` before invoking `docker build`.
# The prune target emits a pruned package.json, yarn.lock, and
# workspace_modules/ (local workspace packages like @org/shared-types).
FROM node:22.22.0-alpine AS runner
WORKDIR /app

# Install production deps from the pruned lockfile
COPY apps/api/dist/package.json ./package.json
COPY apps/api/dist/yarn.lock ./yarn.lock
COPY apps/api/dist/workspace_modules/ ./workspace_modules/
RUN yarn install --production --frozen-lockfile --non-interactive

# Copy compiled application
COPY apps/api/dist/ .

EXPOSE 3000
CMD ["node", "main.js"]
