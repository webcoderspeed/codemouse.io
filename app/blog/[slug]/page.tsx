import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getBlogPost, getRelatedPosts } from '@/lib/blog'
import { ArrowLeft, ArrowRight, Clock, Github, Zap, Tag } from 'lucide-react'
import type { Metadata } from 'next'

/* ── Static params for SSG ── */
export function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

/* ── Per-post metadata ── */
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}
  return {
    title:       `${post.title} — CodeMouse Blog`,
    description: post.excerpt,
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      url:         `https://codemouse.io/blog/${post.slug}`,
      type:        'article',
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.excerpt,
    },
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Engineering':       'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Security':          'bg-red-500/10 text-red-400 border-red-500/20',
  'AI & Engineering':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Growth':            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Team & Culture':    'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post    = getBlogPost(params.slug)
  if (!post) notFound()

  const related = getRelatedPosts(params.slug, 3)

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
            <Link href="/blog"    className="text-sm text-text-muted hover:text-text-primary transition-colors">Blog</Link>
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

      {/* ── Article ── */}
      <article className="max-w-3xl mx-auto px-6 pt-14 pb-20">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-10"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          All articles
        </Link>

        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'bg-white/5 text-text-muted border-border'}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={11} strokeWidth={2} /> {post.readTime}
          </span>
          <span className="text-xs text-text-muted">{post.date}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-4">
          {post.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-text-muted leading-relaxed mb-10 border-l-2 border-accent-500/40 pl-4">
          {post.subtitle}
        </p>

        {/* Divider */}
        <div className="h-px bg-border mb-10" />

        {/* Content */}
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <div className="h-px bg-border mt-14 mb-10" />

        {/* CTA */}
        <div className="rounded-2xl border border-accent-500/20 bg-gradient-to-r from-accent-500/10 to-violet-500/10 p-7 text-center">
          <h3 className="text-base font-bold text-text-primary mb-1.5">Try CodeMouse on your next PR</h3>
          <p className="text-text-muted mb-5 text-sm max-w-sm mx-auto">
            Free AI code review on every pull request. Bring your own API key — no subscription needed.
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
      </article>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-sm font-semibold text-text-primary">More from the blog</h2>
              <div className="flex-1 h-px bg-border" />
              <Link href="/blog" className="flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 transition-colors">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(rp => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-surface hover:border-accent-500/30 hover:bg-accent-500/[0.02] transition-all p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[rp.category] ?? 'bg-white/5 text-text-muted border-border'}`}>
                      {rp.category}
                    </span>
                    <span className="text-[11px] text-text-muted ml-auto">{rp.readTime}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary leading-snug mb-2 group-hover:text-accent-400 transition-colors flex-1">
                    {rp.title}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <span className="text-[11px] text-text-muted">{rp.date}</span>
                    <span className="flex items-center gap-1 text-xs text-accent-400">
                      Read <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

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
