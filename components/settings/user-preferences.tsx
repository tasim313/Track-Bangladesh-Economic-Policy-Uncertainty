'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function UserPreferences() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">User Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize your dashboard experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Display Settings */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Default View
          </label>
          <select className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm">
            <option>Dashboard</option>
            <option>Analytics</option>
            <option>Data Explorer</option>
            <option>Crawl Manager</option>
          </select>
        </div>

        {/* Items Per Page */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Items Per Page
          </label>
          <select className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm">
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>

        {/* Notifications */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Notifications</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-foreground">Crawl job completed</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-foreground">High EPU index alerts</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-foreground">Daily summary emails</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-foreground">System updates</span>
            </label>
          </div>
        </div>

        {/* Alert Threshold */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            EPU Index Alert Threshold
          </label>
          <div className="flex gap-3 items-center">
            <Input
              type="number"
              defaultValue="75"
              className="bg-secondary/50 border-border text-foreground w-24"
            />
            <span className="text-sm text-muted-foreground">When EPU exceeds this value</span>
          </div>
        </div>

        {/* Date Format */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Date Format
          </label>
          <select className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>

        {/* Time Zone */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Time Zone
          </label>
          <select className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm">
            <option>UTC</option>
            <option>GMT+6 (Bangladesh)</option>
            <option>EST</option>
            <option>CST</option>
            <option>PST</option>
          </select>
        </div>
      </div>
    </Card>
  )
}
