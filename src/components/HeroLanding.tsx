import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  UserCheck,
  Mic,
  BrainCircuit,
  Zap,
  ArrowRight,
  Lock,
  Building2,
  Plane,
  Landmark,
  PhoneCall,
  Server,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { Language, SocMetricStats } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface HeroLandingProps {
  language: Language;
  stats: SocMetricStats;
  onLaunchDemo: (scenarioType: 'ATTACK_VP' | 'CLEAN_KYC' | 'FORGED_DOC') => void;
  onStartCustomVerification: () => void;
  onOpenJudgePitch: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  language,
  stats,
  onLaunchDemo,
  onStartCustomVerification,
  onOpenJudgePitch
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header Section */}
      <section className="relative pt-6 overflow-hidden">
        {/* Ambient background glow for Frosted Glass */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono text-blue-300 shadow-xl border border-white/10">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
            <span>AI-POWERED MULTIMODAL IMPERSONATION DEFENSE LAYER</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            {language === 'hi' ? (
              <>
                हर पहचान पर <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">विश्वास</span>। हर स्वांग की <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">तत्काल पहचान</span>।
              </>
            ) : (
              <>
                Trust Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Identity</span>. Detect Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Impersonation</span>.
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.subheadline}
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              id="hero-start-verify-btn"
              type="button"
              onClick={onStartCustomVerification}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-blue-400/40"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              {t.startVerification}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-view-demo-btn"
              type="button"
              onClick={() => onLaunchDemo('ATTACK_VP')}
              className="px-6 py-3.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-500/50 font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.25)] flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
            >
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              {t.viewLiveThreatDemo} (₹50 Lakh Attack)
            </button>

            <button
              id="hero-judge-hub-btn"
              type="button"
              onClick={onOpenJudgePitch}
              className="px-5 py-3.5 glass-pill hover:bg-slate-800/80 text-slate-200 border border-white/10 font-semibold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              {t.judgeHub}
            </button>
          </div>
        </div>
      </section>

      {/* CORE INNOVATION: The Multimodal Identity Trust Equation */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              The Multimodal Trust Fusion Engine
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Unifying 4 Disparate Threat Surfaces Into One Explainable Trust Score
            </h2>
          </div>
          <span className="hidden sm:inline-flex bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono px-3 py-1 rounded-full">
            Continuous Fusion Pipeline
          </span>
        </div>

        {/* 4 Pillars Grid with Operator Symbols */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Pillar 1: Document */}
          <div className="glass-card-subtle p-4 rounded-xl border border-white/5 relative group hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20 shadow-[0_0_12px_rgba(37,99,235,0.2)]">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Pillar 01 (25%)</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Document Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              OCR, MRZ checksum, Error Level Analysis (ELA), & font/photo splicing heatmap.
            </p>
          </div>

          {/* Pillar 2: Face */}
          <div className="glass-card-subtle p-4 rounded-xl border border-white/5 relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Pillar 02 (20%)</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Biometric Face Match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              68-point facial landmark distance & live camera anti-spoofing liveness.
            </p>
          </div>

          {/* Pillar 3: Voice */}
          <div className="glass-card-subtle p-4 rounded-xl border border-white/5 relative group hover:border-rose-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Pillar 03 (30%)</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Voice Clone Defense</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Neural vocoder 16kHz spectral cutoff, pitch jitter perturbation & speaker consistency.
            </p>
          </div>

          {/* Pillar 4: Context */}
          <div className="glass-card-subtle p-4 rounded-xl border border-white/5 relative group hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Pillar 04 (25%)</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Contextual Fraud Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wire amount (e.g. ₹50L), VOIP caller ID spoofing, urgency heuristics & IP routing.
            </p>
          </div>
        </div>

        {/* The Resulting Output Banner */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card-subtle p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">GENUINE VERIFICATION SCENARIO</span>
              <p className="text-xs text-slate-300">Clean passport + genuine live face + authentic voice resonance</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-emerald-400">87–96</span>
              <span className="text-[10px] font-mono text-emerald-300 block">LOW RISK / ALLOW</span>
            </div>
          </div>

          <div className="glass-card-danger p-4 rounded-xl border border-rose-500/40 flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">MULTIMODAL IMPERSONATION ATTACK</span>
              <p className="text-xs text-slate-300">AI cloned voice + spliced ID badge + ₹50L urgent wire demand</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-rose-400">18–24</span>
              <span className="text-[10px] font-mono text-rose-300 block font-semibold">CRITICAL / BLOCKED</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Interactive Hackathon Demo Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Interactive Hackathon Scenarios
            </h3>
            <p className="text-xs text-slate-400">1-click automated execution of realistic cybersecurity threat tests</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Instant Forensic Evaluation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Centerpiece Threat */}
          <div className="glass-card border-2 border-rose-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl shadow-rose-950/30 relative">
            <div className="absolute top-3 right-3 bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
              CENTERPIECE DEMO
            </div>
            <div>
              <span className="text-xs font-mono text-rose-400 font-semibold uppercase block mb-1">
                Scenario 01: Executive Wire Fraud
              </span>
              <h4 className="text-sm font-bold text-white">
                VP Rajesh Sharma AI Voice Clone & ₹50L Wire Attack
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Attacker presents tampered Aadhaar badge with altered DOB font and uses ElevenLabs neural voice clone requesting urgent ₹50,00,000 wire after hours.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-[11px] font-mono text-rose-400 font-bold">
                Trust Score: ~18/100
              </div>
              <button
                type="button"
                onClick={() => onLaunchDemo('ATTACK_VP')}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              >
                Run Threat Test <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Clean KYC */}
          <div className="glass-card hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase block mb-1">
                Scenario 02: Clean Multimodal KYC
              </span>
              <h4 className="text-sm font-bold text-white">
                Priya Sundaram — Authentic Passport & Natural Speech
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Genuine ICAO 9303 Republic of India passport with validated MRZ checksum, 96% face match, and organic human vocal tract resonance.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                Trust Score: ~95/100
              </div>
              <button
                type="button"
                onClick={() => onLaunchDemo('CLEAN_KYC')}
                className="px-3.5 py-1.5 glass-pill hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                Run Clean Test <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Document Forged */}
          <div className="glass-card hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all">
            <div>
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase block mb-1">
                Scenario 03: Spliced Document
              </span>
              <h4 className="text-sm font-bold text-white">
                Amit Verma — Expired & Digitally Altered License
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Driving license with modified expiry date stamp in loan application; genuine human voice but document integrity score critically low.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-[11px] font-mono text-amber-400 font-bold">
                Trust Score: ~38/100
              </div>
              <button
                type="button"
                onClick={() => onLaunchDemo('FORGED_DOC')}
                className="px-3.5 py-1.5 glass-pill hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                Run Tamper Test <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Target Deployment Sectors */}
      <section className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h3 className="text-sm font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Critical Enterprise & Government Deployment
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Engineered for high-throughput, low-latency identity screening ecosystems
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Banks & RTGS', desc: 'High-Value Wire Approvals', icon: Landmark },
            { label: 'Border Security', desc: 'Airports & Checkpoints', icon: Plane },
            { label: 'Telecom Operators', desc: 'SIM Swap & Voice KYC', icon: PhoneCall },
            { label: 'Government Portals', desc: 'Citizen ID & Permits', icon: Building2 },
            { label: 'Call Centers', desc: 'Voice Spoof Interception', icon: Server },
            { label: 'VIP Executive Desks', desc: 'CXO Impersonation Guard', icon: Lock }
          ].map((sec, i) => {
            const Icon = sec.icon;
            return (
              <div key={i} className="glass-card-subtle p-3.5 rounded-xl border border-white/5 text-center space-y-2 hover:border-white/20 transition-all">
                <div className="w-8 h-8 mx-auto rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-200">{sec.label}</h4>
                <p className="text-[10px] text-slate-400">{sec.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
