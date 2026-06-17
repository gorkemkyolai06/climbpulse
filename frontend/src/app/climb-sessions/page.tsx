'use client';

import { useEffect, useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
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
  formatCurrency,
  formatDateTime,
  formatSessionStatus,
  formatWallZoneType,
} from '@/lib/utils';

interface WallZoneOption {
  id: string;
  name: string;
  section: string;
}

interface ClimbSession {
  id: string;
  cashAmount: number;
  cardAmount: number;
  coachingRevenue: number;
  climbsLogged: number;
  sessionAt: string;
  status: string;
  wallZone?: { id: string; name: string; section: string; zoneType: string };
}

interface ListResponse {
  data: ClimbSession[];
  total: number;
}

const SESSION_STATUSES = ['recorded', 'verified', 'disputed'];

const emptyForm = {
  wallZoneId: '',
  cashAmount: '0',
  cardAmount: '0',
  coachingRevenue: '0',
  climbsLogged: '0',
  sessionAt: new Date().toISOString().slice(0, 16),
  status: 'recorded',
};

export default function ClimbSessionsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<ClimbSession[]>([]);
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
    Promise.all([api.climbSessions.list(token), api.wallZones.list(token)])
      .then(([sessionsRes, zonesRes]) => {
        setSessions((sessionsRes as ListResponse).data);
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
      await api.climbSessions.create(token, {
        wallZoneId: form.wallZoneId,
        cashAmount: parseFloat(form.cashAmount),
        cardAmount: parseFloat(form.cardAmount),
        coachingRevenue: parseFloat(form.coachingRevenue),
        climbsLogged: parseInt(form.climbsLogged, 10),
        sessionAt: new Date(form.sessionAt).toISOString(),
        status: form.status,
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
            <h1 className="font-display text-3xl font-semibold text-primary">Tırmanış Oturumları</h1>
            <p className="text-muted-foreground">Bölge bazında oturum geliri ve tırmanış kayıtları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="grit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Oturum'}
          </Button>
        </div>

        {showForm && (
          <Card className="grit-card">
            <CardHeader>
              <CardTitle className="font-display">Oturum Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
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
                  <Label htmlFor="cashAmount">Nakit ($)</Label>
                  <Input
                    id="cashAmount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.cashAmount}
                    onChange={(e) => update('cashAmount', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardAmount">Kart ($)</Label>
                  <Input
                    id="cardAmount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.cardAmount}
                    onChange={(e) => update('cardAmount', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coachingRevenue">Koçluk Geliri ($)</Label>
                  <Input
                    id="coachingRevenue"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.coachingRevenue}
                    onChange={(e) => update('coachingRevenue', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="climbsLogged">Tırmanış Sayısı</Label>
                  <Input
                    id="climbsLogged"
                    type="number"
                    min={0}
                    value={form.climbsLogged}
                    onChange={(e) => update('climbsLogged', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionAt">Oturum Tarihi</Label>
                  <Input
                    id="sessionAt"
                    type="datetime-local"
                    value={form.sessionAt}
                    onChange={(e) => update('sessionAt', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    {SESSION_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatSessionStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end sm:col-span-2 lg:col-span-3">
                  <Button type="submit" disabled={submitting} className="grit-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && sessions.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && sessions.length === 0 && (
          <EmptyState
            title="Oturum bulunamadı"
            description="Henüz tırmanış oturumu kaydı yok."
            action={
              <Button onClick={() => setShowForm(true)} className="grit-btn">
                <Plus className="mr-2 h-4 w-4" />
                Oturum Ekle
              </Button>
            }
          />
        )}
        {!loading && sessions.length > 0 && (
          <Card className="grit-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3" scope="col">Bölge</th>
                      <th className="p-3" scope="col">Nakit</th>
                      <th className="p-3" scope="col">Kart</th>
                      <th className="p-3" scope="col">Toplam</th>
                      <th className="p-3" scope="col">Tırmanış</th>
                      <th className="p-3" scope="col">Tarih</th>
                      <th className="p-3" scope="col">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-accent" />
                            {session.wallZone?.name}
                            <span className="text-muted-foreground">
                              ({session.wallZone?.section} ·{' '}
                              {formatWallZoneType(session.wallZone?.zoneType || '')})
                            </span>
                          </span>
                        </td>
                        <td className="p-3 font-mono">{formatCurrency(session.cashAmount)}</td>
                        <td className="p-3 font-mono">{formatCurrency(session.cardAmount)}</td>
                        <td className="p-3 font-mono font-bold">
                          {formatCurrency(
                            session.cashAmount + session.cardAmount + session.coachingRevenue,
                          )}
                        </td>
                        <td className="p-3 font-mono">{session.climbsLogged}</td>
                        <td className="p-3">{formatDateTime(session.sessionAt)}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
                        </td>
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
