import Link from 'next/link'
import { Zap, Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — CodeMouse',
  description: 'How CodeMouse collects, uses, and protects your data.',
}

const LAST_UPDATED = 'March 1, 2026'

export default function PrivacyPage() {
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

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
            <Shield size={12} /> Legal
          </div>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-text-muted text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose-wrapper space-y-10 text-sm leading-relaxed text-text-secondary">

          <section>
            <p className="text-base text-text-primary">
              CodeMouse (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information when you use codemouse.io (the &quot;Service&quot;).
            </p>
          </section>

          {[
            {
              title: '1. Information We Collect',
              content: [
                {
                  subtitle: 'Account Information',
                  text: 'When you sign in with GitHub, we receive your GitHub user ID, username, display name, email address, and avatar URL. We use this to create and manage your CodeMouse account.',
                },
                {
                  subtitle: 'GitHub Installation Data',
                  text: 'When you install the CodeMouse GitHub App, we receive the installation ID and a list of repositories you have granted access to. This is required to route incoming webhook events to the correct account.',
                },
                {
                  subtitle: 'API Keys',
                  text: 'You may provide API keys from third-party AI providers (OpenAI, Anthropic, Google, Groq). These keys are encrypted at rest using AES-256-GCM with a server-managed key and are never stored in plaintext. They are only decrypted in memory at the time a review is processed.',
                },
                {
                  subtitle: 'Pull Request Diffs',
                  text: 'When a pull request event is received from GitHub, we temporarily process the diff to generate a review. We do NOT store pull request diffs or source code. The diff is passed to your configured AI provider using your own API key and is discarded immediately after the review is posted.',
                },
                {
                  subtitle: 'Usage and Analytics Data',
                  text: 'We collect metadata about reviews performed — such as repository name, timestamp, model used, and whether the review succeeded — to power your analytics dashboard and improve the Service. This metadata does not include source code.',
                },
                {
                  subtitle: 'Log Data',
                  text: 'Like most web services, our servers automatically record standard log information including IP address, browser type, pages visited, and timestamps. Logs are retained for up to 30 days.',
                },
              ],
            },
            {
              title: '2. How We Use Your Information',
              content: [
                { subtitle: null, text: 'We use the information we collect to: provide, operate, and improve the Service; authenticate you and manage your account; process pull request reviews using your AI provider key; send transactional emails (e.g., account notifications); respond to your support requests; and monitor for abuse and enforce our Terms of Service.' },
                { subtitle: null, text: 'We do not sell, rent, or trade your personal information to third parties. We do not use your source code or PR diffs to train AI models.' },
              ],
            },
            {
              title: '3. Data Sharing',
              content: [
                {
                  subtitle: 'AI Providers',
                  text: 'Pull request diffs are transmitted to the AI provider you have configured (OpenAI, Anthropic, Google, or Groq) using your own API key. This transmission is governed by that provider\'s privacy policy. We do not share your data with any other AI providers.',
                },
                {
                  subtitle: 'GitHub',
                  text: 'We interact with GitHub\'s API to read PR diffs and post review comments. This is governed by GitHub\'s Privacy Policy.',
                },
                {
                  subtitle: 'Infrastructure Providers',
                  text: 'We use Vercel for hosting and MongoDB Atlas for database storage. Both are under data processing agreements and adhere to industry-standard security practices.',
                },
                {
                  subtitle: 'Legal Requirements',
                  text: 'We may disclose your information if required to do so by law or in good faith belief that such action is necessary to comply with a legal obligation, protect the rights or safety of CodeMouse or others, or investigate potential violations of our Terms.',
                },
              ],
            },
            {
              title: '4. Data Retention',
              content: [
                { subtitle: null, text: 'Account data is retained for as long as your account is active. Review metadata (timestamps, model used, success/failure) is retained for up to 12 months to power your analytics dashboard. API keys are retained until you delete them from Settings. You may delete your account at any time by contacting support@codemouse.io, at which point all personally identifiable information will be deleted within 30 days.' },
              ],
            },
            {
              title: '5. Security',
              content: [
                { subtitle: null, text: 'We take security seriously. API keys are encrypted with AES-256-GCM. All data in transit is encrypted using TLS 1.2+. Database access is restricted to application services. We undergo periodic security reviews. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.' },
              ],
            },
            {
              title: '6. Your Rights',
              content: [
                { subtitle: null, text: 'Depending on your jurisdiction, you may have rights to access the personal data we hold about you; correct inaccurate data; delete your account and personal data; object to certain processing; and data portability. To exercise any of these rights, email us at privacy@codemouse.io. We will respond within 30 days.' },
              ],
            },
            {
              title: '7. Cookies',
              content: [
                { subtitle: null, text: 'We use a session cookie to keep you logged in (set by NextAuth). We do not use advertising cookies or third-party tracking cookies. We may use a minimal analytics solution in the future, which will be disclosed in an update to this policy.' },
              ],
            },
            {
              title: '8. Children\'s Privacy',
              content: [
                { subtitle: null, text: 'The Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.' },
              ],
            },
            {
              title: '9. Changes to This Policy',
              content: [
                { subtitle: null, text: 'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after changes become effective constitutes your acceptance of the revised policy.' },
              ],
            },
            {
              title: '10. Contact',
              content: [
                { subtitle: null, text: 'Questions about this Privacy Policy? Contact us at privacy@codemouse.io or by mail at CodeMouse, Inc., [Address].' },
              ],
            },
          ].map(section => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-text-primary mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {item.subtitle && <h3 className="font-medium text-text-primary mb-1">{item.subtitle}</h3>}
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

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
