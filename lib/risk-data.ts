import { createClient } from "@/lib/supabase/server"
import type { CountryIndicator, RhetoricScore, RiskScore } from "@/lib/types"
import {
  calculateStabilityScore,
  calculateCoupRisk,
  calculateConflictRisk,
  calculateTrend,
  explainRiskChange,
} from "@/lib/risk-calculations"

/**
 * Fetch latest indicators for a country
 */
export async function getLatestIndicators(countryId: string): Promise<Record<string, number>> {
  const supabase = await createClient()

  const { data: indicators } = await supabase
    .from("country_indicators")
    .select("*")
    .eq("country_id", countryId)
    .order("date", { ascending: false })
    .limit(20)

  if (!indicators || indicators.length === 0) {
    return {}
  }

  const indicatorMap: Record<string, number> = {}
  for (const indicator of indicators as CountryIndicator[]) {
    if (!indicatorMap[indicator.indicator_name]) {
      indicatorMap[indicator.indicator_name] = indicator.value
    }
  }

  return indicatorMap
}

/**
 * Fetch latest rhetoric scores
 */
export async function getLatestRhetoric(
  countryId: string,
): Promise<{ nationalism: number; threat_framing: number; external_enemy: number }> {
  const supabase = await createClient()

  const { data: rhetoric } = await supabase
    .from("rhetoric_scores")
    .select("*")
    .eq("country_id", countryId)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!rhetoric) {
    return { nationalism: 0, threat_framing: 0, external_enemy: 0 }
  }

  const typedRhetoric = rhetoric as RhetoricScore
  return {
    nationalism: typedRhetoric.nationalism,
    threat_framing: typedRhetoric.threat_framing,
    external_enemy: typedRhetoric.external_enemy,
  }
}

/**
 * Fetch historical risk scores for trend analysis
 */
export async function getHistoricalRiskScores(countryId: string): Promise<RiskScore[]> {
  const supabase = await createClient()

  const { data: riskScores } = await supabase
    .from("risk_scores")
    .select("*")
    .eq("country_id", countryId)
    .order("date", { ascending: true })

  return (riskScores as RiskScore[]) || []
}

/**
 * Calculate all risk metrics for a country
 */
export async function calculateCountryRisk(countryId: string) {
  const indicators = await getLatestIndicators(countryId)
  const rhetoric = await getLatestRhetoric(countryId)
  const historicalScores = await getHistoricalRiskScores(countryId)

  // Calculate stability score
  const stabilityResult = calculateStabilityScore(indicators)

  // Calculate coup risk
  const coupRisk = calculateCoupRisk(indicators)

  // Calculate conflict risk
  const conflictRisk = calculateConflictRisk(indicators, rhetoric)

  // Calculate trend
  const historicalStabilityScores = historicalScores.map((s) => s.stability_score)
  const trend = calculateTrend(stabilityResult.score, historicalStabilityScores)

  // Generate explanations
  const explanations = explainRiskChange(indicators, rhetoric, stabilityResult.breakdown)

  return {
    stability_score: stabilityResult.score,
    coup_risk: coupRisk,
    conflict_risk: conflictRisk,
    trend,
    breakdown: stabilityResult.breakdown,
    explanations,
    indicators,
    rhetoric,
    historicalScores,
  }
}

/**
 * Get indicator breakdown by category
 */
export function categorizeIndicators(indicators: Record<string, number>) {
  return {
    economic: {
      "Inflation Rate": indicators.inflation_rate || 0,
      "GDP Growth": indicators.gdp_growth || 0,
    },
    political: {
      "Protest Events": indicators.protest_events || 0,
      "Repression Index": indicators.repression_index || 0,
    },
    security: {
      "Coup History": indicators.coup_history || 0,
      "Military Spending (% GDP)": indicators.military_spending_pct_gdp || 0,
    },
    external: {
      "Sanctions Count": indicators.sanctions_count || 0,
      "Alliance Strength": indicators.alliance_strength || 0,
    },
  }
}
