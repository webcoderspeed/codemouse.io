'use client'

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

/* ─── shared tooltip style ─── */
const tooltipStyle = {
  backgroundColor: '#13151F',
  border: '1px solid #1E2030',
  borderRadius: '8px',
  color: '#E2E4F0',
  fontSize: '12px',
  padding: '8px 12px',
}

/* ─── PR Volume over time ─── */
export function PRVolumeChart({ data }: { data: { date: string; reviews: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2030" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7194' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7194' }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#2D3154', strokeWidth: 1 }} />
        <Area
          type="monotone" dataKey="reviews" name="Reviews"
          stroke="#6366F1" strokeWidth={2}
          fill="url(#reviewGrad)" dot={false} activeDot={{ r: 4, fill: '#6366F1' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ─── Issues by type (bar) ─── */
export function IssueTypeChart({ data }: { data: { type: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2030" vertical={false} />
        <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#6B7194' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7194' }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1E2030' }} />
        <Bar dataKey="count" name="Issues" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ─── Verdict distribution (pie) ─── */
const VERDICT_COLORS: Record<string, string> = {
  Approved: '#22C55E',
  Changes:  '#EF4444',
  Comment:  '#6B7194',
}

export function VerdictPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="45%"
          innerRadius={60} outerRadius={80}
          paddingAngle={3} dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={VERDICT_COLORS[entry.name] ?? '#6B7194'} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(v) => <span style={{ color: '#6B7194', fontSize: 12 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

/* ─── Issues over time (area, two series) ─── */
export function IssuesOverTimeChart({ data }: { data: { date: string; issues: number; reviews: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="issueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2030" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7194' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7194' }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#2D3154', strokeWidth: 1 }} />
        <Area
          type="monotone" dataKey="issues" name="Issues"
          stroke="#F59E0B" strokeWidth={2}
          fill="url(#issueGrad)" dot={false} activeDot={{ r: 4, fill: '#F59E0B' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
