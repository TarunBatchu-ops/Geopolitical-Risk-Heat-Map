"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { RiskScore } from "@/lib/types"

interface RiskChartProps {
  data: RiskScore[]
  title: string
}

export function RiskChart({ data, title }: RiskChartProps) {
  const chartData = data.map((score) => ({
    date: new Date(score.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    stability: score.stability_score,
    "coup risk": Math.round(score.coup_risk * 100),
    "conflict risk": Math.round(score.conflict_risk * 100),
  }))

  return (
    <Card className="border-border/40 bg-card p-6 shadow-none">
      <h3 className="mb-6 text-sm font-medium text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line type="monotone" dataKey="stability" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="coup risk" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="conflict risk" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
