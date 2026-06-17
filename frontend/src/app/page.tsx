import Link from 'next/link';
import { Mountain, DollarSign, Route, RotateCw, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Mountain,
    title: 'Duvar Bölgesi Yönetimi',
    description: 'Boulder, top rope ve lead duvar bölgelerinizi salon bölümü bazında takip edin.',
  },
  {
    icon: DollarSign,
    title: 'Tırmanış Oturum Geliri',
    description: 'Günlük giriş, koçluk geliri ve oturum kayıtlarını tek panelden izleyin.',
  },
  {
    icon: Route,
    title: 'Rota Kurulum Takibi',
    description: 'Yeni rota kurulumları, derece ve renk atamalarını kayıt altına alın.',
  },
  {
    icon: RotateCw,
    title: 'Rota Rotasyon Planı',
    description: 'Duvar reset, tutamak kontrolü ve rotasyon programını planlayın.',
  },
  {
    icon: Package,
    title: 'Ekipman Envanteri',
    description: 'Kiralık emniyet kemeri, halat ve ayakkabı stoklarını yönetin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-primary-foreground">
              <Mountain className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="font-display text-2xl font-bold text-primary">ClimbPulse</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild className="grit-btn">
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-sandstone/10 via-background to-accent/5">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Kapalı Alan Tırmanış Salonu Yönetimi
            </p>
            <h1 className="font-display max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              Duvar bölgelerinizi, rotalarınızı ve gelirinizi tek platformda yönetin
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Bağımsız tırmanış salonları için duvar bölgesi envanteri, rota kurulum takibi,
              rotasyon planı, ekipman envanteri ve fiyat kademesi yönetimi.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="grit-btn">
                <Link href="/register">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Demo Hesabıyla Giriş</Link>
              </Button>
            </div>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Demo: demo@verticalpeakclimbing.com / demo123456
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display mb-8 text-2xl font-semibold">Özellikler</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="grit-card p-6">
                  <Icon className="mb-4 h-6 w-6 text-accent" strokeWidth={1.5} />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
