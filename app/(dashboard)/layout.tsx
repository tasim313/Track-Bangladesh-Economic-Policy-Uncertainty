'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const accessToken = useAuthStore((state) => state.accessToken)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  useEffect(() => {
    if (!isHydrated) return

    if (!accessToken) {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`)
    }
  }, [accessToken, isHydrated, pathname, router])

  if (!isHydrated || !accessToken) {
    return <div className="p-6 text-sm text-muted-foreground">Checking authentication...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_32%),linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_92%,white))]">
        <AppHeader />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
