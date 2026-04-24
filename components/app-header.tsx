'use client'

import { usePathname } from 'next/navigation'
import { Activity, Bell, CalendarDays, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const copy: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Coordinate source presets, bulk evidence ingestion, and headline EPU movements.',
  },
  '/crawl': {
    title: 'Crawl Manager',
    subtitle: 'Monitor discovery, extraction, and live socket-driven crawler telemetry.',
  },
  '/data': {
    title: 'Data Explorer',
    subtitle: 'Search the unified article dataset and export filtered research slices.',
  },
  '/analytics': {
    title: 'Analytics',
    subtitle: 'Track EPU trends and keyword article-count output across sources.',
  },
  '/keywords': {
    title: 'Keywords',
    subtitle: 'Curate the bilingual E/P/U lexicon used across crawl jobs.',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Adjust crawler throttles, notifications, and integration behavior.',
  },
}

export function AppHeader() {
  const pathname = usePathname()
  const content = copy[pathname] ?? copy['/']

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{content.title}</h1>
              <p className="text-sm text-muted-foreground">{content.subtitle}</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Activity className="size-3.5" />
              WebSocket-ready
            </div>
            <Button size="icon" variant="outline">
              <Bell className="size-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search articles, jobs, keywords..." />
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            Academic window: 2010 to 2025
          </div>
        </div>
      </div>
    </header>
  )
}
