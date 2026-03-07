import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'

// Create an Octokit instance authenticated as the GitHub App
export function getAppOctokit() {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    },
  })
}

// Create an Octokit instance for a specific installation (repo)
export async function getInstallationOctokit(installationId: number) {
  const appOctokit = getAppOctokit()
  const { token } = await appOctokit.auth({
    type: 'installation',
    installationId,
  }) as { token: string }

  return new Octokit({ auth: token })
}

// Fetch the full diff for a pull request
export async function getPRDiff(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<string> {
  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}',
    {
      owner,
      repo,
      pull_number: pullNumber,
      headers: { accept: 'application/vnd.github.v3.diff' },
    }
  )
  return response.data as unknown as string
}

// Post a review comment on the PR
export async function postPRComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string
): Promise<void> {
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body,
  })
}

// Verify the GitHub webhook signature
export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.GITHUB_WEBHOOK_SECRET!
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const digest = 'sha256=' + Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Constant-time comparison
  if (digest.length !== signature.length) return false
  let mismatch = 0
  for (let i = 0; i < digest.length; i++) {
    mismatch |= digest.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return mismatch === 0
}
