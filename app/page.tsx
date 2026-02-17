"use client"

import type { Country } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { CountryFilters } from "@/components/country-filters"
import { RiskTooltip } from "@/components/risk-tooltip"
import { WorldRiskMap } from "@/components/map/WorldRiskMap"
import { GlobalRiskOverview } from "@/components/global-risk-overview"
import useSWR from "swr"
import { useEffect, useState } from "react"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function DashboardPage() {
  const { data: countries, error, isLoading } = useSWR<Country[]>("/api/countries", fetcher)

  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState("all")
  const [sortBy, setSortBy] = useState("risk-desc")

  useEffect(() => {
    if (!countries) return

    let filtered = [...countries]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.iso_code.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter((c) => c.region === regionFilter)
    }

    // Apply risk level filter
    if (riskLevelFilter !== "all") {
      filtered = filtered.filter((c) => c.risk_level === riskLevelFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case "risk-desc":
        filtered.sort((a, b) => b.overall_risk_score - a.overall_risk_score)
        break
      case "risk-asc":
        filtered.sort((a, b) => a.overall_risk_score - b.overall_risk_score)
        break
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "stability-asc":
        filtered.sort((a, b) => a.overall_risk_score - b.overall_risk_score)
        break
      case "stability-desc":
        filtered.sort((a, b) => b.overall_risk_score - a.overall_risk_score)
        break
    }

    setFilteredCountries(filtered)
  }, [countries, searchQuery, regionFilter, riskLevelFilter, sortBy])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-medium text-foreground">Error Loading Data</h2>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  if (isLoading || !countries) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-border border-t-foreground rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading countries...</p>
        </div>
      </div>
    )
  }

  const totalCountries = countries.length
  const criticalRisk = countries.filter((c) => c.risk_level === "Critical").length
  const highRisk = countries.filter((c) => c.risk_level === "High").length
  const avgRiskScore = Math.round(countries.reduce((sum, c) => sum + c.overall_risk_score, 0) / countries.length)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-2xl font-medium text-foreground">Country Risk Dashboard</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Monitor geopolitical risk across {totalCountries} countries worldwide
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Summary Cards */}
        <div className="mb-12 grid gap-4 md:grid-cols-4">
          <Card className="border-border/40 bg-card p-5 shadow-none">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Countries</div>
            <div className="mt-3 text-3xl font-normal text-foreground">{totalCountries}</div>
          </Card>
          <Card className="border-border/40 bg-card p-5 shadow-none">
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Critical Risk</div>
              <RiskTooltip type="stability" />
            </div>
            <div className="mt-3 text-3xl font-normal text-red-600">{criticalRisk}</div>
          </Card>
          <Card className="border-border/40 bg-card p-5 shadow-none">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">High Risk</div>
            <div className="mt-3 text-3xl font-normal text-orange-600">{highRisk}</div>
          </Card>
          <Card className="border-border/40 bg-card p-5 shadow-none">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Average Score</div>
            <div className="mt-3 text-3xl font-normal text-foreground">{avgRiskScore}</div>
          </Card>
        </div>

        <div className="mb-12">
          <WorldRiskMap countries={countries} />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <CountryFilters
            onSearchChange={setSearchQuery}
            onRegionChange={setRegionFilter}
            onRiskLevelChange={setRiskLevelFilter}
            onSortChange={setSortBy}
          />
        </div>

        {/* Global Risk Overview section */}
        <div className="mb-12">
          <GlobalRiskOverview countries={filteredCountries} />
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
