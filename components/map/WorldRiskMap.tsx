"use client"

import type React from "react"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { useRouter } from "next/navigation"
import type { Country } from "@/lib/types"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface WorldMapProps {
  countries: Country[]
}

interface TooltipData {
  name: string
  region: string
  regimeType: string
  stabilityScore: number
  coupRisk: number
  conflictRisk: number
  riskTrend: string | null
  x: number
  y: number
}

const isoNumericToAlpha2: Record<string, string> = {
  "004": "AF", // Afghanistan
  "008": "AL", // Albania
  "012": "DZ", // Algeria
  "024": "AO", // Angola
  "031": "AZ", // Azerbaijan
  "032": "AR", // Argentina
  "036": "AU", // Australia
  "040": "AT", // Austria
  "050": "BD", // Bangladesh
  "051": "AM", // Armenia
  "056": "BE", // Belgium
  "064": "BT", // Bhutan
  "068": "BO", // Bolivia
  "070": "BA", // Bosnia
  "072": "BW", // Botswana
  "076": "BR", // Brazil
  "100": "BG", // Bulgaria
  "104": "MM", // Myanmar
  "112": "BY", // Belarus
  "116": "KH", // Cambodia
  "120": "CM", // Cameroon
  "124": "CA", // Canada
  "140": "CF", // Central African Republic
  "148": "TD", // Chad
  "152": "CL", // Chile
  "156": "CN", // China
  "170": "CO", // Colombia
  "178": "CG", // Congo
  "180": "CD", // DR Congo
  "188": "CR", // Costa Rica
  "191": "HR", // Croatia
  "192": "CU", // Cuba
  "196": "CY", // Cyprus
  "203": "CZ", // Czech Republic
  "204": "BJ", // Benin
  "208": "DK", // Denmark
  "214": "DO", // Dominican Republic
  "218": "EC", // Ecuador
  "222": "SV", // El Salvador
  "231": "ET", // Ethiopia
  "233": "EE", // Estonia
  "246": "FI", // Finland
  "250": "FR", // France
  "266": "GA", // Gabon
  "268": "GE", // Georgia
  "270": "GM", // Gambia
  "276": "DE", // Germany
  "288": "GH", // Ghana
  "300": "GR", // Greece
  "320": "GT", // Guatemala
  "324": "GN", // Guinea
  "332": "HT", // Haiti
  "340": "HN", // Honduras
  "348": "HU", // Hungary
  "352": "IS", // Iceland
  "356": "IN", // India
  "360": "ID", // Indonesia
  "364": "IR", // Iran
  "368": "IQ", // Iraq
  "372": "IE", // Ireland
  "376": "IL", // Israel
  "380": "IT", // Italy
  "388": "JM", // Jamaica
  "392": "JP", // Japan
  "398": "KZ", // Kazakhstan
  "400": "JO", // Jordan
  "404": "KE", // Kenya
  "408": "KP", // North Korea
  "410": "KR", // South Korea
  "414": "KW", // Kuwait
  "417": "KG", // Kyrgyzstan
  "418": "LA", // Laos
  "422": "LB", // Lebanon
  "428": "LV", // Latvia
  "430": "LR", // Liberia
  "434": "LY", // Libya
  "440": "LT", // Lithuania
  "442": "LU", // Luxembourg
  "450": "MG", // Madagascar
  "454": "MW", // Malawi
  "458": "MY", // Malaysia
  "462": "MV", // Maldives
  "466": "ML", // Mali
  "470": "MT", // Malta
  "478": "MR", // Mauritania
  "480": "MU", // Mauritius
  "484": "MX", // Mexico
  "496": "MN", // Mongolia
  "498": "MD", // Moldova
  "499": "ME", // Montenegro
  "504": "MA", // Morocco
  "508": "MZ", // Mozambique
  "512": "OM", // Oman
  "516": "NA", // Namibia
  "524": "NP", // Nepal
  "528": "NL", // Netherlands
  "554": "NZ", // New Zealand
  "558": "NI", // Nicaragua
  "562": "NE", // Niger
  "566": "NG", // Nigeria
  "578": "NO", // Norway
  "586": "PK", // Pakistan
  "591": "PA", // Panama
  "598": "PG", // Papua New Guinea
  "600": "PY", // Paraguay
  "604": "PE", // Peru
  "608": "PH", // Philippines
  "616": "PL", // Poland
  "620": "PT", // Portugal
  "634": "QA", // Qatar
  "642": "RO", // Romania
  "643": "RU", // Russia
  "646": "RW", // Rwanda
  "682": "SA", // Saudi Arabia
  "686": "SN", // Senegal
  "688": "RS", // Serbia
  "694": "SL", // Sierra Leone
  "702": "SG", // Singapore
  "703": "SK", // Slovakia
  "704": "VN", // Vietnam
  "705": "SI", // Slovenia
  "706": "SO", // Somalia
  "710": "ZA", // South Africa
  "716": "ZW", // Zimbabwe
  "724": "ES", // Spain
  "729": "SD", // Sudan
  "732": "EH", // Western Sahara
  "740": "SR", // Suriname
  "752": "SE", // Sweden
  "756": "CH", // Switzerland
  "760": "SY", // Syria
  "762": "TJ", // Tajikistan
  "764": "TH", // Thailand
  "768": "TG", // Togo
  "780": "TT", // Trinidad and Tobago
  "784": "AE", // UAE
  "788": "TN", // Tunisia
  "792": "TR", // Turkey
  "795": "TM", // Turkmenistan
  "800": "UG", // Uganda
  "804": "UA", // Ukraine
  "807": "MK", // North Macedonia
  "818": "EG", // Egypt
  "826": "GB", // United Kingdom
  "834": "TZ", // Tanzania
  "840": "US", // United States
  "854": "BF", // Burkina Faso
  "858": "UY", // Uruguay
  "860": "UZ", // Uzbekistan
  "862": "VE", // Venezuela
  "887": "YE", // Yemen
  "894": "ZM", // Zambia
}

