# Data Sources & Daily Updates

## Overview

The geopolitical risk dashboard automatically updates daily using real-world data from multiple authoritative sources.

## Data Sources

### 1. ACLED (Armed Conflict Location & Event Data Project)
- **Purpose**: Security risk assessment
- **Data**: Conflict events, fatalities, protests, violence
- **Update Frequency**: Daily
- **API**: https://api.acleddata.com
- **Setup**: Register at https://developer.acleddata.com/ for API credentials
- **Environment Variables**:
  - `ACLED_API_KEY`: Your ACLED API key
  - `ACLED_API_EMAIL`: Your registered email

### 2. GDELT (Global Database of Events, Language, and Tone)
- **Purpose**: Political risk assessment via news monitoring
- **Data**: News tone, political events, sentiment analysis
- **Update Frequency**: Real-time (we poll daily)
- **API**: https://api.gdeltproject.org
- **Setup**: No API key required (public API)

### 3. World Bank Open Data
- **Purpose**: Economic indicators
- **Data**: GDP, inflation, unemployment, debt, FDI, GINI index
- **Update Frequency**: Quarterly/Annual (updated automatically)
- **API**: https://api.worldbank.org
- **Setup**: No API key required (public API)

### 4. UN Data (Future Integration)
- **Purpose**: Additional economic and social indicators
- **Data**: Population, development metrics, climate data
- **API**: https://data.un.org/ws/rest
- **Status**: Placeholder implemented, full integration pending

## Automated Updates

### Daily Cron Job

The system runs a daily cron job at 2:00 AM UTC that:

1. Fetches recent conflict data from ACLED (past 30 days)
2. Analyzes news tone from GDELT (past 7 days)
3. Updates World Bank economic indicators
4. Recalculates risk scores based on latest data
5. Updates the database with new risk assessments

### Configuration

The cron job is configured in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/daily-update",
    "schedule": "0 2 * * *"
  }]
}
```

### Manual Trigger

You can manually trigger data updates via the admin panel at `/admin` or by calling:

```bash
curl -X GET https://your-domain.com/api/cron/daily-update \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Environment Variables

Add these to your Vercel project:

```bash
# ACLED API (required for security risk updates)
ACLED_API_KEY=your_acled_api_key
ACLED_API_EMAIL=your_email@example.com

# Cron job security
CRON_SECRET=your_random_secret_string
```

## Risk Calculation

### Security Risk Score
Based on ACLED conflict data:
- Violent events (battles, violence) weighted 3x
- Fatalities weighted 2x
- Protests and riots weighted 1x
- Score normalized to 0-100 scale

### Political Risk Score
Based on GDELT news tone analysis:
- Negative news tone indicates instability
- Event frequency factors into calculation
- Keywords: protest, violence, election, crisis
- Score based on sentiment deviation

### Economic Risk Score
Based on World Bank indicators:
- Unemployment rate
- Inflation rate
- GDP growth (negative = higher risk)
- Government debt levels
- Composite weighted score

### Overall Risk Score
Average of political, economic, and security scores with risk level classification:
- **Low**: 0-29
- **Moderate**: 30-49
- **High**: 50-69
- **Critical**: 70-100

## Rate Limiting

To respect API rate limits:
- 500ms delay between country updates
- 200ms delay between World Bank indicator requests
- Maximum 50 countries per cron run (configurable)

## Monitoring

Check cron job execution in Vercel dashboard under:
- Project → Settings → Cron Jobs
- View logs for each execution
- Monitor success/failure rates

## Data Quality

- All sources are authoritative and widely used in political risk analysis
- Data is validated before database updates
- Failed updates are logged but don't block other countries
- Missing data gracefully handled with fallback values
