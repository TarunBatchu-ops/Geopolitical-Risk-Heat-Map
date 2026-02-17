-- Creating comprehensive schema for academic risk modeling

-- Drop existing tables if rebuilding
DROP TABLE IF EXISTS public.risk_scores CASCADE;
DROP TABLE IF EXISTS public.rhetoric_scores CASCADE;
DROP TABLE IF EXISTS public.country_indicators CASCADE;

-- country_indicators: Store time-series data from real datasets
CREATE TABLE IF NOT EXISTS public.country_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  indicator_name TEXT NOT NULL,
  value FLOAT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_id, date, indicator_name)
);

-- rhetoric_scores: Store elite signaling and threat rhetoric
CREATE TABLE IF NOT EXISTS public.rhetoric_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  nationalism FLOAT NOT NULL CHECK (nationalism >= 0 AND nationalism <= 1),
  threat_framing FLOAT NOT NULL CHECK (threat_framing >= 0 AND threat_framing <= 1),
  external_enemy FLOAT NOT NULL CHECK (external_enemy >= 0 AND external_enemy <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_id, date)
);

-- risk_scores: Store calculated risk metrics over time
CREATE TABLE IF NOT EXISTS public.risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  stability_score INTEGER NOT NULL CHECK (stability_score >= 0 AND stability_score <= 100),
  coup_risk FLOAT NOT NULL CHECK (coup_risk >= 0 AND coup_risk <= 1),
  conflict_risk FLOAT NOT NULL CHECK (conflict_risk >= 0 AND conflict_risk <= 1),
  trend TEXT NOT NULL CHECK (trend IN ('up', 'down', 'stable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_id, date)
);

-- Enable RLS
ALTER TABLE public.country_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rhetoric_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access to country_indicators"
  ON public.country_indicators FOR SELECT USING (true);

CREATE POLICY "Allow public read access to rhetoric_scores"
  ON public.rhetoric_scores FOR SELECT USING (true);

CREATE POLICY "Allow public read access to risk_scores"
  ON public.risk_scores FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_country_indicators_country_date ON public.country_indicators(country_id, date DESC);
CREATE INDEX idx_rhetoric_scores_country_date ON public.rhetoric_scores(country_id, date DESC);
CREATE INDEX idx_risk_scores_country_date ON public.risk_scores(country_id, date DESC);
