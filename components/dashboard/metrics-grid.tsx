'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricProps {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  color?: 'blue' | 'emerald' | 'purple' | 'orange'
}

interface MetricsGridProps {
  metrics: MetricProps[]
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
  },
}

function MetricCard({ label, value, change, icon, color = 'blue' }: MetricProps) {
  const colors = colorClasses[color]
  const isPositive = change && change > 0

  return (
    <Card className={`${colors.bg} border ${colors.border} p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                  {Math.abs(change).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg} ${colors.border} border`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          color={metric.color}
        />
      ))}
    </div>
  )
}
