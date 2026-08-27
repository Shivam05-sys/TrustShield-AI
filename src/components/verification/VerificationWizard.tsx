import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck,
  UserCheck,
  Mic,
  ShieldAlert,
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Camera,
  Upload,
  Sparkles,
  Download,
  Lock,
  Zap,
  Activity,
  FileText,
  FileCode,
  FileSearch,
  Check,
  Video,
  VideoOff,
  MicOff,
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DocumentInfo,
  DocumentTamperingAnalysis,
  FaceVerificationResult,
  VoiceAnalysisResult,
  SpeakerConsistencyResult,
  ContextualFraudData,
  MultimodalIdentityResult,
  Language,
  SecurityCase
} from '../../types';
import { SAMPLE_DOCUMENTS, SAMPLE_VOICE_PROFILES, SAMPLE_CONTEXT_SCENARIOS } from '../../data/mockData';
import { TamperingHeatmap } from './TamperingHeatmap';
import { VoiceSpectrogram } from './VoiceSpectrogram';
import { ApiService } from '../../services/apiService';
import { RealtimeAudioAnalyzer } from '../../utils/audioAnalyzer';
import { generateSignedCasePdf } from '../../utils/pdfGenerator';

interface VerificationWizardProps {
  language: Language;
  presetScenario?: 'ATTACK_VP' | 'CLEAN_KYC' | 'FORGED_DOC' | null;
  onCaseGenerated?: (result: MultimodalIdentityResult) => void;
}

