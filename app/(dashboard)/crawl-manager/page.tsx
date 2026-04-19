'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { JobQueue } from '@/components/crawl-manager/job-queue'
import { JobControls } from '@/components/crawl-manager/job-controls'
import { JobHistory } from '@/components/crawl-manager/job-history'
import { generateMockCrawlJobs } from '@/lib/mock-data'
import { CrawlJobStatus } from '@/lib/types'

export default function CrawlManagerPage() {
  const [jobs, setJobs] = useState(() => generateMockCrawlJobs())
  const [isCreatingJob, setIsCreatingJob] = useState(false)

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
    // Create new job
    const newJob = {
      id: `job-${Date.now()}`,
      status: CrawlJobStatus.RUNNING as const,
      startedAt: new Date().toISOString(),
      articlesFound: 0,
      errors: 0,
      progress: 0,
    }

    setJobs((prev) => [newJob, ...prev])
    setIsCreatingJob(false)

    // Simulate job progress
    const progressInterval = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) => {
          if (job.id === newJob.id) {
            const newProgress = (job.progress || 0) + Math.random() * 20
            if (newProgress >= 100) {
              clearInterval(progressInterval)
              return {
                ...job,
                progress: 100,
                status: CrawlJobStatus.COMPLETED,
                completedAt: new Date().toISOString(),
                articlesFound: Math.floor(Math.random() * 100) + 20,
                errors: Math.floor(Math.random() * 3),
              }
            }
            return {
              ...job,
              progress: newProgress,
              articlesFound: Math.floor(newProgress * 0.5),
            }
          }
          return job
        })
      )
    }, 1000)
  }

  const handlePauseJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: CrawlJobStatus.PENDING } : job
      )
    )
  }

  const handleCancelJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: CrawlJobStatus.FAILED, errors: 1 } : job
      )
    )
  }

  return (
    <div className="space-y-6 p-6">
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
      {activeJobs.length > 0 && (
        <JobQueue
          jobs={activeJobs}
          onPause={handlePauseJob}
          onCancel={handleCancelJob}
        />
      )}

      {/* Job History */}
      <JobHistory
        jobs={jobs.filter((j) => j.status !== CrawlJobStatus.RUNNING)}
      />
    </div>
  )
}
