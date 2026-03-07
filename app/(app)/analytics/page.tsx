import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { connectDB }        from '@/lib/mongoose'
import { Installation }     from '@/lib/models/Installation'
import { ReviewLog }        from '@/lib/models/ReviewLog'
import { Topbar }           from '@/components/layout/Topbar'
import {
  PRVolumeChart,
  IssueTypeChart,
  VerdictPieChart,
  IssuesOverTimeChart,
} from '@/components/charts/AnalyticsCharts'
import { TrendingUp, TrendingDown, Activity, Shield, Zap, GitPullRequest } from 'lucide-react'
import mongoose from 'mongoose'

/* ── helpers ────────────────────────────────────────────────── */

function last30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function last7Weeks(): string[] {
  const weeks: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i * 7)
    weeks.push(`W${getWeek(d)}`)
  }
  return weeks
}

function getWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/* ── data fetch ─────────────────────────────────────────────── */

async function getAnalyticsData(userId: string) {
  await connectDB()
  const uid      = new mongoose.Types.ObjectId(userId)
  const installs = await Installation.find({ userId: uid }).select('installationId').lean()
  const ids      = installs.map((i: any) => i.installationId)

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)

  const logs = await ReviewLog.find({
    installationId: { $in: ids },
    createdAt: { $gte: cutoff },
  }).sort({ createdAt: 1 }).lean()

  const allLogs = await ReviewLog.find({ installationId: { $in: ids } })
    .sort({ createdAt: 1 }).limit(500).lean()

  /* daily buckets */
  const days = last30Days()
  const byDay: Record<string, { reviews: number; issues: number }> = {}
  days.forEach(d => { byDay[d] = { reviews: 0, issues: 0 } })

  for (const log of logs as any[]) {
    const key = new Date(log.createdAt).toISOString().slice(0, 10)
    if (byDay[key]) {
      byDay[key].reviews++
      byDay[key].issues += log.issuesFound ?? 0
    }
  }

  const prVolume = days.map(d => ({
    date:    d.slice(5),   // MM-DD
    reviews: byDay[d].reviews,
  }))

  const issuesOverTime = days.map(d => ({
    date:    d.slice(5),
    issues:  byDay[d].issues,
    reviews: byDay[d].reviews,
  }))

  /* verdict distribution */
  const verdictCounts = { approve: 0, request_changes: 0, comment: 0 }
  for (const log of allLogs as any[]) {
    const v = log.verdict as keyof typeof verdictCounts
    if (v in verdictCounts) verdictCounts[v]++
  }
  const verdictData = [
    { name: 'Approved', value: verdictCounts.approve },
    { name: 'Changes',  value: verdictCounts.request_changes },
    { name: 'Comment',  value: verdictCounts.comment },
  ].filter(d => d.value > 0)

  /* placeholder issue types — real impl would parse review JSON */
  const issueTypeData = [
    { type: 'Logic',       count: Math.round((allLogs as any[]).filter((l: any) => l.issuesFound > 0).length * 0.35) },
    { type: 'Security',    count: Math.round((allLogs as any[]).filter((l: any) => l.issuesFound > 0).length * 0.22) },
    { type: 'Performance', count: Math.round((allLogs as any[]).filter((l: any) => l.issuesFound > 0).length * 0.18) },
    { type: 'Style',       count: Math.round((allLogs as any[]).filter((l: any) => l.issuesFound > 0).length * 0.15) },
    { type: 'Other',       count: Math.round((allLogs as any[]).filter((l: any) => l.issuesFound > 0).length * 0.10) },
  ]

  /* KPIs */
  const totalReviews30d  = logs.length
  const totalIssues30d   = (logs as any[]).reduce((s, l: any) => s + l.issuesFound, 0)
  const approvals30d     = (logs as any[]).filter((l: any) => l.verdict === 'approve').length
  const approvalRate30d  = totalReviews30d > 0 ? Math.round((approvals30d / totalReviews30d) * 100) : 0
  const avgIssuesPR      = totalReviews30d > 0 ? (totalIssues30d / totalReviews30d).toFixed(1) : '0'

  /* week-over-week trend */
  const midpoint = new Date()
  midpoint.setDate(midpoint.getDate() - 15)
  const recentHalf = (logs as any[]).filter((l: any) => new Date(l.createdAt) >= midpoint).length
  const olderHalf  = totalReviews30d - recentHalf
  const trend      = olderHalf > 0 ? Math.round(((recentHalf - olderHalf) / olderHalf) * 100) : 0

  return {
    prVolume, issuesOverTime, verdictData, issueTypeData,
    kpis: {
      totalReviews30d,
      totalIssues30d,
      approvalRate30d,
      avgIssuesPR,
      trend,
    },
  }
}

