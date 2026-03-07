'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter }          from 'next/navigation'
import { useEffect, useState } from 'react'
import { Zap, Github, ArrowRight, Shield, GitPullRequest, Sparkles } from 'lucide-react'

const FEATURES = [
  { icon: GitPullRequest, text: 'Automated PR reviews on every push' },
  { icon: Shield,         text: 'Security & bug detection before merge' },
  { icon: Sparkles,       text: 'AI-powered code quality insights'     },
]

export default function LoginPage() {
  const { status }   = useSession()
  const router       = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') router.push('/dashboard')
  }, [status, router])

  const handleSignIn = async () => {
    setLoading(true)
    await signIn('github', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-page flex">

      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col justify-between p-12 border-r border-border bg-surface relative overflow-hidden">

        {/* bg decoration */}
        <div className="absolute inset-0 bg-grid-faint opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-text-primary">CodeMouse</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle/20 border border-accent-500/20 text-xs text-accent-400 font-medium">
              <Sparkles size={11} strokeWidth={2} />
              AI-Powered Code Review
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary leading-tight">
              Better code,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-violet-400">
                every pull request.
              </span>
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Connect your GitHub repositories and get instant, structured AI code reviews directly on your PRs.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-subtle border border-border flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-accent-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm text-text-secondary">{f.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom trust line */}
        <p className="relative text-xs text-text-muted">
          Trusted by developers across 500+ repositories
        </p>
      </div>

      {/* Right — sign in form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-text-primary">CodeMouse</span>
        </div>

        <div className="w-full max-w-sm space-y-8">

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">Sign in to CodeMouse</h2>
            <p className="text-sm text-text-secondary">Connect with GitHub to get started — no password needed.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              disabled={loading || status === 'loading'}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl
                bg-overlay border border-border hover:border-border-hover
                text-sm font-semibold text-text-primary
                hover:bg-subtle/50 transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-accent-500/50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-text-muted/30 border-t-text-muted rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github size={17} strokeWidth={1.75} />
                  Continue with GitHub
                  <ArrowRight size={14} strokeWidth={2} className="ml-auto text-text-muted" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-page text-xs text-text-muted">What happens next</span>
            </div>
          </div>

          {/* Steps */}
          <ol className="space-y-3">
            {[
              'Authorize CodeMouse to read your GitHub profile',
              'Install the GitHub App on chosen repositories',
              'Open a pull request — review happens automatically',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-subtle border border-border flex items-center justify-center text-xs font-bold text-text-muted mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <p className="text-xs text-text-muted text-center leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-text-secondary hover:text-text-primary transition-colors">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>.
          </p>

        </div>
      </div>
    </div>
  )
}
