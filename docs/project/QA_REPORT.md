# ClimbPulse QA Raporu

**Tarih:** 2026-06-17  
**Repo:** https://github.com/gorkemkyolai06/climbpulse

## Yerel Doğrulama

| Test | Durum |
|------|-------|
| Backend build | ✅ Geçti |
| Backend unit tests (dashboard) | ✅ Geçti |
| Frontend production build | ✅ Geçti (14 sayfa) |
| Integration tests (18 senaryo) | ⏳ CI'da çalışacak |

## Entegrasyon Test Senaryoları

1. Health Check (200)
2. Login (200)
3. Dashboard Stats (200)
4. List Wall Zones (200)
5. List Climb Sessions (200)
6. List Route Settings (200)
7. List Route Rotations (200)
8. List Gear Inventory (200)
9. List Rate Tiers (200)
10. Climbing Gym Profile (200)
11. Urgent Route Settings (200)
12. Available Gear (200)
13. Create Wall Zone (201)
14. Update Wall Zone (200)
15. Delete Wall Zone (200)
16. Create Gear Item (201)
17. Update Gear Item (200)
18. Delete Gear Item (200)
19. Unauthorized Access (401)

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@verticalpeakclimbing.com |
| Şifre | demo123456 |

## Production Doğrulama

| Test | Durum |
|------|-------|
| Railway health endpoint | ⏳ Deploy bekliyor |
| Vercel frontend | ⏳ Deploy bekliyor |
| Demo login (production) | ⏳ Deploy bekliyor |
