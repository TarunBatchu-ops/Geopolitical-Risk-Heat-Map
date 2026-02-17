export interface Country {
  id: string
  name: string
  iso_code: string
  region: string
  capital: string | null
  population: number | null
  gdp_usd: number | null
  political_risk_score: number
  economic_risk_score: number
  security_risk_score: number
  overall_risk_score: number
  risk_level: "Low" | "Moderate" | "High" | "Critical"
  key_risks: string[] | null
  recent_events: string[] | null
  risk_trend: "Improving" | "Stable" | "Deteriorating" | null
  last_updated: string
  created_at: string
}

export interface CountryIndicator {
  id: string
  country_id: string
  date: string
  indicator_name: string
  value: number
  source: string
  created_at: string
}

export interface RhetoricScore {
  id: string
  country_id: string
  date: string
  nationalism: number
  threat_framing: number
  external_enemy: number
  created_at: string
}

export interface RiskScore {
  id: string
  country_id: string
  date: string
  stability_score: number
  coup_risk: number
  conflict_risk: number
  trend: "up" | "down" | "stable"
  created_at: string
}

export interface IndicatorData {
  [key: string]: number
}

export interface RiskCalculationResult {
  stability_score: number
  coup_risk: number
  conflict_risk: number
  trend: "up" | "down" | "stable"
  breakdown: {
    economic_stress: number
    political_stress: number
    security_stress: number
    external_pressure: number
    total_stress: number
  }
}
