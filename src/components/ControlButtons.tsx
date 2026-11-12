'use client'

import { Pause, Play, Square, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ControlButtonsProps = {
  isSending: boolean
  isPaused: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onTest: () => void
  delay: number
  onDelayChange: (value: number) => void
}

export function ControlButtons({
  isSending,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  onTest,
  delay,
  onDelayChange,
}: ControlButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Controls</h3>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
          <span className="text-muted-foreground">Delay</span>
          <input
            type="number"
            min="1"
            max="10"
            value={delay}
            onChange={(event) => onDelayChange(Number(event.target.value))}
            className="w-12 rounded-full bg-transparent text-center outline-none"
          />
          <span className="text-muted-foreground">s</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={onTest} className="rounded-2xl" variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Send test email
        </Button>
        <Button onClick={onStart} className="rounded-2xl bg-cyan-500/90 text-white hover:bg-cyan-400">
          <Play className="mr-2 h-4 w-4" />
          Start sending
        </Button>
        <Button onClick={onPause} disabled={!isSending || isPaused} className="rounded-2xl" variant="outline">
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
        <Button onClick={onResume} disabled={!isSending || !isPaused} className="rounded-2xl" variant="outline">
          <Play className="mr-2 h-4 w-4" />
          Resume
        </Button>
        <Button onClick={onStop} disabled={!isSending} className="rounded-2xl" variant="outline">
          <Square className="mr-2 h-4 w-4" />
          Stop
        </Button>
      </div>
    </div>
  )
}
