import { Activity, CheckCircle2, Clock3, XCircle } from 'lucide-react'

type Stats = {
  total: number
  sent: number
  failed: number
  pending: number
}

type DashboardCardsProps = {
  stats: Stats
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  const cards = [
    { label: 'Recipients', value: stats.total, icon: Activity, tone: 'text-cyan-400' },
    { label: 'Sent', value: stats.sent, icon: CheckCircle2, tone: 'text-emerald-400' },
    { label: 'Failed', value: stats.failed, icon: XCircle, tone: 'text-rose-400' },
    { label: 'Pending', value: stats.pending, icon: Clock3, tone: 'text-amber-400' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Live metrics</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/20">
                <Icon className={`h-4 w-4 ${card.tone}`} />
              </div>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
