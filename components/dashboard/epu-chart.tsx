'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EPUDataPoint } from '@/lib/types'

interface EPUChartProps {
  data: EPUDataPoint[]
}

export function EPUChart({ data }: EPUChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94a3b8' }}
            domain={[0, 100]}
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
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="index"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="EPU Index"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="economic"
            stroke="#10b981"
            strokeWidth={1.5}
            dot={false}
            name="Economic"
            isAnimationActive={false}
            opacity={0.7}
          />
          <Line
            type="monotone"
            dataKey="political"
            stroke="#f59e0b"
            strokeWidth={1.5}
            dot={false}
            name="Political"
            isAnimationActive={false}
            opacity={0.7}
          />
          <Line
            type="monotone"
            dataKey="uncertainty"
            stroke="#ef4444"
            strokeWidth={1.5}
            dot={false}
            name="Uncertainty"
            isAnimationActive={false}
            opacity={0.7}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
