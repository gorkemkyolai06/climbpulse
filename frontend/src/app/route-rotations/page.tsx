'use client';

import { useEffect, useState } from 'react';
import { Plus, RotateCw } from 'lucide-react';
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
  formatRotationStatus,
  formatRotationCategory,
} from '@/lib/utils';

interface RouteRotation {
  id: string;
  title: string;
  category: string;
  section?: string;
  scheduledAt: string;
  status: string;
}

interface ListResponse {
  data: RouteRotation[];
  total: number;
}

const CATEGORIES = [
  'full_reset',
  'partial_reset',
  'hold_inspection',
  'wall_cleaning',
  'anchor_check',
  'other',
];
const STATUSES = ['scheduled', 'in_progress', 'completed', 'overdue'];

const emptyForm = {
  title: '',
  category: 'full_reset',
  section: '',
  scheduledAt: new Date().toISOString().slice(0, 16),
  status: 'scheduled',
};

export default function RouteRotationsPage() {
  const { token } = useAuth();
  const [rotations, setRotations] = useState<RouteRotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.routeRotations
      .list(token)
      .then((res) => setRotations((res as ListResponse).data))
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
      await api.routeRotations.create(token, {
        title: form.title,
        category: form.category,
        section: form.section || undefined,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
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
            <h1 className="font-display text-3xl font-semibold text-primary">Rota Rotasyon Planları</h1>
            <p className="text-muted-foreground">Duvar reset ve rota değişim programı</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="grit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Plan'}
          </Button>
        </div>

        {showForm && (
          <Card className="grit-card">
            <CardHeader>
              <CardTitle className="font-display">Rotasyon Planı Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatRotationCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Salon Bölümü</Label>
                  <Input
                    id="section"
                    value={form.section}
                    onChange={(e) => update('section', e.target.value)}
                    placeholder="Örn: Boulder Salonu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Planlanan Tarih</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => update('scheduledAt', e.target.value)}
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
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatRotationStatus(s)}</option>
                    ))}
                  </select>
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
        {error && !loading && rotations.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && rotations.length === 0 && (
          <EmptyState
            title="Rotasyon planı bulunamadı"
            description="Henüz rota rotasyon planı yok."
            action={
              <Button onClick={() => setShowForm(true)} className="grit-btn">
                <Plus className="mr-2 h-4 w-4" />
                Plan Ekle
              </Button>
            }
          />
        )}
        {!loading && rotations.length > 0 && (
          <Card className="grit-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3" scope="col">Başlık</th>
                      <th className="p-3" scope="col">Kategori</th>
                      <th className="p-3" scope="col">Bölüm</th>
                      <th className="p-3" scope="col">Planlanan</th>
                      <th className="p-3" scope="col">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rotations.map((rotation) => (
                      <tr key={rotation.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <RotateCw className="h-4 w-4 text-accent" />
                            {rotation.title}
                          </span>
                        </td>
                        <td className="p-3">{formatRotationCategory(rotation.category)}</td>
                        <td className="p-3 text-muted-foreground">{rotation.section || '—'}</td>
                        <td className="p-3">{formatDateTime(rotation.scheduledAt)}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatRotationStatus(rotation.status)}</Badge>
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
