'use client';

import { useEffect, useState } from 'react';
import { Mountain, DollarSign, Route, RotateCw, TrendingUp, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { StatCard } from '@/components/stat-card';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
  formatSessionStatus,
  formatRouteSettingStatus,
  formatRouteSettingPriority,
  formatWallZoneType,
} from '@/lib/utils';

interface DashboardStats {
  totalWallZones: number;
  availableZones: number;
  unavailableZones: number;
  zoneUtilizationRate: number;
  openRouteSettings: number;
  urgentRouteSettings: number;
  pendingRouteRotations: number;
  dailyRevenue: number;
  recentSessions: Array<{
    id: string;
    cashAmount: number;
    cardAmount: number;
    coachingRevenue: number;
    sessionAt: string;
    status: string;
    wallZone?: { name: string; section: string; zoneType: string };
  }>;
  recentRouteSettings: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    reportedAt: string;
    wallZone?: { name: string; section: string };
  }>;
  zones: Array<{ section: string; zoneCount: number }>;
  monthlyTrend: Array<{ month: string; sessions: number; revenue: number }>;
}

function formatTrendMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(date);
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Operasyon Paneli</h1>
          <p className="text-muted-foreground">Duvar bölgesi kullanımı ve günlük gelir özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Bölge Kullanımı"
                value={formatPercent(stats.zoneUtilizationRate)}
                description={`${stats.availableZones}/${stats.totalWallZones} bölge müsait`}
                icon={<Mountain className="h-4 w-4" />}
              />
              <StatCard
                title="Günlük Gelir"
                value={formatCurrency(stats.dailyRevenue)}
                description={`${stats.unavailableZones} bölge aktif tırmanışta`}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <StatCard
                title="Açık Rota Kurulum"
                value={stats.openRouteSettings}
                description={`${stats.urgentRouteSettings} acil/yüksek öncelik`}
                icon={<Route className="h-4 w-4" />}
              />
              <StatCard
                title="Rotasyon Planı"
                value={stats.pendingRouteRotations}
                description="7 gün içinde planlanan"
                icon={<RotateCw className="h-4 w-4" />}
              />
            </div>

            <Card className="grit-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <DollarSign className="h-4 w-4 text-accent" />
                  Son Tırmanış Oturumları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz oturum kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded bg-muted/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{session.wallZone?.name || '—'}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.wallZone?.section} · {formatWallZoneType(session.wallZone?.zoneType || '')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold">
                            {formatCurrency(session.cashAmount + session.cardAmount + session.coachingRevenue)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(session.sessionAt)}</p>
                        </div>
                        <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="grit-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Açık Rota Kurulum Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentRouteSettings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Açık rota kurulum kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentRouteSettings.map((setting) => (
                      <div key={setting.id} className="rounded bg-muted/40 px-4 py-3">
                        <p className="font-semibold">{setting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {setting.wallZone?.name} · {formatRouteSettingPriority(setting.priority)} ·{' '}
                          {formatRouteSettingStatus(setting.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="grit-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Aylık Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.monthlyTrend.map((row) => (
                    <div key={row.month} className="flex justify-between text-sm">
                      <span>{formatTrendMonth(row.month)}</span>
                      <span className="font-mono font-semibold">{formatCurrency(row.revenue)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="grit-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Mountain className="h-4 w-4 text-accent" />
                    Bölge Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.zones.map((z) => (
                    <div key={z.section} className="flex justify-between text-sm">
                      <span>{z.section}</span>
                      <Badge variant="secondary">{z.zoneCount} bölge</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
