export type UserRole = 'security_officer' | 'bank_operator' | 'investigator' | 'admin';

export type Language = 'en' | 'hi';

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationStatus = 'ALLOW' | 'STEP_UP_MFA' | 'VERIFIED_CALLBACK' | 'SECONDARY_REVIEW' | 'BLOCK_IMMEDIATE';

export interface DocumentInfo {
  id: string;
  type: 'PASSPORT' | 'NATIONAL_ID' | 'DRIVING_LICENSE' | 'VISA' | 'GOVT_PERMIT';
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  issueDate: string;
  expiryDate: string;
  mrzCode?: string;
  mrzValid?: boolean;
  visaType?: string;
  entryValidity?: string;
  stayDuration?: string;
  documentImageUrl: string;
  extractedPhotoUrl: string;
  issuingAuthority: string;
  ocrConfidence: number;
  extractedFields: Record<string, string>;
  validationFlags: {
    formatValid: boolean;
    isExpired: boolean;
    dateLogicalConsistency: boolean;
    mrzChecksumPassed: boolean;
    suspiciousFontDetected: boolean;
  };
}

export interface TamperingRegion {
  id: string;
  label: string;
  box: [number, number, number, number]; // [x%, y%, width%, height%]
  riskPercentage: number;
  anomalyType: 'PHOTO_REPLACEMENT' | 'TEXT_MODIFICATION' | 'FONT_INCONSISTENCY' | 'COPY_PASTE_SPLICING' | 'COMPRESSION_ARTIFACT' | 'STAMP_MANIPULATION';
  description: string;
  pixelVariance: number;
}

export interface DocumentTamperingAnalysis {
  authenticityScore: number; // 0-100%
  tamperingRiskScore: number; // 0-100%
  suspiciousRegions: TamperingRegion[];
  forensicIndicators: {
    photoSplicingRisk: number;
    fontDiscontinuityRisk: number;
    metadataIntegrity: boolean;
    compressionArtifactDiscrepancy: number;
    noisePrintConsistency: number;
    tamperVerdict: 'AUTHENTIC' | 'SUSPECTED_TAMPERING' | 'HIGH_CONFIDENCE_FORGERY';
  };
  forensicNotes: string[];
}

export interface FaceVerificationResult {
  matchScore: number; // 0-100%
  verdict: 'MATCH' | 'POSSIBLE_MATCH' | 'MISMATCH';
  livenessScore: number;
  qualityScore: number;
  faceDetectedInDoc: boolean;
  faceDetectedInLive: boolean;
  multipleFacesDetected: boolean;
  landmarkConfidence: number;
  lightingCondition: 'OPTIMAL' | 'POOR' | 'EXPOSED';
  biometricDistance: number;
  extractedFaceUrl: string;
  livePhotoUrl: string;
}

export interface VoiceAcousticMetrics {
  pitchMeanHz: number;
  pitchVariance: number;
  jitterPercentage: number; // Pitch perturbation
  shimmerDb: number; // Amplitude perturbation
  spectralCentroidHz: number;
  melCepstralConsistency: number;
  neuralVocoderArtifactsRisk: number;
  spectralCutoffDetected: boolean; // Typical in TTS models (e.g. 16kHz or 22kHz hard ceiling)
  microTremorPresence: boolean; // Natural biological vocal cord tremors vs flat synthetic pitch
  backgroundAcousticNoisePurity: number; // Unnatural synthetic silence vs organic room impulse
  speechRateSyllablesPerSec: number;
}

export interface VoiceAnalysisResult {
  authenticityScore: number; // 0-100% (High = Natural human voice)
  aiSynthesisRisk: number; // 0-100% (High = AI Cloned / TTS)
  riskLevel: RiskLevel;
  verdict: 'ORGANIC_HUMAN_VOICE' | 'SUSPECTED_SYNTHETIC' | 'CONFIRMED_AI_CLONE';
  detectedAcousticModel: string;
  acousticMetrics: VoiceAcousticMetrics;
  audioDurationSeconds: number;
  audioWaveformData: number[];
  frequencyBinsData: number[];
  sampleTitle: string;
  audioUrl?: string;
  synthesisIndicators: string[];
}

export interface SpeakerConsistencyResult {
  isEnrolledProfile: boolean;
  enrolledSpeakerName?: string;
  enrolledSpeakerRole?: string;
  speakerSimilarityScore: number; // 0-100%
  classification: 'GENUINE_ENROLLED_SPEAKER' | 'GENUINE_DIFFERENT_PERSON' | 'AI_CLONE_OF_ENROLLED_SPEAKER' | 'UNKNOWN_UNENROLLED_SPEAKER';
  voiceEmbeddingDistance: number;
  baselinePitchMatch: number;
  prosodySimilarity: number;
  profileLastVerifiedDate?: string;
  explanation: string;
}

