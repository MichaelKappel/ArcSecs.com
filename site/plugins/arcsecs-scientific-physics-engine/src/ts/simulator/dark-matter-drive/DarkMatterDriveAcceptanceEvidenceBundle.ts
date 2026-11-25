import { DarkMatterDriveAcceptanceResult } from "./DarkMatterDriveAcceptanceFlightRunner";
import { DarkMatterDriveAcceptanceCertificateBundle } from "./DarkMatterDriveAcceptanceFlightCertificate";
import { DarkMatterDriveMissionRecorderSnapshot } from "./DarkMatterDriveDemoFlightMissionRecorder";
import { DarkMatterDriveDemoFlightDebrief } from "./DarkMatterDriveDemoFlightDebrief";
import { DarkMatterDriveArchitectureSweep } from "./DarkMatterDriveArchitectureSweep";

export type DarkMatterDriveAcceptanceBundleStatus = "ready" | "complete" | "watch";

export interface DarkMatterDriveAcceptanceBundleArtifact {
    readonly key: string;
    readonly label: string;
    readonly present: boolean;
    readonly required: boolean;
}

export interface DarkMatterDriveAcceptanceEvidenceBundle {
    readonly bundleId: string;
    readonly packageVersion: string;
    readonly generatedAtUtc: string;
    readonly generatedAtTick: number;
    readonly status: DarkMatterDriveAcceptanceBundleStatus;
    readonly acceptancePass: boolean;
    readonly artifactCount: number;
    readonly requiredArtifactCount: number;
    readonly presentArtifactCount: number;
    readonly missingArtifactCount: number;
    readonly failureCount: number;
    readonly operatorNotesPresent: boolean;
    readonly speculativeBoundaryPresent: boolean;
    readonly archiveRecommendation: string;
    readonly artifacts: readonly DarkMatterDriveAcceptanceBundleArtifact[];
}

export interface DarkMatterDriveAcceptanceEvidenceBundleInput {
    readonly packageVersion: string;
    readonly generatedAtUtc: string;
    readonly generatedAtTick: number;
    readonly acceptance: DarkMatterDriveAcceptanceResult;
    readonly certificateBundle: DarkMatterDriveAcceptanceCertificateBundle;
    readonly missionRecorder: DarkMatterDriveMissionRecorderSnapshot;
    readonly missionDebrief: DarkMatterDriveDemoFlightDebrief;
    readonly architectureSweep: DarkMatterDriveArchitectureSweep;
    readonly exportPayload: Readonly<Record<string, unknown>>;
    readonly speculativeBoundaryPresent: boolean;
}

export class DarkMatterDriveAcceptanceEvidenceBundleBuilder {
    public readonly requiredArtifactKeys: readonly string[] = [
        "demoFlightAcceptanceRun",
        "demoFlightAcceptanceStages",
        "demoFlightAcceptanceResults",
        "demoFlightAcceptanceExportMatrix",
        "demoFlightAcceptanceFailures",
        "demoFlightAcceptancePass",
        "demoFlightAcceptanceCertificate",
        "demoFlightAcceptanceFailureDrilldown",
        "demoFlightMissionRecorder",
        "demoFlightMissionDebrief",
        "demoFlightArchitectureSweep",
        "demoStageEvidenceLedger",
        "demoStageVerification",
        "demoStageScorecard",
        "demoStageTimeline",
        "demoDirector",
        "demoStages"
    ];

    public build(input: DarkMatterDriveAcceptanceEvidenceBundleInput): DarkMatterDriveAcceptanceEvidenceBundle {
        const artifacts: DarkMatterDriveAcceptanceBundleArtifact[] = this.requiredArtifactKeys.map((key) => ({
            key,
            label: this.formatLabel(key),
            present: Object.prototype.hasOwnProperty.call(input.exportPayload, key),
            required: true
        }));

        const presentArtifactCount: number = artifacts.filter((artifact) => artifact.present).length;
        const missingArtifactCount: number = artifacts.length - presentArtifactCount;
        const acceptancePass: boolean = input.acceptance.demoFlightAcceptancePass && input.certificateBundle.demoFlightAcceptanceCertificate.acceptancePass;
        const complete: boolean = acceptancePass
            && missingArtifactCount === 0
            && input.missionRecorder.finite
            && input.architectureSweep.finiteTelemetryGuard
            && input.speculativeBoundaryPresent;

        return {
            bundleId: this.buildBundleId(input.packageVersion, input.generatedAtTick, acceptancePass, missingArtifactCount, input.acceptance.demoFlightAcceptanceFailures.length),
            packageVersion: input.packageVersion,
            generatedAtUtc: input.generatedAtUtc,
            generatedAtTick: input.generatedAtTick,
            status: complete ? "complete" : (input.missionRecorder.finite ? "ready" : "watch"),
            acceptancePass,
            artifactCount: artifacts.length,
            requiredArtifactCount: artifacts.length,
            presentArtifactCount,
            missingArtifactCount,
            failureCount: input.acceptance.demoFlightAcceptanceFailures.length,
            operatorNotesPresent: input.missionRecorder.demoFlightOperatorNotes.trim().length > 0,
            speculativeBoundaryPresent: input.speculativeBoundaryPresent,
            archiveRecommendation: complete
                ? "Archive this bundle with exported Acceptance Flight, Certificate, Verification, Evidence, Architecture, Debrief, and Replay JSON."
                : "Resolve missing artifacts or acceptance failures, then rerun Acceptance Flight before archive.",
            artifacts
        };
    }

    private buildBundleId(packageVersion: string, tick: number, acceptancePass: boolean, missingArtifactCount: number, failureCount: number): string {
        const status: string = acceptancePass ? "PASS" : "FAIL";
        return `DMD-AFB-${packageVersion}-${status}-${Math.round(tick)}-${missingArtifactCount}-${failureCount}`;
    }

    private formatLabel(key: string): string {
        return key.replace(/([A-Z])/g, " $1").replace(/^./, (firstCharacter: string) => firstCharacter.toUpperCase());
    }
}
