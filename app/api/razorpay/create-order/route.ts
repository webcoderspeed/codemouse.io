import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// ₹599/month = 59900 paise
const PRO_AMOUNT_PAISE = 59900

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { installationId } = await req.json()
    if (!installationId) {
      return NextResponse.json({ error: 'installationId required' }, { status: 400 })
    }

    const order = await razorpay.orders.create({
      amount:   PRO_AMOUNT_PAISE,
      currency: 'INR',
      receipt:  `cm_${installationId}_${Date.now()}`,
      notes: {
        installation_id: String(installationId),
        user_email:      session.user.email ?? '',
        product:         'CodeMouse Pro',
      },
    })

    return NextResponse.json({
      orderId:   order.id,
      amount:    order.amount,
      currency:  order.currency,
      keyId:     process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[razorpay/create-order]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
