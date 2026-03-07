import Link from 'next/link'
import {
  GitPullRequest, Shield, Zap, BarChart2, GitBranch,
  ArrowRight, CheckCircle2, ChevronRight, Terminal,
  Code2, Bug, TrendingUp, Lock, Star, Users,
  Activity, FileCode2, AlertTriangle, Info,
} from 'lucide-react'

/* ── Static data ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: GitPullRequest,
    title: 'Automated PR Analysis',
    desc: 'Every pull request is automatically reviewed within 60 seconds of creation. Zero configuration, zero friction in your existing workflow.',
  },
  {
    icon: Bug,
    title: 'Deep Bug Detection',
    desc: 'Identifies null reference errors, logic flaws, edge cases, and off-by-one errors that escape static linters and human reviewers.',
  },
  {
    icon: Lock,
    title: 'Security Scanning',
    desc: 'Detects SQL injection, XSS vectors, hardcoded secrets, insecure deserialization, and OWASP Top 10 vulnerabilities on every commit.',
  },
  {
    icon: Zap,
    title: 'Performance Insights',
    desc: 'Surfaces N+1 queries, memory leaks, inefficient loops, and unnecessary re-renders before they reach your production environment.',
  },
  {
    icon: BarChart2,
    title: 'Repository Analytics',
    desc: 'Track code quality trends, developer velocity, issue recurrence, and review turnaround across your entire codebase over time.',
  },
  {
    icon: GitBranch,
    title: 'GitHub-Native Integration',
    desc: 'Operates as a proper GitHub App. Installs in under a minute, works across all branches, and integrates with your existing PR workflow.',
  },
]

const REVIEW_ITEMS = [
  {
    type: 'danger',
    icon: Bug,
    label: 'Critical',
    file: 'src/auth/session.ts',
    line: 47,
    title: 'Null dereference on unauthenticated request',
    body: 'user.profile is accessed without verifying the session state. If the request originates outside an authenticated context, this will throw at runtime.',
    fix: 'Add a guard: if (!user?.profile) return null before line 47.',
  },
  {
    type: 'warning',
    icon: Lock,
    label: 'Security',
    file: 'api/payments/webhook.ts',
    line: 112,
    title: 'Signature verification bypass possible',
    body: 'The HMAC comparison on line 112 uses a timing-unsafe string equality check. A timing attack could allow forged webhook payloads to pass validation.',
    fix: 'Replace with crypto.timingSafeEqual() for constant-time comparison.',
  },
  {
    type: 'info',
    icon: TrendingUp,
    label: 'Performance',
    file: 'components/UserList.tsx',
    line: 34,
    title: 'N+1 query pattern inside render loop',
    body: 'getUser() is called on every iteration of the forEach starting at line 34. With 100 users this creates 100 sequential DB queries.',
    fix: 'Batch fetch all users upfront with getUsers(ids), then use a Map for O(1) lookup.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Install the GitHub App',
    desc: 'Connect CodeMouse to your GitHub account with a single click. Choose which repositories to enable — takes under 60 seconds.',
  },
  {
    n: '02',
    title: 'Open a Pull Request',
    desc: 'Your team works exactly as before. No changes to your branching strategy, commit conventions, or workflow required.',
  },
  {
    n: '03',
    title: 'Receive a Structured Review',
    desc: 'CodeMouse posts a detailed code review comment — categorised by severity, type, and file — within 60 seconds of PR creation.',
  },
  {
    n: '04',
    title: 'Track Quality Over Time',
    desc: 'Access your dashboard to review trends, catch recurring issues, measure developer performance, and demonstrate progress.',
  },
]

const STATS = [
  { value: '2.4M+', label: 'Pull requests reviewed' },
  { value: '98ms',  label: 'Median review latency' },
  { value: '94%',   label: 'Defect catch rate' },
  { value: '12x',   label: 'Faster than manual review' },
]

/* ── Components ──────────────────────────────────────────────────────────── */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-100">
      {children}
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="h-px w-6 bg-accent-500" />
      <span className="text-xs font-semibold text-accent-400 tracking-widest uppercase">{children}</span>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-page text-text-primary">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-page/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm text-text-primary tracking-tight">CodeMouse</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 flex-1">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/docs">Docs</NavLink>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Sign in
            </Link>
            <Link href="/login"
              className="btn-primary btn-base text-sm">
              Get started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid-faint opacity-100" />
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-500/5 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
          {/* Announce banner */}
          <div className="flex justify-center mb-8">
            <Link href="/changelog" className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface hover:border-border-hover transition-all duration-150">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
              <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                Now on GitHub Marketplace
              </span>
              <ChevronRight size={12} className="text-text-muted group-hover:text-accent-400 transition-colors" />
            </Link>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-text-primary leading-[1.04] mb-6">
              Code review that
              <span className="block"
                style={{ background: 'linear-gradient(135deg, #818CF8 0%, #C7D2FE 50%, #6366F1 100%)',
                         WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                never sleeps.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
              CodeMouse integrates directly into GitHub as a native app. Every pull request
              receives a structured AI review — covering bugs, security, performance,
              and best practices — within 60 seconds of creation.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href="/login"
              className="btn-primary btn-xl">
              Install on GitHub
              <ArrowRight size={16} />
            </Link>
            <Link href="#demo"
              className="btn-secondary btn-xl">
              <Terminal size={15} />
              View live demo
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {['Free for public repos', 'No credit card required', 'Installs in 60 seconds', 'Works with any language'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <CheckCircle2 size={12} className="text-success flex-shrink-0" strokeWidth={2} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {STATS.map(s => (
              <div key={s.label} className="bg-surface px-8 py-6 text-center">
                <p className="text-3xl font-bold tracking-tighter text-text-primary metric-value">{s.value}</p>
                <p className="text-xs text-text-secondary mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo — PR Review mockup ── */}
      <section id="demo" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <SectionLabel>Live Preview</SectionLabel>
          <h2 className="text-4xl font-bold tracking-tighter mb-4">What a real review looks like</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Structured, actionable, and categorised by severity. Not a wall of text — a prioritised engineering decision.
          </p>
        </div>

        {/* GitHub PR window mockup */}
        <div className="card overflow-hidden shadow-card-lg max-w-4xl mx-auto">
          {/* Window chrome */}
          <div className="bg-overlay border-b border-border px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-subtle border border-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-subtle border border-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-subtle border border-border" />
            </div>
            <span className="text-xs text-text-muted font-mono">
              github.com / acme-corp / backend / pull / 247
            </span>
          </div>

          {/* PR header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary text-sm">
                  feat: refactor authentication middleware and add OAuth2 support
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="badge badge-accent flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    Open
                  </span>
                  <span className="text-xs text-text-secondary">dev-arjun wants to merge 14 commits into main</span>
                </div>
              </div>
            </div>
          </div>

          {/* CodeMouse review comment */}
          <div className="bg-accent-subtle/20 border-b border-accent-500/15">
            {/* Bot header */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-accent-500/15">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
                <Zap size={13} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-sm font-semibold text-text-primary">codemouse</span>
                <span className="text-xs text-text-muted ml-2">bot</span>
                <span className="text-xs text-text-secondary ml-2">— reviewed 3 files, +312 / −48 lines · 0.8s</span>
              </div>
              <div className="ml-auto">
                <span className="badge badge-danger">Changes requested</span>
              </div>
            </div>

            {/* Review summary */}
            <div className="px-6 py-4">
              <p className="text-sm text-text-secondary mb-4">
                Reviewed <span className="text-text-primary font-medium">14 commits</span> across{' '}
                <span className="text-text-primary font-medium">6 files</span>. Found{' '}
                <span className="text-danger font-medium">1 critical issue</span>,{' '}
                <span className="text-warning-text font-medium">1 security concern</span>, and{' '}
                <span className="text-info-text font-medium">1 performance improvement</span>.
              </p>

              <div className="space-y-3">
                {REVIEW_ITEMS.map((item, i) => {
                  const Icon = item.icon
                  const colorMap = { danger: { bg: 'bg-danger/[0.06]', border: 'border-danger/25', label: 'text-danger', icon: 'text-danger' },
                                     warning: { bg: 'bg-warning/[0.06]', border: 'border-warning/25', label: 'text-warning-text', icon: 'text-warning' },
                                     info: { bg: 'bg-info/[0.06]', border: 'border-info/25', label: 'text-info-text', icon: 'text-info' } }
                  const c = colorMap[item.type as keyof typeof colorMap]
                  return (
                    <div key={i} className={`rounded-lg border p-4 ${c.bg} ${c.border}`}>
                      <div className="flex items-start gap-3">
                        <Icon size={15} className={`mt-0.5 flex-shrink-0 ${c.icon}`} strokeWidth={2} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${c.label}`}>{item.label}</span>
                            <span className="text-xs text-text-muted font-mono">{item.file}:{item.line}</span>
                          </div>
                          <p className="text-sm font-medium text-text-primary mb-1">{item.title}</p>
                          <p className="text-xs text-text-secondary leading-relaxed">{item.body}</p>
                          <div className="mt-2 px-2.5 py-1.5 bg-surface/80 rounded border border-border">
                            <p className="text-xs text-text-secondary"><span className="text-accent-400 font-medium">Fix: </span>{item.fix}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-text-muted">Powered by CodeMouse · codemouse.io</span>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Bug size={11} /> 1 bug</span>
                  <span className="flex items-center gap-1"><Lock size={11} /> 1 security</span>
                  <span className="flex items-center gap-1"><TrendingUp size={11} /> 1 perf</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="border-t border-border bg-surface/30 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Capabilities</SectionLabel>
            <h2 className="text-4xl font-bold tracking-tighter mb-4">Built for engineering teams</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Not a chatbot you prompt. A platform that integrates into your engineering workflow and generates insight continuously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="card-hover p-6 group">
                  <div className="w-9 h-9 rounded-lg bg-subtle border border-border group-hover:border-accent-500/30 group-hover:bg-accent-subtle/30 flex items-center justify-center mb-4 transition-all duration-200">
                    <Icon size={16} className="text-text-secondary group-hover:text-accent-400 transition-colors" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2 text-sm">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <SectionLabel>Integration</SectionLabel>
          <h2 className="text-4xl font-bold tracking-tighter mb-4">Up and running in four steps</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            No YAML configuration files. No pipeline changes. No mandatory conventions.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-accent-500/60 via-accent-500/20 to-transparent hidden lg:block" />

          <div className="space-y-8">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-accent-subtle border border-accent-500/30 flex items-center justify-center z-10 relative">
                    <span className="text-xs font-bold text-accent-400 font-mono">{s.n}</span>
                  </div>
                </div>
                <div className="pt-1.5 pb-2">
                  <h3 className="font-semibold text-text-primary mb-1.5">{s.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-lg">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold tracking-tighter mb-4">
            Start reviewing smarter today.
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Install CodeMouse on your first repository in under a minute.
            The first review will post itself.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="btn-primary btn-xl">
              Install on GitHub
              <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="btn-secondary btn-xl">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
              <Zap size={10} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-text-secondary">CodeMouse</span>
            <span className="text-sm text-text-muted">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Docs', '/docs'], ['Changelog', '/changelog'], ['Support', 'mailto:support@codemouse.io']].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-text-primary transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
