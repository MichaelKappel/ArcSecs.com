/**
 * ArcSecs Physics Engine Demo v5.7.31 TypeScript architecture entrypoint.
 * Compatibility note: carries forward the v5.7.5 TypeScript architecture entrypoint contract while adding v5.7.31 populated Project Handoff memory exports.
 *
 * The compiled browser bundle in assets/js keeps WordPress install simple while the
 * strict source tree below provides the production architecture contracts used by
 * deterministic replay, typed-array entity memory, scenario math, UI commands,
 * telemetry formatting, and Canvas 2D rendering fallback.
 */



export { UniversalRelationalEpochModel } from "./arcsecs/chronology/UniversalRelationalEpochModel";
export type { UniversalRelationalEpochInput, UniversalRelationalEpochSnapshot } from "./arcsecs/chronology/UniversalRelationalEpochModel";
export { RelationalDistanceCalculator } from "./arcsecs/distance/RelationalDistanceCalculator";
export type { DarkStandardSirenEstimate, DarkStandardSirenHostCandidate, RelationalDistancePacket } from "./arcsecs/distance/RelationalDistanceCalculator";
export { ClocklessMultiMessengerSystem } from "./arcsecs/multimessenger/ClocklessMultiMessengerSystem";
export type { ClocklessMultiMessengerObservationInput, ClocklessMultiMessengerObservationResult, SubstrateDensitySample } from "./arcsecs/multimessenger/ClocklessMultiMessengerSystem";
export { TerminologyGuardrail } from "./arcsecs/validation/TerminologyGuardrail";

export { DarkMatterDrivePublicContractClient, darkMatterDrivePublicContractEndpoints } from "./arcsecs/contracts/DarkMatterDrivePublicContracts";
export type { DarkMatterDriveContractAlignmentState, DarkMatterDriveContractEndpointDescriptor, DarkMatterDriveContractEndpointKey, DarkMatterDriveContractEndpointResult, DarkMatterDriveContractFetchReport, DarkMatterDriveContractFetchStatus, DarkMatterDriveContractFetcher, DarkMatterDriveContractPayloadSummary } from "./arcsecs/contracts/DarkMatterDrivePublicContracts";
export { DeploymentInstallRegressionAudit } from "./arcsecs/deployment/DeploymentInstallRegressionAudit";
export { ArcSecsStrictExportBuilders } from "./arcsecs/exports/StrictTypeScriptExportBuilders";
export { arcsecsExportBuilderHandoff } from "./arcsecs/exports/ExportBuilderHandoff";
export type { ArcSecsExportBuilderHandoff } from "./arcsecs/exports/ExportBuilderHandoff";
export type { ArcSecsBenchmarkJsonPayload, ArcSecsCalibrationCertificatePayload, ArcSecsEvidencePacketPayload, ArcSecsExportBuildResult, ArcSecsExportContext, ArcSecsExportSourceReference, ArcSecsExportTarget, ArcSecsExportValidationIssue, ArcSecsOperatorRunbookPayload, ArcSecsQualityGatePayload, ArcSecsQualityGateSnapshot, ArcSecsResearchBundlePayload, ArcSecsSceneJsonPayload } from "./arcsecs/exports/ExportSchemaContracts";
export type { DeploymentAssetRecord, DeploymentInstallRegressionCheck, DeploymentInstallRegressionInput, DeploymentInstallRegressionReport } from "./arcsecs/deployment/DeploymentInstallRegressionAudit";
export { DistanceTimeUiWiringAudit } from "./arcsecs/distance-time/DistanceTimeUiWiringAudit";
export type { DistanceTimeUiWiringAuditCheck, DistanceTimeUiWiringAuditInput, DistanceTimeUiWiringAuditReport } from "./arcsecs/distance-time/DistanceTimeUiWiringAudit";
export { DistanceTimeKernelModel, createDefaultMultiMessengerEvents } from "./arcsecs/distance-time/DistanceTimeKernelModel";
export type { DelayDecomposition, DistanceTimeKernelInput, DistanceTimeKernelSnapshot, DistanceTimeTelemetry, DistanceTimeKernelValidationCheck, GravityWavefront, MultiMessengerEvent, PhotonWavefront, RelationalDistanceEstimate, UniversalProgressionEstimate } from "./arcsecs/distance-time/DistanceTimeKernelModel";
export { FrameworkClaimMap, createDefaultFrameworkClaimCards } from "./arcsecs/claims/FrameworkClaimMap";
export type { FrameworkClaimCard, FrameworkClaimMapExportRecord, FrameworkClaimMapSelection } from "./arcsecs/claims/FrameworkClaimMap";
export { MultiMessengerEventTheater } from "./arcsecs/events/MultiMessengerEventTheater";
export type { MultiMessengerEventTheaterExport, MultiMessengerEventTheaterState } from "./arcsecs/events/MultiMessengerEventTheater";
export type { TerminologyGuardrailReport, TerminologyViolation } from "./arcsecs/validation/TerminologyGuardrail";

