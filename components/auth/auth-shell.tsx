import Link from 'next/link'
import { BarChart3, ShieldCheck, Webhook, Waves } from 'lucide-react'

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden overflow-hidden border-r border-border/60 lg:flex">
        <div className="relative flex w-full flex-col justify-between bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_42%,#22c55e_100%)] p-10 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%)]" />
          <div className="relative space-y-8">
            <Link href="/auth/signin" className="inline-flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white/14">
                <BarChart3 className="size-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-white/70">Bangladesh</p>
                <h1 className="text-2xl font-semibold">EPU Research Desk</h1>
              </div>
            </Link>
            <div className="max-w-xl space-y-4">
              <p className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/80">
                Next.js 14+ App Router Scaffold
              </p>
              <h2 className="text-5xl font-semibold leading-tight">
                Monitor economy, policy, and uncertainty from one workspace.
              </h2>
              <p className="text-lg text-white/80">
                Built for academic crawling, custom evidence ingestion, and live Django-backed processing.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Waves,
                title: 'Realtime',
                text: 'Django Channels-ready job telemetry and crawler logs.',
              },
              {
                icon: ShieldCheck,
                title: 'Secure',
                text: 'JWT sessions with refresh support and protected routes.',
              },
              {
                icon: Webhook,
                title: 'Flexible',
                text: 'Preset source crawling plus 100+ custom evidence links.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <item.icon className="mb-3 size-5 text-white/80" />
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-white/72">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
          {footer ? <div className="mt-8 border-t border-border/60 pt-6">{footer}</div> : null}
        </div>
      </section>
    </div>
  )
}
