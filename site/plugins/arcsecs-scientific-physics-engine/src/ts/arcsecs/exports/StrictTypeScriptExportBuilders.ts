import type { DistanceTimeKernelSnapshot, DistanceTimeKernelValidationCheck } from "../distance-time/DistanceTimeKernelModel";
import type { FrameworkClaimMapExportRecord } from "../claims/FrameworkClaimMap";
import type { MultiMessengerEventTheaterExport } from "../events/MultiMessengerEventTheater";
import { arcsecsExportBuilderHandoff } from "./ExportBuilderHandoff";
import type {
    ArcSecsBenchmarkJsonPayload,
    ArcSecsCalibrationCertificatePayload,
    ArcSecsEvidencePacketPayload,
    ArcSecsExportBuildResult,
    ArcSecsExportContext,
    ArcSecsExportPayloadBase,
    ArcSecsExportValidationIssue,
    ArcSecsOperatorRunbookPayload,
    ArcSecsQualityGatePayload,
    ArcSecsResearchBundlePayload,
    ArcSecsSceneJsonPayload
} from "./ExportSchemaContracts";

/** Builds all ArcSecs Distance-Time export targets from typed simulator state. */
export class ArcSecsStrictExportBuilders {
    /** Builds Benchmark JSON with Distance-Time Kernel, Claim Map, and Event Theater telemetry. */
    public buildBenchmarkJson(context: ArcSecsExportContext): ArcSecsExportBuildResult<ArcSecsBenchmarkJsonPayload> {
        const errors: readonly ArcSecsExportValidationIssue[] = this.validateContext(context);
        if (errors.some((issue: ArcSecsExportValidationIssue) => issue.severity === "error")) {
            return this.fail(errors);
        }
        const payload: ArcSecsBenchmarkJsonPayload = Object.freeze({
            ...this.basePayload("ArcSecs Benchmark JSON", context),
            activeEventName: context.distanceTimeKernel.activeEvent.eventName,
            distanceTimeKernel: context.distanceTimeKernel,
            gravityWavefrontTelemetry: context.distanceTimeKernel.gravityWavefront,
            photonWavefrontTelemetry: context.distanceTimeKernel.photonWavefront,
            eventTheaterTelemetry: context.eventTheater,
            claimMapDemonstratedState: context.frameworkClaimMap,
            validationLedgerSummary: context.validationLedger,
            qualityGateSummary: context.qualityGate,
            deterministicBenchmarkValues: this.normalizedTelemetry(context.telemetrySnapshot)
        });
        return this.pass(payload, errors);
    }

    /** Builds the calibration certificate export. */
    public buildCalibrationCertificate(context: ArcSecsExportContext): ArcSecsExportBuildResult<ArcSecsCalibrationCertificatePayload> {
        const errors: readonly ArcSecsExportValidationIssue[] = this.validateContext(context);
        if (errors.some((issue: ArcSecsExportValidationIssue) => issue.severity === "error")) {
            return this.fail(errors);
        }
        const passedChecks: readonly string[] = context.validationLedger.filter((check: DistanceTimeKernelValidationCheck) => check.passed).map((check: DistanceTimeKernelValidationCheck) => check.label);
        const failedChecks: readonly string[] = context.validationLedger.filter((check: DistanceTimeKernelValidationCheck) => !check.passed).map((check: DistanceTimeKernelValidationCheck) => check.label);
        const photonArrivalLabel: string = context.distanceTimeKernel.telemetry.photonArrival === null ? "photon missing below detection threshold" : "gravity baseline precedes photon arrival";
        const payload: ArcSecsCalibrationCertificatePayload = Object.freeze({
            ...this.basePayload("ArcSecs Calibration Certificate", context),
            scenarioContext: context.activeScenario,
            eventContext: context.distanceTimeKernel.activeEvent.eventName,
            distanceEstimateSummary: context.distanceTimeKernel.distanceEstimates,
            universalProgressionSummary: context.distanceTimeKernel.progressionEstimates,
            wavefrontOrderingSummary: photonArrivalLabel,
            validationChecksPassed: passedChecks,
            validationChecksFailed: failedChecks,
            qualityGateResult: context.qualityGate.gateStatus,
            falsificationNotes: context.falsificationPaths
        });
        return this.pass(payload, errors);
    }