export { SeededRandom } from "./arcsecs/core/SeededRandom";
export { FixedStepClock } from "./arcsecs/core/FixedStepClock";
export { EngineLoop } from "./arcsecs/core/EngineLoop";
export type { EngineLoopDiagnostics, EngineLoopState, EngineRenderHandler, EngineTickHandler } from "./arcsecs/core/EngineLoop";
export { GravitySolver } from "./arcsecs/physics/GravitySolver";
export type { GravityAccelerationResult } from "./arcsecs/physics/GravitySolver";
export { RelationalSolver } from "./arcsecs/physics/RelationalSolver";
export type { RelationalEdgeState } from "./arcsecs/physics/RelationalSolver";
export { QuantumOscillatorDampingModel } from "./arcsecs/physics/QuantumOscillatorDampingModel";
export type { QuantumOscillatorDampingState } from "./arcsecs/physics/QuantumOscillatorDampingModel";
export { MassivePhotonModel } from "./arcsecs/physics/MassivePhotonModel";
export type { MassivePhotonState } from "./arcsecs/physics/MassivePhotonModel";
export { TiredLightDecayModel } from "./arcsecs/physics/TiredLightDecayModel";
export type { TiredLightDecayState } from "./arcsecs/physics/TiredLightDecayModel";
export { DarkStarEscapeModel } from "./arcsecs/physics/DarkStarEscapeModel";
export type { DarkStarEscapeState } from "./arcsecs/physics/DarkStarEscapeModel";
export { LensingModel } from "./arcsecs/physics/LensingModel";
export type { LensingComparisonState } from "./arcsecs/physics/LensingModel";
export { GalileanKinematicsModel } from "./arcsecs/physics/GalileanKinematicsModel";
export type { GalileanRelativeVelocityState } from "./arcsecs/physics/GalileanKinematicsModel";
export { DarkMatterDrivePipelineModel } from "./arcsecs/physics/DarkMatterDrivePipelineModel";
export type { DarkMatterDrivePipelineInput, DarkMatterDrivePipelineState, RamjetFailureMode } from "./arcsecs/physics/DarkMatterDrivePipelineModel";
export { StabilityLedgerChecks } from "./arcsecs/physics/StabilityLedgerChecks";
export type { StabilityLedgerInput, StabilityLedgerState } from "./arcsecs/physics/StabilityLedgerChecks";
export { EventBus } from "./arcsecs/core/EventBus";
export { CommandDispatcher } from "./arcsecs/core/CommandDispatcher";
export type { ArcSecsCommand, ArcSecsCommandName, CommandHandlerResult } from "./arcsecs/core/CommandDispatcher";
export { EntityMemory } from "./arcsecs/ecs/EntityMemory";
export { PhotonPool } from "./arcsecs/ecs/PhotonPool";
export { EntityTypeFlag } from "./arcsecs/ecs/ComponentTypes";
export type { PhotonComponent, OscillatorProbeComponent, SolverLinkComponent } from "./arcsecs/ecs/ComponentTypes";
export { ArcSecsSpeculativePhysics } from "./arcsecs/physics/ArcSecsSpeculativePhysics";
export type { EnergyLedgerResult, LensingResult, RamjetPipelineResult } from "./arcsecs/physics/ArcSecsSpeculativePhysics";
export { scenarioCatalog } from "./arcsecs/scenarios/ScenarioCatalog";
export type { ArcSecsScenarioKey, ScenarioCatalogItem } from "./arcsecs/scenarios/ScenarioCatalog";
export { CanvasRenderer2D } from "./arcsecs/rendering/CanvasRenderer2D";
export type { RenderCameraState, RenderFrameDiagnostics } from "./arcsecs/rendering/CanvasRenderer2D";
export { TelemetryPresenter } from "./arcsecs/ui/TelemetryPresenter";
export type { TelemetryRow } from "./arcsecs/ui/TelemetryPresenter";
export { ControlBindings, defaultKeyboardPresetBindings } from "./arcsecs/ui/ControlBindings";
export type { KeyboardPresetBinding } from "./arcsecs/ui/ControlBindings";
export { DeterministicReplay } from "./arcsecs/testing/DeterministicReplay";
export type { ReplaySummary } from "./arcsecs/testing/DeterministicReplay";
export { ValidationLab } from "./arcsecs/validation/ValidationLab";
export type { ArcsecondCalibrationState, ValidationLabCheck, ValidationLabInput, ValidationLabReport } from "./arcsecs/validation/ValidationLab";
export { AssumptionLadder } from "./arcsecs/ui/AssumptionLadder";
export type { AssumptionLadderRow, AssumptionLadderState, PhysicistScorecardState } from "./arcsecs/ui/AssumptionLadder";
export { ScenarioVisualStateBuilder } from "./arcsecs/rendering/ScenarioVisualStateBuilder";
export type { ScenarioVisualInput, ScenarioVisualState, VisualPrimitive, VisualPrimitiveType } from "./arcsecs/rendering/ScenarioVisualStateBuilder";
export { PerformanceBudgetGovernor } from "./arcsecs/performance/PerformanceBudgetGovernor";
export type { PerformanceBudgetInput, PerformanceBudgetRecommendation, PerformanceRiskLevel, VisualEffectLevel } from "./arcsecs/performance/PerformanceBudgetGovernor";
export { RuntimeReadinessAudit } from "./arcsecs/ui/RuntimeReadinessAudit";
export type { RuntimeReadinessCheck, RuntimeReadinessInput, RuntimeReadinessReport, RuntimeReadinessStatus } from "./arcsecs/ui/RuntimeReadinessAudit";
export { AutoLaunchDirector } from "./arcsecs/ui/AutoLaunchDirector";
export type { AutoLaunchInput, AutoLaunchPlan, AutoLaunchStatus } from "./arcsecs/ui/AutoLaunchDirector";
export { ExperimentDirector } from "./arcsecs/experiments/ExperimentDirector";
export { FlightRecorder } from "./arcsecs/observability/FlightRecorder";
export { ReviewCockpit } from "./arcsecs/review/ReviewCockpit";
export { NextActionCommandCenter } from "./arcsecs/actions/NextActionCommandCenter";
export { RunYourOwnSimulationGuide, defaultParameterGuidePresets } from "./arcsecs/guides/RunYourOwnSimulationGuide";
export type { ParameterGuidePreset, ParameterGuideSnapshot, ParameterGuideValue } from "./arcsecs/guides/RunYourOwnSimulationGuide";
export { ExperimentRecipeLab } from "./arcsecs/recipes/ExperimentRecipeLab";
export type { ExperimentRecipe, ExperimentRecipeIssueSeverity, ExperimentRecipeShareState, ExperimentRecipeValidationIssue, ExperimentRecipeValidationResult, ExperimentRecipeValidationStatus, ExperimentRecipeValue } from "./arcsecs/recipes/ExperimentRecipeLab";
export { ExperimentComparisonWorkbench } from "./arcsecs/recipes/ExperimentComparisonWorkbench";
export type { ExperimentComparisonGrandTour, ExperimentComparisonPresetRow, ExperimentComparisonStageRow, ExperimentComparisonSummary, ExperimentComparisonWorkbenchPacket } from "./arcsecs/recipes/ExperimentComparisonWorkbench";
export { ExperimentPlaylistRunner } from "./arcsecs/recipes/ExperimentPlaylistRunner";
export type { ExperimentPlaylistComparisonInput, ExperimentPlaylistItem, ExperimentPlaylistItemStatus, ExperimentPlaylistPacket, ExperimentPlaylistResultInput, ExperimentPlaylistSummary } from "./arcsecs/recipes/ExperimentPlaylistRunner";
export { ExperimentReplayTimeline } from "./arcsecs/replay/ExperimentReplayTimeline";
export type { ExperimentReplayTimelinePacket, ExperimentReplayTimelineReport, ReplayMetricDelta, ReplayPlaybackState, ReplayStageSnapshot, ReplayTimelineEvent, ReplayVisualMarker } from "./arcsecs/replay/ExperimentReplayTimeline";
export { ExperimentSensitivityScanner } from "./arcsecs/sensitivity/ExperimentSensitivityScanner";
export type { ExperimentSensitivityScanPacket, ExperimentSensitivityScanReport, SensitivityAxisDefinition, SensitivityScanPoint, SensitivitySeverity, SensitivityTippingPoint } from "./arcsecs/sensitivity/ExperimentSensitivityScanner";
export { ExperimentLabNotebook } from "./arcsecs/notebook/ExperimentLabNotebook";
export type { ExperimentLabNotebookPacket, LabNotebookEntry, LabNotebookMetricCard, LabNotebookResultInput, LabNotebookSource, LabNotebookSummary } from "./arcsecs/notebook/ExperimentLabNotebook";
export type { ReviewCockpitAssumptionRisk, ReviewCockpitFlightRecorderInput, ReviewCockpitGrandExperimentInput, ReviewCockpitGrandExperimentRow, ReviewCockpitGuidedTourInput, ReviewCockpitInput, ReviewCockpitLatestMetricsInput, ReviewCockpitReport, ReviewCockpitStatus, ReviewCockpitWeakPoint } from "./arcsecs/review/ReviewCockpit";
export type { NextActionCommandCenterInput, NextActionItem, NextActionKind, NextActionMetricsInput, NextActionPlan, NextActionReviewInput, NextActionSeverity, NextActionStatus } from "./arcsecs/actions/NextActionCommandCenter";
export { GuidedAutopilotTour, guidedAutopilotTourStages } from "./arcsecs/tour/GuidedAutopilotTour";
export type { GuidedTourSnapshot, GuidedTourStageDefinition, GuidedTourStageState, GuidedTourStageStatus } from "./arcsecs/tour/GuidedAutopilotTour";
export type { FlightRecorderEvent, FlightRecorderEventInput, FlightRecorderSeverity, FlightRecorderSnapshot } from "./arcsecs/observability/FlightRecorder";
export type { GrandExperimentPackage, GrandExperimentScenarioKey, GrandExperimentStageDefinition, GrandExperimentStageResult, GrandExperimentSummary, ScenarioMetricSample } from "./arcsecs/experiments/ExperimentDirector";

