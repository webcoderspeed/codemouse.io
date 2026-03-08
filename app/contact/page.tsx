import Link from 'next/link'
import { Zap, Mail, MessageSquare, Github, BookOpen, ArrowRight, Clock, Twitter } from 'lucide-react'

export default function ContactPage() {
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
            <Link href="/login" className="text-sm bg-accent text-white px-4 py-1.5 rounded-lg hover:bg-accent/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
            <MessageSquare size={12} /> Get in touch
          </div>
          <h1 className="text-4xl font-bold mb-4">Contact &amp; Support</h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            Got a question, bug report, or feature request? We&apos;re here to help.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Mail,
              color: '#6366F1',
              title: 'Email Support',
              desc: 'For billing questions, account issues, or anything that needs a private reply.',
              cta: 'support@codemouse.io',
              href: 'mailto:support@codemouse.io',
              badge: 'Replies within 24h',
            },
            {
              icon: Github,
              color: '#24292F',
              title: 'GitHub Issues',
              desc: 'Found a bug or want to request a feature? Open an issue on our public repo.',
              cta: 'Open an issue',
              href: 'https://github.com/codemouse-io/codemouse/issues',
              badge: 'Public · Open source',
            },
            {
              icon: Twitter,
              color: '#1DA1F2',
              title: 'Twitter / X',
              desc: 'Follow us for product updates, tips, and announcements.',
              cta: '@codemouseio',
              href: 'https://twitter.com/codemouseio',
              badge: 'Latest updates',
            },
          ].map(item => (
            <a key={item.title} href={item.href} target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}18` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-text-secondary leading-relaxed">{item.desc}</div>
              </div>
              <div className="mt-auto">
                <div className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
                  {item.cta} <ArrowRight size={12} />
                </div>
                <div className="text-xs text-text-muted mt-1">{item.badge}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Self-serve help */}
        <div className="rounded-2xl border border-border bg-surface p-8 mb-12">
          <h2 className="text-xl font-bold mb-2">Before you write in</h2>
          <p className="text-sm text-text-secondary mb-6">Most questions are answered in our documentation. Check these first:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: BookOpen, title: 'Getting Started Guide', href: '/docs#getting-started', desc: 'Install CodeMouse in 2 minutes' },
              { icon: Zap, title: 'API Key Setup', href: '/docs#api-keys', desc: 'Connect OpenAI, Anthropic, Gemini, or Groq' },
              { icon: MessageSquare, title: 'Understanding Reviews', href: '/docs#review-anatomy', desc: 'How to read CodeMouse review comments' },
              { icon: Clock, title: 'FAQ', href: '/docs#faq', desc: 'Answers to the most common questions' },
            ].map(item => (
              <Link key={item.title} href={item.href}
                className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-accent/40 hover:bg-page transition-all group">
                <item.icon size={16} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium group-hover:text-accent transition-colors">{item.title}</div>
                  <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Response time note */}
        <div className="flex items-start gap-3 p-5 rounded-xl bg-accent/5 border border-accent/20 text-sm">
          <Clock size={16} className="text-accent shrink-0 mt-0.5" />
          <div>
            <strong className="text-text-primary">Response times:</strong>
            <span className="text-text-secondary"> We aim to respond to all support emails within 24 hours on business days. GitHub issues are triaged within 48 hours. For urgent issues, include &quot;URGENT&quot; in your email subject.</span>
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
