import Link from 'next/link'
import { Zap, ArrowRight, GitPullRequest, Key, Github, Terminal, Settings, Webhook, BookOpen, ChevronRight, Code2, Shield, BarChart2, AlertTriangle } from 'lucide-react'

const NAV_SECTIONS = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'installation', label: 'Installation' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'api-keys', label: 'API Keys' },
  { id: 'review-anatomy', label: 'Understanding Reviews' },
  { id: 'webhook', label: 'Webhook Reference' },
  { id: 'faq', label: 'FAQ' },
]

const PROVIDERS = [
  { name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'], keyPrefix: 'sk-', cost: '$0.01–0.05 / review' },
  { name: 'Anthropic', models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'], keyPrefix: 'sk-ant-', cost: '$0.01–0.06 / review' },
  { name: 'Google Gemini', models: ['gemini-1.5-flash', 'gemini-1.5-pro'], keyPrefix: 'AIza', cost: '$0.005–0.03 / review' },
  { name: 'Groq', models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768'], keyPrefix: 'gsk_', cost: '~$0.001 / review' },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-page text-text-primary">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-page/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
              <Zap size={12} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm">CodeMouse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Blog</Link>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm bg-accent text-white px-4 py-1.5 rounded-lg hover:bg-accent/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-12">

        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Documentation</p>
            {NAV_SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className="block text-sm text-text-secondary hover:text-text-primary py-1.5 px-3 rounded-md hover:bg-surface transition-colors">
                {s.label}
              </a>
            ))}
            <div className="pt-4 border-t border-border mt-4">
              <a href="https://github.com/apps/codemouse-io" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors py-1.5 px-3">
                <Github size={14} /> GitHub App
              </a>
              <Link href="/contact" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors py-1.5 px-3">
                <BookOpen size={14} /> Support
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* Hero */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
              <BookOpen size={12} /> Documentation
            </div>
            <h1 className="text-4xl font-bold mb-4">CodeMouse Docs</h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
              Everything you need to set up automated AI code reviews on your GitHub repositories — from first install to advanced configuration.
            </p>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Github, title: 'Quick Start', desc: 'Install in 2 minutes', href: '#installation', color: '#6366F1' },
              { icon: Key, title: 'API Keys', desc: 'Connect your AI provider', href: '#api-keys', color: '#10B981' },
              { icon: GitPullRequest, title: 'Review Format', desc: 'Understand the output', href: '#review-anatomy', color: '#F59E0B' },
            ].map(item => (
              <a key={item.title} href={item.href}
                className="p-5 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all group">
                <item.icon size={20} style={{ color: item.color }} className="mb-3" />
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-xs text-text-muted">{item.desc}</div>
                <div className="flex items-center gap-1 text-xs text-accent mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more <ChevronRight size={12} />
                </div>
              </a>
            ))}
          </div>

          {/* Getting Started */}
          <section id="getting-started">
            <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
            <p className="text-text-secondary mb-6">CodeMouse is a GitHub App that automatically posts AI-powered code review comments on every pull request. You bring your own AI provider API key — CodeMouse itself is completely free.</p>
            <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
              <h3 className="font-semibold">Prerequisites</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                {['A GitHub account (individual or organization)', 'An API key from at least one supported AI provider (OpenAI, Anthropic, Gemini, or Groq)', 'Repositories where you want automated PR reviews'].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Installation */}
          <section id="installation">
            <h2 className="text-2xl font-bold mb-2">Installation</h2>
            <p className="text-text-secondary mb-6">Installing CodeMouse takes under 2 minutes and requires no code changes to your repositories.</p>

            <div className="space-y-4">
              {[
                {
                  step: '01', title: 'Create your account',
                  desc: 'Sign in at codemouse.io/login using your GitHub account. We use GitHub OAuth — no separate password needed.',
                },
                {
                  step: '02', title: 'Install the GitHub App',
                  desc: 'From your dashboard, click "Install GitHub App". You\'ll be redirected to GitHub to choose which repositories to grant access to. You can install on all repos or select specific ones.',
                },
                {
                  step: '03', title: 'Add your AI provider key',
                  desc: 'In Settings → API Keys, add your API key from OpenAI, Anthropic, Gemini, or Groq. Select your preferred model and save.',
                },
                {
                  step: '04', title: 'Open a pull request',
                  desc: 'That\'s it. Open any PR on an enabled repository and CodeMouse will post a detailed review comment within 60 seconds.',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-5 p-5 rounded-xl border border-border bg-surface">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{item.title}</div>
                    <div className="text-sm text-text-secondary">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Configuration */}
          <section id="configuration">
            <h2 className="text-2xl font-bold mb-2">Configuration</h2>
            <p className="text-text-secondary mb-6">All configuration happens through the Settings page in your dashboard — no config files, no YAML.</p>
            <div className="space-y-4">
              {[
                { icon: Key, title: 'API Keys', desc: 'Add and manage API keys for each supported AI provider. Keys are encrypted at rest with AES-256-GCM.' },
                { icon: Settings, title: 'Active Model', desc: 'Choose which provider and model to use for reviews. You can switch anytime — changes take effect on the next PR.' },
                { icon: Shield, title: 'Repository Access', desc: 'Manage which repositories CodeMouse can access through your GitHub App installation settings.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-border bg-surface">
                  <item.icon size={18} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-sm text-text-secondary">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* API Keys */}
          <section id="api-keys">
            <h2 className="text-2xl font-bold mb-2">API Keys</h2>
            <p className="text-text-secondary mb-6">
              CodeMouse uses a Bring-Your-Own-Key (BYOK) model. You pay your AI provider directly based on usage. CodeMouse itself is free.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 font-semibold text-text-secondary">Provider</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-secondary">Models</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-secondary">Key prefix</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-secondary">Est. cost / review</th>
                  </tr>
                </thead>
                <tbody>
                  {PROVIDERS.map((p, i) => (
                    <tr key={p.name} className={i < PROVIDERS.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-text-secondary">{p.models.join(', ')}</td>
                      <td className="px-4 py-3 font-mono text-xs bg-surface">{p.keyPrefix}</td>
                      <td className="px-4 py-3 text-text-secondary">{p.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20 text-sm text-text-secondary">
              <strong className="text-text-primary">Security note:</strong> All API keys are encrypted with AES-256-GCM before being stored. Keys are never logged, never transmitted to third parties, and are only decrypted in memory at review time.
            </div>
          </section>

          {/* Review Anatomy */}
          <section id="review-anatomy">
            <h2 className="text-2xl font-bold mb-2">Understanding Reviews</h2>
            <p className="text-text-secondary mb-6">CodeMouse posts a single structured comment on each PR. Here&apos;s how to read it.</p>

            <div className="space-y-4">
              {[
                { icon: AlertTriangle, color: '#EF4444', label: 'Critical', desc: 'Bugs, null dereferences, crashes, and runtime errors. These should be fixed before merging.' },
                { icon: Shield, color: '#F59E0B', label: 'Security', desc: 'OWASP Top 10 issues, hardcoded secrets, injection vulnerabilities, unsafe deserialization, and timing attacks.' },
                { icon: BarChart2, color: '#3B82F6', label: 'Performance', desc: 'N+1 queries, memory leaks, inefficient loops, unnecessary re-renders, and missing indexes.' },
                { icon: Code2, color: '#8B5CF6', label: 'Code Quality', desc: 'Readability issues, naming problems, code duplication, missing error handling, and style inconsistencies.' },
              ].map(item => (
                <div key={item.label} className="flex gap-4 p-5 rounded-xl border border-border bg-surface">
                  <item.icon size={18} style={{ color: item.color }} className="shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm mb-1">{item.label}</div>
                    <div className="text-sm text-text-secondary">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border overflow-hidden">
              <div className="bg-surface px-4 py-3 border-b border-border flex items-center gap-2">
                <Terminal size={14} className="text-text-muted" />
                <span className="text-xs text-text-muted font-mono">Example review comment</span>
              </div>
              <pre className="p-4 text-xs text-text-secondary overflow-x-auto leading-relaxed">{`## 🤖 CodeMouse Review

### 🔴 Critical — src/auth/session.ts:47
**Null dereference on unauthenticated request**
user.profile is accessed without verifying session state.
→ Fix: Add \`if (!user?.profile) return null\` before line 47.

### 🟡 Security — api/payments/webhook.ts:112
**Timing-unsafe signature comparison**
String equality on HMAC digest is vulnerable to timing attacks.
→ Fix: Use \`crypto.timingSafeEqual()\` for constant-time comparison.

### 🔵 Performance — components/UserList.tsx:34
**N+1 query inside render loop**
getUser() called per iteration — 100 users = 100 DB queries.
→ Fix: Batch with \`getUsers(ids)\` + Map for O(1) lookup.

---
*Reviewed by CodeMouse using gpt-4o-mini · 0.8s*`}</pre>
            </div>
          </section>

          {/* Webhook Reference */}
          <section id="webhook">
            <h2 className="text-2xl font-bold mb-2">Webhook Reference</h2>
            <p className="text-text-secondary mb-6">
              CodeMouse listens to GitHub&apos;s <code className="bg-surface px-1.5 py-0.5 rounded text-xs font-mono">pull_request</code> webhook events.
              The webhook endpoint is <code className="bg-surface px-1.5 py-0.5 rounded text-xs font-mono">POST /api/webhook</code>.
            </p>
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="font-semibold mb-3">Triggered events</h3>
                <div className="space-y-2 text-text-secondary">
                  <div className="flex gap-3"><code className="font-mono text-xs bg-page px-2 py-1 rounded">opened</code> <span>New PR created — triggers full review</span></div>
                  <div className="flex gap-3"><code className="font-mono text-xs bg-page px-2 py-1 rounded">synchronize</code> <span>New commits pushed — triggers re-review</span></div>
                  <div className="flex gap-3"><code className="font-mono text-xs bg-page px-2 py-1 rounded">reopened</code> <span>Closed PR re-opened — triggers review</span></div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="font-semibold mb-3">Security</h3>
                <p className="text-text-secondary">All webhook payloads are verified using GitHub&apos;s HMAC-SHA256 signature (<code className="font-mono text-xs">X-Hub-Signature-256</code> header) with your app&apos;s webhook secret. Requests with invalid or missing signatures are rejected with <code className="font-mono text-xs">401 Unauthorized</code>.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Does CodeMouse store my source code?', a: 'No. CodeMouse receives the PR diff from GitHub, passes it to your AI provider using your key, and discards it. Your source code is never stored on our servers.' },
                { q: 'How is my API key protected?', a: 'API keys are encrypted with AES-256-GCM using a unique server-side encryption key before being written to the database. They are only decrypted in memory during review processing.' },
                { q: 'What if I don\'t have an API key?', a: 'CodeMouse will post a comment on the PR explaining that no API key is configured, and link you to Settings to add one. No review will be attempted.' },
                { q: 'Can I use different models for different repos?', a: 'Currently CodeMouse uses your globally selected active model for all repositories. Per-repo model selection is on the roadmap.' },
                { q: 'How long does a review take?', a: 'Typically 15–60 seconds, depending on PR size and the AI provider\'s response time. Large PRs with 500+ changed lines may take slightly longer.' },
                { q: 'Is there a line limit on PR diffs?', a: 'CodeMouse reviews up to ~4,000 lines of diff per PR. For very large PRs, it reviews the most significant files first.' },
                { q: 'Can I disable reviews for specific branches?', a: 'Not yet via UI, but reviews are triggered by any PR opened against any base branch. Branch filtering is on the roadmap.' },
                { q: 'How do I remove CodeMouse from a repository?', a: 'Uninstall the GitHub App from your GitHub account settings under Applications → Installed GitHub Apps → CodeMouse → Configure.' },
              ].map(item => (
                <details key={item.q} className="group border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none font-medium text-sm hover:bg-surface transition-colors">
                    {item.q}
                    <ChevronRight size={14} className="text-text-muted group-open:rotate-90 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border">
                    <p className="pt-3">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-text-secondary mb-6 text-sm">Set up automated AI code reviews on your repositories in under 2 minutes.</p>
            <Link href="/login"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm">
              Start for free <ArrowRight size={14} />
            </Link>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-10 mt-16">
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
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Docs', '/docs'], ['Blog', '/blog'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-text-primary transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
