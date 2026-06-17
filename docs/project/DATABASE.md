# ClimbPulse Veritabanı

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| ClimbingGym | climbing_gyms | Tesis bilgileri |
| User | users | Kullanıcılar |
| WallZone | wall_zones | Duvar bölgeleri |
| ClimbSession | climb_sessions | Oturum gelirleri |
| RouteSetting | route_settings | Rota kurulum emirleri |
| RouteRotation | route_rotations | Rotasyon planları |
| GearInventory | gear_inventory | Ekipman envanteri |
| RateTier | rate_tiers | Fiyat kademeleri |

## İlişkiler

- ClimbingGym 1:N User, WallZone, ClimbSession, RouteSetting, RouteRotation, GearInventory, RateTier
- WallZone 1:N ClimbSession, RouteSetting

## İndeksler

- `wall_zones`: `(climbingGymId, status)`
- `climb_sessions`: `(climbingGymId, sessionAt)`, `(climbingGymId, status)`
- `route_settings`: `(climbingGymId, status)`, `(climbingGymId, priority)`
- `route_rotations`: `(climbingGymId, scheduledAt)`
- `gear_inventory`: `(climbingGymId, status)`, `(climbingGymId, gearType)`
- `rate_tiers`: `(climbingGymId, rateCategory)`

## Seed Verisi

Demo tesis: **Vertical Peak Climbing** (Boulder, CO — 12 bölge kapasite, 6 seed bölge)

| Alan | Değer |
|------|-------|
| E-posta | demo@verticalpeakclimbing.com |
| Şifre | demo123456 |

Seed idempotent — `upsert` ile tekrar çalıştırılabilir.

## Migration

`backend/prisma/migrations/20260617180000_init/migration.sql`

## Scripts

```json
"db:migrate": "prisma migrate deploy",
"db:seed": "prisma db seed",
"deploy": "prisma migrate deploy && prisma db seed && npm run start:prod"
```
