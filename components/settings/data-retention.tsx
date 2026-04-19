'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'

export function DataRetention() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Data Retention & Storage</h3>
        <p className="text-sm text-muted-foreground">
          Manage how long data is stored and archived
        </p>
      </div>

      <div className="space-y-6">
        {/* Retention Policies */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Article Retention Period
          </label>
          <div className="flex gap-3">
            <Input
              type="number"
              value="90"
              className="bg-secondary/50 border-border text-foreground"
              placeholder="Days"
            />
            <select className="flex-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm">
              <option>Days</option>
              <option>Weeks</option>
              <option>Months</option>
              <option>Years</option>
              <option>Forever</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Articles older than this period will be archived
          </p>
        </div>

        {/* Crawl Job Retention */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Crawl Job History Retention
          </label>
          <div className="flex gap-3">
            <Input
              type="number"
              value="30"
              className="bg-secondary/50 border-border text-foreground"
              placeholder="Days"
            />
            <select className="flex-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm">
              <option>Days</option>
              <option>Weeks</option>
              <option>Months</option>
            </select>
          </div>
        </div>

        {/* Storage Usage */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Storage Usage
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Articles</span>
              <span className="text-sm font-semibold text-foreground">2.5 GB / 10 GB</span>
            </div>
            <div className="w-full bg-card/50 rounded-full h-2 overflow-hidden border border-border">
              <div className="h-full w-1/4 bg-blue-500" />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Crawl Jobs & Logs</span>
              <span className="text-sm font-semibold text-foreground">512 MB / 5 GB</span>
            </div>
            <div className="w-full bg-card/50 rounded-full h-2 overflow-hidden border border-border">
              <div className="h-full w-1/10 bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* Archive Option */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-200 mb-3">
                Archived data will be moved to cold storage to free up space. It can be restored later if needed.
              </p>
              <Button variant="outline" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                Archive Old Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
