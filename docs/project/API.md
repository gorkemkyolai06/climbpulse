# ClimbPulse API

Base URL: `{NEXT_PUBLIC_API_URL}` (ör. `https://api.example.com/api`)

## Auth

| Method | Path | Auth | Status |
|--------|------|------|--------|
| POST | `/auth/register` | No | 201 |
| POST | `/auth/login` | No | 200 |
| GET | `/auth/me` | Yes | 200 |

**Register body:** `email`, `password` (min 8), `firstName`, `lastName`, `climbingGymName`, opsiyonel `phone`, `city`, `state`

**Login response:**
```json
{
  "accessToken": "...",
  "user": { "id", "email", "firstName", "lastName", "role" },
  "climbingGym": { "id", "name" }
}
```

## Health

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/health` | No | 200 |

## Climbing Gym

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/climbing-gym` | Yes | 200 |
| PATCH | `/climbing-gym` | Yes | 200 |

## Wall Zones

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/wall-zones` | Yes | 200 |
| GET | `/wall-zones/:id` | Yes | 200 |
| POST | `/wall-zones` | Yes | 201 |
| PATCH | `/wall-zones/:id` | Yes | 200 |
| DELETE | `/wall-zones/:id` | Yes | 200 |

**POST body:** `name`, `section`, opsiyonel `zoneType`, `gradeRange`, `maxCapacity`, `status`, `notes`

## Climb Sessions

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/climb-sessions` | Yes | 200 |
| GET | `/climb-sessions/:id` | Yes | 200 |
| POST | `/climb-sessions` | Yes | 201 |
| PATCH | `/climb-sessions/:id` | Yes | 200 |
| DELETE | `/climb-sessions/:id` | Yes | 200 |

## Route Settings

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/route-settings` | Yes | 200 |
| GET | `/route-settings/urgent` | Yes | 200 |
| GET | `/route-settings/:id` | Yes | 200 |
| POST | `/route-settings` | Yes | 201 |
| PATCH | `/route-settings/:id` | Yes | 200 |
| DELETE | `/route-settings/:id` | Yes | 200 |

## Route Rotations

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/route-rotations` | Yes | 200 |
| GET | `/route-rotations/:id` | Yes | 200 |
| POST | `/route-rotations` | Yes | 201 |
| PATCH | `/route-rotations/:id` | Yes | 200 |
| DELETE | `/route-rotations/:id` | Yes | 200 |

## Gear Inventory

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/gear-inventory` | Yes | 200 |
| GET | `/gear-inventory/available` | Yes | 200 |
| GET | `/gear-inventory/:id` | Yes | 200 |
| POST | `/gear-inventory` | Yes | 201 |
| PATCH | `/gear-inventory/:id` | Yes | 200 |
| DELETE | `/gear-inventory/:id` | Yes | 200 |

## Rate Tiers

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/rate-tiers` | Yes | 200 |
| GET | `/rate-tiers/:id` | Yes | 200 |
| POST | `/rate-tiers` | Yes | 201 |
| PATCH | `/rate-tiers/:id` | Yes | 200 |
| DELETE | `/rate-tiers/:id` | Yes | 200 |

## Dashboard

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/dashboard/stats` | Yes | 200 |

**Response alanları:** `totalWallZones`, `openWallZones`, `wallZoneUtilizationRate`, `totalSessions`, `openRouteSettings`, `urgentRouteSettings`, `pendingRouteRotations`, `availableGear`, `rentedGear`, `dailyRevenue`, `recentSessions`, `recentRouteSettings`, `sections`, `monthlyTrend`
