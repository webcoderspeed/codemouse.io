'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Installation { installation_id: number; account_login: string; account_type: string; plan: 'free' | 'pro'; reviews_used: number; reviews_limit: number }
interface ReviewLog    { id: string; repo_full_name: string; pr_number: number; pr_title: string; issues_found: number; verdict: string; created_at: string }
interface Invoice      { id: string; invoiceNumber: string; accountLogin: string; amount: number; currency: string; status: string; razorpayPaymentId: string; paidAt: string; createdAt: string }

declare global { interface Window { Razorpay: any } }

type Tab = 'repos' | 'reviews' | 'invoices'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [installations, setInstallations] = useState<Installation[]>([])
  const [reviews, setReviews]             = useState<ReviewLog[]>([])
  const [invoices, setInvoices]           = useState<Invoice[]>([])
  const [loading, setLoading]             = useState(true)
  const [paying, setPaying]               = useState<number | null>(null)
  const [tab, setTab]                     = useState<Tab>('repos')

  useEffect(() => { if (status === 'authenticated') fetchData() }, [status])

  async function fetchData() {
    setLoading(true)
    try {
      const [instRes, revRes, invRes] = await Promise.all([
        fetch('/api/dashboard/installations'),
        fetch('/api/dashboard/reviews'),
        fetch('/api/dashboard/invoices'),
      ])
      if (instRes.ok) setInstallations(await instRes.json())
      if (revRes.ok)  setReviews(await revRes.json())
      if (invRes.ok)  setInvoices(await invRes.json())
    } finally { setLoading(false) }
  }

  async function handleUpgrade(installationId: number) {
    setPaying(installationId)
    try {
      if (!window.Razorpay) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement('script')
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload = () => res(); s.onerror = () => rej()
          document.body.appendChild(s)
        })
      }
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installationId }),
      })
      const order = await orderRes.json()

      new window.Razorpay({
        key: order.keyId, amount: order.amount, currency: order.currency,
        name: 'CodeMouse', description: 'Pro Plan — Unlimited PR Reviews',
        order_id: order.orderId,
        prefill: { email: session?.user?.email ?? '', name: session?.user?.name ?? '' },
        theme: { color: '#22c55e' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              installationId, amount: order.amount,
            }),
          })
          const result = await verifyRes.json()
          if (verifyRes.ok) {
            alert(`🎉 Pro activated! Invoice: ${result.invoiceNumber}\nCheck your email for the receipt.`)
            fetchData(); setTab('invoices')
          } else {
            alert('Payment verification failed. Email support@codemouse.io')
          }
        },
        modal: { ondismiss: () => setPaying(null) },
      }).open()
    } catch { alert('Something went wrong. Try again.') }
    finally { setPaying(null) }
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (status === 'loading') return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
    </div>
  )

  // ── Not logged in ──────────────────────────────────────────────────────
  if (status === 'unauthenticated') return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🐭</div>
        <h1 className="text-3xl font-bold text-white mb-3">Sign in to CodeMouse</h1>
        <p className="text-gray-400 mb-8">Connect your GitHub account to install the bot and manage your repos.</p>
        <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>
        <p className="text-gray-500 text-sm mt-4"><Link href="/" className="hover:text-white">← Back to home</Link></p>
      </div>
    </div>
  )

  const githubInstallUrl = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 h-16 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐭</span>
          <Link href="/" className="font-bold text-white text-lg">CodeMouse</Link>
        </div>
        <div className="flex items-center gap-4">
          {session?.user?.image && <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />}
          <span className="text-sm text-gray-400 hidden sm:block">{session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-gray-500 hover:text-white transition-colors">Sign out</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage repos, reviews, and billing</p>
          </div>
          <a href={githubInstallUrl} target="_blank" rel="noreferrer"
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2">
            ＋ Add repos
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-8 w-fit">
          {(['repos', 'reviews', 'invoices'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
              }`}>
              {t === 'repos'    ? '🏠 Repos'    : ''}
              {t === 'reviews'  ? '🔍 Reviews'  : ''}
              {t === 'invoices' ? '🧾 Invoices' : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* ── REPOS TAB ── */}
            {tab === 'repos' && (
              <div>
                {installations.length === 0 ? (
                  <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">🐭</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Install CodeMouse on a repo</h2>
                    <p className="text-gray-400 mb-6">Connect GitHub repos to start getting automatic PR reviews.</p>
                    <a href={githubInstallUrl} target="_blank" rel="noreferrer"
                      className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                      Install GitHub App →
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {installations.map(inst => {
                      const isPro = inst.plan === 'pro'
                      const pct   = Math.min(100, Math.round((inst.reviews_used / inst.reviews_limit) * 100))
                      return (
                        <div key={inst.installation_id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xl">
                              {inst.account_type === 'Organization' ? '🏢' : '👤'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{inst.account_login}</p>
                              <p className="text-xs text-gray-500">{inst.account_type}</p>
                            </div>
                            <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${isPro ? 'bg-brand-900 text-brand-400 border border-brand-700' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                              {isPro ? '⭐ PRO' : 'FREE'}
                            </span>
                          </div>
                          {!isPro && (
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Reviews used</span>
                                <span className={pct >= 80 ? 'text-yellow-400' : ''}>{inst.reviews_used} / {inst.reviews_limit}</span>
                              </div>
                              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-brand-500'}`}
                                  style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )}
                          {isPro
                            ? <span className="text-sm text-brand-400">∞ Unlimited reviews</span>
                            : <button onClick={() => handleUpgrade(inst.installation_id)} disabled={paying === inst.installation_id}
                                className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex-shrink-0">
                                {paying === inst.installation_id ? 'Opening...' : '⭐ Upgrade ₹599/mo'}
                              </button>
                          }
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── REVIEWS TAB ── */}
            {tab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-12 text-center">
                    <p className="text-gray-400">No reviews yet. Open a PR on an installed repo to get started.</p>
                  </div>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
                          <th className="text-left px-5 py-3">Repository / PR</th>
                          <th className="text-left px-5 py-3 hidden md:table-cell">Issues</th>
                          <th className="text-left px-5 py-3 hidden md:table-cell">Verdict</th>
                          <th className="text-left px-5 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.map(r => (
                          <tr key={r.id} className="border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors">
                            <td className="px-5 py-3">
                              <p className="font-medium text-white truncate max-w-xs">{r.pr_title}</p>
                              <p className="text-xs text-gray-500">{r.repo_full_name} #{r.pr_number}</p>
                            </td>
                            <td className="px-5 py-3 hidden md:table-cell">
                              <span className={`font-medium ${r.issues_found > 0 ? 'text-yellow-400' : 'text-brand-400'}`}>
                                {r.issues_found === 0 ? '✅ None' : `⚠️ ${r.issues_found}`}
                              </span>
                            </td>
                            <td className="px-5 py-3 hidden md:table-cell">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${r.verdict === 'approve' ? 'bg-brand-900/50 text-brand-400' : r.verdict === 'request_changes' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                {r.verdict}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-500 text-xs">
                              {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── INVOICES TAB ── */}
            {tab === 'invoices' && (
              <div>
                {invoices.length === 0 ? (
                  <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-12 text-center">
                    <p className="text-gray-400">No invoices yet. Upgrade to Pro to see billing history here.</p>
                    <button onClick={() => setTab('repos')} className="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
                      Upgrade a repo →
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
                          <th className="text-left px-5 py-3">Invoice</th>
                          <th className="text-left px-5 py-3">Account</th>
                          <th className="text-left px-5 py-3">Amount</th>
                          <th className="text-left px-5 py-3 hidden md:table-cell">Status</th>
                          <th className="text-left px-5 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map(inv => (
                          <tr key={inv.id} className="border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors">
                            <td className="px-5 py-3">
                              <p className="font-mono text-xs text-brand-400">{inv.invoiceNumber}</p>
                              <p className="text-xs text-gray-500 font-mono">{inv.razorpayPaymentId?.slice(0, 20)}...</p>
                            </td>
                            <td className="px-5 py-3 text-white">@{inv.accountLogin}</td>
                            <td className="px-5 py-3 font-semibold text-white">₹{Number(inv.amount).toFixed(2)}</td>
                            <td className="px-5 py-3 hidden md:table-cell">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === 'paid' ? 'bg-brand-900/50 text-brand-400' : 'bg-red-900/50 text-red-400'}`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-500 text-xs">
                              {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
