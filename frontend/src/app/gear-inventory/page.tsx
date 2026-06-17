'use client';

import { useEffect, useState } from 'react';
import { Plus, Package } from 'lucide-react';
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
  formatGearCategory,
  formatGearCondition,
  formatGearStatus,
} from '@/lib/utils';

interface GearItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  status: string;
}

interface ListResponse {
  data: GearItem[];
  total: number;
}

const CATEGORIES = ['harness', 'rope', 'shoes', 'chalk_bag', 'crash_pad', 'belay_device', 'other'];
const CONDITIONS = ['new', 'good', 'fair', 'retired'];
const STATUSES = ['available', 'rented', 'maintenance'];

const emptyForm = {
  name: '',
  category: 'harness',
  quantity: '1',
  condition: 'good',
  status: 'available',
};

export default function GearInventoryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.gearInventory
      .list(token)
      .then((res) => setItems((res as ListResponse).data))
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
      await api.gearInventory.create(token, {
        name: form.name,
        category: form.category,
        quantity: parseInt(form.quantity, 10),
        condition: form.condition,
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
            <h1 className="font-display text-3xl font-semibold text-primary">Ekipman Envanteri</h1>
            <p className="text-muted-foreground">Kiralık ekipman, halat ve güvenlik malzemeleri</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="grit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Ekipman'}
          </Button>
        </div>

        {showForm && (
          <Card className="grit-card">
            <CardHeader>
              <CardTitle className="font-display">Ekipman Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Ekipman Adı</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
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
                      <option key={c} value={c}>{formatGearCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Adet</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={0}
                    value={form.quantity}
                    onChange={(e) => update('quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Durum (Fiziksel)</Label>
                  <select
                    id="condition"
                    value={form.condition}
                    onChange={(e) => update('condition', e.target.value)}
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{formatGearCondition(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum (Kullanım)</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded border border-input bg-background px-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatGearStatus(s)}</option>
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
        {error && !loading && items.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="Ekipman bulunamadı"
            description="Henüz ekipman envanter kaydı yok."
            action={
              <Button onClick={() => setShowForm(true)} className="grit-btn">
                <Plus className="mr-2 h-4 w-4" />
                Ekipman Ekle
              </Button>
            }
          />
        )}
        {!loading && items.length > 0 && (
          <Card className="grit-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3" scope="col">Ekipman</th>
                      <th className="p-3" scope="col">Kategori</th>
                      <th className="p-3" scope="col">Adet</th>
                      <th className="p-3" scope="col">Fiziksel</th>
                      <th className="p-3" scope="col">Kullanım</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-accent" />
                            {item.name}
                          </span>
                        </td>
                        <td className="p-3">{formatGearCategory(item.category)}</td>
                        <td className="p-3 font-mono">{item.quantity}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatGearCondition(item.condition)}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatGearStatus(item.status)}</Badge>
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