    /** Builds the strict quality gate export. */
    public buildQualityGate(context: ArcSecsExportContext): ArcSecsExportBuildResult<ArcSecsQualityGatePayload> {
        const errors: readonly ArcSecsExportValidationIssue[] = this.validateContext(context);
        if (errors.some((issue: ArcSecsExportValidationIssue) => issue.severity === "error")) {
            return this.fail(errors);
        }
        const payload: ArcSecsQualityGatePayload = Object.freeze({
            ...this.basePayload("ArcSecs Quality Gate Export", context),
            gateStatus: context.qualityGate.gateStatus,
            blockingFailures: context.qualityGate.blockingFailures,
            warnings: context.qualityGate.warnings,
            validationChecklist: context.qualityGate.validationChecklist,
            finiteTelemetryStatus: context.qualityGate.finiteTelemetryStatus,
            exportCompletenessStatus: context.qualityGate.exportCompletenessStatus,
            speculativeBoundaryStatus: context.qualityGate.speculativeBoundaryStatus,
            claimTraceabilityStatus: context.qualityGate.claimTraceabilityStatus,
            distanceTimeKernel: context.distanceTimeKernel,
            frameworkClaimMap: context.frameworkClaimMap,
            eventTheater: context.eventTheater
        });
        return this.pass(payload, errors);
    }

    /** Builds the operator runbook export. */
    public buildOperatorRunbook(context: ArcSecsExportContext): ArcSecsExportBuildResult<ArcSecsOperatorRunbookPayload> {
        const errors: readonly ArcSecsExportValidationIssue[] = this.validateContext(context);
        if (errors.some((issue: ArcSecsExportValidationIssue) => issue.severity === "error")) {
            return this.fail(errors);
        }
        const payload: ArcSecsOperatorRunbookPayload = Object.freeze({
            ...this.basePayload("ArcSecs Operator Runbook", context),
            selectedScenario: context.activeScenario,
            recommendedSteps: Object.freeze([
                "Select Distance-Time Kernel.",
                "Select GW170817, GW190521, GW190814, synthetic dense-filament, and synthetic void-line-of-sight events.",
                "Confirm gravity arrives before visible light or missing-counterpart state is labeled.",
                "Open Framework Claim Map and click each claim to highlight viewport and telemetry.",
                "Run Validation Lab and Quality Gate before sharing exports."
            ]),
            activeStoryPath: context.activeStoryStep,
            eventTheaterInstructions: Object.freeze(context.eventTheater.validationResults.slice()),
            telemetryToWatch: Object.freeze(["distanceParsecs", "messengerDelay", "photonEnergyRemaining", "mediumDensityMultiplier", "redshiftProxy", "janusComplexityIndex"]),
            validationChecksAndMeaning: Object.freeze(context.validationLedger.map((check: DistanceTimeKernelValidationCheck) => `${check.label}: ${check.detail}`)),
            failureMeanings: context.falsificationPaths
        });
        return this.pass(payload, errors);
    }

    /** Builds the Evidence Packet export with the required traceability chain. */
    public buildEvidencePacket(context: ArcSecsExportContext): ArcSecsExportBuildResult<ArcSecsEvidencePacketPayload> {
        const errors: readonly ArcSecsExportValidationIssue[] = this.validateContext(context);
        if (errors.some((issue: ArcSecsExportValidationIssue) => issue.severity === "error")) {
            return this.fail(errors);
        }
        const telemetrySnapshots: Readonly<Record<string, unknown>> = Object.freeze({
            kernelTelemetry: context.distanceTimeKernel.telemetry,
            wavefrontTelemetry: context.eventTheater.wavefrontTelemetry,
            delayDecomposition: context.eventTheater.delayDecomposition,
            viewportState: context.viewportState
        });
        const payload: ArcSecsEvidencePacketPayload = Object.freeze({
            ...this.basePayload("ArcSecs Evidence Packet", context),
            traceabilityChainLabel: "Claim → Visual demo → Telemetry → Validation → Export → Falsification path",
            claimTraceability: context.frameworkClaimMap,
            activeEvent: context.eventTheater.activeEvent,
            eventDelayDecomposition: context.eventTheater.delayDecomposition,
            telemetrySnapshots,
            validationSnapshots: context.validationLedger,
            qualityGateResult: context.qualityGate
        });
        return this.pass(payload, errors);
    }

