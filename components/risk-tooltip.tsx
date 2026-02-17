import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

interface RiskTooltipProps {
  type: "stability" | "coup" | "conflict" | "trend"
  children?: React.ReactNode
}

const tooltipContent = {
  stability: {
    title: "Stability Score",
    description:
      "Reflects combined economic, political, security, and external stress (0–100). Lower scores indicate higher risk of political instability, regime collapse, or violent conflict.",
    drivers:
      "Driven by unemployment, inflation, GDP growth, protest frequency, repression levels, coup history, military spending, sanctions, and alliance strength.",
  },
  coup: {
    title: "Coup Risk",
    description:
      "Estimates elite-driven regime collapse risk based on historical coups, repression, and military instability.",
    drivers:
      "Increases with: military spending as % GDP, repression index, protest frequency, unemployment. Decreases with: economic growth, democratic institutions.",
  },
  conflict: {
    title: "Conflict Risk",
    description: "Probability of armed conflict based on bargaining theory and rhetorical escalation.",
    drivers:
      "Driven by nationalist rhetoric, threat framing, external enemy narratives, sanctions, military spending, and alliance weakness. Escalatory rhetoric increases conflict probability.",
  },
  trend: {
    title: "Risk Trend",
    description: "Direction of change in stability score based on recent historical data.",
    drivers:
      "▲ Improving = stability increasing over time. ▼ Deteriorating = stability declining. ● Stable = minimal change.",
  },
}

export function RiskTooltip({ type, children }: RiskTooltipProps) {
  const content = tooltipContent[type]

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-4 w-4" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs space-y-2 p-4" sideOffset={5}>
          <div className="font-medium text-foreground">{content.title}</div>
          <p className="text-sm leading-relaxed text-muted-foreground">{content.description}</p>
          <div className="pt-2 border-t border-border/40">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Key Drivers</div>
            <p className="text-xs leading-relaxed text-muted-foreground">{content.drivers}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