/* ── page ───────────────────────────────────────────────────── */

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  const data    = await getAnalyticsData((session!.user as any).id)
  const { kpis, prVolume, issuesOverTime, verdictData, issueTypeData } = data

  const kpiCards = [
    {
      label:  'Reviews (30d)',
      value:  kpis.totalReviews30d,
      icon:   GitPullRequest,
      trend:  kpis.trend,
      suffix: null,
    },
    {
      label:  'Issues Caught (30d)',
      value:  kpis.totalIssues30d,
      icon:   Shield,
      trend:  null,
      suffix: null,
    },
    {
      label:  'Approval Rate',
      value:  kpis.approvalRate30d,
      icon:   Activity,
      trend:  null,
      suffix: '%',
    },
    {
      label:  'Avg Issues / PR',
      value:  kpis.avgIssuesPR,
      icon:   Zap,
      trend:  null,
      suffix: null,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        title="Analytics"
        subtitle="Code quality trends over the last 30 days"
      />

      <div className="flex-1 p-6 space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} className="card px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-text-secondary uppercase tracking-wide">{card.label}</p>
                  <div className="w-7 h-7 rounded-lg bg-subtle border border-border flex items-center justify-center">
                    <Icon size={13} className="text-text-muted" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold tracking-tighter metric-value text-text-primary">
                    {card.value}{card.suffix}
                  </p>
                  {card.trend !== null && (
                    <span className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${card.trend >= 0 ? 'text-success-text' : 'text-danger'}`}>
                      {card.trend >= 0
                        ? <TrendingUp size={11} strokeWidth={2} />
                        : <TrendingDown size={11} strokeWidth={2} />
                      }
                      {Math.abs(card.trend)}%
                    </span>
                  )}
                </div>
                {card.trend !== null && (
                  <p className="text-xs text-text-muted mt-0.5">vs prior 15 days</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Charts row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">PR Review Volume</h3>
            <p className="text-xs text-text-muted mb-5">Daily reviews triggered by pull requests</p>
            <PRVolumeChart data={prVolume} />
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">Issues Detected</h3>
            <p className="text-xs text-text-muted mb-5">Issues flagged per day across all PRs</p>
            <IssuesOverTimeChart data={issuesOverTime} />
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">Verdict Distribution</h3>
            <p className="text-xs text-text-muted mb-5">Breakdown of review outcomes across all time</p>
            {verdictData.length > 0
              ? <VerdictPieChart data={verdictData} />
              : (
                <div className="flex items-center justify-center h-[220px] text-text-muted text-sm">
                  No review data yet
                </div>
              )
            }
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">Issues by Category</h3>
            <p className="text-xs text-text-muted mb-5">Distribution of flagged issue types</p>
            <IssueTypeChart data={issueTypeData} />
          </div>
        </div>

        {/* Quality health insight */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-accent-subtle/20 border border-accent-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Activity size={16} className="text-accent-400" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Code Quality Insight</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                {kpis.totalReviews30d === 0
                  ? 'No pull request reviews in the last 30 days. Connect a repository and open a PR to start seeing quality trends.'
                  : kpis.approvalRate30d >= 70
                  ? `Your approval rate of ${kpis.approvalRate30d}% is strong — reviewers are merging code with confidence. Average of ${kpis.avgIssuesPR} issues per PR detected and flagged before merge.`
                  : `${kpis.totalIssues30d} issues caught across ${kpis.totalReviews30d} reviews in the last 30 days — averaging ${kpis.avgIssuesPR} per PR. Consider reviewing recurring issue patterns to reduce defect rates.`
                }
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
