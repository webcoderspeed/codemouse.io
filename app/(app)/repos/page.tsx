import { getServerSession }  from 'next-auth'
import { authOptions }        from '@/lib/auth'
import { connectDB }          from '@/lib/mongoose'
import { Installation }       from '@/lib/models/Installation'
import { ReviewLog }          from '@/lib/models/ReviewLog'
import { Topbar }             from '@/components/layout/Topbar'
import { Badge }              from '@/components/ui/Badge'
import {
  GitBranch, GitPullRequest, Bug, Zap,
  ExternalLink, Plus, ArrowRight, CheckCircle2,
} from 'lucide-react'
import Link    from 'next/link'
import mongoose from 'mongoose'

async function getRepos(userId: string) {
  await connectDB()
  const uid      = new mongoose.Types.ObjectId(userId)
  const installs = await Installation.find({ userId: uid }).sort({ createdAt: -1 }).lean()

  const enriched = await Promise.all(
    (installs as any[]).map(async inst => {
      const [totalReviews, issueAgg, lastReview] = await Promise.all([
        ReviewLog.countDocuments({ installationId: inst.installationId }),
        ReviewLog.aggregate([
          { $match: { installationId: inst.installationId } },
          { $group: { _id: null, totalIssues: { $sum: '$issuesFound' } } },
        ]),
        ReviewLog.findOne({ installationId: inst.installationId }).sort({ createdAt: -1 }).lean(),
      ])
      return {
        ...inst,
        totalReviews,
        totalIssues:  issueAgg[0]?.totalIssues ?? 0,
        lastReviewAt: (lastReview as any)?.createdAt ?? null,
      }
    })
  )

  return enriched
}

function UsageBar({ used, limit, plan }: { used: number; limit: number; plan: string }) {
  if (plan === 'pro') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <CheckCircle2 size={11} className="text-success" strokeWidth={2} />
        Unlimited reviews
      </div>
    )
  }
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const color = pct >= 90 ? 'bg-danger' : pct >= 75 ? 'bg-warning' : 'bg-accent-500'
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-text-muted">
        <span>{used} / {limit} reviews used</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 bg-subtle rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function ReposPage() {
  const session = await getServerSession(authOptions)
  const repos   = await getRepos((session!.user as any).id)

  const githubInstallUrl = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        title="Repositories"
        subtitle={`${repos.length} connected repositor${repos.length === 1 ? 'y' : 'ies'}`}
        actions={
          <a
            href={githubInstallUrl}
            target="_blank" rel="noreferrer"
            className="btn-primary btn-base text-xs"
          >
            <Plus size={13} />
            Add repository
          </a>
        }
      />

      <div className="flex-1 p-6">
        {repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-14 h-14 rounded-2xl bg-subtle border border-border flex items-center justify-center mb-5">
              <GitBranch size={24} className="text-text-muted" strokeWidth={1.5} />
            </div>
            <p className="text-base font-semibold text-text-secondary mb-2">No repositories connected</p>
            <p className="text-sm text-text-muted max-w-sm mb-6">
              Install CodeMouse on a GitHub repository to start getting automated PR reviews.
            </p>
            <a href={githubInstallUrl} target="_blank" rel="noreferrer" className="btn-primary btn-base text-sm">
              <Plus size={14} />
              Connect your first repository
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {(repos as any[]).map(repo => (
              <div key={repo.installationId} className="card p-5 flex flex-col gap-4 hover:border-border-hover transition-colors">

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-subtle border border-border flex items-center justify-center flex-shrink-0">
                      <GitBranch size={14} className="text-text-muted" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{repo.accountLogin}</p>
                      <p className="text-xs text-text-muted capitalize">{repo.accountType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {repo.plan === 'pro'
                      ? <Badge variant="accent">Pro</Badge>
                      : <Badge variant="neutral">Free</Badge>
                    }
                    <a
                      href={`https://github.com/${repo.accountLogin}`}
                      target="_blank" rel="noreferrer"
                      className="w-6 h-6 flex items-center justify-center rounded-md text-text-muted hover:text-text-secondary transition-colors"
                    >
                      <ExternalLink size={12} strokeWidth={2} />
                    </a>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: GitPullRequest, label: 'Reviews',      value: repo.totalReviews },
                    { icon: Bug,            label: 'Issues Found', value: repo.totalIssues  },
                  ].map(stat => {
                    const Icon = stat.icon
                    return (
                      <div key={stat.label} className="bg-subtle/50 rounded-lg px-3 py-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                          <Icon size={11} strokeWidth={2} />
                          {stat.label}
                        </div>
                        <p className="text-lg font-bold tracking-tighter metric-value text-text-primary">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Usage bar */}
                <UsageBar used={repo.reviewsUsed} limit={repo.reviewsLimit} plan={repo.plan} />

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <p className="text-xs text-text-muted">
                    {repo.lastReviewAt
                      ? `Last review ${new Date(repo.lastReviewAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : 'No reviews yet'
                    }
                  </p>
                  {repo.plan === 'free' && (
                    <Link href="/billing" className="flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 transition-colors font-medium">
                      <Zap size={11} strokeWidth={2} />
                      Upgrade
                    </Link>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
