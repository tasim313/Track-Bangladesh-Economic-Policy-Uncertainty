'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { JobQueue } from '@/components/crawl-manager/job-queue'
import { JobControls } from '@/components/crawl-manager/job-controls'
import { JobHistory } from '@/components/crawl-manager/job-history'
import { CrawlJob, CrawlJobStatus } from '@/lib/types'
import { cancelCrawlJob, createCrawlJob, fetchCrawlJobs, pauseCrawlJob } from '@/lib/backend-data'

export default function CrawlManagerPage() {
  const [jobs, setJobs] = useState<CrawlJob[]>([])
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadJobs = async () => {
    try {
      setError(null)
      const data = await fetchCrawlJobs()
      setJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load crawl jobs.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()

    const timer = setInterval(() => {
      loadJobs()
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  const activeJobs = useMemo(() => {
    return jobs.filter((j) => j.status === CrawlJobStatus.RUNNING)
  }, [jobs])

  const completedJobs = useMemo(() => {
    return jobs.filter((j) => j.status === CrawlJobStatus.COMPLETED)
  }, [jobs])

  const failedJobs = useMemo(() => {
    return jobs.filter((j) => j.status === CrawlJobStatus.FAILED)
  }, [jobs])

  const handleStartCrawl = async (config: any) => {
    try {
      const sourceMap: Record<string, 'daily_star' | 'prothom_alo' | 'both'> = {
        all: 'both',
        news: 'both',
        blogs: 'prothom_alo',
        social: 'daily_star',
      }

      const dateTo = new Date()
      const dateFrom = new Date()
      dateFrom.setDate(dateTo.getDate() - 7)

      await createCrawlJob(
        sourceMap[config.sources] ?? 'both',
        dateFrom.toISOString().split('T')[0],
        dateTo.toISOString().split('T')[0],
      )
      setIsCreatingJob(false)
      await loadJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create crawl job.')
    }
  }

  const handlePauseJob = async (jobId: string) => {
    try {
      await pauseCrawlJob(jobId)
      await loadJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause job.')
    }
  }

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelCrawlJob(jobId)
      await loadJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel job.')
    }
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border border-blue-500/20 p-6">
          <p className="text-xs text-muted-foreground mb-2">Active Jobs</p>
          <p className="text-3xl font-bold text-blue-400">{activeJobs.length}</p>
        </Card>
        <Card className="bg-emerald-500/10 border border-emerald-500/20 p-6">
          <p className="text-xs text-muted-foreground mb-2">Completed</p>
          <p className="text-3xl font-bold text-emerald-400">{completedJobs.length}</p>
        </Card>
        <Card className="bg-orange-500/10 border border-orange-500/20 p-6">
          <p className="text-xs text-muted-foreground mb-2">Pending</p>
          <p className="text-3xl font-bold text-orange-400">
            {jobs.filter((j) => j.status === CrawlJobStatus.PENDING).length}
          </p>
        </Card>
        <Card className="bg-red-500/10 border border-red-500/20 p-6">
          <p className="text-xs text-muted-foreground mb-2">Failed</p>
          <p className="text-3xl font-bold text-red-400">{failedJobs.length}</p>
        </Card>
      </div>

      {/* Job Controls */}
      {!isCreatingJob && (
        <div className="flex gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsCreatingJob(true)}
          >
            Create New Crawl Job
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-card/50">
            View Logs
          </Button>
        </div>
      )}

      {/* Job Creation Form */}
      {isCreatingJob && (
        <JobControls
          onSubmit={handleStartCrawl}
          onCancel={() => setIsCreatingJob(false)}
        />
      )}

      {/* Active Jobs Queue */}
      {!isLoading && activeJobs.length > 0 && (
        <JobQueue
          jobs={activeJobs}
          onPause={handlePauseJob}
          onCancel={handleCancelJob}
        />
      )}

      {/* Job History */}
      {isLoading ? (
        <Card className="bg-card border-border p-6">
          <p className="text-sm text-muted-foreground">Loading crawl jobs...</p>
        </Card>
      ) : (
        <JobHistory
          jobs={jobs.filter((j) => j.status !== CrawlJobStatus.RUNNING)}
        />
      )}
    </div>
  )
}
