'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface ClimbingGymProfile {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalWallZones: number;
  timezone: string;
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [gym, setGym] = useState<ClimbingGymProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.climbingGym
      .get(token)
      .then((data) => setGym(data as ClimbingGymProfile))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !gym) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.climbingGym.update(token, gym as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">Tesis Ayarları</h1>
          <p className="text-muted-foreground">Tırmanış salonu profil bilgileri</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && !gym && <ErrorState onRetry={load} />}
        {gym && !loading && (
          <Card className="grit-card">
            <CardHeader>
              <CardTitle className="font-display">Salon Profili</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="rounded border border-success bg-success/10 p-3 text-sm text-success" role="status">
                    Ayarlar kaydedildi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Salon Adı</Label>
                  <Input
                    id="name"
                    value={gym.name}
                    onChange={(e) => setGym({ ...gym, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={gym.phone || ''}
                    onChange={(e) => setGym({ ...gym, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={gym.address || ''}
                    onChange={(e) => setGym({ ...gym, address: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                      id="city"
                      value={gym.city || ''}
                      onChange={(e) => setGym({ ...gym, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">İl</Label>
                    <Input
                      id="state"
                      value={gym.state || ''}
                      onChange={(e) => setGym({ ...gym, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Posta Kodu</Label>
                    <Input
                      id="zipCode"
                      value={gym.zipCode || ''}
                      onChange={(e) => setGym({ ...gym, zipCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalWallZones">Toplam Duvar Bölgesi</Label>
                  <Input
                    id="totalWallZones"
                    type="number"
                    value={gym.totalWallZones}
                    onChange={(e) =>
                      setGym({ ...gym, totalWallZones: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
                <Button type="submit" disabled={saving} className="grit-btn">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
