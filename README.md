# ClimbPulse

Indoor tırmanış salonu operasyon yönetim platformu — duvar envanteri, rota kurulum, ekipman kiralama ve gelir takibi.

**Demo:** demo@verticalpeakclimbing.com / demo123456

## Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Prisma, PostgreSQL
- **Deploy:** Railway (backend) + Vercel (frontend)

## Yerel Geliştirme

```bash
docker compose up postgres -d
cd backend && cp .env.example .env && npm ci && npm run db:migrate && npm run db:seed && npm run start:dev
cd frontend && cp .env.example .env.local && npm ci && npm run dev
```

| Servis | Port |
|--------|------|
| Frontend | 3013 |
| Backend | 4013 |
| PostgreSQL | 5453 |

## Dokümantasyon

Bkz. `docs/project/` — PRD, ARCHITECTURE, API, DEPLOYMENT, DESIGN_SYSTEM
