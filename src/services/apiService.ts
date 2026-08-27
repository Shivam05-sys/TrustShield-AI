import {
  MultimodalIdentityResult,
  SecurityCase,
  SocMetricStats,
  LiveAlert,
  SystemPolicySettings,
  DocumentInfo,
  DocumentTamperingAnalysis,
  FaceVerificationResult,
  VoiceAnalysisResult,
  SpeakerConsistencyResult,
  ContextualFraudData
} from '../types';

export const ApiService = {
  async getSocStats(): Promise<SocMetricStats> {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch SOC stats');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local SOC stats:', err);
      const { MOCK_SOC_STATS } = await import('../data/mockData');
      return MOCK_SOC_STATS;
    }
  },

  async getCases(): Promise<SecurityCase[]> {
    try {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local cases:', err);
      const { DEMO_SECURITY_CASES } = await import('../data/mockData');
      return DEMO_SECURITY_CASES;
    }
  },

  async getCaseById(id: string): Promise<SecurityCase | null> {
    try {
      const res = await fetch(`/api/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local case lookup:', err);
      const { DEMO_SECURITY_CASES } = await import('../data/mockData');
      return DEMO_SECURITY_CASES.find(c => c.id === id || c.caseNumber === id) || null;
    }
  },

  async updateCaseAction(id: string, status: string, noteText?: string, officer?: string): Promise<SecurityCase> {
    try {
      const res = await fetch(`/api/cases/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, noteText, officer })
      });
      if (!res.ok) throw new Error('Failed to update case');
      return await res.json();
    } catch (err) {
      console.warn('Local update fallback:', err);
      const { DEMO_SECURITY_CASES } = await import('../data/mockData');
      const found = DEMO_SECURITY_CASES.find(c => c.id === id || c.caseNumber === id);
      if (found) {
        found.status = status as SecurityCase['status'];
        if (noteText) {
          found.notes.push({
            author: officer || 'Security Operator',
            timestamp: new Date().toLocaleTimeString() + ' IST',
            text: noteText
          });
        }
        return found;
      }
      throw err;
    }
  },

  async getAlerts(): Promise<LiveAlert[]> {
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return await res.json();
    } catch (err) {
      const { MOCK_LIVE_ALERTS } = await import('../data/mockData');
      return MOCK_LIVE_ALERTS;
    }
  },

  async analyzeDocument(params: {
    documentType?: string;
    documentNumber?: string;
    fullName?: string;
    base64Image?: string;
    sampleId?: string;
  }): Promise<{ documentInfo: DocumentInfo; tamperingAnalysis: DocumentTamperingAnalysis }> {
    try {
      const res = await fetch('/api/document/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Document analysis failed');
      return await res.json();
    } catch (err) {
      console.warn('Document analysis fallback:', err);
      const { SAMPLE_DOCUMENTS } = await import('../data/mockData');
      const sample = SAMPLE_DOCUMENTS.find(d => d.id === params.sampleId) || SAMPLE_DOCUMENTS[0];
      return {
        documentInfo: sample,
        tamperingAnalysis: sample.tampering
      };
    }
  },

  async computeMultimodalTrust(payload: {
    documentTampering: DocumentTamperingAnalysis;
    documentInfo: DocumentInfo;
    faceMatch: FaceVerificationResult;
    voiceAnalysis: VoiceAnalysisResult;
    speakerConsistency: SpeakerConsistencyResult;
    contextData: ContextualFraudData;
  }): Promise<MultimodalIdentityResult> {
    try {
      const res = await fetch('/api/verify/multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Multimodal verification failed');
      return await res.json();
    } catch (err) {
      console.warn('Multimodal engine local fallback calculation:', err);
      const { DEMO_SECURITY_CASES } = await import('../data/mockData');
      return DEMO_SECURITY_CASES[0].multimodalResult;
    }
  },

  async getPolicy(): Promise<SystemPolicySettings> {
    try {
      const res = await fetch('/api/policy');
      if (!res.ok) throw new Error('Failed to fetch policy');
      return await res.json();
    } catch (err) {
      const { DEFAULT_POLICY_SETTINGS } = await import('../data/mockData');
      return DEFAULT_POLICY_SETTINGS;
    }
  },

  async updatePolicy(policy: Partial<SystemPolicySettings>): Promise<SystemPolicySettings> {
    try {
      const res = await fetch('/api/policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy)
      });
      if (!res.ok) throw new Error('Failed to update policy');
      const data = await res.json();
      return data.updatedPolicy;
    } catch (err) {
      const { DEFAULT_POLICY_SETTINGS } = await import('../data/mockData');
      return { ...DEFAULT_POLICY_SETTINGS, ...policy };
    }
  }
};