export type ScenarioKey =
    | 'control'
    | 'vsl'
    | 'relationalLattice'
    | 'teleparallelGravity'
    | 'tiredLightPhotonDecay'
    | 'entropicBetaMatter'
    | 'mondRotationCurves'
    | 'procaPhotonDispersion'
    | 'eitSlowLight'
    | 'rigidBodyDiagnostics'
    | 'ccctl'
    | 'darkMatterDrive'
    | 'darkMatterRamjet'
    | 'absoluteTimeQuantumOscillator'
    | 'massivePhotonLensing'
    | 'newtonianDarkStar'
    | 'superluminalGalilean'
    | 'tiredLightEnergyLedger'
    | 'darkMatterCondensate'
    | 'parallaxCalibration'
    | 'sunSimulation';

export interface Result<TValue> {
    readonly ok: boolean;
    readonly value?: TValue;
    readonly error?: string;
}

export interface SimulationConfig {
    readonly scenario: ScenarioKey;
    readonly acceptedSteps: number;
    readonly speedMultiplier: number;
    readonly lossRate: number;
    readonly photonMassEv: number;
    readonly betaCoupling: number;
    readonly groupVelocityFraction: number;
    readonly restitution: number;
    readonly friction: number;
}

export interface SimulationMetrics {
    readonly entityCount: number;
    readonly photonPacketCount: number;
    readonly constraintCount: number;
    readonly finalEnergyFraction: number;
    readonly finalRedshift: number;
    readonly energyLedgerClosureProxy: number;
}

