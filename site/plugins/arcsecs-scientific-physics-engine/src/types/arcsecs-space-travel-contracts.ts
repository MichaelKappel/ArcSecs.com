/**
 * Runtime-safe parsec navigation contract for the Space Travel Mission Simulator.
 */
export interface ParsecNavigationState {
  uiPositionX: number;
  uiPositionY: number;
  uiVelocityX: number;
  uiVelocityY: number;
  headingDegrees: number;
  relationalArcsecsX: number;
  relationalArcsecsY: number;
  relationalArcsecsDelta: number;
  relationalParsecsToBeacon: number;
  relationalParsecsTraveled: number;
  parsecsPerMissionTick: number;
  parsecsPerSimulatedHour: number;
  parsecVelocity: string;
  kmPerSecondEquivalent: number;
  angularHeadingArcsecs: number;
  tetradAlignmentDegrees: number;
  torsionGaugeForceMagnitude: number;
  weberDragCoefficient: number;
  nativeUnit: "parsec";
  legacyLightYearLabel: "deprecated/legacy comparison only";
  finite: boolean;
}

/**
 * Surface-density contract for dense, void, torsion, and beacon regions.
 */
export interface RegionSurfaceDensityRow {
  regionType: string;
  regionName: string;
  centerArcsecsX: number;
  centerArcsecsY: number;
  boundaryRadiusArcsecs: number;
  approximateAreaSquareParsecs: number;
  averageSubstrateDensity: number;
  peakSubstrateDensity: number;
  densityPerSquareParsec: number;
  opticalBlurArcsecs: number;
  fuelPotential: number;
  thermalRisk: number;
  torsionRisk: number;
  photonLagRisk: number;
}

/**
 * Exportable region state for square-parsec gameplay.
 */
export interface RegionSurfaceDensityState {
  nativeAreaUnit: "square parsecs";
  regions: RegionSurfaceDensityRow[];
  routeAreaCrossedSquareParsecs: number;
  currentRegionType: string;
  currentRegionAreaSquareParsecs: number;
  currentRegionDensityPerSquareParsec: number;
  finite: boolean;
}

/**
 * Exportable wavefront tracker state for gravity-first and light-later behavior.
 */
export interface WavefrontTrackerState {
  active: boolean;
  gravityWaveEta: string;
  photonEta: string;
  photonLag: number;
  photonEnergyRemaining: number;
  opticalDelay: number;
  substrateRefractiveIndex: number;
  lineOfSightDensityIntegral: number;
  gravityRadius: number;
  photonRadius: number;
  trackerStatus: string;
  finite: boolean;
}

/**
 * Exportable route-advisor contract used by the evidence packet.
 */
export interface RouteAdvisorState {
  currentRegionType: string;
  currentRisk: number;
  bestNextAction: string;
  advisorMessage: string;
  denseHarvestWorthIt: boolean;
  voidCoastRecommended: boolean;
  photonLagWarning: boolean;
  thermalWarning: boolean;
  beaconApproachRecommended: boolean;
  finite: boolean;
}

/**
 * Mission outcome contract for falsification-first export review.
 */
export interface MissionOutcomeState {
  missionOutcome: "Ready" | "In Progress" | "Beacon Reached" | "Fuel Depleted" | "Thermal Abort" | "Torsion Drift Failure" | "Evidence Exported" | "Mission Complete";
  missionPhase: string;
  missionScore: number;
  exportedEvidence: boolean;
  finite: boolean;
}



/**
 * Auditable source-matrix row included in inert JSON exports.
 */
export interface ScientificSourceMatrixRow {
  scenario: string;
  sourceReferenceNote: string;
  standardExpectation: string;
  arcsecsAlternativeAssumption: string;
  normalizedParameter: string;
  derivedTelemetry: string;
  exportEvidence: string;
  falsificationTrigger: string;
  citationStatus: "confirmed" | "project-note" | "placeholder-needed" | "future-research";
}

/**
 * Exportable scientific source matrix wrapper.
 */
export interface ScientificSourceMatrixExport {
  matrixVersion: number;
  activeScenario: string;
  citationPolicy: string;
  rows: readonly ScientificSourceMatrixRow[];
}

/**
 * Auditable scenario equation row included in inert JSON exports.
 */
export interface ScenarioEquationLibraryRow {
  scenario: string;
  formula: string;
  formulaKind: string;
  units: string;
  controlledInputs: string;
  derivedTelemetry: string;
  exportedEvidence: string;
  placeholderStatus: string;
}

/**
 * Exportable scenario equation library wrapper.
 */
export interface ScenarioEquationLibraryExport {
  libraryVersion: number;
  activeScenario: string;
  precisionBoundary: string;
  rows: readonly ScenarioEquationLibraryRow[];
}

/**
 * Validation result for v5.8.36 source/equation reviewer exports.
 */
export interface SourceMatrixValidationResult {
  passed: boolean;
  warnings: readonly string[];
  rowCount: number;
}

/**
 * Validation result for v5.8.36 equation-library reviewer exports.
 */
export interface ScenarioEquationLibraryValidationResult {
  passed: boolean;
  warnings: readonly string[];
  rowCount: number;
}

/**
 * Live Scenario Audit Console inert export summary.
 */
export interface LiveScenarioAuditConsoleExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsLiveScenarioAuditConsole";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  activeStandardExpectation: string;
  activeArcSecsAlternativeAssumption: string;
  normalizedControls: string;
  derivedTelemetry: string;
  exportEvidenceReadiness: string;
  falsificationTrigger: string;
  citationStatus: string;
  telemetryFinite: boolean;
  sourceMatrixValidation: SourceMatrixValidationResult;
  scenarioEquationLibraryValidation: ScenarioEquationLibraryValidationResult;
  sourceMatrix: ScientificSourceMatrixExport;
  scenarioEquationLibrary: ScenarioEquationLibraryExport;
  warnings: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
}

/**
 * Top-level v5.8.36 export contract keys.
 */
export interface SpaceTravelParsecMissionExport {
  schemaVersion: 3;
  pluginVersion: "5.8.36";
  exportedAtUtc: string;
  scenarioName: string;
  activePropulsionMode: string;
  missionOutcome: string;
  missionScore: number;
  speculativeBoundary: string;
  sourceMatrix: ScientificSourceMatrixExport;
  scenarioEquationLibrary: ScenarioEquationLibraryExport;
  sourceMatrixValidation?: SourceMatrixValidationResult;
  scenarioEquationLibraryValidation?: ScenarioEquationLibraryValidationResult;
  missionReplayExportViewerState: MissionReplayExportViewerState;
  missionCalibrationState: MissionCalibrationState;
  missionCalibrationEvidence: MissionCalibrationEvidence;
  parsecNavigationState: ParsecNavigationState;
  regionSurfaceDensityState: RegionSurfaceDensityState;
  wavefrontTrackerState: WavefrontTrackerState;
  routeAdvisorState: RouteAdvisorState;
  darkMatterTravelOutcome: MissionOutcomeState;
}


