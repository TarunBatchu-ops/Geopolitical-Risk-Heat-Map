import { importAllIndicatorsForCountry } from "@/lib/world-bank-api"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { countryCode } = await request.json()

    if (!countryCode) {
      return NextResponse.json({ error: "Country code is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get country from database
    const { data: country, error } = await supabase
      .from("countries")
      .select("id, iso_code, name")
      .eq("iso_code", countryCode.toUpperCase())
      .single()

    if (error || !country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }

    // Import all indicators
    const result = await importAllIndicatorsForCountry(country.id, country.iso_code)

    return NextResponse.json({
      success: result.success,
      country: country.name,
      recordsImported: result.totalRecords,
      errors: result.errors,
    })
  } catch (error) {
    console.error("[v0] Import API error:", error)
    return NextResponse.json({ error: "Failed to import data" }, { status: 500 })
  }
}
