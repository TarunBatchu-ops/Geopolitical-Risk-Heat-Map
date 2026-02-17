"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [countryCode, setCountryCode] = useState("US")

  const importSingleCountry = async () => {
    setImporting(true)
    setResult(null)

    try {
      const response = await fetch("/api/import-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to import data" })
    } finally {
      setImporting(false)
    }
  }

  const importAllCountries = async () => {
    if (!confirm("This will import data for ALL countries and may take several minutes. Continue?")) {
      return
    }

    setImporting(true)
    setResult(null)

    try {
      const response = await fetch("/api/import-all", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to import data" })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Data Pipeline Admin</h1>
          <p className="mt-2 text-muted-foreground">Import World Bank indicators for geopolitical risk modeling</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Import Single Country</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              placeholder="Country code (e.g., US, CN, RU)"
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={importing}
            />
            <Button onClick={importSingleCountry} disabled={importing}>
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import Country"
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Import All Countries</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This will fetch World Bank data for all countries in the database. This process may take 5-10 minutes.
          </p>
          <Button onClick={importAllCountries} disabled={importing} variant="outline">
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing All Countries...
              </>
            ) : (
              "Import All Countries"
            )}
          </Button>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Import Results</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
          </Card>
        )}

        <Card className="p-6 bg-muted/50">
          <h3 className="font-medium mb-2">Indicators Imported</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Unemployment Rate</li>
            <li>• GDP per Capita & Growth Rate</li>
            <li>• Inflation Rate</li>
            <li>• Military Expenditure (% of GDP)</li>
            <li>• Government Debt (% of GDP)</li>
            <li>• Foreign Direct Investment</li>
            <li>• GINI Index (Inequality)</li>
            <li>• Population & Growth Rate</li>
            <li>• Trade Balance (Exports & Imports)</li>
            <li>• Education & Health Metrics</li>
          </ul>
        </Card>

        <Card className="p-6 border-amber-200 bg-amber-50/50">
          <h3 className="font-medium mb-2 text-amber-900">Required Environment Variables</h3>
          <p className="text-sm text-amber-800 mb-4">
            Configure these in your Vercel project settings to enable all data sources:
          </p>
          <ul className="text-sm space-y-2 text-amber-800">
            <li className="flex items-start gap-2">
              <code className="bg-amber-100 px-2 py-0.5 rounded text-xs">ACLED_API_EMAIL</code>
              <span>- Your ACLED account email</span>
            </li>
            <li className="flex items-start gap-2">
              <code className="bg-amber-100 px-2 py-0.5 rounded text-xs">ACLED_API_PASSWORD</code>
              <span>- Your ACLED account password</span>
            </li>
            <li className="flex items-start gap-2">
              <code className="bg-amber-100 px-2 py-0.5 rounded text-xs">CRON_SECRET</code>
              <span>- Secret key to secure the daily cron job endpoint</span>
            </li>
          </ul>
          <p className="text-xs text-amber-700 mt-4">
            Register for ACLED API access at{" "}
            <a
              href="https://developer.acleddata.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900"
            >
              developer.acleddata.com
            </a>
          </p>
        </Card>
      </div>
    </div>
  )
}
