'use client'

import { useState } from 'react'
import { Zap, Loader2 } from 'lucide-react'

declare global {
  interface Window { Razorpay: any }
}

interface Props {
  installationId: number
  accountLogin:   string
}

export function UpgradeButton({ installationId, accountLogin }: Props) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      /* 1 — create Razorpay order */
      const res = await fetch('/api/razorpay/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ installationId }),
      })
      const data = await res.json()
      if (!data.orderId) throw new Error('Order creation failed')

      /* 2 — load Razorpay SDK if not already present */
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script  = document.createElement('script')
          script.src    = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      /* 3 — open checkout */
      const rzp = new window.Razorpay({
        key:         data.keyId,
        amount:      data.amount,
        currency:    'INR',
        name:        'CodeMouse',
        description: `Pro plan — ${accountLogin}`,
        order_id:    data.orderId,
        theme:       { color: '#6366F1' },
        handler: async (response: any) => {
          await fetch('/api/razorpay/verify', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ ...response, installationId }),
          })
          window.location.reload()
        },
      })
      rzp.open()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        bg-accent-500/10 border border-accent-500/30 hover:bg-accent-500/20
        text-xs font-semibold text-accent-400 transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading
        ? <Loader2 size={11} className="animate-spin" />
        : <Zap size={11} strokeWidth={2} />
      }
      Upgrade
    </button>
  )
}
