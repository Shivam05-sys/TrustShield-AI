import React, { useState } from 'react';
import { ShieldAlert, ZoomIn, Eye, Layers, FileSearch, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DocumentTamperingAnalysis, DocumentInfo } from '../../types';

interface TamperingHeatmapProps {
  documentInfo: DocumentInfo;
  tampering: DocumentTamperingAnalysis;
}

export const TamperingHeatmap: React.FC<TamperingHeatmapProps> = ({ documentInfo, tampering }) => {
  const [viewMode, setViewMode] = useState<'NORMAL' | 'HEATMAP' | 'ELA' | 'NOISE'>('HEATMAP');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    tampering.suspiciousRegions.length > 0 ? tampering.suspiciousRegions[0].id : null
  );

  const selectedRegion = tampering.suspiciousRegions.find(r => r.id === selectedRegionId);

  return (
    <div id="tampering-heatmap-container" className="glass-card rounded-2xl p-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Forensic Document Tampering & ELA Inspector
              <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded-full ${
                tampering.tamperingRiskScore > 50
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {tampering.forensicIndicators.tamperVerdict}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Multi-spectral pixel variance, font anti-aliasing & error level analysis (ELA)
            </p>
          </div>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center glass-pill p-1 rounded-xl border border-white/10 text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('NORMAL')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'NORMAL' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Original ID
          </button>
          <button
            type="button"
            onClick={() => setViewMode('HEATMAP')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'HEATMAP' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Tamper Heatmap
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ELA')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'ELA' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ELA Discrepancy
          </button>
          <button
            type="button"
            onClick={() => setViewMode('NOISE')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'NOISE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Noise Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Document Preview with interactive bounding box overlay */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] bg-slate-950/80 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group shadow-inner">
            <img
              src={documentInfo.documentImageUrl}
              alt="Analyzed document"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-300 ${
                viewMode === 'ELA'
                  ? 'invert contrast-200 brightness-75 hue-rotate-180'
                  : viewMode === 'NOISE'
                  ? 'grayscale contrast-150 brightness-90'
                  : ''
              }`}
            />

            {/* Heatmap overlay */}
            {viewMode === 'HEATMAP' && (
              <div className="absolute inset-0 bg-blue-950/20 backdrop-filter pointer-events-none" />
            )}

            {/* Suspicious Bounding Boxes */}
            {(viewMode === 'HEATMAP' || viewMode === 'NORMAL') &&
              tampering.suspiciousRegions.map((region) => {
                const [x, y, w, h] = region.box;
                const isSelected = selectedRegionId === region.id;
                return (
                  <div
                    key={region.id}
                    onClick={() => setSelectedRegionId(region.id)}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${w}%`,
                      height: `${h}%`
                    }}
                    className={`absolute cursor-pointer transition-all border-2 rounded-lg ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse'
                        : 'border-amber-400/80 bg-amber-400/15 hover:border-rose-400'
                    }`}
                  >
                    <div className="absolute -top-5 left-0 bg-rose-950 text-rose-200 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full border border-rose-600 flex items-center gap-1 shadow whitespace-nowrap">
                      <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
                      {region.label} ({region.riskPercentage}%)
                    </div>
                  </div>
                );
              })}

            {tampering.suspiciousRegions.length === 0 && (
              <div className="absolute bottom-3 right-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero Tampering Artifacts Detected
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ELA Matrix: 95% Quantization</span>
            <span>Resolution: 300 DPI Forensic Scan</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-400" /> Interactive Click Region
            </span>
          </div>
        </div>

        {/* Forensic Metrics & Selected Region details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">DOC AUTHENTICITY</span>
                <span className={`text-2xl font-bold font-mono ${
                  tampering.authenticityScore > 75 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tampering.authenticityScore}%
                </span>
                <div className="w-full bg-slate-900/80 h-1.5 rounded-full mt-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full ${tampering.authenticityScore > 75 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'}`}
                    style={{ width: `${tampering.authenticityScore}%` }}
                  />
                </div>
              </div>

              <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">TAMPERING RISK</span>
                <span className={`text-2xl font-bold font-mono ${
                  tampering.tamperingRiskScore > 40 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {tampering.tamperingRiskScore}%
                </span>
                <div className="w-full bg-slate-900/80 h-1.5 rounded-full mt-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full ${tampering.tamperingRiskScore > 40 ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}
                    style={{ width: `${tampering.tamperingRiskScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Selected anomaly card */}
            {selectedRegion ? (
              <div className="glass-card-danger p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    {selectedRegion.label}
                  </span>
                  <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                    {selectedRegion.anomalyType}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedRegion.description}
                </p>
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-rose-900/40">
                  <span>Pixel Variance: <strong className="text-rose-300">{selectedRegion.pixelVariance}σ</strong></span>
                  <span>Confidence: <strong className="text-rose-300">{selectedRegion.riskPercentage}%</strong></span>
                </div>
              </div>
            ) : (
              <div className="glass-card-subtle p-3.5 rounded-xl text-xs text-slate-400">
                No localized font or photo splicing anomalies identified. Document background guilloché patterns remain intact.
              </div>
            )}

            {/* Forensic observations */}
            <div className="glass-card-subtle p-3 rounded-xl border border-white/10 space-y-1.5">
              <span className="text-[11px] font-mono font-medium text-blue-400 block mb-1">
                EXPERT FORENSIC NOTES
              </span>
              {tampering.forensicNotes.map((note, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-blue-400 font-mono mt-0.5">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 glass-pill px-3 py-1.5 rounded-xl border border-white/10">
            DISCLAIMER: AI-assisted forensic assessment for security triage; not an absolute legal determination.
          </div>
        </div>
      </div>
    </div>
  );
};
