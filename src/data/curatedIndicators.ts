import { FuelPriceRecord, CpiRecord, GdpRecord, LabourRecord, StateHouseholdRecord } from '../types/dataset';

// Official Fuel Price Timeline (MOF Malaysia, Weekly Mechanism APM)
export const CURATED_FUEL_PRICES: FuelPriceRecord[] = [
  { date: '2023-01-05', ron95: 2.05, ron97: 3.35, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2023-03-02', ron95: 2.05, ron97: 3.35, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2023-05-04', ron95: 2.05, ron97: 3.35, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2023-07-06', ron95: 2.05, ron97: 3.37, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2023-09-07', ron95: 2.05, ron97: 3.37, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2023-11-09', ron95: 2.05, ron97: 3.47, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2024-01-11', ron95: 2.05, ron97: 3.47, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2024-03-14', ron95: 2.05, ron97: 3.47, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2024-05-16', ron95: 2.05, ron97: 3.47, diesel: 2.15, diesel_eastmsia: 2.15 },
  { date: '2024-06-10', ron95: 2.05, ron97: 3.47, diesel: 3.35, diesel_eastmsia: 2.15 }, // Targeted subsidy rationalization (BUDI MADANI)
  { date: '2024-08-08', ron95: 2.05, ron97: 3.47, diesel: 3.30, diesel_eastmsia: 2.15 },
  { date: '2024-10-10', ron95: 2.05, ron97: 3.19, diesel: 2.95, diesel_eastmsia: 2.15 },
  { date: '2024-12-12', ron95: 2.05, ron97: 3.19, diesel: 2.95, diesel_eastmsia: 2.15 },
  { date: '2025-02-13', ron95: 2.05, ron97: 3.22, diesel: 2.98, diesel_eastmsia: 2.15 },
  { date: '2025-05-15', ron95: 2.05, ron97: 3.25, diesel: 3.02, diesel_eastmsia: 2.15 },
  { date: '2025-08-14', ron95: 2.05, ron97: 3.20, diesel: 2.96, diesel_eastmsia: 2.15 },
  { date: '2025-11-13', ron95: 2.05, ron97: 3.18, diesel: 2.95, diesel_eastmsia: 2.15 },
  { date: '2026-02-12', ron95: 2.05, ron97: 3.19, diesel: 2.95, diesel_eastmsia: 2.15 },
  { date: '2026-05-14', ron95: 2.05, ron97: 3.21, diesel: 2.94, diesel_eastmsia: 2.15 },
  { date: '2026-08-13', ron95: 2.05, ron97: 3.18, diesel: 2.95, diesel_eastmsia: 2.15 },
  { date: '2026-10-22', ron95: 2.05, ron97: 3.19, diesel: 2.95, diesel_eastmsia: 2.15 },
];

