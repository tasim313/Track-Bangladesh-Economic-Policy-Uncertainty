'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { APIConfig } from '@/components/settings/api-config'
import { CrawlSettings } from '@/components/settings/crawl-settings'
import { DataRetention } from '@/components/settings/data-retention'
import { NewsSources } from '@/components/settings/news-sources'
import { UserPreferences } from '@/components/settings/user-preferences'
import { Save, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSaveSettings = async () => {
    setSaveStatus('saving')
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your EPU Index dashboard</p>
        </div>
        <div className="flex gap-3">
          {saveStatus === 'saved' && (
            <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              ✓ Saved
            </div>
          )}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleSaveSettings}
            disabled={saveStatus === 'saving'}
          >
            <Save className="w-4 h-4" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* API Configuration */}
        <APIConfig />

        {/* Crawl Settings */}
        <CrawlSettings />

        {/* Data Retention */}
        <DataRetention />

        {/* News Sources */}
        <NewsSources />

        {/* User Preferences */}
        <UserPreferences />

        {/* Danger Zone */}
        <Card className="bg-red-500/10 border border-red-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-200 mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Clear Cache
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Reset All Settings
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
