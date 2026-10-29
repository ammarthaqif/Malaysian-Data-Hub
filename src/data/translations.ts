export type Language = 'en' | 'bm';

export interface Translations {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  searchButton: string;
  popularSearches: string;
  navOverview: string;
  navDigest: string;
  navCatalogue: string;
  navIndicators: string;
  navMap: string;
  navAiForecast: string;
  navCompare: string;
  navStream: string;
  navApiHealth: string;
  exportReport: string;
  citizenQuestionsTitle: string;
  citizenQuestionsSubtitle: string;
  qFuel: string;
  qIncome: string;
  qWeather: string;
  qInflation: string;
  qJobs: string;
  officialSource: string;
  datasetsAvailable: string;
  allSystemsOperational: string;
  developedBy: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'data.gov.my Explorer',
    tagline: 'Centralized Malaysian Open Data Portal for the Public',
    heroTitle: 'Malaysia Open Data Made Simple for Everyone',
    heroSubtitle: 'Easily explore official government data on fuel prices, household incomes, cost of living, weather alerts, and public transit in one friendly dashboard.',
    searchPlaceholder: 'Search anything (e.g. petrol price, state income, weather, inflation, population)...',
    searchButton: 'Search',
    popularSearches: 'Popular searches:',
    navOverview: 'Overview',
    navDigest: 'Daily Digest',
    navCatalogue: 'Catalogue',
    navIndicators: 'Socioeconomic Trends',
    navMap: 'Regional Map',
    navAiForecast: 'AI Forecast',
    navCompare: 'Compare Trends',
    navStream: 'Live Stream',
    navApiHealth: 'API Health',
    exportReport: 'Export Report',
    citizenQuestionsTitle: 'Quick Answers for Everyday Malaysians',
    citizenQuestionsSubtitle: 'Get instant, easy-to-understand insights to common public questions without reading complex spreadsheets.',
    qFuel: 'How much is petrol & diesel this week?',
    qIncome: 'What is the median household income in my state?',
    qWeather: 'Are there any active thunderstorm or flood alerts?',
    qInflation: 'Is the cost of living increasing (CPI Inflation)?',
    qJobs: 'How is the Malaysian job market and unemployment rate?',
    officialSource: 'Official source: Malaysian Government Open Data Portal (data.gov.my)',
    datasetsAvailable: '355+ Open Datasets Available',
    allSystemsOperational: 'All Open API Systems Operational',
    developedBy: 'Developed by',
  },
  bm: {
    brandName: 'Penjelajah data.gov.my',
    tagline: 'Portal Data Terbuka Malaysia untuk Kegunaan Orang Awam',
    heroTitle: 'Data Terbuka Malaysia Kini Mudah untuk Semua',
    heroSubtitle: 'Terokai data rasmi kerajaan mengenai harga petrol, pendapatan isi rumah, kos sara hidup, amaran cuaca, dan pengangkutan awam dalam satu papan pemuka mesra rakyat.',
    searchPlaceholder: 'Cari apa sahaja (cth. harga petrol, gaji negeri, amaran cuaca, inflasi, penduduk)...',
    searchButton: 'Cari',
    popularSearches: 'Carian popular:',
    navOverview: 'Utama',
    navDigest: 'Ringkasan Harian',
    navCatalogue: 'Katalog Data',
    navIndicators: 'Aliran Sosioekonomi',
    navMap: 'Peta Negeri',
    navAiForecast: 'Ramalan AI',
    navCompare: 'Banding Trend',
    navStream: 'Masa Nyata',
    navApiHealth: 'Status API',
    exportReport: 'Muat Turun Laporan',
    citizenQuestionsTitle: 'Jawapan Pantas untuk Rakyat Malaysia',
    citizenQuestionsSubtitle: 'Dapatkan maklumat segera yang mudah difahami mengenai soalan lazim orang ramai tanpa perlu membuka jadual rumit.',
    qFuel: 'Berapakah harga petrol & diesel minggu ini?',
    qIncome: 'Berapakah pendapatan median isi rumah di negeri saya?',
    qWeather: 'Adakah amaran ribut petir atau hujan lebat hari ini?',
    qInflation: 'Adakah kos sara hidup meningkat (Kadar Inflasi)?',
    qJobs: 'Bagaimanakah situasi pasaran kerja & pengangguran semasa?',
    officialSource: 'Sumber rasmi: Portal Data Terbuka Kerajaan Malaysia (data.gov.my)',
    datasetsAvailable: '355+ Set Data Terbuka Sedia Ada',
    allSystemsOperational: 'Semua Sistem Open API Beroperasi Lancar',
    developedBy: 'Dibangunkan oleh',
  },
};
