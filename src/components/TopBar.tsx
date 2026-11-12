import { Mail, Sparkles } from 'lucide-react'

import { ThemeToggle } from '@/components/ThemeToggle'

export function TopBar() {
  return (
    <header className="glass-card flex flex-wrap items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">B-Mailler</p>
          <p className="text-sm text-muted-foreground">Single-page B-Email</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
          <Sparkles className="h-4 w-4" />
          <span>Server-side SMTP</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
