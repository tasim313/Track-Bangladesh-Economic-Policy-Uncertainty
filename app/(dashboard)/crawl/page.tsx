import { Card } from '@/components/ui/card'

export default function CrawlPage() {
  return (
    <Card className="border-border/70 bg-card/90 p-8 shadow-lg shadow-slate-950/5">
      <h2 className="text-2xl font-semibold tracking-tight">Crawl Manager scaffold</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        This route is prepared for start, stop, pause controls, live WebSocket logs, discovery and extraction progress bars, and rerunnable job history.
      </p>
    </Card>
  )
}
