# ClimbPulse Final Documentation

## Proje Özeti

ClimbPulse, ABD'deki bağımsız indoor tırmanış salonları (6-24 duvar bölgesi) için operasyon yönetim platformudur. Duvar envanteri, gelir takibi, rota kurulumu, rotasyon planlaması, ekipman kiralama ve fiyat kademelerini tek panelde birleştirir.

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | NestJS, Prisma, PostgreSQL |
| Deployment | Railway (backend), Vercel (frontend) |

## Tasarım

Vertical Grit — kumtaşı (#C4956A), arduvaz (#2D3748), mercan (#E53E3E); Space Grotesk + JetBrains Mono; üst durum çubuğu + yatay sekme navigasyon.

## Özellikler

1. Duvar bölgesi envanteri ve durum yönetimi
2. Tırmanış oturum gelir takibi (nakit, kart, ekipman kiralama)
3. Rota kurulum emirleri ve acil filtre
4. Rota rotasyon planı
5. Ekipman kiralama envanteri
6. Fiyat kademeleri (günlük geçiş, üyelik, ders)
7. Operasyon dashboard (kullanım, gelir, trend)

## Demo

| Alan | Değer |
|------|-------|
| E-posta | demo@verticalpeakclimbing.com |
| Şifre | demo123456 |

## Portlar

| Servis | Port |
|--------|------|
| Frontend | 3013 |
| Backend | 4013 |
| PostgreSQL | 5453 |

## Mimari Kararlar

- Ayrı GitHub reposu: `gorkemkyolai06/climbpulse`
- JWT tabanlı kimlik doğrulama
- Climbing gym scoped multi-tenant veri modeli
- MVP'de AI yok — bkz. `AI_SYSTEM.md`

## Dokümantasyon Dizini

| Dosya | İçerik |
|-------|--------|
| PRD.md | Ürün gereksinimleri |
| DESIGN_SYSTEM.md | Tasarım sistemi |
| ARCHITECTURE.md | Sistem mimarisi |
| API.md | REST endpoint referansı |
| DATABASE.md | Şema ve seed |
| ROADMAP.md | Ürün yol haritası |
| TASKS.md | Görev durumu |
| QA_REPORT.md | Test raporu |
| DEPLOYMENT.md | Deploy ve yerel geliştirme |
| AI_SYSTEM.md | AI durumu |

## Deployment

Bkz. `docs/project/DEPLOYMENT.md`
