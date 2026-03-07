import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getInstallationsByUser } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json([], { status: 401 })

  const userId = (session.user as any).id
  if (!userId) return NextResponse.json([])

  const installs = await getInstallationsByUser(userId)
  return NextResponse.json(
    installs.map(i => ({
      installation_id: i.installationId,
      account_login:   i.accountLogin,
      account_type:    i.accountType,
      plan:            i.plan,
      reviews_used:    i.reviewsUsed,
      reviews_limit:   i.reviewsLimit,
    }))
  )
}
