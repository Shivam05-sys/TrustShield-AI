import {
  DocumentInfo,
  DocumentTamperingAnalysis,
  FaceVerificationResult,
  VoiceAnalysisResult,
  SpeakerConsistencyResult,
  ContextualFraudData,
  MultimodalIdentityResult,
  SecurityCase,
  SocMetricStats,
  LiveAlert,
  SystemPolicySettings
} from '../types';

export const SAMPLE_DOCUMENTS: (DocumentInfo & { tampering: DocumentTamperingAnalysis })[] = [
  {
    id: 'doc-tampered-vp',
    type: 'NATIONAL_ID',
    documentNumber: '8492-9182-3019',
    fullName: 'RAJESH SHARMA',
    dateOfBirth: '14/08/1974',
    nationality: 'INDIAN',
    gender: 'MALE',
    issueDate: '12/03/2021',
    expiryDate: '11/03/2031',
    issuingAuthority: 'Unique Identification Authority of India (Demo-Synth)',
    ocrConfidence: 94.2,
    documentImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    extractedPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    extractedFields: {
      'Name': 'RAJESH SHARMA',
      'Designation': 'SENIOR VP - TREASURY',
      'DOB': '14/08/1974',
      'Aadhaar / ID No': '8492 9182 3019',
      'Address': 'B-402, Nariman Point Towers, Mumbai, Maharashtra - 400021'
    },
    validationFlags: {
      formatValid: true,
      isExpired: false,
      dateLogicalConsistency: true,
      mrzChecksumPassed: false,
      suspiciousFontDetected: true
    },
    tampering: {
      authenticityScore: 38,
      tamperingRiskScore: 78,
      suspiciousRegions: [
        {
          id: 't-reg-1',
          label: 'DOB Text Inconsistency',
          box: [42, 45, 28, 9],
          riskPercentage: 84,
          anomalyType: 'FONT_INCONSISTENCY',
          description: 'Font rasterization Discrepancy: Character kerning and anti-aliasing mismatch detected on year "1974".',
          pixelVariance: 14.8
        },
        {
          id: 't-reg-2',
          label: 'Photo Boundary Splicing',
          box: [8, 25, 26, 42],
          riskPercentage: 72,
          anomalyType: 'COPY_PASTE_SPLICING',
          description: 'Edge-gradient discontinuity at portrait perimeter indicating digital layer insertion over original badge.',
          pixelVariance: 19.3
        }
      ],
      forensicIndicators: {
        photoSplicingRisk: 72,
        fontDiscontinuityRisk: 84,
        metadataIntegrity: false,
        compressionArtifactDiscrepancy: 68,
        noisePrintConsistency: 35,
        tamperVerdict: 'HIGH_CONFIDENCE_FORGERY'
      },
      forensicNotes: [
        'JPEG Error Level Analysis (ELA) exhibits sharp high-frequency luminance variance in the portrait card rectangle.',
        'Extracted font glyphs for numerical field "1974" do not match official government microprint standards.',
        'Tampering probability index: 78% (CRITICAL ALERT).'
      ]
    }
  },
  {
    id: 'doc-genuine-passport',
    type: 'PASSPORT',
    documentNumber: 'Z8942103',
    fullName: 'PRIYA SUNDARAM',
    dateOfBirth: '29/11/1991',
    nationality: 'INDIAN',
    gender: 'FEMALE',
    issueDate: '10/05/2019',
    expiryDate: '09/05/2029',
    mrzCode: 'P<INDSUNDARAM<<PRIYA<<<<<<<<<<<<<<<<<<<<<<\nZ8942103<4IND9111294F2905098<<<<<<<<<<<<<<<2',
    mrzValid: true,
    issuingAuthority: 'Passport Office Chennai, Republic of India',
    ocrConfidence: 99.4,
    documentImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    extractedPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    extractedFields: {
      'Passport No': 'Z8942103',
      'Full Name': 'PRIYA SUNDARAM',
      'Date of Birth': '29/11/1991',
      'Nationality': 'INDIAN',
      'Place of Issue': 'CHENNAI'
    },
    validationFlags: {
      formatValid: true,
      isExpired: false,
      dateLogicalConsistency: true,
      mrzChecksumPassed: true,
      suspiciousFontDetected: false
    },
    tampering: {
      authenticityScore: 96,
      tamperingRiskScore: 4,
      suspiciousRegions: [],
      forensicIndicators: {
        photoSplicingRisk: 3,
        fontDiscontinuityRisk: 2,
        metadataIntegrity: true,
        compressionArtifactDiscrepancy: 4,
        noisePrintConsistency: 97,
        tamperVerdict: 'AUTHENTIC'
      },
      forensicNotes: [
        'MRZ Checksum digits matched cryptographic validation standard ICAO 9303 Doc.',
        'Guilloché background geometric pattern continuous across all photo borders.',
        'Zero digital layer artifacts detected.'
      ]
    }
  },
  {
    id: 'doc-spliced-license',
    type: 'DRIVING_LICENSE',
    documentNumber: 'DL-042018009214',
    fullName: 'AMIT VERMA',
    dateOfBirth: '05/02/1985',
    nationality: 'INDIAN',
    gender: 'MALE',
    issueDate: '15/01/2018',
    expiryDate: '14/01/2023',
    issuingAuthority: 'Regional Transport Authority New Delhi',
    ocrConfidence: 86.7,
    documentImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    extractedPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    extractedFields: {
      'License No': 'DL-042018009214',
      'Holder Name': 'AMIT VERMA',
      'Valid Upto': '14/01/2023 (EXPIRED)',
      'Class': 'LMV-NT'
    },
    validationFlags: {
      formatValid: true,
      isExpired: true,
      dateLogicalConsistency: true,
      mrzChecksumPassed: false,
      suspiciousFontDetected: true
    },
    tampering: {
      authenticityScore: 45,
      tamperingRiskScore: 65,
      suspiciousRegions: [
        {
          id: 't-reg-3',
          label: 'Modified Expiry Date Stamp',
          box: [55, 60, 30, 12],
          riskPercentage: 74,
          anomalyType: 'TEXT_MODIFICATION',
          description: 'Pasted text region with differing JPEG quantization matrix discovered over original expiry.',
          pixelVariance: 16.2
        }
      ],
      forensicIndicators: {
        photoSplicingRisk: 42,
        fontDiscontinuityRisk: 74,
        metadataIntegrity: false,
        compressionArtifactDiscrepancy: 61,
        noisePrintConsistency: 49,
        tamperVerdict: 'SUSPECTED_TAMPERING'
      },
      forensicNotes: [
        'Document is EXPIRED per raw OCR dates.',
        'Cloned compression artifacts around date stamp indicate editing in image manipulation software.'
      ]
    }
  }
];

