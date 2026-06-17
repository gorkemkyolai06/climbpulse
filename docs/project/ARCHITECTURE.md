# ClimbPulse Mimari

## Genel Bakış

```
┌─────────────┐     NEXT_PUBLIC_API_URL     ┌─────────────┐
│   Next.js   │ ──────────────────────────► │   NestJS    │
│  Frontend   │                             │   Backend   │
│  (Vercel)   │ ◄────────────────────────── │  (Railway)  │
└─────────────┘         JSON / JWT          └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │ PostgreSQL  │
                                            │  (Railway)  │
                                            └─────────────┘
```

## Backend Modülleri

- `health` — DB bağlantı kontrolü
- `auth` — JWT kayıt/giriş
- `climbing-gym` — Tesis profili
- `wall-zones` — Duvar bölgeleri
- `climb-sessions` — Oturum gelirleri
- `route-settings` — Rota kurulum emirleri
- `route-rotations` — Rotasyon planları
- `gear-inventory` — Ekipman envanteri
- `rate-tiers` — Fiyat kademeleri
- `dashboard` — KPI istatistikleri

## Multi-Tenancy

Tüm kaynaklar `climbingGymId` ile scope edilir. JWT payload içinde `sub`, `email` ve `climbingGymId` taşınır.

## CORS

`backend/src/main.ts` — `FRONTEND_URL` env (virgülle ayrılmış çoklu origin destekli).

## Deployment Pipeline

1. Push → GitHub Actions CI
2. Railway Wait for CI → backend deploy (migrate + seed + start)
3. Vercel → frontend deploy
