'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, Database, LineChart, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { IngestionPanel } from '@/components/dashboard/ingestion-panel'
import { SourceOverlayChart } from '@/components/dashboard/source-overlay-chart'
import { fetchAnalyticsSummary, fetchCrawlJobs, fetchMonthlyOverlay } from '@/lib/backend-data'

export default function DashboardPage() {
  const [chartData, setChartData] = useState<Array<{ period: string; epuIndex: number; prothomAlo: number; dailyStar: number; userLinks: number }>>([])
  const [articleCount, setArticleCount] = useState(0)
  const [activeCrawlers, setActiveCrawlers] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        setError(null)
        const [overlay, summary, jobs] = await Promise.all([
          fetchMonthlyOverlay(),
          fetchAnalyticsSummary(),
          fetchCrawlJobs(),
        ])

        if (!mounted) return

        setChartData(overlay)
        setArticleCount(summary.articles?.total_articles ?? 0)
        setActiveCrawlers(jobs.filter((job) => job.status === 'running').length)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const metricCards = useMemo(() => {
    const latest = chartData[chartData.length - 1]
    const previous = chartData[Math.max(chartData.length - 2, 0)]
    const change = previous?.epuIndex ? ((latest?.epuIndex ?? 0) - previous.epuIndex) / previous.epuIndex * 100 : 0

    return [
      {
        title: "Today's EPU score",
        value: latest ? latest.epuIndex.toFixed(2) : '0.00',
        detail: `${change >= 0 ? '+' : ''}${change.toFixed(2)}% vs previous period`,
        icon: Sparkles,
        accent: '#a855f7',
      },
      {
        title: 'Articles processed',
        value: articleCount.toLocaleString(),
        detail: 'Across system and custom sources',
        icon: Database,
        accent: '#3b82f6',
      },
      {
        title: 'Active crawlers',
        value: activeCrawlers.toString(),
        detail: 'Live workers connected to Channels',
        icon: Activity,
        accent: '#22c55e',
      },
    ]
  }, [activeCrawlers, articleCount, chartData])

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </Card>
      )}

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
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading chart data...</p>
        ) : (
          <SourceOverlayChart data={chartData} />
        )}
      </Card>
    </div>
  )
}
