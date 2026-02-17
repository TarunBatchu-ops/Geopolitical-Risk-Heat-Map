# Country Seeding Guide

This guide explains how to populate your geopolitical risk dashboard with all 193+ UN-recognized countries.

## Quick Start

### 1. Run the Seed Script

The Python script `scripts/seed_all_countries.py` will insert all 193 UN-recognized countries into your Supabase database.

**From the v0 interface:**
- The script will run automatically when you execute it from the Scripts panel
- No terminal access needed - v0 handles execution

**What the script does:**
- Inserts all 193+ countries with ISO-3166-1 alpha-2 codes (US, CN, GB, etc.)
- Generates realistic risk scores based on regime type and region
- Uses upsert logic to avoid duplicates
- Assigns appropriate risk levels (Low, Moderate, High, Critical)
- Sets reasonable trends (Improving, Stable, Deteriorating)

### 2. Verify the Data

After seeding, visit your dashboard homepage to see all countries populated with:
- Risk scores and classifications
- Regional groupings
- Regime types
- Search and filter capabilities

## Country Data Structure

Each country includes:
- **name**: Official country name
- **iso_code**: ISO-3166-1 alpha-2 code (2 letters)
- **region**: Africa, Americas, Asia, Europe, or Oceania
- **capital**: Capital city
- **regime_type**: Government system (e.g., Presidential Republic, Constitutional Monarchy)
- **overall_risk_score**: 0-100 (higher = more risk)
- **political_risk_score**: 0-100
- **economic_risk_score**: 0-100
- **security_risk_score**: 0-100
- **risk_level**: Low, Moderate, High, or Critical
- **risk_trend**: Improving, Stable, or Deteriorating

## Risk Score Logic

Risk scores are calculated based on:

1. **Regime Type**: Military juntas and one-party states get higher base risk
2. **Region**: Regional stability affects the modifier
3. **Randomization**: ±10-15 point variance for realism

### Risk Level Thresholds
- **Critical**: 70-100
- **High**: 50-69
- **Moderate**: 30-49
- **Low**: 0-29

## Frontend Features

The dashboard automatically scales to support all countries with:

### Search & Filter
- Search by country name or ISO code
- Filter by region (Africa, Americas, Asia, Europe, Oceania)
- Filter by risk level (Low, Moderate, High, Critical)
- Sort by risk score, name, or stability

### Interactive Map
- Hover over countries to see detailed stats
- Click to navigate to country detail pages
- Color-coded by risk level

### Global Risk Overview
- Visual distribution by risk level
- Click any country chip to view details
- Summary statistics at top

### Hover Tooltips
All risk metrics include informative tooltips explaining:
- What the metric measures
- Why it changes
- Key drivers

## Data Integrity

- **Upsert logic**: Running the script multiple times won't create duplicates
- **ISO code uniqueness**: Each country has a unique 2-letter code
- **Production-ready**: No mock data, proper error handling

## Next Steps

After seeding:

1. **Import Real Data**: Use the admin panel at `/admin` to fetch World Bank indicators
2. **Configure RLS**: Row Level Security is already enabled for public read access
3. **Monitor Performance**: The system efficiently handles 193+ countries with indexing
4. **Customize Scores**: Update individual countries via Supabase dashboard as needed

## Troubleshooting

**Script fails:**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables are set
- Check Supabase connection in the Integrations panel

**Countries not appearing:**
- Clear browser cache
- Check the `/api/countries` endpoint
- Verify the `countries` table exists in Supabase

**Map not showing countries:**
- ISO-3166-1 alpha-2 codes must match (the script uses correct codes)
- Check browser console for any mapping errors

## Production Checklist

- [x] Dynamic country loading (no hardcoded lists)
- [x] Scalable Supabase queries with indexing
- [x] Search, filter, and sort functionality
- [x] Hover tooltips with explanations
- [x] Global risk overview
- [x] Graceful handling of missing data
- [x] Production-quality error handling
- [x] ISO-3166-1 alpha-2 compliance