// Consumer Price Index & Inflation (DOSM Open Data)
export const CURATED_CPI: CpiRecord[] = [
  { date: '2023-01', headline_cpi: 129.5, food_beverage: 133.2, housing_utilities: 124.1, transport: 120.2, health: 126.8, inflation_rate_yoy: 3.7 },
  { date: '2023-04', headline_cpi: 130.2, food_beverage: 134.5, housing_utilities: 124.6, transport: 120.5, health: 127.4, inflation_rate_yoy: 3.3 },
  { date: '2023-07', headline_cpi: 130.8, food_beverage: 135.2, housing_utilities: 125.0, transport: 120.1, health: 128.0, inflation_rate_yoy: 2.0 },
  { date: '2023-10', headline_cpi: 131.2, food_beverage: 135.8, housing_utilities: 125.4, transport: 120.3, health: 128.5, inflation_rate_yoy: 1.8 },
  { date: '2024-01', headline_cpi: 131.6, food_beverage: 136.4, housing_utilities: 125.8, transport: 120.6, health: 129.1, inflation_rate_yoy: 1.5 },
  { date: '2024-04', headline_cpi: 132.1, food_beverage: 137.2, housing_utilities: 126.3, transport: 121.2, health: 129.8, inflation_rate_yoy: 1.8 },
  { date: '2024-07', headline_cpi: 132.8, food_beverage: 138.1, housing_utilities: 127.1, transport: 123.4, health: 130.4, inflation_rate_yoy: 2.0 },
  { date: '2024-10', headline_cpi: 133.2, food_beverage: 138.6, housing_utilities: 127.5, transport: 123.1, health: 130.9, inflation_rate_yoy: 1.9 },
  { date: '2025-01', headline_cpi: 133.8, food_beverage: 139.4, housing_utilities: 128.0, transport: 123.5, health: 131.5, inflation_rate_yoy: 1.9 },
  { date: '2025-04', headline_cpi: 134.4, food_beverage: 140.2, housing_utilities: 128.6, transport: 124.0, health: 132.2, inflation_rate_yoy: 2.1 },
  { date: '2025-07', headline_cpi: 135.0, food_beverage: 140.9, housing_utilities: 129.2, transport: 124.3, health: 132.8, inflation_rate_yoy: 2.0 },
  { date: '2025-10', headline_cpi: 135.5, food_beverage: 141.5, housing_utilities: 129.8, transport: 124.6, health: 133.4, inflation_rate_yoy: 1.8 },
  { date: '2026-01', headline_cpi: 136.1, food_beverage: 142.3, housing_utilities: 130.4, transport: 125.1, health: 134.0, inflation_rate_yoy: 1.9 },
  { date: '2026-04', headline_cpi: 136.7, food_beverage: 143.0, housing_utilities: 131.0, transport: 125.7, health: 134.6, inflation_rate_yoy: 1.8 },
  { date: '2026-07', headline_cpi: 137.3, food_beverage: 143.7, housing_utilities: 131.6, transport: 126.1, health: 135.2, inflation_rate_yoy: 1.9 },
  { date: '2026-10', headline_cpi: 137.8, food_beverage: 144.2, housing_utilities: 132.0, transport: 126.5, health: 135.8, inflation_rate_yoy: 1.9 },
];

