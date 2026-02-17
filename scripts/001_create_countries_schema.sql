-- Create countries table with risk metrics
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  iso_code TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  capital TEXT,
  population BIGINT,
  gdp_usd BIGINT,
  -- Risk scores (0-100, higher = more risk)
  political_risk_score INTEGER NOT NULL CHECK (political_risk_score >= 0 AND political_risk_score <= 100),
  economic_risk_score INTEGER NOT NULL CHECK (economic_risk_score >= 0 AND economic_risk_score <= 100),
  security_risk_score INTEGER NOT NULL CHECK (security_risk_score >= 0 AND security_risk_score <= 100),
  overall_risk_score INTEGER NOT NULL CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  -- Risk classifications
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
  -- Additional data
  key_risks TEXT[],
  recent_events TEXT[],
  risk_trend TEXT CHECK (risk_trend IN ('Improving', 'Stable', 'Deteriorating')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Allow public read access (since this is a public dashboard)
CREATE POLICY "Allow public read access to countries"
  ON public.countries
  FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_countries_region ON public.countries(region);
CREATE INDEX idx_countries_risk_level ON public.countries(risk_level);
CREATE INDEX idx_countries_overall_risk_score ON public.countries(overall_risk_score);

-- Insert sample data
INSERT INTO public.countries (
  name, iso_code, region, capital, population, gdp_usd,
  political_risk_score, economic_risk_score, security_risk_score, overall_risk_score,
  risk_level, key_risks, recent_events, risk_trend
) VALUES
  ('United States', 'US', 'North America', 'Washington, D.C.', 331900000, 25462700000000,
   15, 20, 18, 18, 'Low',
   ARRAY['Political polarization', 'Fiscal sustainability', 'Infrastructure gaps'],
   ARRAY['Federal budget negotiations ongoing', 'Tech sector layoffs increase'],
   'Stable'),
  
  ('China', 'CN', 'East Asia', 'Beijing', 1412000000, 17963200000000,
   35, 42, 28, 35, 'Moderate',
   ARRAY['Property sector stress', 'Geopolitical tensions', 'Youth unemployment'],
   ARRAY['Trade policy adjustments', 'Zero-COVID policy ended'],
   'Stable'),
  
  ('United Kingdom', 'GB', 'Europe', 'London', 67330000, 3070600000000,
   22, 28, 15, 22, 'Low',
   ARRAY['Post-Brexit adjustments', 'Cost of living crisis', 'Labor shortages'],
   ARRAY['Interest rate changes', 'Trade deal negotiations'],
   'Improving'),
  
  ('Ukraine', 'UA', 'Europe', 'Kyiv', 43790000, 160500000000,
   85, 78, 92, 85, 'Critical',
   ARRAY['Active military conflict', 'Infrastructure damage', 'Refugee crisis'],
   ARRAY['Ongoing military operations', 'International aid packages'],
   'Stable'),
  
  ('Brazil', 'BR', 'South America', 'Brasília', 214300000, 1920100000000,
   38, 45, 52, 45, 'Moderate',
   ARRAY['Political instability', 'Crime rates', 'Deforestation concerns'],
   ARRAY['Amazon protection policies', 'Economic reforms proposed'],
   'Improving'),
  
  ('India', 'IN', 'South Asia', 'New Delhi', 1408000000, 3385090000000,
   32, 35, 48, 38, 'Moderate',
   ARRAY['Border tensions', 'Infrastructure needs', 'Regional conflicts'],
   ARRAY['Digital economy growth', 'Manufacturing expansion'],
   'Stable'),
  
  ('Russia', 'RU', 'Europe/Asia', 'Moscow', 144100000, 2240400000000,
   72, 68, 65, 68, 'High',
   ARRAY['International sanctions', 'Military operations', 'Economic isolation'],
   ARRAY['Energy export restrictions', 'Currency volatility'],
   'Deteriorating'),
  
  ('Saudi Arabia', 'SA', 'Middle East', 'Riyadh', 35950000, 1108600000000,
   42, 38, 45, 42, 'Moderate',
   ARRAY['Regional tensions', 'Oil price dependency', 'Reform implementation'],
   ARRAY['Vision 2030 progress', 'OPEC production decisions'],
   'Improving'),
  
  ('South Africa', 'ZA', 'Africa', 'Pretoria', 59390000, 405870000000,
   48, 52, 58, 53, 'High',
   ARRAY['Power shortages', 'High unemployment', 'Political corruption'],
   ARRAY['Energy crisis continues', 'Election preparations'],
   'Stable'),
  
  ('Germany', 'DE', 'Europe', 'Berlin', 83240000, 4072200000000,
   18, 25, 12, 18, 'Low',
   ARRAY['Energy transition challenges', 'Economic slowdown', 'Immigration debate'],
   ARRAY['Industrial output declines', 'Green energy investments'],
   'Stable'),
  
  ('Japan', 'JP', 'East Asia', 'Tokyo', 125800000, 4231100000000,
   12, 32, 15, 20, 'Low',
   ARRAY['Aging population', 'Public debt levels', 'Natural disaster risk'],
   ARRAY['Bank of Japan policy changes', 'Defense budget increases'],
   'Stable'),
  
  ('Mexico', 'MX', 'North America', 'Mexico City', 128900000, 1414300000000,
   42, 38, 65, 48, 'Moderate',
   ARRAY['Organized crime', 'Cartel violence', 'Corruption'],
   ARRAY['Nearshoring investments', 'Security operations'],
   'Stable'),
  
  ('Nigeria', 'NG', 'Africa', 'Abuja', 216780000, 440800000000,
   58, 62, 72, 64, 'High',
   ARRAY['Insurgency threats', 'Economic instability', 'Fuel subsidy removal'],
   ARRAY['Currency devaluation', 'Oil production disruptions'],
   'Deteriorating'),
  
  ('Turkey', 'TR', 'Europe/Asia', 'Ankara', 85340000, 905500000000,
   52, 58, 48, 53, 'High',
   ARRAY['Inflation crisis', 'Currency instability', 'Regional conflicts'],
   ARRAY['Earthquake recovery', 'Central bank interventions'],
   'Stable'),
  
  ('Singapore', 'SG', 'Southeast Asia', 'Singapore', 5690000, 466790000000,
   8, 12, 5, 8, 'Low',
   ARRAY['Regional geopolitical tensions', 'Supply chain dependencies'],
   ARRAY['Tech sector growth', 'Financial hub expansion'],
   'Stable');
