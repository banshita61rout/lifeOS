# LifeOS API Reference (Phase 1)

Base URL (local): `http://localhost:5000/api`

All protected routes require a header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth — `/api/auth`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | `{ name, email, password }` → creates user, returns `{ user, token }` |
| POST | `/login` | No | `{ email, password }` → returns `{ user, token }` |
| POST | `/google` | No | `{ googleId, email, name, avatar }` → login/create via Google profile |
| GET | `/me` | Yes | Returns current user |
| POST | `/forgot-password` | No | `{ email }` → generates reset token, emails or logs link |
| PUT | `/reset-password/:token` | No | `{ password }` → sets new password |

## Users — `/api/users`

| Method | Route | Auth | Description |
|---|---|---|---|
| PUT | `/me` | Yes | multipart form: `name`, `theme`, `avatar` (file) |
| PUT | `/change-password` | Yes | `{ currentPassword, newPassword }` |

## Tasks — `/api/tasks`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Query: `status`, `priority`, `category`, `search` |
| POST | `/` | Yes | `{ title, description, category, priority, status, dueDate }` |
| PUT | `/:id` | Yes | Partial update |
| DELETE | `/:id` | Yes | Delete task |

## Habits — `/api/habits`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List active habits |
| POST | `/` | Yes | `{ name, icon, color, frequency }` |
| PUT | `/:id` | Yes | Update habit |
| DELETE | `/:id` | Yes | Delete habit + its logs |
| POST | `/:id/toggle` | Yes | `{ date? }` toggles completion for a date (default today), recalculates streaks |
| GET | `/heatmap` | Yes | Query: `habitId?`, `days?` (default 365) → `{ "YYYY-MM-DD": count }` |

## Events — `/api/events`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Query: `start`, `end` (ISO dates) to filter range |
| POST | `/` | Yes | `{ title, start, end, category, recurrence, allDay }` |
| PUT | `/:id` | Yes | Update / move event |
| DELETE | `/:id` | Yes | Delete event |

## Journal — `/api/journal`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Query: `search`, `mood` |
| POST | `/` | Yes | multipart form: `title`, `content`, `mood`, `images[]` (up to 5) |
| PUT | `/:id` | Yes | Update entry |
| DELETE | `/:id` | Yes | Delete entry |

## Dashboard — `/api/dashboard`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Aggregated payload: today's events, upcoming events, pending tasks, productivity %, weekly summary chart data, habit streaks, recent journal entries |

---

## Error Format

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

## Success Format

```json
{
  "success": true,
  "...": "resource-specific data"
}
```
