import { createClient } from "@/lib/supabase/server"

/**
 * GDELT (Global Database of Events, Language, and Tone)
 * Real-time event data and news monitoring
 * API: https://blog.gdeltproject.org/gdelt-2-0-our-global-world-in-realtime/
 */

const GDELT_BASE_URL = "https://api.gdeltproject.org/api/v2"

interface GDELTToneMetrics {
  avgTone: number
  eventCount: number
  negativeEvents: number
  positiveEvents: number
  politicalInstability: number
}

/**
 * Fetch recent news tone and political events from GDELT
 */
export async function fetchGDELTData(countryName: string, days = 7): Promise<GDELTToneMetrics> {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // GDELT DOC 2.0 API query for country mentions
    const url = new URL(`${GDELT_BASE_URL}/doc/doc`)
    url.searchParams.set("query", `${countryName} (protest OR violence OR election OR crisis)`)
    url.searchParams.set("mode", "ToneChart")
    url.searchParams.set("format", "json")
    url.searchParams.set("startdatetime", formatGDELTDate(startDate))
    url.searchParams.set("enddatetime", formatGDELTDate(endDate))

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.warn(`[v0] GDELT API returned ${response.status}`)
      return getDefaultMetrics()
    }

    const data = await response.json()

    // Parse GDELT tone data
    const avgTone = Number.parseFloat(data.tone?.avgTone || "0")
    const eventCount = Number.parseInt(data.timeline?.length || "0", 10)

    // Negative tone indicates political instability
    const politicalInstability = Math.max(0, Math.min(100, Math.abs(avgTone) * 2))

    return {
      avgTone,
      eventCount,
      negativeEvents: avgTone < 0 ? eventCount : 0,
      positiveEvents: avgTone >= 0 ? eventCount : 0,
      politicalInstability: Math.round(politicalInstability),
    }
  } catch (error) {
    console.error(`[v0] GDELT fetch error for ${countryName}:`, error)
    return getDefaultMetrics()
  }
}

/**
 * Update political risk based on GDELT news tone analysis
 */
export async function updatePoliticalRiskFromGDELT(
  countryISOCode: string,
  countryName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const metrics = await fetchGDELTData(countryName, 7)

    // Update political risk score based on news tone
    const { error } = await supabase
      .from("countries")
      .update({
        political_risk_score: metrics.politicalInstability,
        last_updated: new Date().toISOString(),
      })
      .eq("iso_code", countryISOCode)

    if (error) {
      console.error(`[v0] Failed to update political risk for ${countryISOCode}:`, error)
      return { success: false, error: error.message }
    }

    console.log(
      `[v0] Updated political risk for ${countryName}: ${metrics.politicalInstability} (tone: ${metrics.avgTone}, events: ${metrics.eventCount})`,
    )
    return { success: true }
  } catch (error) {
    console.error(`[v0] Error updating political risk for ${countryISOCode}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function formatGDELTDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

function getDefaultMetrics(): GDELTToneMetrics {
  return {
    avgTone: 0,
    eventCount: 0,
    negativeEvents: 0,
    positiveEvents: 0,
    politicalInstability: 0,
  }
}
