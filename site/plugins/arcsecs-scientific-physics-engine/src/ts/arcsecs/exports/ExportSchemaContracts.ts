import type { DistanceTimeKernelSnapshot, DistanceTimeKernelValidationCheck } from "../distance-time/DistanceTimeKernelModel";
import type { FrameworkClaimMapExportRecord } from "../claims/FrameworkClaimMap";
import type { MultiMessengerEventTheaterExport } from "../events/MultiMessengerEventTheater";
import type { DarkMatterDriveContractAlignmentState } from "../contracts/DarkMatterDrivePublicContracts";

export type ArcSecsExportTarget = "benchmarkJson" | "calibrationCertificate" | "qualityGate" | "operatorRunbook" | "evidencePacket" | "researchBundle" | "sceneJson";

export interface ArcSecsExportSourceReference {
    readonly documentName: string;
    readonly role: string;
}

export interface ArcSecsExportValidationIssue {
    readonly fieldName: string;
    readonly severity: "error" | "warning";
    readonly message: string;
}

export interface ArcSecsExportBuildResult<TPayload> {
    readonly success: boolean;
    readonly payload: TPayload | null;
    readonly validationErrors: readonly ArcSecsExportValidationIssue[];
}

export interface ArcSecsQualityGateSnapshot {
    readonly gateStatus: string;
    readonly blockingFailures: readonly string[];
    readonly warnings: readonly string[];
    readonly validationChecklist: readonly string[];
    readonly finiteTelemetryStatus: string;
    readonly exportCompletenessStatus: string;
    readonly speculativeBoundaryStatus: string;
    readonly claimTraceabilityStatus: string;
}

export interface ArcSecsExportContext {
    readonly engineVersion: string;
    readonly generatedUtc: string;
    readonly activeScenario: string;
    readonly activeStoryStep: string;
    readonly simulationSettings: Readonly<Record<string, number | string | boolean | null>>;
    readonly distanceTimeKernel: DistanceTimeKernelSnapshot;
    readonly frameworkClaimMap: readonly FrameworkClaimMapExportRecord[];
    readonly eventTheater: MultiMessengerEventTheaterExport;
    readonly validationLedger: readonly DistanceTimeKernelValidationCheck[];
    readonly qualityGate: ArcSecsQualityGateSnapshot;
    readonly telemetrySnapshot: Readonly<Record<string, number | string | boolean | null>>;
    readonly viewportState: Readonly<Record<string, number | string | boolean | null>>;
    readonly sourceReferences: readonly ArcSecsExportSourceReference[];
    readonly caveats: readonly string[];
    readonly speculativeBoundaryText: string;
    readonly falsificationPaths: readonly string[];
    readonly sourceContractAlignment: DarkMatterDriveContractAlignmentState;
}

export interface ArcSecsExportPayloadBase {
    readonly packetType: string;
    readonly engineVersion: string;
    readonly generatedUtc: string;
    readonly activeScenario: string;
    readonly sourceReferences: readonly ArcSecsExportSourceReference[];
    readonly caveats: readonly string[];
    readonly speculativeBoundaryText: string;
    readonly falsificationPaths: readonly string[];
    readonly exportContainsExecutableCode: false;
    readonly sourceContractAlignment: DarkMatterDriveContractAlignmentState;
}

export interface ArcSecsBenchmarkJsonPayload extends ArcSecsExportPayloadBase {
    readonly activeEventName: string;
    readonly distanceTimeKernel: DistanceTimeKernelSnapshot;
    readonly gravityWavefrontTelemetry: DistanceTimeKernelSnapshot["gravityWavefront"];
    readonly photonWavefrontTelemetry: DistanceTimeKernelSnapshot["photonWavefront"];
    readonly eventTheaterTelemetry: MultiMessengerEventTheaterExport;
    readonly claimMapDemonstratedState: readonly FrameworkClaimMapExportRecord[];
    readonly validationLedgerSummary: readonly DistanceTimeKernelValidationCheck[];
    readonly qualityGateSummary: ArcSecsQualityGateSnapshot;
    readonly deterministicBenchmarkValues: Readonly<Record<string, number | string | boolean | null>>;
}

