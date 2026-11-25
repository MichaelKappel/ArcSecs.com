import { DarkMatterDriveAutopilotState } from "./DarkMatterDriveAutopilotDirector";
import { DarkMatterDriveDemoFlightVerification } from "./DarkMatterDriveDemoFlightVerification";
import { DarkMatterDriveDemoFlightTimeline } from "./DarkMatterDriveDemoFlightTimeline";

export type DarkMatterDriveDemoFlightScorecardMetricStatus = "pass" | "watch";

export interface DarkMatterDriveDemoFlightScorecardMetric {
    readonly key: string;
    readonly label: string;
    readonly value: number;
    readonly target: number;
    readonly unit: string;
    readonly status: DarkMatterDriveDemoFlightScorecardMetricStatus;
    readonly finite: boolean;
    readonly note: string;
}

export interface DarkMatterDriveDemoFlightScorecard {
    readonly stageId: string;
    readonly stageTitle: string;
    readonly status: DarkMatterDriveDemoFlightScorecardMetricStatus;
    readonly passedCount: number;
    readonly totalCount: number;
    readonly timelineReady: boolean;
    readonly finite: boolean;
    readonly operatorMessage: string;
    readonly nextRecommendedAction: string;
    readonly metrics: readonly DarkMatterDriveDemoFlightScorecardMetric[];
}

export interface DarkMatterDriveDemoFlightScorecardSnapshot {
    readonly recipe: Readonly<Record<string, number | string | boolean>>;
    readonly telemetry: Readonly<Record<string, number | string | boolean>>;
}

export class DarkMatterDriveDemoFlightScorecardBuilder {
    public build(snapshot: DarkMatterDriveDemoFlightScorecardSnapshot, state: DarkMatterDriveAutopilotState, verification: DarkMatterDriveDemoFlightVerification, timeline: DarkMatterDriveDemoFlightTimeline): DarkMatterDriveDemoFlightScorecard {
        const stageId: string = state.stage?.id ?? "none";
        const metrics: DarkMatterDriveDemoFlightScorecardMetric[] = [
            this.metric("drive-output", "Drive output", this.numberValue(snapshot.telemetry.driveOutput, 0), stageId === "thermal-stress" ? 0.35 : 0.2, "", "above", "Propulsion output should visibly respond to the active demo recipe."),
            this.metric("capture-rate", "Capture / charge rate", this.numberValue(snapshot.telemetry.driveChargeRate, 0), stageId === "align-scoop" ? 0.7 : 0.25, "", "above", "Capture packets should intensify during scoop and filament stages."),
            this.metric("thermal-load", "Thermal load", this.numberValue(snapshot.telemetry.thermalLoad, 0), stageId === "thermal-stress" ? 1.15 : 1.35, "", "below", "Thermal load can rise during stress, but must remain finite and bounded."),
            this.metric("line-of-sight", "Optical resistance", this.numberValue(snapshot.recipe.lineOfSightOpticalResistance, 0), stageId === "dense-filament" || stageId === "missing-counterpart" ? 2.3 : 0.4, "×", "above", "Dense or missing-counterpart stages should increase photon degradation pressure."),
            this.metric("stage-progress", "Stage progress", state.progress, 0, "%", "finite", "Progress must remain finite so the timeline and replay can be audited.")
        ];
        const passedCount: number = metrics.filter((metric: DarkMatterDriveDemoFlightScorecardMetric): boolean => metric.status === "pass" && metric.finite).length;
        const timelineReady: boolean = timeline.entries.length === state.stageCount;
        return {
            stageId,
            stageTitle: state.stage?.title ?? "No active stage",
            status: verification.status === "pass" && passedCount >= 3 && timelineReady ? "pass" : "watch",
            passedCount,
            totalCount: metrics.length,
            timelineReady,
            finite: metrics.every((metric: DarkMatterDriveDemoFlightScorecardMetric): boolean => metric.finite) && state.finite,
            operatorMessage: state.stage?.operatorCue ?? "Select a demo stage to see operator guidance.",
            nextRecommendedAction: stageId === "thermal-stress" ? "Export Demo Flight Verification and inspect thermal bottleneck telemetry." : "Advance or click another stage to compare motion, telemetry, and verification state.",
            metrics
        };
    }

    private metric(key: string, label: string, value: number, target: number, unit: string, direction: "above" | "below" | "finite", note: string): DarkMatterDriveDemoFlightScorecardMetric {
        const finite: boolean = Number.isFinite(value) && Number.isFinite(target);
        let status: DarkMatterDriveDemoFlightScorecardMetricStatus = "watch";
        if (direction === "above") {
            status = value >= target ? "pass" : "watch";
        } else if (direction === "below") {
            status = value <= target ? "pass" : "watch";
        } else {
            status = finite ? "pass" : "watch";
        }
        return { key, label, value, target, unit, status, finite, note };
    }

    private numberValue(value: number | string | boolean | undefined, fallback: number): number {
        return typeof value === "number" && Number.isFinite(value) ? value : fallback;
    }
}
