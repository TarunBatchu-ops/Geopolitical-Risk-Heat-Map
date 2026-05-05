-- Create countries table with risk metrics
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL UNIQUE,
  iso_code TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  capital TEXT,
  population BIGINT,
  gdp_usd BIGINT,

  -- Risk scores (0–100 scale)
  political_risk_score INTEGER NOT NULL CHECK (political_risk_score BETWEEN 0 AND 100),
  economic_risk_score INTEGER NOT NULL CHECK (economic_risk_score BETWEEN 0 AND 100),
  security_risk_score INTEGER NOT NULL CHECK (security_risk_score BETWEEN 0 AND 100),
  overall_risk_score INTEGER NOT NULL CHECK (overall_risk_score BETWEEN 0 AND 100),

  -- Risk classification
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
  risk_trend TEXT CHECK (risk_trend IN ('Improving', 'Stable', 'Deteriorating')),

  -- Additional metadata
  key_risks TEXT[],
  recent_events TEXT[],

  -- Timestamps
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Public read-only access policy
CREATE POLICY countries_public_read
  ON public.countries
  FOR SELECT
  USING (true);

-- Indexes for performance
CREATE INDEX idx_countries_region ON public.countries(region);
CREATE INDEX idx_countries_risk_level ON public.countries(risk_level);
CREATE INDEX idx_countries_overall_risk_score ON public.countries(overall_risk_score);
