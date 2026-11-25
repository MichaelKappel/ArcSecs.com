export interface DarkMatterDriveMotionDirectorInput {
    readonly running: boolean;
    readonly tick: number;
    readonly simulationTimeSeconds: number;
    readonly driveCharge: number;
    readonly driveOutput: number;
    readonly mediumDensityMultiplier: number;
}

export interface DarkMatterDriveMotionDirectorFrameState {
    readonly motionMode: "preview" | "running";
    readonly routeProgress: number;
    readonly tetherRotationRadians: number;
    readonly capturePacketProgress: readonly number[];
    readonly plumeLengthNormalized: number;
    readonly gravityWavefrontRadiusNormalized: number;
    readonly photonWavefrontRadiusNormalized: number;
    readonly photonFadingNormalized: number;
    readonly finite: boolean;
}

export class DarkMatterDriveMotionDirector {
    public createFrameState(input: DarkMatterDriveMotionDirectorInput): DarkMatterDriveMotionDirectorFrameState {
        const phase: number = this.getFiniteNumber(input.tick, 0) * 0.055 + this.getFiniteNumber(input.simulationTimeSeconds, 0) * 0.45;
        const driveCharge: number = this.clamp(this.getFiniteNumber(input.driveCharge, 0), 0, 1);
        const driveOutput: number = this.clamp(this.getFiniteNumber(input.driveOutput, 0), 0, 3);
        const mediumDensityMultiplier: number = this.clamp(this.getFiniteNumber(input.mediumDensityMultiplier, 1), 0.1, 8);
        const routeRate: number = input.running ? 0.045 : 0.018;
        const routeProgress: number = this.unitWrap(phase * routeRate);
        const capturePacketProgress: number[] = [];

        for (let index: number = 0; index < 22; index += 1) {
            capturePacketProgress.push(this.unitWrap(index / 22 + phase * (0.032 + mediumDensityMultiplier * 0.003)));
        }

        const plumeLengthNormalized: number = this.clamp(0.18 + driveCharge * 0.42 + driveOutput * 0.18, 0.18, 1);
        const gravityWavefrontRadiusNormalized: number = this.unitWrap(phase * 0.24);
        const photonWavefrontRadiusNormalized: number = this.unitWrap(phase * 0.16);
        const photonFadingNormalized: number = this.clamp(1 - mediumDensityMultiplier * 0.08, 0.18, 1);
        const values: readonly number[] = [
            phase,
            driveCharge,
            driveOutput,
            mediumDensityMultiplier,
            routeProgress,
            plumeLengthNormalized,
            gravityWavefrontRadiusNormalized,
            photonWavefrontRadiusNormalized,
            photonFadingNormalized,
            ...capturePacketProgress
        ];

        return {
            motionMode: input.running ? "running" : "preview",
            routeProgress,
            tetherRotationRadians: phase * 0.7,
            capturePacketProgress,
            plumeLengthNormalized,
            gravityWavefrontRadiusNormalized,
            photonWavefrontRadiusNormalized,
            photonFadingNormalized,
            finite: values.every((value: number): boolean => Number.isFinite(value))
        };
    }

    private getFiniteNumber(value: number, fallback: number): number {
        return Number.isFinite(value) ? value : fallback;
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }

    private unitWrap(value: number): number {
        const wrapped: number = value % 1;
        return wrapped < 0 ? wrapped + 1 : wrapped;
    }
}
