'use client'

import { Card } from '@/components/ui/card'

interface CategoryStat {
  avg: string
  max: string
}

interface StatisticsPanelProps {
  stats: {
    economic: CategoryStat
    political: CategoryStat
    uncertainty: CategoryStat
  }
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Category Statistics</h3>

      <div className="space-y-6">
        {/* Economic */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              Economic
            </h4>
            <span className="text-xs text-muted-foreground">E Score</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Average</p>
              <p className="text-lg font-bold text-emerald-400">{stats.economic.avg}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Peak</p>
              <p className="text-lg font-bold text-emerald-400">{stats.economic.max}</p>
            </div>
          </div>
        </div>

        {/* Political */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              Political
            </h4>
            <span className="text-xs text-muted-foreground">P Score</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Average</p>
              <p className="text-lg font-bold text-orange-400">{stats.political.avg}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Peak</p>
              <p className="text-lg font-bold text-orange-400">{stats.political.max}</p>
            </div>
          </div>
        </div>

        {/* Uncertainty */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Uncertainty
            </h4>
            <span className="text-xs text-muted-foreground">U Score</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Average</p>
              <p className="text-lg font-bold text-red-400">{stats.uncertainty.avg}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Peak</p>
              <p className="text-lg font-bold text-red-400">{stats.uncertainty.max}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