    /** Builds the Research Bundle export for outside reviewers. */
    public buildResearchBundle(context: ArcSecsExportContext): ArcSecsExportBuildResult<ArcSecsResearchBundlePayload> {
        const errors: readonly ArcSecsExportValidationIssue[] = this.validateContext(context);
        if (errors.some((issue: ArcSecsExportValidationIssue) => issue.severity === "error")) {
            return this.fail(errors);
        }
        const scenarioEventStoryState: Readonly<Record<string, string>> = Object.freeze({
            scenario: context.activeScenario,
            event: context.distanceTimeKernel.activeEvent.eventName,
            storyStep: context.activeStoryStep
        });
        const validationAndQualityGateState: Readonly<Record<string, unknown>> = Object.freeze({
            validationLedger: context.validationLedger,
            qualityGate: context.qualityGate
        });
        const payload: ArcSecsResearchBundlePayload = Object.freeze({
            ...this.basePayload("ArcSecs Research Bundle", context),
            scenarioEventStoryState,
            kernelTelemetry: context.distanceTimeKernel,
            claimMapState: context.frameworkClaimMap,
            eventTheaterState: context.eventTheater,
            validationAndQualityGateState,
            publicExplanationSummary: "ArcSecs tests whether distance and universal progression can be visualized without making lightyears, local clocks, or physical spacetime foundational."
        });
        return this.pass(payload, errors);
    }

    /** Builds the visual Scene JSON export. */
    public buildSceneJson(context: ArcSecsExportContext): ArcSecsExportBuildResult<ArcSecsSceneJsonPayload> {
        const errors: readonly ArcSecsExportValidationIssue[] = this.validateContext(context);
        if (errors.some((issue: ArcSecsExportValidationIssue) => issue.severity === "error")) {
            return this.fail(errors);
        }
        const sourceObserverCoordinates: Readonly<Record<string, number>> = Object.freeze({ sourceX: 0.1, sourceY: 0.5, observerX: 0.9, observerY: 0.5 });
        const mediumDensityPathState: Readonly<Record<string, number | string | boolean | null>> = Object.freeze({ densityMultiplier: context.distanceTimeKernel.telemetry.mediumDensityMultiplier, visibilityStatus: context.distanceTimeKernel.activeEvent.electromagneticCounterpartStatus, photonVisible: context.distanceTimeKernel.telemetry.photonArrival !== null });
        const payload: ArcSecsSceneJsonPayload = Object.freeze({
            ...this.basePayload("ArcSecs Scene JSON", context),
            scenarioType: context.activeScenario,
            simulationSettings: this.normalizedTelemetry(context.simulationSettings),
            visualSceneState: this.normalizedTelemetry(context.viewportState),
            selectedEvent: context.distanceTimeKernel.activeEvent.eventName,
            sourceObserverCoordinates,
            gravityWavefrontState: context.distanceTimeKernel.gravityWavefront,
            photonWavefrontState: context.distanceTimeKernel.photonWavefront,
            mediumDensityPathState,
            delayMarkers: context.eventTheater.delayDecomposition,
            claimHighlightState: context.distanceTimeKernel.activeClaimKeys,
            storyStepState: context.activeStoryStep,
            telemetrySnapshot: this.normalizedTelemetry(context.telemetrySnapshot),
            validationEvidenceMarkers: Object.freeze(context.validationLedger.map((check: DistanceTimeKernelValidationCheck) => check.key))
        });
        return this.pass(payload, errors);
    }

