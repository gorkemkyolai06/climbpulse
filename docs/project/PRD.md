# ClimbPulse — Ürün Gereksinim Belgesi (PRD)

**Durum:** MVP Tamamlandı  
**Oluşturma:** 2026-06-17  
**GitHub:** https://github.com/gorkemkyolai06/climbpulse

## Özet

ClimbPulse, ABD'deki bağımsız indoor tırmanış salonları için duvar bölgesi envanteri, tırmanış oturum geliri takibi, rota kurulum yönetimi, rota rotasyon planlaması, ekipman kiralama envanteri ve fiyat kademesi yönetimi sunan B2B SaaS platformudur.

## Tasarım Yönü: Vertical Grit

Kaya tırmanışı ve atölye estetiği — kumtaşı (#C4956A), arduvaz (#2D3748), tebeşir beyazı (#F7FAFC), mercan vurgu (#E53E3E), yosun yeşili (#38A169). Space Grotesk + JetBrains Mono tipografi, üst yapışkan durum çubuğu + yatay sekme navigasyon, 4px mercan sol kenarlı kartlar. BayPulse (editorial golf), LanePulse (neon arcade) ve RinkPulse (arctic technical) projelerinden tamamen farklı.

## Hedef Kitle

- ABD Rocky Mountain ve Pacific Northwest'teki 20-60 rota kapasiteli bağımsız indoor tırmanış salonları (Colorado, Oregon, Washington)
- 1-2 lokasyonlu aile işletmeleri
- Rota rotasyonlarını ve ekipman envanterini Excel ile yöneten operatörler

## Problem

Duvar bölgesi durumları, rota kurulum kayıtları, ekipman kiralama stokları ve günlük gelir kayıtları dağınık tablolarda tutuluyor. Boulder ve ip duvarı rotasyonları senkronize değil; emniyet denetimleri kağıt formlarda kayboluyor.

## Çözüm

- Duvar bölgesi envanteri ve durum takibi (açık, kapalı, kurulum, denetim)
- Rota kurulum emirleri ve öncelik yönetimi
- Rota rotasyon planı ve tamamlanma kaydı
- Ekipman kiralama envanteri (harness, ayakkabı, tebeşir torbası)
- Tırmanış oturum geliri kaydı (nakit, kart, ekipman kiralama)
- Fiyat kademeleri (günlük geçiş, üyelik, ders paketi)

## İş Modeli

SaaS — duvar bölgesi başına aylık abonelik ($3-8/bölge/ay)

| Plan | Fiyat | Bölge |
|------|-------|-------|
| Starter | $49/ay | 6 bölge |
| Growth | $99/ay | 12 bölge |
| Pro | $179/ay | 24 bölge |

## MVP Kapsamı

- [x] Kimlik doğrulama ve kayıt
- [x] Dashboard istatistikleri
- [x] Duvar bölgesi CRUD
- [x] Tırmanış oturumu CRUD
- [x] Rota kurulum CRUD
- [x] Rota rotasyon CRUD
- [x] Ekipman envanteri CRUD
- [x] Fiyat kademesi CRUD
- [x] Demo hesap ve seed verisi
- [x] CI/CD pipeline
- [ ] Railway + Vercel production deployment

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@verticalpeakclimbing.com |
| Şifre | demo123456 |

## Başarı Metrikleri

- Rota rotasyon uyum oranı
- Duvar bölgesi kullanım oranı
- Ekipman kiralama stok doğruluğu
- Günlük oturum gelir kayıt tutarlılığı

## Teknik Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- Backend: NestJS, Prisma, PostgreSQL
- Deploy: Railway (backend), Vercel (frontend)
- API prefix: `/api`
- Health: `GET /api/health`