export const SAMPLE_VOICE_PROFILES: (VoiceAnalysisResult & { speakerProfile: SpeakerConsistencyResult })[] = [
  {
    sampleTitle: 'Live Call Stream — Claimed VP Rajesh Sharma (ElevenLabs / Neural TTS Clone)',
    authenticityScore: 18,
    aiSynthesisRisk: 86,
    riskLevel: 'CRITICAL',
    verdict: 'CONFIRMED_AI_CLONE',
    detectedAcousticModel: 'Neural Diffusion TTS + HiFi-GAN Vocoder (Clone Pattern)',
    audioDurationSeconds: 8.4,
    audioWaveformData: [12, 28, 45, 62, 78, 65, 82, 90, 84, 60, 42, 25, 10, 15, 40, 68, 85, 92, 88, 70, 50, 32, 18, 5, 20, 55, 75, 88, 95, 89, 66, 45, 22, 8, 14, 48, 72, 89, 94, 82, 58, 36, 19, 8],
    frequencyBinsData: [45, 68, 89, 94, 88, 72, 54, 38, 22, 12, 4, 0, 0, 0, 0, 0], // Sharp cutoff above 16kHz
    acousticMetrics: {
      pitchMeanHz: 124.5,
      pitchVariance: 3.2, // Supernaturally monotonic pitch
      jitterPercentage: 0.14, // Abnormally low jitter (organic human jitter is 0.5 - 1.5%)
      shimmerDb: 0.08,
      spectralCentroidHz: 2180,
      melCepstralConsistency: 42,
      neuralVocoderArtifactsRisk: 91,
      spectralCutoffDetected: true, // Typical 16kHz vocoder ceiling
      microTremorPresence: false, // Vocal cords lack biological muscular micro-tremors
      backgroundAcousticNoisePurity: 99.4, // Complete artificial silence between syllables
      speechRateSyllablesPerSec: 4.8
    },
    synthesisIndicators: [
      'Hard acoustic frequency cutoff observed at 16.0 kHz (HiFi-GAN vocoder signature).',
      'Monotonic pitch distribution with micro-pitch variance of only 3.2 Hz (Unnatural vocal steadiness).',
      'Absence of physiological sub-glottal resonant jitter (Jitter 0.14% vs Normal 0.85%).',
      'Phase incoherence across contiguous formants F1 and F2 during consonant transitions.',
      'Uncanny inter-word noise floor dropout (-92dB unnatural black silence).'
    ],
    speakerProfile: {
      isEnrolledProfile: true,
      enrolledSpeakerName: 'RAJESH SHARMA',
      enrolledSpeakerRole: 'Senior VP Treasury (Enrolled Voiceprint Ref #VP-0091)',
      speakerSimilarityScore: 32, // Sounds superficially similar to untrained ear, but embedding distance is massive
      classification: 'AI_CLONE_OF_ENROLLED_SPEAKER',
      voiceEmbeddingDistance: 0.68, // Distance > 0.45 indicates non-genuine speaker
      baselinePitchMatch: 45,
      prosodySimilarity: 28,
      profileLastVerifiedDate: '2026-06-15',
      explanation: 'While the acoustic timbre superficially resembles enrolled VP Rajesh Sharma, deep cosine embedding distance (0.68) and neural TTS artifacts confirm this is an AI-generated synthetic voice clone attempt.'
    }
  },
  {
    sampleTitle: 'Live Verification Call — Priya Sundaram (Natural Human Voice)',
    authenticityScore: 94,
    aiSynthesisRisk: 6,
    riskLevel: 'SAFE',
    verdict: 'ORGANIC_HUMAN_VOICE',
    detectedAcousticModel: 'Natural Biological Human Vocal Tract',
    audioDurationSeconds: 6.2,
    audioWaveformData: [8, 19, 38, 55, 68, 72, 85, 76, 60, 48, 35, 22, 14, 28, 52, 70, 84, 79, 62, 45, 30, 18, 12, 25, 48, 65, 80, 88, 74, 58, 40, 24, 15, 32, 59, 78, 86, 75, 54, 38, 20, 10],
    frequencyBinsData: [52, 74, 85, 80, 72, 65, 58, 49, 42, 36, 28, 22, 17, 12, 8, 5], // Natural high frequency presence up to 22kHz+
    acousticMetrics: {
      pitchMeanHz: 215.2,
      pitchVariance: 18.6,
      jitterPercentage: 0.88, // Healthy human jitter
      shimmerDb: 0.32,
      spectralCentroidHz: 2890,
      melCepstralConsistency: 94,
      neuralVocoderArtifactsRisk: 5,
      spectralCutoffDetected: false,
      microTremorPresence: true,
      backgroundAcousticNoisePurity: 78.5, // Natural room impulse
      speechRateSyllablesPerSec: 4.1
    },
    synthesisIndicators: [
      'Normal biological physiological vocal tract resonance present.',
      'Healthy laryngeal jitter (0.88%) and natural breath micro-variations.',
      'Full-spectrum acoustic energy up to 22kHz with zero artificial brick-wall filtering.',
      'Natural ambient acoustic reverberation consistent with indoor office environment.'
    ],
    speakerProfile: {
      isEnrolledProfile: true,
      enrolledSpeakerName: 'PRIYA SUNDARAM',
      enrolledSpeakerRole: 'Priority Banking Customer #PB-9182',
      speakerSimilarityScore: 96,
      classification: 'GENUINE_ENROLLED_SPEAKER',
      voiceEmbeddingDistance: 0.12,
      baselinePitchMatch: 95,
      prosodySimilarity: 94,
      profileLastVerifiedDate: '2026-07-20',
      explanation: 'High biometric voice cosine similarity (96%) and 100% natural organic speech features. Highly confident match with enrolled profile.'
    }
  },
  {
    sampleTitle: 'Audio Recording — Amit Verma (Genuine Human, Unenrolled)',
    authenticityScore: 91,
    aiSynthesisRisk: 9,
    riskLevel: 'LOW',
    verdict: 'ORGANIC_HUMAN_VOICE',
    detectedAcousticModel: 'Natural Biological Human Vocal Tract',
    audioDurationSeconds: 5.8,
    audioWaveformData: [14, 25, 42, 60, 75, 82, 70, 52, 38, 20, 15, 30, 55, 78, 89, 75, 60, 42, 28, 16, 22, 49, 71, 85, 79, 62, 45, 29, 18, 35, 61, 80, 86, 72, 51, 33, 19, 11],
    frequencyBinsData: [48, 70, 82, 78, 68, 60, 52, 45, 39, 31, 24, 18, 14, 9, 6, 3],
    acousticMetrics: {
      pitchMeanHz: 138.4,
      pitchVariance: 14.2,
      jitterPercentage: 0.94,
      shimmerDb: 0.29,
      spectralCentroidHz: 2340,
      melCepstralConsistency: 89,
      neuralVocoderArtifactsRisk: 8,
      spectralCutoffDetected: false,
      microTremorPresence: true,
      backgroundAcousticNoisePurity: 82.1,
      speechRateSyllablesPerSec: 3.9
    },
    synthesisIndicators: [
      'Natural biological vocal tract resonances detected.',
      'Zero synthetic phase anomalies.'
    ],
    speakerProfile: {
      isEnrolledProfile: false,
      speakerSimilarityScore: 18,
      classification: 'UNKNOWN_UNENROLLED_SPEAKER',
      voiceEmbeddingDistance: 0.82,
      baselinePitchMatch: 20,
      prosodySimilarity: 25,
      explanation: 'Organic natural human voice, but no existing baseline profile found in trusted speaker enrollment database.'
    }
  }
];

