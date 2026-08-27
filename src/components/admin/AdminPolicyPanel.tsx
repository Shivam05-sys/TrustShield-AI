import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Lock,
  UserCheck,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Database,
  EyeOff
} from 'lucide-react';
import { SystemPolicySettings } from '../../types';
import { ApiService } from '../../services/apiService';

interface AdminPolicyPanelProps {
  policy: SystemPolicySettings;
  onPolicyUpdated?: (newPolicy: SystemPolicySettings) => void;
}

export const AdminPolicyPanel: React.FC<AdminPolicyPanelProps> = ({
  policy: initialPolicy,
  onPolicyUpdated
}) => {
  const [policy, setPolicy] = useState<SystemPolicySettings>(initialPolicy);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New speaker enrollment form state
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [newSpeakerRole, setNewSpeakerRole] = useState('');

  const handleSavePolicy = async () => {
    setIsSaving(true);
    try {
      const updated = await ApiService.updatePolicy(policy);
      setPolicy(updated);
      if (onPolicyUpdated) onPolicyUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save policy:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEnrolledSpeaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeakerName.trim()) return;

    const newProfile = {
      speakerId: `spk-${Date.now().toString().slice(-4)}`,
      name: newSpeakerName.trim(),
      roleTitle: newSpeakerRole.trim() || 'Executive / VIP',
      enrolledAt: new Date().toLocaleDateString(),
      voiceEmbeddingVectorSize: 512,
      confidenceBaseline: 98.4
    };

    setPolicy({
      ...policy,
      enrolledSpeakers: [...policy.enrolledSpeakers, newProfile]
    });

    setNewSpeakerName('');
    setNewSpeakerRole('');
  };

  const handleDeleteSpeaker = (speakerId: string) => {
    setPolicy({
      ...policy,
      enrolledSpeakers: policy.enrolledSpeakers.filter(s => s.speakerId !== speakerId)
    });
  };

  return (
    <div id="admin-policy-panel" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
              SECURITY GOVERNANCE & POLICY ENGINE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Global Risk Thresholds & Compliance Controls
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-mono text-emerald-300 glass-pill px-3 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> Policy Enforced Globally
            </span>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSavePolicy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Deploying Rules...' : 'Save & Enforce Policy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Threshold Sliders & Security Feature Toggles */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sliders Card */}
          <div className="glass-card rounded-2xl p-5 shadow-2xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Sliders className="w-4 h-4 text-blue-400" />
              Multimodal Identity Risk Thresholds
            </h3>

            {/* Threshold 1: Allow */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-medium">Minimum Trust Score for Auto-Approval</span>
                <span className="font-mono font-bold text-emerald-400">{policy.minTrustScoreForAllow}/100</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={policy.minTrustScoreForAllow}
                onChange={(e) => setPolicy({ ...policy, minTrustScoreForAllow: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Scores ≥ this threshold bypass manual queue and are instantly approved.
              </p>
            </div>

            {/* Threshold 2: Review */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-medium">Secondary Review Quarantine Window</span>
                <span className="font-mono font-bold text-amber-400">
                  {policy.blockThresholdScore} - {policy.minTrustScoreForAllow - 1}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Scores in this range automatically require investigator manual review and step-up MFA challenge.
              </p>
            </div>

            {/* Threshold 3: Immediate Block */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-medium">Immediate Block & Escalation Cutoff</span>
                <span className="font-mono font-bold text-rose-400">&lt; {policy.blockThresholdScore}/100</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={policy.blockThresholdScore}
                onChange={(e) => setPolicy({ ...policy, blockThresholdScore: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                Scores below this threshold immediately terminate transaction and log a high-priority incident.
              </p>
            </div>

            {/* Threshold 4: High Value Wire */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-medium">High-Value Wire Trigger (INR)</span>
                <span className="font-mono font-bold text-blue-400">
                  ₹{(policy.highValueTransactionThresholdInr).toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="500000"
                value={policy.highValueTransactionThresholdInr}
                onChange={(e) => setPolicy({ ...policy, highValueTransactionThresholdInr: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Active Security Modules Toggles */}
          <div className="glass-card rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Shield className="w-4 h-4 text-blue-400" />
              Automated Forensic Engine Toggles
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 'enableVoiceCloneDefense',
                  label: 'Real-Time Neural Voice Clone & Vocoder Analyzer',
                  desc: 'Inspects audio for 16kHz brick-wall cutoffs, monotonic pitch, and TTS artifacts.',
                  value: policy.enableVoiceCloneDefense
                },
                {
                  id: 'enableDocumentTamperELA',
                  label: 'Document Error Level Analysis (ELA) & Font Splicing Scan',
                  desc: 'Detects pixel variance, digital re-compression, and character font discrepancies.',
                  value: policy.enableDocumentTamperELA
                },
                {
                  id: 'requireOutOfBandCallbackForHighValue',
                  label: 'Mandatory Out-of-Band Phone Callback for High-Value Transactions',
                  desc: 'Triggers automated telephony challenge on transactions exceeding ₹50,00,000.',
                  value: policy.requireOutOfBandCallbackForHighValue
                },
                {
                  id: 'requireLiveLivenessCheck',
                  label: 'Facial Anti-Spoofing & Micro-Blink Liveness Enforcement',
                  desc: 'Requires 3D active depth or micro-expression analysis before accepting photo selfie.',
                  value: policy.requireLiveLivenessCheck
                }
              ].map((sw) => (
                <div key={sw.id} className="flex items-center justify-between p-3 glass-card-subtle rounded-xl border border-white/10">
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-slate-200 block">{sw.label}</span>
                    <span className="text-[11px] text-slate-400 block">{sw.desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPolicy({
                        ...policy,
                        [sw.id]: !sw.value
                      });
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      sw.value ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        sw.value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Framework & VIP Speaker Enrollment */}
        <div className="lg:col-span-5 space-y-6">
          {/* DPDP Act 2023 & GDPR Privacy Compliance Box */}
          <div className="glass-card rounded-2xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              DPDP Act (India) & Privacy-First Architecture
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 glass-card-subtle rounded-xl border border-white/10 space-y-1">
                <span className="font-mono text-emerald-400 text-[10px] font-bold uppercase">ZERO RAW AUDIO RETENTION</span>
                <p className="text-slate-300 text-[11px]">
                  Raw voice streams are processed in ephemeral RAM and immediately zeroed post-inference. Only 512-dimension mathematical embeddings are encrypted.
                </p>
              </div>

              <div className="p-3 glass-card-subtle rounded-xl border border-white/10 space-y-1">
                <span className="font-mono text-blue-400 text-[10px] font-bold uppercase">SECURE KEYSTORE ENCRYPTION</span>
                <p className="text-slate-300 text-[11px]">
                  Audit logs and case dossiers are signed with SHA-256 cryptographic chain-of-custody hashes for legal evidentiary integrity.
                </p>
              </div>

              <div className="p-3 glass-card-subtle rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-slate-300">Data Retention Horizon:</span>
                <span className="font-mono text-slate-200 font-bold">{policy.dataRetentionDays} Days (Auto-Purge)</span>
              </div>
            </div>
          </div>

          {/* Enrolled VIP Voiceprint Directory */}
          <div className="glass-card rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                Enrolled VIP Voiceprint Directory ({policy.enrolledSpeakers.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {policy.enrolledSpeakers.map((spk) => (
                <div key={spk.speakerId} className="p-2.5 glass-card-subtle rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-200 font-medium block">{spk.name}</strong>
                    <span className="text-[10px] text-slate-400">{spk.roleTitle} • Enrolled {spk.enrolledAt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSpeaker(spk.speakerId)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Speaker form */}
            <form onSubmit={handleAddEnrolledSpeaker} className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-blue-400 block font-semibold">
                Enroll New VIP Executive Voiceprint
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Executive Name"
                  value={newSpeakerName}
                  onChange={(e) => setNewSpeakerName(e.target.value)}
                  className="glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. CFO)"
                  value={newSpeakerRole}
                  onChange={(e) => setNewSpeakerRole(e.target.value)}
                  className="glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 glass-card-subtle hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer border border-white/10"
              >
                <Plus className="w-3.5 h-3.5" /> Enroll Voice Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