export interface ArcSecsCalibrationCertificatePayload extends ArcSecsExportPayloadBase {
    readonly scenarioContext: string;
    readonly eventContext: string;
    readonly distanceEstimateSummary: DistanceTimeKernelSnapshot["distanceEstimates"];
    readonly universalProgressionSummary: DistanceTimeKernelSnapshot["progressionEstimates"];
    readonly wavefrontOrderingSummary: string;
    readonly validationChecksPassed: readonly string[];
    readonly validationChecksFailed: readonly string[];
    readonly qualityGateResult: string;
    readonly falsificationNotes: readonly string[];
}

export interface ArcSecsQualityGatePayload extends ArcSecsExportPayloadBase {
    readonly gateStatus: string;
    readonly blockingFailures: readonly string[];
    readonly warnings: readonly string[];
    readonly validationChecklist: readonly string[];
    readonly finiteTelemetryStatus: string;
    readonly exportCompletenessStatus: string;
    readonly speculativeBoundaryStatus: string;
    readonly claimTraceabilityStatus: string;
    readonly distanceTimeKernel: DistanceTimeKernelSnapshot;
    readonly frameworkClaimMap: readonly FrameworkClaimMapExportRecord[];
    readonly eventTheater: MultiMessengerEventTheaterExport;
}

export interface ArcSecsOperatorRunbookPayload extends ArcSecsExportPayloadBase {
    readonly selectedScenario: string;
    readonly recommendedSteps: readonly string[];
    readonly activeStoryPath: string;
    readonly eventTheaterInstructions: readonly string[];
    readonly telemetryToWatch: readonly string[];
    readonly validationChecksAndMeaning: readonly string[];
    readonly failureMeanings: readonly string[];
}

export interface ArcSecsEvidencePacketPayload extends ArcSecsExportPayloadBase {
    readonly traceabilityChainLabel: "Claim → Visual demo → Telemetry → Validation → Export → Falsification path";
    readonly claimTraceability: readonly FrameworkClaimMapExportRecord[];
    readonly activeEvent: MultiMessengerEventTheaterExport["activeEvent"];
    readonly eventDelayDecomposition: MultiMessengerEventTheaterExport["delayDecomposition"];
    readonly telemetrySnapshots: Readonly<Record<string, unknown>>;
    readonly validationSnapshots: readonly DistanceTimeKernelValidationCheck[];
    readonly qualityGateResult: ArcSecsQualityGateSnapshot;
}

export interface ArcSecsResearchBundlePayload extends ArcSecsExportPayloadBase {
    readonly scenarioEventStoryState: Readonly<Record<string, string>>;
    readonly kernelTelemetry: DistanceTimeKernelSnapshot;
    readonly claimMapState: readonly FrameworkClaimMapExportRecord[];
    readonly eventTheaterState: MultiMessengerEventTheaterExport;
    readonly validationAndQualityGateState: Readonly<Record<string, unknown>>;
    readonly publicExplanationSummary: string;
}

export interface ArcSecsSceneJsonPayload extends ArcSecsExportPayloadBase {
    readonly scenarioType: string;
    readonly simulationSettings: Readonly<Record<string, number | string | boolean | null>>;
    readonly visualSceneState: Readonly<Record<string, number | string | boolean | null>>;
    readonly selectedEvent: string;
    readonly sourceObserverCoordinates: Readonly<Record<string, number>>;
    readonly gravityWavefrontState: DistanceTimeKernelSnapshot["gravityWavefront"];
    readonly photonWavefrontState: DistanceTimeKernelSnapshot["photonWavefront"];
    readonly mediumDensityPathState: Readonly<Record<string, number | string | boolean | null>>;
    readonly delayMarkers: MultiMessengerEventTheaterExport["delayDecomposition"];
    readonly claimHighlightState: readonly string[];
    readonly storyStepState: string;
    readonly telemetrySnapshot: Readonly<Record<string, number | string | boolean | null>>;
    readonly validationEvidenceMarkers: readonly string[];
}
