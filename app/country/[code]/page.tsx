import { createClient } from "@/lib/supabase/server"
import type { Country } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { notFound } from "next/navigation"
import { RiskTooltip } from "@/components/risk-tooltip"
import { RiskExplainabilityPanel } from "@/components/risk-explainability-panel"

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function CountryDetailPage({ params }: PageProps) {
  const { code } = await params
  const supabase = await createClient()

  const { data: country, error } = await supabase
    .from("countries")
    .select("*")
    .eq("iso_code", code.toUpperCase())
    .single()

  if (error || !country) {
    console.error("[v0] Error fetching country:", error)
    notFound()
  }

  const typedCountry = country as Country

  const stabilityScore = 100 - typedCountry.overall_risk_score
  const coupRiskPercentage = typedCountry.political_risk_score
  const conflictRiskPercentage = typedCountry.security_risk_score

  const formatGDP = (gdp: number) => {
    if (gdp >= 1000000000000) {
      // >= 1 trillion
      return `$${(gdp / 1000000000000).toFixed(2)}T`
    } else if (gdp >= 1000000000) {
      // >= 1 billion
      return `$${(gdp / 1000000000).toFixed(2)}B`
    } else {
      // < 1 billion
      return `$${(gdp / 1000000).toFixed(2)}M`
    }
  }

  const formatPopulation = (pop: number) => {
    if (pop >= 1000000000) {
      // >= 1 billion
      return `${(pop / 1000000000).toFixed(2)}B`
    } else {
      // < 1 billion, show in millions
      return `${(pop / 1000000).toFixed(2)}M`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Country Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-3xl font-medium text-foreground">{typedCountry.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{typedCountry.region}</span>
                {typedCountry.capital && (
                  <>
                    <span>·</span>
                    <span>{typedCountry.capital}</span>
                  </>
                )}
                <span>·</span>
                <span>{typedCountry.iso_code}</span>
              </div>
            </div>
            <RiskBadge level={getRiskLevel(typedCountry.overall_risk_score)} />
          </div>
        </div>

        <div className="mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Risk Assessment</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendIcon trend={typedCountry.risk_trend || "Stable"} />
              <span className="capitalize">{typedCountry.risk_trend || "Stable"}</span>
              <RiskTooltip type="trend" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/40 bg-card p-6 shadow-none">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Overall Risk Score
                  </div>
                  <RiskTooltip type="stability" />
                </div>
                <div className="text-4xl font-normal text-foreground">{typedCountry.overall_risk_score}</div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </Card>

            <Card className="border-border/40 bg-card p-6 shadow-none">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Political Risk
                  </div>
                  <RiskTooltip type="coup" />
                </div>
                <div className="text-4xl font-normal text-orange-600">{typedCountry.political_risk_score}</div>
                <div className="text-sm text-muted-foreground">score</div>
              </div>
            </Card>

            <Card className="border-border/40 bg-card p-6 shadow-none">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Security Risk</div>
                  <RiskTooltip type="conflict" />
                </div>
                <div className="text-4xl font-normal text-red-600">{typedCountry.security_risk_score}</div>
                <div className="text-sm text-muted-foreground">score</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Risk Explainability Panel */}
        <div className="mb-12">
          <RiskExplainabilityPanel
            politicalRisk={typedCountry.political_risk_score}
            economicRisk={typedCountry.economic_risk_score}
            securityRisk={typedCountry.security_risk_score}
            riskLevel={typedCountry.risk_level}
            region={typedCountry.region}
          />
        </div>

        {/* Country Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Country Information</h2>
          <Card className="border-border/40 bg-card p-6 shadow-none">
            <dl className="grid gap-4 sm:grid-cols-2">
              {typedCountry.population && (
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Population</dt>
                  <dd className="text-base text-foreground">{formatPopulation(typedCountry.population)}</dd>
                </div>
              )}
              {typedCountry.gdp_usd && (
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">GDP (USD)</dt>
                  <dd className="text-base text-foreground">{formatGDP(typedCountry.gdp_usd)}</dd>
                </div>
              )}
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Region</dt>
                <dd className="text-base text-foreground">{typedCountry.region}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Risk Level</dt>
                <dd className="text-base text-foreground">{typedCountry.risk_level}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last Updated</dt>
                <dd className="text-base text-foreground">
                  {new Date(typedCountry.last_updated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </main>
    </div>
  )
}

function RiskBadge({ level }: { level: string }) {
  const variants = {
    Low: "bg-green-50 text-green-700 border-green-200",
    Moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
    High: "bg-orange-50 text-orange-700 border-orange-200",
    Critical: "bg-red-50 text-red-700 border-red-200",
  }

  return (
    <Badge variant="outline" className={`border text-xs font-normal ${variants[level as keyof typeof variants]}`}>
      {level}
    </Badge>
  )
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Improving") {
    return <TrendingDown className="h-4 w-4 text-green-600" />
  }
  if (trend === "Deteriorating") {
    return <TrendingUp className="h-4 w-4 text-red-600" />
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

function getRiskLevel(overallRiskScore: number): string {
  if (overallRiskScore >= 70) return "Critical"
  if (overallRiskScore >= 50) return "High"
  if (overallRiskScore >= 30) return "Moderate"
  return "Low"
}
