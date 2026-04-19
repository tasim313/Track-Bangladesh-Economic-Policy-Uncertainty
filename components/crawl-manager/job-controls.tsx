'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface JobControlsProps {
  onSubmit: (config: any) => Promise<void>
  onCancel: () => void
}

export function JobControls({ onSubmit, onCancel }: JobControlsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [config, setConfig] = useState({
    name: 'Crawl Job ' + new Date().toLocaleDateString(),
    sources: 'all',
    maxArticles: '500',
    timeout: '3600',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(config)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Create New Crawl Job</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Name */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Job Name
          </label>
          <Input
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            placeholder="Enter job name"
            className="bg-secondary/50 border-border text-foreground"
          />
        </div>

        {/* Sources Selection */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Data Sources
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'all', label: 'All Sources' },
              { id: 'news', label: 'News Outlets' },
              { id: 'blogs', label: 'Blogs & Journals' },
              { id: 'social', label: 'Social Media' },
            ].map((source) => (
              <label
                key={source.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-card/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="sources"
                  value={source.id}
                  checked={config.sources === source.id}
                  onChange={(e) => setConfig({ ...config, sources: e.target.value })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{source.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Max Articles
            </label>
            <Input
              type="number"
              value={config.maxArticles}
              onChange={(e) => setConfig({ ...config, maxArticles: e.target.value })}
              placeholder="500"
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Timeout (seconds)
            </label>
            <Input
              type="number"
              value={config.timeout}
              onChange={(e) => setConfig({ ...config, timeout: e.target.value })}
              placeholder="3600"
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-blue-200">
            This will start a new crawl job to gather articles from the selected sources. 
            The job will run in the background and you can monitor its progress below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Starting...' : 'Start Crawl Job'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-border"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
