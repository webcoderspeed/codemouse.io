import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Installation } from '@/lib/models/Installation'
import { ReviewLog }    from '@/lib/models/ReviewLog'
import { Topbar }       from '@/components/layout/Topbar'
import { Badge }        from '@/components/ui/Badge'
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table'
import { formatRelative } from '@/lib/utils'
import mongoose from 'mongoose'
import { GitPullRequest, Bug, CheckCircle2, XCircle, MessageSquare } from 'lucide-react'

async function getReviews(userId: string) {
  await connectDB()
  const uid = new mongoose.Types.ObjectId(userId)
  const installs = await Installation.find({ userId: uid }).select('installationId').lean()
  const ids = installs.map((i: any) => i.installationId)
  return ReviewLog.find({ installationId: { $in: ids } }).sort({ createdAt: -1 }).limit(100).lean()
}

function VerdictIcon({ verdict }: { verdict: string }) {
  if (verdict === 'approve')         return <CheckCircle2 size={14} className="text-success" strokeWidth={2} />
  if (verdict === 'request_changes') return <XCircle size={14} className="text-danger" strokeWidth={2} />
  return <MessageSquare size={14} className="text-text-muted" strokeWidth={2} />
}

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions)
  const reviews = await getReviews((session!.user as any).id)

  const totalIssues    = reviews.reduce((s, r: any) => s + r.issuesFound, 0)
  const approvalRate   = reviews.length > 0
    ? Math.round((reviews.filter((r: any) => r.verdict === 'approve').length / reviews.length) * 100)
    : 0

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Pull Request Reviews" subtitle={`${reviews.length} reviews across all repositories`} />

      <div className="p-6 space-y-5">

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Reviews', value: reviews.length, color: 'text-text-primary' },
            { label: 'Total Issues Found', value: totalIssues, color: 'text-warning-text' },
            { label: 'Approval Rate', value: `${approvalRate}%`, color: 'text-success-text' },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1.5">{s.label}</p>
              <p className={`text-2xl font-bold tracking-tighter metric-value ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-xl bg-subtle border border-border flex items-center justify-center mb-4">
                <GitPullRequest size={20} className="text-text-muted" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-text-secondary mb-1">No reviews yet</p>
              <p className="text-xs text-text-muted max-w-xs">Open a pull request on a connected repository to trigger your first automated review.</p>
            </div>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Pull Request</Th>
                  <Th>Repository</Th>
                  <Th>Issues</Th>
                  <Th>Verdict</Th>
                  <Th>Reviewed</Th>
                </tr>
              </Thead>
              <Tbody>
                {reviews.map((r: any) => (
                  <Tr key={r._id.toString()}>
                    <Td>
                      <p className="text-sm font-medium text-text-primary">{r.prTitle || `Pull Request #${r.prNumber}`}</p>
                      <p className="text-xs text-text-muted mt-0.5">#{r.prNumber}</p>
                    </Td>
                    <Td>
                      <span className="font-mono text-xs text-text-secondary">{r.repoFullName}</span>
                    </Td>
                    <Td>
                      {r.issuesFound === 0
                        ? <span className="flex items-center gap-1.5 text-sm text-success-text"><CheckCircle2 size={13} strokeWidth={2} />None</span>
                        : <span className="flex items-center gap-1.5 text-sm text-warning-text"><Bug size={13} strokeWidth={2} />{r.issuesFound}</span>
                      }
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <VerdictIcon verdict={r.verdict} />
                        <span className="text-sm text-text-secondary capitalize">{r.verdict.replace('_', ' ')}</span>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-xs text-text-muted">{formatRelative(r.createdAt)}</span>
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
