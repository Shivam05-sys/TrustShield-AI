import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  FileText,
  Settings,
  Code2,
  Bell,
  Globe,
  UserCheck,
  Award,
  ChevronDown,
  AlertTriangle,
  Radio,
  Lock,
  FileSearch,
  CheckCircle2,
  Check,
  User
} from 'lucide-react';
import { UserRole, Language, LiveAlert } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  alerts: LiveAlert[];
  onSelectCaseFromAlert?: (caseId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  language,
  setLanguage,
  alerts,
  onSelectCaseFromAlert
}) => {
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const alertDropdownRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];
  const unreadAlerts = alerts.filter(a => !a.read);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (alertDropdownRef.current && !alertDropdownRef.current.contains(event.target as Node)) {
        setShowAlertDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'overview', label: language === 'hi' ? 'अवलोकन' : 'Overview', icon: ShieldCheck },
    { id: 'verify', label: language === 'hi' ? 'नया सत्यापन' : 'New Verification', icon: Radio },
    { id: 'soc', label: language === 'hi' ? 'SOC डैशबोर्ड' : 'SOC Dashboard', icon: Activity },
    { id: 'cases', label: language === 'hi' ? 'केस फाइल्स' : 'Case Files', icon: FileText, badge: '3' },
    { id: 'api-docs', label: language === 'hi' ? 'API दस्तावेज' : 'API Docs', icon: Code2 },
    { id: 'admin', label: language === 'hi' ? 'नीति एवं व्यवस्थापक' : 'Policy & Admin', icon: Settings },
    { id: 'judge-hub', label: language === 'hi' ? '🏆 जज हब व पिच' : '🏆 Judge Pitch & Arch', icon: Award }
  ];

  const roleConfigs: Record<UserRole, {
    label: string;
    sub: string;
    icon: typeof ShieldCheck;
    color: string;
    badgeBg: string;
    privilege: string;
  }> = {
    security_officer: {
      label: 'Security Officer',
      sub: 'Checkpoint & Border Triage',
      icon: ShieldCheck,
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      privilege: 'Live Face & Document Scanning, Instant Flagging'
    },
    bank_operator: {
      label: 'Bank / Wire Operator',
      sub: 'High-Value RTGS Clearance',
      icon: Lock,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      privilege: 'Dual-Control Wire Authorizations & Out-of-Band Calls'
    },
    investigator: {
      label: 'Forensic Investigator',
      sub: 'Deep Dossier & Tamper Audit',
      icon: FileSearch,
      color: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      privilege: 'Digital Signed PDF Exports, Multi-Spectral ELA'
    },
    admin: {
      label: 'Security Admin',
      sub: 'Policy & Policy Engines',
      icon: Settings,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      privilege: 'Biometric Threshold Config & Global Risk Engine'
    }
  };

  const activeRoleConfig = roleConfigs[currentRole];
  const ActiveRoleIcon = activeRoleConfig.icon;

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-white/10">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-[#020617]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white uppercase font-sans">
                  TrustShield <span className="text-blue-400">AI</span>
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
                  v2.4 SOC
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-sans block leading-none">
                MULTIMODAL IDENTITY LAYER
              </span>
            </div>
          </div>

          {/* Center Nav Navigation */}
          <nav className="hidden lg:flex items-center gap-1 glass-pill p-1 rounded-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                  {item.badge && (
                    <span className="bg-rose-500/30 text-rose-300 text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-rose-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Threat Status, Language, Role Switcher, Notifications */}
          <div className="flex items-center gap-2">
            {/* Live Threat Badge */}
            <div className="hidden xl:flex items-center gap-1.5 bg-rose-950/30 border border-rose-500/30 text-rose-300 text-[11px] font-mono px-2.5 py-1 rounded-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <span className="font-semibold">{t.liveThreatLevel}</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center glass-pill rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-[11px] font-mono rounded-md transition-all cursor-pointer ${
                  language === 'en' ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-[11px] font-mono rounded-md transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                HI
              </button>
            </div>

            {/* Redesigned Operation Role Switcher UI */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 glass-pill hover:bg-slate-800/80 text-xs text-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-white/10 shadow-sm"
              >
                <div className="w-5 h-5 rounded-lg bg-slate-900 flex items-center justify-center border border-white/10">
                  <ActiveRoleIcon className={`w-3.5 h-3.5 ${activeRoleConfig.color}`} />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-semibold text-slate-100 leading-tight">
                    {activeRoleConfig.label}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 leading-none">
                    RBAC ACTIVE
                  </div>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl p-3.5 z-50 space-y-2 border border-white/15 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                        Select Operation Role (RBAC)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      4 Roles
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {(Object.keys(roleConfigs) as UserRole[]).map((roleKey) => {
                      const cfg = roleConfigs[roleKey];
                      const Icon = cfg.icon;
                      const isSelected = currentRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => {
                            setCurrentRole(roleKey);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-blue-600/90 text-white font-semibold shadow-lg shadow-blue-950/50 border-blue-400/40'
                              : 'glass-card-subtle text-slate-300 hover:bg-slate-800/80 border-white/5'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-900 border border-white/10 ' + cfg.color
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-white truncate">{cfg.label}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                              )}
                            </div>
                            <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {cfg.sub}
                            </div>
                            <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                              ✦ {cfg.privilege}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={alertDropdownRef}>
              <button
                type="button"
                onClick={() => setShowAlertDropdown(!showAlertDropdown)}
                className="relative p-2 glass-pill hover:bg-slate-800/60 rounded-xl text-slate-300 transition-colors cursor-pointer border border-white/10"
              >
                <Bell className="w-4 h-4" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_#ef4444] animate-bounce">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {showAlertDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl p-3.5 z-50 space-y-2.5 border border-white/15">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Live Threat Alerts ({alerts.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Real-time Stream</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          if (onSelectCaseFromAlert) onSelectCaseFromAlert(alert.caseId);
                          setShowAlertDropdown(false);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          alert.level === 'CRITICAL'
                            ? 'glass-card-danger text-slate-200 hover:border-rose-500/50'
                            : alert.level === 'HIGH'
                            ? 'bg-amber-950/30 border border-amber-500/20 text-slate-200 hover:border-amber-500/50 backdrop-blur-md'
                            : 'glass-card-subtle text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            alert.level === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : alert.level === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            [{alert.level}] {alert.caseId}
                          </span>
                          <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                        </div>
                        <p className="font-medium text-slate-200 text-xs leading-snug">{alert.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-white/5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive ? 'bg-blue-600 text-white font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'text-slate-400 glass-pill'
                }`}
              >
                <Icon className="w-3 h-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
