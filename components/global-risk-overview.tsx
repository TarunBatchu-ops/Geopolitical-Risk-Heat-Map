import { Card } from "@/components/ui/card"
import type { Country } from "@/lib/types"
import Link from "next/link"

interface GlobalRiskOverviewProps {
  countries: Country[]
}

export function GlobalRiskOverview({ countries }: GlobalRiskOverviewProps) {
  // Group countries by risk level
  const byRiskLevel = countries.reduce(
    (acc, country) => {
      if (!acc[country.risk_level]) acc[country.risk_level] = []
      acc[country.risk_level].push(country)
      return acc
    },
    {} as Record<string, Country[]>,
  )

  const riskLevels = ["Critical", "High", "Moderate", "Low"]
  const colorMap = {
    Critical: "bg-red-100 border-red-300 hover:border-red-400",
    High: "bg-orange-100 border-orange-300 hover:border-orange-400",
    Moderate: "bg-yellow-100 border-yellow-300 hover:border-yellow-400",
    Low: "bg-green-100 border-green-300 hover:border-green-400",
  }
  const textColorMap = {
    Critical: "text-red-900",
    High: "text-orange-900",
    Moderate: "text-yellow-900",
    Low: "text-green-900",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-foreground mb-2">Global Risk Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Visual distribution of geopolitical risk across all monitored countries, color-coded by stability score
        </p>
      </div>

      <div className="space-y-4">
        {riskLevels.map((level) => {
          const levelCountries = byRiskLevel[level] || []
          if (levelCountries.length === 0) return null

          return (
            <div key={level} className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className={`text-sm font-medium ${textColorMap[level as keyof typeof textColorMap]}`}>
                  {level} Risk
                </h3>
                <span className="text-xs text-muted-foreground">({levelCountries.length} countries)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {levelCountries.map((country) => (
                    <Link key={country.id} href={`/country/${country.iso_code.toLowerCase()}`}>
                      <Card
                        className={`px-3 py-2 border transition-all cursor-pointer ${colorMap[level as keyof typeof colorMap]}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${textColorMap[level as keyof typeof textColorMap]}`}>
                            {country.name}
                          </span>
                          <span className={`text-xs ${textColorMap[level as keyof typeof textColorMap]}/70`}>
                            {country.overall_risk_score}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
