import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  activateProPlan,
  createInvoice,
  getInstallation,
  getUserById,
} from '@/lib/db'
import {
  sendPaymentSuccessEmail,
  sendPlanUpgradedEmail,
} from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      installationId,
      amount,
    } = await req.json()

    // ── 1. Verify Razorpay signature ─────────────────────────────────────
    const body     = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // ── 2. Get installation + user details ────────────────────────────────
    const inst = await getInstallation(Number(installationId))
    const user = await getUserById((session.user as any).id)

    if (!inst) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 })
    }

    // ── 3. Activate Pro plan ──────────────────────────────────────────────
    await activateProPlan(Number(installationId), razorpay_payment_id)

    // ── 4. Create & store invoice in MongoDB ──────────────────────────────
    const invoice = await createInvoice({
      installationId:    Number(installationId),
      userId:            (session.user as any).id ?? null,
      userEmail:         session.user?.email ?? '',
      userName:          session.user?.name ?? '',
      accountLogin:      inst.accountLogin,
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount:            amount ?? 59900,   // paise — passed from create-order response
      status:            'paid',
    })

    // ── 5. Send emails ────────────────────────────────────────────────────
    if (user?.email) {
      // Fire and forget — don't let email failure block the response
      Promise.all([
        sendPaymentSuccessEmail(user.email, user.name, invoice),
        sendPlanUpgradedEmail(user.email, user.name, inst.accountLogin),
      ]).catch(err => console.error('[mailer] Payment email failed:', err))
    }

    console.log(`[razorpay/verify] Pro activated for installation ${installationId} · Invoice ${invoice.invoiceNumber}`)
    return NextResponse.json({
      ok:            true,
      message:       'Pro plan activated!',
      invoiceNumber: invoice.invoiceNumber,
    })

  } catch (err) {
    console.error('[razorpay/verify]', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
