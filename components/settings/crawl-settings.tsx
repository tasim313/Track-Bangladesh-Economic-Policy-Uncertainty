'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function CrawlSettings() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Crawl Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure automatic crawl scheduling and parameters
        </p>
      </div>

      <div className="space-y-6">
        {/* Schedule */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Crawl Schedule
          </label>
          <select className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm">
            <option>Every hour</option>
            <option>Every 6 hours</option>
            <option>Every 12 hours</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        </div>

        {/* Crawl Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Max Articles per Crawl
            </label>
            <Input
              type="number"
              value="500"
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Crawl Timeout (minutes)
            </label>
            <Input
              type="number"
              value="60"
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>
        </div>

        {/* Data Sources */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Data Sources to Crawl
          </label>
          <div className="space-y-2">
            {['News Outlets', 'Blogs & Journals', 'Social Media', 'Government Sources'].map((source) => (
              <label key={source} className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-foreground">{source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Enable proxy rotation</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Skip duplicate articles</span>
          </label>
        </div>
      </div>
    </Card>
  )
}
