import { DarkMatterDriveAutopilotStage, DarkMatterDriveAutopilotState } from "./DarkMatterDriveAutopilotDirector";
import { DarkMatterDriveDemoFlightVerification } from "./DarkMatterDriveDemoFlightVerification";

export interface DarkMatterDriveDemoFlightTimelineEntry {
    readonly stageIndex: number;
    readonly stageId: string;
    readonly stageTitle: string;
    readonly state: "complete" | "active" | "ready" | "pending";
    readonly progress: number;
    readonly finite: boolean;
    readonly active: boolean;
    readonly preset: string;
    readonly hotspotId: string;
    readonly eventPreset: string;
    readonly substrateDensityProfile: string;
    readonly verificationStatus: string;
    readonly operatorCue: string;
    readonly expectedMotion: string;
}

export interface DarkMatterDriveDemoFlightTimeline {
    readonly activeStageIndex: number;
    readonly stageCount: number;
    readonly finite: boolean;
    readonly entries: readonly DarkMatterDriveDemoFlightTimelineEntry[];
}

export class DarkMatterDriveDemoFlightTimelineBuilder {
    public build(stages: readonly DarkMatterDriveAutopilotStage[], state: DarkMatterDriveAutopilotState, verification: DarkMatterDriveDemoFlightVerification): DarkMatterDriveDemoFlightTimeline {
        const activeStageIndex: number = this.getSafeIndex(state.stageIndex, stages.length);
        const entries: DarkMatterDriveDemoFlightTimelineEntry[] = stages.map((stage: DarkMatterDriveAutopilotStage, index: number): DarkMatterDriveDemoFlightTimelineEntry => {
            const isActive: boolean = index === activeStageIndex;
            const progress: number = index < activeStageIndex ? 1 : (isActive ? this.clamp(state.progress, 0, 1) : 0);
            return {
                stageIndex: index,
                stageId: stage.id,
                stageTitle: stage.title,
                state: index < activeStageIndex ? "complete" : (isActive ? (state.active ? "active" : "ready") : "pending"),
                progress,
                finite: Number.isFinite(progress),
                active: isActive,
                preset: stage.preset,
                hotspotId: stage.hotspotId,
                eventPreset: this.getRecipeString(stage.recipeOverrides, "multiMessengerEventPreset", "none"),
                substrateDensityProfile: this.getRecipeString(stage.recipeOverrides, "substrateDensityProfile", "standard"),
                verificationStatus: isActive ? verification.status : "not-run",
                operatorCue: stage.operatorCue,
                expectedMotion: stage.expectedMotion
            };
        });
        return {
            activeStageIndex,
            stageCount: stages.length,
            finite: entries.every((entry: DarkMatterDriveDemoFlightTimelineEntry): boolean => entry.finite),
            entries
        };
    }

    private getRecipeString(values: Readonly<Record<string, number | string | boolean>>, key: string, fallback: string): string {
        const value: number | string | boolean | undefined = values[key];
        return typeof value === "string" ? value : fallback;
    }

    private getSafeIndex(value: number, stageCount: number): number {
        if (stageCount <= 0) {
            return 0;
        }
        return Math.min(stageCount - 1, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
    }
}