/**
 * Safe calibration controls for mission-scale display and deterministic gameplay.
 */
export interface MissionCalibrationState {
  calibrationProfile: string;
  viewportWidthGigaparsecs: number;
  viewportHeightGigaparsecs: number;
  simulatedHoursPerTick: number;
  beaconDistanceScale: number;
  densityStrength: number;
  speedCompression: number;
  calibrationAppliedTick: number;
  calibrationEvidence: string;
  finite: boolean;
}

/**
 * Exportable calibration evidence packet.
 */
export interface MissionCalibrationEvidence {
  schemaVersion: 1;
  generatedAtUtc: string;
  calibrationState: MissionCalibrationState;
  controlledFields: string[];
  evidenceSummary: string;
  safetyBoundary: string;
  finite: boolean;
}


/**
 * Replay viewer state for imported ArcSecs mission export packets.
 */
export interface MissionReplayExportViewerFrame {
  frameIndex: number;
  tickIndex: number;
  simulatedUtc: string;
  elapsedSeconds: number;
  x: number;
  y: number;
  uiPositionX: number;
  uiPositionY: number;
  uiVelocityX: number;
  uiVelocityY: number;
  fuelCharge: number;
  thermalLoad: number;
  relationalParsecsToBeacon: number;
  relationalParsecsTraveled: number;
  parsecsPerSimulatedHour: number;
  currentRegionType: string;
  currentRegionAreaSquareParsecs: number;
  substrateDensityPerSquareParsec: number;
  procaDensity: number;
  torsionPull: number;
  weberDrag: number;
  photonLag: number;
  photonEnergyRemaining: number;
  gravityWaveEta: string;
  photonEta: string;
  activePropulsionMode: string;
  missionPhase: string;
  advisorMessage: string;
}

/**
 * Exportable Mission Replay Export Viewer state.
 */
export interface MissionReplayExportViewerState {
  loaded: boolean;
  source: string;
  schemaVersion: number;
  pluginVersion: string;
  scenarioName: string;
  frameCount: number;
  selectedFrameIndex: number;
  selectedFrame: MissionReplayExportViewerFrame | null;
  playbackActive: boolean;
  playbackSpeed: number;
  importedAtUtc: string;
  validationPassed: boolean;
  validationErrors: string[];
  replayStatus: string;
  replaySummary: string;
  falsificationNotes: string[];
  calibrationSnapshot: MissionCalibrationState | null;
  routeAdvisorSnapshot: RouteAdvisorState | null;
  finite: boolean;
}

/**
 * v5.8.36 local screenshot capture metadata for reviewer evidence packs.
 */
export interface ScenarioScreenshotCaptureMetadata {
  capturedUtc: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  imageDataUrl: string;
  localOnly: boolean;
  networkUploadUsed: boolean;
}

/**
 * v5.8.36 evidence pack readiness check row.
 */
export interface ScenarioEvidenceReadinessCheck {
  key: string;
  label: string;
  passed: boolean;
}

/**
 * v5.8.36 evidence pack readiness score.
 */
export interface ScenarioEvidencePackReadinessScore {
  score: number;
  maximumScore: number;
  status: string;
  checks: ScenarioEvidenceReadinessCheck[];
  missingItems: string[];
}

/**
 * v5.8.36 Scenario Screenshot Evidence Pack export block.
 */
export interface ScenarioScreenshotEvidencePackExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsScenarioScreenshotEvidencePack";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  scenarioLabel: string;
  viewportStatus: string;
  screenshotCapture: ScenarioScreenshotCaptureMetadata | null;
  finiteTelemetryStatus: string;
  sourceMatrixRowMatch: string;
  scenarioEquationLibraryRowMatch: string;
  citationStatus: string;
  falsificationTrigger: string;
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: boolean;
  networkUploadUsed: boolean;
  privatePathIncluded: boolean;
}

/**
 * v5.8.36 Reviewer Notes Bundle export block.
 */
export interface ReviewerNotesBundleExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsReviewerNotesBundle";
  generatedUtc: string;
  pageSourceRoute: string;
  reviewerNotes: string;
  reviewerStatus: "pending-review" | "approved-for-demo" | "needs-revision" | "rejected";
  screenshotSuitability: "not-reviewed" | "screenshot-ready" | "telemetry-needed" | "source-needed" | "falsification-needed";
  activeScenario: string;
  scenarioLabel: string;
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: boolean;
  readinessScore: ScenarioEvidencePackReadinessScore;
}

/**
 * v5.8.36 Evidence Index row built from local inert Evidence Pack and Reviewer Notes JSON.
 */
