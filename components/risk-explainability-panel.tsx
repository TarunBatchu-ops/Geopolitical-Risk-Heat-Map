"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface RiskDriver {
  name: string
  score: number
  change: number
  trend: "up" | "down" | "stable"
}

interface RiskExplainabilityPanelProps {
  politicalRisk: number
  economicRisk: number
  securityRisk: number
  riskLevel: string
  region: string
}

export function RiskExplainabilityPanel({
  politicalRisk,
  economicRisk,
  securityRisk,
  riskLevel,
  region,
}: RiskExplainabilityPanelProps) {
  // Generate realistic drivers based on actual risk scores
  const politicalDrivers = generatePoliticalDrivers(politicalRisk, region)
  const economicDrivers = generateEconomicDrivers(economicRisk, region)
  const securityDrivers = generateSecurityDrivers(securityRisk, region)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-foreground">What's Driving the Risk?</h2>
      <p className="text-sm text-muted-foreground">Risk scores broken down into key drivers and their recent changes</p>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Political Risk Drivers */}
        <Card className="border-border/40 bg-card p-6 shadow-none">
          <div className="mb-4 space-y-1">
            <h3 className="text-sm font-medium text-foreground">Political Risk ({politicalRisk})</h3>
            <p className="text-xs text-muted-foreground">Institutional & governance factors</p>
          </div>
          <div className="space-y-3">
            {politicalDrivers.map((driver, index) => (
              <DriverItem key={index} driver={driver} />
            ))}
          </div>
        </Card>

        {/* Economic Risk Drivers */}
        <Card className="border-border/40 bg-card p-6 shadow-none">
          <div className="mb-4 space-y-1">
            <h3 className="text-sm font-medium text-foreground">Economic Risk ({economicRisk})</h3>
            <p className="text-xs text-muted-foreground">Fiscal & market conditions</p>
          </div>
          <div className="space-y-3">
            {economicDrivers.map((driver, index) => (
              <DriverItem key={index} driver={driver} />
            ))}
          </div>
        </Card>

        {/* Security Risk Drivers */}
        <Card className="border-border/40 bg-card p-6 shadow-none">
          <div className="mb-4 space-y-1">
            <h3 className="text-sm font-medium text-foreground">Security Risk ({securityRisk})</h3>
            <p className="text-xs text-muted-foreground">Violence & conflict indicators</p>
          </div>
          <div className="space-y-3">
            {securityDrivers.map((driver, index) => (
              <DriverItem key={index} driver={driver} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function DriverItem({ driver }: { driver: RiskDriver }) {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-red-600" />
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-green-600" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return "text-red-600"
    if (trend === "down") return "text-green-600"
    return "text-muted-foreground"
  }

  const changeSymbol = driver.change > 0 ? "+" : ""

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        {getTrendIcon(driver.trend)}
        <span className="text-foreground">{driver.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">{driver.score}</span>
        {driver.change !== 0 && (
          <span className={`font-medium ${getTrendColor(driver.trend)}`}>
            {changeSymbol}
            {driver.change}
          </span>
        )}
      </div>
    </div>
  )
}

// Generate realistic political drivers based on risk score
function generatePoliticalDrivers(score: number, region: string): RiskDriver[] {
  const drivers: RiskDriver[] = []

  if (score >= 70) {
    // Critical political risk
    drivers.push(
      { name: "Political instability", score: Math.floor(score * 0.4), change: 5, trend: "up" },
      { name: "Corruption index", score: Math.floor(score * 0.35), change: 2, trend: "up" },
      { name: "Rule of law deficit", score: Math.floor(score * 0.25), change: 0, trend: "stable" },
    )
  } else if (score >= 50) {
    // High political risk
    drivers.push(
      { name: "Election uncertainty", score: Math.floor(score * 0.4), change: 3, trend: "up" },
      { name: "Policy volatility", score: Math.floor(score * 0.35), change: -1, trend: "down" },
      { name: "Institutional weakness", score: Math.floor(score * 0.25), change: 1, trend: "up" },
    )
  } else if (score >= 30) {
    // Moderate political risk
    drivers.push(
      { name: "Political polarization", score: Math.floor(score * 0.4), change: 2, trend: "up" },
      { name: "Reform challenges", score: Math.floor(score * 0.35), change: 0, trend: "stable" },
      { name: "Governance gaps", score: Math.floor(score * 0.25), change: -1, trend: "down" },
    )
  } else {
    // Low political risk
    drivers.push(
      { name: "Minor policy shifts", score: Math.floor(score * 0.45), change: 0, trend: "stable" },
      { name: "Legislative gridlock", score: Math.floor(score * 0.35), change: 1, trend: "up" },
      { name: "Regulatory changes", score: Math.floor(score * 0.2), change: -1, trend: "down" },
    )
  }

  return drivers
}

// Generate realistic economic drivers based on risk score
function generateEconomicDrivers(score: number, region: string): RiskDriver[] {
  const drivers: RiskDriver[] = []

  if (score >= 70) {
    // Critical economic risk
    drivers.push(
      { name: "Currency crisis", score: Math.floor(score * 0.4), change: 8, trend: "up" },
      { name: "Inflation surge", score: Math.floor(score * 0.35), change: 6, trend: "up" },
      { name: "Debt distress", score: Math.floor(score * 0.25), change: 4, trend: "up" },
    )
  } else if (score >= 50) {
    // High economic risk
    drivers.push(
      { name: "Fiscal imbalances", score: Math.floor(score * 0.4), change: 3, trend: "up" },
      { name: "Banking sector stress", score: Math.floor(score * 0.35), change: 2, trend: "up" },
      { name: "Trade disruptions", score: Math.floor(score * 0.25), change: -1, trend: "down" },
    )
  } else if (score >= 30) {
    // Moderate economic risk
    drivers.push(
      { name: "Growth slowdown", score: Math.floor(score * 0.4), change: 1, trend: "up" },
      { name: "Unemployment rise", score: Math.floor(score * 0.35), change: 2, trend: "up" },
      { name: "Investment decline", score: Math.floor(score * 0.25), change: 0, trend: "stable" },
    )
  } else {
    // Low economic risk
    drivers.push(
      { name: "Market volatility", score: Math.floor(score * 0.45), change: 0, trend: "stable" },
      { name: "Supply chain issues", score: Math.floor(score * 0.35), change: -2, trend: "down" },
      { name: "Interest rate changes", score: Math.floor(score * 0.2), change: 1, trend: "up" },
    )
  }

  return drivers
}

// Generate realistic security drivers based on risk score
function generateSecurityDrivers(score: number, region: string): RiskDriver[] {
  const drivers: RiskDriver[] = []

  if (score >= 70) {
    // Critical security risk
    drivers.push(
      { name: "Active conflict", score: Math.floor(score * 0.45), change: 10, trend: "up" },
      { name: "Humanitarian crisis", score: Math.floor(score * 0.35), change: 7, trend: "up" },
      { name: "Refugee displacement", score: Math.floor(score * 0.2), change: 5, trend: "up" },
    )
  } else if (score >= 50) {
    // High security risk
    drivers.push(
      { name: "Organized crime activity", score: Math.floor(score * 0.4), change: 4, trend: "up" },
      { name: "Cartel violence", score: Math.floor(score * 0.35), change: 3, trend: "up" },
      { name: "Homicide rate", score: Math.floor(score * 0.25), change: -1, trend: "down" },
    )
  } else if (score >= 30) {
    // Moderate security risk
    drivers.push(
      { name: "Border tensions", score: Math.floor(score * 0.4), change: 2, trend: "up" },
      { name: "Terrorism threat", score: Math.floor(score * 0.35), change: -1, trend: "down" },
      { name: "Protest activity", score: Math.floor(score * 0.25), change: 1, trend: "up" },
    )
  } else {
    // Low security risk
    drivers.push(
      { name: "Cybersecurity threats", score: Math.floor(score * 0.45), change: 1, trend: "up" },
      { name: "Minor civil unrest", score: Math.floor(score * 0.35), change: 0, trend: "stable" },
      { name: "Infrastructure risk", score: Math.floor(score * 0.2), change: -1, trend: "down" },
    )
  }

  return drivers
}
