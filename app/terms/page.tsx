import Link from 'next/link'
import { Zap, FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — CodeMouse',
  description: 'The terms governing your use of CodeMouse.',
}

const LAST_UPDATED = 'March 1, 2026'

export default function TermsPage() {
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
            <FileText size={12} /> Legal
          </div>
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-text-muted text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <p className="text-sm text-text-secondary mb-10 leading-relaxed">
          Please read these Terms of Service (&quot;Terms&quot;) carefully before using CodeMouse at codemouse.io (the &quot;Service&quot;) operated by CodeMouse, Inc. (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using the Service, you agree to be bound by these Terms.
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-text-secondary">

          {[
            {
              title: '1. Acceptance of Terms',
              paragraphs: [
                'By creating an account or using the Service, you confirm that you are at least 13 years old, have the legal authority to enter into these Terms, and agree to be bound by them. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.',
              ],
            },
            {
              title: '2. Description of Service',
              paragraphs: [
                'CodeMouse is an automated code review tool that integrates with GitHub via a GitHub App. It processes pull request diffs using AI language models and posts structured review comments. The Service operates on a Bring-Your-Own-Key (BYOK) model — you must provide and pay for your own API keys from supported AI providers.',
                'CodeMouse itself is provided free of charge. You are solely responsible for any costs incurred with your AI provider.',
              ],
            },
            {
              title: '3. User Accounts',
              paragraphs: [
                'You must sign in using a valid GitHub account. You are responsible for maintaining the confidentiality of your account and for all activity that occurs under it. You must notify us immediately at support@codemouse.io if you suspect unauthorized access to your account.',
                'We reserve the right to terminate accounts that violate these Terms or that have been inactive for more than 12 consecutive months.',
              ],
            },
            {
              title: '4. API Keys and Third-Party Services',
              paragraphs: [
                'You are responsible for the API keys you provide to CodeMouse. You must ensure your use of those keys complies with the terms of service of the respective AI providers (OpenAI, Anthropic, Google, Groq, or others).',
                'CodeMouse encrypts and stores your API keys to facilitate the Service. You may delete your keys at any time from Settings. We are not responsible for any charges, rate limits, or policy violations incurred with your AI provider.',
              ],
            },
            {
              title: '5. Acceptable Use',
              paragraphs: [
                'You agree not to: use the Service for any unlawful purpose; attempt to reverse-engineer, decompile, or extract the source code of the Service; use the Service to process content that infringes third-party intellectual property rights; attempt to gain unauthorized access to any part of the Service or its infrastructure; use the Service to generate, store, or transmit malicious code; or resell, sublicense, or commercially redistribute the Service without our written consent.',
              ],
            },
            {
              title: '6. Intellectual Property',
              paragraphs: [
                'The Service, including its interface, design, and underlying technology, is owned by CodeMouse, Inc. and protected by intellectual property laws. You retain all rights to your source code and pull request content — we claim no ownership over it.',
                'Review comments generated by the Service are provided as-is. You may use, share, or publish those comments freely.',
              ],
            },
            {
              title: '7. Privacy',
              paragraphs: [
                'Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review it at codemouse.io/privacy.',
              ],
            },
            {
              title: '8. Disclaimer of Warranties',
              paragraphs: [
                'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.',
                'We do not warrant that: the Service will be uninterrupted or error-free; review comments will be accurate, complete, or fit for any particular purpose; or that any bugs or security vulnerabilities detected (or not detected) by the Service are exhaustive.',
                'AI-generated code reviews are advisory only. You are solely responsible for decisions made based on review output.',
              ],
            },
            {
              title: '9. Limitation of Liability',
              paragraphs: [
                'TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODEMOUSE, INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, REVENUE, OR PROFITS, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.',
                'OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE GREATER OF $50 USD OR THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.',
              ],
            },
            {
              title: '10. Indemnification',
              paragraphs: [
                'You agree to indemnify and hold harmless CodeMouse, Inc., its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.',
              ],
            },
            {
              title: '11. Modifications to the Service',
              paragraphs: [
                'We reserve the right to modify, suspend, or discontinue the Service (or any part of it) at any time with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation.',
              ],
            },
            {
              title: '12. Changes to Terms',
              paragraphs: [
                'We may revise these Terms from time to time. We will notify you of material changes by posting the updated Terms at codemouse.io/terms and updating the "Last updated" date. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.',
              ],
            },
            {
              title: '13. Governing Law',
              paragraphs: [
                'These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict-of-law provisions. Any disputes shall be resolved exclusively in the federal or state courts located in Delaware.',
              ],
            },
            {
              title: '14. Contact',
              paragraphs: [
                'If you have questions about these Terms, please contact us at legal@codemouse.io.',
              ],
            },
          ].map(section => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-text-primary mb-3">{section.title}</h2>
              <div className="space-y-3">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
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
