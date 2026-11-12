type ActivityEntry = {
  id: string
  email: string
  status: string
  detail: string
}

type ActivityFeedProps = {
  items: ActivityEntry[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Live activity</h3>
      <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-background/40 p-4 text-sm text-muted-foreground">
            No activity yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{item.email}</p>
                <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.25em] ${item.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
