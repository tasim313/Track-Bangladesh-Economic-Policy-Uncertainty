'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Eye, EyeOff } from 'lucide-react'

export function APIConfig() {
  const [showKey, setShowKey] = useState(false)
  const [apiKey, setApiKey] = useState('sk_prod_1234567890abcdef')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">API Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure API keys and endpoints for data sources
        </p>
      </div>

      <div className="space-y-6">
        {/* API Key */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">API Key</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm font-mono"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              variant="outline"
              className="border-border"
              onClick={copyToClipboard}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Keep this key secure. Never share it publicly.
          </p>
        </div>

        {/* Base URL */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Base URL</label>
          <Input
            value="https://api.example.com"
            className="bg-secondary/50 border-border text-foreground"
            placeholder="https://api.example.com"
          />
          <p className="text-xs text-muted-foreground mt-2">
            The primary API endpoint for data retrieval
          </p>
        </div>

        {/* Request Timeout */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Request Timeout (seconds)
            </label>
            <Input
              type="number"
              value="30"
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Max Retries
            </label>
            <Input
              type="number"
              value="3"
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-emerald-400">API Connected</p>
              <p className="text-xs text-emerald-300">Last checked: 2 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
