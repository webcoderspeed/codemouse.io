import Link from 'next/link'
import { Zap, Check, ArrowRight, Shield, Clock, BarChart2, Key, Github } from 'lucide-react'

const FEATURES = [
  'Unlimited PR reviews — no caps, no limits',
  'Bug & logic error detection',
  'Security vulnerability scanning',
  'Performance issue analysis',
  'Plain-English review summaries',
  'All programming languages supported',
  'Full review history & analytics dashboard',
  'GitHub PR comment integration',
  'Bring your own OpenAI key — pay OpenAI directly',
]

const FAQ = [
  { q: 'Is CodeMouse really free?', a: 'Yes. CodeMouse itself is completely free. You bring your own OpenAI API key and pay OpenAI directly for usage — typically $0.01–$0.05 per PR review using GPT-4o-mini.' },
  { q: 'What languages does it support?', a: 'All major languages — JavaScript, TypeScript, Python, Go, Ruby, Java, PHP, Rust, C++, Swift, Kotlin, and more.' },
  { q: 'Does it review every PR automatically?', a: 'Yes. Once installed, CodeMouse posts a structured review comment within 60 seconds of a PR being opened. No manual trigger needed.' },
  { q: 'Is my code safe?', a: 'Your code diff is sent directly to OpenAI using your own API key. CodeMouse never stores your source code.' },
  { q: 'How much will OpenAI charge me?', a: 'GPT-4o-mini is very cheap. A typical PR review costs $0.01–$0.05. Even 100 reviews a month would cost around $1–5.' },
  { q: 'Do I need to configure anything?', a: "Just two steps: install the GitHub App on your repositories, then add your OpenAI API key in Settings. That's it." },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-page text-text-primary">
      <nav className="sticky top-0 z-50 border-b border-border bg-page/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight text-text-primary">CodeMouse</span>
          </Link>
          <Link href="/login" className="btn-primary btn-sm text-xs">
            Get started free <ArrowRight size={12} />
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-xs text-success font-semibold mb-6">
          <Check size={11} strokeWidth={2.5} />
          Free forever — no credit card needed
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-4">
          Completely free.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-violet-400">
            Just bring your API key.
          </span>
        </h1>
        <p className="text-base text-text-secondary max-w-xl mx-auto">
          CodeMouse is free to use. Connect your OpenAI key and reviews start immediately.
          You pay OpenAI directly — typically pennies per review.
        </p>
      </section>

      <section className="max-w-lg mx-auto px-6 pb-20">
        <div className="card p-8 border-accent-500/20 bg-gradient-to-b from-accent-subtle/10 to-transparent relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-bold shadow-glow-sm">
              <Zap size={10} strokeWidth={2.5} />
              Free Forever
            </span>
          </div>
          <div className="mb-6 text-center">
            <div className="flex items-end justify-center gap-1.5 mb-1">
              <span className="text-6xl font-extrabold tracking-tight text-text-primary">$0</span>
            </div>
            <p className="text-sm text-text-muted">
              You only pay OpenAI for usage —{' '}
              <span className="text-text-secondary font-medium">~$0.01–$0.05 per review</span>
            </p>
          </div>
          <ul className="space-y-3 mb-8">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                <Check size={14} className="text-accent-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/login" className="btn-primary btn-base w-full justify-center text-sm font-bold">
            Start reviewing for free
            <ArrowRight size={13} />
          </Link>
          <p className="text-xs text-text-muted text-center mt-3">No credit card. No signup form. Just GitHub OAuth.</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: Github, label: 'Connect GitHub',   desc: 'Install the app on your repos'        },
            { icon: Key,    label: 'Add OpenAI key',   desc: 'Paste your key in Settings'           },
            { icon: Zap,    label: 'Auto reviews',     desc: 'Every PR gets reviewed instantly'     },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.label} className="card p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-subtle border border-border flex items-center justify-center mx-auto mb-2">
                  <Icon size={14} className="text-text-muted" strokeWidth={1.75} />
                </div>
                <p className="text-xs font-semibold text-text-primary mb-0.5">{item.label}</p>
                <p className="text-[11px] text-text-muted leading-snug">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface/60 py-12">
        <div className="max-w-4xl mx-auto px-6 grid sm:grid-cols-3 gap-6">
          {[
            { icon: Shield,   title: 'Security First',   desc: 'Every PR scanned for vulnerabilities before merge.' },
            { icon: Clock,    title: 'Under 60 Seconds', desc: 'Review posted automatically within seconds.'        },
            { icon: BarChart2, title: 'Track Quality',   desc: 'See code health trends over time in Analytics.'    },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-start gap-3">
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

      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="text-xl font-bold text-text-primary mb-8 text-center">Frequently asked questions</h2>
        <div className="divide-y divide-border">
          {FAQ.map((item, i) => (
            <div key={i} className="py-5">
              <h3 className="text-sm font-semibold text-text-primary mb-2">{item.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-text-muted">
          <Link href="/" className="hover:text-text-secondary transition-colors">Home</Link>
          <a href="mailto:support@codemouse.io" className="hover:text-text-secondary transition-colors">support@codemouse.io</a>
        </div>
      </footer>
    </div>
  )
}
