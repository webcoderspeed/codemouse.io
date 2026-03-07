import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getInvoicesByUser } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json([], { status: 401 })

  const userId = (session.user as any).id
  if (!userId) return NextResponse.json([])

  const invoices = await getInvoicesByUser(userId)
  return NextResponse.json(
    invoices.map((inv: any) => ({
      id:                  inv._id?.toString() ?? '',
      invoiceNumber:       inv.invoiceNumber,
      accountLogin:        inv.accountLogin,
      amount:              inv.amountInRupees,
      currency:            inv.currency,
      status:              inv.status,
      razorpayPaymentId:   inv.razorpayPaymentId,
      billingPeriodStart:  inv.billingPeriodStart,
      billingPeriodEnd:    inv.billingPeriodEnd,
      paidAt:              inv.paidAt,
      createdAt:           inv.createdAt,
      items:               inv.items,
    }))
  )
}
