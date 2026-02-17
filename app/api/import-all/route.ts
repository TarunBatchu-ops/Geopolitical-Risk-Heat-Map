import { importAllIndicatorsForCountry } from "@/lib/world-bank-api"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const maxDuration = 60 // Maximum allowed execution time

export async function POST() {
  try {
    const supabase = await createClient()

    // Get all countries
    const { data: countries, error } = await supabase.from("countries").select("id, iso_code, name").order("name")

    if (error || !countries) {
      return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
    }

    const results = []

    for (const country of countries) {
      console.log(`[v0] Importing data for ${country.name}...`)

      const result = await importAllIndicatorsForCountry(country.id, country.iso_code)

      results.push({
        country: country.name,
        success: result.success,
        records: result.totalRecords,
        errors: result.errors,
      })

      // Wait 1 second between countries to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const totalRecords = results.reduce((sum, r) => sum + r.records, 0)
    const successCount = results.filter((r) => r.success).length

    return NextResponse.json({
      success: true,
      totalCountries: countries.length,
      successfulImports: successCount,
      totalRecords,
      results,
    })
  } catch (error) {
    console.error("[v0] Import all API error:", error)
    return NextResponse.json({ error: "Failed to import data" }, { status: 500 })
  }
}
