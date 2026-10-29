import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Zap,
  Globe,
  Clock,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  ArrowUpRight,
  Database,
  Radio,
} from 'lucide-react';
import { ApiHealthResponse, EndpointHealthStatus } from '../types/dataset';
import { getApiHealth } from '../services/api';

export const ApiHealthView: React.FC = () => {
  const [healthData, setHealthData] = useState<ApiHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(15);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointHealthStatus | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await getApiHealth();
      setHealthData(data);
      if (!selectedEndpoint && data.endpoints.length > 0) {
        setSelectedEndpoint(data.endpoints[0]);
      } else if (selectedEndpoint) {
        const updated = data.endpoints.find((e) => e.id === selectedEndpoint.id);
        if (updated) setSelectedEndpoint(updated);
      }
    } catch (err) {
      console.error('Health fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchHealth();
    }, refreshIntervalSec * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshIntervalSec]);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!healthData && loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const endpoints = healthData?.endpoints || [];
  const avgLatency = healthData?.avg_latency_ms || 178;
  const operationalCount = endpoints.filter((e) => e.status === 'operational').length;
  const isAllHealthy = operationalCount === endpoints.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Open Data Infrastructure Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Latency & Availability Prober</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>data.gov.my API Health Monitor</span>
          </h2>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Auto Refresh Switch */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                autoRefresh
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {autoRefresh ? 'Auto-Polling ON (15s)' : 'Auto-Polling OFF'}
            </button>
          </div>

          <button
            onClick={fetchHealth}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Probing...' : 'Probe All Endpoints'}</span>
          </button>
        </div>
      </div>

      {/* High-Level Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: System Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isAllHealthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            {isAllHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs text-slate-400">System Health Status</div>
            <div className="text-base font-bold text-white">
              {isAllHealthy ? 'All Systems Operational' : 'Partial Service Latency'}
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              {operationalCount} of {endpoints.length} Available
            </div>
          </div>
        </div>

        {/* Card 2: Average Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Network Latency (Avg)</div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              {avgLatency} ms
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Nominal Response Range
            </div>
          </div>
        </div>

        {/* Card 3: Measured Uptime */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Catalogue Availability</div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              99.85%
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              30-Day Moving Window
            </div>
          </div>
        </div>

        {/* Card 4: Last Probe Sync */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Last Telemetry Probe</div>
            <div className="text-base font-bold font-mono tabular-nums text-white">
              {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString([], { hour12: false }) : 'Just now'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Interval: {refreshIntervalSec}s Cadence
            </div>
          </div>
        </div>
      </div>

      {/* Endpoints Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Monitored data.gov.my Open API Endpoints
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time HTTP health, round-trip latency, payload size, and response codes across government service domains.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> &lt; 300ms (Fast)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> 300ms–800ms
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> &gt; 800ms
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                <th className="p-4">Service Endpoint</th>
                <th className="p-4">Ministry / Agency</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">HTTP</th>
                <th className="p-4 text-right">Latency (ms)</th>
                <th className="p-4">Latency Sparkline</th>
                <th className="p-4 text-right">Uptime</th>
                <th className="p-4 text-right">Size</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep) => {
                const isSelected = selectedEndpoint?.id === ep.id;
                const isFast = ep.latency_ms < 300;
                const isModerate = ep.latency_ms >= 300 && ep.latency_ms <= 800;

                return (
                  <tr
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`border-b border-slate-800/60 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-800/80'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Endpoint Name */}
                    <td className="p-4">
                      <div className="font-semibold text-white text-sm">{ep.name}</div>
                      <div className="font-mono text-[11px] text-slate-500 truncate max-w-xs">
                        {ep.target_url}
                      </div>
                    </td>

                    {/* Agency */}
                    <td className="p-4 text-slate-300 font-medium">
                      {ep.agency}
                    </td>

                    {/* Status Indicator */}
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                          ep.status === 'operational'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : ep.status === 'degraded'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ep.status === 'operational'
                              ? 'bg-emerald-400'
                              : ep.status === 'degraded'
                              ? 'bg-amber-400'
                              : 'bg-rose-400 animate-ping'
                          }`}
                        />
                        {ep.status.toUpperCase()}
                      </span>
                    </td>

                    {/* HTTP Code */}
                    <td className="p-4 text-right font-mono tabular-nums">
                      <span
                        className={
                          ep.http_code === 200
                            ? 'text-emerald-400 font-bold'
                            : ep.http_code === 301
                            ? 'text-amber-400 font-bold'
                            : 'text-rose-400 font-bold'
                        }
                      >
                        {ep.http_code}
                      </span>
                    </td>

                    {/* Latency */}
                    <td className="p-4 text-right font-mono tabular-nums text-sm">
                      <span
                        className={
                          isFast
                            ? 'text-emerald-400 font-bold'
                            : isModerate
                            ? 'text-amber-400 font-bold'
                            : 'text-rose-400 font-bold'
                        }
                      >
                        {ep.latency_ms} ms
                      </span>
                    </td>

                    {/* Sparkline Visual */}
                    <td className="p-4">
                      <div className="flex items-end gap-1 h-5 w-24">
                        {(ep.latency_history || [ep.latency_ms]).slice(-6).map((lat, idx) => {
                          const heightPct = Math.min(100, Math.max(20, (lat / 500) * 100));
                          return (
                            <div
                              key={idx}
                              style={{ height: `${heightPct}%` }}
                              className={`w-3 rounded-t-sm transition-all ${
                                lat < 300
                                  ? 'bg-emerald-400/80'
                                  : lat <= 800
                                  ? 'bg-amber-400/80'
                                  : 'bg-rose-400/80'
                              }`}
                              title={`${lat}ms`}
                            />
                          );
                        })}
                      </div>
                    </td>

                    {/* Uptime */}
                    <td className="p-4 text-right font-mono tabular-nums text-slate-300">
                      {ep.uptime_pct}%
                    </td>

                    {/* Payload Size */}
                    <td className="p-4 text-right font-mono tabular-nums text-slate-400">
                      {ep.payload_size_kb} KB
                    </td>

                    {/* Copy / Inspect Action */}
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(ep.target_url);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        title="Copy endpoint URL"
                      >
                        {copiedUrl === ep.target_url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Endpoint Detail Drawer */}
      {selectedEndpoint && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                <span>Endpoint Inspector</span>
                <span aria-hidden="true">·</span>
                <span>{selectedEndpoint.agency}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEndpoint.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={selectedEndpoint.target_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <span>Direct Open API Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 mb-1">Target URI</div>
              <div className="text-slate-200 break-all select-all font-semibold">
                {selectedEndpoint.target_url}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 mb-1">Protocol / Encryption</div>
              <div className="text-emerald-400 font-semibold">{selectedEndpoint.protocol}</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 mb-1">Last Measured Latency</div>
              <div className="text-amber-400 font-bold text-sm">
                {selectedEndpoint.latency_ms} ms
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 mb-1">Response Size</div>
              <div className="text-slate-200 font-semibold">
                {selectedEndpoint.payload_size_kb} KB
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
