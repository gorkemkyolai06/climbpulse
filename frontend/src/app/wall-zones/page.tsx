'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Mountain } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatWallZoneStatus, formatWallZoneType } from '@/lib/utils';

interface WallZone {
  id: string;
  name: string;
  section: string;
  zoneType: string;
  maxCapacity: number;
  wallAngle?: string;
  status: string;
}

interface ListResponse {
  data: WallZone[];
  total: number;
}

const ZONE_TYPES = ['boulder', 'top_rope', 'lead', 'training', 'auto_belay'];
const STATUSES = ['available', 'in_use', 'reset_in_progress', 'closed'];

const emptyForm = {
  name: '',
  section: '',
  zoneType: 'boulder',
  maxCapacity: '8',
  wallAngle: '',
  status: 'available',
};

export default function WallZonesPage() {
  const { token } = useAuth();
  const [zones, setZones] = useState<WallZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.wallZones
      .list(token)
      .then((res) => setZones((res as ListResponse).data))
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
      await api.wallZones.create(token, {
        name: form.name,
        section: form.section,
        zoneType: form.zoneType,
        maxCapacity: parseInt(form.maxCapacity, 10),
        wallAngle: form.wallAngle || undefined,
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

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bu duvar bölgesini silmek istediğinize emin misiniz?')) return;
    try {
      await api.wallZones.delete(token, id);
      load();
    } catch {
      setError(true);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-primary">Duvar Bölgeleri</h1>
            <p className="text-muted-foreground">Boulder, top rope ve lead duvar bölgesi envanteri</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="grit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Bölge'}
          </Button>
        </div>

        {showForm && (
          <Card className="grit-card">
            <CardHeader>
              <CardTitle className="font-display">Duvar Bölgesi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Bölge Adı</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Salon Bölümü</Label>
                  <Input id="section" value={form.section} onChange={(e) => update('section', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneType">Duvar Tipi</Label>
                  <select
                    id="zoneType"
                    value={form.zoneType}
                    onChange={(e) => update('zoneType', e.target.value)}
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    {ZONE_TYPES.map((t) => (
                      <option key={t} value={t}>{formatWallZoneType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCapacity">Max Kapasite</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    min={1}
                    value={form.maxCapacity}
                    onChange={(e) => update('maxCapacity', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallAngle">Duvar Açısı</Label>
                  <Input
                    id="wallAngle"
                    value={form.wallAngle}
                    onChange={(e) => update('wallAngle', e.target.value)}
                    placeholder="Örn: 15°, slab, overhang"
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
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatWallZoneStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="grit-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && zones.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && zones.length === 0 && (
          <EmptyState
            title="Duvar bölgesi bulunamadı"
            description="Henüz duvar bölgesi eklenmemiş."
            action={
              <Button onClick={() => setShowForm(true)} className="grit-btn">
                <Plus className="mr-2 h-4 w-4" />
                Bölge Ekle
              </Button>
            }
          />
        )}
        {!loading && zones.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {zones.map((zone) => (
              <Card key={zone.id} className="grit-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-accent/10 text-accent">
                      <Mountain className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {zone.section} · {formatWallZoneType(zone.zoneType)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {zone.wallAngle || 'Açı belirtilmemiş'} · Kapasite: {zone.maxCapacity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{formatWallZoneStatus(zone.status)}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(zone.id)}
                      className="text-destructive"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