export interface PublicReviewerEvidenceIndexRow {
  rowId: string;
  packageVersion: string;
  generatedUtc: string;
  activeScenario: string;
  scenarioLabel: string;
  screenshotCaptureStatus: string;
  telemetryFiniteStatus: string;
  sourceMatrixRowMatch: string;
  scenarioEquationLibraryRowMatch: string;
  citationStatus: string;
  falsificationTrigger: string;
  reviewerStatus: "pending-review" | "approved-for-demo" | "needs-revision" | "rejected";
  screenshotSuitability: "not-reviewed" | "screenshot-ready" | "telemetry-needed" | "source-needed" | "falsification-needed";
  readinessScore: string;
  readinessScoreRaw: number;
  readinessMaximumRaw: number;
  warnings: string[];
  speculativeBoundaryStatus: string;
  sourceEquationMatchStatus: string;
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 reviewer readiness summary for the local Evidence Index.
 */
export interface PublicReviewerReadinessSummary {
  totalRows: number;
  approvedForDemo: number;
  needsRevision: number;
  rejected: number;
  screenshotReady: number;
  telemetryNeeded: number;
  sourceNeeded: number;
  falsificationNeeded: number;
  rowsMissingSpeculativeBoundaryText: number;
  rowsMissingSourceEquationMatches: number;
  rejectedRows: number;
}

/**
 * v5.8.36 inert Public Reviewer Gallery Manifest export.
 */
export interface PublicReviewerGalleryManifestExport {
  manifestVersion: "1.0.0";
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicReviewerGalleryManifest";
  generatedUtc: string;
  pageSourceRoute: string;
  evidenceRows: PublicReviewerEvidenceIndexRow[];
  warnings: string[];
  rejectedRows: Array<{
    rejectedUtc: string;
    errors: string[];
    exportContainsExecutableCode: false;
  }>;
  reviewerReadinessSummary: PublicReviewerReadinessSummary;
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 local integrity statuses for evidence rows.
 */
export type EvidenceBundleIntegrityStatus = "complete" | "warning" | "incomplete" | "rejected";

/**
 * v5.8.36 local integrity label. This is not a cryptographic signature and uses no secrets.
 */
export interface EvidenceBundleIntegrityLabel {
  packageVersion: "5.8.36" | string;
  generatedUtc: string;
  exportType: "ArcSecsEvidenceBundleIntegrityLabel";
  activeScenario: string;
  scenarioLabel: string;
  reviewerStatus: string;
  screenshotSuitability: string;
  readinessScore: string;
  sourceMatrixRowMatch: string;
  scenarioEquationLibraryRowMatch: string;
  citationStatus: string;
  falsificationTrigger: string;
  warningsCount: number;
  speculativeBoundaryStatus: string;
  labelId: string;
  rowLabel: string;
  integrityStatus: EvidenceBundleIntegrityStatus;
  localFingerprint: string;
  usesSecretsSigningKeysPasswordsCertificatesAccountsOrRemoteValidation: false;
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 local integrity label export.
 */
export interface EvidenceBundleIntegrityLabelsExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsEvidenceBundleIntegrityLabels";
  generatedUtc: string;
  pageSourceRoute: string;
  labels: EvidenceBundleIntegrityLabel[];
  warnings: string[];
  integrityStatusesSupported: EvidenceBundleIntegrityStatus[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 local reviewer sign-off status.
 */
export type ReviewerSignOffStatus = "pending-review" | "approved-for-demo" | "approved-with-warnings" | "needs-revision" | "rejected";

/**
 * v5.8.36 local reviewer sign-off summary export.
 */
export interface ReviewerSignOffSummaryExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsReviewerSignOffSummary";
  generatedUtc: string;
  pageSourceRoute: string;
  reviewerNameOrHandle: string;
  signOffStatus: ReviewerSignOffStatus;
  signOffNote: string;
  selectedEvidenceRows: PublicReviewerEvidenceIndexRow[];
  reviewerReadinessSummary: PublicReviewerReadinessSummary;
  rejectedRowCount: number;
  missingBoundaryCount: number;
  missingSourceEquationMatchCount: number;
  telemetryNeededCount: number;
  sourceNeededCount: number;
  falsificationNeededCount: number;
  evidenceBundleIntegrityLabels: EvidenceBundleIntegrityLabelsExport;
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


/**
 * v5.8.36 reconciliation state for imported local-only review bundles.
 */
export type ReviewBundleReconciliationState = "matched" | "mismatched" | "missing" | "stale" | "rejected";

/**
 * v5.8.36 evidence gap severity.
 */
export type EvidenceGapSeverity = "critical" | "warning" | "info";

/**
 * v5.8.36 reconciliation row joining gallery rows, integrity labels, and sign-off rows.
 */
export interface ReviewBundleReconciliationRow {
  state: ReviewBundleReconciliationState;
  rowId: string;
  packageVersion: string;
  activeScenario: string;
  scenarioLabel: string;
  localFingerprint: string;
  reviewerStatus: string;
  screenshotSuitability: string;
  readinessScore: string;
  integrityStatus: string;
  signOffStatus: string;
  sourceEquationMatchStatus: string;
  speculativeBoundaryStatus: string;
  issues: string[];
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 Evidence Gap Assistant row.
 */
export interface EvidenceGapAssistantRow {
  rowId: string;
  activeScenario: string;
  scenarioLabel: string;
  gapType: string;
  severity: EvidenceGapSeverity;
  recommendedNextAction: string;
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 inert Review Bundle Import Reconciliation export.
 */
export interface ReviewBundleReconciliationExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsReviewBundleReconciliation";
  generatedUtc: string;
  pageSourceRoute: string;
  reconciliationVersion: string;
  matchedRows: ReviewBundleReconciliationRow[];
  mismatchedRows: ReviewBundleReconciliationRow[];
  missingRows: ReviewBundleReconciliationRow[];
  staleRows: ReviewBundleReconciliationRow[];
  rejectedRows: unknown[];
  evidenceGaps: EvidenceGapAssistantRow[];
  recommendedNextActions: string[];
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


/**
 * v5.8.36 Scenario Review Walkthrough guided step.
 */
export interface ScenarioReviewWalkthroughStep {
  id: string;
  label: string;
  status: "open" | "complete";
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 Scenario Review Walkthrough export.
 */
export interface ScenarioReviewWalkthroughWizardExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsScenarioReviewWalkthroughWizard";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  activeScenarioIndex: number;
  totalScenarios: number;
  wizardState: {
    scenarioLabel: string;
    reviewerStatus: string;
    integrityStatus: string;
    readinessScore: string;
    sourceEquationStatus: string;
    speculativeBoundaryStatus: string;
    currentEvidenceGaps: EvidenceGapAssistantRow[];
    guidedSteps: ScenarioReviewWalkthroughStep[];
    exportContainsExecutableCode: false;
  } | null;
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 local-only Evidence Repair Queue status values.
 */
export type EvidenceRepairQueueStatus = "open" | "in-progress" | "resolved" | "deferred" | "rejected";

/**
 * v5.8.36 local-only Evidence Repair Queue item.
 */
export interface EvidenceRepairQueueItem {
  queueId: string;
  rowId: string;
  activeScenario: string;
  scenarioLabel: string;
  severity: EvidenceGapSeverity;
  repairType: "screenshot repair" | "telemetry repair" | "source repair" | "equation repair" | "citation repair" | "falsification repair" | "boundary repair" | "integrity repair" | "sign-off repair";
  status: EvidenceRepairQueueStatus;
  problem: string;
  whyItMatters: string;
  recommendedNextAction: string;
  panelToUse: string;
  exportToRegenerate: string;
  resolvedCriteria: string;
  exportContainsExecutableCode: false;
}

/**
 * v5.8.36 inert Evidence Repair Queue export.
 */
export interface EvidenceRepairQueueExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsEvidenceRepairQueue";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  queueItems: EvidenceRepairQueueItem[];
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


/** v5.8.36 local completion status for repair outcomes. */
export type EvidenceRepairCompletionStatus = "not-started" | "in-progress" | "completed" | "completed-with-warnings" | "deferred" | "rejected";

/** v5.8.36 Demo Readiness Gate status. Demo-ready is not proof and not operational capability. */
export type DemoReadinessGateStatus = "blocked" | "needs-review" | "demo-ready-with-warnings" | "demo-ready" | "rejected";

/** v5.8.36 Evidence Repair Completion Ledger row. */
export interface EvidenceRepairCompletionRow {
  completionId: string;
  queueId: string;
  activeScenario: string;
  scenarioLabel: string;
  repairType: string;
  queueStatus: string;
  completionStatus: EvidenceRepairCompletionStatus;
  criticalOpenRepair: boolean;
  completionNotes: string;
  problem: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert Evidence Repair Completion Ledger export. */
export interface EvidenceRepairCompletionLedgerExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsEvidenceRepairCompletionLedger";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  completionVersion: string;
  completionRows: EvidenceRepairCompletionRow[];
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 gate checks for public visualization demo readiness. */
export interface DemoReadinessGateChecks {
  scenarioRunExists: boolean;
  finiteTelemetry: boolean;
  screenshotReady: boolean;
  sourceMatrixRowMatched: boolean;
  equationLibraryRowMatched: boolean;
  citationStatusAcceptable: boolean;
  falsificationTriggerPresent: boolean;
  speculativeBoundaryTextPresent: boolean;
  reviewerNotePresent: boolean;
  signOffStatusPresent: boolean;
  integrityStatusAcceptable: boolean;
  criticalOpenRepair: boolean;
  rejected: boolean;
}

/** v5.8.36 Demo Readiness Gate row. */
export interface DemoReadinessGateRow {
  activeScenario: string;
  scenarioLabel: string;
  gateStatus: DemoReadinessGateStatus;
  checks: DemoReadinessGateChecks;
  copySafeguard: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert Demo Readiness Gate export. */
export interface DemoReadinessGateExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsDemoReadinessGate";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  gateVersion: string;
  gateRows: DemoReadinessGateRow[];
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


/** v5.8.36 checklist override status for local public demo review. */
export type PublicDemoChecklistOverrideStatus = "not-reviewed" | "ready" | "ready-with-warnings" | "blocked" | "rejected";

/** v5.8.36 local public demo scenario checklist row. Checklist-ready is not proof or operational capability. */
export interface PublicDemoScenarioChecklistRow {
  packageVersion: "5.8.36";
  generatedUtc: string;
  activeScenario: string;
  scenarioLabel: string;
  gateStatus: string;
  reviewerStatus: string;
  signOffStatus: string;
  readinessScore: string;
  integrityStatus: string;
  completionStatus: string;
  criticalOpenRepairStatus: string;
  checklistOverrideStatus: PublicDemoChecklistOverrideStatus;
  checklistCompleteness: "complete" | "incomplete";
  checklistItems: Record<string, boolean>;
  checklistItemLabels: string[];
  copySafeguard: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert Public Demo Scenario Checklist export. */
export interface PublicDemoScenarioChecklistExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicDemoScenarioChecklist";
  checklistVersion: string;
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  checklistRows: PublicDemoScenarioChecklistRow[];
  checklistOverrideStatusesSupported: PublicDemoChecklistOverrideStatus[];
  warnings: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert reviewer evidence export pack for visualization-demo review. */
export interface ReviewerEvidenceExportPackRow {
  packageVersion: "5.8.36";
  exportType: "ArcSecsReviewerEvidenceExportPack";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  scenarioLabel: string;
  demoReadinessGate: unknown;
  evidenceRepairCompletionLedger: unknown[];
  evidenceRepairQueue: unknown[];
  reviewerSignOffSummary: unknown;
  evidenceBundleIntegrityLabels: unknown[];
  publicReviewerGalleryManifest: unknown;
  evidenceIndexRow: unknown;
  sourceMatrix: unknown;
  scenarioEquationLibrary: unknown;
  checklistState: PublicDemoScenarioChecklistRow | null;
  warnings: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert reviewer evidence export pack collection. */
export interface ReviewerEvidenceExportPackCollection {
  packageVersion: "5.8.36";
  exportType: "ArcSecsReviewerEvidenceExportPackCollection" | "ArcSecsAllDemoReviewerEvidenceExportPacks";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  evidencePackRows: ReviewerEvidenceExportPackRow[];
  publicDemoScenarioChecklist?: PublicDemoScenarioChecklistExport;
  warnings: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


/** v5.8.36 local-only public demo script status. */
export type PublicDemoScriptStatus = "draft" | "reviewer-ready" | "needs-revision" | "blocked" | "rejected";

/** v5.8.36 cautious public demo script row. Scripts are communication aids only. */
export interface PublicDemoScriptRow {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicDemoScriptRow";
  activeScenario: string;
  scenarioLabel: string;
  gateStatus: string;
  checklistOverrideStatus: string;
  readinessScore: string;
  integrityStatus: string;
  sourceEquationStatus: string;
  falsificationTrigger: string;
  warningStatus: "clear" | "warnings";
  scriptStatus: PublicDemoScriptStatus;
  visitorIntroduction: string;
  scenarioGoal: string;
  standardComparison: string;
  arcsecsSpeculativeChange: string;
  telemetryToWatch: string;
  screenshotMoment: string;
  falsificationCriteria: string;
  closingCaveat: string;
  references: Record<string, string>;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert public demo script builder export. */
export interface PublicDemoScriptBuilderExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicDemoScriptBuilder" | "ArcSecsSelectedPublicDemoScript";
  scriptBuilderVersion: string;
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  scriptRows: PublicDemoScriptRow[];
  scriptStatusValuesSupported: PublicDemoScriptStatus[];
  warnings: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  references: string[];
  exportContainsExecutableCode: false;
}

/** v5.8.36 screenshot caption row for public pages, social posts, and reviewer bundles. */
export interface ScreenshotCaptionRow {
  packageVersion: "5.8.36";
  exportType: "ArcSecsScreenshotCaptionRow";
  activeScenario: string;
  scenarioLabel: string;
  screenshotTitle: string;
  shortCaption: string;
  longCaption: string;
  telemetryCaption: string;
  sourceEquationCaption: string;
  falsificationCaption: string;
  warningCaption: string;
  altText: string;
  speculativeBoundaryCaption: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert Screenshot Caption Pack export. */
export interface ScreenshotCaptionPackExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsScreenshotCaptionPack";
  captionPackVersion: string;
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  captionRows: ScreenshotCaptionRow[];
  warnings: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  references: string[];
  exportContainsExecutableCode: false;
}


/** v5.8.36 local-only copy readiness status for public demo page assembly. */
export type PublicDemoCopyReadinessStatus = "draft" | "reviewer-ready" | "ready-with-warnings" | "blocked" | "rejected";

/** v5.8.36 local public demo page assembly row. Page-ready is not proof or operational capability. */
export interface PublicDemoPageAssemblyRow {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicDemoPageAssemblyRow";
  generatedUtc: string;
  activeScenario: string;
  scenarioLabel: string;
  scriptStatus: string;
  captionStatus: "present" | "missing";
  gateStatus: string;
  checklistOverrideStatus: string;
  readinessScore: string;
  warningStatus: "clear" | "warnings";
  sourceEquationStatus: "present" | "missing";
  falsificationStatus: "present" | "missing";
  copyReadinessStatus: PublicDemoCopyReadinessStatus;
  checklistItems: Record<string, boolean>;
  checklistItemLabels: string[];
  missingItems: string[];
  copySafeguard: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert Public Demo Page Assembly Checklist export. */
export interface PublicDemoPageAssemblyChecklistExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicDemoPageAssemblyChecklist";
  assemblyChecklistVersion: string;
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  assemblyRows: PublicDemoPageAssemblyRow[];
  copyReadinessStatusesSupported: PublicDemoCopyReadinessStatus[];
  warnings: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  references: string[];
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert local copy review bundle row with rejected phrase checks. */
export interface CopyReviewBundleRow {
  packageVersion: "5.8.36";
  exportType: "ArcSecsCopyReviewBundleRow";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  scenarioLabel: string;
  demoScriptRow: PublicDemoScriptRow | null;
  screenshotCaptionRow: ScreenshotCaptionRow | null;
  reviewerEvidenceExportPackRow: ReviewerEvidenceExportPackRow | null;
  sourceMatrix: unknown;
  scenarioEquationLibrary: unknown;
  suggestedPageTitle: string;
  suggestedIntroParagraph: string;
  suggestedTelemetryCallout: string;
  suggestedFalsificationCallout: string;
  suggestedBoundaryCopy: string;
  suggestedAltText: string;
  copyWarnings: string[];
  rejectedPhrases: string[];
  recommendedFixes: string[];
  speculativeBoundaryText: string;
  copyReadinessStatus: PublicDemoCopyReadinessStatus;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert Copy Review Bundle export. */
export interface CopyReviewBundleExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsCopyReviewBundle" | "ArcSecsSelectedCopyReviewBundle";
  copyReviewBundleVersion: string;
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  copyBundleRows: CopyReviewBundleRow[];
  copyWarnings: string[];
  rejectedPhrases: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  references: string[];
  exportContainsExecutableCode: false;
}


/** v5.8.36 local-only route draft status for public demo route review. */
export type ArcSecsPublicDemoRouteDraftStatus = "draft" | "reviewer-ready" | "ready-with-warnings" | "blocked" | "rejected";

/** v5.8.36 route draft row. Routes are reviewer-draft text only and are not published. */
export interface ArcSecsPublicDemoRouteDraftRow {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicDemoRouteDraftRow";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  scenarioLabel: string;
  suggestedSlug: string;
  suggestedPageTitle: string;
  suggestedMetaTitle: string;
  suggestedMetaDescription: string;
  canonicalRouteNote: string;
  copyReadinessStatus: string;
  routeDraftStatus: ArcSecsPublicDemoRouteDraftStatus;
  schemaStatus: "reviewer-draft" | "needs-review" | "blocked";
  warningStatus: "clear" | "warnings";
  placeholderLabelStatus: "labeled" | "needs-labels";
  sourceEquationStatus: "present" | "missing";
  falsificationStatus: "present" | "missing";
  linkSuggestionRows: string[];
  routeWarnings: string[];
  rejectedPhrases: string[];
  recommendedFixes: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert Public Demo Route Draft Bundle export. */
export interface ArcSecsPublicDemoRouteDraftBundleExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicDemoRouteDraftBundle";
  routeDraftBundleVersion: string;
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  routeRows: ArcSecsPublicDemoRouteDraftRow[];
  linkSuggestionRows: Array<{ activeScenario: string; scenarioLabel: string; linkReference: string; textOnly: true }>;
  routeDraftStatusesSupported: ArcSecsPublicDemoRouteDraftStatus[];
  routeWarnings: string[];
  rejectedPhrases: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  references: string[];
  exportContainsExecutableCode: false;
}

/** v5.8.36 reviewer-draft JSON-LD schema review row. */
export interface ArcSecsSeoSchemaReviewRow {
  packageVersion: "5.8.36";
  exportType: "ArcSecsSeoSchemaReviewRow";
  generatedUtc: string;
  activeScenario: string;
  scenarioLabel: string;
  schemaStatus: "reviewer-draft" | "needs-review" | "blocked";
  suggestedSchemaType: string;
  headline: string;
  description: string;
  imageCaptionNote: string;
  authorPublisherNotePlaceholder: string;
  aboutTopicNotes: string;
  citationSourceNotes: string;
  cautionDisclaimerNotes: string;
  falsificationNote: string;
  reviewerDraftOnly: true;
  injectsLiveSchema: false;
  claimsScientificValidation: false;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert SEO Schema Review export. */
export interface ArcSecsSeoSchemaReviewExport {
  packageVersion: "5.8.36";
  exportType: "ArcSecsSeoSchemaReview";
  schemaReviewVersion: string;
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  schemaReviewRows: ArcSecsSeoSchemaReviewRow[];
  linkSuggestionRows: Array<{ activeScenario: string; scenarioLabel: string; linkReference: string; textOnly: true }>;
  routeWarnings: string[];
  rejectedPhrases: string[];
  falsificationNotes: string[];
  speculativeBoundaryText: string;
  references: string[];
  exportContainsExecutableCode: false;
}


/** v5.8.36 reviewer-only publication handoff row. */
export interface ArcSecsPublicDemoPublicationHandoffRow {
  packageVersion: String;
  exportType: String;
  generatedUtc: String;
  pageSourceRoute: String;
  activeScenario: String;
  scenarioLabel: String;
  suggestedSlug: String;
  suggestedPageTitle: String;
  suggestedMetaTitle: String;
  suggestedMetaDescription: String;
  schemaStatus: String;
  copyReadinessStatus: String;
  routeWarningStatus: String;
  evidencePackStatus: String;
  sourceEquationStatus: String;
  falsificationStatus: String;
  placeholderLabelStatus: String;
  handoffStatus: String;
  reviewerHandoffDraftOnly: Boolean;
  speculativeBoundaryText: String;
  exportContainsExecutableCode: Boolean;
}

/** v5.8.36 static page draft export row. */
export interface ArcSecsStaticPageDraftRow {
  packageVersion: String;
  exportType: String;
  generatedUtc: String;
  pageSourceRoute: String;
  activeScenario: String;
  scenarioLabel: String;
  suggestedSlug: String;
  suggestedPageTitle: String;
  suggestedMetaTitle: String;
  suggestedMetaDescription: String;
  suggestedCanonicalNote: String;
  suggestedHeroTitle: String;
  suggestedIntroParagraph: String;
  suggestedScreenshotCaption: String;
  suggestedAltText: String;
  suggestedTelemetryCallout: String;
  suggestedSourceEquationCallout: String;
  suggestedFalsificationCallout: String;
  suggestedBoundaryCopy: String;
  exportContainsExecutableCode: Boolean;
}

export interface ArcSecsPublicDemoPublicationHandoffManifestExport {
  packageVersion: String;
  exportType: String;
  generatedUtc: String;
  pageSourceRoute: String;
  handoffRows: ArcSecsPublicDemoPublicationHandoffRow[];
  warnings: String[];
  rejectedPhrases: String[];
  recommendedFixes: String[];
  falsificationNotes: String[];
  speculativeBoundaryText: String;
  exportContainsExecutableCode: Boolean;
}

export interface ArcSecsStaticPageDraftExport {
  packageVersion: String;
  exportType: String;
  generatedUtc: String;
  pageSourceRoute: String;
  staticPageDraftRows: ArcSecsStaticPageDraftRow[];
  routeWarnings: String[];
  copyWarnings: String[];
  rejectedPhrases: String[];
  recommendedFixes: String[];
  falsificationNotes: String[];
  speculativeBoundaryText: String;
  exportContainsExecutableCode: Boolean;
}


export interface ArcSecsStaticDraftReviewImportSummary {
  label: String;
  status: String;
  packageVersion: String;
  exportType: String;
  generatedUtc: String;
  scenarioCount: Number;
  warningCount: Number;
  rejectedRowCount: Number;
  warnings: readonly String[];
}

export interface ArcSecsStaticDraftReviewImportExport {
  packageVersion: String;
  exportType: 'ArcSecsStaticDraftReviewImport';
  staticDraftReviewImportVersion: String;
  generatedUtc: String;
  pageSourceRoute: String;
  importedExportSummaries: readonly ArcSecsStaticDraftReviewImportSummary[];
  warnings: readonly String[];
  rejectedRows: readonly unknown[];
  speculativeBoundaryText: String;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPageReadinessDiffRow {
  packageVersion: String;
  exportType: 'ArcSecsPageReadinessDiffRow';
  generatedUtc: String;
  pageSourceRoute: String;
  activeScenario: String;
  scenarioLabel: String;
  diffStatus: 'added' | 'removed' | 'changed' | 'unchanged' | 'missing' | 'stale' | 'warning' | 'rejected';
  diffReviewStatus: 'not-reviewed' | 'reviewer-ready' | 'ready-with-warnings' | 'needs-revision' | 'blocked' | 'rejected';
  changedFields: readonly String[];
  missingFields: readonly String[];
  warnings: readonly String[];
  rejectedPhrases: readonly String[];
  recommendedFixes: readonly String[];
  stalePackageVersion: Boolean;
  speculativeBoundaryText: String;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPageReadinessDiffExport {
  packageVersion: String;
  exportType: 'ArcSecsPageReadinessDiff';
  pageReadinessDiffVersion: String;
  generatedUtc: String;
  pageSourceRoute: String;
  importedExportSummaries: readonly ArcSecsStaticDraftReviewImportSummary[];
  diffRows: readonly ArcSecsPageReadinessDiffRow[];
  missingFields: readonly String[];
  changedFields: readonly String[];
  warnings: readonly String[];
  rejectedPhrases: readonly String[];
  recommendedFixes: readonly String[];
  falsificationNotes: readonly String[];
  speculativeBoundaryText: String;
  exportContainsExecutableCode: false;
}


export interface ArcSecsStaticPublicationReviewChecklistRow {
  packageVersion: string;
  exportType: 'ArcSecsStaticPublicationReviewChecklistRow';
  activeScenario: string;
  scenarioLabel: string;
  diffStatus: string;
  diffReviewStatus: string;
  staleStatus: string;
  missingFieldStatus: string;
  warningStatus: string;
  rejectedPhraseStatus: string;
  routeMetadataStatus: string;
  schemaReviewStatus: string;
  copyReviewStatus: string;
  evidencePackStatus: string;
  sourceEquationStatus: string;
  falsificationStatus: string;
  boundaryStatus: string;
  freezeStatus: 'not-reviewed' | 'frozen-for-review' | 'frozen-with-warnings' | 'needs-revision' | 'blocked' | 'rejected';
  missingFields: readonly string[];
  changedFields: readonly string[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  exportContainsExecutableCode: false;
}

export interface ArcSecsStaticPublicationReviewChecklistExport {
  packageVersion: string;
  exportType: 'ArcSecsStaticPublicationReviewChecklist';
  generatedUtc: string;
  pageSourceRoute: string;
  checklistRows: readonly ArcSecsStaticPublicationReviewChecklistRow[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPageDraftFreezeBundleRow {
  packageVersion: string;
  exportType: 'ArcSecsPageDraftFreezeBundleRow';
  activeScenario: string;
  scenarioLabel: string;
  pageReadinessDiffRow: unknown;
  staticPageDraftExportRow: unknown;
  publicationHandoffManifestRow: unknown;
  routeDraftRow: unknown;
  seoSchemaReviewRow: unknown;
  copyReviewBundleRow: unknown;
  publicDemoScriptRow: unknown;
  screenshotCaptionRow: unknown;
  reviewerEvidenceExportPackRow: unknown;
  sourceMatrixRow: unknown;
  scenarioEquationLibraryRow: unknown;
  checklistState: ArcSecsStaticPublicationReviewChecklistRow;
  missingFields: readonly string[];
  changedFields: readonly string[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPageDraftFreezeBundleExport {
  packageVersion: string;
  exportType: 'ArcSecsPageDraftFreezeBundle';
  generatedUtc: string;
  pageSourceRoute: string;
  freezeBundleRows: readonly ArcSecsPageDraftFreezeBundleRow[];
  checklistRows: readonly ArcSecsStaticPublicationReviewChecklistRow[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


export interface ArcSecsStaticPublishHandoffQaSummaryRow {
  packageVersion: string;
  exportType: 'ArcSecsStaticPublishHandoffQaSummaryRow';
  activeScenario: string;
  scenarioLabel: string;
  freezeStatus: string;
  routeMetadataStatus: string;
  schemaReviewStatus: string;
  copyReviewStatus: string;
  evidencePackStatus: string;
  sourceEquationStatus: string;
  falsificationStatus: string;
  boundaryStatus: string;
  warningCount: number;
  rejectedPhraseCount: number;
  recommendedFixCount: number;
  finalQaStatus: 'not-reviewed' | 'qa-ready' | 'qa-ready-with-warnings' | 'needs-revision' | 'blocked' | 'rejected';
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsStaticPublishHandoffQaSummaryExport {
  packageVersion: string;
  exportType: 'ArcSecsStaticPublishHandoffQaSummary';
  generatedUtc: string;
  pageSourceRoute: string;
  qaRows: readonly ArcSecsStaticPublishHandoffQaSummaryRow[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPublicPageContentChecklistRow {
  packageVersion: string;
  exportType: 'ArcSecsPublicPageContentChecklistRow';
  activeScenario: string;
  scenarioLabel: string;
  suggestedSlug: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  introParagraph: string;
  demoScriptSections: unknown;
  screenshotCaption: string;
  altText: string;
  telemetryCallout: string;
  sourceEquationCallout: string;
  falsificationCallout: string;
  speculativeBoundaryCopy: string;
  schemaReviewNote: string;
  internalLinkTextRows: readonly unknown[];
  evidenceReferenceNote: string;
  rejectedPhraseStatus: string;
  placeholderSpeculativeLabelStatus: string;
  checklistCompletionStatus: 'complete' | 'incomplete';
  exportContainsExecutableCode: false;
}

export interface ArcSecsPublicPageContentChecklistExport {
  packageVersion: string;
  exportType: 'ArcSecsPublicPageContentChecklist';
  generatedUtc: string;
  pageSourceRoute: string;
  checklistRows: readonly ArcSecsPublicPageContentChecklistRow[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


export interface ArcSecsUaiMemoryOrganizationCompletenessCheckExport {
  packageVersion: string;
  exportType: 'uai-memory-organization-completeness-check';
  generatedUtc: string;
  pageSourceRoute: string;
  requiredUaiFiles: string[];
  archiveSnapshot: string;
  manifestPackage: string;
  warnings: string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


export type ArcSecsManualHandoffStatus = 'not-reviewed' | 'handoff-ready' | 'handoff-ready-with-warnings' | 'needs-revision' | 'blocked' | 'rejected';

export interface ArcSecsPublicPageManualPublishingRunbookRow {
  packageVersion: string;
  exportType: 'ArcSecsPublicPageManualPublishingRunbookRow';
  activeScenario: string;
  scenarioLabel: string;
  qaStatus: string;
  checklistCompletionStatus: string;
  suggestedSlug: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  introParagraph: string;
  schemaReviewNote: string;
  evidenceReferenceNote: string;
  warningCount: number;
  rejectedPhraseStatus: string;
  placeholderSpeculativeLabelStatus: string;
  manualHandoffStatus: ArcSecsManualHandoffStatus;
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPublicPageManualPublishingRunbookExport {
  packageVersion: string;
  exportType: 'ArcSecsPublicPageManualPublishingRunbook';
  generatedUtc: string;
  pageSourceRoute: string;
  runbookRows: readonly ArcSecsPublicPageManualPublishingRunbookRow[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPostDeployVerificationChecklistRow {
  packageVersion: string;
  exportType: 'ArcSecsPostDeployVerificationChecklistRow';
  activeScenario: string;
  scenarioLabel: string;
  manualHandoffStatus: ArcSecsManualHandoffStatus;
  verificationStatus: 'pending-human-verification';
  routeManuallyCreatedConfirmation: string;
  pageTitleVisibleConfirmation: string;
  metaDescriptionReviewedConfirmation: string;
  speculativeBoundaryVisibleConfirmation: string;
  falsificationCalloutVisibleConfirmation: string;
  sourceEquationCalloutVisibleConfirmation: string;
  screenshotCaptionVisibleConfirmation: string;
  altTextReviewedConfirmation: string;
  placeholderSpeculativeLabelsVisibleConfirmation: string;
  noProofWordingConfirmation: string;
  noOperationalCapabilityWordingConfirmation: string;
  evidenceReferenceVisibleConfirmation: string;
  exportArchiveRetainedConfirmation: string;
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsPostDeployVerificationChecklistExport {
  packageVersion: string;
  exportType: 'ArcSecsPostDeployVerificationChecklist';
  generatedUtc: string;
  pageSourceRoute: string;
  postDeployVerificationRows: readonly ArcSecsPostDeployVerificationChecklistRow[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


export type ArcSecsArchiveReceiptStatus = 'not-reviewed' | 'archived-for-review' | 'archived-with-warnings' | 'needs-revision' | 'blocked' | 'rejected';
export type ArcSecsHumanReviewSignOffStatus = 'not-reviewed' | 'signed-off-for-manual-publishing' | 'signed-off-with-warnings' | 'needs-revision' | 'blocked' | 'rejected';

export interface ArcSecsManualPublishingArchiveReceiptRow {
  packageVersion: string;
  exportType: 'ArcSecsManualPublishingArchiveReceiptRow';
  activeScenario: string;
  scenarioLabel: string;
  manualHandoffStatus: string;
  verificationStatus: string;
  suggestedSlug: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  evidenceReferenceNote: string;
  warningCount: number;
  rejectedPhraseStatus: string;
  placeholderSpeculativeLabelStatus: string;
  exportArchiveRetainedStatus: string;
  archiveReceiptStatus: ArcSecsArchiveReceiptStatus;
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsManualPublishingArchiveReceiptExport {
  packageVersion: string;
  exportType: 'ArcSecsManualPublishingArchiveReceipt';
  generatedUtc: string;
  archiveReceiptRows: readonly ArcSecsManualPublishingArchiveReceiptRow[];
  archiveReceiptStatusesSupported: readonly ArcSecsArchiveReceiptStatus[];
  exportContainsExecutableCode: false;
}

export interface ArcSecsHumanReviewSignOffRow {
  packageVersion: string;
  exportType: 'ArcSecsHumanReviewSignOffRow';
  activeScenario: string;
  scenarioLabel: string;
  reviewerNameOrHandle: string;
  reviewNote: string;
  signOffStatus: ArcSecsHumanReviewSignOffStatus;
  requestedSignOffStatus: ArcSecsHumanReviewSignOffStatus;
  manualHandoffStatus: string;
  verificationStatus: string;
  archiveReceiptStatus: ArcSecsArchiveReceiptStatus;
  evidenceReferenceNote: string;
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

export interface ArcSecsHumanReviewSignOffExport {
  packageVersion: string;
  exportType: 'ArcSecsHumanReviewSignOffExport';
  generatedUtc: string;
  reviewerNameOrHandle: string;
  reviewerNote: string;
  signOffRows: readonly ArcSecsHumanReviewSignOffRow[];
  signOffStatusesSupported: readonly ArcSecsHumanReviewSignOffStatus[];
  exportContainsExecutableCode: false;
}


/** v5.8.36 local-only archive retrieval status. */
export type ArcSecsArchiveRetrievalStatus = "not-reviewed" | "retrievable" | "retrievable-with-warnings" | "needs-revision" | "blocked" | "rejected";

/** v5.8.36 local publishing evidence archive index row. */
export interface ArcSecsPublicPublishingEvidenceArchiveIndexRow {
  packageVersion: "5.8.36" | string;
  exportType: "ArcSecsPublicPublishingEvidenceArchiveIndexRow";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  scenarioLabel: string;
  suggestedSlug: string;
  pageTitle: string;
  manualHandoffStatus: string;
  verificationStatus: string;
  archiveReceiptStatus: string;
  signOffStatus: string;
  reviewerNameOrHandle: string;
  warningCount: number;
  rejectedPhraseCount: number;
  recommendedFixCount: number;
  falsificationNoteStatus: string;
  speculativeBoundaryStatus: string;
  sourceMatrixStatus: string;
  equationLibraryStatus: string;
  archiveRetrievalStatus: ArcSecsArchiveRetrievalStatus;
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert public publishing evidence archive index export. */
export interface ArcSecsPublicPublishingEvidenceArchiveIndex {
  packageVersion: "5.8.36";
  exportType: "ArcSecsPublicPublishingEvidenceArchiveIndex";
  generatedUtc: string;
  pageSourceRoute: string;
  archiveIndexRows: readonly ArcSecsPublicPublishingEvidenceArchiveIndexRow[];
  archiveRetrievalStatusesSupported: readonly ArcSecsArchiveRetrievalStatus[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}

/** v5.8.36 reviewer retrieval note row for archived evidence. */
export interface ArcSecsReviewerRetrievalNotesRow {
  packageVersion: "5.8.36" | string;
  exportType: "ArcSecsReviewerRetrievalNotesRow";
  generatedUtc: string;
  pageSourceRoute: string;
  activeScenario: string;
  scenarioLabel: string;
  retrievalStatus: ArcSecsArchiveRetrievalStatus;
  requestedRetrievalStatus: ArcSecsArchiveRetrievalStatus;
  reviewerRetrievalNote: string;
  archiveIndexRow: ArcSecsPublicPublishingEvidenceArchiveIndexRow;
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  exportContainsExecutableCode: false;
}

/** v5.8.36 inert reviewer retrieval notes export. */
export interface ArcSecsReviewerRetrievalNotes {
  packageVersion: "5.8.36";
  exportType: "ArcSecsReviewerRetrievalNotes";
  generatedUtc: string;
  pageSourceRoute: string;
  reviewerRetrievalNote: string;
  retrievalNoteRows: readonly ArcSecsReviewerRetrievalNotesRow[];
  archiveRetrievalStatusesSupported: readonly ArcSecsArchiveRetrievalStatus[];
  warnings: readonly string[];
  rejectedPhrases: readonly string[];
  recommendedFixes: readonly string[];
  falsificationNotes: readonly string[];
  speculativeBoundaryText: string;
  exportContainsExecutableCode: false;
}


export interface ArcSecsMichaelKappelContactPageMetadata {
    packageVersion: string;
    pageSlug: "contact";
    pageTitle: "Contact Michael Kappel";
    email: "mike@ns12.com";
    telephone: "+1-630-362-7576";
    location: "Cicero, Illinois / Chicago area";
    backgroundSummaryAvoidsExactCompanyNames: true;
    publicProfileUrl: "https://mikekappel.com/";
    speculativeBoundaryText: string;
}


export interface ArcSecsContactPageSeoAeoCleanupMetadata {
    packageVersion: string;
    pageSlug: "contact";
    contactPageSchemaType: "ContactPage";
    personSchemaType: "Person";
    footerLinkMetadataOption: "arcsecs_contact_footer_link_metadata";
    email: "mike@ns12.com";
    telephone: "+1-630-362-7576";
    publicProfileUrl: "https://mikekappel.com/";
    exactEmployerClientNamesOmitted: true;
    speculativeBoundaryText: string;
}


export interface ArcSecsContactPageDeploymentQaMetadata {
    packageVersion: string;
    pageSlug: "contact";
    pageTitle: "Contact Michael Kappel";
    email: "mike@ns12.com";
    telephone: "+1-630-362-7576";
    location: "Cicero, Illinois / Chicago area";
    publicProfileUrl: "https://mikekappel.com/";
    howICanHelpSectionPresent: true;
    bestReasonsToReachOutSectionPresent: true;
    mobileContactCssPresent: true;
    footerLinkMetadataOption: "arcsecs_contact_footer_link_metadata";
    contactPageSchemaType: "ContactPage";
    personSchemaType: "Person";
    schemaScopedToContactPage: true;
    exactEmployerClientNamesOmitted: true;
    speculativeBoundaryText: string;
}


export interface ArcSecsContactPageLiveVerificationRow {
    check: string;
    expected: string;
    status: "human-review-required" | "guidance-only" | "verified" | "needs-fix";
}

export interface ArcSecsContactPageLiveVerificationNotesExport {
    packageVersion: string;
    exportType: "contactPageLiveVerificationNotes";
    generatedUtc: string;
    pageSourceRoute: string;
    contactPageSlug: "contact";
    verificationRows: readonly ArcSecsContactPageLiveVerificationRow[];
    footerHandoffGuidance: string;
    schemaSafetyStatus: string;
    employerClientOmissionStatus: string;
    warnings: readonly string[];
    recommendedFixes: readonly string[];
    speculativeBoundaryText: string;
    exportContainsExecutableCode: false;
}

export interface ArcSecsViewportScrollbarAccessibilityFixMetadata {
    packageVersion: "5.8.36";
    exportType: "viewportScrollbarAccessibilityFix";
    pageSourceRoute: "/arcsecs-physics-engine-demo/";
    bodyOverflowY: "auto";
    bodyOverflowX: "hidden";
    demoOverflowY: "visible";
    shortHeightGridCanScroll: true;
    lowerPanelsReachable: true;
    coreRuntimePhysicsChanged: false;
    speculativeBoundaryText: string;
}
