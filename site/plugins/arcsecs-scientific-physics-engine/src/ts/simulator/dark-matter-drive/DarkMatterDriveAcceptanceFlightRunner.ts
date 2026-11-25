import { DarkMatterDriveAutopilotStage } from "./DarkMatterDriveAutopilotDirector";
import { DarkMatterDriveDemoFlightVerification } from "./DarkMatterDriveDemoFlightVerification";
import { DarkMatterDriveDemoFlightTimelineEntry } from "./DarkMatterDriveDemoFlightTimeline";
import { DarkMatterDriveDemoFlightScorecard } from "./DarkMatterDriveDemoFlightScorecard";
import { DarkMatterDriveDemoFlightEvidenceLedger } from "./DarkMatterDriveDemoFlightEvidenceLedger";
import { DarkMatterDriveArchitectureSweep } from "./DarkMatterDriveArchitectureSweep";
import { DarkMatterDriveMissionRecorderSnapshot } from "./DarkMatterDriveDemoFlightMissionRecorder";
import { DarkMatterDriveDemoFlightDebrief } from "./DarkMatterDriveDemoFlightDebrief";

export type DarkMatterDriveAcceptanceStatus = "pass" | "fail";

export interface DarkMatterDriveAcceptanceStageSnapshot {
    readonly stageIndex: number;
    readonly stageId: string;
    readonly stageTitle: string;
    readonly visited: boolean;
    readonly telemetryFinite: boolean;
    readonly verificationStatus: string;
    readonly scorecardStatus: string;
    readonly evidenceLedgerStatus: string;
    readonly architectureStatus: string;
    readonly missionDebriefStatus: string;
    readonly failureReasons: readonly string[];
}

export interface DarkMatterDriveAcceptanceExportMatrixEntry {
    readonly key: string;
    readonly label: string;
    readonly present: boolean;
}

export interface DarkMatterDriveAcceptanceRun {
    readonly startedAtTick: number;
    readonly completedAtTick: number;
    readonly stageCount: number;
    readonly visitedStageCount: number;
    readonly requiredExportKeyCount: number;
    readonly presentExportKeyCount: number;
    readonly telemetryFinite: boolean;
    readonly speculativeBoundaryPresent: boolean;
    readonly status: DarkMatterDriveAcceptanceStatus;
}

export interface DarkMatterDriveAcceptanceResult {
    readonly demoFlightAcceptanceRun: DarkMatterDriveAcceptanceRun;
    readonly demoFlightAcceptanceStages: readonly DarkMatterDriveAcceptanceStageSnapshot[];
    readonly demoFlightAcceptanceResults: readonly string[];
    readonly demoFlightAcceptanceExportMatrix: readonly DarkMatterDriveAcceptanceExportMatrixEntry[];
    readonly demoFlightAcceptanceFailures: readonly string[];
    readonly demoFlightAcceptancePass: boolean;
}

export interface DarkMatterDriveAcceptanceInput {
    readonly startedAtTick: number;
    readonly completedAtTick: number;
    readonly stages: readonly DarkMatterDriveAutopilotStage[];
    readonly visitedStageIds: readonly string[];
    readonly verification: DarkMatterDriveDemoFlightVerification | null;
    readonly timeline: readonly DarkMatterDriveDemoFlightTimelineEntry[];
    readonly scorecard: DarkMatterDriveDemoFlightScorecard | null;
    readonly evidenceLedger: DarkMatterDriveDemoFlightEvidenceLedger | null;
    readonly architectureSweep: DarkMatterDriveArchitectureSweep | null;
    readonly missionRecorder: DarkMatterDriveMissionRecorderSnapshot | null;
    readonly missionDebrief: DarkMatterDriveDemoFlightDebrief | null;
    readonly exportPayload: Readonly<Record<string, unknown>>;
    readonly telemetryFinite: boolean;
    readonly speculativeBoundaryPresent: boolean;
}

export class DarkMatterDriveAcceptanceFlightRunner {
    public readonly requiredExportKeys: readonly string[] = [
        "demoDirector",
        "demoStages",
        "demoStageVerification",
        "demoStageTimeline",
        "demoStageScorecard",
        "demoStageEvidenceLedger",
        "demoFlightArchitectureSweep",
        "demoFlightRunLog",
        "demoFlightOperatorNotes",
        "demoFlightExportAudit",
        "demoFlightMissionRecorder",
        "demoFlightMissionDebrief"
    ];

