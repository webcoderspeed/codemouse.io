import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label:     string
  value:     string | number
  delta?:    number   // percentage change
  icon?:     LucideIcon
  accent?:   boolean
  className?: string
  suffix?:   string
  loading?:  boolean
}

export function MetricCard({ label, value, delta, icon: Icon, accent, className, suffix, loading }: MetricCardProps) {
  const deltaPositive = delta !== undefined && delta > 0
  const deltaNegative = delta !== undefined && delta < 0

  return (
    <div className={cn(
      'card p-5 flex flex-col gap-3',
      accent && 'border-accent-500/30 bg-accent-subtle/40',
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary tracking-wide uppercase">
          {label}
        </span>
        {Icon && (
          <div className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center',
            accent ? 'bg-accent-500/15 text-accent-400' : 'bg-subtle text-text-secondary'
          )}>
            <Icon size={14} strokeWidth={1.75} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-8 w-24 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-end gap-1.5">
            <span className={cn(
              'text-3xl font-bold tracking-tighter metric-value',
              accent ? 'text-accent-300' : 'text-text-primary'
            )}>
              {value}
            </span>
            {suffix && <span className="text-sm text-text-secondary mb-1">{suffix}</span>}
          </div>

          {delta !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              deltaPositive ? 'text-success-text' :
              deltaNegative ? 'text-danger-text' : 'text-text-secondary'
            )}>
              {deltaPositive ? <TrendingUp size={12} /> :
               deltaNegative ? <TrendingDown size={12} /> :
               <Minus size={12} />}
              <span>
                {deltaPositive ? '+' : ''}{delta.toFixed(1)}% vs last month
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
