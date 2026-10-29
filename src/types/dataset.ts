export interface DatasetItem {
  id: string;
  date_created: string;
  title_en: string;
  category_en: string;
  subcategory_en: string;
  title_bm: string;
  category_bm: string;
  subcategory_bm: string;
  source: string;
  frequency: string;
  geography: string;
  demography: string;
  dataset_begin: string;
  dataset_end: string;
  api_endpoint?: string;
}

export interface DatasetListResponse {
  total: number;
  total_catalog: number;
  offset: number;
  limit: number;
  categories: string[];
  sources: string[];
  frequencies: string[];
  datasets: DatasetItem[];
}

export interface FuelPriceRecord {
  date: string;
  ron95: number;
  ron97: number;
  diesel: number;
  diesel_eastmsia?: number;
}

export interface CpiRecord {
  date: string;
  headline_cpi: number;
  food_beverage: number;
  housing_utilities: number;
  transport: number;
  health: number;
  inflation_rate_yoy: number;
}

export interface GdpRecord {
  quarter: string;
  year: number;
  label: string;
  total_gdp_rm_billion: number;
  growth_rate_yoy: number;
  services: number;
  manufacturing: number;
  agriculture: number;
  construction: number;
  mining: number;
}

export interface LabourRecord {
  date: string;
  labour_force_thousand: number;
  employed_thousand: number;
  unemployed_thousand: number;
  unemployment_rate: number;
  ep_ratio: number;
}

export interface StateHouseholdRecord {
  state: string;
  mean_income: number;
  median_income: number;
  gini_coefficient: number;
  poverty_incidence: number;
  population_thousand: number;
  code?: string;
  region?: 'Peninsular' | 'Sabah' | 'Sarawak' | 'Federal Territory';
}

export interface WeatherWarningRecord {
  warning_issue?: {
    issued: string;
    title_bm: string;
    title_en: string;
  };
  valid_from: string;
  valid_to: string;
  heading_en: string;
  text_en: string;
  locations?: string[];
}

export interface WeatherForecastRecord {
  location: {
    location_id: string;
    location_name: string;
  };
  date: string;
  morning_forecast: string;
  afternoon_forecast: string;
  night_forecast: string;
  summary_forecast?: string;
  min_temp: number;
  max_temp: number;
}

export interface RealtimeStreamEvent {
  type: 'WEATHER_ALERT' | 'TRANSIT_UPDATE' | 'COMMODITY_PRICE' | 'SOCIOECONOMIC_METRIC' | 'INIT';
  source?: string;
  timestamp: string;
  [key: string]: any;
}

export interface CompareSeriesOption {
  id: string;
  name: string;
  category: string;
  unit: string;
  color: string;
  data: { date: string; value: number }[];
}

export interface DailyDigestHighlight {
  id: string;
  category: string;
  badge: string;
  title: string;
  value: string;
  trend: 'positive' | 'warning' | 'neutral';
  impact_summary: string;
  source: string;
}

export interface DailyDigestResponse {
  digest_date: string;
  issued_at: string;
  source_attribution: string;
  lead_summary: string;
  highlights: DailyDigestHighlight[];
}

export interface ProjectedPoint {
  date: string;
  projected_value: number;
  lower_bound: number;
  upper_bound: number;
}

export interface AiProjectionResponse {
  model_used: string;
  indicator: string;
  scenario: string;
  unit: string;
  projection_summary: string;
  key_growth_drivers: string[];
  risk_factors: string[];
  policy_implications: string;
  projected_points: ProjectedPoint[];
}

export interface EndpointHealthStatus {
  id: string;
  name: string;
  agency: string;
  target_url: string;
  status: 'operational' | 'degraded' | 'down';
  http_code: number;
  latency_ms: number;
  uptime_pct: number;
  last_checked: string;
  payload_size_kb: number;
  protocol: string;
  latency_history: number[];
}

export interface ApiHealthResponse {
  timestamp: string;
  overall_status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  avg_latency_ms: number;
  active_endpoints_count: number;
  total_endpoints_count: number;
  endpoints: EndpointHealthStatus[];
}
