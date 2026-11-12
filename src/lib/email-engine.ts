type Campaign = {
  subject: string
  content: string
}

export class EmailEngine {
  private listeners: Record<string, Array<(data: any) => void>> = {}
  private isPaused = false
  private shouldStop = false
  private sentCount = 0
  private failedCount = 0

  on(event: string, callback: (data: any) => void) {
    this.listeners[event] ||= []
    this.listeners[event].push(callback)
  }

  emit(event: string, data: any) {
    this.listeners[event]?.forEach((callback) => callback(data))
  }

  async start({ campaign, recipients, delay }: { campaign: Campaign; recipients: string[]; delay: number }) {
    this.shouldStop = false
    this.isPaused = false
    this.sentCount = 0
    this.failedCount = 0

    for (const recipient of recipients) {
      if (this.shouldStop) break
      while (this.isPaused) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      let result = await this.sendEmail({ campaign, recipient })
      let attempts = 1

      if (!result.success) {
        for (let retry = 0; retry < 2; retry += 1) {
          if (this.shouldStop) break
          while (this.isPaused) {
            await new Promise((resolve) => setTimeout(resolve, 200))
          }
          attempts += 1
          result = await this.sendEmail({ campaign, recipient })
          if (result.success) break
        }
      }

      if (result.success) {
        this.sentCount += 1
      } else {
        this.failedCount += 1
      }

      const stats = {
        total: recipients.length,
        sent: this.sentCount,
        failed: this.failedCount,
        pending: Math.max(recipients.length - this.sentCount - this.failedCount, 0),
      }
      const progress = recipients.length > 0 ? Math.round(((this.sentCount + this.failedCount) / recipients.length) * 100) : 0

      this.emit('progress', { stats, progress })
      this.emit('activity', {
        id: `${recipient}-${Date.now()}`,
        email: recipient,
        status: result.success ? 'Delivered' : 'Failed',
        detail: result.success ? `Delivered after ${attempts} attempt${attempts > 1 ? 's' : ''}` : result.error || 'Delivery failed',
      })

      if (!this.shouldStop) {
        await new Promise((resolve) => setTimeout(resolve, delay * 1000))
      }
    }

    this.emit('complete', { success: true })
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
  }

  stop() {
    this.shouldStop = true
    this.isPaused = false
  }

  destroy() {
    this.listeners = {}
  }

  async sendTest({ campaign }: { campaign: Campaign }) {
    return this.sendEmail({ campaign, mode: 'test' })
  }

  private async sendEmail({
    campaign,
    recipient,
    mode = 'send',
  }: {
    campaign: Campaign
    recipient?: string
    mode?: 'send' | 'test'
  }) {
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign,
          recipient,
          mode,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        return { success: false, error: data.error || 'Unknown error' }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
