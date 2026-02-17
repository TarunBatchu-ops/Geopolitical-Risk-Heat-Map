import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data: countries, error } = await supabase
    .from("countries")
    .select("*")
    .order("overall_risk_score", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching countries:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(countries)
}
