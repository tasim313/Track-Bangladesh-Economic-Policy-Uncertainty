'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download } from 'lucide-react'

const pageLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/': 'Dashboard',
  '/explorer': 'Data Explorer',
  '/crawl-manager': 'Crawl Manager',
  '/analytics': 'EPU Analytics',
  '/keywords': 'Keyword Manager',
  '/settings': 'Settings',
}

export function Header() {
  const pathname = usePathname()
  const pageTitle = pageLabels[pathname] || 'Dashboard'

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 lg:px-8">
        {/* Left Section - Page Title */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
            <p className="text-xs text-gray-600 mt-1">
              {pageTitle === 'Dashboard' && 'Real-time EPU monitoring'}
              {pageTitle === 'Data Explorer' && 'Search and filter articles'}
              {pageTitle === 'Crawl Manager' && 'Manage and orchestrate crawl jobs'}
              {pageTitle === 'EPU Analytics' && 'Advanced trend analysis'}
              {pageTitle === 'Keyword Manager' && 'Manage E/P/U keywords'}
              {pageTitle === 'Settings' && 'Configure your preferences'}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full border border-green-300">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse-glow" />
            <span className="text-xs font-semibold text-green-700">Live</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden lg:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden lg:inline">Export</span>
          </Button>

          {/* User Profile Placeholder */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">Researcher</p>
              <p className="text-xs text-gray-600">Connected</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-blue-200">
              R
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
