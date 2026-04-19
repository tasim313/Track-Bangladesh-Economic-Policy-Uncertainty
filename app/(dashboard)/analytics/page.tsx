'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TrendChart } from '@/components/analytics/trend-chart'
import { ComparisonChart } from '@/components/analytics/comparison-chart'
import { StatisticsPanel } from '@/components/analytics/statistics-panel'
import { generateMockEPUData } from '@/lib/mock-data'
import { Download, TrendingUp } from 'lucide-react'

export default function AnalyticsPage() {
  const epuData = useMemo(() => generateMockEPUData(), [])

  // Calculate statistics
  const stats = useMemo(() => {
    const indices = epuData.map((d) => d.index)
    const avg = indices.reduce((a, b) => a + b, 0) / indices.length
    const max = Math.max(...indices)
    const min = Math.min(...indices)
    const latest = indices[indices.length - 1]
    const change = ((latest - indices[indices.length - 2]) / indices[indices.length - 2]) * 100

    return { avg, max, min, latest, change }
  }, [epuData])

  const categoryStats = useMemo(() => {
    const eValues = epuData.map((d) => d.economic)
    const pValues = epuData.map((d) => d.political)
    const uValues = epuData.map((d) => d.uncertainty)

    return {
      economic: {
        avg: (eValues.reduce((a, b) => a + b, 0) / eValues.length).toFixed(2),
        max: Math.max(...eValues).toFixed(2),
      },
      political: {
        avg: (pValues.reduce((a, b) => a + b, 0) / pValues.length).toFixed(2),
        max: Math.max(...pValues).toFixed(2),
      },
      uncertainty: {
        avg: (uValues.reduce((a, b) => a + b, 0) / uValues.length).toFixed(2),
        max: Math.max(...uValues).toFixed(2),
      },
    }
  }, [epuData])

  return (
    <div className="space-y-8 p-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">30-day economic policy uncertainty analysis</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Current Index</p>
          <p className="text-3xl font-bold text-foreground">{stats.latest.toFixed(2)}</p>
          <p className="text-xs text-emerald-400 mt-2">
            {stats.change > 0 ? '+' : ''}{stats.change.toFixed(2)}% from yesterday
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Average (30d)</p>
          <p className="text-3xl font-bold text-foreground">{stats.avg.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Mean EPU index</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Peak (30d)</p>
          <p className="text-3xl font-bold text-orange-400">{stats.max.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Highest recorded</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Low (30d)</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.min.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Lowest recorded</p>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card className="bg-card border-border p-6 h-[400px]">
        <h3 className="text-lg font-semibold text-foreground mb-4">EPU Index Trend</h3>
        <TrendChart data={epuData} />
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Chart */}
        <Card className="bg-card border-border p-6 h-[350px]">
          <h3 className="text-lg font-semibold text-foreground mb-4">Category Comparison</h3>
          <ComparisonChart data={epuData} />
        </Card>

        {/* Category Statistics */}
        <StatisticsPanel stats={categoryStats} />
      </div>

      {/* Volatility & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-500/10 border border-emerald-500/20 p-6">
          <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Economic Indicators
          </h4>
          <div className="space-y-2 text-sm text-emerald-200">
            <p><span className="font-semibold">Average:</span> {categoryStats.economic.avg}</p>
            <p><span className="font-semibold">Peak:</span> {categoryStats.economic.max}</p>
            <p className="text-xs pt-2 border-t border-emerald-500/20">
              Based on economic policy keywords and indicators
            </p>
          </div>
        </Card>

        <Card className="bg-orange-500/10 border border-orange-500/20 p-6">
          <h4 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Political Indicators
          </h4>
          <div className="space-y-2 text-sm text-orange-200">
            <p><span className="font-semibold">Average:</span> {categoryStats.political.avg}</p>
            <p><span className="font-semibold">Peak:</span> {categoryStats.political.max}</p>
            <p className="text-xs pt-2 border-t border-orange-500/20">
              Based on political keywords and developments
            </p>
          </div>
        </Card>

        <Card className="bg-red-500/10 border border-red-500/20 p-6">
          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Uncertainty Indicators
          </h4>
          <div className="space-y-2 text-sm text-red-200">
            <p><span className="font-semibold">Average:</span> {categoryStats.uncertainty.avg}</p>
            <p><span className="font-semibold">Peak:</span> {categoryStats.uncertainty.max}</p>
            <p className="text-xs pt-2 border-t border-red-500/20">
              Based on general uncertainty indicators
            </p>
          </div>
        </Card>
      </div>

      {/* Time Period Analysis */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Period Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { period: 'Last 7 Days', change: '+5.2', trend: 'up' },
            { period: 'Last 14 Days', change: '-2.1', trend: 'down' },
            { period: 'Last 30 Days', change: '+3.8', trend: 'up' },
          ].map((item) => (
            <div key={item.period} className="flex items-start justify-between p-4 rounded-lg bg-card/50 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{item.period}</p>
                <p className={`text-2xl font-bold mt-2 ${
                  item.trend === 'up' ? 'text-orange-400' : 'text-emerald-400'
                }`}>
                  {item.change}%
                </p>
              </div>
              <div className={`text-4xl opacity-20 ${
                item.trend === 'up' ? 'text-orange-400' : 'text-emerald-400'
              }`}>
                {item.trend === 'up' ? '📈' : '📉'}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
