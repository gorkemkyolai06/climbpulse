'use client';

import { useEffect, useState } from 'react';
import { Plus, Route } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatDateTime,
  formatRouteSettingStatus,
  formatRouteSettingPriority,
} from '@/lib/utils';

interface WallZoneOption {
  id: string;
  name: string;
  section: string;
}

interface RouteSetting {
  id: string;
  title: string;
  grade?: string;
  routeColor?: string;
  priority: string;
  status: string;
  reportedAt: string;
  wallZone?: { id: string; name: string; section: string };
}

interface ListResponse {
  data: RouteSetting[];
  total: number;
}

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

const emptyForm = {
  wallZoneId: '',
  title: '',
  grade: '',
  routeColor: '',
  priority: 'medium',
  status: 'open',
  reportedAt: new Date().toISOString().slice(0, 16),
};

export default function RouteSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<RouteSetting[]>([]);
  const [wallZones, setWallZones] = useState<WallZoneOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.routeSettings.list(token), api.wallZones.list(token)])
      .then(([settingsRes, zonesRes]) => {
        setSettings((settingsRes as ListResponse).data);
        setWallZones(
          ((zonesRes as { data: WallZoneOption[] }).data || []).map((z) => ({
            id: z.id,
            name: z.name,
            section: z.section,
          })),
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await api.routeSettings.create(token, {
        wallZoneId: form.wallZoneId,
        title: form.title,
        grade: form.grade || undefined,
        routeColor: form.routeColor || undefined,
        priority: form.priority,
        status: form.status,
        reportedAt: new Date(form.reportedAt).toISOString(),
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-primary">Rota Kurulum Kayıtları</h1>
            <p className="text-muted-foreground">Yeni rota kurulumları, derece ve renk takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="grit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kayıt'}
          </Button>
        </div>

        {showForm && (
          <Card className="grit-card">
            <CardHeader>
              <CardTitle className="font-display">Rota Kurulum Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="wallZoneId">Duvar Bölgesi</Label>
                  <select
                    id="wallZoneId"
                    value={form.wallZoneId}
                    onChange={(e) => update('wallZoneId', e.target.value)}
                    required
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Bölge seçin</option>
                    {wallZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} — {z.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Derece</Label>
                  <Input
                    id="grade"
                    value={form.grade}
                    onChange={(e) => update('grade', e.target.value)}
                    placeholder="V4, 5.10a"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routeColor">Rota Rengi</Label>
                  <Input
                    id="routeColor"
                    value={form.routeColor}
                    onChange={(e) => update('routeColor', e.target.value)}
                    placeholder="Kırmızı, mavi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Öncelik</Label>
                  <select
                    id="priority"
                    value={form.priority}
                    onChange={(e) => update('priority', e.target.value)}
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{formatRouteSettingPriority(p)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatRouteSettingStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="reportedAt">Kayıt Tarihi</Label>
                  <Input
                    id="reportedAt"
                    type="datetime-local"
                    value={form.reportedAt}
                    onChange={(e) => update('reportedAt', e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-end sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="grit-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && settings.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && settings.length === 0 && (
          <EmptyState
            title="Rota kurulum kaydı bulunamadı"
            description="Henüz rota kurulum kaydı yok."
            action={
              <Button onClick={() => setShowForm(true)} className="grit-btn">
                <Plus className="mr-2 h-4 w-4" />
                Kayıt Ekle
              </Button>
            }
          />
        )}
        {!loading && settings.length > 0 && (
          <Card className="grit-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3" scope="col">Başlık</th>
                      <th className="p-3" scope="col">Bölge</th>
                      <th className="p-3" scope="col">Derece</th>
                      <th className="p-3" scope="col">Renk</th>
                      <th className="p-3" scope="col">Öncelik</th>
                      <th className="p-3" scope="col">Durum</th>
                      <th className="p-3" scope="col">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.map((setting) => (
                      <tr key={setting.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-accent" />
                            {setting.title}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {setting.wallZone?.name} ({setting.wallZone?.section})
                        </td>
                        <td className="p-3 font-mono">{setting.grade || '—'}</td>
                        <td className="p-3">{setting.routeColor || '—'}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatRouteSettingPriority(setting.priority)}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatRouteSettingStatus(setting.status)}</Badge>
                        </td>
                        <td className="p-3">{formatDateTime(setting.reportedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
