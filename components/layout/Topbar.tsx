'use client'
import { Bell, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopbarProps {
  title:    string
  subtitle?: string
  actions?: React.ReactNode
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header className="h-14 border-b border-border flex items-center px-6 gap-4 bg-surface/80 backdrop-blur sticky top-0 z-30">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-text-primary tracking-tight truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-text-secondary truncate leading-none mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <button className="w-8 h-8 flex items-center justify-center rounded-[7px] text-text-secondary hover:text-text-primary hover:bg-subtle transition-colors relative">
          <Bell size={15} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
