'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mountain,
  DollarSign,
  Route,
  RotateCw,
  Package,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel' },
  { href: '/wall-zones', label: 'Duvar Bölgeleri' },
  { href: '/climb-sessions', label: 'Oturumlar' },
  { href: '/route-settings', label: 'Rota Kurulum' },
  { href: '/route-rotations', label: 'Rotasyon' },
  { href: '/gear-inventory', label: 'Ekipman' },
  { href: '/rate-tiers', label: 'Fiyatlar' },
  { href: '/settings', label: 'Ayarlar' },
];

interface ZoneStatusCounts {
  totalWallZones: number;
  availableZones: number;
  unavailableZones: number;
}

export function TopTabNav() {
  const pathname = usePathname();
  const { climbingGym, user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [zoneCounts, setZoneCounts] = useState<ZoneStatusCounts | null>(null);

  useEffect(() => {
    if (!token) return;
    api.dashboard
      .stats(token)
      .then((data) => {
        const stats = data as ZoneStatusCounts;
        setZoneCounts(stats);
      })
      .catch(() => setZoneCounts(null));
  }, [token, pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          aria-label="ClimbPulse ana sayfa"
        >
          <Mountain className="h-6 w-6 text-accent" strokeWidth={2} aria-hidden />
          <span className="font-display text-lg font-bold text-primary">ClimbPulse</span>
        </Link>

        {zoneCounts && (
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground"
            role="status"
            aria-label="Duvar bölgesi durum özeti"
          >
            <span>
              <span className="font-semibold text-foreground">{zoneCounts.totalWallZones}</span> bölge
            </span>
            <span className="text-success">
              <span className="font-semibold">{zoneCounts.availableZones}</span> müsait
            </span>
            <span className="text-accent">
              <span className="font-semibold">{zoneCounts.unavailableZones}</span> aktif
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {climbingGym && (
            <span className="hidden text-xs text-muted-foreground sm:inline">{climbingGym.name}</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-9 w-9 hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          {user && (
            <span className="hidden rounded bg-secondary px-2 py-1 font-mono text-xs sm:inline">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <nav
        className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6"
        aria-label="Ana menü"
      >
        <ul className="flex min-w-max gap-1 pb-0">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex items-center border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export const navIcons = {
  dashboard: LayoutDashboard,
  wallZones: Mountain,
  climbSessions: DollarSign,
  routeSettings: Route,
  routeRotations: RotateCw,
  gearInventory: Package,
  rateTiers: Tags,
  settings: Settings,
};
