import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { connectDB }        from '@/lib/mongoose'
import { User }             from '@/lib/models/User'
import { Installation }     from '@/lib/models/Installation'
import { getUserMaskedKeys } from '@/lib/db'
import { Topbar }           from '@/components/layout/Topbar'
import ApiKeysManager       from '@/components/settings/ApiKeysManager'
import { DEFAULT_PROVIDER, DEFAULT_MODEL } from '@/lib/providers'
import {
  User as UserIcon, Github, Shield,
  ExternalLink, Trash2, LogOut, Zap,
} from 'lucide-react'
import mongoose from 'mongoose'
import Link from 'next/link'

async function getSettingsData(userId: string) {
  await connectDB()
  const uid      = new mongoose.Types.ObjectId(userId)
  const user     = await User.findById(uid).lean()
  const installs = await Installation.find({ userId: uid }).sort({ createdAt: -1 }).lean()
  const maskedKeys = await getUserMaskedKeys(userId)
  return { user, installs, maskedKeys }
}

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="pb-4 mb-5 border-b border-border">
      <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      {desc && <p className="text-xs text-text-muted mt-0.5">{desc}</p>}
    </div>
  )
}

function SettingRow({ label, desc, children }: {
  label: string; desc?: string; children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-border/60 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {desc && <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const userId  = (session!.user as any).id
  const { user, installs, maskedKeys } = await getSettingsData(userId)

  const activeProvider = (user as any)?.selectedProvider ?? DEFAULT_PROVIDER
  const activeModel    = (user as any)?.selectedModel    ?? DEFAULT_MODEL

  const githubInstallUrl     = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`
  const githubInstallMgmtUrl = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations`

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Settings" subtitle="Manage your account and integrations" />

      <div className="flex-1 p-6 max-w-3xl space-y-6">

        {/* ── AI API Keys — MOST IMPORTANT: shown first ── */}
        <div className="card p-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-text-primary">AI Provider Keys</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Add keys for any AI provider. CodeMouse is free — you only pay providers directly for what you use.
            </p>
          </div>
          <ApiKeysManager
            initialKeyStatuses={maskedKeys}
            initialActiveModel={{ provider: activeProvider, model: activeModel }}
          />
        </div>

        {/* ── Profile ── */}
        <div className="card p-5">
          <SectionHeader title="Profile" desc="Your GitHub identity linked to CodeMouse" />

          <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-subtle/40 border border-border/60">
            {session!.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session!.user.image}
                alt={session!.user.name ?? 'Avatar'}
                className="w-12 h-12 rounded-full ring-2 ring-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-subtle border border-border flex items-center justify-center">
                <UserIcon size={18} className="text-text-muted" strokeWidth={1.75} />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-text-primary">{session!.user?.name}</p>
              <p className="text-xs text-text-muted">{session!.user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Github size={11} className="text-text-muted" strokeWidth={1.75} />
                <span className="text-xs text-text-muted">
                  @{(session!.user as any).githubLogin ?? (user as any)?.githubLogin ?? 'unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-0">
            <SettingRow label="Email address" desc="Used for review notifications">
              <span className="text-xs font-mono text-text-secondary">{session!.user?.email ?? '—'}</span>
            </SettingRow>
            <SettingRow label="GitHub account" desc="Your connected GitHub identity">
              <a
                href="https://github.com/settings/profile"
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                View on GitHub <ExternalLink size={11} strokeWidth={2} />
              </a>
            </SettingRow>
          </div>
        </div>

        {/* ── GitHub App ── */}
        <div className="card p-5">
          <SectionHeader
            title="GitHub App"
            desc="Repositories where CodeMouse is installed"
          />

          {(installs as any[]).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted mb-4">No repositories connected yet.</p>
              <a href={githubInstallUrl} target="_blank" rel="noreferrer" className="btn-primary btn-sm text-xs">
                <Zap size={12} />
                Install on GitHub
              </a>
            </div>
          ) : (
            <div className="divide-y divide-border/60 mb-4">
              {(installs as any[]).map((inst: any) => (
                <div key={inst.installationId} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <Github size={13} className="text-text-muted" strokeWidth={1.75} />
                    <span className="text-sm font-medium text-text-primary">{inst.accountLogin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">{inst.reviewsUsed} reviews</span>
                    <a
                      href={`https://github.com/${inst.accountLogin}`}
                      target="_blank" rel="noreferrer"
                      className="text-text-muted hover:text-text-secondary transition-colors"
                    >
                      <ExternalLink size={12} strokeWidth={2} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <a href={githubInstallUrl} target="_blank" rel="noreferrer" className="btn-secondary btn-sm text-xs">
              Add repository
            </a>
            <a href={githubInstallMgmtUrl} target="_blank" rel="noreferrer" className="btn-ghost btn-sm text-xs">
              Manage on GitHub <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* ── Security ── */}
        <div className="card p-5">
          <SectionHeader title="Security" />
          <div className="space-y-0">
            <SettingRow
              label="Authentication"
              desc="You sign in using GitHub OAuth — no password stored"
            >
              <div className="flex items-center gap-1.5 text-xs text-success">
                <Shield size={11} strokeWidth={2} />
                GitHub OAuth
              </div>
            </SettingRow>
            <SettingRow label="Sign out" desc="End your current session">
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-danger/40 text-xs font-medium text-text-secondary hover:text-danger transition-all"
              >
                <LogOut size={11} strokeWidth={2} />
                Sign out
              </Link>
            </SettingRow>
          </div>
        </div>

        {/* ── Danger zone ── */}
        <div className="card p-5 border-danger/20">
          <SectionHeader title="Danger Zone" />
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-text-primary">Delete account</p>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed max-w-xs">
                Permanently deletes your account and all data. Cannot be undone.
              </p>
            </div>
            <button
              disabled
              title="Contact support to delete your account"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-danger/30 text-xs font-medium text-danger hover:bg-danger/10 transition-all disabled:opacity-40"
            >
              <Trash2 size={11} strokeWidth={2} />
              Delete
            </button>
          </div>
          <p className="text-xs text-text-muted mt-3">
            Contact <a href="mailto:support@codemouse.io" className="text-text-secondary hover:text-text-primary transition-colors">support@codemouse.io</a> to delete your account.
          </p>
        </div>

      </div>
    </div>
  )
}
