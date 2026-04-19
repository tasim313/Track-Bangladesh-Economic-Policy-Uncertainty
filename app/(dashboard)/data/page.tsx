import { Card } from '@/components/ui/card'

export default function DataPage() {
  return (
    <Card className="border-border/70 bg-card/90 p-8 shadow-lg shadow-slate-950/5">
      <h2 className="text-2xl font-semibold tracking-tight">Data Explorer scaffold</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        This route is ready for a unified searchable table with source labels, E/P/U match scoring, and CSV or JSON academic exports.
      </p>
    </Card>
  )
}
