import type { DarkMatterDriveRecipe, DarkMatterDriveTelemetry, DarkMatterDriveTimelineEvent } from "./DarkMatterDriveState";

export interface DarkMatterDriveSnapshot {
    readonly running: boolean;
    readonly recipe: DarkMatterDriveRecipe;
    readonly warnings: readonly string[];
    readonly telemetry: DarkMatterDriveTelemetry;
    readonly timeline: readonly DarkMatterDriveTimelineEvent[];
    readonly timelineIndex: number;
    readonly scientificBoundary: string;
}

export class DarkMatterDriveController {
    private readonly scientificBoundary: string = "Speculative research visualization — not established current technology.";
    private running: boolean = false;
    private timelineIndex: number = 0;

    public createSnapshot(recipe: DarkMatterDriveRecipe, telemetry: DarkMatterDriveTelemetry, timeline: readonly DarkMatterDriveTimelineEvent[], warnings: readonly string[]): DarkMatterDriveSnapshot {
        return {
            running: this.running,
            recipe,
            warnings,
            telemetry,
            timeline,
            timelineIndex: this.timelineIndex,
            scientificBoundary: this.scientificBoundary
        };
    }

    public start(): void {
        this.running = true;
    }

    public pause(): void {
        this.running = false;
    }

    public moveTimelineNext(maximumIndex: number): void {
        this.timelineIndex = Math.min(maximumIndex, this.timelineIndex + 1);
    }
}
