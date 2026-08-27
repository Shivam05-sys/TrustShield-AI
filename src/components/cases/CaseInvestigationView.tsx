import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  User,
  Download,
  FileCheck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Send,
  ArrowLeft,
  Lock,
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  Activity,
  Mic,
  FileCode,
  Check
} from 'lucide-react';
import { SecurityCase, UserRole } from '../../types';
import { ApiService } from '../../services/apiService';
import { generateSignedCasePdf } from '../../utils/pdfGenerator';

interface CaseInvestigationViewProps {
  cases: SecurityCase[];
  selectedCaseId: string | null;
  onSelectCase: (id: string | null) => void;
  userRole: UserRole;
  onCaseUpdated?: (updatedCase: SecurityCase) => void;
}

export const CaseInvestigationView: React.FC<CaseInvestigationViewProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  userRole,
  onCaseUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'LOW'>('ALL');
  const [newNote, setNewNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const activeCase = cases.find(c => c.id === selectedCaseId || c.caseNumber === selectedCaseId) || cases[0];

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.claimedIdentity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || c.multimodalResult.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const handleUpdateStatus = async (newStatus: SecurityCase['status'], noteText?: string) => {
    if (!activeCase) return;
    setIsUpdating(true);
    try {
      const updated = await ApiService.updateCaseAction(
        activeCase.id,
        newStatus,
        noteText || `Status transitioned to ${newStatus} by ${userRole}`,
        `Officer (${userRole})`
      );
      if (onCaseUpdated) onCaseUpdated(updated);
      setNewNote('');
    } catch (err) {
      console.error('Failed to update case:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !activeCase) return;
    await handleUpdateStatus(activeCase.status, newNote.trim());
  };

  const handleExportSignedPdf = async () => {
    if (!activeCase) return;
    setIsExportingPdf(true);
    try {
      await generateSignedCasePdf(activeCase, userRole.replace(/_/g, ' ').toUpperCase());
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportJson = () => {
    if (!activeCase) return;
    const blob = new Blob([JSON.stringify(activeCase, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustShield-Case-${activeCase.caseNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="case-investigation-view" className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
              DIGITAL EVIDENCE ARCHIVE
            </span>
            <span className="bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-500/30">
              AUDIT TRAIL SECURED
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
            Multimodal Incident Investigation Dossiers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect chain-of-custody biometric telemetry, document tampering ELA, acoustic clones, and export signed certificates
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-slate-300 glass-pill px-3 py-1.5 rounded-xl border border-white/10">
            Active Records: {cases.length} Total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Case Directory List */}
        <div className="lg:col-span-4 space-y-4 w-full">
          <div className="glass-card rounded-2xl p-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ID, or case #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 glass-pill p-1 rounded-xl border border-white/10 text-[11px] overflow-x-auto no-scrollbar">
              {(['ALL', 'CRITICAL', 'HIGH', 'LOW'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskFilter(r)}
                  className={`flex-1 min-w-[50px] py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                    riskFilter === r ? 'bg-blue-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Case Cards List */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 glass-card rounded-2xl">
                No matching security cases found.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = activeCase?.id === c.id;
                const risk = c.multimodalResult.riskLevel;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase(c.id)}
                    className={`p-4 rounded-2xl text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'glass-card-accent border-blue-500/60 shadow-lg shadow-blue-950/40'
                        : 'glass-card hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 truncate">
                        {c.caseNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        risk === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : risk === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {risk}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-100 text-xs mb-1 truncate">{c.subjectName}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{c.scenario}</p>

                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Trust: <strong className={c.multimodalResult.identityTrustScore > 75 ? 'text-emerald-400' : 'text-rose-400'}>{c.multimodalResult.identityTrustScore}/100</strong></span>
                      <span className="truncate max-w-[140px]">Status: <strong className="text-slate-300">{c.status.replace(/_/g, ' ')}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Case Detail Dossier */}
        {activeCase ? (
          <div className="lg:col-span-8 space-y-5 w-full">
            {/* Header of Active Case */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">{activeCase.caseNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                      activeCase.status === 'BLOCKED_FRAUD'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : activeCase.status === 'VERIFIED_GENUINE'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      STATUS: {activeCase.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{activeCase.subjectName}</h3>
                  <p className="text-xs text-slate-400">Claimed Identity: {activeCase.claimedIdentity} • Recorded: {activeCase.timestamp}</p>
                </div>

                {/* Export Controls (Signed PDF & JSON) */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportSignedPdf}
                    disabled={isExportingPdf}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-blue-400/30"
                  >
                    {exportSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Signed PDF Downloaded
                      </>
                    ) : isExportingPdf ? (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                        Signing Dossier...
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4 text-cyan-300" />
                        Export Signed PDF Report
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-3 py-2 glass-card-subtle hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export JSON Evidence"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                </div>
              </div>

              {/* Multimodal Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block">IDENTITY TRUST SCORE</span>
                  <span className={`text-xl font-bold font-mono ${
                    activeCase.multimodalResult.identityTrustScore > 75 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {activeCase.multimodalResult.identityTrustScore}/100
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{activeCase.multimodalResult.riskLevel} Risk</span>
                </div>

                <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block">DOC INTEGRITY</span>
                  <span className={`text-xl font-bold font-mono ${
                    activeCase.multimodalResult.documentAnalysis.authenticityScore > 75 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {activeCase.multimodalResult.documentAnalysis.authenticityScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{activeCase.multimodalResult.documentAnalysis.forensicIndicators.tamperVerdict.replace(/_/g, ' ')}</span>
                </div>

                <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block">VOICE SYNTHESIS RISK</span>
                  <span className={`text-xl font-bold font-mono ${
                    activeCase.multimodalResult.voiceAnalysis.aiSynthesisRisk > 50 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {activeCase.multimodalResult.voiceAnalysis.aiSynthesisRisk}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{activeCase.multimodalResult.voiceAnalysis.verdict.replace(/_/g, ' ')}</span>
                </div>

                <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block">FACE BIOMETRICS</span>
                  <span className="text-xl font-bold font-mono text-cyan-400">
                    {activeCase.multimodalResult.faceVerification.matchScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Liveness: {activeCase.multimodalResult.faceVerification.livenessScore}%</span>
                </div>
              </div>

              {/* Primary Summary */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold block mb-1">
                  EXECUTIVE FORENSIC SUMMARY & AI DISPOSITION
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeCase.multimodalResult.primarySummary}
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <span>Recommended Action: <strong className="text-blue-300">{activeCase.multimodalResult.recommendedAction.replace(/_/g, ' ')}</strong></span>
                  <span>Assigned Officer: <strong className="text-slate-300">{activeCase.assignedOfficer}</strong></span>
                </div>
              </div>

              {/* Forensic Evidence Thumbnails */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="glass-card-subtle p-3 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">1. DOCUMENT EVIDENCE</span>
                    <span className="text-[10px] font-mono text-blue-400">ELA Scan</span>
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                    <img
                      src={activeCase.multimodalResult.documentInfo?.documentImageUrl || (activeCase.multimodalResult.documentAnalysis.suspiciousRegions.length > 0 ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80')}
                      alt="Doc Evidence"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5 glass-pill px-2 py-0.5 rounded text-[9px] font-mono text-slate-300">
                      {activeCase.multimodalResult.documentAnalysis.suspiciousRegions.length} Tamper Zones
                    </div>
                  </div>
                </div>

                <div className="glass-card-subtle p-3 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">2. FACE COMPARISON</span>
                    <span className="text-[10px] font-mono text-cyan-400">68 Landmarks</span>
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex relative">
                    <img
                      src={activeCase.multimodalResult.faceVerification.extractedFaceUrl}
                      alt="Extracted face"
                      className="w-1/2 h-full object-cover border-r border-white/10"
                    />
                    <img
                      src={activeCase.multimodalResult.faceVerification.livePhotoUrl}
                      alt="Live face"
                      className="w-1/2 h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5 glass-pill px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300">
                      Liveness: {activeCase.multimodalResult.faceVerification.livenessScore}%
                    </div>
                  </div>
                </div>

                <div className="glass-card-subtle p-3 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">3. VOICE SPECTRUM</span>
                    <span className="text-[10px] font-mono text-rose-400">16kHz Vocoder</span>
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 p-2.5 flex flex-col justify-end gap-1 relative">
                    <div className="flex items-end gap-1 h-full">
                      {(activeCase.multimodalResult.voiceAnalysis.frequencyBinsData || [40, 65, 80, 50, 90, 85, 30, 20, 10, 5, 0, 0]).slice(0, 12).map((v, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t ${
                            activeCase.multimodalResult.voiceAnalysis.aiSynthesisRisk > 50
                              ? 'bg-rose-500/80'
                              : 'bg-emerald-500/80'
                          }`}
                          style={{ height: `${Math.max(8, v)}%` }}
                        />
                      ))}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 glass-pill px-2 py-0.5 rounded text-[9px] font-mono text-rose-300">
                      {activeCase.multimodalResult.voiceAnalysis.verdict.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Investigator Action Controls */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 font-semibold block">
                    INVESTIGATOR DISPOSITION & ACTIONS (RBAC: {userRole.toUpperCase()})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Dual Authorization Active</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('BLOCKED_FRAUD')}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <XCircle className="w-4 h-4" /> Block Account & File Incident
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('REQUIRES_CALLBACK')}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" /> Trigger Out-of-Band Callback
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('VERIFIED_GENUINE')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Override & Mark Genuine
                  </button>
                </div>
              </div>

              {/* Investigator Case Notes Log & Add Note Form */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-3">
                <span className="text-xs font-mono text-blue-400 font-semibold block">
                  CHAIN-OF-CUSTODY AUDIT NOTES ({activeCase.notes.length})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeCase.notes.map((n, i) => (
                    <div key={i} className="p-3 glass-card-subtle rounded-xl border border-white/10 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <strong className="text-blue-300">{n.author}</strong>
                        <span>{n.timestamp}</span>
                      </div>
                      <p className="text-slate-200">{n.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add forensic observation note to case..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 glass-input rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" /> Append Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-12 glass-card rounded-2xl text-slate-400 text-xs font-mono">
            Select a case from the directory to inspect forensic evidence.
          </div>
        )}
      </div>
    </div>
  );
};
