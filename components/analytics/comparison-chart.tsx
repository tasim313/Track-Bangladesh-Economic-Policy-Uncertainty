'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EPUDataPoint } from '@/lib/types'

interface ComparisonChartProps {
  data: EPUDataPoint[]
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  // Aggregate data by week for better comparison
  const weeklyData = []
  for (let i = 0; i < data.length; i += 7) {
    const week = data.slice(i, Math.min(i + 7, data.length))
    if (week.length > 0) {
      weeklyData.push({
        week: `W${Math.floor(i / 7) + 1}`,
        economic: (week.reduce((sum, d) => sum + d.economic, 0) / week.length).toFixed(1),
        political: (week.reduce((sum, d) => sum + d.political, 0) / week.length).toFixed(1),
        uncertainty: (week.reduce((sum, d) => sum + d.uncertainty, 0) / week.length).toFixed(1),
      })
    }
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={weeklyData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="week"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#f1f5f9' }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="economic" fill="#10b981" name="Economic" />
          <Bar dataKey="political" fill="#f59e0b" name="Political" />
          <Bar dataKey="uncertainty" fill="#ef4444" name="Uncertainty" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