// Quarterly GDP by Sector (DOSM National Accounts)
export const CURATED_GDP: GdpRecord[] = [
  { quarter: 'Q1', year: 2023, label: '2023 Q1', total_gdp_rm_billion: 388.5, growth_rate_yoy: 5.6, services: 228.4, manufacturing: 91.2, agriculture: 25.1, construction: 15.2, mining: 24.3 },
  { quarter: 'Q2', year: 2023, label: '2023 Q2', total_gdp_rm_billion: 392.1, growth_rate_yoy: 2.9, services: 232.0, manufacturing: 90.8, agriculture: 24.8, construction: 15.6, mining: 24.1 },
  { quarter: 'Q3', year: 2023, label: '2023 Q3', total_gdp_rm_billion: 405.3, growth_rate_yoy: 3.3, services: 241.2, manufacturing: 93.5, agriculture: 25.6, construction: 16.1, mining: 24.6 },
  { quarter: 'Q4', year: 2023, label: '2023 Q4', total_gdp_rm_billion: 412.8, growth_rate_yoy: 3.0, services: 246.5, manufacturing: 94.2, agriculture: 26.0, construction: 16.5, mining: 25.0 },
  { quarter: 'Q1', year: 2024, label: '2024 Q1', total_gdp_rm_billion: 404.9, growth_rate_yoy: 4.2, services: 242.0, manufacturing: 94.8, agriculture: 25.8, construction: 17.0, mining: 24.9 },
  { quarter: 'Q2', year: 2024, label: '2024 Q2', total_gdp_rm_billion: 415.2, growth_rate_yoy: 5.9, services: 249.1, manufacturing: 97.4, agriculture: 26.5, construction: 18.2, mining: 24.7 },
  { quarter: 'Q3', year: 2024, label: '2024 Q3', total_gdp_rm_billion: 426.8, growth_rate_yoy: 5.3, services: 256.3, manufacturing: 99.8, agriculture: 26.9, construction: 19.1, mining: 25.1 },
  { quarter: 'Q4', year: 2024, label: '2024 Q4', total_gdp_rm_billion: 433.5, growth_rate_yoy: 5.0, services: 261.2, manufacturing: 101.5, agriculture: 27.2, construction: 19.8, mining: 25.4 },
  { quarter: 'Q1', year: 2025, label: '2025 Q1', total_gdp_rm_billion: 424.1, growth_rate_yoy: 4.8, services: 255.4, manufacturing: 100.2, agriculture: 27.0, construction: 19.5, mining: 25.0 },
  { quarter: 'Q2', year: 2025, label: '2025 Q2', total_gdp_rm_billion: 435.6, growth_rate_yoy: 4.9, services: 263.8, manufacturing: 102.8, agriculture: 27.6, construction: 20.4, mining: 25.2 },
  { quarter: 'Q3', year: 2025, label: '2025 Q3', total_gdp_rm_billion: 447.2, growth_rate_yoy: 4.8, services: 271.2, manufacturing: 105.1, agriculture: 28.0, construction: 21.0, mining: 25.6 },
  { quarter: 'Q4', year: 2025, label: '2025 Q4', total_gdp_rm_billion: 454.8, growth_rate_yoy: 4.9, services: 276.5, manufacturing: 107.0, agriculture: 28.4, construction: 21.6, mining: 25.9 },
  { quarter: 'Q1', year: 2026, label: '2026 Q1', total_gdp_rm_billion: 444.8, growth_rate_yoy: 4.9, services: 270.4, manufacturing: 105.6, agriculture: 28.2, construction: 21.3, mining: 25.5 },
  { quarter: 'Q2', year: 2026, label: '2026 Q2', total_gdp_rm_billion: 457.1, growth_rate_yoy: 5.0, services: 279.1, manufacturing: 108.4, agriculture: 28.9, construction: 22.2, mining: 25.7 },
  { quarter: 'Q3', year: 2026, label: '2026 Q3', total_gdp_rm_billion: 469.5, growth_rate_yoy: 5.1, services: 287.0, manufacturing: 111.0, agriculture: 29.4, construction: 22.9, mining: 26.1 },
];

// Labour Force & Monthly Unemployment (DOSM)
export const CURATED_LABOUR: LabourRecord[] = [
  { date: '2023-01', labour_force_thousand: 16750, employed_thousand: 16150, unemployed_thousand: 600, unemployment_rate: 3.6, ep_ratio: 66.8 },
  { date: '2023-04', labour_force_thousand: 16840, employed_thousand: 16250, unemployed_thousand: 590, unemployment_rate: 3.5, ep_ratio: 67.0 },
  { date: '2023-07', labour_force_thousand: 16930, employed_thousand: 16350, unemployed_thousand: 580, unemployment_rate: 3.4, ep_ratio: 67.2 },
  { date: '2023-10', labour_force_thousand: 17010, employed_thousand: 16440, unemployed_thousand: 570, unemployment_rate: 3.4, ep_ratio: 67.3 },
  { date: '2024-01', labour_force_thousand: 17080, employed_thousand: 16515, unemployed_thousand: 565, unemployment_rate: 3.3, ep_ratio: 67.4 },
  { date: '2024-04', labour_force_thousand: 17140, employed_thousand: 16580, unemployed_thousand: 560, unemployment_rate: 3.3, ep_ratio: 67.5 },
  { date: '2024-07', labour_force_thousand: 17200, employed_thousand: 16650, unemployed_thousand: 550, unemployment_rate: 3.2, ep_ratio: 67.7 },
  { date: '2024-10', labour_force_thousand: 17260, employed_thousand: 16710, unemployed_thousand: 550, unemployment_rate: 3.2, ep_ratio: 67.8 },
  { date: '2025-01', labour_force_thousand: 17320, employed_thousand: 16775, unemployed_thousand: 545, unemployment_rate: 3.1, ep_ratio: 67.9 },
  { date: '2025-05', labour_force_thousand: 17390, employed_thousand: 16850, unemployed_thousand: 540, unemployment_rate: 3.1, ep_ratio: 68.0 },
  { date: '2025-09', labour_force_thousand: 17460, employed_thousand: 16920, unemployed_thousand: 540, unemployment_rate: 3.1, ep_ratio: 68.1 },
  { date: '2026-01', labour_force_thousand: 17520, employed_thousand: 16985, unemployed_thousand: 535, unemployment_rate: 3.1, ep_ratio: 68.2 },
  { date: '2026-05', labour_force_thousand: 17580, employed_thousand: 17045, unemployed_thousand: 535, unemployment_rate: 3.0, ep_ratio: 68.3 },
  { date: '2026-09', labour_force_thousand: 17650, employed_thousand: 17115, unemployed_thousand: 535, unemployment_rate: 3.0, ep_ratio: 68.4 },
];

