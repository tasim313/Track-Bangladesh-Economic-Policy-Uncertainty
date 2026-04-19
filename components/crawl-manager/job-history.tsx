'use client'

import { Card } from '@/components/ui/card'
import { CrawlJob, CrawlJobStatus } from '@/lib/types'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface JobHistoryProps {
  jobs: CrawlJob[]
}

const statusConfig = {
  [CrawlJobStatus.COMPLETED]: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: CheckCircle2,
    label: 'Completed',
  },
  [CrawlJobStatus.FAILED]: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: AlertCircle,
    label: 'Failed',
  },
  [CrawlJobStatus.PENDING]: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    icon: Clock,
    label: 'Pending',
  },
  [CrawlJobStatus.RUNNING]: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: Clock,
    label: 'Running',
  },
}

export function JobHistory({ jobs }: JobHistoryProps) {
  if (jobs.length === 0) {
    return (
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Job History</h3>
        <p className="text-center text-muted-foreground py-12">No jobs in history yet.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Job History</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Job ID</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">Articles</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">Errors</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Started</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Duration</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const config = statusConfig[job.status]
              const Icon = config.icon
              const startDate = new Date(job.startedAt)
              const startTime = startDate.toLocaleTimeString()

              let duration = ''
              if (job.completedAt) {
                const durationMs =
                  new Date(job.completedAt).getTime() - startDate.getTime()
                const seconds = Math.floor(durationMs / 1000)
                duration = `${Math.floor(seconds / 60)}m ${seconds % 60}s`
              } else {
                duration = 'Running...'
              }

              return (
                <tr key={job.id} className="border-b border-border hover:bg-card/50">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {job.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} border ${config.border}`}>
                      <Icon className={`w-4 h-4 ${config.text}`} />
                      <span className={`text-xs font-medium ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-emerald-400">{job.articlesFound}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={job.errors > 0 ? 'text-red-400 font-semibold' : 'text-muted-foreground'}>
                      {job.errors}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {startTime}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {duration}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
