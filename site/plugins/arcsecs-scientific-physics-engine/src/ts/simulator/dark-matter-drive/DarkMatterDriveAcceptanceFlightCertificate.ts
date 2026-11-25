import { DarkMatterDriveAcceptanceResult } from "./DarkMatterDriveAcceptanceFlightRunner";
import { DarkMatterDriveMissionRecorderSnapshot } from "./DarkMatterDriveDemoFlightMissionRecorder";
import { DarkMatterDriveDemoFlightDebrief } from "./DarkMatterDriveDemoFlightDebrief";

export interface DarkMatterDriveAcceptanceCertificate {
    readonly certificateId: string;
    readonly packageVersion: string;
    readonly generatedAtUtc: string;
    readonly generatedAtTick: number;
    readonly acceptanceStatus: string;
    readonly acceptancePass: boolean;
    readonly stageCoverage: string;
    readonly exportCoverage: string;
    readonly failureCount: number;
    readonly finiteTelemetry: boolean;
    readonly operatorNotesPresent: boolean;
    readonly missionDebriefStatus: string;
    readonly boundaryAcknowledgement: string;
    readonly recommendedNextAction: string;
    readonly certificatePayloadVersion: string;
}

export interface DarkMatterDriveAcceptanceFailureDrilldown {
    readonly index: number;
    readonly status: "pass" | "fail";
    readonly message: string;
    readonly recommendedAction: string;
}

export interface DarkMatterDriveAcceptanceCertificateBundle {
    readonly demoFlightAcceptanceCertificate: DarkMatterDriveAcceptanceCertificate;
    readonly demoFlightAcceptanceFailureDrilldown: readonly DarkMatterDriveAcceptanceFailureDrilldown[];
}

export class DarkMatterDriveAcceptanceFlightCertificateBuilder {
    public build(
        acceptance: DarkMatterDriveAcceptanceResult,
        missionRecorder: DarkMatterDriveMissionRecorderSnapshot,
        missionDebrief: DarkMatterDriveDemoFlightDebrief,
        packageVersion: string,
        generatedAtUtc: string,
        generatedAtTick: number
    ): DarkMatterDriveAcceptanceCertificateBundle {
        const failureMessages: readonly string[] = acceptance.demoFlightAcceptanceFailures.length > 0
            ? acceptance.demoFlightAcceptanceFailures
            : ["Acceptance flight passed."];

        const drilldown: DarkMatterDriveAcceptanceFailureDrilldown[] = failureMessages.map((message, index) => ({
            index,
            status: acceptance.demoFlightAcceptancePass ? "pass" : "fail",
            message,
            recommendedAction: acceptance.demoFlightAcceptancePass
                ? "Use this certificate as the acceptance evidence packet."
                : "Open the Acceptance Flight panel, complete missing stages, and export again."
        }));

        const certificate: DarkMatterDriveAcceptanceCertificate = {
            certificateId: this.buildCertificateId(packageVersion, generatedAtTick, acceptance.demoFlightAcceptancePass, acceptance.demoFlightAcceptanceRun.visitedStageCount, acceptance.demoFlightAcceptanceFailures.length),
            packageVersion,
            generatedAtUtc,
            generatedAtTick,
            acceptanceStatus: acceptance.demoFlightAcceptanceRun.status,
            acceptancePass: acceptance.demoFlightAcceptancePass,
            stageCoverage: `${acceptance.demoFlightAcceptanceRun.visitedStageCount}/${acceptance.demoFlightAcceptanceRun.stageCount}`,
            exportCoverage: `${acceptance.demoFlightAcceptanceRun.presentExportKeyCount}/${acceptance.demoFlightAcceptanceRun.requiredExportKeyCount}`,
            failureCount: acceptance.demoFlightAcceptanceFailures.length,
            finiteTelemetry: acceptance.demoFlightAcceptanceRun.telemetryFinite,
            operatorNotesPresent: missionRecorder.demoFlightOperatorNotes.trim().length > 0,
            missionDebriefStatus: missionDebrief.status,
            boundaryAcknowledgement: "Speculative simulator acceptance certificate only; not proof or settled physics.",
            recommendedNextAction: acceptance.demoFlightAcceptancePass
                ? "Archive the certificate with Demo Flight Verification, Evidence, Architecture, Debrief, and Replay JSON."
                : "Resolve failure drilldown items and rerun Acceptance Flight.",
            certificatePayloadVersion: "1"
        };

        return {
            demoFlightAcceptanceCertificate: certificate,
            demoFlightAcceptanceFailureDrilldown: drilldown
        };
    }

    private buildCertificateId(packageVersion: string, tick: number, pass: boolean, visitedStageCount: number, failureCount: number): string {
        const status: string = pass ? "PASS" : "FAIL";
        return `DMD-AF-${packageVersion}-${status}-${Math.round(tick)}-${visitedStageCount}-${failureCount}`;
    }
}