    public buildResult(input: DarkMatterDriveAcceptanceInput): DarkMatterDriveAcceptanceResult {
        const exportMatrix: DarkMatterDriveAcceptanceExportMatrixEntry[] = this.requiredExportKeys.map((key) => ({
            key,
            label: this.formatLabel(key),
            present: Object.prototype.hasOwnProperty.call(input.exportPayload, key)
        }));

        const stages: DarkMatterDriveAcceptanceStageSnapshot[] = input.stages.map((stage, index) => {
            const visited: boolean = input.visitedStageIds.indexOf(stage.id) >= 0;
            const failureReasons: string[] = [];

            if (!visited) {
                failureReasons.push("required stage was not visited");
            }

            if (!input.telemetryFinite) {
                failureReasons.push("telemetry is non-finite");
            }

            if (!input.verification) {
                failureReasons.push("verification state is missing");
            }

            if (!input.scorecard) {
                failureReasons.push("scorecard state is missing");
            }

            if (!input.evidenceLedger) {
                failureReasons.push("evidence ledger state is missing");
            }

            if (!input.architectureSweep) {
                failureReasons.push("architecture sweep state is missing");
            }

            if (!input.missionDebrief) {
                failureReasons.push("mission debrief state is missing");
            }

            return {
                stageIndex: index,
                stageId: stage.id,
                stageTitle: stage.title,
                visited,
                telemetryFinite: input.telemetryFinite,
                verificationStatus: input.verification ? input.verification.status : "missing",
                scorecardStatus: input.scorecard ? input.scorecard.status : "missing",
                evidenceLedgerStatus: input.evidenceLedger ? input.evidenceLedger.ledgerStatus : "missing",
                architectureStatus: input.architectureSweep ? input.architectureSweep.overallStatus : "missing",
                missionDebriefStatus: input.missionDebrief ? input.missionDebrief.status : "missing",
                failureReasons
            };
        });

        const failures: string[] = [];
        const missingExportKeys: string[] = exportMatrix.filter((entry) => !entry.present).map((entry) => entry.key);
        const unvisitedStages: string[] = stages.filter((stage) => !stage.visited).map((stage) => stage.stageId);

        if (unvisitedStages.length > 0) {
            failures.push(`Unvisited stages: ${unvisitedStages.join(", ")}`);
        }

        if (missingExportKeys.length > 0) {
            failures.push(`Missing export payload keys: ${missingExportKeys.join(", ")}`);
        }

        if (!input.telemetryFinite) {
            failures.push("Telemetry is non-finite.");
        }

        if (!input.verification) {
            failures.push("Verification state is missing.");
        }

        if (!input.scorecard) {
            failures.push("Scorecard state is missing.");
        }

        if (!input.evidenceLedger) {
            failures.push("Evidence ledger state is missing.");
        }

        if (!input.architectureSweep) {
            failures.push("Architecture sweep state is missing.");
        }

        if (!input.speculativeBoundaryPresent) {
            failures.push("Speculative-boundary text is absent.");
        }

        const pass: boolean = failures.length === 0;

        return {
            demoFlightAcceptanceRun: {
                startedAtTick: input.startedAtTick,
                completedAtTick: input.completedAtTick,
                stageCount: input.stages.length,
                visitedStageCount: input.visitedStageIds.length,
                requiredExportKeyCount: this.requiredExportKeys.length,
                presentExportKeyCount: exportMatrix.filter((entry) => entry.present).length,
                telemetryFinite: input.telemetryFinite,
                speculativeBoundaryPresent: input.speculativeBoundaryPresent,
                status: pass ? "pass" : "fail"
            },
            demoFlightAcceptanceStages: stages,
            demoFlightAcceptanceResults: pass ? ["Acceptance flight passed."] : ["Acceptance flight failed."],
            demoFlightAcceptanceExportMatrix: exportMatrix,
            demoFlightAcceptanceFailures: failures,
            demoFlightAcceptancePass: pass
        };
    }

    private formatLabel(key: string): string {
        return key.replace(/([A-Z])/g, " $1").replace(/^./, (firstCharacter: string) => firstCharacter.toUpperCase());
    }
}
