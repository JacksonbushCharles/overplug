import { useEffect, useMemo } from 'react'

type RecipientSummaryProps = {
  recipients: string[]
  onValidRecipientsChange: (recipients: string[]) => void
}

export function RecipientSummary({ recipients, onValidRecipientsChange }: RecipientSummaryProps) {
  const validRecipients = useMemo(
    () => recipients.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
    [recipients]
  )

  useEffect(() => {
    onValidRecipientsChange(validRecipients)
  }, [onValidRecipientsChange, validRecipients])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recipient summary</h2>
        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
          {validRecipients.length} valid
        </span>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap gap-2">
          {validRecipients.map((email) => (
            <span key={email} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
              {email}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
