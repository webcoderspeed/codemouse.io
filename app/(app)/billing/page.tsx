import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { connectDB }        from '@/lib/mongoose'
import { Installation }     from '@/lib/models/Installation'
import { Invoice }          from '@/lib/models/Invoice'
import { Topbar }           from '@/components/layout/Topbar'
import { Badge }            from '@/components/ui/Badge'
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table'
import { UpgradeButton }    from '@/components/billing/UpgradeButton'
import {
  Zap, CheckCircle2, Receipt, CreditCard,
  ArrowRight, AlertCircle, ExternalLink,
} from 'lucide-react'
import mongoose from 'mongoose'

async function getBillingData(userId: string) {
  await connectDB()
  const uid      = new mongoose.Types.ObjectId(userId)
  const installs = await Installation.find({ userId: uid }).sort({ createdAt: -1 }).lean()
  const ids      = installs.map((i: any) => i.installationId)
  const invoices = await Invoice.find({ installationId: { $in: ids } })
    .sort({ createdAt: -1 }).limit(50).lean()
  return { installs, invoices }
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'paid')    return <Badge variant="success">Paid</Badge>
  if (status === 'pending') return <Badge variant="warning">Pending</Badge>
  return <Badge variant="neutral">{status}</Badge>
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  const { installs, invoices } = await getBillingData((session!.user as any).id)

  const proInstalls  = (installs as any[]).filter(i => i.plan === 'pro')
  const freeInstalls = (installs as any[]).filter(i => i.plan === 'free')
  const totalPaid    = (invoices as any[])
    .filter(inv => inv.status === 'paid')
    .reduce((s, inv) => s + (inv.amountInRupees ?? 0), 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Billing" subtitle="Manage your plans and payment history" />

      <div className="flex-1 p-6 space-y-6">

        {/* Current plan cards */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Pro plan summary */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Active Plans</h3>
              {proInstalls.length > 0 && (
                <Badge variant="accent" dot>Pro Active</Badge>
              )}
            </div>

            {proInstalls.length === 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-subtle/50 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-subtle border border-border flex items-center justify-center flex-shrink-0">
                    <Zap size={14} className="text-text-muted" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Free plan</p>
                    <p className="text-xs text-text-muted mt-0.5">30 PR reviews / month per repository</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-accent-500/20 bg-accent-subtle/10">
                  <div className="flex items-start gap-3 mb-3">
                    <Zap size={14} className="text-accent-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Upgrade to Pro — ₹599/repo/month</p>
                      <p className="text-xs text-text-muted mt-0.5">Unlimited reviews, analytics, and priority queue</p>
                    </div>
                  </div>
                  {freeInstalls.length > 0 ? (
                    <div className="space-y-2">
                      {(freeInstalls as any[]).slice(0, 3).map((inst: any) => (
                        <div key={inst.installationId} className="flex items-center justify-between">
                          <span className="text-xs text-text-secondary font-mono">{inst.accountLogin}</span>
                          <UpgradeButton installationId={inst.installationId} accountLogin={inst.accountLogin} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">Connect a repository first to upgrade.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {(proInstalls as any[]).map((inst: any) => (
                  <div key={inst.installationId} className="flex items-center justify-between p-3 rounded-xl bg-subtle/50 border border-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-accent-subtle/20 border border-accent-500/20 flex items-center justify-center">
                        <Zap size={11} className="text-accent-400" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium text-text-primary">{inst.accountLogin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="accent">Pro</Badge>
                      <span className="text-xs text-text-muted">{inst.reviewsUsed.toLocaleString()} reviews this month</span>
                    </div>
                  </div>
                ))}
                {freeInstalls.length > 0 && (
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-xs text-text-muted mb-2">Free repositories:</p>
                    {(freeInstalls as any[]).slice(0, 2).map((inst: any) => (
                      <div key={inst.installationId} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-text-secondary font-mono">{inst.accountLogin}</span>
                        <UpgradeButton installationId={inst.installationId} accountLogin={inst.accountLogin} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Spend summary */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Payment Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Paid',    value: `₹${totalPaid.toLocaleString()}`,   icon: CreditCard },
                { label: 'Invoices',      value: invoices.length,                     icon: Receipt    },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="bg-subtle/50 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                      <Icon size={11} strokeWidth={2} />
                      {stat.label}
                    </div>
                    <p className="text-xl font-bold tracking-tighter metric-value text-text-primary">{stat.value}</p>
                  </div>
                )
              })}
            </div>
            <div className="p-3.5 rounded-xl bg-subtle/30 border border-border/60 flex items-start gap-2.5">
              <AlertCircle size={13} className="text-text-muted flex-shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-xs text-text-muted leading-relaxed">
                All payments processed securely via Razorpay. Contact{' '}
                <a href="mailto:billing@codemouse.io" className="text-text-secondary hover:text-text-primary transition-colors">
                  billing@codemouse.io
                </a>{' '}
                for invoicing assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Invoice history */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Invoice History</h2>
              <p className="text-xs text-text-secondary mt-0.5">All payment records for your account</p>
            </div>
          </div>

          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 rounded-xl bg-subtle border border-border flex items-center justify-center mb-3">
                <Receipt size={16} className="text-text-muted" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-text-secondary mb-1">No invoices yet</p>
              <p className="text-xs text-text-muted max-w-xs">Invoices will appear here after your first payment.</p>
            </div>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Invoice</Th>
                  <Th>Repository</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </Thead>
              <Tbody>
                {(invoices as any[]).map(inv => (
                  <Tr key={inv._id.toString()}>
                    <Td>
                      <p className="text-sm font-mono text-text-primary">{inv.invoiceNumber}</p>
                      {inv.razorpayPaymentId && (
                        <p className="text-xs text-text-muted mt-0.5 font-mono">{inv.razorpayPaymentId.slice(0, 18)}…</p>
                      )}
                    </Td>
                    <Td>
                      <span className="text-xs text-text-secondary font-mono">{inv.accountLogin}</span>
                    </Td>
                    <Td>
                      <span className="text-sm font-semibold metric-value text-text-primary">
                        ₹{(inv.amountInRupees ?? 0).toLocaleString()}
                      </span>
                    </Td>
                    <Td><StatusBadge status={inv.status} /></Td>
                    <Td>
                      <span className="text-xs text-text-muted">
                        {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>

      </div>
    </div>
  )
}
