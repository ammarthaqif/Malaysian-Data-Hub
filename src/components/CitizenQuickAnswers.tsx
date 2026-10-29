import React, { useState } from 'react';
import {
  Fuel,
  Wallet,
  CloudRain,
  TrendingDown,
  Briefcase,
  ChevronRight,
  Sparkles,
  Info,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { CURATED_STATE_INCOME, CURATED_FUEL_PRICES, CURATED_CPI, CURATED_LABOUR } from '../data/curatedIndicators';
import { Language, TRANSLATIONS } from '../data/translations';

interface CitizenQuickAnswersProps {
  language: Language;
  onNavigateToTab: (tab: any) => void;
}

export const CitizenQuickAnswers: React.FC<CitizenQuickAnswersProps> = ({
  language,
  onNavigateToTab,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<'fuel' | 'income' | 'weather' | 'inflation' | 'jobs'>('fuel');
  const [selectedState, setSelectedState] = useState<string>('Selangor');

  const t = TRANSLATIONS[language];

  // Latest records
  const latestFuel = CURATED_FUEL_PRICES[CURATED_FUEL_PRICES.length - 1];
  const latestCpi = CURATED_CPI[CURATED_CPI.length - 1];
  const latestLabour = CURATED_LABOUR[CURATED_LABOUR.length - 1];

  const stateRecord =
    CURATED_STATE_INCOME.find((s) => s.state.toLowerCase() === selectedState.toLowerCase()) ||
    CURATED_STATE_INCOME[0];

  const rankedStates = [...CURATED_STATE_INCOME].sort((a, b) => b.median_income - a.median_income);
  const stateRank = rankedStates.findIndex((s) => s.state === stateRecord.state) + 1;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Citizen Guide & Quick Answers' : 'Panduan Ringkas Rakyat'}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'en' ? 'Plain Language Insights' : 'Bahasa Mudah Difahami'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.citizenQuestionsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t.citizenQuestionsSubtitle}
          </p>
        </div>
      </div>

      {/* Interactive Question Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 my-6">
        {[
          { id: 'fuel', icon: Fuel, label: language === 'en' ? 'Weekly Petrol & Fuel' : 'Harga Petrol Minggu Ini' },
          { id: 'income', icon: Wallet, label: language === 'en' ? 'Income in My State' : 'Gaji & Pendapatan Negeri' },
          { id: 'weather', icon: CloudRain, label: language === 'en' ? 'Weather & Storm Alerts' : 'Amaran Ribut & Cuaca' },
          { id: 'inflation', icon: TrendingDown, label: language === 'en' ? 'Cost of Living & CPI' : 'Kos Sara Hidup & Inflasi' },
          { id: 'jobs', icon: Briefcase, label: language === 'en' ? 'Jobs & Unemployment' : 'Pekerjaan & Pasaran Kerja' },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedTopic === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedTopic(item.id as any)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-amber-400/80 ring-1 ring-amber-400/40 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-xs font-semibold leading-snug">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Answer Viewport */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 sm:p-6">
        {/* Topic 1: Fuel */}
        {selectedTopic === 'fuel' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  {language === 'en' ? 'Official Weekly Fuel Prices (MOF)' : 'Harga Rasmi Petrol Mingguan (Kementerian Kewangan)'}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {language === 'en' ? 'Current Fuel Prices at All Petrol Stations' : 'Harga Petrol Semasa di Semua Stesen'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {language === 'en' ? 'Effective this week' : 'Berkuat kuasa minggu ini'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>RON95 Petrol</span>
                  <span className="text-[10px] text-emerald-400 font-mono">SUBSIDISED</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  RM {latestFuel.ron95.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {language === 'en' ? 'Per Litre (Capped by Govt)' : 'Seliter (Kadar Siling Subsidi)'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>RON97 Petrol</span>
                  <span className="text-[10px] text-slate-400 font-mono">FLOAT</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  RM {latestFuel.ron97.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {language === 'en' ? 'Per Litre (Market Price)' : 'Seliter (Harga Pasaran)'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Diesel (Peninsular)</span>
                  <span className="text-[10px] text-sky-400 font-mono">TARGETED</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  RM {latestFuel.diesel.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {language === 'en' ? 'Per Litre (BUDI MADANI)' : 'Seliter (Semenanjung)'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Diesel (Sabah/Sarawak)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">MAINTAINED</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  RM {(latestFuel.diesel_eastmsia || 2.15).toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {language === 'en' ? 'Per Litre (East Malaysia)' : 'Seliter (Sabah & Sarawak)'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {language === 'en'
                  ? 'RON95 petrol price is capped at RM2.05 to protect public purchasing power. Diesel in Peninsular Malaysia follows the targeted rationalization mechanism with BUDI MADANI cash assistance.'
                  : 'Harga petrol RON95 dikekalkan pada RM2.05 untuk melindungi kuasa beli rakyat. Diesel di Semenanjung mengikut penyasaran subsidi dengan bantuan tunai bulanan BUDI MADANI.'}
              </span>
            </div>
          </div>
        )}

        {/* Topic 2: Income */}
        {selectedTopic === 'income' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  {language === 'en' ? 'Department of Statistics Malaysia (DOSM HIES)' : 'Jabatan Perangkaan Malaysia (DOSM HIES)'}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {language === 'en' ? 'Household Income in Your State' : 'Pendapatan Isi Rumah Mengikut Negeri'}
                </h3>
              </div>

              {/* State Picker Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{language === 'en' ? 'Select State:' : 'Pilih Negeri:'}</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                >
                  {CURATED_STATE_INCOME.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Median Household Income' : 'Pendapatan Median Isi Rumah'}</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  RM {stateRecord.median_income.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {language === 'en'
                    ? '50% of households earn more, 50% earn less'
                    : '50% isi rumah memperoleh lebih tinggi dari nilai ini'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Average (Mean) Income' : 'Purata Pendapatan (Min)'}</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  RM {stateRecord.mean_income.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {language === 'en' ? 'National Average: RM 8,479' : 'Purata Kebangsaan: RM 8,479'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'State Income Ranking' : 'Kedudukan Pendapatan Negeri'}</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  #{stateRank} <span className="text-xs font-normal text-slate-400">/ 16</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {language === 'en' ? `Population: ${(stateRecord.population_thousand / 1000).toFixed(2)}M people` : `Penduduk: ${(stateRecord.population_thousand / 1000).toFixed(2)}J orang`}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {language === 'en'
                ? `In ${selectedState}, the median monthly household income is RM ${stateRecord.median_income.toLocaleString()}. The median is widely considered by economists as the most accurate reflection of a typical family's earnings because it is not skewed by top 1% outliers.`
                : `Di ${selectedState}, pendapatan median bulanan isi rumah adalah RM ${stateRecord.median_income.toLocaleString()}. Nilai median ialah ukuran paling tepat pendapatan keluarga biasa kerana tidak dipengaruhi pendapatan golongan terkaya yang ekstrem.`}
            </p>
          </div>
        )}

        {/* Topic 3: Weather */}
        {selectedTopic === 'weather' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs text-amber-400 font-mono font-semibold">
                {language === 'en' ? 'Malaysian Meteorological Department (MET Malaysia)' : 'Jabatan Meteorologi Malaysia (MET Malaysia)'}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {language === 'en' ? 'Today\'s Active Weather & Thunderstorm Warnings' : 'Amaran Ribut Petir & Cuaca Semasa Hari Ini'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{language === 'en' ? 'Thunderstorms & Heavy Rain Warning' : 'Amaran Ribut Petir & Hujan Lebat'}</span>
                </div>
                <div className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {language === 'en'
                    ? 'Active warning issued for Selangor (Klang, Petaling, Kuala Langat), WP Kuala Lumpur, WP Putrajaya, and Johor (Muar, Batu Pahat). Strong wind gusts and heavy downpours expected.'
                    : 'Amaran dikeluarkan bagi Selangor (Klang, Petaling, Kuala Langat), WP Kuala Lumpur, WP Putrajaya, dan Johor (Muar, Batu Pahat). Angin kencang dan hujan lebat dijangka berlaku.'}
                </div>
                <div className="mt-3 text-[11px] font-mono text-slate-400">
                  {language === 'en' ? 'Valid: Today until 7:00 PM' : 'Sah: Hari ini sehingga 7:00 Petang'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-sky-400 mb-1">
                    {language === 'en' ? 'Public Safety Advice' : 'Nasihat Keselamatan Awam'}
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 mt-2">
                    <li>• {language === 'en' ? 'Avoid parking under large trees or weak structures.' : 'Elakkan meletakkan kenderaan di bawah pokok besar atau papan tanda.'}</li>
                    <li>• {language === 'en' ? 'Check low-lying urban routes for flash flood water accumulation.' : 'Berwaspada di laluan rendah yang mudah dinaiki air banjir kilat.'}</li>
                    <li>• {language === 'en' ? 'Live updates stream directly from MET Malaysia every 15 minutes.' : 'Data dikemas kini secara langsung daripada MET Malaysia setiap 15 minit.'}</li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigateToTab('stream')}
                  className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>{language === 'en' ? 'View Live Weather Stream' : 'Buka Aliran Cuaca Langsung'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topic 4: Inflation */}
        {selectedTopic === 'inflation' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs text-amber-400 font-mono font-semibold">
                {language === 'en' ? 'Consumer Price Index (CPI Inflation)' : 'Indeks Harga Pengguna (Kadar Inflasi)'}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {language === 'en' ? 'How Much Have Prices Changed for Everyday Essentials?' : 'Berapakah Kenaikan Harga Barang Keperluan?'}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Headline Inflation' : 'Inflasi Keseluruhan'}</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">1.9%</div>
                <div className="text-[11px] text-slate-400 mt-1">{language === 'en' ? 'Year-on-Year Change' : 'Kenaikan Tahunan'}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Food & Groceries' : 'Makanan & Minuman'}</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">3.2%</div>
                <div className="text-[11px] text-slate-400 mt-1">{language === 'en' ? 'Fresh produce & dining out' : 'Bahan mentah & makan luar'}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Transport' : 'Pengangkutan'}</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">1.6%</div>
                <div className="text-[11px] text-slate-400 mt-1">{language === 'en' ? 'Stabilized by fuel cap' : 'Stabil dengan subsidi petrol'}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Housing & Utilities' : 'Perumahan & Utiliti'}</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">1.5%</div>
                <div className="text-[11px] text-slate-400 mt-1">{language === 'en' ? 'Rent, water, electricity' : 'Sewa, air, elektrik'}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
              <strong>{language === 'en' ? 'What this means for you: ' : 'Maksud kepada poket anda: '}</strong>
              {language === 'en'
                ? 'A basket of everyday groceries that cost RM100 last year now costs about RM101.90. Inflation in Malaysia remains one of the lowest in Southeast Asia due to price ceilings on basic food and fuel.'
                : 'Bakul barang dapur yang berharga RM100 tahun lepas kini berharga sekitar RM101.90. Kadar inflasi Malaysia adalah antara yang terendah di Asia Tenggara disebabkan subsidi petrol dan kawalan harga barangan asas.'}
            </div>
          </div>
        )}

        {/* Topic 5: Jobs */}
        {selectedTopic === 'jobs' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs text-amber-400 font-mono font-semibold">
                {language === 'en' ? 'National Labour Force & Jobs Statistics' : 'Statistik Tenaga Buruh & Pasaran Kerja Kebangsaan'}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {language === 'en' ? 'Employment & Job Market Overview' : 'Gambaran Keseluruhan Pasaran Kerja & Pekerjaan'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Unemployment Rate' : 'Kadar Pengangguran'}</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">3.0%</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {language === 'en' ? 'Near full employment status' : 'Status guna tenaga penuh'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Working Malaysians' : 'Rakyat Bekerja'}</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">17.12M</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {language === 'en' ? 'Active in the workforce' : 'Bekerja aktif'}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">{language === 'en' ? 'Workforce Participation' : 'Kadar Penyertaan Buruh'}</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">68.4%</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {language === 'en' ? 'Highest historical record' : 'Rekod tertinggi dalam sejarah'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {language === 'en'
                ? 'Economists consider an unemployment rate below 4.0% as full employment. Net job growth has been particularly strong in the services, electrical & electronics (E&E) manufacturing, and digital economy sectors.'
                : 'Pakar ekonomi menganggap kadar pengangguran di bawah 4.0% sebagai guna tenaga penuh. Pertumbuhan peluang pekerjaan paling pesat dalam sektor perkhidmatan, pembuatan elektrik & elektronik (E&E), dan ekonomi digital.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
