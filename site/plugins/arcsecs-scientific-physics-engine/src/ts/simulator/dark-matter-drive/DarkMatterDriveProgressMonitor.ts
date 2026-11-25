import type { DarkMatterDriveTelemetry, DarkMatterDriveTimelineEvent } from "./DarkMatterDriveState";

export interface DarkMatterDriveProgressState {
    readonly simulationProgressPercent: number;
    readonly missionProgressPercent: number;
    readonly estimatedSecondsRemaining: number;
    readonly statusText: string;
}

export interface DarkMatterDriveProcessingLogEntry {
    readonly index: number;
    readonly label: string;
    readonly detail: string;
    readonly severity: "info" | "warning" | "success";
}

export class DarkMatterDriveProgressMonitor {
    private readonly entries: DarkMatterDriveProcessingLogEntry[] = [];
    private nextIndex: number = 1;

    public buildProgressState(tick: number, missionIndex: number, missionStageCount: number, running: boolean, telemetry: DarkMatterDriveTelemetry): DarkMatterDriveProgressState {
        const simulationProgressPercent: number = Math.max(0, Math.min(100, (tick % 720) / 7.2));
        const missionProgressPercent: number = missionStageCount <= 1 ? 100 : Math.max(0, Math.min(100, (missionIndex / (missionStageCount - 1)) * 100));
        const tickMilliseconds: number = Number.isFinite(telemetry.physicsTickMilliseconds) ? telemetry.physicsTickMilliseconds : 2;
        const estimatedSecondsRemaining: number = Math.max(0, (720 - (tick % 720)) * tickMilliseconds / 1000);
        const statusText: string = running ? "Running deterministic simulation loop" : "Paused and ready for parameter changes";
        return { simulationProgressPercent, missionProgressPercent, estimatedSecondsRemaining, statusText };
    }

    public addEntry(label: string, detail: string, severity: "info" | "warning" | "success" = "info"): readonly DarkMatterDriveProcessingLogEntry[] {
        this.entries.unshift({ index: this.nextIndex, label, detail, severity });
        this.nextIndex += 1;
        if (this.entries.length > 24) {
            this.entries.length = 24;
        }
        return this.getEntries();
    }

    public getEntries(): readonly DarkMatterDriveProcessingLogEntry[] {
        return this.entries.slice();
    }

    public describeTimelineEvent(event: DarkMatterDriveTimelineEvent | null): string {
        if (!event) {
            return "Timeline is waiting for the first deterministic event.";
        }
        return `${event.marker}: ${event.why}`;
    }
}