export const SAMPLE_CONTEXT_SCENARIOS: ContextualFraudData[] = [
  {
    callerPhoneNumber: '+91 98200 99881 (Spoofed CLI Signature)',
    callerDisplayName: 'RAJESH SHARMA (CFO/VP Claim)',
    callerSpoofProbability: 88,
    targetDepartment: 'Corporate Treasury & RTGS High-Value Desk',
    transactionAmountInr: 5000000, // ₹50 Lakhs ($60,000 USD)
    transactionType: 'WIRE_TRANSFER',
    isHighValueTransaction: true,
    urgencyLanguageScore: 92,
    interactionTime: '2026-08-24 19:42 IST (After-Hours)',
    isAfterHours: true,
    deviceFingerprint: 'DEV-UNKNOWN-TOR-NODE-781',
    isNewDevice: true,
    ipGeoLocation: 'Bucharest, Romania (Anomalous IP vs Claimed Mumbai Office)',
    isVpnOrProxy: true,
    previousFailedAttemptsCount: 2,
    contextRiskLevel: 'CRITICAL',
    riskReasons: [
      'High-Value Wire Request (₹50,00,000) flagged by AML threshold policies.',
      'Caller ID signaling attributes match known VOIP PBX spoofing pattern (+91 98200 99881).',
      'High Social Engineering Urgency index (92%): Demanded "Immediate wire release without secondary callback".',
      'Interaction originated after official RTGS treasury operating hours (19:42 IST).',
      'Anomalous routing through Tor/VPN proxy in Eastern Europe while claiming physical presence in Mumbai.'
    ]
  },
  {
    callerPhoneNumber: '+91 94441 23091 (Verified SIM IMSI)',
    callerDisplayName: 'PRIYA SUNDARAM',
    callerSpoofProbability: 2,
    targetDepartment: 'Retail Banking Services',
    transactionAmountInr: 15000,
    transactionType: 'WIRE_TRANSFER',
    isHighValueTransaction: false,
    urgencyLanguageScore: 8,
    interactionTime: '2026-08-24 11:30 IST (Business Hours)',
    isAfterHours: false,
    deviceFingerprint: 'DEV-IPHONE-15-CH-48192',
    isNewDevice: false,
    ipGeoLocation: 'Chennai, Tamil Nadu, India (Consistent with Home Branch)',
    isVpnOrProxy: false,
    previousFailedAttemptsCount: 0,
    contextRiskLevel: 'SAFE',
    riskReasons: [
      'Low value routine transaction within historical monthly velocity.',
      'Hardware device fingerprint matched enrolled customer device.',
      'Zero spoofing or VPN anomalies.'
    ]
  }
];

