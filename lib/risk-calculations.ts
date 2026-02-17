/**
 * Normalize a value to 0-1 scale using min-max normalization
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}

/**
 * Sigmoid function for logistic calculations
 */
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

/**
 * Calculate Economic Stress component
 * E = 0.6 * inflation_norm + 0.4 * (1 - gdp_growth_norm)
 */
function calculateEconomicStress(indicators: Record<string, number>): number {
  const inflation = indicators.inflation_rate || 0
  const gdpGrowth = indicators.gdp_growth || 0

  // Normalize: inflation 0-20%, GDP growth -5% to +10%
  const inflationNorm = normalize(inflation, 0, 20)
  const gdpGrowthNorm = normalize(gdpGrowth, -5, 10)

  return 0.6 * inflationNorm + 0.4 * (1 - gdpGrowthNorm)
}

/**
 * Calculate Political Stress component
 * P = 0.5 * protest_norm + 0.5 * repression_norm
 */
function calculatePoliticalStress(indicators: Record<string, number>): number {
  const protestEvents = indicators.protest_events || 0
  const repressionIndex = indicators.repression_index || 0

  // Normalize: protests 0-500 events, repression 0-1 index
  const protestNorm = normalize(protestEvents, 0, 500)
  const repressionNorm = repressionIndex // Already 0-1

  return 0.5 * protestNorm + 0.5 * repressionNorm
}

/**
 * Calculate Security Stress component
 * S = 0.6 * coup_history_norm + 0.4 * military_spending_volatility_norm
 */
function calculateSecurityStress(indicators: Record<string, number>): number {
  const coupHistory = indicators.coup_history || 0
  const militarySpending = indicators.military_spending_pct_gdp || 0

  // Normalize: coup history 0-1, military spending 0-15% of GDP
  const coupHistoryNorm = coupHistory // Already 0-1
  const militaryVolatilityNorm = normalize(militarySpending, 0, 15)

  return 0.6 * coupHistoryNorm + 0.4 * militaryVolatilityNorm
}

/**
 * Calculate External Pressure component
 * X = 0.7 * sanctions_norm + 0.3 * (1 - alliance_strength_norm)
 */
function calculateExternalPressure(indicators: Record<string, number>): number {
  const sanctionsCount = indicators.sanctions_count || 0
  const allianceStrength = indicators.alliance_strength || 0

  // Normalize: sanctions 0-10000, alliance strength 0-1
  const sanctionsNorm = normalize(sanctionsCount, 0, 10000)
  const allianceStrengthNorm = allianceStrength // Already 0-1

  return 0.7 * sanctionsNorm + 0.3 * (1 - allianceStrengthNorm)
}

/**
 * Calculate Stability Score (0-100)
 * TotalStress = 0.35*E + 0.30*P + 0.20*S + 0.15*X
 * StabilityScore = 100 * (1 - TotalStress)
 */
export function calculateStabilityScore(indicators: Record<string, number>): {
  score: number
  breakdown: {
    economic_stress: number
    political_stress: number
    security_stress: number
    external_pressure: number
    total_stress: number
  }
} {
  const E = calculateEconomicStress(indicators)
  const P = calculatePoliticalStress(indicators)
  const S = calculateSecurityStress(indicators)
  const X = calculateExternalPressure(indicators)

  const totalStress = 0.35 * E + 0.3 * P + 0.2 * S + 0.15 * X
  const stabilityScore = Math.round(100 * (1 - totalStress))

  return {
    score: Math.max(0, Math.min(100, stabilityScore)),
    breakdown: {
      economic_stress: E,
      political_stress: P,
      security_stress: S,
      external_pressure: X,
      total_stress: totalStress,
    },
  }
}

/**
 * Calculate Coup Risk (0-1) using logistic model
 * z = 1.4*coup_history + 1.1*repression + 0.9*military_volatility + 0.6*protest + 0.5*autocracy
 * CoupRisk = 1 / (1 + e^-z)
 */
export function calculateCoupRisk(indicators: Record<string, number>): number {
  const coupHistory = indicators.coup_history || 0
  const repression = indicators.repression_index || 0
  const militarySpending = indicators.military_spending_pct_gdp || 0
  const protestEvents = indicators.protest_events || 0
  const regimeType = indicators.regime_type || 0 // 0 = democracy, 1 = autocracy

  // Normalize values
  const coupHistoryNorm = coupHistory
  const repressionNorm = repression
  const militaryVolatilityNorm = normalize(militarySpending, 0, 15)
  const protestNorm = normalize(protestEvents, 0, 500)
  const autocracyFlag = regimeType

  const z =
    1.4 * coupHistoryNorm +
    1.1 * repressionNorm +
    0.9 * militaryVolatilityNorm +
    0.6 * protestNorm +
    0.5 * autocracyFlag

  return sigmoid(z)
}