export interface SimulationSnapshot {
    readonly engineVersion: string;
    readonly runTimestampUtc: string;
    readonly config: SimulationConfig;
    readonly metrics: SimulationMetrics;
    readonly buffer: ReadonlyArray<number>;
}

/** Represents a 2D mathematical vector for rendering and diagnostics. */
export class Vector2 {
    public readonly x: number;
    public readonly y: number;

    /**
     * Creates a vector.
     * @param x Horizontal coordinate.
     * @param y Vertical coordinate.
     */
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/** Strategy contract for gravity models. */
export interface GravityModel {
    /**
     * Calculates scalar acceleration at a radius.
     * @param massProxy Baryonic or effective mass proxy.
     * @param radius Radius from the source.
     */
    calculateAcceleration(massProxy: number, radius: number): number;
}

/** Strategy contract for photon energy models. */
export interface PhotonDecayModel {
    /**
     * Calculates photon energy after relational distance.
     * @param initialEnergy Initial packet energy.
     * @param distance Relational distance traveled.
     */
    calculateEnergy(initialEnergy: number, distance: number): number;
}

/** Coordinates all simulation events and UI updates. */
export interface LegacyEventBus {
    /**
     * Subscribes to an event.
     * @param name Event name.
     * @param callback Callback executed with event payload.
     */
    on(name: string, callback: (payload: unknown) => void): void;

