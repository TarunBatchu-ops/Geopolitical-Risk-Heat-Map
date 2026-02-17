import { createClient } from "@/lib/supabase/server"

// ACLED API Configuration - OAuth endpoint
const ACLED_TOKEN_URL = "https://acleddata.com/oauth/token"
const ACLED_API_URL = "https://acleddata.com/api/acled/read"

// Token cache to avoid unnecessary OAuth requests
let cachedToken: { token: string; expiresAt: number } | null = null

interface ACLEDEvent {
  event_id_cnty: string
  event_date: string
  year: number
  time_precision: number
  event_type: string
  sub_event_type: string
  actor1: string
  assoc_actor_1: string
  inter1: number
  actor2: string
  assoc_actor_2: string
  inter2: number
  interaction: number
  region: string
  country: string
  admin1: string
  admin2: string
  admin3: string
  location: string
  latitude: number
  longitude: number
  geo_precision: number
  source: string
  source_scale: string
  notes: string
  fatalities: number
  tags: string
  timestamp: number
  iso: number
}

/**
 * Get OAuth access token from ACLED
 * Caches token to avoid unnecessary requests
 */
async function getACLEDToken(): Promise<string | null> {
  const email = process.env.ACLED_API_EMAIL
  const password = process.env.ACLED_API_PASSWORD

  if (!email || !password) {
    console.warn("[v0] ACLED OAuth credentials not configured (ACLED_API_EMAIL, ACLED_API_PASSWORD)")
    return null
  }

  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 300000) {
    return cachedToken.token
  }

  try {
    const formData = new URLSearchParams()
    formData.append("username", email)
    formData.append("password", password)
    formData.append("grant_type", "password")
    formData.append("client_id", "acled")

    const response = await fetch(ACLED_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] ACLED OAuth token request failed:", response.status, errorText)
      return null
    }

    const data = await response.json()
    const accessToken = data.access_token
    const expiresIn = data.expires_in || 3600 // Default 1 hour

    // Cache the token
    cachedToken = {
      token: accessToken,
      expiresAt: Date.now() + expiresIn * 1000,
    }

    console.log("[v0] ACLED OAuth token obtained successfully")
    return accessToken
  } catch (error) {
    console.error("[v0] ACLED OAuth token error:", error)
    return null
  }
}

/**
 * Fetch conflict events from ACLED for a specific country
 * Uses OAuth authentication with Bearer token
 */
export async function fetchACLEDData(countryISOCode: string, days = 30): Promise<ACLEDEvent[]> {
  const token = await getACLEDToken()

  if (!token) {
    console.warn("[v0] ACLED API: No valid token available. Skipping ACLED data fetch.")
    return []
  }

  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const url = new URL(ACLED_API_URL)
    url.searchParams.set("iso", countryISOCode)
    url.searchParams.set("event_date", `${formatDate(startDate)}|${formatDate(endDate)}`)
    url.searchParams.set("event_date_where", "BETWEEN")
    url.searchParams.set("limit", "500")

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // If unauthorized, clear cached token for retry
      if (response.status === 401) {
        cachedToken = null
      }
      throw new Error(`ACLED API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error(`[v0] ACLED fetch error for ${countryISOCode}:`, error)
    return []
  }
}

/**
 * Calculate security risk metrics from ACLED data
 */
export function calculateSecurityMetrics(events: ACLEDEvent[]): {
  totalEvents: number
  totalFatalities: number
  violentEvents: number
  protestEvents: number
  riskScore: number
} {
  const violentTypes = ["Battles", "Explosions/Remote violence", "Violence against civilians"]
  const protestTypes = ["Protests", "Riots"]

  const totalEvents = events.length
  const totalFatalities = events.reduce((sum, e) => sum + e.fatalities, 0)
  const violentEvents = events.filter((e) => violentTypes.includes(e.event_type)).length
  const protestEvents = events.filter((e) => protestTypes.includes(e.event_type)).length

  // Risk calculation: weighted by event severity
  // Violent events are weighted 3x, fatalities add directly, protests weighted 1x
  let riskScore = Math.min(100, (violentEvents * 3 + totalFatalities * 2 + protestEvents) / 2)
  riskScore = Math.round(riskScore)

  return {
    totalEvents,
    totalFatalities,
    violentEvents,
    protestEvents,
    riskScore,
  }
}

/**
 * Update country security risk based on recent ACLED data
 */
export async function updateSecurityRiskFromACLED(
  countryISOCode: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Fetch recent conflict events
    const events = await fetchACLEDData(countryISOCode, 30)

    if (events.length === 0) {
      console.log(`[v0] No ACLED data for ${countryISOCode}`)
      return { success: true }
    }

    // Calculate security metrics
    const metrics = calculateSecurityMetrics(events)

    // Update country security risk score
    const { error } = await supabase
      .from("countries")
      .update({
        security_risk_score: metrics.riskScore,
        last_updated: new Date().toISOString(),
      })
      .eq("iso_code", countryISOCode)

    if (error) {
      console.error(`[v0] Failed to update security risk for ${countryISOCode}:`, error)
      return { success: false, error: error.message }
    }

    console.log(
      `[v0] Updated security risk for ${countryISOCode}: ${metrics.riskScore} (${metrics.totalEvents} events, ${metrics.totalFatalities} fatalities)`,
    )
    return { success: true }
  } catch (error) {
    console.error(`[v0] Error updating security risk for ${countryISOCode}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}
