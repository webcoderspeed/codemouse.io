'use client'

import { useState } from 'react'
import { Eye, EyeOff, Key, CheckCircle2, Loader2, Trash2, ExternalLink } from 'lucide-react'

interface Props {
  hasKey: boolean   // whether a key is already saved (we never show the actual key)
}

export function ApiKeyForm({ hasKey }: Props) {
  const [key,     setKey     ] = useState('')
  const [show,    setShow    ] = useState(false)
  const [loading, setLoading ] = useState(false)
  const [saved,   setSaved   ] = useState(hasKey)
  const [error,   setError   ] = useState('')

  const handleSave = async () => {
    if (!key.trim()) return
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/settings/apikey', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ apiKey: key.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to save'); return }
      setSaved(true)
      setKey('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    setError('')
    try {
      await fetch('/api/settings/apikey', { method: 'DELETE' })
      setSaved(false)
      setKey('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">

      {saved ? (
        /* Key is saved — show masked state */
        <div className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
              <CheckCircle2 size={15} className="text-success" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">OpenAI API key saved</p>
              <p className="text-xs text-text-muted mt-0.5">sk-••••••••••••••••••••••••••••••••</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-danger/40 text-xs font-medium text-text-muted hover:text-danger transition-all disabled:opacity-50"
          >
            {loading
              ? <Loader2 size={11} className="animate-spin" />
              : <Trash2 size={11} strokeWidth={2} />
            }
            Remove
          </button>
        </div>
      ) : (
        /* No key — show input */
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Key size={13} className="text-text-muted" strokeWidth={1.75} />
            </div>
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="sk-proj-..."
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-subtle border border-border
                text-sm text-text-primary placeholder:text-text-muted
                focus:outline-none focus:border-accent-500/60 focus:ring-1 focus:ring-accent-500/30
                font-mono transition-all"
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {show ? <EyeOff size={13} strokeWidth={1.75} /> : <Eye size={13} strokeWidth={1.75} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-danger">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={!key.trim() || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600
              text-sm font-semibold text-white transition-all
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
              : <><Key size={13} strokeWidth={2} /> Save API key</>
            }
          </button>
        </div>
      )}

      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-subtle/40 border border-border/60">
        <div className="text-text-muted mt-0.5 flex-shrink-0">
          <Key size={12} strokeWidth={1.75} />
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Your key is used server-side to run AI reviews — it's never exposed to the browser.
          Get your key at{' '}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank" rel="noreferrer"
            className="text-accent-400 hover:text-accent-300 inline-flex items-center gap-0.5 transition-colors"
          >
            platform.openai.com
            <ExternalLink size={10} strokeWidth={2} />
          </a>
          . You only pay OpenAI for what you use — typically $0.01–$0.05 per review.
        </p>
      </div>
    </div>
  )
}
