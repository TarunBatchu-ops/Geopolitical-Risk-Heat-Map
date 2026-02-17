import { createClient } from "@/lib/supabase/server"

// World Bank API endpoints
const WB_BASE_URL = "https://api.worldbank.org/v2"

// Key indicators for geopolitical risk modeling
export const RISK_INDICATORS = {
  // Political/Governance
  "SL.UEM.TOTL.ZS": "Unemployment Rate",
  "NY.GDP.PCAP.CD": "GDP per Capita",
  "FP.CPI.TOTL.ZG": "Inflation Rate",
  "MS.MIL.XPND.GD.ZS": "Military Expenditure (% of GDP)",
  "SP.POP.TOTL": "Total Population",

  // Economic Stress
  "NY.GDP.MKTP.KD.ZG": "GDP Growth Rate",
  "GC.DOD.TOTL.GD.ZS": "Government Debt (% of GDP)",
  "BX.KLT.DINV.WD.GD.ZS": "Foreign Direct Investment",
  "NE.EXP.GNFS.ZS": "Exports (% of GDP)",
  "NE.IMP.GNFS.ZS": "Imports (% of GDP)",

  // Social Indicators
  "SI.POV.GINI": "GINI Index (Inequality)",
  "SP.POP.GROW": "Population Growth Rate",
  "SE.SEC.ENRR": "Secondary School Enrollment",
  "SH.DYN.MORT": "Infant Mortality Rate",
} as const

export type IndicatorCode = keyof typeof RISK_INDICATORS

interface WorldBankResponse {
  indicator: { id: string; value: string }
  country: { id: string; value: string }
  countryiso3code: string
  date: string
  value: number | null
  unit: string
  obs_status: string
  decimal: number
}

/**
 * Fetch indicator data from World Bank API for a specific country
 */
export async function fetchWorldBankData(
  countryCode: string,
  indicatorCode: IndicatorCode,
  startYear = 2010,
  endYear = 2023,
): Promise<WorldBankResponse[]> {
  const url = `${WB_BASE_URL}/country/${countryCode}/indicator/${indicatorCode}?format=json&date=${startYear}:${endYear}&per_page=500`

  console.log("[v0] Fetching World Bank data:", url)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`World Bank API error: ${response.status}`)
  }

  const data = await response.json()

  // World Bank API returns [metadata, data]
  if (!Array.isArray(data) || data.length < 2) {
    return []
  }

  return data[1] || []
}

/**
 * Import indicator data into Supabase for a specific country
 */
export async function importIndicatorData(
  countryId: string,
  countryCode: string,
  indicatorCode: IndicatorCode,
): Promise<{ success: boolean; recordsImported: number; error?: string }> {
  try {
    const supabase = await createClient()

    // Fetch data from World Bank
    const wbData = await fetchWorldBankData(countryCode, indicatorCode)

    if (wbData.length === 0) {
      return { success: true, recordsImported: 0 }
    }

    // Transform to our schema
    const records = wbData
      .filter((d) => d.value !== null)
      .map((d) => ({
        country_id: countryId,
        indicator_code: indicatorCode,
        indicator_name: RISK_INDICATORS[indicatorCode],
        year: Number.parseInt(d.date),
        value: d.value,
        source: "World Bank",
      }))

    if (records.length === 0) {
      return { success: true, recordsImported: 0 }
    }

    // Upsert data (update if exists, insert if new)
    const { error } = await supabase.from("country_indicators").upsert(records, {
      onConflict: "country_id,indicator_code,year",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("[v0] Supabase upsert error:", error)
      return { success: false, recordsImported: 0, error: error.message }
    }

    return { success: true, recordsImported: records.length }
  } catch (error) {
    console.error("[v0] Import error:", error)
    return {
      success: false,
      recordsImported: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Import all indicators for a country
 */
export async function importAllIndicatorsForCountry(
  countryId: string,
  countryCode: string,
): Promise<{
  success: boolean
  totalRecords: number
  errors: string[]
}> {
  const results = {
    success: true,
    totalRecords: 0,
    errors: [] as string[],
  }

  const indicatorCodes = Object.keys(RISK_INDICATORS) as IndicatorCode[]

  for (const code of indicatorCodes) {
    const result = await importIndicatorData(countryId, countryCode, code)

    if (result.success) {
      results.totalRecords += result.recordsImported
    } else {
      results.success = false
      results.errors.push(`${code}: ${result.error}`)
    }

    // Rate limiting: wait 200ms between requests
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  return results
}
