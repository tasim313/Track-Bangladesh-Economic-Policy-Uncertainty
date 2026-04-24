'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { BarChart3, Database, Home, Settings, Workflow, KeyRound, MoonStar, SunMedium, LineChart } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

const navItems = [
  { title: 'Dashboard', href: '/', icon: Home },
  { title: 'Crawl Manager', href: '/crawl', icon: Workflow },
  { title: 'Data Explorer', href: '/data', icon: Database },
  { title: 'Analytics', href: '/analytics', icon: LineChart },
  { title: 'Keywords', href: '/keywords', icon: KeyRound },
  { title: 'Settings', href: '/settings', icon: Settings },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/80">
      <SidebarHeader className="gap-4 border-b border-sidebar-border/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6,#a855f7)] text-white shadow-lg">
              <BarChart3 className="size-5" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold">Bangladesh EPU</p>
              <p className="truncate text-xs text-sidebar-foreground/65">Research dashboard</p>
            </div>
          </Link>
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-4 border-t border-sidebar-border/70 p-4">
        <div className="rounded-2xl bg-sidebar-accent/70 p-3 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-medium">{user?.fullName ?? user?.name ?? 'Researcher'}</p>
          <p className="truncate text-xs text-sidebar-foreground/60">{user?.email ?? 'No email'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {resolvedTheme === 'dark' ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              clearAuth()
              router.replace('/auth/signin')
            }}
          >
            Sign out
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
