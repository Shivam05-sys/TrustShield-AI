import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  FileText,
  Settings,
  Code2,
  Award,
  Radio,
  Lock,
  Globe,
  Zap,
  Server
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { VerificationWizard } from './components/verification/VerificationWizard';
import { SocDashboard } from './components/soc/SocDashboard';
import { CaseInvestigationView } from './components/cases/CaseInvestigationView';
import { AdminPolicyPanel } from './components/admin/AdminPolicyPanel';
import { ApiDocumentationView } from './components/api-docs/ApiDocumentationView';
import { HackathonJudgeHub } from './components/hackathon/HackathonJudgeHub';
import {
  UserRole,
  Language,
  SocMetricStats,
  LiveAlert,
  SecurityCase,
  SystemPolicySettings,
  MultimodalIdentityResult
} from './types';
import { ApiService } from './services/apiService';
import { MOCK_SOC_STATS, MOCK_LIVE_ALERTS, DEMO_SECURITY_CASES, DEFAULT_POLICY_SETTINGS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('security_officer');
  const [language, setLanguage] = useState<Language>('en');

  // Core Data States
  const [socStats, setSocStats] = useState<SocMetricStats>(MOCK_SOC_STATS);
  const [alerts, setAlerts] = useState<LiveAlert[]>(MOCK_LIVE_ALERTS);
  const [cases, setCases] = useState<SecurityCase[]>(DEMO_SECURITY_CASES);
  const [policy, setPolicy] = useState<SystemPolicySettings>(DEFAULT_POLICY_SETTINGS);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Active Wizard Scenario Preset
  const [presetScenario, setPresetScenario] = useState<'ATTACK_VP' | 'CLEAN_KYC' | 'FORGED_DOC' | null>(null);

  // Load initial data from backend API
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [statsData, casesData, alertsData, policyData] = await Promise.all([
          ApiService.getSocStats(),
          ApiService.getCases(),
          ApiService.getAlerts(),
          ApiService.getPolicy()
        ]);
        setSocStats(statsData);
        setCases(casesData);
        setAlerts(alertsData);
        setPolicy(policyData);
      } catch (err) {
        console.warn('Using local demo state fallback:', err);
      }
    }
    loadInitialData();
  }, []);

  // Handler to trigger Hackathon Demo scenarios from Hero Landing
  const handleLaunchDemoScenario = (scenarioType: 'ATTACK_VP' | 'CLEAN_KYC' | 'FORGED_DOC') => {
    setPresetScenario(scenarioType);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCustomVerification = () => {
    setPresetScenario(null);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCaseFromAlertOrDashboard = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('cases');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewCaseGenerated = (result: MultimodalIdentityResult) => {
    // Add to cases
    const newCase: SecurityCase = {
      id: `case-${Date.now()}`,
      caseNumber: result.caseId,
      timestamp: new Date().toLocaleTimeString() + ' IST',
      subjectName: result.documentInfo?.fullName || 'Screened Subject',
      claimedIdentity: `${result.documentInfo?.fullName || 'Subject'} (${result.documentInfo?.type || 'ID'})`,
      scenario: result.primarySummary,
      riskLevel: result.riskLevel,
      identityTrustScore: result.identityTrustScore,
      status: result.riskLevel === 'CRITICAL' ? 'BLOCKED_FRAUD' : result.riskLevel === 'HIGH' ? 'REQUIRES_CALLBACK' : 'VERIFIED_GENUINE',
      assignedOfficer: 'Officer (Security Operations)',
      multimodalResult: result,
      notes: [
        {
          author: 'Automated Multimodal Policy Engine',
          timestamp: new Date().toLocaleTimeString() + ' IST',
          text: `Automated triage assigned score ${result.identityTrustScore}/100. Action: ${result.recommendedAction}`
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);

    // Update stats
    setSocStats(prev => ({
      ...prev,
      totalVerificationsToday: prev.totalVerificationsToday + 1,
      voiceThreatsBlocked: result.voiceAnalysis.aiSynthesisRisk > 50 ? prev.voiceThreatsBlocked + 1 : prev.voiceThreatsBlocked,
      tamperedDocumentsDetected: result.documentAnalysis.tamperingRiskScore > 50 ? prev.tamperedDocumentsDetected + 1 : prev.tamperedDocumentsDetected
    }));
  };

  const handleCaseUpdated = (updatedCase: SecurityCase) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  return (
    <div className="min-h-screen mesh-bg text-slate-200 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Ambient background glow orbs for Frosted Glass refraction */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-rose-600/5 blur-[120px] pointer-events-none -z-10" />

      <div>
        {/* Top SOC Navbar with Frosted Glass */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          language={language}
          setLanguage={setLanguage}
          alerts={alerts}
          onSelectCaseFromAlert={handleOpenCaseFromAlertOrDashboard}
        />

        {/* Main Application Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          {activeTab === 'overview' && (
            <HeroLanding
              language={language}
              stats={socStats}
              onLaunchDemo={handleLaunchDemoScenario}
              onStartCustomVerification={handleStartCustomVerification}
              onOpenJudgePitch={() => setActiveTab('judge-hub')}
            />
          )}

          {activeTab === 'verify' && (
            <VerificationWizard
              language={language}
              presetScenario={presetScenario}
              onCaseGenerated={handleNewCaseGenerated}
            />
          )}

          {activeTab === 'soc' && (
            <SocDashboard
              stats={socStats}
              alerts={alerts}
              cases={cases}
              onOpenCase={handleOpenCaseFromAlertOrDashboard}
            />
          )}

          {activeTab === 'cases' && (
            <CaseInvestigationView
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectCase={setSelectedCaseId}
              userRole={currentRole}
              onCaseUpdated={handleCaseUpdated}
            />
          )}

          {activeTab === 'api-docs' && (
            <ApiDocumentationView />
          )}

          {activeTab === 'admin' && (
            <AdminPolicyPanel
              policy={policy}
              onPolicyUpdated={setPolicy}
            />
          )}

          {activeTab === 'judge-hub' && (
            <HackathonJudgeHub />
          )}
        </main>
      </div>

      {/* Global Enterprise SOC Footer with Frosted Glass */}
      <footer className="glass-header py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="text-white font-bold tracking-tight">TRUSTSHIELD AI</span>
            <span className="text-slate-500">• Multimodal Impersonation & Identity Verification Layer</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Lock className="w-3 h-3" /> DPDP Act (India) Compliant
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Zero Raw Audio Retention</span>
            <span className="text-slate-700">|</span>
            <span className="text-indigo-400">SHA-256 Audit Trail</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
