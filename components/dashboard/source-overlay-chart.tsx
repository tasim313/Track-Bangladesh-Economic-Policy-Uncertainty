'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Point = {
  period: string
  epuIndex: number
  prothomAlo: number
  dailyStar: number
  userLinks: number
}

export function SourceOverlayChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="period" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              borderRadius: '16px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="epuIndex" name="EPU Index" stroke="#a855f7" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="prothomAlo" name="Prothom Alo" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="dailyStar" name="Daily Star" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="userLinks" name="User Links" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
