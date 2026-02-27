# TechnicianOS

TechnicianOS is a backend API for managing organizations, users, projects, and tasks in a technician/project-management workflow.

## Current Functionality

The project currently provides:

- **Authentication**
  - User registration, login, and logout endpoints.
  - Signed cookie-based JWT authentication for protected routes.
- **Organization management**
  - Create, read, update, and delete organizations.
- **User management**
  - Fetch all users, fetch a single user, and update the authenticated user's profile data.
- **Project management**
  - Create, read, update, and delete projects.
- **Task management**
  - Create, read, update, and delete tasks.

## Tech Stack

### Runtime and Framework
- **Node.js**
- **Express 5**

### Database and ORM
- **SQLite** (via Prisma adapter)
- **Prisma ORM**

### Authentication and Security
- **JWT** (`jsonwebtoken`)
- **Signed HTTP-only cookies** (`cookie-parser`)
- **Password hashing** (`bcryptjs`)

### Tooling
- **Jest** for tests
- **Nodemon** for development server restarts
- **dotenv** for environment variable management

## Repository Structure

- `server/` – API source code, Prisma schema/migrations, tests, and local database files.

## Running the API

1. Install dependencies:
   - `cd server && npm install`
2. Configure environment variables (for example, `DATABASE_URL` and `JWT_SECRET`).
3. Start the server:
   - `npm start`

By default, the API listens on port `3000` unless `PORT` is set.