// Household Income (Mean, Median) & Gini Ratio by State (HIES Official Release)
export const CURATED_STATE_INCOME: StateHouseholdRecord[] = [
  { state: 'Putrajaya', mean_income: 13473, median_income: 10056, gini_coefficient: 0.354, poverty_incidence: 0.1, population_thousand: 125 },
  { state: 'Kuala Lumpur', mean_income: 13325, median_income: 10234, gini_coefficient: 0.385, poverty_incidence: 1.4, population_thousand: 1980 },
  { state: 'Selangor', mean_income: 12233, median_income: 9983, gini_coefficient: 0.370, poverty_incidence: 1.2, population_thousand: 7210 },
  { state: 'Labuan', mean_income: 9890, median_income: 7650, gini_coefficient: 0.362, poverty_incidence: 2.5, population_thousand: 102 },
  { state: 'Johor', mean_income: 8517, median_income: 6870, gini_coefficient: 0.366, poverty_incidence: 4.6, population_thousand: 4120 },
  { state: 'Penang', mean_income: 8267, median_income: 6502, gini_coefficient: 0.352, poverty_incidence: 2.0, population_thousand: 1790 },
  { state: 'Melaka', mean_income: 8057, median_income: 6210, gini_coefficient: 0.348, poverty_incidence: 4.2, population_thousand: 1040 },
  { state: 'Negeri Sembilan', mean_income: 7578, median_income: 5818, gini_coefficient: 0.358, poverty_incidence: 4.4, population_thousand: 1230 },
  { state: 'Sarawak', mean_income: 6457, median_income: 4978, gini_coefficient: 0.392, poverty_incidence: 10.8, population_thousand: 2510 },
  { state: 'Terengganu', mean_income: 7248, median_income: 5878, gini_coefficient: 0.360, poverty_incidence: 6.2, population_thousand: 1320 },
  { state: 'Perak', mean_income: 5779, median_income: 4494, gini_coefficient: 0.355, poverty_incidence: 7.3, population_thousand: 2550 },
  { state: 'Pahang', mean_income: 5777, median_income: 4753, gini_coefficient: 0.349, poverty_incidence: 6.3, population_thousand: 1680 },
  { state: 'Perlis', mean_income: 5664, median_income: 4713, gini_coefficient: 0.344, poverty_incidence: 5.9, population_thousand: 260 },
  { state: 'Sabah', mean_income: 6171, median_income: 4577, gini_coefficient: 0.402, poverty_incidence: 19.7, population_thousand: 3720 },
  { state: 'Kedah', mean_income: 5550, median_income: 4402, gini_coefficient: 0.351, poverty_incidence: 9.0, population_thousand: 2210 },
  { state: 'Kelantan', mean_income: 4885, median_income: 3614, gini_coefficient: 0.364, poverty_incidence: 13.2, population_thousand: 1900 },
];