export interface ContextualFraudData {
  callerPhoneNumber: string;
  callerDisplayName: string;
  callerSpoofProbability: number;
  targetDepartment: string;
  transactionAmountInr: number;
  transactionType: 'WIRE_TRANSFER' | 'CREDENTIAL_RESET' | 'SYSTEM_PRIVILEGE_ELEVATION' | 'LOAN_DISBURSEMENT' | 'CUSTOMER_DATA_EXPORT';
  isHighValueTransaction: boolean;
  urgencyLanguageScore: number; // 0-100% (High = social engineering pressure)
  interactionTime: string;
  isAfterHours: boolean;
  deviceFingerprint: string;
  isNewDevice: boolean;
  ipGeoLocation: string;
  isVpnOrProxy: boolean;
  previousFailedAttemptsCount: number;
  contextRiskLevel: RiskLevel;
  riskReasons: string[];
}

export interface ExplainableFactor {
  factor: string;
  impactScore: number; // e.g. +28, -15
  category: 'DOCUMENT' | 'FACE' | 'VOICE' | 'SPEAKER' | 'CONTEXT';
  severity: 'POSITIVE' | 'NEUTRAL' | 'WARNING' | 'CRITICAL';
  description: string;
}

export interface MultimodalIdentityResult {
  caseId: string;
  timestamp: string;
  identityTrustScore: number; // 0-100 (100 = perfectly trusted, 0 = critical fraud)
  compositeRiskScore: number; // 100 - identityTrustScore
  riskLevel: RiskLevel;
  recommendedAction: VerificationStatus;
  primarySummary: string;
  documentAnalysis: DocumentTamperingAnalysis;
  documentInfo: DocumentInfo;
  faceVerification: FaceVerificationResult;
  voiceAnalysis: VoiceAnalysisResult;
  speakerConsistency: SpeakerConsistencyResult;
  contextualData: ContextualFraudData;
  explainableFactors: ExplainableFactor[];
  auditLog: {
    actionTaken: string;
    timestamp: string;
    officer: string;
    notes?: string;
  }[];
  mitigationSteps: string[];
}

export type CaseStatus =
  | 'OPEN'
  | 'UNDER_INVESTIGATION'
  | 'BLOCKED'
  | 'APPROVED_SECONDARY'
  | 'RESOLVED_FALSE_POSITIVE'
  | 'BLOCKED_FRAUD'
  | 'REQUIRES_CALLBACK'
  | 'VERIFIED_GENUINE';

export interface SecurityCase {
  id: string;
  caseNumber: string;
  subjectName: string;
  claimedIdentity: string;
  timestamp: string;
  riskLevel: RiskLevel;
  identityTrustScore: number;
  scenario?: string;
  threatType?: 'AI_VOICE_CLONING' | 'DOCUMENT_FORGERY' | 'FACE_MISMATCH' | 'MULTIMODAL_SOCIAL_ENGINEERING' | 'GENUINE_VERIFICATION';
  status: CaseStatus;
  assignedOfficer: string;
  transactionAmount?: number;
  multimodalResult: MultimodalIdentityResult;
  notes: {
    author: string;
    timestamp: string;
    text: string;
  }[];
}

export interface SocMetricStats {
  totalVerificationsToday: number;
  documentsScanned: number;
  highRiskCases: number;
  criticalAlerts: number;
  voiceThreatsBlocked: number;
  faceMismatches: number;
  tamperedDocumentsDetected: number;
  blockedTransactionsValueInr: number;
  averageTrustScore: number;
  systemHealthStatus: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
}

export interface LiveAlert {
  id: string;
  caseId: string;
  timestamp: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  threatCategory: 'VOICE_CLONE' | 'DOC_TAMPER' | 'FACE_MISMATCH' | 'CONTEXT_SPOOF' | 'UNUSUAL_VOLUME';
  source: string;
  read: boolean;
}

export interface EnrolledSpeakerInfo {
  speakerId: string;
  name: string;
  roleTitle: string;
  enrolledAt: string;
  voiceEmbeddingVectorSize: number;
  confidenceBaseline: number;
}

export interface SystemPolicySettings {
  allowThreshold: number; // Score >= 80 -> Allow
  secondaryReviewThreshold: number; // Score 50-79 -> Secondary review
  blockThreshold: number; // Score < 50 -> Block
  minTrustScoreForAllow: number;
  blockThresholdScore: number;
  highValueTransactionThresholdInr: number;
  enableVoiceCloneDefense: boolean;
  enableDocumentTamperELA: boolean;
  requireOutOfBandCallbackForHighValue: boolean;
  requireLiveLivenessCheck: boolean;
  dataRetentionDays: number;
  enrolledSpeakers: EnrolledSpeakerInfo[];
  enableAiVoiceInterception: boolean;
  enableAutomaticOtpChallenge: boolean;
  enableIndependentCallbackEnforcement: boolean;
  requireSupervisorForOver50Lakh: boolean;
  dataPrivacyMode: 'MINIMAL_RETENTION' | 'COMPLIANCE_AUDIT' | 'FULL_FORENSIC';
  biometricRetentionHours: number;
  voiceFeatureOnlyMode: boolean;
  multilingualAcousticModelsEnabled: boolean;
}
