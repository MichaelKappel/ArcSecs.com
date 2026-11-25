import type { DarkMatterDriveRecipe } from "./DarkMatterDriveState";

export interface DarkMatterDriveMissionStage {
    readonly id: string;
    readonly title: string;
    readonly preset: string;
    readonly hotspotId: string;
    readonly operatorAction: string;
    readonly expectedSignal: string;
    readonly warningMarker: string;
}

export interface DarkMatterDriveMissionReport {
    readonly reportType: "ArcSecs Dark Matter Drive Mission Sequencer Report";
    readonly missionIndex: number;
    readonly activeStage: DarkMatterDriveMissionStage;
    readonly missionStages: readonly DarkMatterDriveMissionStage[];
    readonly recipe: DarkMatterDriveRecipe;
    readonly warnings: readonly string[];
    readonly scientificBoundary: string;
}

export class DarkMatterDriveMissionSequencer {
    private currentIndex: number = 0;

    public constructor(private readonly stages: readonly DarkMatterDriveMissionStage[]) {
    }

    public getCurrentStage(): DarkMatterDriveMissionStage {
        return this.stages[this.currentIndex] ?? this.stages[0];
    }

    public moveNext(): DarkMatterDriveMissionStage {
        this.currentIndex = Math.min(this.stages.length - 1, this.currentIndex + 1);
        return this.getCurrentStage();
    }

    public moveBack(): DarkMatterDriveMissionStage {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        return this.getCurrentStage();
    }

    public setStage(index: number): DarkMatterDriveMissionStage {
        const roundedIndex: number = Number.isFinite(index) ? Math.round(index) : 0;
        this.currentIndex = Math.max(0, Math.min(this.stages.length - 1, roundedIndex));
        return this.getCurrentStage();
    }

    public createReport(recipe: DarkMatterDriveRecipe, warnings: readonly string[], scientificBoundary: string): DarkMatterDriveMissionReport {
        return {
            reportType: "ArcSecs Dark Matter Drive Mission Sequencer Report",
            missionIndex: this.currentIndex,
            activeStage: this.getCurrentStage(),
            missionStages: this.stages,
            recipe,
            warnings,
            scientificBoundary
        };
    }
}
