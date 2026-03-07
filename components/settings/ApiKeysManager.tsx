'use client'

import { useState, useTransition } from 'react'
import {
  Key, Eye, EyeOff, Trash2, CheckCircle2, XCircle,
  ChevronDown, Loader2, ExternalLink, ShieldCheck, Zap,
} from 'lucide-react'
import { PROVIDERS, validateKeyFormat, type AIProvider, type ModelOption } from '@/lib/providers'

/* ── Types ──────────────────────────────────────────────────────────────────── */

interface KeyStatus {
  provider:  string
  hasMask:   string | null   // masked key like "sk-...xxxx" or null
}

interface ActiveModel {
  provider: string
  model:    string
}

interface Props {
  initialKeyStatuses:  KeyStatus[]
  initialActiveModel:  ActiveModel
}

/* ── Provider accent map ────────────────────────────────────────────────────── */

const PROVIDER_COLORS: Record<string, string> = {
  openai:    'border-emerald-500/40 bg-emerald-500/5',
  anthropic: 'border-amber-500/40  bg-amber-500/5',
  gemini:    'border-blue-500/40   bg-blue-500/5',
  groq:      'border-orange-500/40 bg-orange-500/5',
}

const PROVIDER_BADGE: Record<string, string> = {
  openai:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  anthropic: 'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  gemini:    'bg-blue-500/15   text-blue-400   border border-blue-500/30',
  groq:      'bg-orange-500/15 text-orange-400 border border-orange-500/30',
}

/* ── Model Selector ─────────────────────────────────────────────────────────── */