export function WorldRiskMap({ countries }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const router = useRouter()

  console.log("[v0] WorldRiskMap mounted with", countries.length, "countries")

  // Create a map of ISO codes to country data
  const countryDataMap = new Map<string, Country>()
  countries.forEach((country) => {
    countryDataMap.set(country.iso_code, country)
  })

  const getCountryColor = (overallRiskScore: number) => {
    if (overallRiskScore >= 70) return "#ef4444" // red-500
    if (overallRiskScore >= 50) return "#f97316" // orange-500
    if (overallRiskScore >= 30) return "#eab308" // yellow-500
    return "#22c55e" // green-500
  }

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const isoNumeric = geo.id
    const isoAlpha2 = isoNumericToAlpha2[isoNumeric]

    if (isoAlpha2) {
      const countryData = countryDataMap.get(isoAlpha2)
      if (countryData) {
        const getRegimeType = (country: Country): string => {
          if (country.political_risk_score > 70) return "Authoritarian"
          if (country.political_risk_score > 40) return "Hybrid Regime"
          return "Democratic"
        }

        // Use actual database risk scores
        const stabilityScore = countryData.overall_risk_score
        const coupRisk = countryData.political_risk_score
        const conflictRisk = countryData.security_risk_score

        setTooltip({
          name: countryData.name,
          region: countryData.region,
          regimeType: getRegimeType(countryData),
          stabilityScore,
          coupRisk,
          conflictRisk,
          riskTrend: countryData.risk_trend,
          x: event.clientX,
          y: event.clientY,
        })
      }
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip) {
      setTooltip({
        ...tooltip,
        x: event.clientX,
        y: event.clientY,
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  const handleClick = (geo: any) => {
    const isoNumeric = geo.id
    const isoAlpha2 = isoNumericToAlpha2[isoNumeric]

    if (isoAlpha2) {
      const countryData = countryDataMap.get(isoAlpha2)
      if (countryData) {
        router.push(`/country/${countryData.iso_code.toLowerCase()}`)
      }
    }
  }

  const formatNumber = (num: number | null) => {
    if (!num) return "N/A"
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    return num.toLocaleString()
  }

  const getStabilityColor = (score: number): string => {
    if (score >= 70) return "#ef4444" // red-500 (Critical)
    if (score >= 50) return "#f97316" // orange-500 (High)
    if (score >= 30) return "#eab308" // yellow-500 (Moderate)
    return "#22c55e" // green-500 (Low)
  }

  const getRiskColor = (risk: number): string => {
    if (risk >= 60) return "#ef4444" // red-500
    if (risk >= 30) return "#f59e0b" // amber-500
    return "#94a3b8" // slate-400 (muted)
  }

  const getTrendIndicator = (trend: string | null) => {
    if (trend === "Deteriorating") return { symbol: "▲", text: "Increasing Risk", color: "#ef4444" }
    if (trend === "Improving") return { symbol: "▼", text: "Decreasing Risk", color: "#22c55e" }
    return { symbol: "●", text: "Stable", color: "#94a3b8" }
  }

  return (
    <div className="relative">
      <div className="rounded-lg border border-border/40 bg-card p-6 shadow-none">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 147,
          }}
          className="w-full"
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isoNumeric = geo.id
                  const isoAlpha2 = isoNumericToAlpha2[isoNumeric]
                  const countryData = isoAlpha2 ? countryDataMap.get(isoAlpha2) : null

                  const fillColor = countryData ? getCountryColor(countryData.overall_risk_score) : "#f3f4f6"

                  const isClickable = !!countryData

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(event) => handleMouseEnter(geo, event)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(geo)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: "#ffffff",
                          strokeWidth: 0.75,
                          outline: "none",
                          cursor: isClickable ? "pointer" : "default",
                        },
                        hover: {
                          fill: countryData ? "#6366f1" : fillColor,
                          stroke: "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: isClickable ? "pointer" : "default",
                        },
                        pressed: {
                          fill: countryData ? "#4338ca" : fillColor,
                          stroke: "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-green-500" />
            <span className="text-muted-foreground">Low Risk (0-29)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-yellow-500" />
            <span className="text-muted-foreground">Moderate (30-49)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-orange-500" />
            <span className="text-muted-foreground">High (50-69)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-red-500" />
            <span className="text-muted-foreground">Critical (70+)</span>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 w-[280px] rounded-lg border border-border bg-card shadow-lg"
          style={{
            left: `${tooltip.x + 16}px`,
            top: `${tooltip.y + 16}px`,
          }}
        >
          <div className="space-y-4 p-4">
            {/* Header */}
            <div className="space-y-0.5">
              <h3 className="font-semibold text-foreground text-base leading-tight">{tooltip.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tooltip.region}</span>
                <span>•</span>
                <span>{tooltip.regimeType}</span>
              </div>
            </div>

            {/* Primary Metric - Stability */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-muted-foreground">Risk Score</span>
                <span
                  className="font-semibold text-foreground text-2xl"
                  style={{ color: getStabilityColor(tooltip.stabilityScore) }}
                >
                  {tooltip.stabilityScore}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${tooltip.stabilityScore}%`,
                    backgroundColor: getStabilityColor(tooltip.stabilityScore),
                  }}
                />
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="space-y-1.5 border-t border-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Political Risk</span>
                <span className="font-medium" style={{ color: getRiskColor(tooltip.coupRisk) }}>
                  {tooltip.coupRisk.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Security Risk</span>
                <span className="font-medium" style={{ color: getRiskColor(tooltip.conflictRisk) }}>
                  {tooltip.conflictRisk.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Trend</span>
                <span
                  className="flex items-center gap-1.5 font-medium"
                  style={{ color: getTrendIndicator(tooltip.riskTrend).color }}
                >
                  <span className="text-base">{getTrendIndicator(tooltip.riskTrend).symbol}</span>
                  <span>{getTrendIndicator(tooltip.riskTrend).text}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