export const DEMO_SECURITY_CASES: SecurityCase[] = [
  {
    id: 'case-ts-2026-00124',
    caseNumber: 'TS-2026-00124',
    subjectName: 'RAJESH SHARMA (Alleged Impersonation)',
    claimedIdentity: 'Senior VP Treasury — Global Bank Corp',
    timestamp: '2026-08-24 19:44:12 IST',
    riskLevel: 'CRITICAL',
    identityTrustScore: 18,
    threatType: 'MULTIMODAL_SOCIAL_ENGINEERING',
    status: 'BLOCKED',
    assignedOfficer: 'Vikram Mehta (Chief SOC Analyst)',
    transactionAmount: 5000000,
    notes: [
      {
        author: 'System Auto-Defense',
        timestamp: '19:44:13 IST',
        text: 'Automated policy rule #SEC-POL-01 triggered: Identity Trust Score (18/100) is below CRITICAL threshold (50). Wire transfer of ₹50 Lakhs immediately blocked.'
      },
      {
        author: 'Vikram Mehta',
        timestamp: '19:48:00 IST',
        text: 'Conducted out-of-band independent callback to genuine VP Rajesh Sharma registered executive cell. Genuine executive confirmed he was at home and never initiated this wire transfer.'
      }
    ],
    multimodalResult: {
      caseId: 'TS-2026-00124',
      timestamp: '2026-08-24 19:44:12 IST',
      identityTrustScore: 18,
      compositeRiskScore: 82,
      riskLevel: 'CRITICAL',
      recommendedAction: 'BLOCK_IMMEDIATE',
      primarySummary: 'CRITICAL MULTIMODAL IMPERSONATION ATTACK: High-fidelity AI voice clone (18% authenticity) combined with manipulated identity card (78% tamper risk) and high-value wire pressure (₹50 Lakhs).',
      documentAnalysis: SAMPLE_DOCUMENTS[0].tampering,
      documentInfo: SAMPLE_DOCUMENTS[0],
      faceVerification: {
        matchScore: 84,
        verdict: 'POSSIBLE_MATCH',
        livenessScore: 48,
        qualityScore: 78,
        faceDetectedInDoc: true,
        faceDetectedInLive: true,
        multipleFacesDetected: false,
        landmarkConfidence: 88,
        lightingCondition: 'OPTIMAL',
        biometricDistance: 0.38,
        extractedFaceUrl: SAMPLE_DOCUMENTS[0].extractedPhotoUrl,
        livePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      },
      voiceAnalysis: SAMPLE_VOICE_PROFILES[0],
      speakerConsistency: SAMPLE_VOICE_PROFILES[0].speakerProfile,
      contextualData: SAMPLE_CONTEXT_SCENARIOS[0],
      explainableFactors: [
        {
          factor: 'AI Voice Cloning Detected',
          impactScore: +34,
          category: 'VOICE',
          severity: 'CRITICAL',
          description: 'Acoustic spectral cutoff at 16kHz and missing vocal jitter (0.14%) confirm neural speech synthesis.'
        },
        {
          factor: 'Voiceprint Mismatch to Enrolled VP Profile',
          impactScore: +22,
          category: 'SPEAKER',
          severity: 'CRITICAL',
          description: 'Voice cosine distance (0.68) deviates substantially from verified executive voiceprint.'
        },
        {
          factor: 'Document Font & Photo Tampering',
          impactScore: +16,
          category: 'DOCUMENT',
          severity: 'WARNING',
          description: 'DOB font mismatch and digital layer splicing around portrait perimeter.'
        },
        {
          factor: 'High-Value Social Engineering Pressure',
          impactScore: +10,
          category: 'CONTEXT',
          severity: 'WARNING',
          description: '₹50,00,000 transaction with spoofed phone header from anomalous IP location.'
        }
      ],
      auditLog: [
        {
          actionTaken: 'Document OCR & Tampering Scan Completed',
          timestamp: '19:43:02 IST',
          officer: 'Automated Pipeline'
        },
        {
          actionTaken: 'Audio Spectrogram & Neural Vocoder Analysis Completed',
          timestamp: '19:43:45 IST',
          officer: 'Automated Pipeline'
        },
        {
          actionTaken: 'Multimodal Fusion Engine Evaluated Composite Trust Score: 18/100',
          timestamp: '19:44:12 IST',
          officer: 'TrustShield Core Engine'
        },
        {
          actionTaken: 'AUTOMATED BLOCK: Transaction Halted, Security Incident Opened',
          timestamp: '19:44:13 IST',
          officer: 'System Interceptor'
        }
      ],
      mitigationSteps: [
        'Immediate termination of active session and lock on beneficiary account.',
        'Trigger independent out-of-band callback to verified executive phone.',
        'File cyber incident report with bank fraud intelligence unit.',
        'Blacklist incoming caller IP range (Bucharest proxy).'
      ]
    }
  },
  {
    id: 'case-ts-2026-00123',
    caseNumber: 'TS-2026-00123',
    subjectName: 'PRIYA SUNDARAM',
    claimedIdentity: 'Priority Banking Customer',
    timestamp: '2026-08-24 11:32:05 IST',
    riskLevel: 'SAFE',
    identityTrustScore: 95,
    threatType: 'GENUINE_VERIFICATION',
    status: 'APPROVED_SECONDARY',
    assignedOfficer: 'Ananya Roy (Senior KYC Officer)',
    transactionAmount: 15000,
    notes: [
      {
        author: 'Ananya Roy',
        timestamp: '11:33:10 IST',
        text: 'Clean multimodal verification. Genuine passport with flawless MRZ checksum, 96% face biometric match, 94% organic voice authenticity.'
      }
    ],
    multimodalResult: {
      caseId: 'TS-2026-00123',
      timestamp: '2026-08-24 11:32:05 IST',
      identityTrustScore: 95,
      compositeRiskScore: 5,
      riskLevel: 'SAFE',
      recommendedAction: 'ALLOW',
      primarySummary: 'GENUINE IDENTITY VERIFIED: Document authenticity (96%), Face match (96%), and Voice authenticity (94%) all confirmed genuine.',
      documentAnalysis: SAMPLE_DOCUMENTS[1].tampering,
      documentInfo: SAMPLE_DOCUMENTS[1],
      faceVerification: {
        matchScore: 96,
        verdict: 'MATCH',
        livenessScore: 94,
        qualityScore: 98,
        faceDetectedInDoc: true,
        faceDetectedInLive: true,
        multipleFacesDetected: false,
        landmarkConfidence: 97,
        lightingCondition: 'OPTIMAL',
        biometricDistance: 0.08,
        extractedFaceUrl: SAMPLE_DOCUMENTS[1].extractedPhotoUrl,
        livePhotoUrl: SAMPLE_DOCUMENTS[1].extractedPhotoUrl
      },
      voiceAnalysis: SAMPLE_VOICE_PROFILES[1],
      speakerConsistency: SAMPLE_VOICE_PROFILES[1].speakerProfile,
      contextualData: SAMPLE_CONTEXT_SCENARIOS[1],
      explainableFactors: [
        {
          factor: 'Genuine ICAO 9303 Passport MRZ & Cryptographic Checksum',
          impactScore: -25,
          category: 'DOCUMENT',
          severity: 'POSITIVE',
          description: 'Passport security features and optical guilloché patterns fully authentic.'
        },
        {
          factor: 'High Biometric Facial Landmark Match',
          impactScore: -20,
          category: 'FACE',
          severity: 'POSITIVE',
          description: '96% confidence score across 68 facial fiducial landmark coordinates.'
        },
        {
          factor: 'Natural Human Voice Acoustics',
          impactScore: -20,
          category: 'VOICE',
          severity: 'POSITIVE',
          description: 'Authentic vocal tract micro-tremors and full-bandwidth acoustic resonance.'
        },
        {
          factor: 'Enrolled Speaker Voiceprint Match',
          impactScore: -15,
          category: 'SPEAKER',
          severity: 'POSITIVE',
          description: 'Cosine similarity 96% with registered customer voice profile.'
        }
      ],
      auditLog: [
        {
          actionTaken: 'Multimodal KYC Automated Clearance',
          timestamp: '11:32:05 IST',
          officer: 'TrustShield Core Engine'
        }
      ],
      mitigationSteps: [
        'Proceed with normal transaction authorization.'
      ]
    }
  },
  {
    id: 'case-ts-2026-00122',
    caseNumber: 'TS-2026-00122',
    subjectName: 'AMIT VERMA',
    claimedIdentity: 'Loan Applicant #LN-4921',
    timestamp: '2026-08-24 09:15:30 IST',
    riskLevel: 'HIGH',
    identityTrustScore: 38,
    threatType: 'DOCUMENT_FORGERY',
    status: 'UNDER_INVESTIGATION',
    assignedOfficer: 'Siddharth Nair',
    transactionAmount: 850000,
    notes: [
      {
        author: 'Siddharth Nair',
        timestamp: '09:20:00 IST',
        text: 'Document has edited expiry date and is expired in government records. Flagged for secondary document re-submission.'
      }
    ],
    multimodalResult: {
      caseId: 'TS-2026-00122',
      timestamp: '2026-08-24 09:15:30 IST',
      identityTrustScore: 38,
      compositeRiskScore: 62,
      riskLevel: 'HIGH',
      recommendedAction: 'SECONDARY_REVIEW',
      primarySummary: 'SUSPICIOUS IDENTITY ARTIFACTS: Driving License shows modified expiration date; applicant voice is natural human but document integrity failed.',
      documentAnalysis: SAMPLE_DOCUMENTS[2].tampering,
      documentInfo: SAMPLE_DOCUMENTS[2],
      faceVerification: {
        matchScore: 89,
        verdict: 'MATCH',
        livenessScore: 82,
        qualityScore: 88,
        faceDetectedInDoc: true,
        faceDetectedInLive: true,
        multipleFacesDetected: false,
        landmarkConfidence: 91,
        lightingCondition: 'OPTIMAL',
        biometricDistance: 0.16,
        extractedFaceUrl: SAMPLE_DOCUMENTS[2].extractedPhotoUrl,
        livePhotoUrl: SAMPLE_DOCUMENTS[2].extractedPhotoUrl
      },
      voiceAnalysis: SAMPLE_VOICE_PROFILES[2],
      speakerConsistency: SAMPLE_VOICE_PROFILES[2].speakerProfile,
      contextualData: {
        ...SAMPLE_CONTEXT_SCENARIOS[1],
        transactionAmountInr: 850000,
        transactionType: 'LOAN_DISBURSEMENT',
        isHighValueTransaction: true,
        contextRiskLevel: 'MEDIUM',
        riskReasons: ['Loan application with modified ID document validity date.']
      },
      explainableFactors: [
        {
          factor: 'Document Expiry Date Manipulation',
          impactScore: +28,
          category: 'DOCUMENT',
          severity: 'CRITICAL',
          description: 'Pasted date box over original expiration text.'
        },
        {
          factor: 'Unenrolled Speaker',
          impactScore: +8,
          category: 'SPEAKER',
          severity: 'WARNING',
          description: 'No prior voice baseline profile available.'
        }
      ],
      auditLog: [
        {
          actionTaken: 'Document Forensic Tamper Flag Raised',
          timestamp: '09:15:30 IST',
          officer: 'Automated Pipeline'
        }
      ],
      mitigationSteps: [
        'Request original physical government ID verification at branch.',
        'Hold loan disbursement until secondary KYC clearance.'
      ]
    }
  }
];