function ModelSelector({
  providers, activeModel, savedProviders, onSave,
}: {
  providers:      AIProvider[]
  activeModel:    ActiveModel
  savedProviders: Set<string>
  onSave:         (provider: string, model: string) => Promise<void>
}) {
  const [selectedProvider, setSelectedProvider] = useState(activeModel.provider)
  const [selectedModel,    setSelectedModel]    = useState(activeModel.model)
  const [saving,           setSaving]           = useState(false)
  const [saved,            setSaved]            = useState(false)
  const [error,            setError]            = useState<string | null>(null)

  const availableProviders = providers.filter(p => savedProviders.has(p.id))
  const currentProvider    = providers.find(p => p.id === selectedProvider)
  const models             = currentProvider?.models ?? []

  async function handleSave() {
    setSaving(true); setError(null)
    try {
      await onSave(selectedProvider, selectedModel)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) {
      setError(e.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (availableProviders.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Active Model</h3>
        </div>
        <p className="text-xs text-white/40 mt-2">
          Add at least one API key below to select a model for reviews.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/[0.05] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Active Model for Reviews</h3>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Provider dropdown */}
        <div className="relative flex-1">
          <select
            value={selectedProvider}
            onChange={e => {
              const p  = e.target.value
              const m  = providers.find(pr => pr.id === p)?.models.find(m => m.recommended)?.id
                      ?? providers.find(pr => pr.id === p)?.models[0]?.id ?? ''
              setSelectedProvider(p)
              setSelectedModel(m)
            }}
            className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {availableProviders.map(p => (
              <option key={p.id} value={p.id} className="bg-[#1a1a2e]">{p.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>

        {/* Model dropdown */}
        <div className="relative flex-[2]">
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {models.map(m => (
              <option key={m.id} value={m.id} className="bg-[#1a1a2e]">
                {m.name}{m.recommended ? ' ★' : ''} — {m.contextWindow} ctx
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2.5 text-sm font-medium text-white transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {saving ? 'Saving…' : 'Set Active'}
        </button>
      </div>

      {/* Show model description */}
      {models.find(m => m.id === selectedModel) && (
        <p className="mt-2 text-xs text-white/40">
          {models.find(m => m.id === selectedModel)!.description}
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}

/* ── ProviderCard ────────────────────────────────────────────────────────────── */

function ProviderCard({
  provider, hasMask, isActive,
  onSaved, onRemoved,
}: {
  provider:  AIProvider
  hasMask:   string | null
  isActive:  boolean
  onSaved:   (provider: string, mask: string) => void
  onRemoved: (provider: string) => void
}) {
  const [key,      setKey]      = useState('')
  const [visible,  setVisible]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)

  const formatOk = key.length > 0 ? validateKeyFormat(provider.id, key) : null

  async function handleSave() {
    if (!key || !formatOk) return
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/settings/apikeys', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ provider: provider.id, key }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save')
      setKey('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onSaved(provider.id, data.mask)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove() {
    setRemoving(true); setError(null)
    try {
      const res = await fetch('/api/settings/apikeys', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ provider: provider.id }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Failed to remove')
      }
      onRemoved(provider.id)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className={`rounded-xl border p-5 transition-all ${PROVIDER_COLORS[provider.id] ?? 'border-white/10 bg-white/[0.03]'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{provider.name}</h3>
            {isActive && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            {provider.models.length} model{provider.models.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasMask ? (
            <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${PROVIDER_BADGE[provider.id] ?? ''}`}>
              <ShieldCheck className="w-3 h-3" /> Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
              <XCircle className="w-3 h-3" /> Not set
            </span>
          )}
        </div>
      </div>

      {/* Saved key display */}
      {hasMask && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-white/30" />
            <span className="font-mono text-xs text-white/50">{hasMask}</span>
          </div>
          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            {removing
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Trash2 className="w-3.5 h-3.5" />
            }
            {removing ? 'Removing…' : 'Remove'}
          </button>
        </div>
      )}

      {/* Key input */}
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={key}
          onChange={e => { setKey(e.target.value); setError(null) }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder={hasMask ? 'Replace with new key…' : provider.keyPlaceholder}
          className={`w-full rounded-lg border bg-white/[0.06] px-3 py-2.5 pr-10 text-sm font-mono text-white placeholder:text-white/25 focus:outline-none transition-colors ${
            formatOk === false ? 'border-red-500/50 focus:border-red-500' :
            formatOk === true  ? 'border-emerald-500/50 focus:border-emerald-500' :
                                 'border-white/10 focus:border-indigo-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Validation hint */}
      {formatOk === false && (
        <p className="mt-1.5 text-xs text-red-400">
          Key should start with: {provider.keyPrefixes.join(' or ')}
        </p>
      )}

      {/* Save button + docs link */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving || !key || formatOk === false}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 text-sm font-medium text-white transition-colors"
        >
          {saving    ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          {success   ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : null}
          {saving ? 'Saving…' : success ? 'Saved!' : hasMask ? 'Update Key' : 'Save Key'}
        </button>
        <a
          href={provider.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Get key <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Models list */}
      <div className="mt-4 space-y-1.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">Available Models</p>
        {provider.models.map(m => (
          <div key={m.id} className="flex items-center justify-between text-xs">
            <span className="text-white/60 flex items-center gap-1">
              {m.recommended && <span className="text-yellow-400">★</span>}
              {m.name}
            </span>
            <span className="text-white/30 font-mono">{m.contextWindow}</span>
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────────────────────── */

export default function ApiKeysManager({ initialKeyStatuses, initialActiveModel }: Props) {
  const [keyStatuses,  setKeyStatuses]  = useState<KeyStatus[]>(initialKeyStatuses)
  const [activeModel,  setActiveModel]  = useState<ActiveModel>(initialActiveModel)

  const savedProviders = new Set(keyStatuses.filter(k => k.hasMask).map(k => k.provider))

  function getMask(providerId: string) {
    return keyStatuses.find(k => k.provider === providerId)?.hasMask ?? null
  }

  function handleSaved(provider: string, mask: string) {
    setKeyStatuses(prev => {
      const existing = prev.find(k => k.provider === provider)
      if (existing) return prev.map(k => k.provider === provider ? { ...k, hasMask: mask } : k)
      return [...prev, { provider, hasMask: mask }]
    })
  }

  function handleRemoved(provider: string) {
    setKeyStatuses(prev => prev.map(k => k.provider === provider ? { ...k, hasMask: null } : k))
    // If active model was this provider, clear it visually
    if (activeModel.provider === provider) {
      const other = PROVIDERS.find(p => p.id !== provider && savedProviders.has(p.id))
      if (other) {
        const model = other.models.find(m => m.recommended)?.id ?? other.models[0]?.id ?? ''
        setActiveModel({ provider: other.id, model })
      }
    }
  }

  async function handleSetActiveModel(provider: string, model: string) {
    const res = await fetch('/api/settings/activemodel', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ provider, model }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Failed to save')
    setActiveModel({ provider, model })
  }

  return (
    <div className="space-y-6">
      {/* Active model selector */}
      <ModelSelector
        providers={PROVIDERS}
        activeModel={activeModel}
        savedProviders={savedProviders}
        onSave={handleSetActiveModel}
      />

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-white/70">Your keys are encrypted at rest</p>
          <p className="text-xs text-white/35 mt-0.5">
            API keys are stored using AES-256-GCM encryption and never exposed in API responses.
            CodeMouse uses them only server-side to run reviews.
          </p>
        </div>
      </div>

      {/* Provider cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PROVIDERS.map(provider => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            hasMask={getMask(provider.id)}
            isActive={activeModel.provider === provider.id && savedProviders.has(provider.id)}
            onSaved={handleSaved}
            onRemoved={handleRemoved}
          />
        ))}
      </div>
    </div>
  )
}
