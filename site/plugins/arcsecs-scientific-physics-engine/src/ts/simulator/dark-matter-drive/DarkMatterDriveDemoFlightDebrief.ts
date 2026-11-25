import { DarkMatterDriveAutopilotStage } from "./DarkMatterDriveAutopilotDirector";
import { DarkMatterDriveMissionRecorderSnapshot } from "./DarkMatterDriveDemoFlightMissionRecorder";
import { DarkMatterDriveArchitectureSweep } from "./DarkMatterDriveArchitectureSweep";

export type DarkMatterDriveDemoFlightDebriefStatus = "ready" | "complete" | "watch";

export interface DarkMatterDriveDemoFlightDebriefItem {
    readonly key: string;
    readonly label: string;
    readonly status: DarkMatterDriveDemoFlightDebriefStatus;
    readonly evidence: string;
    readonly nextAction: string;
}

export interface DarkMatterDriveDemoFlightDebrief {
    readonly status: DarkMatterDriveDemoFlightDebriefStatus;
    readonly stageCount: number;
    readonly recordedStageCount: number;
    readonly exportAuditCount: number;
    readonly operatorNotesPresent: boolean;
    readonly architectureStatus: string;
    readonly finite: boolean;
    readonly items: readonly DarkMatterDriveDemoFlightDebriefItem[];
    readonly recommendedNextAction: string;
}

export class DarkMatterDriveDemoFlightDebriefBuilder {
    public build(
        stages: readonly DarkMatterDriveAutopilotStage[],
        missionRecorder: DarkMatterDriveMissionRecorderSnapshot,
        architectureSweep: DarkMatterDriveArchitectureSweep
    ): DarkMatterDriveDemoFlightDebrief {
        const recordedStageCount: number = missionRecorder.demoFlightRunLog.length;
        const exportAuditCount: number = missionRecorder.demoFlightExportAudit.length;
        const operatorNotesPresent: boolean = missionRecorder.demoFlightOperatorNotes.trim().length > 0;
        const allStagesTouched: boolean = stages.every((stage) => missionRecorder.demoFlightRunLog.some((entry) => entry.stageId === stage.id));
        const exportsTouched: boolean = exportAuditCount > 0;
        const finite: boolean = missionRecorder.finite && architectureSweep.finiteTelemetryGuard;
        const status: DarkMatterDriveDemoFlightDebriefStatus = allStagesTouched && exportsTouched && finite ? "complete" : (finite ? "ready" : "watch");

        const items: DarkMatterDriveDemoFlightDebriefItem[] = [
            this.item("stage-coverage", "Stage coverage", allStagesTouched ? "complete" : "ready", `${recordedStageCount} recorded stage events`, "Click each Demo Flight stage card."),
            this.item("export-audit", "Export audit", exportsTouched ? "complete" : "ready", `${exportAuditCount} export events recorded`, "Export Verification, Evidence, Architecture, and Replay JSON."),
            this.item("operator-notes", "Operator notes", operatorNotesPresent ? "complete" : "ready", operatorNotesPresent ? "Operator notes included." : "No operator notes yet.", "Add what you saw before exporting."),
            this.item("architecture-status", "Architecture status", architectureSweep.overallStatus === "pass" ? "complete" : "watch", architectureSweep.overallStatus, "Review the Architecture Sweep panel."),
            this.item("finite-run-log", "Finite run log", finite ? "complete" : "watch", finite ? "Recorder and architecture telemetry are finite." : "A finite telemetry guard needs attention.", "Inspect JSON for invalid numeric values.")
        ];

        return {
            status,
            stageCount: stages.length,
            recordedStageCount,
            exportAuditCount,
            operatorNotesPresent,
            architectureStatus: architectureSweep.overallStatus,
            finite,
            items,
            recommendedNextAction: status === "complete" ? "Use the exported debrief as the live acceptance evidence packet." : "Complete every stage, add notes, export all JSON, then review the debrief again."
        };
    }

    private item(key: string, label: string, status: DarkMatterDriveDemoFlightDebriefStatus, evidence: string, nextAction: string): DarkMatterDriveDemoFlightDebriefItem {
        return {
            key,
            label,
            status,
            evidence,
            nextAction
        };
    }
}
