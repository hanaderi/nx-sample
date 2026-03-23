FROM node:22.22.0-alpine
WORKDIR /app

COPY apps/admin-api/dist/package.json ./package.json
COPY apps/admin-api/dist/yarn.lock ./yarn.lock
COPY apps/admin-api/dist/workspace_modules/ ./workspace_modules/
RUN yarn install --production --frozen-lockfile --non-interactive

COPY apps/admin-api/dist/ .

EXPOSE 3001
CMD ["node", "main.js"]
