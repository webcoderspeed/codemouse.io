/**
 * db.ts — All database operations (MongoDB via Mongoose)
 */

import { connectDB }                   from './mongoose'
import { User, IUser }                 from './models/User'
import { Installation, IInstallation } from './models/Installation'
import { ReviewLog }                   from './models/ReviewLog'
import mongoose                        from 'mongoose'
import { decrypt, maskKey }            from './crypto'
import { DEFAULT_PROVIDER, DEFAULT_MODEL } from './providers'

export { User, Installation, ReviewLog }
export type { IUser, IInstallation }

// ── Users ─────────────────────────────────────────────────────────────────────

export async function upsertUser(data: {
  githubId:    number
  githubLogin: string
  email:       string
  name?:       string
  avatarUrl?:  string
}): Promise<IUser> {
  await connectDB()
  const user = await User.findOneAndUpdate(
    { githubId: data.githubId },
    {
      $set: {
        githubLogin: data.githubLogin,
        email:       data.email,
        name:        data.name     ?? '',
        avatarUrl:   data.avatarUrl ?? '',
      },
    },
    { upsert: true, new: true }
  )
  return user!
}

export async function getUserByGithubId(githubId: number): Promise<IUser | null> {
  await connectDB()
  return User.findOne({ githubId })
}

export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB()
  return User.findById(id)
}

// ── Installations ─────────────────────────────────────────────────────────────

export async function upsertInstallation(data: {
  installationId: number
  accountLogin:   string
  accountType:    'User' | 'Organization'
  userId?:        string
}): Promise<IInstallation> {
  await connectDB()
  const inst = await Installation.findOneAndUpdate(
    { installationId: data.installationId },
    {
      $set: {
        accountLogin: data.accountLogin,
        accountType:  data.accountType,
        ...(data.userId ? { userId: new mongoose.Types.ObjectId(data.userId) } : {}),
      },
      $setOnInsert: {
        reviewsUsed: 0,
      },
    },
    { upsert: true, new: true }
  )
  return inst!
}

export async function getInstallation(installationId: number): Promise<IInstallation | null> {
  await connectDB()
  return Installation.findOne({ installationId })
}

export async function getInstallationsByUser(userId: string): Promise<IInstallation[]> {
  await connectDB()
  return Installation.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 })
}

export async function incrementReviewCount(installationId: number): Promise<void> {
  await connectDB()
  await Installation.updateOne({ installationId }, { $inc: { reviewsUsed: 1 } })
}

// ── Review Logs ───────────────────────────────────────────────────────────────

export async function logReview(data: {
  installationId: number
  repoFullName:   string
  prNumber:       number
  prTitle:        string
  issuesFound:    number
  verdict:        string
}): Promise<void> {
  await connectDB()
  await ReviewLog.create(data)
}

export async function getReviewLogs(installationId: number, limit = 30) {
  await connectDB()
  return ReviewLog.find({ installationId }).sort({ createdAt: -1 }).limit(limit).lean()
}

export async function getReviewLogsByUser(userId: string, limit = 50) {
  await connectDB()
  const installs = await getInstallationsByUser(userId)
  const ids      = installs.map(i => i.installationId)
  return ReviewLog.find({ installationId: { $in: ids } })
    .sort({ createdAt: -1 }).limit(limit).lean()
}

// ── API Key helpers ────────────────────────────────────────────────────────────

/**
 * Returns the decrypted API key + provider + model for the user's currently
 * selected AI provider. Used by the webhook to run reviews.
 */
export async function getUserActiveApiKey(userId: string): Promise<{
  provider: string
  model:    string
  key:      string
} | null> {
  await connectDB()
  const user = await User.findById(userId).lean()
  if (!user) return null

  const provider = (user as any).selectedProvider || DEFAULT_PROVIDER
  const model    = (user as any).selectedModel    || DEFAULT_MODEL
  const entries  = (user as any).apiKeys          || []

  const entry = entries.find((k: any) => k.provider === provider)
  if (!entry?.encryptedKey) return null

  try {
    const key = decrypt(entry.encryptedKey)
    return { provider, model, key }
  } catch {
    return null
  }
}

/** Returns which providers have keys saved (without decrypting) */
export async function getUserKeyStatus(userId: string): Promise<Record<string, boolean>> {
  await connectDB()
  const user    = await User.findById(userId).lean()
  const entries = (user as any)?.apiKeys ?? []
  const status: Record<string, boolean> = {}
  for (const entry of entries) {
    if (entry.provider && entry.encryptedKey) status[entry.provider] = true
  }
  return status
}

/** Returns masked keys for display on the settings page.
 *  Decrypts each key server-side then immediately masks — never exposes raw key. */
export async function getUserMaskedKeys(
  userId: string
): Promise<{ provider: string; hasMask: string | null }[]> {
  await connectDB()
  const user    = await User.findById(userId).lean()
  const entries: { provider: string; encryptedKey: string }[] = (user as any)?.apiKeys ?? []
  return entries.map(entry => {
    try {
      const raw = decrypt(entry.encryptedKey)
      return { provider: entry.provider, hasMask: maskKey(raw) }
    } catch {
      return { provider: entry.provider, hasMask: '••••••••••••' }
    }
  })
}
