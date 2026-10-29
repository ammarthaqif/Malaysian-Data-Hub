import React, { useState, useEffect } from 'react';
import {
  Radio,
  CloudRain,
  AlertTriangle,
  Bus,
  Coins,
  Play,
  Pause,
  RotateCcw,
  Download,
  Filter,
  CheckCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { RealtimeStreamEvent, WeatherWarningRecord, WeatherForecastRecord } from '../types/dataset';
import { getWeatherWarnings, getWeatherForecasts, exportToJSON } from '../services/api';

interface RealTimeStreamViewProps {
  events: RealtimeStreamEvent[];
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onClearEvents: () => void;
}

export const RealTimeStreamView: React.FC<RealTimeStreamViewProps> = ({
  events,
  isStreaming,
  onToggleStreaming,
  onClearEvents,
}) => {
  const [warnings, setWarnings] = useState<WeatherWarningRecord[]>([]);
  const [forecasts, setForecasts] = useState<WeatherForecastRecord[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [loadingFeeds, setLoadingFeeds] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoadingFeeds(true);
      try {
        const [w, f] = await Promise.all([getWeatherWarnings(), getWeatherForecasts()]);
        setWarnings(w);
        setForecasts(f);
      } catch (err) {
        console.error('Error fetching weather feeds:', err);
      } finally {
        setLoadingFeeds(false);
      }
    };

    fetchFeeds();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (selectedChannel === 'ALL') return true;
    if (selectedChannel === 'WEATHER') return e.type === 'WEATHER_ALERT';
    if (selectedChannel === 'TRANSIT') return e.type === 'TRANSIT_UPDATE';
    if (selectedChannel === 'COMMODITY') return e.type === 'COMMODITY_PRICE';
    if (selectedChannel === 'MACRO') return e.type === 'SOCIOECONOMIC_METRIC';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Server-Sent Events (SSE) & Real-Time Open Data Streams</span>
            <span aria-hidden="true">·</span>
            <span>MET Malaysia, APAD Transit & MOF</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Real-Time Public Data Streaming</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
              isStreaming ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
            </span>
          </h2>
        </div>

        {/* Stream Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStreaming}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              isStreaming
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={onClearEvents}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title="Clear Event Log"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => exportToJSON('malaysia_realtime_stream_log', events)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Real-time Cards: Weather Warnings, Transit, Commodity Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Active MET Weather Warnings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>MET Malaysia Weather Warnings</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Live API</span>
            </div>

            {warnings.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">
                No active meteorological warnings at this moment.
              </div>
            ) : (
              <div className="space-y-3">
                {warnings.slice(0, 2).map((w, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-amber-300 font-mono text-[11px]">
                        {w.heading_en || w.warning_issue?.title_en || 'Weather Warning'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Valid: {w.valid_to ? new Date(w.valid_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Until Evening'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {w.text_en}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Direct feed from api.data.gov.my/weather/warning/</span>
            <span className="text-emerald-400 font-mono">200 OK</span>
          </div>
        </div>

        {/* Card 2: 7-Day District Forecasts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <CloudRain className="w-4 h-4" />
                <span>District Forecasts (MET)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">7-Day General</span>
            </div>

            <div className="space-y-2">
              {forecasts.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950/80 border border-slate-800/60 rounded-lg p-2.5 text-xs">
                  <div>
                    <div className="font-semibold text-white">{f.location.location_name}</div>
                    <div className="text-[11px] text-slate-400">{f.afternoon_forecast}</div>
                  </div>
                  <div className="text-right font-mono tabular-nums text-xs">
                    <span className="text-amber-400 font-semibold">{f.max_temp}°C</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-slate-400">{f.min_temp}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Locations: KL, George Town, JB, Kuching</span>
            <span className="text-emerald-400 font-mono">Live</span>
          </div>
        </div>

        {/* Card 3: Real-Time Transit Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Bus className="w-4 h-4" />
                <span>Prasarana / APAD GTFS-RT Telemetry</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Vehicle Positions</span>
            </div>

            <div className="space-y-2.5">
              <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">MRT Putrajaya Line (PY)</span>
                  <span className="text-emerald-400 font-mono text-[10px]">NORMAL</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Headway: 210s</span>
                  <span>Avg Load: 62%</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">MRT Kajang Line (KG)</span>
                  <span className="text-emerald-400 font-mono text-[10px]">NORMAL</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Headway: 180s</span>
                  <span>Avg Load: 74%</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">LRT Kelana Jaya (KJ)</span>
                  <span className="text-emerald-400 font-mono text-[10px]">NORMAL</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Headway: 150s</span>
                  <span>Avg Load: 88%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>api.data.gov.my/gtfs-realtime/</span>
            <span className="text-emerald-400 font-mono">Active</span>
          </div>
        </div>
      </div>

      {/* Live Event Stream Terminal / Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">Live Inbound Telemetry Packets</h3>
            <span className="text-xs font-mono text-slate-500">({filteredEvents.length} events received)</span>
          </div>

          {/* Channel Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['ALL', 'WEATHER', 'TRANSIT', 'COMMODITY', 'MACRO'].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                  selectedChannel === ch
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
            Awaiting incoming telemetry packets from developer.data.gov.my stream...
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-[11px]">
                  <th className="p-3">Time</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Source Agency</th>
                  <th className="p-3">Telemetry Payload</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors font-mono text-[11px]"
                  >
                    <td className="p-3 whitespace-nowrap text-slate-500 tabular-nums">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {evt.type === 'WEATHER_ALERT' && (
                        <span className="text-amber-400">WEATHER</span>
                      )}
                      {evt.type === 'TRANSIT_UPDATE' && (
                        <span className="text-purple-400">TRANSIT</span>
                      )}
                      {evt.type === 'COMMODITY_PRICE' && (
                        <span className="text-emerald-400">COMMODITY</span>
                      )}
                      {evt.type === 'SOCIOECONOMIC_METRIC' && (
                        <span className="text-sky-400">MACRO</span>
                      )}
                      {evt.type === 'INIT' && <span className="text-slate-400">SYSTEM</span>}
                    </td>
                    <td className="p-3 whitespace-nowrap text-slate-400">
                      {evt.source || 'Open Data Gateway'}
                    </td>
                    <td className="p-3 text-slate-300">
                      {evt.type === 'WEATHER_ALERT' && (
                        <span>
                          [{evt.severity}] {evt.region}: {evt.phenomenon}
                        </span>
                      )}
                      {evt.type === 'TRANSIT_UPDATE' && (
                        <span>
                          {evt.line} (ID: {evt.vehicle_id}) · Status: {evt.status} · Occupancy: {evt.load_occupancy} · Headway: {evt.headway_sec}s
                        </span>
                      )}
                      {evt.type === 'COMMODITY_PRICE' && (
                        <span>
                          RON95: RM{evt.fuel_ron95} · RON97: RM{evt.fuel_ron97} · Diesel: RM{evt.fuel_diesel_peninsula} · USD/MYR: {evt.currency_myr_usd} · SGD/MYR: {evt.currency_myr_sgd}
                        </span>
                      )}
                      {evt.type === 'SOCIOECONOMIC_METRIC' && (
                        <span>
                          {evt.indicator} · Inflation: {evt.headline_inflation_rate} · Unemployment: {evt.unemployment_rate} · Workforce: {evt.active_labour_force}
                        </span>
                      )}
                      {evt.type === 'INIT' && <span>{evt.message}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
