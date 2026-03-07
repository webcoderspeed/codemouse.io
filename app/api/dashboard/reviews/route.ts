import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getReviewLogsByUser } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json([], { status: 401 })

  const userId = (session.user as any).id
  if (!userId) return NextResponse.json([])

  const logs = await getReviewLogsByUser(userId, 30)
  return NextResponse.json(
    logs.map((r: any) => ({
      id:             r._id.toString(),
      repo_full_name: r.repoFullName,
      pr_number:      r.prNumber,
      pr_title:       r.prTitle,
      issues_found:   r.issuesFound,
      verdict:        r.verdict,
      created_at:     r.createdAt,
    }))
  )
}
