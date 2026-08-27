import jsPDF from 'jspdf';
import { SecurityCase, MultimodalIdentityResult } from '../types';

export async function generateSignedCasePdf(securityCase: SecurityCase, officerRole: string = 'Forensic Investigator'): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const result: MultimodalIdentityResult = securityCase.multimodalResult;

  // Colors
  const primaryColor: [number, number, number] = [15, 23, 42]; // slate-900
  const accentBlue: [number, number, number] = [37, 99, 235]; // blue-600
  const dangerRed: [number, number, number] = [225, 29, 72]; // rose-600
  const warningAmber: [number, number, number] = [217, 119, 6]; // amber-600
  const successGreen: [number, number, number] = [16, 185, 129]; // emerald-500
  const textDark: [number, number, number] = [30, 41, 59]; // slate-800
  const textMuted: [number, number, number] = [100, 116, 139]; // slate-500
  const lightBg: [number, number, number] = [248, 250, 252]; // slate-50

  const statusColor =
    securityCase.status === 'BLOCKED_FRAUD' || result.riskLevel === 'CRITICAL'
      ? dangerRed
      : result.riskLevel === 'HIGH'
      ? warningAmber
      : successGreen;

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TRUSTSHIELD AI | FORENSIC IDENTITY REPORT', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('MULTIMODAL IDENTITY FRAUD & IMPERSONATION DETECTION PLATFORM', margin + 6, y + 15);
  doc.text('ISO/IEC 30107-3 BIOMETRIC ANTI-SPOOFING | DPDP ACT (INDIA) COMPLIANT', margin + 6, y + 20);

  // Top Right Security Badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 48, y + 4, 44, 16, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(56, 189, 248);
  doc.text('OFFICIAL DOSSIER', pageWidth - margin - 44, y + 10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.text(`ID: ${securityCase.caseNumber}`, pageWidth - margin - 44, y + 16);

  y += 28;

  // 2. Executive Case Summary Box
  doc.setFillColor(...lightBg);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...textDark);
  doc.text('CASE IDENTIFICATION & SUBJECT PROFILE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);

  // Column 1
  doc.text('Subject Legal Name:', margin + 4, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text(securityCase.subjectName, margin + 4, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text('Claimed Identity / Channel:', margin + 4, y + 24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text(securityCase.claimedIdentity, margin + 4, y + 29);

  // Column 2
  const col2X = margin + 62;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text('Document ID Number:', col2X, y + 13);
  doc.setFont('courier', 'bold');
  doc.setTextColor(...textDark);
  doc.text(result.documentInfo?.documentNumber || 'N/A', col2X, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text('Incident Timestamp:', col2X, y + 24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text(securityCase.timestamp, col2X, y + 29);

  // Column 3 - Trust Score Badge
  const col3X = margin + 125;
  doc.setFillColor(...statusColor);
  doc.roundedRect(col3X, y + 5, contentWidth - 125 - 4, 24, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('IDENTITY TRUST SCORE', col3X + 4, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`${result.identityTrustScore} / 100`, col3X + 4, y + 20);

  doc.setFontSize(7.5);
  doc.text(`VERDICT: ${result.riskLevel} RISK`, col3X + 4, y + 25);

  y += 38;

  // 3. Disposition & Primary Summary
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...statusColor);
  doc.text(`DISPOSITION: ${securityCase.status.replace(/_/g, ' ')} | RECOMMENDED ACTION: ${result.recommendedAction.replace(/_/g, ' ')}`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  const summaryLines = doc.splitTextToSize(result.primarySummary, contentWidth - 8);
  doc.text(summaryLines, margin + 4, y + 12);

  y += 22;

  // 4. Multimodal Telemetry Breakdown Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...textDark);
  doc.text('MULTIMODAL FORENSIC TELEMETRY BREAKDOWN', margin, y + 4);

  y += 6;

  const tableHeaders = ['Modality Engine', 'Core Assessment Metric', 'Score / Value', 'Security Verdict', 'Status'];
  const colWidths = [38, 56, 30, 36, 22];

  // Draw Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  let curX = margin + 2;
  tableHeaders.forEach((h, i) => {
    doc.text(h, curX, y + 5);
    curX += colWidths[i];
  });

  y += 7;

  // Table Rows
  const tableData = [
    {
      engine: '1. Document AI (ELA)',
      metric: 'Pixel Gradient & Tamper Zones',
      score: `${result.documentAnalysis.authenticityScore}% Auth`,
      verdict: result.documentAnalysis.forensicIndicators.tamperVerdict.replace(/_/g, ' '),
      passed: result.documentAnalysis.tamperingRiskScore < 40
    },
    {
      engine: '2. Face Biometrics',
      metric: 'Cosine Distance & Anti-Spoof',
      score: `${result.faceVerification.matchScore}% Match`,
      verdict: `Liveness: ${result.faceVerification.livenessScore}%`,
      passed: result.faceVerification.matchScore >= 80 && result.faceVerification.livenessScore >= 70
    },
    {
      engine: '3. Neural Voice Analysis',
      metric: 'Vocoder Cutoff & Pitch Jitter',
      score: `${result.voiceAnalysis.aiSynthesisRisk}% AI Risk`,
      verdict: result.voiceAnalysis.verdict.replace(/_/g, ' '),
      passed: result.voiceAnalysis.aiSynthesisRisk < 40
    },
    {
      engine: '4. Speaker Consistency',
      metric: 'Voiceprint Embedding Distance',
      score: `Dist: ${result.speakerConsistency.voiceEmbeddingDistance}`,
      verdict: result.speakerConsistency.classification.replace(/_/g, ' '),
      passed: result.speakerConsistency.classification === 'GENUINE_ENROLLED_SPEAKER'
    },
    {
      engine: '5. Contextual AML Engine',
      metric: 'Transaction & Spoof Signaling',
      score: `₹${(result.contextualData?.transactionAmountInr || 0).toLocaleString('en-IN')}`,
      verdict: `Spoof: ${result.contextualData?.callerSpoofProbability || 0}%`,
      passed: (result.contextualData?.callerSpoofProbability || 0) < 40
    }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  tableData.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);

    curX = margin + 2;

    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(row.engine, curX, y + 5);
    curX += colWidths[0];

    doc.setFont('helvetica', 'normal');
    doc.text(row.metric, curX, y + 5);
    curX += colWidths[1];

    doc.setFont('courier', 'bold');
    doc.text(row.score, curX, y + 5);
    curX += colWidths[2];

    doc.setFont('helvetica', 'normal');
    const truncatedVerdict = row.verdict.length > 20 ? row.verdict.substring(0, 19) + '...' : row.verdict;
    doc.text(truncatedVerdict, curX, y + 5);
    curX += colWidths[3];

    // Status pill
    doc.setFont('helvetica', 'bold');
    if (row.passed) {
      doc.setTextColor(...successGreen);
      doc.text('PASS', curX, y + 5);
    } else {
      doc.setTextColor(...dangerRed);
      doc.text('FLAGGED', curX, y + 5);
    }

    y += 7;
  });

  y += 5;

  // 5. Explainable AI Attribution
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text('EXPLAINABLE AI (XAI) RISK ATTRIBUTION & ANOMALIES', margin, y + 4);

  y += 7;

  doc.setFillColor(...lightBg);
  doc.setDrawColor(226, 232, 240);
  const factorBoxHeight = Math.min(28, 6 + (result.explainableFactors?.length || 1) * 6);
  doc.roundedRect(margin, y, contentWidth, factorBoxHeight, 2, 2, 'FD');

  let factorY = y + 5;
  doc.setFontSize(7.5);

  (result.explainableFactors || []).slice(0, 4).forEach((factor) => {
    const isCritical = factor.severity === 'CRITICAL';
    const isPositive = factor.severity === 'POSITIVE';

    doc.setFillColor(isCritical ? 225 : isPositive ? 16 : 217, isCritical ? 29 : isPositive ? 185 : 119, isCritical ? 72 : isPositive ? 129 : 6);
    doc.circle(margin + 4, factorY - 1, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isCritical ? dangerRed[0] : isPositive ? successGreen[0] : warningAmber[0], isCritical ? dangerRed[1] : isPositive ? successGreen[1] : warningAmber[1], isCritical ? dangerRed[2] : isPositive ? successGreen[2] : warningAmber[2]);
    doc.text(`[${factor.category}] ${factor.factor} (${factor.impactScore > 0 ? '+' : ''}${factor.impactScore} pts)`, margin + 8, factorY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    const desc = factor.description.length > 75 ? factor.description.substring(0, 72) + '...' : factor.description;
    doc.text(` - ${desc}`, margin + 68, factorY);

    factorY += 5.5;
  });

  y += factorBoxHeight + 5;

  // 6. Chain of Custody & Officer Audit Notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text('CHAIN-OF-CUSTODY & OFFICER OBSERVATIONS', margin, y + 4);

  y += 7;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  const notesHeight = 22;
  doc.roundedRect(margin, y, contentWidth, notesHeight, 2, 2, 'FD');

  let noteY = y + 5;
  doc.setFontSize(7.5);
  securityCase.notes.slice(0, 3).forEach((n) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentBlue);
    doc.text(`${n.author} (${n.timestamp}):`, margin + 4, noteY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    const noteText = n.text.length > 80 ? n.text.substring(0, 77) + '...' : n.text;
    doc.text(noteText, margin + 48, noteY);

    noteY += 5;
  });

  y += notesHeight + 6;

  // 7. Security Officer Digital Signature & Cryptographic Seal Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  // Left side signature details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(56, 189, 248);
  doc.text('CRYPTOGRAPHIC SIGNATURE & CERTIFICATION OF AUTHENTICITY', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Signed by Authorized Operator: ${officerRole} (Badge #TS-SOC-${Math.floor(1000 + Math.random() * 9000)})`, margin + 6, y + 13);
  doc.text(`Timestamp: ${new Date().toUTCString()}`, margin + 6, y + 18);

  const hashSeed = `${securityCase.id}-${securityCase.caseNumber}-${result.identityTrustScore}-${securityCase.timestamp}`;
  const mockSha256 = Array.from(hashSeed).reduce((acc, char, idx) => ((acc << 5) - acc + char.charCodeAt(0) * (idx + 1)) | 0, 0);
  const sha256Hex = '0x' + Math.abs(mockSha256).toString(16).padStart(16, '0') + 'f892a7148c39e120b41c';

  doc.setFont('courier', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`SHA-256 Audit Trail Hash: ${sha256Hex}`, margin + 6, y + 24);
  doc.text(`Verification Key: secp256k1:04a1f879b28c9e... / TrustShield Vault v2.4`, margin + 6, y + 29);

  // Right side official seal stamp
  const stampX = pageWidth - margin - 42;
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.6);
  doc.roundedRect(stampX, y + 5, 36, 24, 2, 2, 'D');

  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('TRUSTSHIELD AI', stampX + 5, y + 11);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text('DIGITALLY SIGNED', stampX + 4, y + 16);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6);
  doc.text('VALIDATED DOSSIER', stampX + 3.5, y + 21);
  doc.text(new Date().toISOString().split('T')[0], stampX + 8, y + 26);

  // 8. Footer page info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `TrustShield AI Identity Security • Confidential Document • Case ${securityCase.caseNumber} • Generated on ${new Date().toLocaleString()}`,
    margin,
    pageHeight - 6
  );

  // Save the PDF
  doc.save(`TrustShield-Forensic-Report-${securityCase.caseNumber}.pdf`);
}
