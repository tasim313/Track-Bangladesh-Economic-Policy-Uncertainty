import { Activity, Database, LineChart, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { IngestionPanel } from '@/components/dashboard/ingestion-panel'
import { SourceOverlayChart } from '@/components/dashboard/source-overlay-chart'

const chartData = [
  { period: 'Jan', epuIndex: 62, prothomAlo: 58, dailyStar: 47, userLinks: 14 },
  { period: 'Feb', epuIndex: 67, prothomAlo: 61, dailyStar: 52, userLinks: 18 },
  { period: 'Mar', epuIndex: 73, prothomAlo: 66, dailyStar: 57, userLinks: 22 },
  { period: 'Apr', epuIndex: 70, prothomAlo: 64, dailyStar: 60, userLinks: 19 },
  { period: 'May', epuIndex: 78, prothomAlo: 72, dailyStar: 65, userLinks: 27 },
  { period: 'Jun', epuIndex: 83, prothomAlo: 76, dailyStar: 71, userLinks: 31 },
]

const metricCards = [
  {
    title: "Today's EPU score",
    value: '83.2',
    detail: '+6.4% vs yesterday',
    icon: Sparkles,
    accent: '#a855f7',
  },
  {
    title: 'Articles processed',
    value: '1,284',
    detail: 'Across system and custom sources',
    icon: Database,
    accent: '#3b82f6',
  },
  {
    title: 'Active crawlers',
    value: '7',
    detail: 'Live workers connected to Channels',
    icon: Activity,
    accent: '#22c55e',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-3">
        {metricCards.map((metric) => (
          <Card key={metric.title} className="overflow-hidden border-border/70 bg-card/90 p-5 shadow-lg shadow-slate-950/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">{metric.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{metric.detail}</p>
              </div>
              <div
                className="flex size-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${metric.accent}18`, color: metric.accent }}
              >
                <metric.icon className="size-5" />
              </div>
            </div>
          </Card>
        ))}
      </section>

      <IngestionPanel />

      <Card className="border-border/70 bg-card/90 p-6 shadow-lg shadow-slate-950/5">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <LineChart className="size-3.5" />
              Index Overlay
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Multi-source EPU time series</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare overall EPU movement against Prothom Alo, Daily Star, and user-supplied evidence streams.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Recharts interactive overlay
          </div>
        </div>
        <SourceOverlayChart data={chartData} />
      </Card>
    </div>
  )
}
