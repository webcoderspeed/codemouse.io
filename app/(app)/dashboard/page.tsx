import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Installation } from '@/lib/models/Installation'
import { ReviewLog }    from '@/lib/models/ReviewLog'
import { Invoice }      from '@/lib/models/Invoice'
import { Topbar }       from '@/components/layout/Topbar'
import { MetricCard }   from '@/components/ui/MetricCard'
import { Badge }        from '@/components/ui/Badge'
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table'
import { formatRelative, formatDate } from '@/lib/utils'
import Link from 'next/link'
import mongoose from 'mongoose'
import {
  GitPullRequest, GitBranch, Bug, Shield, TrendingUp,
  ArrowRight, Activity, Plus, ExternalLink, Zap,
} from 'lucide-react'

async function getDashboardData(userId: string) {
  await connectDB()
  const uid = new mongoose.Types.ObjectId(userId)

  const installations = await Installation.find({ userId: uid }).sort({ createdAt: -1 }).lean()
  const ids = installations.map(i => i.installationId)

  const [totalReviews, recentReviews, issueAgg] = await Promise.all([
    ReviewLog.countDocuments({ installationId: { $in: ids } }),
    ReviewLog.find({ installationId: { $in: ids } }).sort({ createdAt: -1 }).limit(8).lean(),
    ReviewLog.aggregate([
      { $match: { installationId: { $in: ids } } },
      { $group: { _id: null, totalIssues: { $sum: '$issuesFound' }, avgIssues: { $avg: '$issuesFound' } } },
    ]),
  ])

  const totalIssues  = issueAgg[0]?.totalIssues ?? 0
  const avgIssues    = issueAgg[0]?.avgIssues ?? 0
  return { installations, totalReviews, recentReviews, totalIssues, avgIssues }
}

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === 'approve')         return <Badge variant="success">Approved</Badge>
  if (verdict === 'request_changes') return <Badge variant="danger">Changes</Badge>
  return <Badge variant="neutral">Comment</Badge>
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId  = (session!.user as any).id

  const { installations, totalReviews, recentReviews, totalIssues } = await getDashboardData(userId)

  const githubInstallUrl = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        title="Overview"
        subtitle={`Welcome back, ${session!.user?.name?.split(' ')[0] ?? 'there'}`}
        actions={
          <a href={githubInstallUrl} target="_blank" rel="noreferrer"
            className="btn-primary btn-base text-xs">
            <Plus size={13} />
            Add repository
          </a>
        }
      />

      <div className="flex-1 p-6 space-y-6">

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Repositories"
            value={installations.length}
            icon={GitBranch}
          />
          <MetricCard
            label="Pull Requests Reviewed"
            value={totalReviews}
            icon={GitPullRequest}
            accent
          />
          <MetricCard
            label="Issues Detected"
            value={totalIssues}
            icon={Bug}
          />
          <MetricCard
            label="Total Reviews"
            value={totalReviews}
            suffix="all time"
            icon={Zap}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Reviews */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Recent Reviews</h2>
                <p className="text-xs text-text-secondary mt-0.5">Across all connected repositories</p>
              </div>
              <Link href="/reviews" className="btn-ghost btn-sm text-xs">
                View all
                <ArrowRight size={12} />
              </Link>
            </div>

            {recentReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-subtle border border-border flex items-center justify-center mb-3">
                  <GitPullRequest size={18} className="text-text-muted" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-text-secondary mb-1">No reviews yet</p>
                <p className="text-xs text-text-muted max-w-xs">
                  Install CodeMouse on a repository, then open a pull request to trigger your first automated review.
                </p>
                <a href={githubInstallUrl} target="_blank" rel="noreferrer"
                  className="btn-secondary btn-sm mt-4 text-xs">
                  Install on a repository
                </a>
              </div>
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Pull Request</Th>
                    <Th>Repository</Th>
                    <Th>Issues</Th>
                    <Th>Verdict</Th>
                    <Th>When</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {recentReviews.map((r: any) => (
                    <Tr key={r._id.toString()}>
                      <Td>
                        <span className="font-medium text-text-primary text-sm truncate max-w-[180px] block">
                          {r.prTitle || `PR #${r.prNumber}`}
                        </span>
                        <span className="text-xs text-text-muted">#{r.prNumber}</span>
                      </Td>
                      <Td>
                        <span className="text-xs text-text-secondary font-mono">{r.repoFullName.split('/')[1]}</span>
                      </Td>
                      <Td>
                        <span className={`text-sm font-semibold metric-value ${r.issuesFound > 0 ? 'text-warning-text' : 'text-success-text'}`}>
                          {r.issuesFound}
                        </span>
                      </Td>
                      <Td><VerdictBadge verdict={r.verdict} /></Td>
                      <Td>
                        <span className="text-xs text-text-muted">{formatRelative(r.createdAt)}</span>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </div>

          {/* Repositories panel */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Repositories</h2>
              <Link href="/repos" className="btn-ghost btn-sm text-xs">
                Manage
                <ArrowRight size={12} />
              </Link>
            </div>

            {installations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-subtle border border-border flex items-center justify-center mb-3">
                  <GitBranch size={18} className="text-text-muted" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-text-secondary mb-3">No repositories connected</p>
                <a href={githubInstallUrl} target="_blank" rel="noreferrer"
                  className="btn-primary btn-sm text-xs">
                  <Plus size={12} />
                  Connect first repo
                </a>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {installations.slice(0, 6).map((inst: any) => (
                  <div key={inst.installationId} className="px-5 py-3.5 hover:bg-subtle/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <GitBranch size={13} className="text-text-muted flex-shrink-0" strokeWidth={1.75} />
                        <span className="text-sm font-medium text-text-primary truncate">{inst.accountLogin}</span>
                      </div>
                      <span className="text-xs text-text-muted metric-value">{inst.reviewsUsed.toLocaleString()} reviews</span>
                    </div>
                  </div>
                ))}
                {installations.length > 6 && (
                  <div className="px-5 py-3 text-center">
                    <Link href="/repos" className="text-xs text-text-secondary hover:text-accent-400 transition-colors">
                      +{installations.length - 6} more repositories
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {installations.length > 0 && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Quick actions</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Activity, label: 'View analytics', desc: 'Code quality trends and developer insights', href: '/analytics' },
                { icon: Shield, label: 'Security report', desc: 'Review all flagged security issues', href: '/reviews?type=security' },
                { icon: TrendingUp, label: 'Performance report', desc: 'Identify recurring performance patterns', href: '/reviews?type=performance' },
              ].map(action => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}
                    className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] border border-border hover:border-border-hover bg-overlay hover:bg-subtle/50 transition-all duration-150 group">
                    <div className="w-8 h-8 rounded-lg bg-subtle border border-border flex items-center justify-center flex-shrink-0 group-hover:border-accent-500/30 group-hover:bg-accent-subtle/30 transition-all">
                      <Icon size={15} className="text-text-secondary group-hover:text-accent-400 transition-colors" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{action.label}</p>
                      <p className="text-xs text-text-secondary leading-snug mt-0.5">{action.desc}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
