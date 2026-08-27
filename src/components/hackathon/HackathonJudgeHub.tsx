import React, { useState } from 'react';
import {
  Award,
  Mic,
  FileCheck,
  ShieldAlert,
  BrainCircuit,
  Terminal,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Cpu,
  Globe,
  Radio,
  FileText,
  Clock
} from 'lucide-react';

export const HackathonJudgeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'arch' | 'schema' | 'usp' | 'models'>('pitch');

  return (
    <div id="hackathon-judge-hub" className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card-accent text-blue-300 border border-blue-500/30 text-xs font-mono font-bold mb-2">
              <Award className="w-4 h-4 text-amber-300" />
              HACKATHON JUDGE & ARCHITECTURE HUB
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              TrustShield AI: Unified Multimodal Impersonation Defense
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Bridging the gap between Physical/Digital Document Intelligence and Real-Time Voice Cloning Defense into ONE unified enterprise security layer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-300 glass-pill px-3 py-1.5 rounded-xl font-bold border border-emerald-500/40">
              100% PRODUCTION ARCHITECTURE
            </span>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10">
          {[
            { id: 'pitch', label: '🎤 5-Minute Pitch Script', icon: Radio },
            { id: 'arch', label: '🏛️ System Architecture', icon: Layers },
            { id: 'models', label: '🧠 AI/ML Defense Strategy', icon: Cpu },
            { id: 'schema', label: '🗄️ Database & Schemas', icon: Database },
            { id: 'usp', label: '⚡ USP & Competitor Matrix', icon: Sparkles }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                    : 'glass-card-subtle text-slate-300 hover:text-white border border-white/10 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: 5-MINUTE PITCH SCRIPT */}
      {activeTab === 'pitch' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Step-by-Step Judge Presentation Walkthrough (300 Seconds)
              </h3>
              <span className="text-xs font-mono text-slate-400">Target Time: 5:00 Mins</span>
            </div>

            <div className="space-y-6">
              {[
                {
                  minute: '0:00 – 1:00',
                  title: 'The Dangerous Convergence (The Problem)',
                  spoken: `"Respected Judges, cybercriminals today no longer steal passwords—they steal whole personas. In 2024–2025 alone, voice clone impersonation attacks surged by 340%, with deepfaked CXOs authorizing multi-crore wire transfers. Current security is fatally siloed: banks have document OCR in branch KYC and voice screening in call centers, but NO unified system fuses both to stop coordinated multimodal impersonation attacks."`,
                  action: 'Show Hero Landing page & explain the Multimodal Equation formula.'
                },
                {
                  minute: '1:00 – 2:30',
                  title: 'Live Centerpiece Threat Demo (The Attack)',
                  spoken: `"Let me show you our centerpiece attack scenario: An attacker poses as Senior VP Rajesh Sharma, demanding an urgent ₹50 Lakh wire transfer after hours. They present a tampered Aadhaar badge with altered DOB font and use an ElevenLabs neural voice clone. Watch what happens when we verify:
                  1. Our Document ELA identifies the altered font bounding box (94% confidence).
                  2. Our Voice Spectrogram catches the 16kHz vocoder brick-wall cutoff and unnatural 0.14% pitch jitter.
                  3. TrustShield fuses these into a composite Trust Score of 18/100 and immediately BLOCKS the fraud!"`,
                  action: 'Click "View Live Threat Demo (₹50 Lakh Attack)" and walk through the 6-step wizard.'
                },
                {
                  minute: '2:30 – 3:45',
                  title: 'Enterprise SOC, Explainable AI & Policy Controls',
                  spoken: `"Security teams cannot trust a black box. TrustShield provides mathematical Explainable AI (XAI) breaking down risk attribution factors. Our SOC dashboard gives security officers live telemetry, threat vector breakdowns, and one-click incident quarantine with full chain-of-custody audit logs."`,
                  action: 'Switch to SOC Dashboard & Admin Policy Panel with DPDP Act compliance.'
                },
                {
                  minute: '3:45 – 5:00',
                  title: 'Privacy Compliance, Real-World Impact & Q&A',
                  spoken: `"Under India's DPDP Act 2023 and global GDPR, we enforce a strict Privacy-First principle: Analyze → Decide → Zero Raw Audio Storage. We never store raw voice recordings—only 512-dimension mathematical embeddings. TrustShield AI is ready for deployment across Banks, Airports, Border Checkpoints, and Telecom operators. Thank you!"`,
                  action: 'Open API Docs with Swagger sandbox & conclude.'
                }
              ].map((step, idx) => (
                <div key={idx} className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-300 glass-pill px-2.5 py-0.5 rounded-full border border-blue-500/30">
                      Phase {idx + 1}: {step.minute}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{step.title}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed italic glass-card-subtle p-3 rounded-xl border border-white/10">
                    {step.spoken}
                  </p>

                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <strong>Live Action: </strong> {step.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM ARCHITECTURE */}
      {activeTab === 'arch' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Layers className="w-4 h-4 text-blue-400" />
              Unified Multimodal Architecture Blueprint
            </h3>

            {/* Architecture Flow Diagram Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Layer 1: Ingress */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="font-mono text-blue-400 text-[10px] font-bold uppercase block">
                  LAYER 01: INGRESS & SENSORS
                </span>
                <h4 className="font-bold text-white">Input Channels</h4>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  <li>• High-res ID image upload / scan</li>
                  <li>• Live webcam selfie stream</li>
                  <li>• Real-time Web Audio API PCM mic</li>
                  <li>• Telephony SIP / RTP audio stream</li>
                  <li>• Circumstantial wire metadata</li>
                </ul>
              </div>

              {/* Layer 2: Forensic Preprocessing */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="font-mono text-cyan-400 text-[10px] font-bold uppercase block">
                  LAYER 02: FORENSIC EXTRACTION
                </span>
                <h4 className="font-bold text-white">Feature Pipelines</h4>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  <li>• OCR text + MRZ ICAO checksum</li>
                  <li>• Error Level Analysis (ELA) Matrix</li>
                  <li>• 68-point facial landmark grid</li>
                  <li>• Mel-spectrogram & FFT frequency bins</li>
                  <li>• Fundamental F0 jitter perturbation</li>
                </ul>
              </div>

              {/* Layer 3: AI Inference & Gemini */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="font-mono text-rose-400 text-[10px] font-bold uppercase block">
                  LAYER 03: AI INFERENCE & GEMINI
                </span>
                <h4 className="font-bold text-white">Cognitive Analysis</h4>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  <li>• Document tamper localization</li>
                  <li>• Neural vocoder artifact classification</li>
                  <li>• 4-Way Speaker Profile match</li>
                  <li>• Social engineering urgency index</li>
                  <li>• Server-side Gemini 2.5 flash reasoning</li>
                </ul>
              </div>

              {/* Layer 4: Multimodal Fusion & Response */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="font-mono text-emerald-400 text-[10px] font-bold uppercase block">
                  LAYER 04: TRUST FUSION & SOC
                </span>
                <h4 className="font-bold text-white">Decision Engine</h4>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  <li>• Weighted Trust Score (0-100)</li>
                  <li>• Mathematical XAI factor attribution</li>
                  <li>• Automated Triage (ALLOW / MFA / BLOCK)</li>
                  <li>• SHA-256 Audit Trail logging</li>
                  <li>• SOC live alerts & investigator queue</li>
                </ul>
              </div>
            </div>

            {/* Core Fusion Algorithm Formula Callout */}
            <div className="p-4 glass-card-subtle rounded-xl border border-blue-500/30 text-xs font-mono space-y-2">
              <span className="text-blue-300 font-bold block">
                COMPOSITE TRUST SCORE MATHEMATICAL MODEL
              </span>
              <p className="text-slate-200">
                <strong className="text-emerald-400">TrustScore (T)</strong> = (0.25 × DocAuth) + (0.20 × FaceSim) + (0.30 × VoiceAuth) + (0.25 × (100 - ContextRisk)) - Penalty(VocoderCutoff) - Penalty(TamperRegions)
              </p>
              <p className="text-slate-400 text-[11px]">
                Deterministic bounding ensures explainability and zero non-linear hallucination risks during automated financial clearances.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI/ML DEFENSE STRATEGY */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Cpu className="w-4 h-4 text-blue-400" />
              Advanced AI/ML Defense Methodologies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Voice Clone Defense */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="font-mono text-rose-400 text-[10px] font-bold uppercase">
                  1. NEURAL VOICE CLONE DETECTION
                </span>
                <h4 className="font-bold text-white">Acoustic & Vocoder Forensics</h4>
                <ul className="text-slate-300 space-y-1.5 text-[11px]">
                  <li>
                    <strong className="text-white">16kHz Vocoder Ceiling:</strong> Standard neural TTS models (ElevenLabs, Bark, Tortoise) produce hard harmonic roll-offs above 16.0 kHz due to discrete vocoder sampling rates (24kHz/32kHz).
                  </li>
                  <li>
                    <strong className="text-white">Pitch Monotony & Jitter:</strong> Biological human speech naturally fluctuates with 0.6%–1.2% jitter due to vocal fold laryngeal dynamics. Cloned voices exhibit unnatural micro-stability (&lt;0.2% jitter).
                  </li>
                  <li>
                    <strong className="text-white">Inter-word Impulse Silence:</strong> Synthetic audio often lacks ambient room impulse response during phonetic pauses.
                  </li>
                </ul>
              </div>

              {/* Document Forgery Defense */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="font-mono text-amber-400 text-[10px] font-bold uppercase">
                  2. DOCUMENT & IDENTITY FORGERY
                </span>
                <h4 className="font-bold text-white">Multi-Spectral Pixel & Font Forensics</h4>
                <ul className="text-slate-300 space-y-1.5 text-[11px]">
                  <li>
                    <strong className="text-white">Error Level Analysis (ELA):</strong> JPEG re-compression discrepancies between original document backdrop and digitally pasted text/photos show high error matrices.
                  </li>
                  <li>
                    <strong className="text-white">Font Anti-Aliasing Variance:</strong> Spliced dates or names have distinct sub-pixel anti-aliasing edges differing from native template typography.
                  </li>
                  <li>
                    <strong className="text-white">MRZ ICAO 9303 Checksum:</strong> Modulo-7 & Modulo-10 checksum validation across passport number, birth date, and expiration fields.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE SCHEMAS */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Database className="w-4 h-4 text-blue-400" />
              Complete Production Schema Blueprint
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-blue-400 font-bold">1. SecurityCase Table</span>
                <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`CREATE TABLE security_cases (
  id UUID PRIMARY KEY,
  case_number VARCHAR(32) UNIQUE,
  subject_name VARCHAR(128) NOT NULL,
  claimed_identity VARCHAR(128),
  status VARCHAR(32) NOT NULL, -- VERIFIED | REVIEW | BLOCKED
  identity_trust_score INT NOT NULL,
  risk_level VARCHAR(16) NOT NULL,
  primary_summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sha256_audit_hash VARCHAR(64) NOT NULL
);`}
                </pre>
              </div>

              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-cyan-400 font-bold">2. EnrolledSpeakerProfile Table</span>
                <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`CREATE TABLE enrolled_speaker_profiles (
  speaker_id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(128) NOT NULL,
  role_title VARCHAR(128) NOT NULL,
  embedding_vector_512 bytea NOT NULL, -- Zero raw audio
  baseline_pitch_f0_hz FLOAT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USP & COMPETITIVE DIFFERENTIATION */}
      {activeTab === 'usp' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              USP & Competitive Differentiation Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="glass-card text-slate-200 font-mono border-b border-white/10">
                    <th className="p-3">Feature Capability</th>
                    <th className="p-3 text-blue-300 font-bold glass-card-accent">TrustShield AI (Ours)</th>
                    <th className="p-3 text-slate-400">Legacy KYC (Sumsub/Onfido)</th>
                    <th className="p-3 text-slate-400">Voice-Only (Pindrop)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="glass-card-subtle">
                    <td className="p-3 font-semibold text-white">Multimodal Fusion (Doc + Voice + AML)</td>
                    <td className="p-3 text-emerald-400 font-bold glass-card-accent">✅ Real-Time Composite Score</td>
                    <td className="p-3 text-rose-400">❌ Siloed (Doc Only)</td>
                    <td className="p-3 text-rose-400">❌ Siloed (Voice Only)</td>
                  </tr>
                  <tr className="glass-card-subtle">
                    <td className="p-3 font-semibold text-white">16kHz Neural Vocoder Cutoff Analysis</td>
                    <td className="p-3 text-emerald-400 font-bold glass-card-accent">✅ Live Sub-Band FFT Inspector</td>
                    <td className="p-3 text-rose-400">❌ No Voice Analysis</td>
                    <td className="p-3 text-amber-400">⚠️ Proprietary / No XAI</td>
                  </tr>
                  <tr className="glass-card-subtle">
                    <td className="p-3 font-semibold text-white">4-Way Speaker Profile Consistency</td>
                    <td className="p-3 text-emerald-400 font-bold glass-card-accent">✅ Distinguishes AI Clone vs VIP</td>
                    <td className="p-3 text-rose-400">❌ No</td>
                    <td className="p-3 text-amber-400">⚠️ Basic 1:1 Match</td>
                  </tr>
                  <tr className="glass-card-subtle">
                    <td className="p-3 font-semibold text-white">Explainable AI (XAI) Attribution</td>
                    <td className="p-3 text-emerald-400 font-bold glass-card-accent">✅ Mathematical Factor Weights</td>
                    <td className="p-3 text-amber-400">⚠️ Basic Flags Only</td>
                    <td className="p-3 text-rose-400">❌ Black-box risk rating</td>
                  </tr>
                  <tr className="glass-card-subtle">
                    <td className="p-3 font-semibold text-white">Privacy-First Architecture (DPDP Act)</td>
                    <td className="p-3 text-emerald-400 font-bold glass-card-accent">✅ Zero Raw Audio Retention</td>
                    <td className="p-3 text-amber-400">⚠️ Cloud storage reliant</td>
                    <td className="p-3 text-amber-400">⚠️ Cloud storage reliant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
