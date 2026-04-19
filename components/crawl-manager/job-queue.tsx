'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CrawlJob } from '@/lib/types'
import { Play, Pause, X, CheckCircle2, AlertCircle } from 'lucide-react'

interface JobQueueProps {
  jobs: CrawlJob[]
  onPause: (jobId: string) => void
  onCancel: (jobId: string) => void
}

export function JobQueue({ jobs, onPause, onCancel }: JobQueueProps) {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Active Jobs</h3>

      <div className="space-y-4">
        {jobs.map((job) => {
          const startTime = new Date(job.startedAt)
          const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000)
          const minutes = Math.floor(elapsedSeconds / 60)
          const seconds = elapsedSeconds % 60

          return (
            <div key={job.id} className="border border-border rounded-lg p-4 bg-card/50">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{job.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Running for {minutes}m {seconds}s
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border"
                    onClick={() => onPause(job.id)}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    onClick={() => onCancel(job.id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-xs font-semibold text-foreground">
                    {(job.progress || 0).toFixed(0)}%
                  </p>
                </div>
                <div className="w-full bg-card/50 rounded-full h-2 overflow-hidden border border-border">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${job.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Articles Found</p>
                  <p className="text-lg font-bold text-emerald-400">{job.articlesFound}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Errors</p>
                  <p className="text-lg font-bold text-red-400">{job.errors}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rate</p>
                  <p className="text-lg font-bold text-blue-400">
                    {(job.articlesFound / (minutes || 0.1) / 60).toFixed(1)}/s
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
