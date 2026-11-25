export interface DarkMatterDriveAutopilotStage {
    readonly id: string;
    readonly title: string;
    readonly preset: string;
    readonly hotspotId: string;
    readonly durationTicks: number;
    readonly operatorCue: string;
    readonly expectedMotion: string;
    readonly recipeOverrides: Readonly<Record<string, number | string | boolean>>;
}

export interface DarkMatterDriveAutopilotState {
    readonly active: boolean;
    readonly stageIndex: number;
    readonly stageCount: number;
    readonly elapsedTicks: number;
    readonly durationTicks: number;
    readonly progress: number;
    readonly finite: boolean;
    readonly stage: DarkMatterDriveAutopilotStage | null;
}

export class DarkMatterDriveAutopilotDirector {
    private readonly stages: readonly DarkMatterDriveAutopilotStage[];
    private active: boolean;
    private stageIndex: number;
    private stageStartTick: number;
    private lastAppliedStageId: string;

    public constructor(stages: readonly DarkMatterDriveAutopilotStage[]) {
        this.stages = stages.slice();
        this.active = false;
        this.stageIndex = 0;
        this.stageStartTick = 0;
        this.lastAppliedStageId = "";
    }

    public start(currentTick: number): DarkMatterDriveAutopilotState {
        this.active = true;
        this.stageIndex = 0;
        this.stageStartTick = this.getTick(currentTick);
        this.lastAppliedStageId = "";
        return this.getState(currentTick);
    }

    public stop(currentTick: number): DarkMatterDriveAutopilotState {
        this.active = false;
        return this.getState(currentTick);
    }

    public next(currentTick: number): DarkMatterDriveAutopilotState {
        this.stageIndex = this.stages.length > 0 ? (this.stageIndex + 1) % this.stages.length : 0;
        this.stageStartTick = this.getTick(currentTick);
        this.lastAppliedStageId = "";
        return this.getState(currentTick);
    }

    public jumpTo(stageIndex: number, currentTick: number): DarkMatterDriveAutopilotState {
        const safeStageIndex: number = Math.max(0, Math.round(Number.isFinite(stageIndex) ? stageIndex : 0));
        this.stageIndex = this.stages.length > 0 ? this.clamp(safeStageIndex, 0, this.stages.length - 1) : 0;
        this.stageStartTick = this.getTick(currentTick);
        this.lastAppliedStageId = "";
        return this.getState(currentTick);
    }

    public shouldAdvance(currentTick: number): boolean {
        const state: DarkMatterDriveAutopilotState = this.getState(currentTick);
        return state.active && state.elapsedTicks >= state.durationTicks;
    }

    public needsApply(stageId: string): boolean {
        return this.lastAppliedStageId !== stageId;
    }

    public markApplied(stageId: string): void {
        this.lastAppliedStageId = stageId;
    }

    public getState(currentTick: number): DarkMatterDriveAutopilotState {
        const stage: DarkMatterDriveAutopilotStage | null = this.stages[this.stageIndex] ?? null;
        const tick: number = this.getTick(currentTick);
        const durationTicks: number = Math.max(30, Math.round(stage?.durationTicks ?? 1));
        const elapsedTicks: number = Math.max(0, tick - this.stageStartTick);
        const progress: number = this.clamp(elapsedTicks / durationTicks, 0, 1);

        return {
            active: this.active,
            stageIndex: this.stageIndex,
            stageCount: this.stages.length,
            elapsedTicks,
            durationTicks,
            progress,
            finite: Number.isFinite(elapsedTicks) && Number.isFinite(durationTicks) && Number.isFinite(progress),
            stage
        };
    }

    private getTick(value: number): number {
        return Math.max(0, Math.round(Number.isFinite(value) ? value : 0));
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
