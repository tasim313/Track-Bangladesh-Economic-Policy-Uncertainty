export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_32%),linear-gradient(180deg,_var(--background),_color-mix(in_oklab,var(--background)_88%,white))]">{children}</div>
}