export const MOCK_SOC_STATS: SocMetricStats = {
  totalVerificationsToday: 1428,
  documentsScanned: 1428,
  highRiskCases: 37,
  criticalAlerts: 12,
  voiceThreatsBlocked: 19,
  faceMismatches: 14,
  tamperedDocumentsDetected: 26,
  blockedTransactionsValueInr: 48250000, // ₹4.82 Crore ($580k+)
  averageTrustScore: 84.6,
  systemHealthStatus: 'OPERATIONAL'
};

export const MOCK_LIVE_ALERTS: LiveAlert[] = [
  {
    id: 'alt-1',
    caseId: 'TS-2026-00124',
    timestamp: '2 mins ago',
    level: 'CRITICAL',
    title: 'AI Voice Cloning & Executive Impersonation Blocked',
    description: 'Neural TTS voice clone impersonating VP Rajesh Sharma detected during ₹50 Lakh wire transfer authorization.',
    threatCategory: 'VOICE_CLONE',
    source: 'Voice Defense Engine + Context Core',
    read: false
  },
  {
    id: 'alt-2',
    caseId: 'TS-2026-00123',
    timestamp: '8 mins ago',
    level: 'LOW',
    title: 'Multimodal KYC Verified Clean',
    description: 'Case #TS-2026-00123 passed all 5 biometric and document integrity checks with 95/100 Trust Score.',
    threatCategory: 'DOC_TAMPER',
    source: 'Multimodal Engine',
    read: true
  },
  {
    id: 'alt-3',
    caseId: 'TS-2026-00122',
    timestamp: '15 mins ago',
    level: 'HIGH',
    title: 'Document Tampering Detected in Loan Application',
    description: 'Digital font manipulation and altered validity date on Driving License for ₹8.5 Lakh loan request.',
    threatCategory: 'DOC_TAMPER',
    source: 'Document Forensic Scanner',
    read: false
  },
  {
    id: 'alt-4',
    caseId: 'TS-2026-00119',
    timestamp: '32 mins ago',
    level: 'HIGH',
    title: 'Deepfake Voice Call Attempt on Call Center',
    description: 'Inbound customer service caller exhibited spectral cutoff and synthetic prosody during password reset request.',
    threatCategory: 'VOICE_CLONE',
    source: 'Real-time Telephony Interceptor',
    read: false
  },
  {
    id: 'alt-5',
    caseId: 'TS-2026-00114',
    timestamp: '54 mins ago',
    level: 'MEDIUM',
    title: 'Biometric Face Mismatch on Remote Onboarding',
    description: 'Live selfie camera match score 42% against passport portrait. Step-up liveness check requested.',
    threatCategory: 'FACE_MISMATCH',
    source: 'Biometric Face Matcher',
    read: true
  }
];

