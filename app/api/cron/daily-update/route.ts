import { updateSecurityRiskFromACLED } from "@/lib/data-scrapers/acled-scraper"
import { updatePoliticalRiskFromGDELT } from "@/lib/data-scrapers/gdelt-scraper"
import { updateEconomicRiskFromUN } from "@/lib/data-scrapers/un-data-scraper"
import { importAllIndicatorsForCountry } from "@/lib/world-bank-api"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const maxDuration = 60

/**
 * Daily cron job to update all country risk data
 * This endpoint should be called by Vercel Cron Jobs daily
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/daily-update",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get all countries
    const { data: countries, error } = await supabase.from("countries").select("id, iso_code, name").limit(50) // Process first 50 countries to avoid timeout

    if (error || !countries) {
      return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
    }

    const results = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each country
    for (const country of countries) {
      results.processed++

      try {
        // Update security risk from ACLED (conflict data)
        await updateSecurityRiskFromACLED(country.iso_code)

        // Update political risk from GDELT (news tone analysis)
        await updatePoliticalRiskFromGDELT(country.iso_code, country.name)

        // Update economic risk from UN data
        await updateEconomicRiskFromUN(country.iso_code)

        // Update World Bank economic indicators
        await importAllIndicatorsForCountry(country.id, country.iso_code)

        // Calculate overall risk score
        const { data: updated } = await supabase
          .from("countries")
          .select("political_risk_score, economic_risk_score, security_risk_score")
          .eq("iso_code", country.iso_code)
          .single()

        if (updated) {
          const overallRisk = Math.round(
            (updated.political_risk_score + updated.economic_risk_score + updated.security_risk_score) / 3,
          )

          let riskLevel = "Low"
          if (overallRisk >= 70) riskLevel = "Critical"
          else if (overallRisk >= 50) riskLevel = "High"
          else if (overallRisk >= 30) riskLevel = "Moderate"

          await supabase
            .from("countries")
            .update({
              overall_risk_score: overallRisk,
              risk_level: riskLevel,
              last_updated: new Date().toISOString(),
            })
            .eq("iso_code", country.iso_code)
        }

        results.successful++

        // Rate limiting between countries
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        results.failed++
        results.errors.push(`${country.name}: ${error}`)
        console.error(`[v0] Error processing ${country.name}:`, error)
      }
    }

    console.log(`[v0] Daily update completed: ${results.successful}/${results.processed} countries updated`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    console.error("[v0] Daily update cron error:", error)
    return NextResponse.json({ error: "Daily update failed", details: error }, { status: 500 })
  }
}
