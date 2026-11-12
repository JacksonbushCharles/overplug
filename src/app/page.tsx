'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { ActivityFeed } from '@/components/ActivityFeed'
import { CampaignForm } from '@/components/CampaignForm'
import { ControlButtons } from '@/components/ControlButtons'
import { DashboardCards } from '@/components/DashboardCards'
import { DonutChart } from '@/components/DonutChart'
import { LoginPage } from '@/components/LoginPage'
import { ProgressBar } from '@/components/ProgressBar'
import { RecipientSummary } from '@/components/RecipientSummary'
import { RecipientUploader } from '@/components/RecipientUploader'
import { TopBar } from '@/components/TopBar'
import { EmailEngine } from '@/lib/email-engine'

type Campaign = {
  subject: string
  content: string
}

type ActivityEntry = {
  id: string
  email: string
  status: string
  detail: string
}

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign>({ subject: '', content: '' })
  const [recipients, setRecipients] = useState<string[]>([])
  const [validRecipients, setValidRecipients] = useState<string[]>([])
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, pending: 0 })
  const [progress, setProgress] = useState(0)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [engine, setEngine] = useState<EmailEngine | null>(null)
  const [delay, setDelay] = useState(2)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const emailEngine = new EmailEngine()
    setEngine(emailEngine)

    emailEngine.on('progress', (data: { stats: typeof stats; progress: number }) => {
      setStats(data.stats)
      setProgress(data.progress)
    })

    emailEngine.on('activity', (entry: ActivityEntry) => {
      setActivity((prev) => [entry, ...prev])
    })

    emailEngine.on('complete', () => {
      setIsSending(false)
      setIsPaused(false)
      toast.success('Campaign completed')
    })

    return () => {
      emailEngine.destroy()
    }
  }, [])

  const handleStartSending = async () => {
    if (!campaign.subject || !campaign.content || validRecipients.length === 0 || !engine) {
      toast.error('Please complete the campaign and recipient details first.')
      return
    }

    setIsSending(true)
    setIsPaused(false)
    setActivity([])
    setStats({ total: validRecipients.length, sent: 0, failed: 0, pending: validRecipients.length })
    setProgress(0)

    await engine.start({
      campaign,
      recipients: validRecipients,
      delay,
    })
  }

  const handlePause = () => {
    if (!engine) return
    engine.pause()
    setIsPaused(true)
    toast.success('Paused')
  }

  const handleResume = () => {
    if (!engine) return
    engine.resume()
    setIsPaused(false)
    toast.success('Resumed')
  }

  const handleStop = () => {
    if (!engine) return
    engine.stop()
    setIsSending(false)
    setIsPaused(false)
    toast.success('Stopped')
  }

  const handleSendTest = async () => {
    if (!campaign.subject || !campaign.content || !engine) {
      toast.error('Please complete the campaign before testing.')
      return
    }

    const result = await engine.sendTest({
      campaign,
    })

    if (result.success) {
      toast.success('Test email sent successfully')
    } else {
      toast.error(result.error || 'Test email failed')
    }
  }

  const handleLogin = (email: string) => {
    setUserEmail(email)
  }

  if (!userEmail) {
    return <LoginPage onLogin={handleLogin} />
  }
  

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(135deg,_rgba(2,6,23,0.95),_rgba(8,15,35,0.98))] text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
        <TopBar />
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/70 px-5 py-4 text-sm text-slate-300 shadow-lg shadow-cyan-500/10">
          <div>
            Signed in as <span className="font-semibold text-white">{userEmail}</span>
          </div>
          <button
            type="button"
            onClick={() => setUserEmail(null)}
            className="rounded-2xl bg-slate-900/80 px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6">
              <CampaignForm onCampaignChange={setCampaign} />
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <RecipientUploader onRecipientsChange={setRecipients} />
            </motion.section>

            {recipients.length > 0 ? (
              <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
                <RecipientSummary recipients={recipients} onValidRecipientsChange={setValidRecipients} />
              </motion.section>
            ) : null}
          </div>

          <div className="space-y-6">
            <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <DashboardCards stats={stats} />
            </motion.aside>

            <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6">
              <ProgressBar progress={progress} />
            </motion.aside>

            <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <ControlButtons
                isSending={isSending}
                isPaused={isPaused}
                onStart={handleStartSending}
                onPause={handlePause}
                onResume={handleResume}
                onStop={handleStop}
                onTest={handleSendTest}
                delay={delay}
                onDelayChange={setDelay}
              />
            </motion.aside>

            <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
              <ActivityFeed items={activity} />
            </motion.aside>

            <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <DonutChart delivered={stats.sent} failed={stats.failed} />
            </motion.aside>
          </div>
        </div>
      </div>
    </main>
  )
}
