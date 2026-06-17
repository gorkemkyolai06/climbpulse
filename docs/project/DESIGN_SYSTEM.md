# ClimbPulse Tasarım Sistemi

## Tasarım Yönü: Vertical Grit

Indoor tırmanış salonu atölye estetiği — kumtaşı zeminler, arduvaz metin, tebeşir beyazı arka plan, mercan aksiyon vurguları. Üst yapışkan durum çubuğu + yatay sekme navigasyon.

## Renk Paleti

| Token | Light | Dark | Kullanım |
|-------|-------|------|----------|
| sandstone | #C4956A | #A67C52 | Birincil vurgu, başlık alt çizgileri |
| slate | #2D3748 | #1A202C | Metin, navigasyon arka planı |
| chalk | #F7FAFC | #EDF2F7 | Sayfa arka planı |
| coral | #E53E3E | #FC8181 | Aksiyon, sol kenarlık, acil durum |
| moss | #38A169 | #48BB78 | Başarı, açık durum |

## Tipografi

- **Başlıklar:** Space Grotesk (600, 700)
- **Veri/Monospace:** JetBrains Mono (400, 500)
- **Gövde:** Space Grotesk (400, 500)

## Spacing Scale

4px taban: 4, 8, 12, 16, 24, 32, 48, 64

## Border Radius

- Kartlar: 4px
- Butonlar: 6px
- Input: 4px
- Badge: 9999px (pill)

## Bileşen Dili

- **Grit Card:** 4px mercan sol border, minimal gölge, 16px padding
- **Status Bar:** Sticky top, zone count pills, moss/coral durum renkleri
- **Tab Nav:** Yatay scroll, aktif sekme alt mercan çizgisi
- **Stat Card:** JetBrains Mono sayılar, sandstone etiket

## Sayfa Kompozisyonu

1. Sticky status bar (zone counts)
2. Horizontal tab navigation
3. Page header (title + action button)
4. Content grid (2-col desktop, 1-col mobile)

## Erişilebilirlik

- WCAG AA kontrast oranları
- Focus ring: 2px coral outline
- Tüm interaktif öğelerde aria-label

## Dark Mode

`climbpulse_theme` localStorage key — slate arka plan, chalk metin, adjusted coral/moss tonları.
