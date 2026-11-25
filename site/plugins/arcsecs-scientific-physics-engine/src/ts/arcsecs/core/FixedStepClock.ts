/** Immutable fixed-step clock used to decouple simulation ticks from rendering frames. */
export class FixedStepClock {
    private tickCountValue: number;
    private renderFrameCountValue: number;

    public readonly fixedStepSeconds: number;

    /**
     * Creates a deterministic clock.
     * @param fixedStepSeconds Simulation timestep in seconds.
     */
    public constructor(fixedStepSeconds: number) {
        if (!Number.isFinite(fixedStepSeconds) || fixedStepSeconds <= 0) {
            throw new Error("Fixed step must be a positive finite value.");
        }
        this.fixedStepSeconds = fixedStepSeconds;
        this.tickCountValue = 0;
        this.renderFrameCountValue = 0;
    }

    /** Advances the simulation by one exact physics tick. */
    public step(): number {
        this.tickCountValue += 1;
        return this.tickCountValue;
    }

    /**
     * Advances the simulation by a fixed number of ticks.
     * @param tickCount Number of deterministic ticks to advance.
     */
    public advance(tickCount: number): void {
        const acceptedTicks = Math.max(0, Math.trunc(tickCount));
        for (let index: number = 0; index < acceptedTicks; index += 1) {
            this.step();
        }
    }

    /** Records a render frame without changing the physics tick count. */
    public recordRenderFrame(): void {
        this.renderFrameCountValue += 1;
    }


    /** Resets physics ticks and render frame count to zero. */
    public reset(): void {
        this.tickCountValue = 0;
        this.renderFrameCountValue = 0;
    }

    /** Returns the immutable global physics tick count. */
    public get tickCount(): number {
        return this.tickCountValue;
    }

    /** Returns the number of rendered frames observed by the shell. */
    public get renderFrameCount(): number {
        return this.renderFrameCountValue;
    }

    /** Returns elapsed simulation seconds derived only from fixed ticks. */
    public get elapsedSimulationSeconds(): number {
        return this.tickCountValue * this.fixedStepSeconds;
    }
}
