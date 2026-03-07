'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, GitPullRequest, BarChart2, Settings,
  GitBranch, LogOut, Zap,
} from 'lucide-react'

const NAV = [
  { label: 'Overview',      href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pull Requests', href: '/reviews',   icon: GitPullRequest  },
  { label: 'Repositories',  href: '/repos',     icon: GitBranch       },
  { label: 'Analytics',     href: '/analytics', icon: BarChart2       },
]

const BOTTOM_NAV = [
  { label: 'Settings', href: '/settings', icon: Settings },
]

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const pathname = usePathname()
  const active   = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-2.5 px-3 h-8 rounded-[7px]',
        'text-sm font-medium transition-all duration-100 select-none',
        active
          ? 'text-text-primary bg-subtle'
          : 'text-text-secondary hover:text-text-primary hover:bg-subtle/60'
      )}>
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent-500 rounded-r-full" />
      )}
      <Icon size={15} strokeWidth={active ? 2 : 1.75} className={active ? 'text-text-primary' : ''} />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] flex flex-col bg-surface border-r border-border z-40">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border flex-shrink-0">
        <div className="w-6 h-6 rounded-md bg-accent-grad flex items-center justify-center shadow-glow-sm"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
          <Zap size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-sm text-text-primary tracking-tight">CodeMouse</span>
        <span className="ml-auto">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent-subtle text-accent-400 border border-accent-500/25 tracking-wide">
            BETA
          </span>
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <div className="px-3 pt-2 pb-1">
          <span className="text-[10px] font-semibold text-text-muted tracking-widest uppercase">Platform</span>
        </div>
        {NAV.map(item => <NavItem key={item.href} {...item} />)}

        <div className="px-3 pt-4 pb-1">
          <span className="text-[10px] font-semibold text-text-muted tracking-widest uppercase">Account</span>
        </div>
        {BOTTOM_NAV.map(item => <NavItem key={item.href} {...item} />)}
      </nav>

      {/* User */}
      <div className="border-t border-border p-2">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-[7px] hover:bg-subtle transition-colors cursor-default group">
          {user?.image
            ? <img src={user.image} alt="" className="w-6 h-6 rounded-full ring-1 ring-border" />
            : <div className="w-6 h-6 rounded-full bg-accent-subtle border border-accent-500/30 flex items-center justify-center text-[10px] font-bold text-accent-400">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate leading-none">{user?.name ?? 'User'}</p>
            <p className="text-[10px] text-text-muted truncate leading-tight mt-0.5">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Sign out"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-overlay text-text-muted hover:text-danger">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
