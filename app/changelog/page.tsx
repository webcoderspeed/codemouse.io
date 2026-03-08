import Link from 'next/link'
import { Zap, Sparkles, Bug, Shield, Wrench, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Changelog — CodeMouse',
  description: 'What\'s new in CodeMouse — product updates, improvements, and fixes.',
}

type ChangeType = 'new' | 'improved' | 'fixed' | 'security'

interface Change {
  type: ChangeType
  text: string
}

interface Release {
  version: string
  date: string
  label?: string
  summary: string
  changes: Change[]
}

const RELEASES: Release[] = [
  {
    version: '1.4.0',
    date: 'March 2026',
    label: 'Latest',
    summary: 'Multi-provider AI support — bring your own key from OpenAI, Anthropic, Gemini, or Groq.',
    changes: [
      { type: 'new', text: 'Added support for Anthropic Claude (claude-3-5-sonnet, claude-3-haiku)' },
      { type: 'new', text: 'Added support for Google Gemini (gemini-1.5-flash, gemini-1.5-pro)' },
      { type: 'new', text: 'Added support for Groq (llama-3.1-70b-versatile, mixtral-8x7b)' },
      { type: 'new', text: 'New API Keys settings UI — manage keys for all providers in one place' },
      { type: 'new', text: 'Active Model selector — choose provider + model independently' },
      { type: 'security', text: 'API keys now encrypted at rest with AES-256-GCM' },
      { type: 'improved', text: 'Review comment includes model name for transparency' },
    ],
  },
  {
    version: '1.3.2',
    date: 'February 2026',
    summary: 'Analytics dashboard improvements and bug fixes.',
    changes: [
      { type: 'improved', text: 'Analytics: added 30/60/90-day trend charts for review volume' },
      { type: 'improved', text: 'Analytics: breakdown by issue category (bug, security, performance, quality)' },
      { type: 'fixed', text: 'Fixed review history pagination not loading on pages beyond 2' },
      { type: 'fixed', text: 'Fixed duplicate webhook deliveries on PR synchronize events' },
      { type: 'fixed', text: 'Dashboard: fixed repo list not refreshing after GitHub App installation' },
    ],
  },
  {
    version: '1.3.0',
    date: 'January 2026',
    summary: 'Review history page and improved review formatting.',
    changes: [
      { type: 'new', text: 'Reviews page: full history of all AI reviews across all repositories' },
      { type: 'new', text: 'Review detail view with expandable issue sections' },
      { type: 'improved', text: 'Review comments now grouped by severity (Critical → Security → Performance → Quality)' },
      { type: 'improved', text: 'Added line number references for each issue in review output' },
      { type: 'fixed', text: 'Fixed webhook signature validation failing on large PR payloads' },
    ],
  },
  {
    version: '1.2.0',
    date: 'December 2025',
    summary: 'Repository management and selective review opt-out.',
    changes: [
      { type: 'new', text: 'Repos page: view and manage all connected repositories' },
      { type: 'new', text: 'Enable/disable reviews per repository without uninstalling the GitHub App' },
      { type: 'improved', text: 'Faster webhook processing — average review latency reduced from 8s to 2.4s' },
      { type: 'improved', text: 'Better handling of non-code files (markdown, images, lock files are skipped)' },
      { type: 'fixed', text: 'Fixed OAuth callback error when GitHub App installation is on an org account' },
    ],
  },
  {
    version: '1.1.0',
    date: 'November 2025',
    summary: 'Billing page, account settings, and improved GitHub App permissions.',
    changes: [
      { type: 'new', text: 'Billing page with usage summary and API cost estimates' },
      { type: 'new', text: 'Settings page — manage API key, display name, and notification preferences' },
      { type: 'improved', text: 'GitHub App now requests minimal required permissions only' },
      { type: 'improved', text: 'Onboarding flow improved — new users guided to install GitHub App and add key' },
      { type: 'security', text: 'Added CSRF protection to all API routes' },
      { type: 'fixed', text: 'Fixed session not persisting after GitHub OAuth login on Safari' },
    ],
  },
  {
    version: '1.0.0',
    date: 'October 2025',
    summary: 'Initial public launch of CodeMouse.',
    changes: [
      { type: 'new', text: 'GitHub App integration with webhook-based PR review trigger' },
      { type: 'new', text: 'Automated PR reviews using OpenAI GPT-4o-mini' },
      { type: 'new', text: 'Structured review output: Critical, Security, Performance, and Quality sections' },
      { type: 'new', text: 'Dashboard with repository overview and recent reviews' },
      { type: 'new', text: 'GitHub OAuth login' },
      { type: 'new', text: 'API key management (OpenAI)' },
    ],
  },
]

const TYPE_CONFIG: Record<ChangeType, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  new: { icon: Sparkles, label: 'New', color: '#6366F1', bg: '#6366F115' },
  improved: { icon: Wrench, label: 'Improved', color: '#10B981', bg: '#10B98115' },
  fixed: { icon: Bug, label: 'Fixed', color: '#F59E0B', bg: '#F59E0B15' },
  security: { icon: Shield, label: 'Security', color: '#EF4444', bg: '#EF444415' },
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-page text-text-primary">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-page/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
              <Zap size={12} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm">CodeMouse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Docs</Link>
            <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Blog</Link>
            <Link href="/login" className="text-sm bg-accent text-white px-4 py-1.5 rounded-lg hover:bg-accent/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
            <Sparkles size={12} /> What&apos;s new
          </div>
          <h1 className="text-4xl font-bold mb-4">Changelog</h1>
          <p className="text-lg text-text-secondary">Product updates, improvements, and fixes — newest first.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-12">
          {(Object.entries(TYPE_CONFIG) as [ChangeType, typeof TYPE_CONFIG[ChangeType]][]).map(([, cfg]) => (
            <div key={cfg.label} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
              style={{ background: cfg.bg, color: cfg.color }}>
              <cfg.icon size={11} />
              {cfg.label}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />

          <div className="space-y-14">
            {RELEASES.map(release => (
              <div key={release.version} className="relative pl-8">
                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-accent bg-page" />

                {/* Version + date */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-lg font-bold">v{release.version}</span>
                  {release.label && (
                    <span className="text-xs font-medium bg-accent text-white px-2 py-0.5 rounded-full">
                      {release.label}
                    </span>
                  )}
                  <span className="text-sm text-text-muted">{release.date}</span>
                </div>

                {/* Summary */}
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">{release.summary}</p>

                {/* Changes */}
                <div className="space-y-2">
                  {release.changes.map((change, i) => {
                    const cfg = TYPE_CONFIG[change.type]
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          <cfg.icon size={9} />
                          {cfg.label}
                        </div>
                        <span className="text-sm text-text-secondary">{change.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stay updated */}
        <div className="mt-16 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Stay updated</h2>
          <p className="text-sm text-text-secondary mb-6">Follow us on Twitter or watch our GitHub repo for the latest updates.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://twitter.com/codemouseio" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
              Follow on Twitter <ArrowRight size={13} />
            </a>
            <Link href="/blog"
              className="inline-flex items-center gap-2 border border-border px-5 py-2 rounded-lg text-sm font-medium hover:border-accent/40 transition-colors">
              Read the blog
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
              <Zap size={10} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-text-secondary">CodeMouse</span>
            <span className="text-sm text-text-muted">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Docs', '/docs'], ['Blog', '/blog'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-text-primary transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