    /**
     * Publishes an event.
     * @param name Event name.
     * @param payload Event payload.
     */
    emit(name: string, payload: unknown): void;
}

/** Stores and validates browser-side scene/run memory. */
export interface DemoMemoryStore {
    /**
     * Saves a snapshot.
     * @param name User-facing run name.
     * @param snapshot Simulation snapshot to persist.
     */
    saveRun(name: string, snapshot: SimulationSnapshot): void;

    /** Exports current memory as inert JSON text. */
    exportJson(): string;

    /**
     * Imports inert JSON after schema validation.
     * @param jsonText JSON payload selected by the user.
     */
    importJson(jsonText: string): Result<void>;
}

/** Renders the active scenario to a canvas. */
export interface Renderer {
    /**
     * Renders one frame.
     * @param snapshot Latest simulation snapshot.
     * @param framenumber Current animation frame number.
     */
    render(snapshot: SimulationSnapshot, framenumber: number): void;
}


/** Represents a Dark Matter Drive Ramjet subsystem state emitted by the conceptual solver. */
export interface DarkMatterDriveSubsystemState {
    readonly id: string;
    readonly displayName: string;
    readonly status: "offline" | "standby" | "nominal" | "stressed" | "warning" | "critical" | "shutdown";
    readonly inputValue: number;
    readonly outputValue: number;
    readonly efficiency: number;
    readonly heatLoad: number;
    readonly stressLoad: number;
}

/** Runtime telemetry for the v4.6.0 ramjet flight-director layer. */
export interface DarkMatterDriveAdvancedTelemetry {
    readonly missionReadiness: number;
    readonly crewDoseProxy: number;
    readonly exhaustDivergence: number;
    readonly thermalCapacity: number;
    readonly subsystemStates: readonly DarkMatterDriveSubsystemState[];
}


/** Experimental scenario identifiers added for the v4.6.0 Relational Theatrical Physics Engine layer. */
export type ExperimentalPhysicsMode =
    | "relationalFlatSpaceEngine"
    | "massivePhotonProca"
    | "mechanisticTiredLight"
    | "flatSpaceLensing"
    | "singularitySafeGravity"
    | "monteCarloPhotonPipeline"
    | "parallaxCalibration"
    | "photometricCalibration";

/** Deterministic Monte Carlo photon transport summary used by the experimental pipeline. */
export interface MonteCarloPhotonTransportResult {
    readonly emitted: number;
    readonly absorbed: number;
    readonly scattered: number;
    readonly detected: number;
    readonly averageEnergyLoss: number;
    readonly seed: number;
}

/** Parallax calibration result for the arcsecond / AU / parsec benchmark. */
export interface ParallaxCalibrationResult {
    readonly parallaxArcseconds: number;
    readonly baselineAu: number;
    readonly parsecs: number;
    readonly lightYears: number;
}


/** v4.6.0 validation benchmark emitted by the worker-side Validation Lab. */
export interface ValidationBenchmarkTarget {
    readonly name: string;
    readonly expected: string;
    readonly actual: string | number;
    readonly passed: boolean;
}

/** v4.6.0 validation suite summary for internal consistency checks. */
export interface ExperimentalValidationLabResult {
    readonly suiteName: string;
    readonly runUtc: string;
    readonly passed: number;
    readonly failed: number;
    readonly validationScore: number;
    readonly observationalFitScore: number;
    readonly calibrationPassed: boolean;
    readonly photonLedgerPassed: boolean;
    readonly finiteTelemetryPassed: boolean;
    readonly benchmarkTargets: readonly ValidationBenchmarkTarget[];
    readonly caution: string;
}

/** Synthetic observation frame comparing a speculative branch against a baseline. */
export interface SyntheticObservationFrame {
    readonly mode: string;
    readonly headline: string;
    readonly primaryMeasurement: number;
    readonly secondaryMeasurement: number;
    readonly comparisonBaseline: number;
    readonly observationDelta: number;
    readonly signalQuality: number;
    readonly recommendedNextStep: string;
}

/** Result row emitted by the multi-scenario automated benchmark suite. */
export interface ScenarioBenchmarkRow {
    readonly scenario: string;
    readonly label: string;
    readonly ledger: string;
    readonly validationScore: number;
    readonly observationalFitScore: number;
    readonly baselineDelta: number;
    readonly warnings: string;
    readonly testsPassed: number;
    readonly testsTotal: number;
}


/** v4.6.0 deterministic calibration certificate emitted after each scenario run. */
export interface CalibrationCertificate {
    readonly name: string;
    readonly generatedUtc: string;
    readonly score: number;
    readonly verdict: string;
    readonly caution: string;
    readonly checks: ReadonlyArray<{ readonly id: string; readonly label: string; readonly passed: boolean; readonly value: number | string }>;
}

/** v4.6.0 scenario readiness matrix used by the operator UI. */
export interface ModeReadinessMatrix {
    readonly scenario: ScenarioKey;
    readonly score: number;
    readonly nextImprovement: string;
    readonly rows: ReadonlyArray<{ readonly area: string; readonly status: 'pass' | 'warn' | 'fail'; readonly detail: string }>;
}

/** v4.6.0 guided experiment queue row. */
export interface ExperimentQueueItem {
    readonly order: number;
    readonly scenario: ScenarioKey;
    readonly action: string;
    readonly selected: boolean;
    readonly status: 'active' | 'queued';
}


/** v4.6.0 deployment quality gate generated by the worker after every run. */
export interface QualityGateReport {
    readonly generatedUtc: string;
    readonly score: number;
    readonly status: "pass" | "warn" | "fail";
    readonly checks: ReadonlyArray<{ readonly id: string; readonly label: string; readonly passed: boolean; readonly detail: string; }>;
    readonly deploymentNote: string;
}

/** v4.6.0 scenario passport used by the operator UI and exported run reports. */
export interface ScenarioPassport {
    readonly engineVersion: string;
    readonly scenario: string;
    readonly generatedUtc: string;
    readonly primaryAssumptions: ReadonlyArray<string>;
    readonly controlsBound: ReadonlyArray<string>;
    readonly telemetryHeadline: string;
    readonly scientificBoundary: string;
    readonly nextExperiment: string;
}

/** v4.6.0 anomaly triage row for operator-grade diagnostics. */
export interface AnomalyTriage {
    readonly scenario: string;
    readonly count: number;
    readonly anomalies: ReadonlyArray<{ readonly severity: "pass" | "warn" | "critical"; readonly label: string; readonly action: string; }>;
}


/** v4.6.0 deterministic stability row emitted by the worker-side numerical stability drilldown. */
export interface V40NumericalStabilityRow {
    readonly label: String;
    readonly value: String;
    readonly status: String;
}

/** v4.6.0 capability map row describing active features for the current scenario. */
export interface V40ScenarioCapability {
    readonly label: String;
    readonly enabled: Boolean;
}

/** v4.6.0 release readiness checklist item. */
export interface V40ReleaseReadinessItem {
    readonly label: String;
    readonly passed: Boolean;
    readonly detail: String;
}
