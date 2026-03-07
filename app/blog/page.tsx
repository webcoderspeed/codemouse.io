import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog'
import { ArrowRight, Clock, Tag, Github, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — CodeMouse',
  description: 'Insights on AI code review, developer tools, engineering culture, and building software that scales. Written by the team behind CodeMouse.',
  openGraph: {
    title: 'Blog — CodeMouse',
    description: 'Insights on AI code review, developer tools, and engineering culture.',
    url: 'https://codemouse.io/blog',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Engineering':       'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Security':          'bg-red-500/10 text-red-400 border-red-500/20',
  'AI & Engineering':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Growth':            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Team & Culture':    'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS

  return (
    <div className="min-h-screen bg-page text-text-primary">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-page/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center">
              <Zap size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-text-primary">CodeMouse</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/blog"    className="text-sm text-text-primary font-medium">Blog</Link>
            <a
              href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold transition-colors"
            >
              <Github size={13} strokeWidth={2} />
              Install Free
            </a>
          </div>
        </div>
      </nav>

      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-400">From the team</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">
          The CodeMouse Blog
        </h1>
        <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
          Insights on AI code review, developer tools, engineering culture, and building software that doesn't break in production.
        </p>
      </div>

      {/* ── Featured Post ── */}
      <div className="max-w-5xl mx-auto px-6 mb-14">
        <Link href={`/blog/${featured.slug}`} className="group block rounded-2xl border border-border bg-surface hover:border-accent-500/40 hover:bg-accent-500/[0.03] transition-all duration-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[featured.category] ?? 'bg-white/5 text-text-muted border-border'}`}>
                {featured.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock size={11} strokeWidth={2} /> {featured.readTime}
              </span>
              <span className="text-xs text-text-muted">{featured.date}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 leading-snug group-hover:text-accent-400 transition-colors">
              {featured.title}
            </h2>
            <p className="text-text-muted leading-relaxed mb-6 max-w-3xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-accent-400">
              Read article <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* ── Post Grid ── */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-sm font-semibold text-text-primary">More articles</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-surface hover:border-accent-500/30 hover:bg-accent-500/[0.02] transition-all duration-200 p-6"
            >
              {/* Category + read time */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'bg-white/5 text-text-muted border-border'}`}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-text-muted ml-auto">
                  <Clock size={10} strokeWidth={2} /> {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-text-primary leading-snug mb-2 group-hover:text-accent-400 transition-colors flex-1">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <span className="text-[11px] text-text-muted">{post.date}</span>
                <span className="flex items-center gap-1 text-xs font-medium text-accent-400">
                  Read <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="rounded-2xl border border-accent-500/20 bg-gradient-to-r from-accent-500/10 to-violet-500/10 p-8 md:p-10 text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">Ready to try CodeMouse?</h3>
          <p className="text-text-muted mb-6 text-sm max-w-md mx-auto">
            Install the GitHub App in 2 minutes. Free forever — bring your own API key from any AI provider.
          </p>
          <a
            href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors"
          >
            <Github size={15} strokeWidth={2} />
            Install on GitHub — Free
          </a>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-accent-500 flex items-center justify-center">
              <Zap size={10} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-text-primary">CodeMouse</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-text-muted">
            <Link href="/"        className="hover:text-text-primary transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/blog"    className="hover:text-text-primary transition-colors">Blog</Link>
            <Link href="/login"   className="hover:text-text-primary transition-colors">Sign in</Link>
          </div>
          <p className="text-[11px] text-text-muted">© {new Date().getFullYear()} CodeMouse</p>
        </div>
      </footer>
    </div>
  )
}
