# LifeOS Database Schema (Phase 1)

MongoDB collections (via Mongoose models in `backend/models/`).

## `users`
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | hashed with bcrypt, `select:false`, optional (Google users) |
| googleId | String | optional |
| avatar | String | local path e.g. `/uploads/avatars/xyz.png` |
| role | String | `user` \| `admin` |
| theme | String | `light` \| `dark` |
| resetPasswordToken / resetPasswordExpire | String / Date | for forgot-password flow |
| timestamps | createdAt, updatedAt |

## `tasks`
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → User | required |
| title | String | required |
| description | String | |
| category | String | default "General" |
| priority | String | `low` \| `medium` \| `high` |
| status | String | `todo` \| `in-progress` \| `done` |
| dueDate | Date | |
| timeBlockStart / timeBlockEnd | Date | |
| progress | Number | 0–100 |

Text index on `title` + `description` for search.

## `habits`
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → User | |
| name | String | required |
| icon | String | emoji |
| color | String | hex |
| frequency | String | `daily` \| `weekly` |
| currentStreak / bestStreak | Number | recalculated on toggle |
| archived | Boolean | |

## `habitlogs`
| Field | Type | Notes |
|---|---|---|
| habit | ObjectId → Habit | |
| user | ObjectId → User | |
| date | String | `YYYY-MM-DD`, unique per (habit, date) |

One document per completed day — powers both streak calculation and the
contribution heatmap.

## `events`
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → User | |
| title | String | required |
| description | String | |
| start / end | Date | required |
| allDay | Boolean | |
| category | String | `work` \| `personal` \| `health` \| `study` \| `social` \| `other` |
| color | String | hex |
| recurrence | String | `none` \| `daily` \| `weekly` \| `monthly` |
| reminderMinutesBefore | Number | |

## `journals`
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → User | |
| title | String | optional |
| content | String | required |
| mood | String | `great` \| `good` \| `okay` \| `bad` \| `awful` |
| images | [String] | local paths, up to 5 per entry |
| date | Date | |

Text index on `title` + `content` for search.

---

## Entity Relationships

```
User (1) ──< Task
User (1) ──< Habit ──< HabitLog
User (1) ──< Event
User (1) ──< Journal
```

All child documents store a `user` reference and every controller filters
by `req.user._id`, so users can only ever see/modify their own data.
