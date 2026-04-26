'use client'

import React, { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface SalesChartProps {
  site: string
  period?: '7d' | '30d' | '90d'
}

export function SalesChart({ site, period = '30d' }: SalesChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics/sales?site=${site}&period=${period}`)
      .then(res => res.json())
      .then(d => {
        if (Array.isArray(d)) setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [site, period])

  if (loading) {
    return (
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c9196' }}>
        Chargement...
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c9196' }}>
        Aucune donnée disponible. Configurez GA4 pour voir les ventes.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#8c9196' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8c9196' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v.toLocaleString('fr-FR')} €`}
        />
        <Tooltip
          formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 'Revenu']}
          labelStyle={{ fontWeight: 600 }}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#00e5ff"
          strokeWidth={2}
          fill="url(#revenueGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
