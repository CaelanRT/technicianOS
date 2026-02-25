# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**TechnicianOS** is a Node.js/Express REST API for technician and project management. It uses SQLite (embedded, file-based via `dev.db`) with Prisma ORM and JWT cookie-based authentication. There is no frontend — all testing is done via HTTP requests (curl, etc.).

### Project structure

All source code lives in `/workspace/server/`. Key directories:
- `controllers/` — route handlers for users, organizations, projects, tasks
- `routes/` — Express route definitions
- `middleware/` — error handler, JWT authentication
- `prisma/` — schema and migrations
- `db/` — Prisma client setup
- `utils/` — JWT and password hashing helpers

### Environment variables

A `.env` file is required at `/workspace/server/.env` (gitignored). Required vars:
- `DATABASE_URL` — Prisma datasource URL pointing to the SQLite file
- `JWT_SECRET` — any string for signing JWTs and cookies
- `JWT_LIFETIME` — token expiration duration (e.g. `1d`)

### Running the dev server

```bash
cd /workspace/server
npm start          # runs nodemon server.js, auto-reloads on changes
```

Server listens on port 3000 by default.

### Prisma gotchas

- After any schema change, run `npx prisma generate` in `/workspace/server` to regenerate the client (output goes to `generated/prisma/`).
- After adding new migrations, run `npx prisma migrate deploy` in `/workspace/server`.
- The Prisma config is in `prisma.config.ts` (TypeScript), which reads `DATABASE_URL` from `.env`.

### Testing

No automated test framework is configured. Verify behavior via curl against the running API. Auth endpoints (`/api/v1/register`, `/api/v1/login`, `/api/v1/logout`) are public; all other endpoints require a signed `token` cookie obtained from login/register.

### Lint / build

No linter or build step is configured in this project. The codebase uses CommonJS modules and runs directly with `node`/`nodemon`.
