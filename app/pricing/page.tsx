import Link from 'next/link'
import {
  Zap, Check, ArrowRight, Shield, GitPullRequest,
  BarChart2, Users, Clock, Lock,
} from 'lucide-react'

const FREE_FEATURES = [
  'Up to 30 PR reviews / month',
  'Bug & logic detection',
  'Security vulnerability scan',
  'Plain-English review summaries',
  'All programming languages',
  'GitHub PR comment integration',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited PR reviews',
  'Priority review queue',
  'Full history & analytics dashboard',
  'Performance & style analysis',
  'Usage reports & insights',
  'Email support',
]

const FAQ = [
  {
    q: 'What languages does CodeMouse support?',
    a: 'All major languages — JavaScript, TypeScript, Python, Go, Ruby, Java, PHP, Rust, C++, Swift, Kotlin, and more. The AI adapts its review criteria to each language.',
  },
  {
    q: 'Does it review every PR automatically?',
    a: 'Yes. Once installed, CodeMouse posts a structured review comment within 60 seconds of a PR being opened or updated. No manual trigger needed.',
  },
  {
    q: 'Is my code safe?',
    a: 'Your code diff is sent to OpenAI for analysis only during the review request and is not stored by CodeMouse. We never retain your source code.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your dashboard at any time. Your plan remains active until the end of the current billing period.',
  },
  {
    q: 'Do I need to configure anything?',
    a: 'No. Install the GitHub App on a repository and it works immediately. Zero configuration, zero YAML files.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-page text-text-primary">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-page/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight text-text-primary">CodeMouse</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/"       className="text-xs text-text-secondary hover:text-text-primary transition-colors">Home</Link>
            <Link href="/login"  className="btn-primary btn-sm text-xs">
              Get started
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle/20 border border-accent-500/20 text-xs text-accent-400 font-medium mb-6">
          <Zap size={11} strokeWidth={2} />
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-4">
          Start free.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-violet-400">
            Scale when you need it.
          </span>
        </h1>
        <p className="text-base text-text-secondary max-w-lg mx-auto">
          No credit card required to get started. Upgrade to Pro for unlimited reviews and advanced insights.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Free */}
          <div className="card p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">Free Forever</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-5xl font-extrabold tracking-tight text-text-primary">₹0</span>
              </div>
              <p className="text-sm text-text-muted">No credit card. No expiry.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                  <Check size={14} className="text-success flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="btn-secondary btn-base w-full justify-center text-sm font-semibold"
            >
              Start for free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative card p-7 flex flex-col border-accent-500/30 bg-gradient-to-b from-accent-subtle/10 to-transparent">
            {/* Most popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-bold shadow-glow-sm">
                <Zap size={10} strokeWidth={2.5} />
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-accent-400 uppercase tracking-widest mb-4">Pro</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-5xl font-extrabold tracking-tight text-text-primary">₹599</span>
                <span className="text-sm text-text-muted mb-2">/repo/month</span>
              </div>
              <p className="text-sm text-text-muted">≈ $7 USD · Billed monthly via Razorpay</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                  <Check size={14} className="text-accent-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="btn-primary btn-base w-full justify-center text-sm font-bold"
            >
              Upgrade to Pro
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>

        {/* Feature comparison callout */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { icon: Shield,       title: 'Security First',        desc: 'Every PR scanned for vulnerabilities, injection risks, and exposed secrets.' },
            { icon: Clock,        title: 'Under 60 Seconds',      desc: 'Review comments posted automatically within seconds of a PR opening.'   },
            { icon: BarChart2,    title: 'Quality Over Time',     desc: 'Track code health trends and improvement velocity across your team.'     },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.title} className="card px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-subtle border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-text-muted" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-0.5">{item.title}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-xl font-bold text-text-primary mb-8 text-center">Frequently asked questions</h2>
        <div className="space-y-0 divide-y divide-border">
          {FAQ.map((item, i) => (
            <div key={i} className="py-5">
              <h3 className="text-sm font-semibold text-text-primary mb-2">{item.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-text-muted">
          <Link href="/" className="hover:text-text-secondary transition-colors">Home</Link>
          <a href="mailto:support@codemouse.io" className="hover:text-text-secondary transition-colors">support@codemouse.io</a>
          <Link href="/privacy" className="hover:text-text-secondary transition-colors">Privacy</Link>
          <Link href="/terms"   className="hover:text-text-secondary transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}