/**
 * Calculate Conflict Risk (0-1) using bargaining theory
 * BFI = 0.4*private_info + 0.35*commitment_problem + 0.25*indivisibility
 * R = 0.5*threat_framing + 0.3*nationalism + 0.2*external_enemy
 * D = 0.6*alliance_strength + 0.4*military_balance
 * ConflictRisk = sigmoid(1.2*BFI + 0.9*R - 1.1*D)
 */
export function calculateConflictRisk(
  indicators: Record<string, number>,
  rhetoric: { nationalism: number; threat_framing: number; external_enemy: number },
): number {
  // Bargaining Failure Index (simplified proxies)
  const privateInfoRisk = indicators.repression_index || 0 // Proxy: repression hides info
  const commitmentProblemRisk = 1 - (indicators.alliance_strength || 0) // Proxy: weak alliances
  const indivisibilityRisk = normalize(indicators.protest_events || 0, 0, 500) // Proxy: contentious issues

  const BFI = 0.4 * privateInfoRisk + 0.35 * commitmentProblemRisk + 0.25 * indivisibilityRisk

  // Rhetoric Escalation
  const R = 0.5 * rhetoric.threat_framing + 0.3 * rhetoric.nationalism + 0.2 * rhetoric.external_enemy

  // Deterrence
  const allianceStrength = indicators.alliance_strength || 0
  const militaryBalance = normalize(indicators.military_spending_pct_gdp || 0, 0, 15)
  const D = 0.6 * allianceStrength + 0.4 * militaryBalance

  const z = 1.2 * BFI + 0.9 * R - 1.1 * D

  return sigmoid(z)
}

/**
 * Calculate risk trend by comparing to 3-period moving average
 */
export function calculateTrend(currentScore: number, historicalScores: number[]): "up" | "down" | "stable" {
  if (historicalScores.length < 3) return "stable"

  const recentScores = historicalScores.slice(-3)
  const movingAverage = recentScores.reduce((a, b) => a + b, 0) / recentScores.length

  const difference = currentScore - movingAverage

  if (difference >= 2) return "up"
  if (difference <= -2) return "down"
  return "stable"
}

/**
 * Generate explanation for why risk is changing
 */
export function explainRiskChange(
  indicators: Record<string, number>,
  rhetoric: { nationalism: number; threat_framing: number; external_enemy: number },
  breakdown: {
    economic_stress: number
    political_stress: number
    security_stress: number
    external_pressure: number
  },
): string[] {
  const explanations: string[] = []

  // Economic factors
  if (breakdown.economic_stress > 0.6) {
    const inflation = indicators.inflation_rate || 0
    const gdpGrowth = indicators.gdp_growth || 0
    if (inflation > 10) {
      explanations.push(`High inflation (${inflation.toFixed(1)}%) is eroding economic stability`)
    }
    if (gdpGrowth < 0) {
      explanations.push(`Negative GDP growth (${gdpGrowth.toFixed(1)}%) signals economic contraction`)
    }
  }

  // Political factors
  if (breakdown.political_stress > 0.6) {
    const protests = indicators.protest_events || 0
    const repression = indicators.repression_index || 0
    if (protests > 200) {
      explanations.push(`Elevated protest activity (${Math.round(protests)} events) indicates popular discontent`)
    }
    if (repression > 0.6) {
      explanations.push(`High repression index (${(repression * 100).toFixed(0)}%) creates tension`)
    }
  }

  // Security factors
  if (breakdown.security_stress > 0.5) {
    const coupHistory = indicators.coup_history || 0
    if (coupHistory > 0.3) {
      explanations.push(`Historical coup activity elevates institutional instability risk`)
    }
  }

  // External pressure
  if (breakdown.external_pressure > 0.6) {
    const sanctions = indicators.sanctions_count || 0
    if (sanctions > 100) {
      explanations.push(`Significant sanctions regime (${Math.round(sanctions)} measures) constrains policy options`)
    }
  }

  // Rhetoric escalation
  if (rhetoric.threat_framing > 0.7 || rhetoric.nationalism > 0.7) {
    explanations.push(`Elevated nationalist rhetoric and threat framing increase conflict risk`)
  }

  if (explanations.length === 0) {
    explanations.push(`Risk levels remain within normal parameters based on current indicators`)
  }

  return explanations
}