export const DEFAULT_POLICY_SETTINGS: SystemPolicySettings = {
  allowThreshold: 80,
  secondaryReviewThreshold: 50,
  blockThreshold: 49,
  minTrustScoreForAllow: 80,
  blockThresholdScore: 40,
  highValueTransactionThresholdInr: 5000000,
  enableVoiceCloneDefense: true,
  enableDocumentTamperELA: true,
  requireOutOfBandCallbackForHighValue: true,
  requireLiveLivenessCheck: true,
  dataRetentionDays: 30,
  enrolledSpeakers: [
    {
      speakerId: 'spk-01',
      name: 'Rajesh Sharma',
      roleTitle: 'Senior Vice President of Treasury',
      enrolledAt: '12 Jan 2025',
      voiceEmbeddingVectorSize: 512,
      confidenceBaseline: 98.6
    },
    {
      speakerId: 'spk-02',
      name: 'Ananya Roy',
      roleTitle: 'Chief Financial Officer',
      enrolledAt: '04 Feb 2025',
      voiceEmbeddingVectorSize: 512,
      confidenceBaseline: 99.1
    },
    {
      speakerId: 'spk-03',
      name: 'Vikram Mehta',
      roleTitle: 'Managing Director, Commercial Banking',
      enrolledAt: '18 Feb 2025',
      voiceEmbeddingVectorSize: 512,
      confidenceBaseline: 97.8
    }
  ],
  enableAiVoiceInterception: true,
  enableAutomaticOtpChallenge: true,
  enableIndependentCallbackEnforcement: true,
  requireSupervisorForOver50Lakh: true,
  dataPrivacyMode: 'MINIMAL_RETENTION',
  biometricRetentionHours: 24,
  voiceFeatureOnlyMode: true,
  multilingualAcousticModelsEnabled: true
};