    private basePayload(packetType: string, context: ArcSecsExportContext): ArcSecsExportPayloadBase {
        return Object.freeze({
            packetType,
            engineVersion: context.engineVersion,
            generatedUtc: context.generatedUtc,
            activeScenario: context.activeScenario,
            sourceReferences: context.sourceReferences,
            caveats: context.caveats,
            speculativeBoundaryText: context.speculativeBoundaryText,
            falsificationPaths: context.falsificationPaths,
            exportContainsExecutableCode: false,
            sourceContractAlignment: context.sourceContractAlignment
        });
    }

    private validateContext(context: ArcSecsExportContext): readonly ArcSecsExportValidationIssue[] {
        const issues: ArcSecsExportValidationIssue[] = [];
        if (!/^\d{4}-\d{2}-\d{2}T/.test(context.generatedUtc) || context.generatedUtc.endsWith("Z") === false) {
            issues.push({ fieldName: "generatedUtc", severity: "error", message: "Generated timestamp must be UTC ISO-8601 text ending in Z." });
        }
        if (context.activeScenario.length === 0) {
            issues.push({ fieldName: "activeScenario", severity: "error", message: "Active scenario is required." });
        }
        if (context.distanceTimeKernel.modeName !== "Distance-Time Kernel") {
            issues.push({ fieldName: "distanceTimeKernel.modeName", severity: "warning", message: "Export was built outside the Distance-Time Kernel mode." });
        }
        if (!this.telemetryIsFinite(context.telemetrySnapshot)) {
            issues.push({ fieldName: "telemetrySnapshot", severity: "error", message: "Telemetry snapshot contains non-finite numeric output." });
        }
        if (!this.telemetryIsFinite(context.viewportState)) {
            issues.push({ fieldName: "viewportState", severity: "error", message: "Viewport state contains non-finite numeric output." });
        }
        if (!Number.isFinite(context.distanceTimeKernel.photonWavefront.energyRemaining) || context.distanceTimeKernel.photonWavefront.energyRemaining < 0) {
            issues.push({ fieldName: "photonWavefront.energyRemaining", severity: "error", message: "Photon energy must be finite and non-negative." });
        }
        if (context.frameworkClaimMap.length === 0) {
            issues.push({ fieldName: "frameworkClaimMap", severity: "error", message: "Framework Claim Map export records are required." });
        }
        if (context.validationLedger.length === 0) {
            issues.push({ fieldName: "validationLedger", severity: "error", message: "Validation ledger is required." });
        }
        if (!/speculative research visualization/i.test(context.speculativeBoundaryText)) {
            issues.push({ fieldName: "speculativeBoundaryText", severity: "error", message: "Speculative boundary text is required." });
        }
        if (context.sourceReferences.length < arcsecsExportBuilderHandoff.sourceReferences.length) {
            issues.push({ fieldName: "sourceReferences", severity: "warning", message: "Expected project source references should be included." });
        }
        return Object.freeze(issues);
    }

    private normalizedTelemetry(source: Readonly<Record<string, number | string | boolean | null>>): Readonly<Record<string, number | string | boolean | null>> {
        const normalized: Record<string, number | string | boolean | null> = {};
        Object.keys(source).sort().forEach((key: string) => {
            const value: number | string | boolean | null = source[key];
            normalized[key] = typeof value === "number" ? this.finiteNumber(value, 0) : value;
        });
        return Object.freeze(normalized);
    }

    private telemetryIsFinite(source: Readonly<Record<string, number | string | boolean | null>>): boolean {
        return Object.keys(source).every((key: string) => {
            const value: number | string | boolean | null = source[key];
            return typeof value !== "number" || Number.isFinite(value);
        });
    }

    private finiteNumber(value: number, fallback: number): number {
        return Number.isFinite(value) ? value : fallback;
    }

    private pass<TPayload>(payload: TPayload, validationErrors: readonly ArcSecsExportValidationIssue[]): ArcSecsExportBuildResult<TPayload> {
        return Object.freeze({ success: true, payload, validationErrors });
    }

    private fail<TPayload>(validationErrors: readonly ArcSecsExportValidationIssue[]): ArcSecsExportBuildResult<TPayload> {
        return Object.freeze({ success: false, payload: null, validationErrors });
    }
}
