'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface LoginPageProps {
  onLogin: (email: string) => void
}

async function authenticate(email: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Invalid email or password.' }))
    throw new Error(error?.message || 'Invalid email or password.')
  }

  return true
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      await authenticate(normalizedEmail, password)
      onLogin(normalizedEmail)
      toast.success('Welcome back!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(135deg,_rgba(2,6,23,0.95),_rgba(8,15,35,0.98))] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-10">
        <div className="glass-card w-full rounded-3xl border border-slate-800/80 bg-slate-950/75 p-8 shadow-2xl shadow-cyan-500/10">
          <div className="mb-6 space-y-2 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">B-Mailler access</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Sign in to continue</h1>
            <p className="text-sm text-slate-400">Enter your email and password to unlock the dashboard.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-200">
              Username or Email
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="username or you@example.com"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Enter a password"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
