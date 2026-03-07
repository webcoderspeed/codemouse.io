import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, getInstallationOctokit, getPRDiff, postPRComment } from '@/lib/github'
import { reviewPullRequest } from '@/lib/reviewer'
import {
  logReview,
  incrementReviewCount,
  upsertInstallation,
  getInstallation,
  getUserById,
} from '@/lib/db'
import { sendAppInstalledEmail } from '@/lib/mailer'

export const runtime     = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const rawBody   = await req.text()
    const signature = req.headers.get('x-hub-signature-256') ?? ''
    const event     = req.headers.get('x-github-event') ?? ''

    // ── 1. Verify signature ───────────────────────────────────────────────
    const valid = await verifyWebhookSignature(rawBody, signature)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)

    // ── 2. Handle installation events ────────────────────────────────────
    if (event === 'installation') {
      if (payload.action === 'created') {
        const inst = await upsertInstallation({
          installationId: payload.installation.id,
          accountLogin:   payload.installation.account.login,
          accountType:    payload.installation.account.type,
        })
        console.log(`[webhook] App installed by ${payload.installation.account.login}`)

        if (inst.userId) {
          const user = await getUserById(inst.userId.toString())
          if (user?.email) {
            sendAppInstalledEmail(user.email, user.name, inst.accountLogin)
              .catch(e => console.error('[mailer] appInstalled email failed:', e))
          }
        }
      }
      return NextResponse.json({ ok: true })
    }

    // ── 3. Only handle pull_request events ───────────────────────────────
    if (event !== 'pull_request') {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const { action, pull_request, repository, installation } = payload
    if (!['opened', 'reopened', 'ready_for_review'].includes(action)) {
      return NextResponse.json({ ok: true, skipped: true })
    }
    if (pull_request.draft) {
      return NextResponse.json({ ok: true, skipped: 'draft PR' })
    }

    const installationId: number = installation.id
    const owner: string          = repository.owner.login
    const repo: string           = repository.name
    const repoFullName: string   = repository.full_name
    const prNumber: number       = pull_request.number
    const prTitle: string        = pull_request.title
    const prDesc: string         = pull_request.body ?? ''

    console.log(`[webhook] PR #${prNumber} opened in ${repoFullName}`)

    // ── 4. Get user's OpenAI API key ──────────────────────────────────────
    const inst = await getInstallation(installationId)
    const user = inst?.userId ? await getUserById(inst.userId.toString()) : null
    const userApiKey = (user as any)?.openaiApiKey ?? ''

    if (!userApiKey) {
      // Post a helpful comment telling the user to add their key
      const octokit = await getInstallationOctokit(installationId)
      await postPRComment(octokit, owner, repo, prNumber,
        `## CodeMouse — Setup Required\n\nTo enable AI code reviews, please add your OpenAI API key in your [CodeMouse Settings](https://codemouse.io/settings).\n\nIt only takes 30 seconds — get your key at [platform.openai.com](https://platform.openai.com/api-keys).\n\n*[CodeMouse](https://codemouse.io) · AI-powered code review*`
      )
      return NextResponse.json({ ok: true, skipped: 'no api key' })
    }

    // ── 5. Fetch diff ─────────────────────────────────────────────────────
    const octokit = await getInstallationOctokit(installationId)
    const diff    = await getPRDiff(octokit, owner, repo, prNumber)

    if (!diff || diff.trim().length === 0) {
      return NextResponse.json({ ok: true, skipped: 'empty diff' })
    }

    // ── 6. Run AI review with the user's own key ──────────────────────────
    const review = await reviewPullRequest(prTitle, prDesc, diff, repoFullName, userApiKey)

    // ── 7. Post comment ───────────────────────────────────────────────────
    await postPRComment(octokit, owner, repo, prNumber, review.reviewMarkdown)

    // ── 8. Log + increment ────────────────────────────────────────────────
    await Promise.all([
      logReview({
        installationId,
        repoFullName,
        prNumber,
        prTitle,
        issuesFound: review.issues.length,
        verdict:     review.verdict,
      }),
      incrementReviewCount(installationId),
    ])

    console.log(`[webhook] Review posted for PR #${prNumber} — ${review.issues.length} issues, verdict: ${review.verdict}`)
    return NextResponse.json({ ok: true, issues: review.issues.length, verdict: review.verdict })

  } catch (err) {
    console.error('[webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
