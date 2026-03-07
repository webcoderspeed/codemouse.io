import { cn } from '@/lib/utils'

type Variant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variants: Record<Variant, string> = {
  neutral: 'bg-subtle text-text-secondary border-border',
  accent:  'bg-accent-subtle text-accent-400 border-accent-500/25',
  success: 'bg-success/10 text-success-text border-success/20',
  warning: 'bg-warning/10 text-warning-text border-warning/20',
  danger:  'bg-danger/10 text-danger-text border-danger/20',
  info:    'bg-info/10 text-info-text border-info/20',
}

const dotColors: Record<Variant, string> = {
  neutral: 'bg-text-muted',
  accent:  'bg-accent-400',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
  info:    'bg-info',
}

export function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full',
      'text-[11px] font-semibold tracking-wide uppercase border',
      variants[variant],
      className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}
