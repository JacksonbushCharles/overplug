export function SMTPForm() {
  return (
    <div className="space-y-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
      <h2 className="text-lg font-semibold">Resend SMTP configuration</h2>
      <p className="text-sm text-muted-foreground">
        SMTP credentials are configured securely on the server in <code>.env.local</code>. They are never entered into or sent from this browser.
      </p>
    </div>
  )
}
