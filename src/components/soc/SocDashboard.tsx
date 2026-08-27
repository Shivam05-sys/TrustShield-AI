import React, { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  FileSearch,
  UserX,
  MicOff,
  AlertOctagon,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { SocMetricStats, LiveAlert, SecurityCase } from '../../types';

interface SocDashboardProps {
  stats: SocMetricStats;
  alerts: LiveAlert[];
  cases: SecurityCase[];
  onOpenCase: (caseId: string) => void;
}

export const SocDashboard: React.FC<SocDashboardProps> = ({
  stats,
  alerts,
  cases,
  onOpenCase
}) => {
  const [filterThreat, setFilterThreat] = useState<string>('ALL');

  // Hourly verification volume data
  const volumeData = [
    { time: '00:00', total: 45, threats: 2 },
    { time: '04:00', total: 28, threats: 1 },
    { time: '08:00', total: 142, threats: 8 },
    { time: '12:00', total: 310, threats: 14 },
    { time: '16:00', total: 420, threats: 19 },
    { time: '19:00', total: 380, threats: 26 },
    { time: '22:00', total: 103, threats: 6 }
  ];

  // Threat Vector Breakdown
  const threatVectorData = [
    { name: 'AI Voice Cloning', count: 38, color: '#f43f5e' },
    { name: 'Document Tampering', count: 32, color: '#f59e0b' },
    { name: 'Face Spoof / Mismatch', count: 18, color: '#06b6d4' },
    { name: 'Telephony / IP Spoof', count: 12, color: '#8b5cf6' }
  ];

  // Trust score distribution
  const scoreDistributionData = [
    { range: '0–20 (Critical)', count: 24, fill: '#f43f5e' },
    { range: '21–40 (High)', count: 48, fill: '#fb7185' },
    { range: '41–60 (Medium)', count: 112, fill: '#f59e0b' },
    { range: '61–80 (Low)', count: 380, fill: '#34d399' },
    { range: '81–100 (Safe)', count: 864, fill: '#10b981' }
  ];

  return (
    <div id="soc-dashboard-view" className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              SECURITY OPERATIONS CENTER (SOC)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Live Multimodal Threat Monitoring Grid</h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Defense Health: <strong className="text-emerald-400">OPTIMAL (99.98%)</strong>
          </span>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Node: Asia-East1 Telephony Cluster
          </span>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        {/* Metric 1 */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 shadow-lg hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">TOTAL VERIFICATIONS</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">{stats.totalVerificationsToday.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">+18.4% from yesterday</span>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-4 rounded-2xl border border-rose-500/30 shadow-lg hover:border-rose-500/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">VOICE THREATS BLOCKED</span>
            <MicOff className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-rose-400">{stats.voiceThreatsBlocked}</span>
          <span className="text-[10px] text-rose-400/80 block mt-1">Neural vocoder interceptions</span>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-4 rounded-2xl border border-amber-500/30 shadow-lg hover:border-amber-500/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">TAMPERED DOCS DETECTED</span>
            <FileSearch className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-amber-400">{stats.tamperedDocumentsDetected}</span>
          <span className="text-[10px] text-amber-400/80 block mt-1">ELA & font anomalies</span>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 shadow-lg hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">PREVENTED FRAUD VALUE</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ₹{(stats.blockedTransactionsValueInr / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">~$580,000 USD protected</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 24-Hour Verification Volume Area Chart */}
        <div className="lg:col-span-8 glass-card border border-white/10 rounded-2xl p-5 shadow space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Hourly Screening Volume vs Detected Impersonation Spikes
              </h3>
              <p className="text-xs text-slate-400">Continuous 24-hour throughput with threat vector overlay</p>
            </div>
            <span className="text-xs font-mono text-slate-300 glass-pill px-2.5 py-1 rounded-full border border-white/10">
              Live Real-Time
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
                <Area type="monotone" dataKey="total" name="Total Checks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="threats" name="Threats Intercepted" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Vector Distribution Pie */}
        <div className="lg:col-span-4 glass-card border border-white/10 rounded-2xl p-5 shadow space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Multimodal Threat Vectors
            </h3>
            <p className="text-xs text-slate-400">Classification of intercepted attacks</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatVectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {threatVectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            {threatVectorData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
                <span className="text-slate-400 font-bold ml-auto">{item.count}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Score Distribution & Live Incident Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score Distribution Histogram */}
        <div className="lg:col-span-6 glass-card border border-white/10 rounded-2xl p-5 shadow space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Identity Trust Score Distribution (Daily)
            </h3>
            <span className="text-xs font-mono text-slate-300 glass-pill px-2.5 py-0.5 rounded-full">Avg: {stats.averageTrustScore}/100</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistributionData}>
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Threat Alert Stream Feed */}
        <div className="lg:col-span-6 glass-card border border-white/10 rounded-2xl p-5 shadow space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Live SOC Incident Feed
            </h3>
            <span className="text-xs font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/20">{alerts.length} Active Events</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onOpenCase(alert.caseId)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:translate-x-1 ${
                  alert.level === 'CRITICAL'
                    ? 'glass-card-danger text-slate-200 hover:border-rose-500/60'
                    : alert.level === 'HIGH'
                    ? 'bg-amber-950/30 border border-amber-500/30 text-slate-200 hover:border-amber-500/60 backdrop-blur-md'
                    : 'glass-card-subtle text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    alert.level === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : alert.level === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    [{alert.level}] {alert.caseId}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.timestamp}
                  </span>
                </div>
                <p className="font-semibold text-white text-xs">{alert.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
