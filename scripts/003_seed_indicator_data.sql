-- Seeding sample indicator data for risk calculations

-- Insert sample indicators for United States
INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'inflation_rate', 3.2, 'World Bank WDI'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'gdp_growth', 2.5, 'World Bank WDI'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'protest_events', 45.0, 'ACLED'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'repression_index', 0.15, 'V-Dem'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'coup_history', 0.0, 'Center for Systemic Peace'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'military_spending_pct_gdp', 3.5, 'SIPRI'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'sanctions_count', 0.0, 'GSDB'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'alliance_strength', 0.92, 'COW Formal Alliances'
FROM public.countries WHERE iso_code = 'US';

-- Insert sample indicators for Russia
INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'inflation_rate', 7.8, 'World Bank WDI'
FROM public.countries WHERE iso_code = 'RU';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'gdp_growth', -2.1, 'World Bank WDI'
FROM public.countries WHERE iso_code = 'RU';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'protest_events', 120.0, 'ACLED'
FROM public.countries WHERE iso_code = 'RU';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'repression_index', 0.78, 'V-Dem'
FROM public.countries WHERE iso_code = 'RU';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'coup_history', 0.35, 'Center for Systemic Peace'
FROM public.countries WHERE iso_code = 'RU';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'military_spending_pct_gdp', 4.1, 'SIPRI'
FROM public.countries WHERE iso_code = 'RU';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'sanctions_count', 8500.0, 'GSDB'
FROM public.countries WHERE iso_code = 'RU';

INSERT INTO public.country_indicators (country_id, date, indicator_name, value, source) 
SELECT id, '2024-01-01', 'alliance_strength', 0.42, 'COW Formal Alliances'
FROM public.countries WHERE iso_code = 'RU';

-- Insert rhetoric scores
INSERT INTO public.rhetoric_scores (country_id, date, nationalism, threat_framing, external_enemy)
SELECT id, '2024-01-01', 0.25, 0.18, 0.22
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.rhetoric_scores (country_id, date, nationalism, threat_framing, external_enemy)
SELECT id, '2024-01-01', 0.82, 0.75, 0.88
FROM public.countries WHERE iso_code = 'RU';

-- Insert calculated risk scores
INSERT INTO public.risk_scores (country_id, date, stability_score, coup_risk, conflict_risk, trend)
SELECT id, '2024-01-01', 82, 0.08, 0.15, 'stable'
FROM public.countries WHERE iso_code = 'US';

INSERT INTO public.risk_scores (country_id, date, stability_score, coup_risk, conflict_risk, trend)
SELECT id, '2024-01-01', 32, 0.42, 0.68, 'down'
FROM public.countries WHERE iso_code = 'RU';
