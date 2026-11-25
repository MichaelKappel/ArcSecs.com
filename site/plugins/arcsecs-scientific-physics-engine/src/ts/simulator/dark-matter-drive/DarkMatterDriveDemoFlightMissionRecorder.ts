import { DarkMatterDriveAutopilotState } from "./DarkMatterDriveAutopilotDirector";
import { DarkMatterDriveDemoFlightVerification } from "./DarkMatterDriveDemoFlightVerification";
import { DarkMatterDriveDemoFlightScorecard } from "./DarkMatterDriveDemoFlightScorecard";
import { DarkMatterDriveDemoFlightEvidenceLedger } from "./DarkMatterDriveDemoFlightEvidenceLedger";
import { DarkMatterDriveArchitectureSweep } from "./DarkMatterDriveArchitectureSweep";

export type DarkMatterDriveMissionRecorderEventType = "stage" | "export" | "operator-note" | "system";

export interface DarkMatterDriveMissionRecorderEntry {
    readonly sequence: number;
    readonly eventType: DarkMatterDriveMissionRecorderEventType;
    readonly action: string;
    readonly tick: number;
    readonly stageId: string;
    readonly stageTitle: string;
    readonly progress: number;
    readonly verificationStatus: string;
    readonly scorecardStatus: string;
    readonly evidenceStatus: string;
    readonly architectureStatus: string;
    readonly finite: boolean;
    readonly note: string;
}

export interface DarkMatterDriveMissionRecorderExportAudit {
    readonly sequence: number;
    readonly exportName: string;
    readonly tick: number;
    readonly stageId: string;
    readonly includesDemoDirector: boolean;
    readonly includesVerification: boolean;
    readonly includesTimeline: boolean;
    readonly includesScorecard: boolean;
    readonly includesEvidenceLedger: boolean;
    readonly includesArchitectureSweep: boolean;
    readonly includesRunLog: boolean;
    readonly finite: boolean;
}

export interface DarkMatterDriveMissionRecorderSnapshot {
    readonly demoFlightRunLog: readonly DarkMatterDriveMissionRecorderEntry[];
    readonly demoFlightOperatorNotes: string;
    readonly demoFlightExportAudit: readonly DarkMatterDriveMissionRecorderExportAudit[];
    readonly generatedAtTick: number;
    readonly currentStageId: string;
    readonly currentStageTitle: string;
    readonly finite: boolean;
}

export class DarkMatterDriveDemoFlightMissionRecorder {
    private readonly maxEntries: number;
    private runLog: DarkMatterDriveMissionRecorderEntry[];
    private exportAudit: DarkMatterDriveMissionRecorderExportAudit[];
    private sequence: number;

    public constructor(maxEntries: number) {
        this.maxEntries = Math.max(10, Math.round(maxEntries));
        this.runLog = [];
        this.exportAudit = [];
        this.sequence = 0;
    }

    public recordStage(
        action: string,
        state: DarkMatterDriveAutopilotState,
        verification: DarkMatterDriveDemoFlightVerification,
        scorecard: DarkMatterDriveDemoFlightScorecard,
        evidenceLedger: DarkMatterDriveDemoFlightEvidenceLedger,
        architectureSweep: DarkMatterDriveArchitectureSweep,
        tick: number,
        note: string
    ): DarkMatterDriveMissionRecorderEntry {
        this.sequence += 1;
        const entry: DarkMatterDriveMissionRecorderEntry = {
            sequence: this.sequence,
            eventType: "stage",
            action,
            tick,
            stageId: state.stage ? state.stage.id : "none",
            stageTitle: state.stage ? state.stage.title : "No active stage",
            progress: state.progress,
            verificationStatus: verification.status,
            scorecardStatus: scorecard.status,
            evidenceStatus: evidenceLedger.ledgerStatus,
            architectureStatus: architectureSweep.overallStatus,
            finite: Number.isFinite(tick) && state.finite && verification.finite && scorecard.finite && evidenceLedger.finite,
            note
        };
        this.append(entry);
        return entry;
    }

    public recordExport(
        exportName: string,
        tick: number,
        stageId: string,
        includesDemoDirector: boolean,
        includesVerification: boolean,
        includesTimeline: boolean,
        includesScorecard: boolean,
        includesEvidenceLedger: boolean,
        includesArchitectureSweep: boolean
    ): DarkMatterDriveMissionRecorderExportAudit {
        this.sequence += 1;
        const audit: DarkMatterDriveMissionRecorderExportAudit = {
            sequence: this.sequence,
            exportName,
            tick,
            stageId,
            includesDemoDirector,
            includesVerification,
            includesTimeline,
            includesScorecard,
            includesEvidenceLedger,
            includesArchitectureSweep,
            includesRunLog: true,
            finite: Number.isFinite(tick)
        };
        this.exportAudit.push(audit);
        if (this.exportAudit.length > this.maxEntries) {
            this.exportAudit.shift();
        }
        return audit;
    }

    public snapshot(state: DarkMatterDriveAutopilotState, operatorNotes: string, generatedAtTick: number): DarkMatterDriveMissionRecorderSnapshot {
        return {
            demoFlightRunLog: this.runLog.slice(),
            demoFlightOperatorNotes: operatorNotes,
            demoFlightExportAudit: this.exportAudit.slice(),
            generatedAtTick,
            currentStageId: state.stage ? state.stage.id : "none",
            currentStageTitle: state.stage ? state.stage.title : "No active stage",
            finite: Number.isFinite(generatedAtTick) && this.runLog.every((entry) => entry.finite) && this.exportAudit.every((entry) => entry.finite)
        };
    }

    private append(entry: DarkMatterDriveMissionRecorderEntry): void {
        this.runLog.push(entry);
        if (this.runLog.length > this.maxEntries) {
            this.runLog.shift();
        }
    }
}
