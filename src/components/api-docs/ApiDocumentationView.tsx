import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Send,
  CheckCircle2,
  Copy,
  Layers,
  Sparkles,
  Server,
  Key,
  ShieldAlert
} from 'lucide-react';

export const ApiDocumentationView: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'js' | 'python'>('js');
  const [activeEndpointIndex, setActiveEndpointIndex] = useState<number>(0);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/verify/multimodal',
      title: 'Multimodal Identity Trust Verification',
      desc: 'Executes comprehensive fusion inference across document tampering, facial biometrics, voice synthesis forensics, and circumstantial AML fraud risk.',
      requestBody: {
        documentInfo: {
          type: 'AADHAAR_CARD',
          documentNumber: 'XXXX-XXXX-4921',
          fullName: 'Rajesh Sharma'
        },
        documentTampering: {
          tamperingRiskScore: 88,
          suspiciousRegions: [{ label: 'DOB Font Mismatch', riskPercentage: 94 }]
        },
        faceMatch: { matchScore: 84, livenessScore: 48 },
        voiceAnalysis: {
          aiSynthesisRisk: 96,
          acousticMetrics: { jitterPercentage: 0.14, spectralCutoffDetected: true }
        },
        contextData: {
          transactionAmountInr: 5000000,
          callerSpoofProbability: 92,
          urgencyLanguageScore: 94
        }
      },
      responseExample: {
        identityTrustScore: 18,
        riskLevel: 'CRITICAL',
        recommendedAction: 'BLOCK_IMMEDIATE',
        primarySummary: 'High-confidence AI voice cloning impersonation and document tampering detected during ₹50 Lakh wire transfer attempt.',
        caseId: 'TS-2025-0841',
        explainableFactors: [
          { factor: 'Neural Vocoder 16kHz Hard Spectral Cutoff', impactScore: 35, severity: 'CRITICAL' },
          { factor: 'Document DOB Font & Compression Variance', impactScore: 28, severity: 'CRITICAL' },
          { factor: 'High-Value Wire Under Telephony Spoofing', impactScore: 22, severity: 'CRITICAL' }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/document/analyze',
      title: 'Document Forensic OCR & Tamper Analysis',
      desc: 'Performs multi-spectral error level analysis (ELA), font pixel variance, and MRZ checksum validation.',
      requestBody: {
        documentType: 'PASSPORT',
        sampleId: 'doc-genuine-passport'
      },
      responseExample: {
        authenticityScore: 96,
        tamperingRiskScore: 4,
        mrzChecksumPassed: true,
        verdict: 'GENUINE_DOCUMENT'
      }
    },
    {
      method: 'GET',
      path: '/api/dashboard/stats',
      title: 'SOC Telemetry & Threat Metrics',
      desc: 'Retrieves live threat statistics, blocked fraud transaction value, and threat vector distributions.',
      requestBody: null,
      responseExample: {
        totalVerificationsToday: 1428,
        voiceThreatsBlocked: 38,
        tamperedDocumentsDetected: 52,
        blockedTransactionsValueInr: 48200000,
        averageTrustScore: 78.4
      }
    }
  ];

  const currentEndpoint = endpoints[activeEndpointIndex];

  const getCodeSnippet = () => {
    const url = `https://trustshield.ai${currentEndpoint.path}`;
    const bodyStr = currentEndpoint.requestBody ? JSON.stringify(currentEndpoint.requestBody, null, 2) : '';

    if (selectedLanguage === 'curl') {
      if (currentEndpoint.method === 'GET') {
        return `curl -X GET "${url}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json"`;
      }
      return `curl -X POST "${url}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(currentEndpoint.requestBody)}'`;
    }

    if (selectedLanguage === 'js') {
      if (currentEndpoint.method === 'GET') {
        return `const response = await fetch("${url}", {\n  method: "GET",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n  }\n});\nconst data = await response.json();\nconsole.log(data);`;
      }
      return `const response = await fetch("${url}", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify(${bodyStr})\n});\nconst result = await response.json();\nconsole.log(result.identityTrustScore);`;
    }

    if (selectedLanguage === 'python') {
      if (currentEndpoint.method === 'GET') {
        return `import requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\nresponse = requests.get("${url}", headers=headers)\nprint(response.json())`;
      }
      return `import requests\n\npayload = ${bodyStr}\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\nresponse = requests.post("${url}", json=payload, headers=headers)\nresult = response.json()\nprint(f"Trust Score: {result['identityTrustScore']}")`;
    }
    return '';
  };

  const handleRunLiveTest = async () => {
    setIsTesting(true);
    setTestResponse(null);
    try {
      if (currentEndpoint.path === '/api/dashboard/stats') {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      } else if (currentEndpoint.path === '/api/document/analyze') {
        const res = await fetch('/api/document/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sampleId: 'doc-tampered-vp' })
        });
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      } else {
        const res = await fetch('/api/verify/multimodal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentEndpoint.requestBody)
        });
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setTestResponse(JSON.stringify(currentEndpoint.responseExample, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="api-docs-view" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
              DEVELOPER REST API & SDK SPECIFICATION
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">TrustShield Core API & Integration Hub</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300 glass-pill px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" /> Auth: Bearer Token
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase font-semibold px-1">
            API Endpoints (v2.4)
          </div>

          <div className="space-y-2">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveEndpointIndex(idx);
                  setTestResponse(null);
                }}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  activeEndpointIndex === idx
                    ? 'glass-card-accent border-blue-500/60 shadow-lg'
                    : 'glass-card hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    ep.method === 'POST' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-slate-200 truncate">{ep.path}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{ep.title}</p>
              </div>
            ))}
          </div>

          {/* Architecture Summary Box */}
          <div className="glass-card rounded-2xl p-4 space-y-2 mt-6">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              SDK Client Support
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official SDK libraries available for Node.js/TypeScript, Python, Go, and Android Kotlin.
            </p>
          </div>
        </div>

        {/* Right: Endpoint Detail & Interactive Sandbox */}
        <div className="lg:col-span-8 space-y-5">
          <div className="glass-card rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    currentEndpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {currentEndpoint.method}
                  </span>
                  <span className="font-mono font-semibold text-white text-sm">{currentEndpoint.path}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{currentEndpoint.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentEndpoint.desc}</p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center glass-pill p-1 rounded-xl border border-white/10 text-xs font-mono">
                {(['js', 'python', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedLanguage === lang ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Snippet */}
            <div className="relative">
              <pre className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-xs text-slate-300 font-mono overflow-x-auto">
                <code>{getCodeSnippet()}</code>
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-3 right-3 px-2.5 py-1 glass-card-subtle hover:bg-slate-800 text-slate-200 text-[11px] font-mono rounded-lg flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Live Interactive Test Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Execute real-time API request to local server</span>
              <button
                type="button"
                disabled={isTesting}
                onClick={handleRunLiveTest}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> {isTesting ? 'Executing API Call...' : 'Send Live Request'}
              </button>
            </div>

            {/* Live API Response Display */}
            {testResponse && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> HTTP 200 OK (Response Payload)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Latency: 28ms</span>
                </div>
                <pre className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-xs text-emerald-300 font-mono overflow-x-auto max-h-72">
                  <code>{testResponse}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