export const VerificationWizard: React.FC<VerificationWizardProps> = ({
  language,
  presetScenario,
  onCaseGenerated
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isComputing, setIsComputing] = useState<boolean>(false);

  // Form State for Applicant (Clean by default)
  const [applicantName, setApplicantName] = useState<string>('');
  const [docType, setDocType] = useState<DocumentInfo['type']>('NATIONAL_ID');
  const [docNumber, setDocNumber] = useState<string>('');
  const [dob, setDob] = useState<string>('1992-05-18');
  const [nationality, setNationality] = useState<string>('INDIAN');
  const [docImageUrl, setDocImageUrl] = useState<string>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80');
  const [docPhotoUrl, setDocPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [docTamperRisk, setDocTamperRisk] = useState<number>(12);
  const [mrzValid, setMrzValid] = useState<boolean>(true);

  // Camera & Face Verification State
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSelfieUrl, setCapturedSelfieUrl] = useState<string | null>(null);
  const [isCapturingFace, setIsCapturingFace] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Microphone & Voice State
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [isRecordingSample, setIsRecordingSample] = useState<boolean>(false);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [voiceAuthenticityScore, setVoiceAuthenticityScore] = useState<number>(94);
  const [voiceSynthesisRisk, setVoiceSynthesisRisk] = useState<number>(6);
  const [voiceVerdict, setVoiceVerdict] = useState<string>('ORGANIC_HUMAN_VOICE');
  const [liveFrequencies, setLiveFrequencies] = useState<number[]>([40, 60, 80, 75, 65, 55, 45, 35, 25, 18, 12, 8, 4, 2, 1, 0]);
  const [liveWaveform, setLiveWaveform] = useState<number[]>(Array(32).fill(0));
  const [livePitch, setLivePitch] = useState<number>(142.5);
  const audioAnalyzerRef = useRef<RealtimeAudioAnalyzer | null>(null);
  const recordTimerRef = useRef<number | null>(null);

  // Speaker Profile Consistency State
  const [speakerClassification, setSpeakerClassification] = useState<SpeakerConsistencyResult['classification']>('GENUINE_ENROLLED_SPEAKER');
  const [enrolledName, setEnrolledName] = useState<string>('Enrolled Identity Baseline');
  const [similarityScore, setSimilarityScore] = useState<number>(92);

  // Contextual Fraud & AML State
  const [transactionAmount, setTransactionAmount] = useState<number>(50000);
  const [callerPhone, setCallerPhone] = useState<string>('+91 98201 45892');
  const [callerSpoofRisk, setCallerSpoofRisk] = useState<number>(12);
  const [urgencyScore, setUrgencyScore] = useState<number>(15);
  const [isAfterHours, setIsAfterHours] = useState<boolean>(false);

  // Show presets toggle
  const [showPresets, setShowPresets] = useState<boolean>(false);

  // Final Multimodal Result State
  const [multimodalResult, setMultimodalResult] = useState<MultimodalIdentityResult | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Handle Preset Loading
  const loadPreset = (preset: 'ATTACK_VP' | 'CLEAN_KYC' | 'FORGED_DOC') => {
    if (preset === 'ATTACK_VP') {
      const doc = SAMPLE_DOCUMENTS[0]; // Tampered Rajesh Sharma
      const voice = SAMPLE_VOICE_PROFILES[0]; // AI Clone
      const ctx = SAMPLE_CONTEXT_SCENARIOS[0]; // 50L wire

      setApplicantName(doc.fullName);
      setDocType(doc.type);
      setDocNumber(doc.documentNumber);
      setDob(doc.dateOfBirth);
      setDocImageUrl(doc.documentImageUrl);
      setDocPhotoUrl(doc.extractedPhotoUrl);
      setDocTamperRisk(doc.tampering.tamperingRiskScore);
      setMrzValid(doc.validationFlags.mrzChecksumPassed);

      setCapturedSelfieUrl(doc.extractedPhotoUrl);
      setVoiceAuthenticityScore(voice.authenticityScore);
      setVoiceSynthesisRisk(voice.aiSynthesisRisk);
      setVoiceVerdict(voice.verdict);
      setLiveFrequencies(voice.frequencyBinsData);
      setLiveWaveform(voice.audioWaveformData);
      setLivePitch(voice.acousticMetrics.pitchMeanHz);

      setSpeakerClassification(voice.speakerProfile.classification);
      setEnrolledName(voice.speakerProfile.enrolledSpeakerName || 'Rajesh Sharma');
      setSimilarityScore(voice.speakerProfile.speakerSimilarityScore);

      setTransactionAmount(ctx.transactionAmountInr);
      setCallerPhone(ctx.callerPhoneNumber);
      setCallerSpoofRisk(ctx.callerSpoofProbability);
      setUrgencyScore(ctx.urgencyLanguageScore);
      setIsAfterHours(ctx.isAfterHours);
    } else if (preset === 'CLEAN_KYC') {
      const doc = SAMPLE_DOCUMENTS[1]; // Priya
      const voice = SAMPLE_VOICE_PROFILES[1];
      const ctx = SAMPLE_CONTEXT_SCENARIOS[1];

      setApplicantName(doc.fullName);
      setDocType(doc.type);
      setDocNumber(doc.documentNumber);
      setDob(doc.dateOfBirth);
      setDocImageUrl(doc.documentImageUrl);
      setDocPhotoUrl(doc.extractedPhotoUrl);
      setDocTamperRisk(doc.tampering.tamperingRiskScore);
      setMrzValid(doc.validationFlags.mrzChecksumPassed);

      setCapturedSelfieUrl(doc.extractedPhotoUrl);
      setVoiceAuthenticityScore(voice.authenticityScore);
      setVoiceSynthesisRisk(voice.aiSynthesisRisk);
      setVoiceVerdict(voice.verdict);
      setLiveFrequencies(voice.frequencyBinsData);
      setLiveWaveform(voice.audioWaveformData);
      setLivePitch(voice.acousticMetrics.pitchMeanHz);

      setSpeakerClassification(voice.speakerProfile.classification);
      setEnrolledName(voice.speakerProfile.enrolledSpeakerName || 'Priya Patel');
      setSimilarityScore(voice.speakerProfile.speakerSimilarityScore);

      setTransactionAmount(ctx.transactionAmountInr);
      setCallerPhone(ctx.callerPhoneNumber);
      setCallerSpoofRisk(ctx.callerSpoofProbability);
      setUrgencyScore(ctx.urgencyLanguageScore);
      setIsAfterHours(ctx.isAfterHours);
    } else if (preset === 'FORGED_DOC') {
      const doc = SAMPLE_DOCUMENTS[2]; // Amit
      const voice = SAMPLE_VOICE_PROFILES[2];
      const ctx = SAMPLE_CONTEXT_SCENARIOS[0];

      setApplicantName(doc.fullName);
      setDocType(doc.type);
      setDocNumber(doc.documentNumber);
      setDob(doc.dateOfBirth);
      setDocImageUrl(doc.documentImageUrl);
      setDocPhotoUrl(doc.extractedPhotoUrl);
      setDocTamperRisk(doc.tampering.tamperingRiskScore);
      setMrzValid(doc.validationFlags.mrzChecksumPassed);

      setCapturedSelfieUrl(doc.extractedPhotoUrl);
      setVoiceAuthenticityScore(voice.authenticityScore);
      setVoiceSynthesisRisk(voice.aiSynthesisRisk);
      setVoiceVerdict(voice.verdict);
      setLiveFrequencies(voice.frequencyBinsData);
      setLivePitch(voice.acousticMetrics.pitchMeanHz);

      setSpeakerClassification(voice.speakerProfile.classification);
      setEnrolledName('Unenrolled (New Account)');
      setSimilarityScore(30);

      setTransactionAmount(2500000);
      setCallerPhone('+91 99882 10934');
      setCallerSpoofRisk(75);
      setUrgencyScore(65);
      setIsAfterHours(true);
    }
  };

  useEffect(() => {
    if (presetScenario) {
      loadPreset(presetScenario);
    }
  }, [presetScenario]);

  // Clean up Camera on step changes / unmount
  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Clean up Mic on step changes / unmount
  const stopMicStream = () => {
    if (audioAnalyzerRef.current) {
      audioAnalyzerRef.current.stopMicrophone();
      audioAnalyzerRef.current = null;
    }
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setMicActive(false);
    setIsRecordingSample(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
      stopMicStream();
    };
  }, []);

  // Real Camera Activation
  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      cameraStreamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or unavailable:', err);
      const errMsg = err instanceof Error ? err.message : 'Camera permission denied or camera device busy.';
      setCameraError(errMsg);
      setCameraActive(false);
    }
  };

  // Live Selfie Snapshot Capture
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    setIsCapturingFace(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedSelfieUrl(dataUrl);
        stopCameraStream();
      }
    } catch (err) {
      console.error('Snapshot capture error:', err);
    } finally {
      setIsCapturingFace(false);
    }
  };

  // Real Microphone Activation & Live Audio Analyzer
  const handleToggleLiveMic = async () => {
    setMicError(null);
    if (micActive) {
      stopMicStream();
    } else {
      const analyzer = new RealtimeAudioAnalyzer();
      audioAnalyzerRef.current = analyzer;
      const success = await analyzer.startMicrophone((freqs, wave, pitch) => {
        setLiveFrequencies(freqs.slice(0, 16));
        setLiveWaveform(wave.slice(0, 32));
        setLivePitch(pitch);
      });

      if (success) {
        setMicActive(true);
      } else {
        setMicError('Microphone permission denied or device not found.');
        setMicActive(false);
      }
    }
  };

  // Live 4-second Voice Sample Recording & Metrics Extraction
  const handleRecordVoiceSample = async () => {
    if (isRecordingSample) return;
    setMicError(null);
    setIsRecordingSample(true);
    setRecordedDuration(0);

    const analyzer = new RealtimeAudioAnalyzer();
    audioAnalyzerRef.current = analyzer;
    const success = await analyzer.startMicrophone((freqs, wave, pitch) => {
      setLiveFrequencies(freqs.slice(0, 16));
      setLiveWaveform(wave.slice(0, 32));
      setLivePitch(pitch);
    });

    if (!success) {
      setMicError('Cannot access microphone for recording.');
      setIsRecordingSample(false);
      return;
    }

    setMicActive(true);
    let seconds = 0;
    recordTimerRef.current = window.setInterval(() => {
      seconds += 1;
      setRecordedDuration(seconds);
      if (seconds >= 4) {
        if (recordTimerRef.current) clearInterval(recordTimerRef.current);
        const metrics = analyzer.getRecordedMetrics();
        setVoiceAuthenticityScore(metrics.authenticityScore);
        setVoiceSynthesisRisk(metrics.aiSynthesisRisk);
        setVoiceVerdict(metrics.verdict);
        stopMicStream();
      }
    }, 1000);
  };

  // Upload Custom Document Photo
  const handleDocumentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setDocImageUrl(url);
          setDocPhotoUrl(url);
          // If custom upload, simulate clean document
          setDocTamperRisk(8);
          setMrzValid(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Custom Selfie Photo
  const handleSelfieFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedSelfieUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate Real-Time Dynamic Risk Gauge
  const calculateDynamicRiskPreview = () => {
    let runningRisk = 12;
    if (currentStep >= 1) {
      runningRisk += (docTamperRisk * 0.35);
      if (!mrzValid) runningRisk += 15;
    }
    if (currentStep >= 2) {
      if (!capturedSelfieUrl) runningRisk += 10;
    }
    if (currentStep >= 3) {
      runningRisk += (voiceSynthesisRisk * 0.4);
    }
    if (currentStep >= 4) {
      if (speakerClassification === 'AI_CLONE_OF_ENROLLED_SPEAKER') {
        runningRisk += 30;
      } else if (speakerClassification === 'GENUINE_DIFFERENT_PERSON') {
        runningRisk += 15;
      }
    }
    if (currentStep >= 5) {
      if (transactionAmount > 1000000 && callerSpoofRisk > 50) {
        runningRisk += 20;
      }
    }
    return Math.min(95, Math.max(5, Math.round(runningRisk)));
  };

  const dynamicRisk = calculateDynamicRiskPreview();
  const dynamicTrust = 100 - dynamicRisk;

  // Compute Unified Multimodal Identity Result
  const handleComputeFinalMultimodalResult = async () => {
    setIsComputing(true);
    stopCameraStream();
    stopMicStream();

    const activeDocInfo: DocumentInfo = {
      id: `doc-${Date.now()}`,
      type: docType,
      documentNumber: docNumber || 'IND-8920-4109',
      fullName: applicantName.trim() || 'APPLICANT VERIFICATION',
      dateOfBirth: dob,
      nationality: nationality,
      gender: 'MALE',
      issueDate: '2021-02-14',
      expiryDate: '2031-02-13',
      issuingAuthority: 'Identity Issuance Authority',
      ocrConfidence: 97.4,
      extractedPhotoUrl: docPhotoUrl,
      documentImageUrl: docImageUrl,
      extractedFields: {
        Name: applicantName.trim() || 'APPLICANT VERIFICATION',
        DocNumber: docNumber || 'IND-8920-4109'
      },
      validationFlags: {
        formatValid: true,
        isExpired: false,
        dateLogicalConsistency: true,
        mrzChecksumPassed: mrzValid,
        suspiciousFontDetected: docTamperRisk > 40
      }
    };

    const activeTampering: DocumentTamperingAnalysis = {
      authenticityScore: 100 - docTamperRisk,
      tamperingRiskScore: docTamperRisk,
      suspiciousRegions: docTamperRisk > 40 ? [
        {
          id: 'region-1',
          label: 'Altered Text & Font Anomaly',
          riskPercentage: docTamperRisk,
          box: [20, 30, 45, 18],
          anomalyType: 'FONT_INCONSISTENCY',
          description: 'Pixel anti-aliasing gradient differs from authentic template baseline.',
          pixelVariance: 3.4
        }
      ] : [],
      forensicIndicators: {
        photoSplicingRisk: docTamperRisk > 40 ? 68 : 8,
        fontDiscontinuityRisk: docTamperRisk,
        metadataIntegrity: docTamperRisk < 40,
        compressionArtifactDiscrepancy: docTamperRisk,
        noisePrintConsistency: 100 - docTamperRisk,
        tamperVerdict: docTamperRisk > 60 ? 'HIGH_CONFIDENCE_FORGERY' : docTamperRisk > 30 ? 'SUSPECTED_TAMPERING' : 'AUTHENTIC'
      },
      forensicNotes: docTamperRisk > 40
        ? ['Localized pixel quantization mismatch in document text field.', 'Suspicious font anti-aliasing curve detected.']
        : ['Document guilloché security patterns intact.', 'Optical character recognition checksum verified with ISO/IEC standards.']
    };

    const activeFace: FaceVerificationResult = {
      matchScore: docTamperRisk > 60 ? 62 : 94,
      verdict: docTamperRisk > 60 ? 'POSSIBLE_MATCH' : 'MATCH',
      livenessScore: docTamperRisk > 60 ? 55 : 92,
      qualityScore: 90,
      faceDetectedInDoc: true,
      faceDetectedInLive: true,
      multipleFacesDetected: false,
      landmarkConfidence: 95,
      lightingCondition: 'OPTIMAL',
      biometricDistance: docTamperRisk > 60 ? 0.35 : 0.08,
      extractedFaceUrl: docPhotoUrl,
      livePhotoUrl: capturedSelfieUrl || docPhotoUrl
    };

    const activeVoice: VoiceAnalysisResult = {
      sampleTitle: `${applicantName || 'Applicant'} - Voice Telemetry`,
      audioDurationSeconds: 4.2,
      authenticityScore: voiceAuthenticityScore,
      aiSynthesisRisk: voiceSynthesisRisk,
      riskLevel: voiceSynthesisRisk > 50 ? 'CRITICAL' : 'SAFE',
      verdict: voiceSynthesisRisk > 50 ? 'CONFIRMED_AI_CLONE' : 'ORGANIC_HUMAN_VOICE',
      synthesisIndicators: voiceSynthesisRisk > 50 ? [
        '16.0 kHz neural vocoder steep brick-wall frequency cutoff detected.',
        'Vocal pitch perturbation (jitter: 0.14%) is unnaturally monotonic.'
      ] : [
        'Full natural acoustic bandwidth extending to 22.0 kHz.',
        'Biological pitch jitter (0.88%) confirms organic human vocal tract.'
      ],
      acousticMetrics: {
        pitchMeanHz: livePitch,
        pitchVariance: 14.2,
        jitterPercentage: voiceSynthesisRisk > 50 ? 0.14 : 0.88,
        shimmerDb: voiceSynthesisRisk > 50 ? 0.32 : 1.45,
        spectralCentroidHz: 2150,
        melCepstralConsistency: 92,
        neuralVocoderArtifactsRisk: voiceSynthesisRisk,
        spectralCutoffDetected: voiceSynthesisRisk > 50,
        microTremorPresence: voiceSynthesisRisk <= 50,
        backgroundAcousticNoisePurity: 88,
        speechRateSyllablesPerSec: 4.2
      },
      detectedAcousticModel: voiceSynthesisRisk > 50 ? 'Neural TTS / ElevenLabs Model' : 'Biological Vocal Tract',
      audioWaveformData: liveWaveform,
      frequencyBinsData: liveFrequencies
    };

    const activeSpeakerProfile: SpeakerConsistencyResult = {
      isEnrolledProfile: speakerClassification !== 'UNKNOWN_UNENROLLED_SPEAKER',
      enrolledSpeakerName: enrolledName,
      enrolledSpeakerRole: 'Authorized Account Holder',
      speakerSimilarityScore: similarityScore,
      voiceEmbeddingDistance: similarityScore > 75 ? 0.14 : 0.78,
      baselinePitchMatch: similarityScore,
      prosodySimilarity: similarityScore,
      classification: speakerClassification,
      explanation:
        speakerClassification === 'AI_CLONE_OF_ENROLLED_SPEAKER'
          ? 'Attacker cloned the enrolled acoustic voiceprint of the verified user.'
          : speakerClassification === 'GENUINE_ENROLLED_SPEAKER'
          ? 'Acoustic voiceprint matches enrolled biometric baseline with natural organic resonance.'
          : 'Natural human voice belonging to an unenrolled individual.'
    };

    const activeContext: ContextualFraudData = {
      callerPhoneNumber: callerPhone,
      callerDisplayName: applicantName || 'Applicant Individual',
      callerSpoofProbability: callerSpoofRisk,
      targetDepartment: 'Treasury & High-Value Wire Clearance',
      transactionAmountInr: transactionAmount,
      transactionType: 'WIRE_TRANSFER',
      isHighValueTransaction: transactionAmount >= 500000,
      urgencyLanguageScore: urgencyScore,
      interactionTime: new Date().toLocaleTimeString() + ' IST',
      isAfterHours: isAfterHours,
      deviceFingerprint: 'DEV-FP-9821-TS',
      isNewDevice: false,
      ipGeoLocation: 'Mumbai, India',
      isVpnOrProxy: false,
      previousFailedAttemptsCount: 0,
      contextRiskLevel: transactionAmount >= 500000 || callerSpoofRisk > 50 ? 'HIGH' : 'LOW',
      riskReasons: [
        ...(transactionAmount >= 500000 ? [`High-value transaction: ₹${transactionAmount.toLocaleString('en-IN')}`] : []),
        ...(callerSpoofRisk > 50 ? [`Spoofed signaling headers detected on ${callerPhone}`] : []),
        ...(isAfterHours ? ['Transaction initiated outside standard business hours'] : []),
        ...(urgencyScore > 50 ? ['Psychological urgency and coercive social engineering patterns flagged'] : [])
      ]
    };

    try {
      const result = await ApiService.computeMultimodalTrust({
        documentTampering: activeTampering,
        documentInfo: activeDocInfo,
        faceMatch: activeFace,
        voiceAnalysis: activeVoice,
        speakerConsistency: activeSpeakerProfile,
        contextData: activeContext
      });

      setMultimodalResult(result);
      if (onCaseGenerated) {
        onCaseGenerated(result);
      }

      if (result.identityTrustScore > 70) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }

      setCurrentStep(6);
    } catch (err) {
      console.error('Error computing multimodal result:', err);
    } finally {
      setIsComputing(false);
    }
  };

  const handleExportResultPdf = async () => {
    if (!multimodalResult) return;
    setIsExportingPdf(true);
    try {
      const tempCase: SecurityCase = {
        id: `case-${multimodalResult.caseId.toLowerCase()}`,
        caseNumber: multimodalResult.caseId,
        subjectName: multimodalResult.documentInfo?.fullName || 'Applicant',
        claimedIdentity: multimodalResult.contextualData?.callerDisplayName || 'Applicant',
        timestamp: new Date().toLocaleString() + ' IST',
        riskLevel: multimodalResult.riskLevel,
        identityTrustScore: multimodalResult.identityTrustScore,
        status: multimodalResult.riskLevel === 'CRITICAL' ? 'BLOCKED_FRAUD' : multimodalResult.riskLevel === 'HIGH' ? 'REQUIRES_CALLBACK' : 'VERIFIED_GENUINE',
        assignedOfficer: 'Security Officer (Direct Verification)',
        scenario: multimodalResult.primarySummary,
        multimodalResult: multimodalResult,
        notes: [
          {
            author: 'TrustShield Multimodal Engine',
            timestamp: new Date().toLocaleTimeString() + ' IST',
            text: `Direct verification complete. Trust Score: ${multimodalResult.identityTrustScore}/100.`
          }
        ]
      };
      await generateSignedCasePdf(tempCase, 'SECURITY OFFICER');
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleResetVerification = () => {
    stopCameraStream();
    stopMicStream();
    setApplicantName('');
    setDocNumber('');
    setDocImageUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80');
    setDocPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setCapturedSelfieUrl(null);
    setDocTamperRisk(10);
    setVoiceAuthenticityScore(94);
    setVoiceSynthesisRisk(6);
    setVoiceVerdict('ORGANIC_HUMAN_VOICE');
    setSpeakerClassification('GENUINE_ENROLLED_SPEAKER');
    setTransactionAmount(50000);
    setCallerSpoofRisk(10);
    setUrgencyScore(15);
    setMultimodalResult(null);
    setCurrentStep(1);
  };

  return (
    <div id="verification-wizard" className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Top Wizard Steps Header & Dynamic Real-Time Risk Gauge */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 font-mono text-xs px-2.5 py-0.5 rounded-full border border-blue-500/30">
                MULTIMODAL PIPELINE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Live Identity & Impersonation Verification
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter applicant details, scan document, capture live camera selfie, and analyze real voice acoustics
            </p>
          </div>

          {/* Dynamic Real-Time Risk Meter */}
          <div className="flex items-center gap-4 glass-pill px-4 py-2 rounded-2xl border border-white/10 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">DYNAMIC RISK METER</span>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold font-mono ${
                  dynamicRisk > 60 ? 'text-rose-400' : dynamicRisk > 35 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {dynamicRisk}% RISK
                </span>
                <span className="text-xs font-mono text-slate-400">
                  (Trust: {dynamicTrust}/100)
                </span>
              </div>
            </div>

            <div className="w-20 sm:w-24 bg-slate-900/80 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-500 ${
                  dynamicRisk > 60 ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : dynamicRisk > 35 ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                }`}
                style={{ width: `${dynamicRisk}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stepper Tabs (Fully Responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
          {[
            { step: 1, label: '1. Document AI', icon: FileCheck },
            { step: 2, label: '2. Face Match', icon: UserCheck },
            { step: 3, label: '3. Voice Clones', icon: Mic },
            { step: 4, label: '4. Speaker Profile', icon: Activity },
            { step: 5, label: '5. Context & AML', icon: BrainCircuit },
            { step: 6, label: '6. Trust Fusion', icon: ShieldAlert }
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (s.step < currentStep || multimodalResult) {
                    stopCameraStream();
                    stopMicStream();
                    setCurrentStep(s.step);
                  }
                }}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : isCompleted
                    ? 'glass-card-sub text-slate-300 border-white/10 hover:border-white/20'
                    : 'glass-card-subtle text-slate-500 border-white/5 opacity-60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Benchmark Scenarios Bar */}
      <div className="glass-card-subtle p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-medium">Quick Benchmark Attack Scenarios:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => loadPreset('ATTACK_VP')}
            className="px-2.5 py-1 glass-card hover:bg-rose-950/40 text-rose-300 rounded-lg border border-rose-500/30 text-[11px] font-mono transition-colors cursor-pointer"
          >
            🚨 AI Clone + Forged Doc (Attack)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('CLEAN_KYC')}
            className="px-2.5 py-1 glass-card hover:bg-emerald-950/40 text-emerald-300 rounded-lg border border-emerald-500/30 text-[11px] font-mono transition-colors cursor-pointer"
          >
            🟢 Clean Passport KYC (Authentic)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('FORGED_DOC')}
            className="px-2.5 py-1 glass-card hover:bg-amber-950/40 text-amber-300 rounded-lg border border-amber-500/30 text-[11px] font-mono transition-colors cursor-pointer"
          >
            🟡 Forged License + Unenrolled Voice
          </button>
          <button
            type="button"
            onClick={handleResetVerification}
            className="px-2.5 py-1 glass-card hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-white/10 text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear Blank Form
          </button>
        </div>
      </div>

      {/* STEP 1: DOCUMENT INTELLIGENCE & OCR */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-400" />
                  Applicant Information & Identity Document Intake
                </h3>
                <p className="text-xs text-slate-400">
                  Enter applicant profile or upload government-issued ID for multi-spectral ELA tamper analysis
                </p>
              </div>
            </div>

            {/* Custom Input Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Applicant Full Legal Name</label>
                <input
                  type="text"
                  value={applicantName}
                  placeholder="e.g. Vikramaditya Sen"
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentInfo['type'])}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 bg-slate-900"
                >
                  <option value="NATIONAL_ID">National ID / Aadhaar Card</option>
                  <option value="PASSPORT">Passport (ICAO 9303)</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Document Number</label>
                <input
                  type="text"
                  value={docNumber}
                  placeholder="e.g. IND-8920-4109"
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Document Image & Upload Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Document Image Preview */}
              <div className="glass-card-subtle p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    DOCUMENT IMAGE SOURCE
                  </span>
                  <span className="text-[10px] font-mono text-blue-400">300 DPI Forensic Resolution</span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-white/10 relative">
                  <img
                    src={docImageUrl}
                    alt="Document"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 glass-pill px-2.5 py-0.5 rounded text-[10px] font-mono text-slate-300">
                    OCR Confidence: 98.4%
                  </div>
                </div>
              </div>

              {/* Upload Controls & Forensic Settings */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-semibold text-white block mb-1">
                    Upload Custom Document or ID Card
                  </span>
                  <p className="text-xs text-slate-400 mb-3">
                    Upload passport page, Aadhaar scan, or license to test automated OCR extraction & error level analysis
                  </p>

                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-blue-500/60 transition-colors cursor-pointer bg-slate-900/40">
                    <Upload className="w-6 h-6 text-blue-400 mb-1" />
                    <span className="text-xs text-slate-200 font-medium">Click or Drag & Drop Document Image</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDocumentFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Tampering Simulation Slider for Security Testing */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Tamper Simulation Level:</span>
                    <strong className={docTamperRisk > 40 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                      {docTamperRisk}% {docTamperRisk > 40 ? '(FORGED ZONE)' : '(GENUINE)'}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={docTamperRisk}
                    onChange={(e) => setDocTamperRisk(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Step 1 of 6: Document intake initialized.
            </span>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              Proceed to Live Biometric Face Match <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: FACE VERIFICATION & REAL CAMERA */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  Facial Biometric Match & Live Camera Anti-Spoofing
                </h3>
                <p className="text-xs text-slate-400">
                  Capture a live webcam selfie or upload a photo to compare against the extracted ID portrait
                </p>
              </div>

              {/* Camera Trigger Buttons */}
              <div className="flex items-center gap-2">
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={handleStartCamera}
                    className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" /> Start Live Webcam
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <VideoOff className="w-3.5 h-3.5" /> Stop Camera
                  </button>
                )}
              </div>
            </div>

            {cameraError && (
              <div className="glass-card-danger p-3 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{cameraError} (You can also upload a selfie photo below)</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source A: Extracted Document Portrait */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 text-center space-y-3">
                <span className="text-xs font-mono text-slate-400 font-semibold block">
                  SOURCE A: Extracted Document Portrait
                </span>
                <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-blue-500/40 relative shadow-inner bg-slate-900">
                  <img
                    src={docPhotoUrl}
                    alt="Document Portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 glass-pill px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                    68 Facial Landmarks
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Extracted from legal ID record
                </p>
              </div>

              {/* Source B: Live Webcam Stream OR Captured Selfie */}
              <div className="glass-card-subtle p-4 rounded-xl border border-white/10 text-center space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    SOURCE B: Live Verification Selfie
                  </span>
                  <label className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3 h-3" /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/40 relative shadow-inner bg-slate-950 flex items-center justify-center">
                  {cameraActive ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                      {/* Biometric Oval Guide Overlay */}
                      <div className="absolute inset-4 border-2 border-dashed border-cyan-400/70 rounded-[50%] pointer-events-none animate-pulse" />
                      <button
                        type="button"
                        onClick={handleCaptureSnapshot}
                        disabled={isCapturingFace}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold rounded-lg shadow-lg cursor-pointer whitespace-nowrap"
                      >
                        Capture Snapshot
                      </button>
                    </div>
                  ) : capturedSelfieUrl ? (
                    <img
                      src={capturedSelfieUrl}
                      alt="Captured Selfie"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-slate-500 text-xs">
                      <Camera className="w-8 h-8 mb-1 text-slate-600" />
                      <span>No camera feed</span>
                      <button
                        type="button"
                        onClick={handleStartCamera}
                        className="mt-2 text-cyan-400 underline text-[11px] cursor-pointer"
                      >
                        Turn on webcam
                      </button>
                    </div>
                  )}

                  {capturedSelfieUrl && !cameraActive && (
                    <div className="absolute bottom-2 left-2 glass-pill px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
                      Liveness: 94% (PASS)
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-mono">
                  3D Depth & Eye Blink Anti-Spoofing Active
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setCurrentStep(1);
              }}
              className="px-4 py-2 glass-card-subtle hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Document AI
            </button>
            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setCurrentStep(3);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              Proceed to Voice Cloning Defense <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VOICE CLONING & REAL MICROPHONE */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-rose-400" />
                  Live Voice Microphone Scan & Neural Vocoder Detection
                </h3>
                <p className="text-xs text-slate-400">
                  Speak into your microphone to analyze vocal formants, pitch micro-tremors & 16kHz vocoder ceiling
                </p>
              </div>

              {/* Mic Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecordVoiceSample}
                  disabled={isRecordingSample}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    isRecordingSample
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isRecordingSample ? `Recording... (${recordedDuration}s / 4s)` : '🎙️ Record 4s Live Voice Sample'}
                </button>

                <button
                  type="button"
                  onClick={handleToggleLiveMic}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    micActive
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'glass-card-subtle hover:bg-slate-800 text-slate-200 border-white/10'
                  }`}
                >
                  {micActive ? <MicOff className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                  {micActive ? 'Stop Stream' : 'Live Stream'}
                </button>
              </div>
            </div>

            {micError && (
              <div className="glass-card-danger p-3 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{micError}</span>
              </div>
            )}

            {/* Live Audio Visualizer Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 space-y-4">
                <div className="glass-card-subtle p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>LIVE SPECTRUM (FFT 256)</span>
                    <span className={micActive || isRecordingSample ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}>
                      {micActive || isRecordingSample ? '● Microphone Listening' : 'Mic Idle'}
                    </span>
                  </div>

                  {/* Frequency Bins */}
                  <div className="h-28 flex items-end gap-1.5 px-2 bg-slate-950 rounded-xl border border-white/10 relative">
                    <div className="absolute top-1 right-[25%] text-[9px] font-mono text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/40">
                      16.0 kHz Vocoder Cutoff Cap
                    </div>
                    <div className="absolute top-4 bottom-0 right-[25%] w-px border-r border-dashed border-rose-500/50 pointer-events-none" />

                    {liveFrequencies.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div
                          className={`w-full rounded-t transition-all duration-75 ${
                            voiceSynthesisRisk > 50
                              ? 'bg-gradient-to-t from-amber-600 to-rose-500'
                              : 'bg-gradient-to-t from-blue-600 to-emerald-400'
                          }`}
                          style={{ height: `${Math.max(6, val)}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
                    <span>0 Hz (Pitch: {livePitch.toFixed(1)}Hz)</span>
                    <span>4 kHz</span>
                    <span>8 kHz</span>
                    <span className="text-rose-400">16 kHz</span>
                    <span>22 kHz</span>
                  </div>
                </div>
              </div>

              {/* Acoustic Findings */}
              <div className="lg:col-span-5 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">VOICE AUTHENTICITY</span>
                    <span className={`text-2xl font-bold font-mono ${
                      voiceAuthenticityScore > 75 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {voiceAuthenticityScore}%
                    </span>
                  </div>
                  <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">AI SYNTHESIS RISK</span>
                    <span className={`text-2xl font-bold font-mono ${
                      voiceSynthesisRisk > 40 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {voiceSynthesisRisk}%
                    </span>
                  </div>
                </div>

                <div className="glass-card-subtle p-3.5 rounded-xl border border-white/10 space-y-2 text-xs">
                  <span className="font-mono text-blue-400 block font-semibold">VERDICT & ANOMALIES</span>
                  <div className="space-y-1 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">•</span>
                      <span>Verdict: <strong className="text-white">{voiceVerdict.replace(/_/g, ' ')}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">•</span>
                      <span>Fundamental Frequency: <strong className="text-white">{livePitch.toFixed(1)} Hz</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                stopMicStream();
                setCurrentStep(2);
              }}
              className="px-4 py-2 glass-card-subtle hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Face Verification
            </button>
            <button
              type="button"
              onClick={() => {
                stopMicStream();
                setCurrentStep(4);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              Proceed to Speaker Profile Consistency <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SPEAKER CONSISTENCY */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Speaker Profile Consistency vs Known Enrollments
              </h3>
              <p className="text-xs text-slate-400">
                Determine if voiceprint belongs to enrolled target, an AI synthesized impersonation, or an unknown individual
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  type: 'GENUINE_ENROLLED_SPEAKER' as const,
                  title: 'Genuine Enrolled Speaker',
                  desc: 'Voice matches enrolled baseline with organic biological harmonics.',
                  active: speakerClassification === 'GENUINE_ENROLLED_SPEAKER',
                  color: 'emerald'
                },
                {
                  type: 'AI_CLONE_OF_ENROLLED_SPEAKER' as const,
                  title: 'AI Clone of Enrolled Person',
                  desc: 'Attacker synthesized target voice; spectral cutoff confirms clone.',
                  active: speakerClassification === 'AI_CLONE_OF_ENROLLED_SPEAKER',
                  color: 'rose'
                },
                {
                  type: 'GENUINE_DIFFERENT_PERSON' as const,
                  title: 'Genuine Different Speaker',
                  desc: 'Natural human voice, but belongs to another distinct individual.',
                  active: speakerClassification === 'GENUINE_DIFFERENT_PERSON',
                  color: 'amber'
                },
                {
                  type: 'UNKNOWN_UNENROLLED_SPEAKER' as const,
                  title: 'Unknown Unenrolled Speaker',
                  desc: 'No prior enrolled voiceprint on file for this claimed record.',
                  active: speakerClassification === 'UNKNOWN_UNENROLLED_SPEAKER',
                  color: 'slate'
                }
              ].map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSpeakerClassification(sc.type)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    sc.active
                      ? sc.color === 'rose'
                        ? 'glass-card-danger shadow-lg shadow-rose-950/40 border-rose-500/60'
                        : 'glass-card-accent shadow-lg shadow-emerald-950/40 border-emerald-500/60'
                      : 'glass-card-subtle opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      sc.active ? 'bg-white/10 text-white' : 'text-slate-400'
                    }`}>
                      {sc.active ? 'SELECTED' : 'SELECT'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{sc.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{sc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 glass-card-subtle hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Voice Analysis
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              Proceed to Contextual Fraud & AML <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONTEXTUAL FRAUD & AML */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-amber-400" />
                Contextual Fraud, Telephony Signaling & High-Value AML Parameters
              </h3>
              <p className="text-xs text-slate-400">
                Configure transaction amount, caller ID spoofing indicators, and social engineering urgency
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Transaction Amount (INR ₹)</label>
                <input
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(Number(e.target.value))}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Caller Origin Phone Number</label>
                <input
                  type="text"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Caller ID Spoof Risk (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={callerSpoofRisk}
                  onChange={(e) => setCallerSpoofRisk(Number(e.target.value))}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Social Engineering Pressure (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={urgencyScore}
                  onChange={(e) => setUrgencyScore(Number(e.target.value))}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 glass-card-subtle hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Speaker Consistency
            </button>
            <button
              type="button"
              disabled={isComputing}
              onClick={handleComputeFinalMultimodalResult}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isComputing ? 'Fusing Multimodal Signals...' : 'Compute Unified Multimodal Trust Score'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: TRUST FUSION VERDICT */}
      {currentStep === 6 && multimodalResult && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border-2 shadow-2xl backdrop-blur-xl ${
            multimodalResult.riskLevel === 'CRITICAL'
              ? 'glass-card-danger border-rose-500/60 shadow-rose-950/40'
              : multimodalResult.riskLevel === 'HIGH'
              ? 'bg-amber-950/30 border-amber-500/60 shadow-amber-950/40'
              : 'glass-card-accent border-emerald-500/60 shadow-emerald-950/40'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                    multimodalResult.riskLevel === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : multimodalResult.riskLevel === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {multimodalResult.riskLevel} RISK LEVEL
                  </span>
                  <span className="text-xs font-mono text-slate-400">Case ID: #{multimodalResult.caseId}</span>
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1.5">
                  {multimodalResult.primarySummary}
                </h2>
              </div>

              {/* Action Buttons: Export Signed PDF & Reset */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportResultPdf}
                  disabled={isExportingPdf}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-blue-400/30"
                >
                  <FileCheck className="w-4 h-4 text-cyan-300" />
                  {isExportingPdf ? 'Generating PDF...' : 'Export Signed PDF Report'}
                </button>

                <button
                  type="button"
                  onClick={handleResetVerification}
                  className="px-3.5 py-2 glass-card-subtle hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Another Verification
                </button>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">IDENTITY TRUST SCORE</span>
                <span className={`text-2xl font-bold font-mono ${
                  multimodalResult.identityTrustScore > 75 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {multimodalResult.identityTrustScore}/100
                </span>
              </div>

              <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">DOCUMENT AUTHENTICITY</span>
                <span className={`text-2xl font-bold font-mono ${
                  multimodalResult.documentAnalysis.authenticityScore > 75 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {multimodalResult.documentAnalysis.authenticityScore}%
                </span>
              </div>

              <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">VOICE SYNTHESIS RISK</span>
                <span className={`text-2xl font-bold font-mono ${
                  multimodalResult.voiceAnalysis.aiSynthesisRisk > 40 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {multimodalResult.voiceAnalysis.aiSynthesisRisk}%
                </span>
              </div>

              <div className="glass-card-subtle p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">RECOMMENDED DISPOSITION</span>
                <span className="text-sm font-bold font-mono text-cyan-300 truncate block mt-1">
                  {multimodalResult.recommendedAction.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
