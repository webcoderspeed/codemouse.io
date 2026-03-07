import { redirect } from 'next/navigation'

// Billing is gone — redirect to settings where the API key lives
export default function BillingPage() {
  redirect('/settings')
}
