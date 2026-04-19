'use client'

import { Card } from '@/components/ui/card'
import { CrawlStatus } from '@/lib/types'
import { Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface CrawlStatusCardProps {
  status: CrawlStatus
}

export function CrawlStatusCard({ status }: CrawlStatusCardProps) {
  const lastCrawlTime = new Date(status.lastCrawlTime)
  const timeSinceLastCrawl = Math.floor((Date.now() - lastCrawlTime.getTime()) / 60000)

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Crawl Status
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Active</span>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Active Jobs */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Active Jobs</p>
            <p className="text-3xl font-bold text-blue-400">{status.activeJobs}</p>
            <p className="text-xs text-muted-foreground mt-2">Currently running</p>
          </div>

          {/* Completed Today */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Completed Today</p>
            <p className="text-3xl font-bold text-emerald-400">{status.completedToday}</p>
            <p className="text-xs text-muted-foreground mt-2">Successful crawls</p>
          </div>

          {/* Articles Found */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Articles Today</p>
            <p className="text-3xl font-bold text-purple-400">{status.totalArticlesToday}</p>
            <p className="text-xs text-muted-foreground mt-2">New articles found</p>
          </div>

          {/* Error Count */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Errors</p>
            <p className="text-3xl font-bold text-red-400">{status.errorCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Errors encountered</p>
          </div>
        </div>

        {/* Success Rate and Last Crawl */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Success Rate</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-card/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                  style={{ width: `${status.successRate}%` }}
                />
              </div>
              <span className="text-sm font-bold text-foreground">{status.successRate.toFixed(1)}%</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Last Crawl</p>
            <p className="text-sm font-medium text-foreground">{timeSinceLastCrawl} minutes ago</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
