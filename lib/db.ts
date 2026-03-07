/**
 * db.ts — All database operations (MongoDB via Mongoose)
 */

import { connectDB } from './mongoose'
import { User, IUser }               from './models/User'
import { Installation, IInstallation, Plan } from './models/Installation'
import { ReviewLog }                 from './models/ReviewLog'
import { Invoice, IInvoice }         from './models/Invoice'
import mongoose from 'mongoose'

export type { Plan }
export { User, Installation, ReviewLog, Invoice }
export type { IUser, IInstallation, IInvoice }

// ── Users ────────────────────────────────────────────────────────────────────

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
        name:        data.name ?? '',
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

// ── Installations ────────────────────────────────────────────────────────────

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
        plan:         'free',
        reviewsUsed:  0,
        reviewsLimit: 30,
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

export async function isWithinLimit(installationId: number): Promise<boolean> {
  const inst = await getInstallation(installationId)
  if (!inst) return false
  if (inst.plan === 'pro') return true
  return inst.reviewsUsed < inst.reviewsLimit
}

export async function getUsagePercent(installationId: number): Promise<number> {
  const inst = await getInstallation(installationId)
  if (!inst || inst.plan === 'pro') return 0
  return Math.round((inst.reviewsUsed / inst.reviewsLimit) * 100)
}

export async function activateProPlan(
  installationId: number,
  razorpayPaymentId: string
): Promise<void> {
  await connectDB()
  await Installation.updateOne(
    { installationId },
    { $set: { plan: 'pro', reviewsLimit: 999999, razorpaySubscriptionId: razorpayPaymentId } }
  )
}

export async function cancelProPlan(installationId: number): Promise<void> {
  await connectDB()
  await Installation.updateOne(
    { installationId },
    { $set: { plan: 'free', reviewsLimit: 30 } }
  )
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

export async function getReviewLogsByUser(userId: string, limit = 30) {
  await connectDB()
  const installs = await getInstallationsByUser(userId)
  const ids = installs.map(i => i.installationId)
  return ReviewLog.find({ installationId: { $in: ids } })
    .sort({ createdAt: -1 }).limit(limit).lean()
}

// ── Invoices ──────────────────────────────────────────────────────────────────

function generateInvoiceNumber(): string {
  const now  = new Date()
  const year = now.getFullYear()
  const mo   = String(now.getMonth() + 1).padStart(2, '0')
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `CM-${year}${mo}-${rand}`
}

export async function createInvoice(data: {
  installationId:    number
  userId:            string | null
  userEmail:         string
  userName:          string
  accountLogin:      string
  razorpayOrderId:   string
  razorpayPaymentId: string
  amount:            number  // paise
  status?:           'pending' | 'paid' | 'failed'
}): Promise<IInvoice> {
  await connectDB()
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const invoice = await Invoice.create({
    invoiceNumber:      generateInvoiceNumber(),
    installationId:     data.installationId,
    userId:             data.userId ? new mongoose.Types.ObjectId(data.userId) : null,
    userEmail:          data.userEmail,
    userName:           data.userName,
    accountLogin:       data.accountLogin,
    razorpayOrderId:    data.razorpayOrderId,
    razorpayPaymentId:  data.razorpayPaymentId,
    amount:             data.amount,
    amountInRupees:     data.amount / 100,
    currency:           'INR',
    status:             data.status ?? 'paid',
    paidAt:             (data.status ?? 'paid') === 'paid' ? new Date() : null,
    billingPeriodStart: start,
    billingPeriodEnd:   end,
    items: [
      {
        description: `CodeMouse Pro — ${data.accountLogin} (${start.toLocaleString('default', { month: 'long', year: 'numeric' })})`,
        quantity:    1,
        unitPrice:   data.amount / 100,
        total:       data.amount / 100,
      },
    ],
  })
  return invoice
}

export async function getInvoicesByUser(userId: string): Promise<IInvoice[]> {
  await connectDB()
  return Invoice.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 }).lean() as unknown as IInvoice[]
}

export async function getInvoicesByInstallation(installationId: number): Promise<IInvoice[]> {
  await connectDB()
  return Invoice.find({ installationId }).sort({ createdAt: -1 }).lean() as unknown as IInvoice[]
}
