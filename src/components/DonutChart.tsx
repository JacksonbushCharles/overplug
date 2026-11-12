'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type DonutChartProps = {
  delivered: number
  failed: number
}

export function DonutChart({ delivered, failed }: DonutChartProps) {
  const data = [
    { name: 'Delivered', value: delivered, color: '#22c55e' },
    { name: 'Failed', value: failed, color: '#f43f5e' },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Delivery mix</h3>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={56} outerRadius={80} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
