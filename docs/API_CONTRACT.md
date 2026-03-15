# TechnicianOS API Contract

**Base URL:** `http://localhost:3000/api/v1` (or `VITE_API_URL` env variable)

**Critical auth detail:** All authenticated requests must use `credentials: 'include'` (cookies are httpOnly and cross-origin).

---

## Authentication Endpoints

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | `/register` | No | `{name, email, password, role, organizationId}` | `{user, msg}` + Set-Cookie |
| POST | `/register-with-org` | No | `{name, email, password, role, organizationName}` | `{user, msg}` + Set-Cookie |
| POST | `/login` | No | `{email, password}` | `{user}` + Set-Cookie |
| POST | `/logout` | No | - | `{msg}` |

---

## Users

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/users/me` | Yes | - | `{user}` (current user, no password) |
| GET | `/users` | Yes | - | `{users: User[]}` |
| GET | `/users/:id` | Yes | - | `{user}` |
| PATCH | `/users/update-user` | Yes | `{name, email, role}` | `{user, msg}` |

---

## Organizations

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/organizations/signup` | No | - | `{orgs: {id, name}[]}` (for registration dropdown) |
| GET | `/organizations` | Yes | - | `{orgs: Organization[]}` |
| GET | `/organizations/:id` | Yes | - | `{organization}` |
| POST | `/organizations` | Yes | `{name}` | `{organization}` |
| PATCH | `/organizations/:id` | Yes | `{name}` | `{organization, msg}` |
| DELETE | `/organizations/:id` | Yes | - | `{organization}` |

---

## Projects

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/projects` | Yes | - | `{projects: Project[]}` |
| GET | `/projects/:id` | Yes | - | `{project}` |
| POST | `/projects` | Yes | `{name, organizationId, projectManagerId, technicianId}` | `{project}` |
| PATCH | `/projects/:id` | Yes | `{name, organizationId, projectManagerId, technicianId}` | `{project}` |
| DELETE | `/projects/:id` | Yes | **`{orgId}`** (body required) | `{project}` |

---

## Tasks

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/tasks` | Yes | - | `{tasks: Task[]}` |
| GET | `/tasks/:id` | Yes | - | `{task}` (includes `project`) |
| POST | `/tasks` | Yes | `{name, description, projectId}` + optional `status`, `assignedToUserId` | `{task}` |
| PATCH | `/tasks/:id` | Yes | `{name, description, projectId, status, assignedToUserId}` (all required) | `{task}` |
| DELETE | `/tasks/:id` | Yes | - | `{task}` |

---

## Error Format

All errors return: `{ msg: string }` with appropriate status code:
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Internal Server Error

---

## Schema Constants

### UserRole
`project_manager` | `technician`

### TaskStatus
`pending` | `in_progress` | `completed`

---

## Types

```typescript
interface Organization {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'project_manager' | 'technician';
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: number;
  name: string;
  organizationId: number;
  projectManagerId: number;
  technicianId: number;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  projectId: number;
  status: 'pending' | 'in_progress' | 'completed';
  assignedToUserId: number | null;
  createdAt: string;
  updatedAt: string;
  project?: Project;
}
```
