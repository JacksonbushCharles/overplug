type ProgressBarProps = {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Progress</h3>
        <span className="text-sm font-medium text-cyan-300">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
